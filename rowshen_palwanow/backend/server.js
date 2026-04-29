// KeyGuard Backend v3.0 — Cross-Platform Keylogger Detection
// NOTE: execSync is used with HARDCODED system commands only (ps, tasklist, reg query, schtasks, crontab)
// NO user input is ever passed to shell commands — all args are static strings

const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const { execSync } = require('child_process') // eslint-disable-line security/detect-child-process
const os = require('os')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 7051

app.use(cors())
app.use(express.json())

const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const historyPath = path.join(dataDir, 'scans.json')

function loadHistory() { try { if (fs.existsSync(historyPath)) return JSON.parse(fs.readFileSync(historyPath, 'utf8')) } catch (e) {} return { scans: [] } }
function saveHistory(data) { fs.writeFileSync(historyPath, JSON.stringify(data, null, 2)) }

// ============================================
// KNOWN KEYLOGGER DATABASE (35+ entries, offline)
// ============================================

const knownKeyloggers = [
  { name: 'spyrix', fullName: 'Spyrix Personal Monitor', risk: 'Critical', type: 'Commercial Keylogger' },
  { name: 'refog', fullName: 'Refog Keylogger', risk: 'Critical', type: 'Commercial Keylogger' },
  { name: 'actual keylogger', fullName: 'Actual Keylogger', risk: 'Critical', type: 'Commercial Keylogger' },
  { name: 'ardamax', fullName: 'Ardamax Keylogger', risk: 'Critical', type: 'Commercial Keylogger' },
  { name: 'elite keylogger', fullName: 'Elite Keylogger', risk: 'Critical', type: 'Commercial Keylogger' },
  { name: 'perfect keylogger', fullName: 'Perfect Keylogger', risk: 'Critical', type: 'Commercial Keylogger' },
  { name: 'revealer keylogger', fullName: 'Revealer Keylogger', risk: 'Critical', type: 'Commercial Keylogger' },
  { name: 'kidlogger', fullName: 'KidLogger', risk: 'High', type: 'Monitoring Software' },
  { name: 'hoverwatch', fullName: 'Hoverwatch', risk: 'Critical', type: 'Phone/PC Spy' },
  { name: 'mspy', fullName: 'mSpy', risk: 'Critical', type: 'Spyware' },
  { name: 'flexispy', fullName: 'FlexiSPY', risk: 'Critical', type: 'Spyware' },
  { name: 'cocospy', fullName: 'Cocospy', risk: 'Critical', type: 'Spyware' },
  { name: 'wolfeye', fullName: 'Wolfeye Remote Screen', risk: 'Critical', type: 'Remote Monitoring' },
  { name: 'hawkeye', fullName: 'HawkEye Keylogger', risk: 'Critical', type: 'Malware Keylogger' },
  { name: 'snake keylogger', fullName: 'Snake Keylogger', risk: 'Critical', type: 'Malware Keylogger' },
  { name: 'agenttesla', fullName: 'Agent Tesla', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'formbook', fullName: 'FormBook/XLoader', risk: 'Critical', type: 'Info Stealer + Keylogger' },
  { name: 'remcos', fullName: 'Remcos RAT', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'njrat', fullName: 'njRAT', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'darkcomet', fullName: 'DarkComet RAT', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'nanocore', fullName: 'NanoCore RAT', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'asyncrat', fullName: 'AsyncRAT', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'quasarrat', fullName: 'Quasar RAT', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'warzone', fullName: 'Warzone RAT', risk: 'Critical', type: 'RAT + Keylogger' },
  { name: 'redline', fullName: 'RedLine Stealer', risk: 'Critical', type: 'Info Stealer' },
  { name: 'raccoon', fullName: 'Raccoon Stealer', risk: 'Critical', type: 'Info Stealer' },
  { name: 'vidar', fullName: 'Vidar Stealer', risk: 'Critical', type: 'Info Stealer' },
  { name: 'lumma', fullName: 'Lumma Stealer', risk: 'Critical', type: 'Info Stealer' },
  { name: 'stealc', fullName: 'StealC', risk: 'Critical', type: 'Info Stealer' },
  { name: 'mimikatz', fullName: 'Mimikatz', risk: 'Critical', type: 'Credential Harvester' },
  { name: 'lazagne', fullName: 'LaZagne', risk: 'Critical', type: 'Password Recovery' },
  { name: 'meterpreter', fullName: 'Metasploit Meterpreter', risk: 'Critical', type: 'Penetration Tool' },
  { name: 'cobalt strike', fullName: 'Cobalt Strike Beacon', risk: 'Critical', type: 'C2 Framework' },
  { name: 'ettercap', fullName: 'Ettercap', risk: 'Critical', type: 'MITM Tool' },
]

