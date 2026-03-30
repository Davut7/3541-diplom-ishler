const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const https = require('https')
const Store = require('electron-store')

const store = new Store()
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow

// VirusTotal API Key (user can set their own)
let VIRUSTOTAL_API_KEY = store.get('virustotalApiKey', '')

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
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, '../assets/icon.png')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:7040')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ============================================
// REAL FILE SCANNING FUNCTIONS
// ============================================

// Calculate file hashes (MD5, SHA1, SHA256)
function calculateHashes(filePath) {
  return new Promise((resolve, reject) => {
    const md5 = crypto.createHash('md5')
    const sha1 = crypto.createHash('sha1')
    const sha256 = crypto.createHash('sha256')

    const stream = fs.createReadStream(filePath)

    stream.on('data', (data) => {
      md5.update(data)
      sha1.update(data)
      sha256.update(data)
    })

    stream.on('end', () => {
      resolve({
        md5: md5.digest('hex'),
        sha1: sha1.digest('hex'),
        sha256: sha256.digest('hex')
      })
    })

    stream.on('error', reject)
  })
}

// Calculate file entropy (detects packed/encrypted files)
function calculateEntropy(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err)

      const byteFreq = new Array(256).fill(0)
      for (let i = 0; i < data.length; i++) {
        byteFreq[data[i]]++
      }

      let entropy = 0
      const len = data.length

      for (let i = 0; i < 256; i++) {
        if (byteFreq[i] > 0) {
          const p = byteFreq[i] / len
          entropy -= p * Math.log2(p)
        }
      }

      resolve({
        entropy: entropy.toFixed(4),
        isPacked: entropy > 7.0,
        isEncrypted: entropy > 7.5,
        interpretation: entropy > 7.5 ? 'Highly encrypted/compressed' :
                       entropy > 7.0 ? 'Likely packed or compressed' :
                       entropy > 6.0 ? 'Some compression detected' :
                       'Normal entropy'
      })
    })
  })
}

// Detect file type by magic bytes
function detectFileType(filePath) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.alloc(16)
    const fd = fs.openSync(filePath, 'r')
    fs.readSync(fd, buffer, 0, 16, 0)
    fs.closeSync(fd)

    const hex = buffer.toString('hex').toUpperCase()

    const signatures = {
      '4D5A': { type: 'PE Executable', ext: 'exe/dll', risk: 'high' },
      '7F454C46': { type: 'ELF Executable', ext: 'elf', risk: 'high' },
      '504B0304': { type: 'ZIP Archive', ext: 'zip', risk: 'medium' },
      '504B0506': { type: 'ZIP Archive (empty)', ext: 'zip', risk: 'low' },
      '526172211A07': { type: 'RAR Archive', ext: 'rar', risk: 'medium' },
      '1F8B08': { type: 'GZIP Archive', ext: 'gz', risk: 'medium' },
      '25504446': { type: 'PDF Document', ext: 'pdf', risk: 'medium' },
      'D0CF11E0': { type: 'MS Office (OLE)', ext: 'doc/xls', risk: 'medium' },
      '504B030414': { type: 'MS Office (OOXML)', ext: 'docx/xlsx', risk: 'low' },
      'CAFEBABE': { type: 'Java Class', ext: 'class', risk: 'high' },
      '7B5C727466': { type: 'RTF Document', ext: 'rtf', risk: 'medium' },
      '3C3F786D6C': { type: 'XML Document', ext: 'xml', risk: 'low' },
      '3C68746D6C': { type: 'HTML Document', ext: 'html', risk: 'low' },
      '89504E47': { type: 'PNG Image', ext: 'png', risk: 'low' },
      'FFD8FFE0': { type: 'JPEG Image', ext: 'jpg', risk: 'low' },
      '47494638': { type: 'GIF Image', ext: 'gif', risk: 'low' }
    }

    for (const [sig, info] of Object.entries(signatures)) {
      if (hex.startsWith(sig)) {
        return resolve(info)
      }
    }

    resolve({ type: 'Unknown', ext: 'unknown', risk: 'unknown' })
  })
}

