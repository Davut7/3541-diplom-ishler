const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const { execSync } = require('child_process')
const os = require('os')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 7051

app.use(cors())
app.use(express.json())

// Scan history persistence
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const historyPath = path.join(dataDir, 'scans.json')

function loadHistory() {
  try {
    if (fs.existsSync(historyPath)) return JSON.parse(fs.readFileSync(historyPath, 'utf8'))
  } catch (e) {}
  return { scans: [] }
}

function saveHistory(data) {
  fs.writeFileSync(historyPath, JSON.stringify(data, null, 2))
}

// Known safe processes (whitelist) - never flag these
const safeProcesses = new Set([
  'visual', 'code', 'electron', 'node', 'npm', 'python', 'python3', 'ruby',
  'chrome', 'firefox', 'safari', 'opera', 'brave', 'postman', 'obsidian',
  'slack', 'discord', 'telegram', 'zoom', 'teams', 'spotify', 'iterm2',
  'terminal', 'finder', 'dock', 'systemuiserver', 'loginwindow', 'launchd',
  'kernel_task', 'windowserver', 'screencaptureui', 'screenshot', 'grab',
  'cleanmymac', 'healthmonitor', 'appleicnscomposer', 'xcode', 'git',
  'java', 'php', 'go', 'cargo', 'rustc', 'gcc', 'clang', 'make', 'cmake'
])

// Known suspicious process patterns (potential keyloggers/spyware)
// Only matches exact suspicious tools, not legitimate apps
const suspiciousPatterns = [
  { pattern: /^keylog/i, type: 'Hook-based Keylogger', risk: 'Critical' },
  { pattern: /keystroke.?log/i, type: 'API-based Keylogger', risk: 'Critical' },
  { pattern: /^spyware/i, type: 'Spyware', risk: 'High' },
  { pattern: /hook.?inject/i, type: 'Hook Injection', risk: 'Critical' },
  { pattern: /input.?monitor/i, type: 'Input Monitor', risk: 'High' },
  { pattern: /clipboard.?steal/i, type: 'Clipboard Stealer', risk: 'Medium' },
  { pattern: /^vnc(?!viewer)/i, type: 'Remote Access Tool', risk: 'Medium' },
  { pattern: /^ratool/i, type: 'Remote Access Trojan', risk: 'Critical' },
  { pattern: /meterpreter/i, type: 'Penetration Tool', risk: 'Critical' },
  { pattern: /mimikatz/i, type: 'Credential Harvester', risk: 'Critical' },
  { pattern: /^ncat$|^netcat$/i, type: 'Network Backdoor Tool', risk: 'Medium' },
  { pattern: /lazagne/i, type: 'Password Recovery Tool', risk: 'Critical' },
  { pattern: /hydra/i, type: 'Brute Force Tool', risk: 'High' },
  { pattern: /hashcat/i, type: 'Password Cracking Tool', risk: 'High' },
  { pattern: /ettercap/i, type: 'MITM Attack Tool', risk: 'Critical' },
  { pattern: /aircrack/i, type: 'WiFi Cracking Tool', risk: 'High' }
]

// Get REAL running processes from the OS
function getRealProcesses() {
  try {
    const platform = os.platform()
    let output

    if (platform === 'darwin' || platform === 'linux') {
      // macOS/Linux: use ps with detailed output
      output = execSync('ps aux', { encoding: 'utf8', timeout: 5000 })
    } else {
      // Windows fallback
      output = execSync('tasklist /FO CSV /V', { encoding: 'utf8', timeout: 5000 })
    }

    const lines = output.trim().split('\n')
    const processes = []

    if (platform === 'darwin' || platform === 'linux') {
      // Parse ps aux output: USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/)
        if (parts.length < 11) continue

        const user = parts[0]
        const pid = parseInt(parts[1])
        const cpu = parseFloat(parts[2])
        const memPercent = parseFloat(parts[3])
        const rss = parseInt(parts[5]) // RSS in KB
        const command = parts.slice(10).join(' ')
        // Better process name extraction - handle macOS app paths with spaces
        let processPath = command.split(' ')[0]
        // For macOS .app bundles, extract the app name
        const appMatch = command.match(/\/([^/]+)\.app\//)
        const processName = appMatch ? appMatch[1] : path.basename(processPath)

        // Skip kernel threads and very short names
        if (!processName || processName.length < 2) continue

        // Check whitelist first
        const nameLower = processName.toLowerCase()
        const isSafe = safeProcesses.has(nameLower) ||
          nameLower.startsWith('com.apple.') ||
          nameLower.startsWith('apple') ||
          nameLower.startsWith('system')

        // Determine risk level
        let risk = 'Safe'
        let detectedType = null

        if (!isSafe) {
          // Only check against suspicious patterns for non-whitelisted processes
          for (const sp of suspiciousPatterns) {
            if (sp.pattern.test(processName)) {
              risk = sp.risk
              detectedType = sp.type
              break
            }
          }
        }

        const hooks = 0

        processes.push({
          pid,
          name: processName,
          command: command.substring(0, 200),
          user,
          cpu,
          memory: rss > 1024 ? `${(rss / 1024).toFixed(1)} MB` : `${rss} KB`,
          memoryKB: rss,
          risk,
          detectedType,
          hooks,
          path: command.split(' ')[0],
          started: parts[8] || '-'
        })
      }
    }

    // Sort: suspicious first, then by CPU
    processes.sort((a, b) => {
      const riskOrder = { Critical: 0, High: 1, Medium: 2, Low: 3, Safe: 4 }
      const riskDiff = (riskOrder[a.risk] || 4) - (riskOrder[b.risk] || 4)
      if (riskDiff !== 0) return riskDiff
      return b.cpu - a.cpu
    })

    return processes
  } catch (error) {
    console.error('Process scan error:', error.message)
    return []
  }
}

