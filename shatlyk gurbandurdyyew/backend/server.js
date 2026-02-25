const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Simulated firewall rules
const rules = [
  { id: 1, name: 'Block SSH Brute Force', source: 'Any', dest: '10.0.0.0/24', port: '22', protocol: 'TCP', action: 'Deny', active: true, aiScore: 95 },
  { id: 2, name: 'Allow HTTP Traffic', source: 'Any', dest: 'Any', port: '80', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100 },
  { id: 3, name: 'Allow HTTPS Traffic', source: 'Any', dest: 'Any', port: '443', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100 },
  { id: 4, name: 'Block Known Malware IPs', source: '185.x.x.x', dest: 'Any', port: 'Any', protocol: 'Any', action: 'Drop', active: true, aiScore: 98 },
  { id: 5, name: 'DNS Traffic', source: 'Internal', dest: '8.8.8.8', port: '53', protocol: 'UDP', action: 'Allow', active: true, aiScore: 92 }
]

// Get firewall rules
app.get('/api/rules', (req, res) => {
  res.json({
    success: true,
    rules,
    totalRules: rules.length
  })
})

// AI analyze traffic
app.post('/api/ai/analyze', (req, res) => {
  const { trafficData } = req.body

  // Simulate AI classification
  const classifications = ['Normal', 'Suspicious', 'Threat']
  const classification = classifications[Math.floor(Math.random() * 3)]
  const confidence = Math.floor(Math.random() * 30) + 70

  res.json({
    success: true,
    analysis: {
      id: uuidv4(),
      classification,
      confidence,
      recommendation: classification === 'Threat' ? 'Block traffic' : 'Allow traffic',
      features: {
        packetSize: Math.random() > 0.5 ? 'normal' : 'unusual',
        frequency: Math.random() > 0.5 ? 'normal' : 'high',
        destination: Math.random() > 0.5 ? 'known' : 'suspicious'
      },
      analyzedAt: new Date().toISOString()
    }
  })
})

// Get AI suggestions
app.get('/api/ai/suggestions', (req, res) => {
  res.json({
    success: true,
    suggestions: [
      { id: 1, name: 'Block Suspicious IP Range', description: 'Multiple failed login attempts detected', priority: 'High', confidence: 95 },
      { id: 2, name: 'Rate Limit API Endpoint', description: 'Unusual high traffic detected', priority: 'Medium', confidence: 82 },
      { id: 3, name: 'Update SSH Rule', description: 'Recommend non-standard port', priority: 'Low', confidence: 75 }
    ]
  })
})

// Get traffic statistics
app.get('/api/traffic/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      incoming: `${(Math.random() * 5 + 1).toFixed(2)} GB`,
      outgoing: `${(Math.random() * 3 + 0.5).toFixed(2)} GB`,
      blocked: Math.floor(Math.random() * 500) + 500,
      allowed: Math.floor(Math.random() * 10000) + 40000,
      protocols: {
        'HTTP/HTTPS': 65,
        'DNS': 15,
        'SSH': 8,
        'FTP': 5,
        'Other': 7
      }
    }
  })
})

// Get detected threats
app.get('/api/threats', (req, res) => {
  const threats = [
    { id: 1, type: 'Port Scan', source: '185.125.x.x', confidence: 97, severity: 'high', action: 'Blocked', detectedAt: new Date().toISOString() },
    { id: 2, type: 'Brute Force', source: '192.168.50.x', confidence: 95, severity: 'high', action: 'Blocked', detectedAt: new Date().toISOString() },
    { id: 3, type: 'Data Exfiltration', source: '10.0.0.25', confidence: 82, severity: 'medium', action: 'Monitored', detectedAt: new Date().toISOString() }
  ]

  res.json({
    success: true,
    threats,
    totalThreats: threats.length
  })
})

// Get AI model info
app.get('/api/ai/model', (req, res) => {
  res.json({
    success: true,
    model: {
      name: 'Neural Network Classifier',
      accuracy: 97.5,
      lastTrained: new Date(Date.now() - 7200000).toISOString(),
      trainingSamples: 1200000,
      version: '2.1.0',
      capabilities: [
        'Anomaly Detection',
        'Malware Traffic Detection',
        'DDoS Prevention',
        'Intrusion Detection',
        'Behavioral Analysis',
        'Zero-Day Detection'
      ]
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Firewall API running',
    version: '1.0.0'
  })
})

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                AI Firewall Backend Server                     ║
╚══════════════════════════════════════════════════════════════╝
Server running on http://localhost:${PORT}
  `)
})