// Scan for suspicious strings/patterns
function scanSuspiciousPatterns(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err)

      const content = data.toString('utf8', 0, Math.min(data.length, 1024 * 1024)) // First 1MB
      const findings = []

      const suspiciousPatterns = [
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
        { pattern: /password/gi, name: 'Password Reference', severity: 'low' },
        { pattern: /base64_decode/gi, name: 'Base64 Decoding', severity: 'medium' },
        { pattern: /eval\s*\(/gi, name: 'Dynamic Code Execution', severity: 'high' },
        { pattern: /exec\s*\(/gi, name: 'Command Execution', severity: 'high' },
        { pattern: /socket\s*\(/gi, name: 'Network Socket', severity: 'medium' },
        { pattern: /bind\s*\(\s*0\.0\.0\.0/gi, name: 'Network Binding', severity: 'high' },
        { pattern: /crypto/gi, name: 'Cryptography Usage', severity: 'low' },
        { pattern: /ransom/gi, name: 'Ransomware Reference', severity: 'critical' },
        { pattern: /bitcoin|btc|wallet/gi, name: 'Cryptocurrency Reference', severity: 'medium' },
        { pattern: /tor2web|\.onion/gi, name: 'Tor Network Reference', severity: 'high' },
        { pattern: /mimikatz/gi, name: 'Mimikatz Reference', severity: 'critical' },
        { pattern: /metasploit/gi, name: 'Metasploit Reference', severity: 'critical' }
      ]

      for (const { pattern, name, severity } of suspiciousPatterns) {
        const matches = content.match(pattern)
        if (matches) {
          findings.push({
            name,
            severity,
            count: matches.length
          })
        }
      }

      resolve(findings)
    })
  })
}

// Check hash against VirusTotal API
function checkVirusTotal(hash) {
  return new Promise((resolve, reject) => {
    if (!VIRUSTOTAL_API_KEY) {
      return resolve({ error: 'No API key configured', available: false })
    }

    const options = {
      hostname: 'www.virustotal.com',
      path: `/api/v3/files/${hash}`,
      method: 'GET',
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const result = JSON.parse(data)
            const stats = result.data?.attributes?.last_analysis_stats || {}
            resolve({
              available: true,
              found: true,
              stats: {
                malicious: stats.malicious || 0,
                suspicious: stats.suspicious || 0,
                harmless: stats.harmless || 0,
                undetected: stats.undetected || 0
              },
              reputation: result.data?.attributes?.reputation || 0,
              tags: result.data?.attributes?.tags || []
            })
          } else if (res.statusCode === 404) {
            resolve({ available: true, found: false, message: 'File not found in VirusTotal database' })
          } else {
            resolve({ available: false, error: `API error: ${res.statusCode}` })
          }
        } catch (e) {
          resolve({ available: false, error: e.message })
        }
      })
    })

    req.on('error', (e) => resolve({ available: false, error: e.message }))
    req.setTimeout(10000, () => {
      req.destroy()
      resolve({ available: false, error: 'Request timeout' })
    })
    req.end()
  })
}

// ============================================
// IPC HANDLERS
// ============================================

// Open file dialog
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'All Files', extensions: ['*'] }]
  })

  if (result.canceled) return null
  return result.filePaths[0]
})

// Open folder dialog
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })

  if (result.canceled) return null
  return result.filePaths[0]
})

// Scan single file
ipcMain.handle('scan-file', async (event, filePath) => {
  try {
    const stats = fs.statSync(filePath)

    // Send progress updates
    event.sender.send('scan-progress', { step: 'hashes', progress: 10 })
    const hashes = await calculateHashes(filePath)

    event.sender.send('scan-progress', { step: 'entropy', progress: 30 })
    const entropy = await calculateEntropy(filePath)

    event.sender.send('scan-progress', { step: 'filetype', progress: 50 })
    const fileType = await detectFileType(filePath)

    event.sender.send('scan-progress', { step: 'patterns', progress: 70 })
    const patterns = await scanSuspiciousPatterns(filePath)

    event.sender.send('scan-progress', { step: 'virustotal', progress: 85 })
    const virusTotal = await checkVirusTotal(hashes.sha256)

    event.sender.send('scan-progress', { step: 'complete', progress: 100 })

    // Calculate threat score
    let threatScore = 0

    // Entropy-based score
    if (entropy.isEncrypted) threatScore += 25
    else if (entropy.isPacked) threatScore += 15

    // File type risk
    if (fileType.risk === 'critical') threatScore += 30
    else if (fileType.risk === 'high') threatScore += 20
    else if (fileType.risk === 'medium') threatScore += 10

    // Pattern-based score
    for (const p of patterns) {
      if (p.severity === 'critical') threatScore += 20
      else if (p.severity === 'high') threatScore += 10
      else if (p.severity === 'medium') threatScore += 5
    }

    // VirusTotal score
    if (virusTotal.found && virusTotal.stats) {
      if (virusTotal.stats.malicious > 0) {
        threatScore += Math.min(50, virusTotal.stats.malicious * 5)
      }
    }

    threatScore = Math.min(100, threatScore)

    let status = 'clean'
    if (threatScore >= 70) status = 'malware'
    else if (threatScore >= 40) status = 'suspicious'
    else if (threatScore >= 20) status = 'potentially_unwanted'

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
        virusTotal,
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

  function walkDir(dir) {
    try {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        const fullPath = path.join(dir, item)
        try {
          const stat = fs.statSync(fullPath)
          if (stat.isDirectory()) {
            walkDir(fullPath)
          } else {
            files.push(fullPath)
          }
        } catch (e) { /* skip inaccessible files */ }
      }
    } catch (e) { /* skip inaccessible directories */ }
  }

  walkDir(folderPath)

  for (let i = 0; i < files.length; i++) {
    event.sender.send('folder-scan-progress', {
      current: i + 1,
      total: files.length,
      file: path.basename(files[i])
    })

    try {
      const hashes = await calculateHashes(files[i])
      const entropy = await calculateEntropy(files[i])
      const fileType = await detectFileType(files[i])

      let threatScore = 0
      if (entropy.isPacked) threatScore += 15
      if (fileType.risk === 'high') threatScore += 20

      results.push({
        fileName: path.basename(files[i]),
        filePath: files[i],
        sha256: hashes.sha256,
        entropy: entropy.entropy,
        fileType: fileType.type,
        threatScore
      })
    } catch (e) { /* skip files that can't be scanned */ }
  }

  return { success: true, results, totalFiles: files.length }
})

