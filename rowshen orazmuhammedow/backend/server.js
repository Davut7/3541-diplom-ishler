const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Simulated process data
const generateProcesses = () => {
  const baseProcesses = [
    { name: 'System', publisher: 'Microsoft', risk: 'Safe' },
    { name: 'csrss.exe', publisher: 'Microsoft', risk: 'Safe' },
    { name: 'explorer.exe', publisher: 'Microsoft', risk: 'Low' },
    { name: 'chrome.exe', publisher: 'Google', risk: 'Safe' },
    { name: 'svchost.exe', publisher: 'Microsoft', risk: 'Safe' },
    { name: 'notepad.exe', publisher: 'Microsoft', risk: 'Safe' }
  ]

  return baseProcesses.map((p, i) => ({
    pid: (i + 1) * 1024,
    ...p,
    cpu: Math.round(Math.random() * 20 * 10) / 10,
    memory: `${Math.round(Math.random() * 500)} MB`,
    hooks: p.risk !== 'Safe' ? Math.floor(Math.random() * 3) : 0,
    path: `C:\\Windows\\System32\\${p.name}`,
    started: new Date().toLocaleTimeString(),
    threads: Math.floor(Math.random() * 50) + 5,
    handles: Math.floor(Math.random() * 1000) + 100
  }))
}

// Get running processes
app.get('/api/processes', (req, res) => {
  res.json({
    success: true,
    processes: generateProcesses(),
    timestamp: new Date().toISOString()
  })
})

// Scan system for keyloggers
app.post('/api/scan', (req, res) => {
  const { type } = req.body

  // Simulate threats based on random
  const hasThreats = Math.random() > 0.6
  const threats = hasThreats ? [
    {
      id: uuidv4(),
      name: 'SuspiciousHook.dll',
      type: 'Hook-based Keylogger',
      location: 'C:\\Windows\\Temp\\SuspiciousHook.dll',
      risk: 'High',
      detectedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'KeyCapture.exe',
      type: 'API-based Keylogger',
      location: 'C:\\Users\\AppData\\Local\\Temp\\KeyCapture.exe',
      risk: 'Critical',
      detectedAt: new Date().toISOString()
    }
  ] : []

  res.json({
    success: true,
    scanId: uuidv4(),
    type,
    threatsFound: threats.length,
    threats,
    scannedAreas: ['processes', 'registry', 'startup', 'hooks'],
    scannedAt: new Date().toISOString()
  })
})

// Get protection status
app.get('/api/protection', (req, res) => {
  res.json({
    success: true,
    status: 'protected',
    settings: {
      hookMonitor: true,
      apiMonitor: true,
      processGuard: true,
      clipboardGuard: false,
      networkGuard: true,
      autoScan: false
    },
    lastScan: new Date(Date.now() - 3600000).toISOString()
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
        subtypes: ['Hook-based', 'API-based', 'Form grabbers', 'Memory-injection']
      },
      {
        id: 'hardware',
        name: 'Hardware Keyloggers',
        description: 'Physical devices attached between keyboard and computer',
        subtypes: ['USB keyloggers', 'Wireless sniffers', 'Acoustic keyloggers']
      },
      {
        id: 'kernel',
        name: 'Kernel Keyloggers',
        description: 'Operate at kernel level, very difficult to detect',
        subtypes: ['Rootkit-based', 'Driver-based', 'Filter drivers']
      }
    ]
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'KeyGuard API running',
    version: '1.0.0'
  })
})

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                KeyGuard Backend Server                        ║
╚══════════════════════════════════════════════════════════════╝
Server running on http://localhost:${PORT}
  `)
})
