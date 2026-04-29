const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const os = require('os')
const { execFile, fork } = require('child_process')
const Store = require('electron-store')

const store = new Store()
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow
let backendProcess = null

// Quarantine directory
const quarantineDir = path.join(app.getPath('userData'), 'quarantine')
if (!fs.existsSync(quarantineDir)) fs.mkdirSync(quarantineDir, { recursive: true })

// ============================================
// AUTO-START BACKEND SERVER
// ============================================

function getBackendPath() {
  if (isDev) {
    return path.join(__dirname, '..', 'backend', 'server.js')
  }
  // In packaged app, backend is in extraResources
  return path.join(process.resourcesPath, 'backend', 'server.js')
}

function startBackend() {
  const serverPath = getBackendPath()
  console.log('[Backend] Starting:', serverPath)

  if (!fs.existsSync(serverPath)) {
    console.error('[Backend] server.js not found at:', serverPath)
    return
  }

  backendProcess = fork(serverPath, [], {
    env: { ...process.env, ELECTRON_RUN: '1' },
    silent: true
  })

  backendProcess.stdout.on('data', (data) => console.log('[Backend]', data.toString().trim()))
  backendProcess.stderr.on('data', (data) => console.error('[Backend ERR]', data.toString().trim()))
  backendProcess.on('exit', (code) => {
    console.log('[Backend] Exited with code:', code)
    backendProcess = null
  })
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
    console.log('[Backend] Stopped')
  }
}

// ============================================
// ClamAV INTEGRATION
// ============================================

function findClamScanPath() {
  // First priority: bundled ClamAV in app resources
  const bundledPaths = isDev
    ? [path.join(__dirname, '..', 'clamav', 'clamscan.exe'), path.join(__dirname, '..', 'clamav', 'clamscan')]
    : [path.join(process.resourcesPath, 'clamav', 'clamscan.exe'), path.join(process.resourcesPath, 'clamav', 'clamscan')]

  // Then system-installed ClamAV
  const systemPaths = process.platform === 'win32'
    ? [
        'C:\\Program Files\\ClamAV\\clamscan.exe',
        'C:\\Program Files (x86)\\ClamAV\\clamscan.exe',
        path.join(os.homedir(), 'scoop', 'apps', 'clamav', 'current', 'clamscan.exe'),
      ]
    : [
        '/usr/bin/clamscan',
        '/usr/local/bin/clamscan',
        '/opt/homebrew/bin/clamscan',
      ]

  const all = [...bundledPaths, ...systemPaths]
  for (const p of all) {
    try { if (fs.existsSync(p)) return p } catch (e) {}
  }
  return process.platform === 'win32' ? 'clamscan.exe' : 'clamscan'
}

let clamScanPath = findClamScanPath()
let clamAvailable = false

function checkClamAV() {
  return new Promise((resolve) => {
    execFile(clamScanPath, ['--version'], { timeout: 5000 }, (err, stdout) => {
      if (err) {
        console.log('[ClamAV] Not found:', err.message)
        clamAvailable = false
        resolve(false)
      } else {
        console.log('[ClamAV] Found:', stdout.trim())
        clamAvailable = true
        resolve(true)
      }
    })
  })
}

function clamScanFile(filePath) {
  return new Promise((resolve) => {
    if (!clamAvailable) return resolve({ available: false, infected: false, viruses: [] })

    const args = ['--no-summary', '--stdout']
    const bundledDb = path.join(path.dirname(clamScanPath), 'db')
    if (fs.existsSync(bundledDb)) args.push('--database=' + bundledDb)
    args.push(filePath)

    execFile(clamScanPath, args, { timeout: 60000 }, (err, stdout) => {
      const infected = err && err.code === 1
      const viruses = []
      if (stdout) {
        for (const line of stdout.split('\n')) {
          const match = line.match(/:\s+(.+)\s+FOUND$/i)
          if (match) viruses.push(match[1].trim())
        }
      }
      resolve({ available: true, infected: infected || viruses.length > 0, viruses })
    })
  })
}

// ============================================
// AUTO-DOWNLOAD ClamAV on first run
// ============================================

function getClamAvDir() {
  // Store ClamAV in app's persistent userData so it survives updates
  return path.join(app.getPath('userData'), 'clamav')
}