// Settings
ipcMain.handle('get-settings', () => {
  return {
    virustotalApiKey: VIRUSTOTAL_API_KEY ? '••••••••' + VIRUSTOTAL_API_KEY.slice(-4) : '',
    hasApiKey: !!VIRUSTOTAL_API_KEY
  }
})

ipcMain.handle('set-virustotal-key', (event, key) => {
  VIRUSTOTAL_API_KEY = key
  store.set('virustotalApiKey', key)
  return { success: true }
})

// Get scan history
ipcMain.handle('get-history', () => {
  return store.get('scanHistory', [])
})

// Save to history
ipcMain.handle('save-to-history', (event, scan) => {
  const history = store.get('scanHistory', [])
  history.unshift(scan)
  if (history.length > 100) history.pop()
  store.set('scanHistory', history)
  return { success: true }
})

// Clear history
ipcMain.handle('clear-history', () => {
  store.set('scanHistory', [])
  return { success: true }
})

// Open file location
ipcMain.handle('open-file-location', (event, filePath) => {
  shell.showItemInFolder(filePath)
})

// ============================================
// SYSTEM SCAN FUNCTIONS
// ============================================

// Get system scan paths based on scan type
function getSystemScanPaths(scanType) {
  const homeDir = require('os').homedir()

  if (scanType === 'quick') {
    // Quick scan - common locations where malware hides
    return [
      path.join(homeDir, 'Downloads'),
      path.join(homeDir, 'Desktop'),
      '/tmp',
      path.join(homeDir, 'Library', 'LaunchAgents'),
      '/Library/LaunchAgents',
      '/Library/LaunchDaemons',
      path.join(homeDir, 'Library', 'Application Support'),
    ].filter(p => fs.existsSync(p))
  } else {
    // Full scan - entire user directory + applications
    return [
      homeDir,
      '/Applications',
      '/Library',
    ].filter(p => fs.existsSync(p))
  }
}

// Collect files for system scan
function collectSystemFiles(scanPaths, scanType, maxFiles) {
  const files = []
  const suspiciousExtensions = ['.exe', '.dll', '.scr', '.bat', '.cmd', '.ps1', '.vbs', '.js', '.jar', '.app', '.dmg', '.pkg', '.sh', '.command']
  const skipDirs = ['node_modules', '.git', 'cache', 'Cache', 'Caches', '.Trash', 'Logs']

  function walkDir(dir, depth = 0) {
    if (files.length >= maxFiles) return
    if (depth > (scanType === 'quick' ? 3 : 6)) return

    try {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        if (files.length >= maxFiles) return
        if (skipDirs.includes(item)) continue
        if (item.startsWith('.') && scanType === 'quick') continue

        const fullPath = path.join(dir, item)
        try {
          const stat = fs.statSync(fullPath)

          if (stat.isDirectory()) {
            walkDir(fullPath, depth + 1)
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase()
            const size = stat.size

            // Quick scan: only suspicious extensions and executables
            // Full scan: include more file types
            if (scanType === 'quick') {
              if (suspiciousExtensions.includes(ext) || size > 1024 * 1024 * 50) {
                files.push({ path: fullPath, size, ext })
              }
            } else {
              // Full scan: skip very small files and known safe extensions
              if (size > 1024 && !['.jpg', '.jpeg', '.png', '.gif', '.mp3', '.mp4', '.mov', '.wav'].includes(ext)) {
                files.push({ path: fullPath, size, ext })
              }
            }
          }
        } catch (e) { /* skip inaccessible */ }
      }
    } catch (e) { /* skip inaccessible */ }
  }

  for (const scanPath of scanPaths) {
    if (files.length >= maxFiles) break
    walkDir(scanPath)
  }

  return files
}