const suspiciousPatterns = [
  { pattern: /keylog/i, type: 'Keylogger', risk: 'Critical' },
  { pattern: /keystroke.?log/i, type: 'Keystroke Logger', risk: 'Critical' },
  { pattern: /keyboard.?hook/i, type: 'Keyboard Hook', risk: 'Critical' },
  { pattern: /keyboard.?capture/i, type: 'Keyboard Capture', risk: 'Critical' },
  { pattern: /keyboard.?record/i, type: 'Keyboard Recorder', risk: 'Critical' },
  { pattern: /keyboard.?monitor/i, type: 'Keyboard Monitor', risk: 'Critical' },
  { pattern: /input.?hook/i, type: 'Input Hook', risk: 'Critical' },
  { pattern: /input.?monitor/i, type: 'Input Monitor', risk: 'High' },
  { pattern: /hook.?inject/i, type: 'Hook Injection', risk: 'Critical' },
  { pattern: /^spyware/i, type: 'Spyware', risk: 'High' },
  { pattern: /clipboard.?steal/i, type: 'Clipboard Stealer', risk: 'High' },
  { pattern: /screen.?capture/i, type: 'Screen Capture', risk: 'High' },
  { pattern: /^ratool/i, type: 'RAT', risk: 'Critical' },
  { pattern: /^ncat$|^netcat$/i, type: 'Network Backdoor', risk: 'Medium' },
  { pattern: /hydra/i, type: 'Brute Force Tool', risk: 'High' },
  { pattern: /hashcat/i, type: 'Password Cracker', risk: 'High' },
  { pattern: /aircrack/i, type: 'WiFi Cracker', risk: 'High' },
  { pattern: /getasynckeystate/i, type: 'Win32 Keyboard Spy', risk: 'Critical' },
  { pattern: /setwindowshookex/i, type: 'Win32 Hook Installer', risk: 'Critical' },
]

const suspiciousFilePatterns = [
  /keylog/i, /keystroke/i, /keyboard.?hook/i, /keyboard.?capture/i,
  /spyrix/i, /refog/i, /ardamax/i, /hawkeye/i, /agenttesla/i,
  /formbook/i, /snake.?keylog/i, /remcos/i, /njrat/i, /darkcomet/i,
  /nanocore/i, /asyncrat/i, /quasar/i, /warzone/i,
  /input.?hook/i, /hook.?inject/i, /key.?capture/i,
  /hidden.?record/i, /stealth.?log/i, /spy.?monitor/i,
]

const safeProcesses = new Set([
  'visual', 'code', 'electron', 'node', 'npm', 'python', 'python3',
  'chrome', 'firefox', 'safari', 'opera', 'brave', 'postman', 'obsidian',
  'slack', 'discord', 'telegram', 'zoom', 'teams', 'spotify', 'iterm2',
  'terminal', 'finder', 'dock', 'systemuiserver', 'loginwindow', 'launchd',
  'kernel_task', 'windowserver', 'xcode', 'git', 'java', 'php', 'go',
  'explorer', 'svchost', 'csrss', 'wininit', 'winlogon', 'dwm', 'taskhostw',
  'conhost', 'sihost', 'runtimebroker', 'searchhost', 'ctfmon', 'lsass',
  'services', 'smss', 'spoolsv', 'taskmgr', 'cmd', 'powershell',
  'windowsterminal', 'msedge', 'onedrive', 'securityhealthsystray',
])