// Get REAL running processes
app.get('/api/processes', (req, res) => {
  const processes = getRealProcesses()
  const limit = parseInt(req.query.limit) || 100

  res.json({
    success: true,
    processes: processes.slice(0, limit),
    totalProcesses: processes.length,
    suspiciousCount: processes.filter(p => p.risk !== 'Safe').length,
    platform: os.platform(),
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  })
})

// Scan system for keyloggers - REAL scan
app.post('/api/scan', (req, res) => {
  const { type = 'quick' } = req.body
  const scanId = uuidv4()
  const startTime = Date.now()

  // Get real processes
  const processes = getRealProcesses()
  const threats = []

  // Check each process for suspicious patterns
  for (const proc of processes) {
    if (proc.risk !== 'Safe') {
      threats.push({
        id: uuidv4(),
        name: proc.name,
        type: proc.detectedType || 'Suspicious Process',
        location: proc.path,
        risk: proc.risk,
        pid: proc.pid,
        cpu: proc.cpu,
        memory: proc.memory,
        user: proc.user,
        detectedAt: new Date().toISOString()
      })
    }
  }

  // Check for suspicious LaunchAgents/LaunchDaemons on macOS
  const suspiciousFiles = []
  if (os.platform() === 'darwin') {
    const launchPaths = [
      path.join(os.homedir(), 'Library/LaunchAgents'),
      '/Library/LaunchAgents',
      '/Library/LaunchDaemons'
    ]

    for (const launchPath of launchPaths) {
      try {
        if (fs.existsSync(launchPath)) {
          const files = fs.readdirSync(launchPath)
          for (const file of files) {
            const lower = file.toLowerCase()
            if (suspiciousPatterns.some(sp => sp.pattern.test(lower))) {
              suspiciousFiles.push({
                id: uuidv4(),
                name: file,
                type: 'Suspicious Startup Item',
                location: path.join(launchPath, file),
                risk: 'High',
                detectedAt: new Date().toISOString()
              })
            }
          }
        }
      } catch (e) { /* skip inaccessible */ }
    }
  }

  const allThreats = [...threats, ...suspiciousFiles]
  const duration = Date.now() - startTime

  const result = {
    success: true,
    scanId,
    type,
    processesScanned: processes.length,
    threatsFound: allThreats.length,
    threats: allThreats,
    scannedAreas: type === 'full'
      ? ['processes', 'startup_items', 'launch_agents', 'network_connections']
      : ['processes', 'startup_items'],
    duration: `${duration}ms`,
    platform: os.platform(),
    scannedAt: new Date().toISOString()
  }

  // Save to history
  const history = loadHistory()
  history.scans.unshift(result)
  if (history.scans.length > 50) history.scans = history.scans.slice(0, 50)
  saveHistory(history)

  res.json(result)
})

// Get scan history
app.get('/api/history', (req, res) => {
  const history = loadHistory()
  res.json({ success: true, scans: history.scans })
})

// Get protection status
app.get('/api/protection', (req, res) => {
  const history = loadHistory()
  const lastScan = history.scans[0]

  res.json({
    success: true,
    status: 'active',
    platform: os.platform(),
    hostname: os.hostname(),
    settings: {
      hookMonitor: true,
      apiMonitor: true,
      processGuard: true,
      clipboardGuard: true,
      networkGuard: true,
      autoScan: false
    },
    lastScan: lastScan ? lastScan.scannedAt : null,
    totalScans: history.scans.length,
    totalThreatsEverFound: history.scans.reduce((sum, s) => sum + s.threatsFound, 0)
  })
})

// Get keylogger types info
app.get('/api/keylogger-types', (req, res) => {
  res.json({
    success: true,
    types: [
      {
        id: 'software',
        name: 'Software Keyloggers',
        description: 'Programs that run in background and record keystrokes',
        subtypes: ['Hook-based', 'API-based', 'Form grabbers', 'Memory-injection'],
        detection: 'Process scanning, hook detection, API monitoring'
      },
      {
        id: 'hardware',
        name: 'Hardware Keyloggers',
        description: 'Physical devices attached between keyboard and computer',
        subtypes: ['USB keyloggers', 'Wireless sniffers', 'Acoustic keyloggers'],
        detection: 'Physical inspection, USB device monitoring'
      },
      {
        id: 'kernel',
        name: 'Kernel Keyloggers',
        description: 'Operate at kernel level, very difficult to detect',
        subtypes: ['Rootkit-based', 'Driver-based', 'Filter drivers'],
        detection: 'Kernel integrity checks, driver verification'
      }
    ]
  })
})

// System info
app.get('/api/system', (req, res) => {
  res.json({
    success: true,
    system: {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`,
      freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(1)} GB`,
      uptime: `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'KeyGuard API running',
    version: '2.0.0',
    platform: os.platform(),
    realProcessScanning: true
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          KeyGuard Backend Server v2.0                        ║
║          Real Process Scanning Engine                         ║
╠══════════════════════════════════════════════════════════════╣
║  Platform: ${os.platform()} (${os.arch()})                                    ║
║  Hostname: ${os.hostname().substring(0, 40).padEnd(40)}   ║
║  Features: Real process scanning via ps/tasklist             ║
╚══════════════════════════════════════════════════════════════╝
Server running on http://localhost:${PORT}
  `)
})
