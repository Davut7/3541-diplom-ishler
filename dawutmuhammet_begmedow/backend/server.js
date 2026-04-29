const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const os = require('os')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { execFile } = require('child_process')
const db = require('./utils/database')
const historyRoutes = require('./routes/history')

const app = express()
const PORT = 7041

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
const upload = multer({ dest: uploadDir, limits: { fileSize: 100 * 1024 * 1024 } })

// Quarantine directory
const quarantineDir = path.join(__dirname, 'quarantine')
if (!fs.existsSync(quarantineDir)) fs.mkdirSync(quarantineDir, { recursive: true })

app.use(cors())
app.use(express.json())
db.initDb()
app.use('/api/history', historyRoutes)

// ============================================
// ClamAV INTEGRATION
// ============================================

// Auto-detect clamscan binary path (bundled first, then system)
function findClamScanPath() {
  // Bundled ClamAV (inside Electron app resources or project root)
  const bundledPaths = [
    path.join(__dirname, '..', 'clamav', 'clamscan.exe'),
    path.join(__dirname, '..', 'clamav', 'clamscan'),
  ]
  // If running inside packaged Electron app
  if (process.resourcesPath) {
    bundledPaths.unshift(
      path.join(process.resourcesPath, 'clamav', 'clamscan.exe'),
      path.join(process.resourcesPath, 'clamav', 'clamscan')
    )
  }

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
        '/opt/local/bin/clamscan',
      ]

  const all = [...bundledPaths, ...systemPaths]
  for (const p of all) {
    try { if (fs.existsSync(p)) return p } catch (e) {}
  }
  return process.platform === 'win32' ? 'clamscan.exe' : 'clamscan'
}

let clamScanPath = findClamScanPath()
let clamAvailable = false