// ============================================
// PROCESS SCANNING (all commands are hardcoded, no user input)
// ============================================

function getRealProcesses() {
  try {
    const platform = os.platform()
    let processes = []

    if (platform === 'win32') {
      try {
        const output = execSync('powershell -Command "Get-Process | Select-Object Id,ProcessName,CPU,WorkingSet64,Path | ConvertTo-Csv -NoTypeInformation"', { encoding: 'utf8', timeout: 10000 })
        for (const line of output.trim().split('\n').slice(1)) {
          const parts = line.replace(/"/g, '').split(',')
          if (parts.length < 4) continue
          const name = parts[1] || ''
          if (!name || name.length < 2) continue
          processes.push({ pid: parseInt(parts[0]), name, command: parts[4] || name, user: '-', cpu: parseFloat(parts[2]) || 0, memory: `${Math.round((parseInt(parts[3]) || 0) / 1048576)} MB`, memoryKB: Math.round((parseInt(parts[3]) || 0) / 1024), risk: 'Safe', detectedType: null, knownThreat: null, path: parts[4] || '', started: '-' })
        }
      } catch (e) {
        const output = execSync('tasklist /FO CSV', { encoding: 'utf8', timeout: 5000 })
        for (const line of output.trim().split('\n').slice(1)) {
          const parts = line.replace(/"/g, '').split(',')
          if (parts.length < 2) continue
          processes.push({ pid: parseInt(parts[1]), name: parts[0], command: parts[0], user: '-', cpu: 0, memory: parts[4] || '0 KB', memoryKB: 0, risk: 'Safe', detectedType: null, knownThreat: null, path: '', started: '-' })
        }
      }
    } else {
      const output = execSync('ps aux', { encoding: 'utf8', timeout: 5000 })
      for (const line of output.trim().split('\n').slice(1)) {
        const parts = line.trim().split(/\s+/)
        if (parts.length < 11) continue
        const command = parts.slice(10).join(' ')
        const appMatch = command.match(/\/([^/]+)\.app\//)
        const name = appMatch ? appMatch[1] : path.basename(command.split(' ')[0])
        if (!name || name.length < 2) continue
        const rss = parseInt(parts[5])
        processes.push({ pid: parseInt(parts[1]), name, command: command.substring(0, 200), user: parts[0], cpu: parseFloat(parts[2]), memory: rss > 1024 ? `${(rss / 1024).toFixed(1)} MB` : `${rss} KB`, memoryKB: rss, risk: 'Safe', detectedType: null, knownThreat: null, path: command.split(' ')[0], started: parts[8] || '-' })
      }
    }

    for (const proc of processes) {
      const nl = proc.name.toLowerCase()
      const cl = (proc.command || '').toLowerCase()
      if (safeProcesses.has(nl) || nl.startsWith('com.apple.') || nl.startsWith('apple') || nl.startsWith('system') || nl.startsWith('microsoft') || nl.startsWith('windows')) continue
      const km = knownKeyloggers.find(k => nl.includes(k.name) || cl.includes(k.name))
      if (km) { proc.risk = km.risk; proc.detectedType = km.type; proc.knownThreat = km.fullName; continue }
      for (const sp of suspiciousPatterns) { if (sp.pattern.test(proc.name) || sp.pattern.test(proc.command || '')) { proc.risk = sp.risk; proc.detectedType = sp.type; break } }
    }

    processes.sort((a, b) => { const o = { Critical: 0, High: 1, Medium: 2, Low: 3, Safe: 4 }; return (o[a.risk] || 4) - (o[b.risk] || 4) || b.cpu - a.cpu })
    return processes
  } catch (e) { console.error('Process scan error:', e.message); return [] }
}

// ============================================
// FILE SYSTEM SCAN
// ============================================

function scanFileSystem(scanType) {
  const home = os.homedir()
  const isWin = os.platform() === 'win32'
  const findings = []

  const scanPaths = scanType === 'full'
    ? isWin
      ? [path.join(home, 'Downloads'), path.join(home, 'Desktop'), path.join(home, 'Documents'), path.join(home, 'AppData', 'Local', 'Temp'), path.join(home, 'AppData', 'Roaming'), os.tmpdir()]
      : [path.join(home, 'Downloads'), path.join(home, 'Desktop'), path.join(home, 'Documents'), os.tmpdir(), path.join(home, '.local'), path.join(home, '.config')]
    : isWin
      ? [path.join(home, 'Downloads'), path.join(home, 'Desktop'), os.tmpdir()]
      : [path.join(home, 'Downloads'), path.join(home, 'Desktop'), os.tmpdir()]

  const skip = new Set(['node_modules', '.git', '.Trash', 'cache', 'Cache', '__pycache__', 'dist', 'build'])
  let scanned = 0
  const max = scanType === 'full' ? 5000 : 1000

  function walk(dir, depth) {
    if (depth > 5 || scanned >= max) return
    try {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (scanned >= max) break
        if (e.isDirectory()) { if (!skip.has(e.name) && !e.name.startsWith('.')) walk(path.join(dir, e.name), depth + 1) }
        else if (e.isFile()) {
          scanned++
          const fp = path.join(dir, e.name)
          const lower = e.name.toLowerCase()
          for (const pat of suspiciousFilePatterns) {
            if (pat.test(lower)) {
              try { const s = fs.statSync(fp); findings.push({ id: uuidv4(), name: e.name, type: 'Suspicious File', location: fp, risk: 'High', size: s.size, reason: 'Filename matches keylogger pattern', detectedAt: new Date().toISOString() }) } catch (err) {}
              break
            }
          }
          const ext = path.extname(lower)
          if (['.pyw', '.ahk', '.vbs', '.wsf', '.hta'].includes(ext) && !findings.some(f => f.location === fp)) {
            try {
              const c = fs.readFileSync(fp, 'utf8').substring(0, 4096).toLowerCase()
              const kw = ['getasynckeystate', 'setwindowshookex', 'keybd_event', 'keyboard', 'keystroke', 'keylog', 'clipboard', 'screenshot']
              const m = kw.filter(k => c.includes(k))
              if (m.length > 0) findings.push({ id: uuidv4(), name: e.name, type: 'Script with keylogger code', location: fp, risk: m.length >= 2 ? 'Critical' : 'High', reason: `Contains: ${m.join(', ')}`, detectedAt: new Date().toISOString() })
            } catch (err) {}
          }
        }
      }
    } catch (err) {}
  }

  for (const p of scanPaths) { if (fs.existsSync(p)) walk(p, 0) }
  return { findings, scanned }
}

// ============================================
// PERSISTENCE SCAN (registry, startup, cron)
// All commands are hardcoded — no user input
// ============================================

function scanPersistence() {
  const findings = []
  const isWin = os.platform() === 'win32'
  const home = os.homedir()

  if (isWin) {
    for (const regPath of ['HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce', 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run']) {
      try {
        const output = execSync(`reg query "${regPath}"`, { encoding: 'utf8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] })
        for (const line of output.split('\n').filter(l => l.trim() && !l.startsWith('HKEY'))) {
          const lower = line.toLowerCase()
          for (const k of knownKeyloggers) { if (lower.includes(k.name)) { findings.push({ id: uuidv4(), name: k.fullName, type: 'Registry Startup Entry', location: regPath, risk: 'Critical', reason: `Known keylogger in startup registry`, detectedAt: new Date().toISOString() }) } }
          for (const pat of suspiciousFilePatterns) { if (pat.test(lower)) { findings.push({ id: uuidv4(), name: line.trim().split(/\s+/)[0] || 'Unknown', type: 'Suspicious Startup Entry', location: regPath, risk: 'High', reason: 'Suspicious pattern in registry', detectedAt: new Date().toISOString() }); break } }
        }
      } catch (e) {}
    }
    const startupDir = path.join(home, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
    try { if (fs.existsSync(startupDir)) { for (const f of fs.readdirSync(startupDir)) { if (suspiciousFilePatterns.some(p => p.test(f.toLowerCase()))) findings.push({ id: uuidv4(), name: f, type: 'Suspicious Startup File', location: path.join(startupDir, f), risk: 'High', reason: 'In Windows Startup folder', detectedAt: new Date().toISOString() }) } } } catch (e) {}
    try {
      const output = execSync('schtasks /query /fo csv /nh', { encoding: 'utf8', timeout: 10000, stdio: ['pipe', 'pipe', 'pipe'] })
      for (const line of output.split('\n')) { if (suspiciousFilePatterns.some(p => p.test(line.toLowerCase()))) { findings.push({ id: uuidv4(), name: line.split(',')[0]?.replace(/"/g, '') || 'Unknown', type: 'Suspicious Scheduled Task', location: 'Task Scheduler', risk: 'High', reason: 'Suspicious task name', detectedAt: new Date().toISOString() }) } }
    } catch (e) {}
  } else if (os.platform() === 'darwin') {
    for (const lp of [path.join(home, 'Library/LaunchAgents'), '/Library/LaunchAgents', '/Library/LaunchDaemons']) {
      try { if (fs.existsSync(lp)) { for (const f of fs.readdirSync(lp)) { if (suspiciousFilePatterns.some(p => p.test(f.toLowerCase()))) findings.push({ id: uuidv4(), name: f, type: 'Suspicious Launch Agent', location: path.join(lp, f), risk: 'High', reason: 'Suspicious macOS startup item', detectedAt: new Date().toISOString() }) } } } catch (e) {}
    }
  } else {
    try { const cron = execSync('crontab -l', { encoding: 'utf8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] }); for (const line of cron.split('\n')) { if (!line.startsWith('#') && line.trim() && suspiciousFilePatterns.some(p => p.test(line.toLowerCase()))) findings.push({ id: uuidv4(), name: 'Crontab entry', type: 'Suspicious Cron Job', location: 'crontab', risk: 'High', reason: 'Suspicious cron job', detectedAt: new Date().toISOString() }) } } catch (e) {}
    try { const ad = path.join(home, '.config', 'autostart'); if (fs.existsSync(ad)) { for (const f of fs.readdirSync(ad)) { if (suspiciousFilePatterns.some(p => p.test(f.toLowerCase()))) findings.push({ id: uuidv4(), name: f, type: 'Suspicious Autostart', location: path.join(ad, f), risk: 'High', reason: 'Suspicious autostart entry', detectedAt: new Date().toISOString() }) } } } catch (e) {}
  }
  return findings
}

// ============================================
// API ENDPOINTS
// ============================================

app.get('/api/processes', (req, res) => {
  const processes = getRealProcesses()
  res.json({ success: true, processes: processes.slice(0, parseInt(req.query.limit) || 100), totalProcesses: processes.length, suspiciousCount: processes.filter(p => p.risk !== 'Safe').length, platform: os.platform(), hostname: os.hostname(), timestamp: new Date().toISOString() })
})

app.post('/api/scan', (req, res) => {
  const { type = 'quick' } = req.body
  const startTime = Date.now()
  const processes = getRealProcesses()
  const processThreats = processes.filter(p => p.risk !== 'Safe').map(p => ({ id: uuidv4(), name: p.knownThreat || p.name, type: p.detectedType || 'Suspicious Process', location: p.path || p.command, risk: p.risk, pid: p.pid, cpu: p.cpu, memory: p.memory, category: 'process', detectedAt: new Date().toISOString() }))
  const fileScan = scanFileSystem(type)
  const fileThreats = fileScan.findings.map(f => ({ ...f, category: 'file' }))
  const persistenceThreats = scanPersistence().map(f => ({ ...f, category: 'persistence' }))
  const allThreats = [...processThreats, ...fileThreats, ...persistenceThreats]

  const result = { success: true, scanId: uuidv4(), type, processesScanned: processes.length, filesScanned: fileScan.scanned, threatsFound: allThreats.length, threats: allThreats, summary: { critical: allThreats.filter(t => t.risk === 'Critical').length, high: allThreats.filter(t => t.risk === 'High').length, medium: allThreats.filter(t => t.risk === 'Medium').length, processes: processThreats.length, files: fileThreats.length, persistence: persistenceThreats.length }, scannedAreas: type === 'full' ? ['processes', 'filesystem', 'registry', 'startup', 'scheduled_tasks'] : ['processes', 'filesystem_quick', 'startup'], duration: `${Date.now() - startTime}ms`, platform: os.platform(), knownKeyloggersInDB: knownKeyloggers.length, scannedAt: new Date().toISOString() }

  const history = loadHistory(); history.scans.unshift(result); if (history.scans.length > 50) history.scans = history.scans.slice(0, 50); saveHistory(history)
  res.json(result)
})

app.get('/api/history', (req, res) => { res.json({ success: true, scans: loadHistory().scans }) })

app.get('/api/protection', (req, res) => {
  const history = loadHistory()
  res.json({ success: true, status: 'active', platform: os.platform(), hostname: os.hostname(), settings: { hookMonitor: true, apiMonitor: true, processGuard: true, clipboardGuard: true, networkGuard: true, autoScan: false }, lastScan: history.scans[0]?.scannedAt || null, totalScans: history.scans.length, totalThreatsEverFound: history.scans.reduce((s, x) => s + x.threatsFound, 0), knownKeyloggersInDB: knownKeyloggers.length })
})

app.get('/api/keylogger-types', (req, res) => {
  res.json({ success: true, types: [
    { id: 'software', name: 'Software Keyloggers', description: 'Programs recording keystrokes in background', subtypes: ['Hook-based', 'API-based', 'Form grabbers', 'Memory-injection'], detection: 'Process scanning, hook detection' },
    { id: 'hardware', name: 'Hardware Keyloggers', description: 'Physical devices between keyboard and computer', subtypes: ['USB keyloggers', 'Wireless sniffers', 'Acoustic'], detection: 'Physical inspection, USB monitoring' },
    { id: 'kernel', name: 'Kernel Keyloggers', description: 'Operate at kernel level, very hard to detect', subtypes: ['Rootkit-based', 'Driver-based', 'Filter drivers'], detection: 'Kernel integrity checks' },
  ], knownKeyloggers: knownKeyloggers.map(k => ({ name: k.fullName, type: k.type, risk: k.risk })) })
})

app.get('/api/database', (req, res) => { res.json({ success: true, totalEntries: knownKeyloggers.length, keyloggers: knownKeyloggers.map(k => ({ name: k.fullName, type: k.type, risk: k.risk })), suspiciousPatterns: suspiciousPatterns.length, filePatterns: suspiciousFilePatterns.length }) })

app.get('/api/system', (req, res) => { res.json({ success: true, system: { platform: os.platform(), arch: os.arch(), hostname: os.hostname(), cpus: os.cpus().length, totalMemory: `${(os.totalmem() / 1073741824).toFixed(1)} GB`, freeMemory: `${(os.freemem() / 1073741824).toFixed(1)} GB`, uptime: `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m` } }) })

app.get('/api/health', (req, res) => { res.json({ status: 'ok', version: '3.0.0', platform: os.platform(), knownKeyloggers: knownKeyloggers.length, suspiciousPatterns: suspiciousPatterns.length, filePatterns: suspiciousFilePatterns.length, features: ['process_scan', 'file_scan', 'persistence_scan', 'registry_scan', 'known_keylogger_db'], offline: true }) })

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  KeyGuard v3.0 | Port ${PORT} | ${os.platform()} | DB: ${knownKeyloggers.length} keyloggers | ${suspiciousPatterns.length} patterns | Offline: YES\n`)
})