function findClamScanPathFull() {
  const userDataClam = getClamAvDir()
  const exe = process.platform === 'win32' ? 'clamscan.exe' : 'clamscan'

  // 1. userData (auto-downloaded)
  const udPath = path.join(userDataClam, exe)
  if (fs.existsSync(udPath)) return udPath

  // 2. Bundled in resources
  const resPath = isDev
    ? path.join(__dirname, '..', 'clamav', exe)
    : path.join(process.resourcesPath, 'clamav', exe)
  if (fs.existsSync(resPath)) return resPath

  // 3. System-installed
  const sysPaths = process.platform === 'win32'
    ? ['C:\\Program Files\\ClamAV\\clamscan.exe', 'C:\\Program Files (x86)\\ClamAV\\clamscan.exe']
    : ['/usr/bin/clamscan', '/usr/local/bin/clamscan', '/opt/homebrew/bin/clamscan']
  for (const p of sysPaths) { try { if (fs.existsSync(p)) return p } catch (e) {} }

  return null
}

// Download a file with progress
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const https = require('https')
    const http = require('http')
    const proto = url.startsWith('https') ? https : http

    const doRequest = (reqUrl) => {
      proto.get(reqUrl, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doRequest(res.headers.location)
        }
        if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode))

        const total = parseInt(res.headers['content-length'] || '0', 10)
        let downloaded = 0
        const file = fs.createWriteStream(dest)

        res.on('data', (chunk) => {
          downloaded += chunk.length
          file.write(chunk)
          if (total > 0 && mainWindow) {
            mainWindow.webContents.send('setup-progress', {
              phase: 'downloading',
              file: path.basename(dest),
              percent: Math.round((downloaded / total) * 100),
              downloaded,
              total
            })
          }
        })

        res.on('end', () => { file.end(); resolve() })
        res.on('error', reject)
      }).on('error', reject)
    }

    doRequest(url)
  })
}

// Extract zip file
function extractZip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    // Use Node.js built-in zlib + tar, or for .zip use adm-zip or unzip command
    const { execFile: ef } = require('child_process')

    if (process.platform === 'win32') {
      // PowerShell Expand-Archive
      ef('powershell', ['-Command', `Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force`], { timeout: 120000 }, (err) => {
        if (err) reject(err); else resolve()
      })
    } else {
      ef('unzip', ['-o', zipPath, '-d', destDir], { timeout: 120000 }, (err) => {
        if (err) reject(err); else resolve()
      })
    }
  })
}