// System scan handler
let systemScanCancelled = false

ipcMain.handle('system-scan', async (event, scanType) => {
  systemScanCancelled = false
  const startTime = Date.now()
  const results = []
  const threats = []

  try {
    // Phase 1: Collecting paths
    event.sender.send('system-scan-progress', {
      phase: 'collecting',
      message: 'Collecting system paths...',
      progress: 5
    })

    const scanPaths = getSystemScanPaths(scanType)
    const maxFiles = scanType === 'quick' ? 500 : 5000

    // Phase 2: Discovering files
    event.sender.send('system-scan-progress', {
      phase: 'discovering',
      message: 'Discovering files...',
      progress: 10
    })

    const files = collectSystemFiles(scanPaths, scanType, maxFiles)
    const totalFiles = files.length

    event.sender.send('system-scan-progress', {
      phase: 'scanning',
      message: `Found ${totalFiles} files to scan`,
      progress: 15,
      totalFiles
    })

    // Phase 3: Scanning files
    for (let i = 0; i < files.length; i++) {
      if (systemScanCancelled) {
        return { success: false, cancelled: true }
      }

      const file = files[i]
      const progress = 15 + Math.floor((i / totalFiles) * 80)

      event.sender.send('system-scan-progress', {
        phase: 'scanning',
        message: `Scanning: ${path.basename(file.path)}`,
        progress,
        current: i + 1,
        totalFiles,
        currentFile: file.path
      })

      try {
        const fileType = await detectFileType(file.path)
        let threatScore = 0
        let patterns = []

        // Calculate basic threat score
        if (fileType.risk === 'high') threatScore += 20
        else if (fileType.risk === 'medium') threatScore += 10

        // For suspicious files, do deeper analysis
        if (threatScore > 0 || ['.exe', '.dll', '.ps1', '.bat', '.js', '.vbs'].includes(file.ext)) {
          try {
            const entropy = await calculateEntropy(file.path)
            if (entropy.isPacked) threatScore += 15
            if (entropy.isEncrypted) threatScore += 25

            patterns = await scanSuspiciousPatterns(file.path)
            for (const p of patterns) {
              if (p.severity === 'critical') threatScore += 20
              else if (p.severity === 'high') threatScore += 10
              else if (p.severity === 'medium') threatScore += 5
            }
          } catch (e) { /* ignore */ }
        }

        threatScore = Math.min(100, threatScore)

        let status = 'clean'
        if (threatScore >= 70) status = 'malware'
        else if (threatScore >= 40) status = 'suspicious'
        else if (threatScore >= 20) status = 'potentially_unwanted'

        const result = {
          fileName: path.basename(file.path),
          filePath: file.path,
          fileSize: file.size,
          fileSizeFormatted: formatFileSize(file.size),
          fileType,
          threatScore,
          status,
          patterns
        }

        results.push(result)

        if (threatScore >= 20) {
          threats.push(result)
          event.sender.send('system-scan-threat', result)
        }

      } catch (e) { /* skip file */ }
    }

    // Phase 4: Complete
    const duration = Math.round((Date.now() - startTime) / 1000)

    event.sender.send('system-scan-progress', {
      phase: 'complete',
      message: 'Scan complete',
      progress: 100
    })

    return {
      success: true,
      scanType,
      totalScanned: results.length,
      threatsFound: threats.length,
      threats,
      duration,
      scanPaths
    }

  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Cancel system scan
ipcMain.handle('cancel-system-scan', () => {
  systemScanCancelled = true
  return { success: true }
})

// Get system info for scan
ipcMain.handle('get-system-info', () => {
  const os = require('os')
  return {
    platform: os.platform(),
    hostname: os.hostname(),
    homeDir: os.homedir(),
    totalMemory: formatFileSize(os.totalmem()),
    freeMemory: formatFileSize(os.freemem()),
    cpus: os.cpus().length,
    arch: os.arch()
  }
})

// Helper functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