// Check if ClamAV is actually working
function checkClamAV() {
  return new Promise((resolve) => {
    execFile(clamScanPath, ['--version'], { timeout: 5000 }, (err, stdout) => {
      if (err) {
        console.log('[ClamAV] Not found or not working:', err.message)
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

// Scan a single file with ClamAV
function clamScanFile(filePath) {
  return new Promise((resolve) => {
    if (!clamAvailable) {
      return resolve({ available: false, infected: false, viruses: [] })
    }

    // Build args: point to bundled database if it exists
    const args = ['--no-summary', '--stdout']
    const bundledDb = path.join(path.dirname(clamScanPath), 'db')
    if (fs.existsSync(bundledDb)) args.push('--database=' + bundledDb)
    args.push(filePath)

    execFile(clamScanPath, args, { timeout: 60000 }, (err, stdout, stderr) => {
      // Exit code 1 = virus found, 0 = clean, 2 = error
      const infected = err && err.code === 1
      const viruses = []

      if (stdout) {
        // Parse output: "/path/to/file: VirusName FOUND"
        const lines = stdout.split('\n')
        for (const line of lines) {
          const match = line.match(/:\s+(.+)\s+FOUND$/i)
          if (match) {
            viruses.push(match[1].trim())
          }
        }
      }

      resolve({
        available: true,
        infected: infected || viruses.length > 0,
        viruses,
        raw: stdout ? stdout.trim() : ''
      })
    })
  })
}

// Scan directory with ClamAV (recursive)
function clamScanDirectory(dirPath) {
  return new Promise((resolve) => {
    if (!clamAvailable) {
      return resolve({ available: false, infected: [], total: 0 })
    }

    const args = ['-r', '--no-summary', '--stdout']
    const bundledDb = path.join(path.dirname(clamScanPath), 'db')
    if (fs.existsSync(bundledDb)) args.push('--database=' + bundledDb)
    args.push(dirPath)

    execFile(clamScanPath, args, { timeout: 300000, maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
      const infected = []

      if (stdout) {
        const lines = stdout.split('\n')
        for (const line of lines) {
          const match = line.match(/^(.+):\s+(.+)\s+FOUND$/i)
          if (match) {
            infected.push({ file: match[1].trim(), virus: match[2].trim() })
          }
        }
      }

      resolve({
        available: true,
        infected,
        total: infected.length
      })
    })
  })
}

// ============================================
// SIGNATURE DATABASE (local heuristic patterns)
// ============================================
const signaturesFile = path.join(__dirname, 'data', 'signatures.json')
let signatureDB = {
  lastUpdated: null, version: '1.0.0', knownHashes: [],
  suspiciousStrings: [
    { pattern: 'cmd.exe', name: 'Command Prompt Reference', severity: 'high', category: 'execution' },
    { pattern: 'powershell', name: 'PowerShell Reference', severity: 'high', category: 'execution' },
    { pattern: 'WScript.Shell', name: 'Windows Script Host', severity: 'critical', category: 'execution' },
    { pattern: 'CreateRemoteThread', name: 'Remote Thread Creation', severity: 'critical', category: 'injection' },
    { pattern: 'VirtualAllocEx', name: 'Remote Memory Allocation', severity: 'critical', category: 'injection' },
    { pattern: 'WriteProcessMemory', name: 'Process Memory Write', severity: 'critical', category: 'injection' },
    { pattern: 'NtCreateThreadEx', name: 'NT Thread Creation', severity: 'critical', category: 'injection' },
    { pattern: 'ShellExecute', name: 'Shell Execution', severity: 'high', category: 'execution' },
    { pattern: 'URLDownloadToFile', name: 'File Download', severity: 'high', category: 'network' },
    { pattern: 'InternetOpenUrl', name: 'Internet URL Access', severity: 'high', category: 'network' },
    { pattern: 'RegSetValue', name: 'Registry Modification', severity: 'medium', category: 'persistence' },
    { pattern: 'HKEY_LOCAL_MACHINE', name: 'System Registry Access', severity: 'medium', category: 'persistence' },
    { pattern: 'CurrentVersion\\\\Run', name: 'Autorun Registry Key', severity: 'critical', category: 'persistence' },
    { pattern: 'schtasks', name: 'Scheduled Task', severity: 'high', category: 'persistence' },
    { pattern: 'fromCharCode', name: 'String Obfuscation', severity: 'high', category: 'obfuscation' },
    { pattern: 'atob(', name: 'Base64 Decode', severity: 'medium', category: 'obfuscation' },
    { pattern: 'socket.connect', name: 'Network Socket Connect', severity: 'medium', category: 'network' },
    { pattern: 'ransomware', name: 'Ransomware Reference', severity: 'critical', category: 'ransomware' },
    { pattern: 'ransom note', name: 'Ransom Note Reference', severity: 'critical', category: 'ransomware' },
    { pattern: 'your files have been encrypted', name: 'Ransom Message', severity: 'critical', category: 'ransomware' },
    { pattern: 'bitcoin wallet', name: 'Bitcoin Wallet Reference', severity: 'high', category: 'ransomware' },
    { pattern: '.onion', name: 'Tor Network Reference', severity: 'high', category: 'c2' },
    { pattern: 'mimikatz', name: 'Mimikatz Reference', severity: 'critical', category: 'credential_theft' },
    { pattern: 'metasploit', name: 'Metasploit Reference', severity: 'critical', category: 'exploit_framework' },
    { pattern: 'cobaltstrike', name: 'Cobalt Strike Reference', severity: 'critical', category: 'c2' },
    { pattern: 'keylogger', name: 'Keylogger Pattern', severity: 'critical', category: 'spyware' },
    { pattern: 'GetClipboardData', name: 'Clipboard Access', severity: 'high', category: 'spyware' },
    { pattern: 'IsDebuggerPresent', name: 'Anti-Debug Check', severity: 'high', category: 'evasion' },
  ]
}

function loadSignatures() { try { if (fs.existsSync(signaturesFile)) { const d = JSON.parse(fs.readFileSync(signaturesFile, 'utf8')); signatureDB = { ...signatureDB, ...d } } } catch (e) {} }
function saveSignatures() { try { const d = path.dirname(signaturesFile); if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(signaturesFile, JSON.stringify(signatureDB, null, 2)) } catch (e) {} }
loadSignatures()

const fileTypes = { 'exe': { type: 'PE Executable', risk: 'high' }, 'dll': { type: 'DLL', risk: 'high' }, 'scr': { type: 'Screensaver', risk: 'high' }, 'com': { type: 'COM', risk: 'high' }, 'pif': { type: 'PIF', risk: 'high' }, 'sys': { type: 'Driver', risk: 'high' }, 'js': { type: 'JavaScript', risk: 'medium' }, 'vbs': { type: 'VBScript', risk: 'high' }, 'bat': { type: 'Batch', risk: 'medium' }, 'cmd': { type: 'Command', risk: 'medium' }, 'ps1': { type: 'PowerShell', risk: 'high' }, 'wsf': { type: 'WScript', risk: 'high' }, 'msi': { type: 'Installer', risk: 'medium' }, 'jar': { type: 'Java', risk: 'high' }, 'pdf': { type: 'PDF', risk: 'medium' }, 'doc': { type: 'Word Legacy', risk: 'medium' }, 'docx': { type: 'Word', risk: 'low' }, 'docm': { type: 'Word+Macros', risk: 'high' }, 'xls': { type: 'Excel Legacy', risk: 'medium' }, 'xlsx': { type: 'Excel', risk: 'low' }, 'xlsm': { type: 'Excel+Macros', risk: 'high' }, 'apk': { type: 'Android', risk: 'high' }, 'py': { type: 'Python', risk: 'medium' }, 'sh': { type: 'Shell', risk: 'medium' }, 'zip': { type: 'ZIP', risk: 'medium' }, 'rar': { type: 'RAR', risk: 'medium' }, 'png': { type: 'PNG', risk: 'low' }, 'jpg': { type: 'JPEG', risk: 'low' }, 'gif': { type: 'GIF', risk: 'low' }, 'txt': { type: 'Text', risk: 'low' } }

function formatSize(b) { if (!b) return '0 B'; const k = 1024, s = ['B','KB','MB','GB']; const i = Math.floor(Math.log(b)/Math.log(k)); return parseFloat((b/Math.pow(k,i)).toFixed(2))+' '+s[i] }

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

function calculateFileHashes(fp) { return new Promise((ok, fail) => { const m = crypto.createHash('md5'), s1 = crypto.createHash('sha1'), s2 = crypto.createHash('sha256'); const r = fs.createReadStream(fp); r.on('data', d => { m.update(d); s1.update(d); s2.update(d) }); r.on('end', () => ok({ md5: m.digest('hex'), sha1: s1.digest('hex'), sha256: s2.digest('hex') })); r.on('error', fail) }) }

function calculateFileEntropy(fp) { return new Promise((ok, fail) => { fs.readFile(fp, (err, data) => { if (err) return fail(err); if (!data.length) return ok({ entropy: 0, interpretation: 'Empty', isPacked: false, isEncrypted: false }); const freq = new Array(256).fill(0); for (let i = 0; i < data.length; i++) freq[data[i]]++; let e = 0; for (let i = 0; i < 256; i++) { if (freq[i] > 0) { const p = freq[i]/data.length; e -= p*Math.log2(p) } }; let interp = 'Normal', isPacked = false, isEncrypted = false; if (e > 7.5) { interp = 'Highly Packed/Encrypted'; isEncrypted = true; isPacked = true } else if (e > 7.0) { interp = 'Likely Packed'; isPacked = true } else if (e > 6.0) { interp = 'Some Compression' }; ok({ entropy: parseFloat(e.toFixed(4)), interpretation: interp, isPacked, isEncrypted }) }) }) }

function detectMagicBytes(fp) { try { const buf = Buffer.alloc(16), fd = fs.openSync(fp, 'r'); fs.readSync(fd, buf, 0, 16, 0); fs.closeSync(fd); const hex = buf.toString('hex').toUpperCase(); const sigs = { '4D5A': { type: 'PE Executable', risk: 'high' }, '7F454C46': { type: 'ELF', risk: 'high' }, '504B0304': { type: 'ZIP/Office', risk: 'medium' }, '25504446': { type: 'PDF', risk: 'medium' }, 'D0CF11E0': { type: 'MS Office OLE', risk: 'medium' }, 'CAFEBABE': { type: 'Java Class', risk: 'high' }, 'FEEDFACE': { type: 'Mach-O', risk: 'high' }, 'FEEDFACF': { type: 'Mach-O 64', risk: 'high' }, 'CEFAEDFE': { type: 'Mach-O rev', risk: 'high' }, '89504E47': { type: 'PNG', risk: 'low' }, 'FFD8FF': { type: 'JPEG', risk: 'low' } }; for (const [s, info] of Object.entries(sigs)) { if (hex.startsWith(s)) return info } } catch (e) {}; return null }

function scanFilePatterns(fp) { try { const data = fs.readFileSync(fp); const content = data.toString('utf8', 0, Math.min(data.length, 2*1024*1024)); const findings = []; for (const sig of signatureDB.suspiciousStrings) { try { const escaped = sig.pattern.replace(/[.*+?^${}()|[\]]/g, '\\$&'); const matches = content.match(new RegExp(escaped, 'gi')); if (matches) findings.push({ name: sig.name, severity: sig.severity, count: matches.length, category: sig.category }) } catch (e) {} }; return findings } catch (e) { return [] } }

function heuristicChecks(fp, fn) {
  const findings = []
  const parts = fn.split('.')
  if (parts.length > 2) {
    const last = parts[parts.length-1].toLowerCase(), prev = parts[parts.length-2].toLowerCase()
    if (['exe','bat','cmd','ps1','vbs','scr','com','pif'].includes(last) && ['pdf','doc','docx','xls','xlsx','jpg','png','txt','mp3','mp4'].includes(prev))
      findings.push({ name: 'Double Extension (Social Engineering)', severity: 'critical', count: 1, category: 'evasion' })
  }
  const ext = fn.split('.').pop().toLowerCase()
  if (fn.startsWith('.') && ['ps1','bat','exe','vbs','sh','py','js'].includes(ext))
    findings.push({ name: 'Hidden Script/Executable', severity: 'high', count: 1, category: 'evasion' })

  // Cross-platform suspicious locations
  if (['exe','bat','ps1','vbs','sh','cmd','scr'].includes(ext)) {
    const suspiciousLocations = process.platform === 'win32'
      ? ['\\Temp\\', '\\AppData\\Local\\Temp', '\\Startup\\', '\\Start Menu\\Programs\\Startup']
      : ['/tmp', '/var/tmp', 'LaunchAgents', 'LaunchDaemons']
    for (const loc of suspiciousLocations) {
      if (fp.includes(loc)) { findings.push({ name: 'Executable in ' + loc, severity: 'high', count: 1, category: 'evasion' }); break }
    }
  }
  return findings
}

// Combined analysis: heuristic + ClamAV
async function analyzeFile(fp, fn, sz) {
  const ext = fn.split('.').pop().toLowerCase()
  const ftByExt = fileTypes[ext] || { type: 'Unknown', risk: 'low' }
  const hashes = await calculateFileHashes(fp)
  const entropy = await calculateFileEntropy(fp)
  const magic = detectMagicBytes(fp)
  const ft = magic || ftByExt
  const patterns = scanFilePatterns(fp)
  const heuristics = heuristicChecks(fp, fn)
  const all = [...patterns, ...heuristics]

  // ClamAV scan
  const clamResult = await clamScanFile(fp)

  let hashMatch = false
  if (signatureDB.knownHashes.includes(hashes.sha256)) { hashMatch = true; all.push({ name: 'Known Malware Hash (SHA-256)', severity: 'critical', count: 1, category: 'signature' }) }

  // If ClamAV detected something, add it as a finding
  if (clamResult.infected) {
    for (const virus of clamResult.viruses) {
      all.push({ name: 'ClamAV: ' + virus, severity: 'critical', count: 1, category: 'clamav' })
    }
  }

  // Calculate threat score
  let ts = 0

  // ClamAV detection is the strongest signal
  if (clamResult.infected) ts += 70

  if (hashMatch) ts += 50
  if (entropy.isEncrypted) ts += 25; else if (entropy.isPacked) ts += 15

  const hasPatterns = all.length > 0
  if (hasPatterns) { if (ft.risk === 'high') ts += 10; else if (ft.risk === 'medium') ts += 5 }
  for (const p of all) {
    if (p.category === 'clamav') continue // already counted above
    if (p.severity === 'critical') ts += 15; else if (p.severity === 'high') ts += 8; else if (p.severity === 'medium') ts += 3
  }
  ts = Math.min(100, ts)

  let status = 'clean'
  if (ts >= 70) status = 'malware'
  else if (ts >= 40) status = 'suspicious'
  else if (ts >= 25) status = 'potentially_unwanted'

  return {
    id: uuidv4(), fileName: fn, filePath: fp, fileSize: sz || 0, fileSizeFormatted: formatSize(sz),
    fileType: ft, hashes, entropy, status, threatScore: ts, patterns: all,
    clamav: {
      available: clamResult.available,
      infected: clamResult.infected,
      viruses: clamResult.viruses || []
    },
    scannedAt: new Date().toISOString()
  }
}

// ============================================
// ENDPOINTS
// ============================================

app.post('/api/scan/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  try { const r = await analyzeFile(req.file.path, req.file.originalname, req.file.size); db.saveScan(r); res.json({ success: true, result: r }) }
  catch (e) { res.status(500).json({ error: e.message }) }
  finally { try { fs.unlinkSync(req.file.path) } catch (e) {} }
})

app.post('/api/scan/path', async (req, res) => {
  const { filePath } = req.body
  if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
  try { const s = fs.statSync(filePath); const r = await analyzeFile(filePath, path.basename(filePath), s.size); db.saveScan(r); res.json({ success: true, result: r }) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

// ============================================
// QUARANTINE & DELETE
// ============================================

app.post('/api/quarantine', (req, res) => {
  const { filePath } = req.body
  if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })

  try {
    const fileName = path.basename(filePath)
    const quarantineName = Date.now() + '_' + fileName + '.quarantined'
    const dest = path.join(quarantineDir, quarantineName)

    // Move file to quarantine (rename, or copy+delete if cross-device)
    try {
      fs.renameSync(filePath, dest)
    } catch (e) {
      fs.copyFileSync(filePath, dest)
      fs.unlinkSync(filePath)
    }

    res.json({ success: true, message: 'File quarantined', original: filePath, quarantined: dest })
  } catch (e) {
    res.status(500).json({ error: 'Failed to quarantine: ' + e.message })
  }
})

app.post('/api/delete', (req, res) => {
  const { filePath } = req.body
  if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })

  try {
    fs.unlinkSync(filePath)
    res.json({ success: true, message: 'File permanently deleted', path: filePath })
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete: ' + e.message })
  }
})

// List quarantined files
app.get('/api/quarantine', (req, res) => {
  try {
    const files = fs.readdirSync(quarantineDir).map(f => {
      const stat = fs.statSync(path.join(quarantineDir, f))
      return { name: f, size: stat.size, sizeFormatted: formatSize(stat.size), quarantinedAt: stat.mtime }
    })
    res.json({ success: true, files, total: files.length })
  } catch (e) {
    res.json({ success: true, files: [], total: 0 })
  }
})

// Delete from quarantine permanently
app.delete('/api/quarantine/:name', (req, res) => {
  const fp = path.join(quarantineDir, req.params.name)
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Not found' })
  try { fs.unlinkSync(fp); res.json({ success: true }) } catch (e) { res.status(500).json({ error: e.message }) }
})

// ============================================
// SYSTEM SCAN (Cross-platform)
// ============================================

function getSystemScanPaths(scanType) {
  const home = os.homedir()
  const isWin = process.platform === 'win32'
  const tmpDir = os.tmpdir()

  if (scanType === 'full') {
    if (isWin) {
      return [
        path.join(home, 'Downloads'),
        path.join(home, 'Desktop'),
        path.join(home, 'Documents'),
        path.join(home, 'AppData', 'Local', 'Temp'),
        path.join(home, 'AppData', 'Roaming'),
        path.join(home, 'AppData', 'Local'),
        path.join(home, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
        tmpDir,
        path.join(home, '.virusdetect_test'),
        path.join(home, 'Music'),
        path.join(home, 'Pictures'),
        path.join(home, 'Videos'),
      ].filter(p => fs.existsSync(p))
    } else {
      return [
        path.join(home, 'Downloads'),
        path.join(home, 'Desktop'),
        path.join(home, 'Documents'),
        tmpDir,
        '/var/tmp',
        path.join(home, 'Library/LaunchAgents'),
        path.join(home, 'Library/LaunchDaemons'),
        path.join(home, '.local'),
        path.join(home, '.virusdetect_test'),
        path.join(home, 'Music'),
        path.join(home, 'Pictures'),
        path.join(home, 'Movies'),
      ].filter(p => fs.existsSync(p))
    }
  } else {
    // Quick scan — most common malware locations
    if (isWin) {
      return [
        path.join(home, 'Downloads'),
        path.join(home, 'Desktop'),
        path.join(home, 'AppData', 'Local', 'Temp'),
        path.join(home, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
        tmpDir,
        path.join(home, '.virusdetect_test'),
      ].filter(p => fs.existsSync(p))
    } else {
      return [
        path.join(home, 'Downloads'),
        path.join(home, 'Desktop'),
        tmpDir,
        path.join(home, '.virusdetect_test'),
      ].filter(p => fs.existsSync(p))
    }
  }
}

function collectFiles(paths, maxFiles, scanAll) {
  const files = []
  const execExts = ['exe','dll','scr','bat','cmd','ps1','vbs','wsf','msi','com','pif','jar','apk','docm','xlsm']
  const scriptExts = ['js','py','sh','rb','pl']
  const skipDirs = ['node_modules', '.git', '.Trash', 'Library', '.npm', '.cache', '.vscode', '__pycache__', 'dist', 'build', '.next']

  function walk(dir, depth) {
    if (depth > 8 || files.length >= maxFiles) return
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const e of entries) {
        if (files.length >= maxFiles) break
        const fp = path.join(dir, e.name)

        if (e.isDirectory()) {
          if (e.name.startsWith('.') && !e.name.startsWith('.virus')) continue
          if (skipDirs.includes(e.name)) continue
          walk(fp, depth + 1)
        } else if (e.isFile()) {
          const ext = e.name.split('.').pop().toLowerCase()
          const hasDoubleExt = e.name.split('.').length > 2
          const isHidden = e.name.startsWith('.')
          const isSuspiciousType = execExts.includes(ext) || scriptExts.includes(ext)
          const shouldCollect = scanAll || isSuspiciousType || hasDoubleExt || isHidden

          if (shouldCollect) {
            try {
              const stats = fs.statSync(fp)
              files.push({ path: fp, name: e.name, size: stats.size, ext, isSuspiciousType })
            } catch (x) {}
          }
        }
      }
    } catch (x) {}
  }

  for (const p of paths) { if (fs.existsSync(p)) walk(p, 0) }
  return files
}

app.post('/api/system-scan', async (req, res) => {
  const { scanType = 'quick' } = req.body
  const startTime = Date.now()

  const scanPaths = getSystemScanPaths(scanType)
  const maxFiles = scanType === 'full' ? 10000 : 1000
  const scanAll = scanType === 'full'

  console.log('[Scan] Starting ' + scanType + ' scan across ' + scanPaths.length + ' locations...')
  console.log('[Scan] ClamAV: ' + (clamAvailable ? 'ACTIVE' : 'NOT AVAILABLE (heuristic only)'))

  const files = collectFiles(scanPaths, maxFiles, scanAll)
  console.log('[Scan] Collected ' + files.length + ' files to analyze')

  const threats = []
  const allResults = []
  let scannedCount = 0

  for (const f of files) {
    try {
      if (!f.isSuspiciousType && f.name.split('.').length <= 2 && !f.name.startsWith('.')) {
        scannedCount++
        allResults.push({ fileName: f.name, filePath: f.path, status: 'clean', threatScore: 0 })
        continue
      }

      const r = await analyzeFile(f.path, f.name, f.size)
      scannedCount++
      allResults.push({ fileName: r.fileName, filePath: f.path, status: r.status, threatScore: r.threatScore })

      if (r.threatScore >= 40 || (r.patterns.length > 0 && r.threatScore >= 30)) {
        threats.push(r)
        db.saveScan(r)
      }
    } catch (e) { scannedCount++ }

    if (scannedCount % 200 === 0) {
      console.log('[Scan] Progress: ' + scannedCount + '/' + files.length)
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log('[Scan] Complete: ' + scannedCount + ' scanned, ' + threats.length + ' threats in ' + duration + 's')

  res.json({
    success: true,
    scanType,
    totalFiles: files.length,
    scannedFiles: scannedCount,
    threatsFound: threats.length,
    duration: parseFloat(duration),
    clamAvAvailable: clamAvailable,
    threats,
    summary: {
      clean: allResults.filter(r => r.status === 'clean').length,
      suspicious: allResults.filter(r => r.status === 'suspicious').length,
      malware: allResults.filter(r => r.status === 'malware').length,
      potentiallyUnwanted: allResults.filter(r => r.status === 'potentially_unwanted').length,
    }
  })
})

// ============================================
// TEST VIRUS (for demo)
// ============================================
const testVirusDir = path.join(os.homedir(), '.virusdetect_test')

app.post('/api/test-virus/deploy', (req, res) => {
  if (!fs.existsSync(testVirusDir)) fs.mkdirSync(testVirusDir, { recursive: true })
  const deployed = []
  const f1 = path.join(os.homedir(), 'Downloads', 'invoice_2026.pdf.exe')
  fs.writeFileSync(f1, 'MZ\x90\x00 Test file\nCreateRemoteThread VirtualAllocEx WriteProcessMemory\nShellExecute URLDownloadToFile\nHKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\nHARMLESS TEST')
  deployed.push({ name: 'invoice_2026.pdf.exe', path: f1, type: 'Trojan (Double Extension)', risk: 'critical' })
  const f2 = path.join(testVirusDir, '.system_update.ps1')
  fs.writeFileSync(f2, '# Hidden PowerShell backdoor\npowershell -encodedcommand ZQBjAGgAbwA=\ncmd.exe /c schtasks /create /tn Update\nevil.onion/payload\nHARMLESS TEST')
  deployed.push({ name: '.system_update.ps1', path: f2, type: 'Hidden Backdoor', risk: 'critical' })
  const f3 = path.join(testVirusDir, 'svchost_helper.exe')
  fs.writeFileSync(f3, Buffer.concat([Buffer.from('MZ\x90\x00\x03\x00'), crypto.randomBytes(8192), Buffer.from('\nCreateRemoteThread\nVirtualAllocEx\nmimikatz\nransomware payload\nbitcoin wallet bc1q\n')]))
  deployed.push({ name: 'svchost_helper.exe', path: f3, type: 'Packed Executable', risk: 'critical' })
  const f4 = path.join(os.homedir(), 'Desktop', 'free_game_crack.bat')
  fs.writeFileSync(f4, '@echo off\nREM ransomware payload dropper\necho your files have been encrypted!\necho Send to bitcoin wallet bc1qxy2kgdyg\ncmd.exe /c reg add CurrentVersion\\Run\npowershell -encodedcommand\nevil.onion\nHARMLESS TEST')
  deployed.push({ name: 'free_game_crack.bat', path: f4, type: 'Ransomware Dropper', risk: 'critical' })
  const f5 = path.join(os.tmpdir(), 'system_monitor.js')
  fs.writeFileSync(f5, '// keylogger module\nconst keylogger = require("keylogger");\nsocket.connect(4444, "attacker.onion");\nGetClipboardData();\nCreateRemoteThread()\nHARMLESS TEST')
  deployed.push({ name: 'system_monitor.js', path: f5, type: 'Keylogger/Spyware', risk: 'critical' })
  const f6 = path.join(testVirusDir, 'normal_document.txt')
  fs.writeFileSync(f6, 'Normal text document.\nNo suspicious patterns.\nHello world!')
  deployed.push({ name: 'normal_document.txt', path: f6, type: 'Clean (Control)', risk: 'none' })
  res.json({ success: true, message: deployed.length+' test files deployed (5 malicious + 1 clean)', deployed })
})

app.post('/api/test-virus/cleanup', (req, res) => {
  let n = 0
  for (const f of [path.join(os.homedir(),'Downloads','invoice_2026.pdf.exe'), path.join(testVirusDir,'.system_update.ps1'), path.join(testVirusDir,'svchost_helper.exe'), path.join(os.homedir(),'Desktop','free_game_crack.bat'), path.join(os.tmpdir(),'system_monitor.js'), path.join(testVirusDir,'normal_document.txt')]) { try { if (fs.existsSync(f)) { fs.unlinkSync(f); n++ } } catch (e) {} }
  try { if (fs.existsSync(testVirusDir)) fs.rmdirSync(testVirusDir) } catch (e) {}
  res.json({ success: true, removed: n })
})

// ============================================
// INFO ENDPOINTS
// ============================================

app.get('/api/signatures/status', (req, res) => {
  res.json({
    success: true,
    totalSignatures: signatureDB.knownHashes.length,
    totalPatterns: signatureDB.suspiciousStrings.length,
    lastUpdated: signatureDB.lastUpdated,
    version: signatureDB.version,
    clamav: { available: clamAvailable, path: clamAvailable ? clamScanPath : null }
  })
})

app.get('/api/statistics', (req, res) => {
  const scans = db.getAllScans ? db.getAllScans() : []
  const t = scans.length, m = scans.filter(s=>s.status==='malware').length, su = scans.filter(s=>s.status==='suspicious').length
  res.json({
    success: true,
    stats: {
      totalScans: t, malware: m, suspicious: su,
      clean: scans.filter(s=>s.status==='clean').length,
      detectionRate: t > 0 ? ((m+su)/t*100).toFixed(1)+'%' : '0%',
      signatureCount: signatureDB.knownHashes.length,
      patternCount: signatureDB.suspiciousStrings.length,
      clamav: clamAvailable
    }
  })
})

app.get('/api/techniques', (req, res) => { res.json({ success: true, techniques: [ { id:'polymorphic', name:'Polymorphic Code', risk:'high', detectMethod:'Behavioral analysis', description:'Malware changes code each replication' }, { id:'metamorphic', name:'Metamorphic Code', risk:'critical', detectMethod:'AI pattern recognition', description:'Complete code rewriting each iteration' }, { id:'packing', name:'Packing/Encryption', risk:'medium', detectMethod:'Entropy analysis', description:'Compressing/encrypting payload' }, { id:'fileless', name:'Fileless Malware', risk:'high', detectMethod:'Memory scanning', description:'Operates in memory without files' }, { id:'rootkit', name:'Rootkits', risk:'critical', detectMethod:'Low-level scanning', description:'Hides from OS' }, { id:'sandbox', name:'Sandbox Evasion', risk:'high', detectMethod:'Multi-environment', description:'Detects analysis environments' }, { id:'code-injection', name:'Code Injection', risk:'critical', detectMethod:'Process monitoring', description:'Injects into legitimate processes' }, { id:'living-off-land', name:'Living Off The Land', risk:'high', detectMethod:'Behavior analysis', description:'Uses legitimate tools maliciously' } ] }) })

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '3.0.0',
    platform: process.platform,
    clamav: { available: clamAvailable, path: clamAvailable ? clamScanPath : null },
    signatures: signatureDB.knownHashes.length,
    patterns: signatureDB.suspiciousStrings.length,
    quarantine: quarantineDir,
    offline: true
  })
})

// ============================================
// STARTUP
// ============================================

async function start() {
  await checkClamAV()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  VirusDetect Pro v3.0 | Port ${PORT}
  Platform: ${process.platform} | ClamAV: ${clamAvailable ? 'ACTIVE' : 'NOT FOUND'}
  Signatures: ${signatureDB.knownHashes.length} hashes | ${signatureDB.suspiciousStrings.length} patterns
  Quarantine: ${quarantineDir}
  Offline mode: YES
`)
  })
}

start()