async function autoSetupClamAV() {
  const clamDir = getClamAvDir()
  const exe = process.platform === 'win32' ? 'clamscan.exe' : 'clamscan'
  const clamExe = path.join(clamDir, exe)
  const dbDir = path.join(clamDir, 'db')

  // Already set up?
  if (fs.existsSync(clamExe) && fs.existsSync(path.join(dbDir, 'main.cvd'))) {
    console.log('[ClamAV] Already installed in userData')
    clamScanPath = clamExe
    return true
  }

  console.log('[ClamAV] Auto-setup starting...')
  fs.mkdirSync(clamDir, { recursive: true })
  fs.mkdirSync(dbDir, { recursive: true })

  try {
    // Step 1: Download ClamAV portable
    if (!fs.existsSync(clamExe)) {
      if (mainWindow) mainWindow.webContents.send('setup-progress', { phase: 'status', message: 'Downloading ClamAV engine...' })

      const version = '1.4.2'
      let zipUrl, zipName

      if (process.platform === 'win32') {
        zipUrl = `https://www.clamav.net/downloads/production/clamav-${version}.win.x64.zip`
        zipName = `clamav-${version}.win.x64.zip`
      } else if (process.platform === 'darwin') {
        zipUrl = `https://www.clamav.net/downloads/production/clamav-${version}.mac.universal.pkg`
        zipName = `clamav-${version}.mac.pkg`
      } else {
        // Linux — usually installed via package manager
        console.log('[ClamAV] On Linux, install via: sudo apt install clamav')
        return false
      }

      const zipPath = path.join(clamDir, zipName)

      if (!fs.existsSync(zipPath)) {
        await downloadFile(zipUrl, zipPath)
      }

      // Extract
      if (mainWindow) mainWindow.webContents.send('setup-progress', { phase: 'status', message: 'Extracting ClamAV...' })

      if (process.platform === 'win32') {
        await extractZip(zipPath, clamDir)

        // Move files from nested directory to clamDir root
        const extracted = path.join(clamDir, `clamav-${version}.win.x64`)
        if (fs.existsSync(extracted)) {
          const files = fs.readdirSync(extracted)
          for (const f of files) {
            const src = path.join(extracted, f)
            const dst = path.join(clamDir, f)
            try { fs.renameSync(src, dst) } catch (e) { try { fs.copyFileSync(src, dst) } catch (e2) {} }
          }
          try { fs.rmSync(extracted, { recursive: true }) } catch (e) {}
        }
      }

      // Clean up zip
      try { fs.unlinkSync(zipPath) } catch (e) {}
    }

    // Step 2: Download virus databases using bundled freshclam
    const hasMainCvd = fs.existsSync(path.join(dbDir, 'main.cvd'))
    if (!hasMainCvd) {
      if (mainWindow) mainWindow.webContents.send('setup-progress', { phase: 'status', message: 'Downloading virus databases via freshclam (~300MB)...' })
      console.log('[ClamAV] Running freshclam to download databases...')

      const freshclamExe = path.join(clamDir, process.platform === 'win32' ? 'freshclam.exe' : 'freshclam')
      if (fs.existsSync(freshclamExe)) {
        // Create freshclam config
        const confPath = path.join(clamDir, 'freshclam.conf')
        fs.writeFileSync(confPath, `DatabaseMirror database.clamav.net\nDatabaseDirectory ${dbDir}\n`)

        await new Promise((resolve) => {
          execFile(freshclamExe, ['--config-file=' + confPath], { timeout: 600000 }, (err, stdout, stderr) => {
            console.log('[freshclam]', stdout || stderr || (err ? err.message : 'done'))
            resolve()
          })
        })
      } else {
        // Fallback: try system freshclam
        await new Promise((resolve) => {
          const confPath = path.join(clamDir, 'freshclam.conf')
          fs.writeFileSync(confPath, `DatabaseMirror database.clamav.net\nDatabaseDirectory ${dbDir}\n`)
          execFile('freshclam', ['--config-file=' + confPath], { timeout: 600000 }, (err, stdout, stderr) => {
            console.log('[freshclam fallback]', stdout || stderr || (err ? err.message : 'done'))
            resolve()
          })
        })
      }
    }

    if (mainWindow) mainWindow.webContents.send('setup-progress', { phase: 'done', message: 'ClamAV ready!' })

    clamScanPath = clamExe
    console.log('[ClamAV] Auto-setup complete:', clamExe)
    return true

  } catch (err) {
    console.error('[ClamAV] Auto-setup failed:', err.message)
    if (mainWindow) mainWindow.webContents.send('setup-progress', { phase: 'error', message: 'ClamAV setup failed: ' + err.message })
    return false
  }
}

// IPC for setup progress (frontend can listen)
ipcMain.handle('setup-clamav', async () => {
  const result = await autoSetupClamAV()
  if (result) {
    clamAvailable = true
    clamScanPath = findClamScanPathFull() || clamScanPath
  }
  return { success: result, available: clamAvailable, path: clamScanPath }
})

ipcMain.handle('get-clamav-setup-status', () => {
  const clamDir = getClamAvDir()
  const exe = process.platform === 'win32' ? 'clamscan.exe' : 'clamscan'
  const hasExe = fs.existsSync(path.join(clamDir, exe))
  const hasDb = fs.existsSync(path.join(clamDir, 'db', 'main.cvd'))
  return { installed: hasExe && hasDb, hasExe, hasDb, available: clamAvailable }
})

// ============================================
// WINDOW
// ============================================

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: path.join(__dirname, '../assets/icon.png')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:7040')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'))
  }
}

app.whenReady().then(async () => {
  // Start backend server automatically
  startBackend()

  // Wait for backend to be ready
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Try to find ClamAV
  const found = findClamScanPathFull()
  if (found) clamScanPath = found
  await checkClamAV()

  createWindow()

  // If ClamAV not available, try auto-download in background
  if (!clamAvailable) {
    console.log('[ClamAV] Not found locally, will try auto-setup after window loads...')
    mainWindow.webContents.on('did-finish-load', async () => {
      const result = await autoSetupClamAV()
      if (result) {
        const newPath = findClamScanPathFull()
        if (newPath) clamScanPath = newPath
        await checkClamAV()
        console.log('[ClamAV] Auto-setup result:', clamAvailable)
      }
    })
  }
})

app.on('window-all-closed', () => {
  stopBackend()
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  stopBackend()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

function calculateHashes(filePath) {
  return new Promise((resolve, reject) => {
    const md5 = crypto.createHash('md5')
    const sha1 = crypto.createHash('sha1')
    const sha256 = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)
    stream.on('data', (data) => { md5.update(data); sha1.update(data); sha256.update(data) })
    stream.on('end', () => resolve({ md5: md5.digest('hex'), sha1: sha1.digest('hex'), sha256: sha256.digest('hex') }))
    stream.on('error', reject)
  })
}

function calculateEntropy(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err)
      if (!data.length) return resolve({ entropy: 0, isPacked: false, isEncrypted: false, interpretation: 'Empty' })
      const freq = new Array(256).fill(0)
      for (let i = 0; i < data.length; i++) freq[data[i]]++
      let entropy = 0
      for (let i = 0; i < 256; i++) { if (freq[i] > 0) { const p = freq[i] / data.length; entropy -= p * Math.log2(p) } }
      resolve({
        entropy: entropy.toFixed(4),
        isPacked: entropy > 7.0,
        isEncrypted: entropy > 7.5,
        interpretation: entropy > 7.5 ? 'Highly encrypted/compressed' : entropy > 7.0 ? 'Likely packed' : entropy > 6.0 ? 'Some compression' : 'Normal'
      })
    })
  })
}

function detectFileType(filePath) {
  try {
    const buffer = Buffer.alloc(16)
    const fd = fs.openSync(filePath, 'r')
    fs.readSync(fd, buffer, 0, 16, 0)
    fs.closeSync(fd)
    const hex = buffer.toString('hex').toUpperCase()
    const sigs = {
      '4D5A': { type: 'PE Executable', ext: 'exe/dll', risk: 'high' },
      '7F454C46': { type: 'ELF Executable', ext: 'elf', risk: 'high' },
      '504B0304': { type: 'ZIP Archive', ext: 'zip', risk: 'medium' },
      '25504446': { type: 'PDF Document', ext: 'pdf', risk: 'medium' },
      'D0CF11E0': { type: 'MS Office (OLE)', ext: 'doc/xls', risk: 'medium' },
      'CAFEBABE': { type: 'Java Class', ext: 'class', risk: 'high' },
      '89504E47': { type: 'PNG Image', ext: 'png', risk: 'low' },
      'FFD8FF': { type: 'JPEG Image', ext: 'jpg', risk: 'low' },
      '47494638': { type: 'GIF Image', ext: 'gif', risk: 'low' }
    }
    for (const [sig, info] of Object.entries(sigs)) {
      if (hex.startsWith(sig)) return info
    }
  } catch (e) {}
  return { type: 'Unknown', ext: 'unknown', risk: 'unknown' }
}

function scanSuspiciousPatterns(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err)
      const content = data.toString('utf8', 0, Math.min(data.length, 1024 * 1024))
      const findings = []
      const patterns = [
        { pattern: /cmd\.exe/gi, name: 'Command Prompt Reference', severity: 'high' },
        { pattern: /powershell/gi, name: 'PowerShell Reference', severity: 'high' },
        { pattern: /WScript\.Shell/gi, name: 'Windows Script Host', severity: 'critical' },
        { pattern: /CreateRemoteThread/gi, name: 'Remote Thread Creation', severity: 'critical' },
        { pattern: /VirtualAllocEx/gi, name: 'Remote Memory Allocation', severity: 'critical' },
        { pattern: /WriteProcessMemory/gi, name: 'Process Memory Write', severity: 'critical' },
        { pattern: /ShellExecute/gi, name: 'Shell Execution', severity: 'high' },
        { pattern: /URLDownloadToFile/gi, name: 'File Download Function', severity: 'high' },
        { pattern: /RegSetValue/gi, name: 'Registry Modification', severity: 'medium' },
        { pattern: /HKEY_LOCAL_MACHINE/gi, name: 'System Registry Access', severity: 'medium' },
        { pattern: /keylogger/gi, name: 'Keylogger Reference', severity: 'critical' },
        { pattern: /eval\s*\(/gi, name: 'Dynamic Code Execution', severity: 'high' },
        { pattern: /ransom/gi, name: 'Ransomware Reference', severity: 'critical' },
        { pattern: /bitcoin|btc|wallet/gi, name: 'Cryptocurrency Reference', severity: 'medium' },
        { pattern: /\.onion/gi, name: 'Tor Network Reference', severity: 'high' },
        { pattern: /mimikatz/gi, name: 'Mimikatz Reference', severity: 'critical' },
        { pattern: /metasploit/gi, name: 'Metasploit Reference', severity: 'critical' }
      ]
      for (const { pattern, name, severity } of patterns) {
        const matches = content.match(pattern)
        if (matches) findings.push({ name, severity, count: matches.length })
      }
      resolve(findings)
    })
  })
}

// ============================================
// IPC HANDLERS
// ============================================

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ['openFile'], filters: [{ name: 'All Files', extensions: ['*'] }] })
  if (result.canceled) return null
  return result.filePaths[0]
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
  if (result.canceled) return null
  return result.filePaths[0]
})

// Scan single file (heuristic + ClamAV)
ipcMain.handle('scan-file', async (event, filePath) => {
  try {
    const stats = fs.statSync(filePath)

    event.sender.send('scan-progress', { step: 'hashes', progress: 10 })
    const hashes = await calculateHashes(filePath)

    event.sender.send('scan-progress', { step: 'entropy', progress: 25 })
    const entropy = await calculateEntropy(filePath)

    event.sender.send('scan-progress', { step: 'filetype', progress: 40 })
    const fileType = detectFileType(filePath)

    event.sender.send('scan-progress', { step: 'patterns', progress: 55 })
    const patterns = await scanSuspiciousPatterns(filePath)

    event.sender.send('scan-progress', { step: 'clamav', progress: 70 })
    const clamResult = await clamScanFile(filePath)

    event.sender.send('scan-progress', { step: 'scoring', progress: 90 })

    // Calculate threat score
    let threatScore = 0

    // ClamAV is the strongest signal
    if (clamResult.infected) {
      threatScore += 70
      for (const v of clamResult.viruses) {
        patterns.push({ name: 'ClamAV: ' + v, severity: 'critical', count: 1 })
      }
    }

    if (entropy.isEncrypted) threatScore += 25
    else if (entropy.isPacked) threatScore += 15

    if (fileType.risk === 'high') threatScore += 15
    else if (fileType.risk === 'medium') threatScore += 5

    for (const p of patterns) {
      if (p.name.startsWith('ClamAV:')) continue
      if (p.severity === 'critical') threatScore += 15
      else if (p.severity === 'high') threatScore += 8
      else if (p.severity === 'medium') threatScore += 3
    }

    threatScore = Math.min(100, threatScore)

    let status = 'clean'
    if (threatScore >= 70) status = 'malware'
    else if (threatScore >= 40) status = 'suspicious'
    else if (threatScore >= 20) status = 'potentially_unwanted'

    event.sender.send('scan-progress', { step: 'complete', progress: 100 })

    return {
      success: true,
      result: {
        fileName: path.basename(filePath),
        filePath,
        fileSize: stats.size,
        fileSizeFormatted: formatFileSize(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
        hashes,
        entropy,
        fileType,
        patterns,
        clamav: { available: clamResult.available, infected: clamResult.infected, viruses: clamResult.viruses },
        threatScore,
        status,
        scannedAt: new Date().toISOString()
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Scan folder
ipcMain.handle('scan-folder', async (event, folderPath) => {
  const results = []
  const files = []

  function walkDir(dir, depth) {
    if (depth > 8) return
    try {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        if (['node_modules', '.git', '.Trash'].includes(item)) continue
        const fullPath = path.join(dir, item)
        try {
          const stat = fs.statSync(fullPath)
          if (stat.isDirectory()) walkDir(fullPath, depth + 1)
          else files.push(fullPath)
        } catch (e) {}
      }
    } catch (e) {}
  }

  walkDir(folderPath, 0)

  for (let i = 0; i < files.length; i++) {
    event.sender.send('folder-scan-progress', { current: i + 1, total: files.length, file: path.basename(files[i]) })
    try {
      const hashes = await calculateHashes(files[i])
      const entropy = await calculateEntropy(files[i])
      const fileType = detectFileType(files[i])
      const clamResult = await clamScanFile(files[i])

      let threatScore = 0
      if (clamResult.infected) threatScore += 70
      if (entropy.isPacked) threatScore += 15
      if (fileType.risk === 'high') threatScore += 15

      let status = 'clean'
      if (threatScore >= 70) status = 'malware'
      else if (threatScore >= 40) status = 'suspicious'

      results.push({
        fileName: path.basename(files[i]),
        filePath: files[i],
        sha256: hashes.sha256,
        entropy: entropy.entropy,
        fileType: fileType.type,
        threatScore,
        status,
        clamav: clamResult
      })
    } catch (e) {}
  }

  return { success: true, results, totalFiles: files.length }
})

// ============================================
// QUARANTINE & DELETE
// ============================================

ipcMain.handle('quarantine-file', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) return { success: false, error: 'File not found' }
    const fileName = path.basename(filePath)
    const dest = path.join(quarantineDir, Date.now() + '_' + fileName + '.quarantined')
    try { fs.renameSync(filePath, dest) } catch (e) { fs.copyFileSync(filePath, dest); fs.unlinkSync(filePath) }
    return { success: true, original: filePath, quarantined: dest }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) return { success: false, error: 'File not found' }
    fs.unlinkSync(filePath)
    return { success: true, deleted: filePath }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

ipcMain.handle('get-quarantine', async () => {
  try {
    const files = fs.readdirSync(quarantineDir).map(f => {
      const stat = fs.statSync(path.join(quarantineDir, f))
      return { name: f, size: stat.size, sizeFormatted: formatFileSize(stat.size), quarantinedAt: stat.mtime }
    })
    return { success: true, files }
  } catch (e) {
    return { success: true, files: [] }
  }
})

// ============================================
// SYSTEM SCAN (Cross-platform + ClamAV)
// ============================================

function getSystemScanPaths(scanType) {
  const home = os.homedir()
  const isWin = process.platform === 'win32'
  const tmp = os.tmpdir()

  if (scanType === 'quick') {
    if (isWin) {
      return [
        path.join(home, 'Downloads'),
        path.join(home, 'Desktop'),
        path.join(home, 'AppData', 'Local', 'Temp'),
        path.join(home, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
        tmp,
      ].filter(p => fs.existsSync(p))
    }
    return [
      path.join(home, 'Downloads'),
      path.join(home, 'Desktop'),
      tmp,
      path.join(home, 'Library', 'LaunchAgents'),
    ].filter(p => fs.existsSync(p))
  }
  // Full scan
  if (isWin) {
    return [
      path.join(home, 'Downloads'),
      path.join(home, 'Desktop'),
      path.join(home, 'Documents'),
      path.join(home, 'AppData', 'Local', 'Temp'),
      path.join(home, 'AppData', 'Roaming'),
      tmp,
    ].filter(p => fs.existsSync(p))
  }
  return [home].filter(p => fs.existsSync(p))
}

function collectSystemFiles(scanPaths, scanType, maxFiles) {
  const files = []
  const suspExts = ['.exe', '.dll', '.scr', '.bat', '.cmd', '.ps1', '.vbs', '.js', '.jar', '.app', '.dmg', '.pkg', '.sh', '.command', '.msi', '.docm', '.xlsm']
  const skipDirs = ['node_modules', '.git', 'cache', 'Cache', 'Caches', '.Trash', 'Logs', '.npm', '.vscode', '__pycache__']

  function walkDir(dir, depth) {
    if (files.length >= maxFiles || depth > (scanType === 'quick' ? 3 : 6)) return
    try {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        if (files.length >= maxFiles) return
        if (skipDirs.includes(item)) continue
        if (item.startsWith('.') && scanType === 'quick') continue
        const fullPath = path.join(dir, item)
        try {
          const stat = fs.statSync(fullPath)
          if (stat.isDirectory()) { walkDir(fullPath, depth + 1) }
          else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase()
            if (scanType === 'quick') {
              if (suspExts.includes(ext) || stat.size > 50 * 1024 * 1024) files.push({ path: fullPath, size: stat.size, ext })
            } else {
              if (stat.size > 1024 && !['.jpg', '.jpeg', '.png', '.gif', '.mp3', '.mp4', '.mov', '.wav'].includes(ext))
                files.push({ path: fullPath, size: stat.size, ext })
            }
          }
        } catch (e) {}
      }
    } catch (e) {}
  }

  for (const sp of scanPaths) { if (files.length < maxFiles) walkDir(sp, 0) }
  return files
}

let systemScanCancelled = false

ipcMain.handle('system-scan', async (event, scanType) => {
  systemScanCancelled = false
  const startTime = Date.now()
  const threats = []

  try {
    event.sender.send('system-scan-progress', { phase: 'collecting', message: 'Collecting system paths...', progress: 5 })
    const scanPaths = getSystemScanPaths(scanType)
    const maxFiles = scanType === 'quick' ? 500 : 5000

    event.sender.send('system-scan-progress', { phase: 'discovering', message: 'Discovering files...', progress: 10 })
    const files = collectSystemFiles(scanPaths, scanType, maxFiles)
    const totalFiles = files.length

    event.sender.send('system-scan-progress', { phase: 'scanning', message: `Found ${totalFiles} files to scan`, progress: 15, totalFiles })

    for (let i = 0; i < files.length; i++) {
      if (systemScanCancelled) return { success: false, cancelled: true }

      const file = files[i]
      const progress = 15 + Math.floor((i / totalFiles) * 80)

      event.sender.send('system-scan-progress', { phase: 'scanning', message: `Scanning: ${path.basename(file.path)}`, progress, current: i + 1, totalFiles, currentFile: file.path })

      try {
        const fileType = detectFileType(file.path)
        let threatScore = 0
        let patterns = []

        // ClamAV scan
        const clamResult = await clamScanFile(file.path)
        if (clamResult.infected) {
          threatScore += 70
          for (const v of clamResult.viruses) patterns.push({ name: 'ClamAV: ' + v, severity: 'critical', count: 1 })
        }

        if (fileType.risk === 'high') threatScore += 15
        else if (fileType.risk === 'medium') threatScore += 5

        // Deeper analysis for suspicious files
        if (threatScore > 0 || ['.exe', '.dll', '.ps1', '.bat', '.js', '.vbs'].includes(file.ext)) {
          try {
            const entropy = await calculateEntropy(file.path)
            if (entropy.isPacked) threatScore += 15
            if (entropy.isEncrypted) threatScore += 25
            const heurPatterns = await scanSuspiciousPatterns(file.path)
            for (const p of heurPatterns) {
              patterns.push(p)
              if (p.severity === 'critical') threatScore += 15
              else if (p.severity === 'high') threatScore += 8
              else if (p.severity === 'medium') threatScore += 3
            }
          } catch (e) {}
        }

        threatScore = Math.min(100, threatScore)
        let status = 'clean'
        if (threatScore >= 70) status = 'malware'
        else if (threatScore >= 40) status = 'suspicious'
        else if (threatScore >= 20) status = 'potentially_unwanted'

        if (threatScore >= 20) {
          const result = { fileName: path.basename(file.path), filePath: file.path, fileSize: file.size, fileSizeFormatted: formatFileSize(file.size), fileType, threatScore, status, patterns, clamav: clamResult }
          threats.push(result)
          event.sender.send('system-scan-threat', result)
        }
      } catch (e) {}
    }

    const duration = Math.round((Date.now() - startTime) / 1000)
    event.sender.send('system-scan-progress', { phase: 'complete', message: 'Scan complete', progress: 100 })

    return { success: true, scanType, totalScanned: files.length, threatsFound: threats.length, threats, duration, scanPaths, clamAvailable }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('cancel-system-scan', () => { systemScanCancelled = true; return { success: true } })

ipcMain.handle('get-system-info', () => ({
  platform: os.platform(),
  hostname: os.hostname(),
  homeDir: os.homedir(),
  totalMemory: formatFileSize(os.totalmem()),
  freeMemory: formatFileSize(os.freemem()),
  cpus: os.cpus().length,
  arch: os.arch(),
  clamav: clamAvailable
}))

// Settings
ipcMain.handle('get-settings', () => ({ clamav: clamAvailable, quarantineDir }))

// History
ipcMain.handle('get-history', () => store.get('scanHistory', []))
ipcMain.handle('save-to-history', (event, scan) => {
  const history = store.get('scanHistory', [])
  history.unshift(scan)
  if (history.length > 100) history.pop()
  store.set('scanHistory', history)
  return { success: true }
})
ipcMain.handle('clear-history', () => { store.set('scanHistory', []); return { success: true } })

ipcMain.handle('open-file-location', (event, filePath) => { shell.showItemInFolder(filePath) })

// ClamAV status
ipcMain.handle('get-clamav-status', () => ({ available: clamAvailable, path: clamAvailable ? clamScanPath : null }))

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
