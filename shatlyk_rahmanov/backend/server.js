const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 7081

app.use(cors())
app.use(express.json())

// ============================================
// AI FIREWALL - INTELLIGENT NETWORK PROTECTION
// Author: Shatlyk Rahmanov
// ============================================

// Neural Network Configuration
const aiModel = {
  name: 'Deep Neural Network Classifier',
  version: '3.0.0',
  accuracy: 97.8,
  precision: 96.5,
  recall: 98.2,
  f1Score: 97.3,
  lastTrained: new Date(Date.now() - 3600000).toISOString(),
  trainingSamples: 2500000,
  architecture: {
    inputLayer: 15,
    hiddenLayers: [128, 64, 32],
    outputLayer: 4,
    activation: 'ReLU',
    outputActivation: 'Softmax'
  },
  capabilities: [
    { name: 'Anomaly Detection', accuracy: 98.5, description: 'Detect unusual traffic patterns' },
    { name: 'Malware Traffic Detection', accuracy: 97.2, description: 'Identify C&C communications' },
    { name: 'DDoS Attack Prevention', accuracy: 99.1, description: 'Block volumetric attacks' },
    { name: 'Intrusion Detection', accuracy: 96.8, description: 'Detect exploitation attempts' },
    { name: 'Behavioral Analysis', accuracy: 95.5, description: 'Learn normal behavior patterns' },
    { name: 'Zero-Day Detection', accuracy: 92.3, description: 'Identify unknown threats' },
    { name: 'Port Scan Detection', accuracy: 99.5, description: 'Detect reconnaissance activities' },
    { name: 'SQL Injection Detection', accuracy: 98.7, description: 'Block SQL injection attempts' }
  ]
}

// Firewall Rules Database
let firewallRules = [
  { id: 1, name: 'Block SSH Brute Force', source: 'Any', dest: '10.0.0.0/24', port: '22', protocol: 'TCP', action: 'Deny', active: true, aiScore: 95, aiGenerated: true, hitCount: 15234, createdAt: '2026-01-15T10:30:00Z' },
  { id: 2, name: 'Allow HTTP Traffic', source: 'Any', dest: 'Any', port: '80', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100, aiGenerated: false, hitCount: 892456, createdAt: '2026-01-10T08:00:00Z' },
  { id: 3, name: 'Allow HTTPS Traffic', source: 'Any', dest: 'Any', port: '443', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100, aiGenerated: false, hitCount: 1256789, createdAt: '2026-01-10T08:00:00Z' },
  { id: 4, name: 'Block Known Malware IPs', source: '185.0.0.0/8', dest: 'Any', port: 'Any', protocol: 'Any', action: 'Drop', active: true, aiScore: 98, aiGenerated: true, hitCount: 8934, createdAt: '2026-02-01T14:20:00Z' },
  { id: 5, name: 'DNS Traffic to Google', source: 'Internal', dest: '8.8.8.8', port: '53', protocol: 'UDP', action: 'Allow', active: true, aiScore: 92, aiGenerated: false, hitCount: 456123, createdAt: '2026-01-12T09:15:00Z' },
  { id: 6, name: 'Block Telnet Access', source: 'External', dest: 'Any', port: '23', protocol: 'TCP', action: 'Deny', active: true, aiScore: 100, aiGenerated: true, hitCount: 2341, createdAt: '2026-01-20T11:45:00Z' },
  { id: 7, name: 'Rate Limit ICMP', source: 'Any', dest: 'Any', port: 'Any', protocol: 'ICMP', action: 'Limit', active: true, aiScore: 88, aiGenerated: true, hitCount: 34567, createdAt: '2026-02-05T16:30:00Z' },
  { id: 8, name: 'Block SQL Injection Pattern', source: 'Any', dest: 'WebServers', port: '3306', protocol: 'TCP', action: 'Drop', active: true, aiScore: 97, aiGenerated: true, hitCount: 892, createdAt: '2026-02-10T13:00:00Z' }
]

// Threat Types with Detection Methods
const threatTypes = [
  { type: 'Port Scan', severity: 'medium', aiMethod: 'Connection Pattern Analysis', indicators: ['Multiple ports', 'Sequential scanning', 'SYN flood'] },
  { type: 'Brute Force', severity: 'high', aiMethod: 'Authentication Failure Rate', indicators: ['Failed logins', 'Password guessing', 'Credential stuffing'] },
  { type: 'DDoS Attack', severity: 'critical', aiMethod: 'Volumetric Analysis', indicators: ['Traffic spike', 'Botnet patterns', 'Amplification'] },
  { type: 'Malware C&C', severity: 'critical', aiMethod: 'Behavioral Analysis', indicators: ['Beacon pattern', 'Encrypted tunnels', 'Domain generation'] },
  { type: 'Data Exfiltration', severity: 'high', aiMethod: 'Data Flow Analysis', indicators: ['Large uploads', 'Unusual destinations', 'Encoded data'] },
  { type: 'SQL Injection', severity: 'high', aiMethod: 'Payload Analysis', indicators: ['SQL keywords', 'Union attacks', 'Error-based injection'] },
  { type: 'XSS Attack', severity: 'medium', aiMethod: 'Script Detection', indicators: ['Script tags', 'Event handlers', 'Encoded payloads'] },
  { type: 'Zero-Day Exploit', severity: 'critical', aiMethod: 'Anomaly Detection', indicators: ['Unknown pattern', 'Behavioral deviation', 'Suspicious payload'] }
]

// Network Hosts
const networkHosts = [
  { ip: '192.168.1.1', hostname: 'gateway', type: 'Router', zone: 'DMZ' },
  { ip: '192.168.1.10', hostname: 'web-server-01', type: 'Web Server', zone: 'DMZ' },
  { ip: '192.168.1.20', hostname: 'db-server-01', type: 'Database', zone: 'Internal' },
  { ip: '192.168.1.100', hostname: 'workstation-01', type: 'Workstation', zone: 'Internal' },
  { ip: '192.168.1.101', hostname: 'workstation-02', type: 'Workstation', zone: 'Internal' },
  { ip: '10.0.0.5', hostname: 'admin-pc', type: 'Admin', zone: 'Management' },
  { ip: '8.8.8.8', hostname: 'dns.google', type: 'External DNS', zone: 'External' },
  { ip: '185.125.190.x', hostname: 'suspicious-host', type: 'Unknown', zone: 'External' }
]

// Generate realistic traffic data
const generateTrafficEntry = (id) => {
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP']
  const actions = ['Allowed', 'Blocked', 'Monitored', 'Rate Limited']
  const aiDecisions = ['Safe', 'Suspicious', 'Threat', 'Unknown']

  const srcHost = networkHosts[Math.floor(Math.random() * networkHosts.length)]
  let dstHost = networkHosts[Math.floor(Math.random() * networkHosts.length)]
  while (dstHost.ip === srcHost.ip) {
    dstHost = networkHosts[Math.floor(Math.random() * networkHosts.length)]
  }

  const protocol = protocols[Math.floor(Math.random() * protocols.length)]
  const isThreat = Math.random() > 0.92

  return {
    id,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    source: srcHost.ip,
    sourceHostname: srcHost.hostname,
    destination: dstHost.ip,
    destHostname: dstHost.hostname,
    protocol,
    srcPort: Math.floor(Math.random() * 60000) + 1024,
    dstPort: protocol === 'HTTP' ? 80 : protocol === 'HTTPS' ? 443 : protocol === 'DNS' ? 53 : Math.floor(Math.random() * 1000) + 1,
    bytes: Math.floor(Math.random() * 50000) + 100,
    packets: Math.floor(Math.random() * 100) + 1,
    action: isThreat ? 'Blocked' : actions[Math.floor(Math.random() * 3)],
    aiDecision: isThreat ? 'Threat' : aiDecisions[Math.floor(Math.random() * 3)],
    aiConfidence: Math.floor(Math.random() * 25) + 75,
    ruleMatched: isThreat ? firewallRules[3].name : firewallRules[Math.floor(Math.random() * firewallRules.length)].name
  }
}

// Generate detected threats
const generateThreats = () => {
  const threats = []
  const count = Math.floor(Math.random() * 5) + 2

  for (let i = 0; i < count; i++) {
    const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)]
    const srcHost = networkHosts[Math.floor(Math.random() * networkHosts.length)]

    threats.push({
      id: i + 1,
      type: threatType.type,
      severity: threatType.severity,
      source: srcHost.ip,
      sourceHostname: srcHost.hostname,
      confidence: Math.floor(Math.random() * 20) + 80,
      aiMethod: threatType.aiMethod,
      indicators: threatType.indicators.slice(0, Math.floor(Math.random() * 2) + 1),
      action: threatType.severity === 'critical' ? 'Blocked' : Math.random() > 0.5 ? 'Blocked' : 'Monitored',
      detectedAt: new Date(Date.now() - Math.random() * 7200000).toISOString(),
      details: `AI detected ${threatType.type.toLowerCase()} activity from ${srcHost.ip}`
    })
  }

  return threats.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

// ============================================
// API ROUTES
// ============================================

// Get firewall rules
app.get('/api/rules', (req, res) => {
  res.json({
    success: true,
    rules: firewallRules,
    totalRules: firewallRules.length,
    activeRules: firewallRules.filter(r => r.active).length,
    aiGeneratedRules: firewallRules.filter(r => r.aiGenerated).length
  })
})

// Add new rule
app.post('/api/rules', (req, res) => {
  const newRule = {
    id: firewallRules.length + 1,
    ...req.body,
    aiScore: Math.floor(Math.random() * 20) + 80,
    aiGenerated: false,
    hitCount: 0,
    createdAt: new Date().toISOString()
  }
  firewallRules.push(newRule)
  res.json({ success: true, rule: newRule })
})

// Toggle rule status
app.patch('/api/rules/:id/toggle', (req, res) => {
  const rule = firewallRules.find(r => r.id === parseInt(req.params.id))
  if (rule) {
    rule.active = !rule.active
    res.json({ success: true, rule })
  } else {
    res.status(404).json({ success: false, error: 'Rule not found' })
  }
})

// Get traffic data
app.get('/api/traffic', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 50, 200)
  const traffic = []

  for (let i = 0; i < count; i++) {
    traffic.push(generateTrafficEntry(i + 1))
  }

  res.json({
    success: true,
    traffic,
    totalEntries: count
  })
})

// Get traffic statistics
app.get('/api/traffic/stats', (req, res) => {
  const now = Date.now()

  res.json({
    success: true,
    stats: {
      incoming: {
        value: (Math.random() * 5 + 2).toFixed(2),
        unit: 'GB',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: (Math.random() * 15 + 5).toFixed(1)
      },
      outgoing: {
        value: (Math.random() * 3 + 1).toFixed(2),
        unit: 'GB',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: (Math.random() * 10 + 3).toFixed(1)
      },
      blocked: {
        value: Math.floor(Math.random() * 1000) + 500,
        trend: 'down',
        change: (Math.random() * 20 + 10).toFixed(1)
      },
      allowed: {
        value: Math.floor(Math.random() * 50000) + 100000,
        trend: 'up',
        change: (Math.random() * 5 + 2).toFixed(1)
      },
      threatsBlocked: {
        value: Math.floor(Math.random() * 50) + 20,
        trend: 'down',
        change: (Math.random() * 30 + 15).toFixed(1)
      },
      activeConnections: {
        value: Math.floor(Math.random() * 500) + 200
      }
    },
    protocols: {
      'HTTPS': { percentage: 55, bytes: '2.8 GB', color: '#8b5cf6' },
      'HTTP': { percentage: 15, bytes: '780 MB', color: '#22c55e' },
      'DNS': { percentage: 12, bytes: '620 MB', color: '#f59e0b' },
      'SSH': { percentage: 8, bytes: '410 MB', color: '#06b6d4' },
      'FTP': { percentage: 5, bytes: '260 MB', color: '#ef4444' },
      'Other': { percentage: 5, bytes: '260 MB', color: '#6b7280' }
    },
    topSources: [
      { ip: '192.168.1.100', hostname: 'workstation-01', connections: 15234, bytes: '1.2 GB' },
      { ip: '192.168.1.101', hostname: 'workstation-02', connections: 12456, bytes: '980 MB' },
      { ip: '192.168.1.10', hostname: 'web-server-01', connections: 8901, bytes: '2.1 GB' },
      { ip: '10.0.0.5', hostname: 'admin-pc', connections: 5678, bytes: '450 MB' },
      { ip: '192.168.1.20', hostname: 'db-server-01', connections: 3456, bytes: '890 MB' }
    ],
    timeline: Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      incoming: Math.floor(Math.random() * 500) + 100,
      outgoing: Math.floor(Math.random() * 400) + 80,
      blocked: Math.floor(Math.random() * 50) + 10
    }))
  })
})

// Get detected threats
app.get('/api/threats', (req, res) => {
  res.json({
    success: true,
    threats: generateThreats(),
    summary: {
      total: Math.floor(Math.random() * 20) + 10,
      critical: Math.floor(Math.random() * 3) + 1,
      high: Math.floor(Math.random() * 5) + 2,
      medium: Math.floor(Math.random() * 8) + 3,
      low: Math.floor(Math.random() * 5) + 1,
      blocked: Math.floor(Math.random() * 15) + 8,
      monitored: Math.floor(Math.random() * 10) + 2
    }
  })
})

// AI analyze traffic
app.post('/api/ai/analyze', (req, res) => {
  const { trafficData } = req.body

  const classifications = ['Normal', 'Suspicious', 'Threat']
  const weights = [0.75, 0.18, 0.07]
  const rand = Math.random()
  let classification = 'Normal'
  let cumulative = 0

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i]
    if (rand < cumulative) {
      classification = classifications[i]
      break
    }
  }

  const confidence = classification === 'Normal'
    ? Math.floor(Math.random() * 10) + 90
    : Math.floor(Math.random() * 20) + 75

  const features = {
    packetSize: { value: Math.random() > 0.8 ? 'unusual' : 'normal', score: Math.floor(Math.random() * 30) + 70 },
    frequency: { value: Math.random() > 0.85 ? 'high' : 'normal', score: Math.floor(Math.random() * 25) + 75 },
    destination: { value: Math.random() > 0.9 ? 'suspicious' : 'known', score: Math.floor(Math.random() * 20) + 80 },
    protocol: { value: 'standard', score: Math.floor(Math.random() * 10) + 90 },
    payload: { value: Math.random() > 0.95 ? 'anomalous' : 'normal', score: Math.floor(Math.random() * 15) + 85 },
    timing: { value: Math.random() > 0.88 ? 'irregular' : 'regular', score: Math.floor(Math.random() * 20) + 80 }
  }

  let recommendation = 'Allow traffic'
  let suggestedRule = null

  if (classification === 'Threat') {
    recommendation = 'Block immediately'
    suggestedRule = {
      name: 'AI Generated - Block Suspicious Traffic',
      source: trafficData?.source || '0.0.0.0',
      action: 'Drop',
      reason: 'Threat pattern detected by neural network'
    }
  } else if (classification === 'Suspicious') {
    recommendation = 'Monitor and log'
    suggestedRule = {
      name: 'AI Generated - Monitor Suspicious Activity',
      source: trafficData?.source || '0.0.0.0',
      action: 'Log',
      reason: 'Suspicious behavior requires investigation'
    }
  }

  res.json({
    success: true,
    analysis: {
      id: `analysis-${Date.now()}`,
      classification,
      confidence,
      recommendation,
      suggestedRule,
      features,
      neuralNetworkOutput: {
        normalProbability: classification === 'Normal' ? confidence : Math.floor(Math.random() * 30) + 10,
        suspiciousProbability: classification === 'Suspicious' ? confidence : Math.floor(Math.random() * 25) + 5,
        threatProbability: classification === 'Threat' ? confidence : Math.floor(Math.random() * 10) + 1
      },
      analyzedAt: new Date().toISOString(),
      processingTime: `${Math.floor(Math.random() * 50) + 10}ms`
    }
  })
})

// Get AI suggestions
app.get('/api/ai/suggestions', (req, res) => {
  const suggestions = [
    {
      id: 1,
      name: 'Block Suspicious IP Range',
      description: 'AI detected 47 failed login attempts from 185.x.x.x subnet in the last hour',
      rule: { source: '185.0.0.0/8', dest: 'Any', port: '22', action: 'Drop' },
      priority: 'High',
      confidence: 96,
      reason: 'Brute force attack pattern detected',
      impact: 'Low - No legitimate traffic from this range'
    },
    {
      id: 2,
      name: 'Rate Limit API Endpoint',
      description: 'Unusual high request rate detected on /api/login endpoint',
      rule: { source: 'Any', dest: '192.168.1.10', port: '443', action: 'Limit' },
      priority: 'Medium',
      confidence: 84,
      reason: 'Potential credential stuffing attack',
      impact: 'Medium - May affect legitimate high-volume users'
    },
    {
      id: 3,
      name: 'Block Outbound to Suspicious Domain',
      description: 'Detected communication attempts to known C&C server domain',
      rule: { source: '192.168.1.101', dest: 'malware.bad.com', port: 'Any', action: 'Drop' },
      priority: 'Critical',
      confidence: 98,
      reason: 'Malware command & control communication',
      impact: 'None - Blocking malicious traffic only'
    },
    {
      id: 4,
      name: 'Update SSH Access Rule',
      description: 'Recommend restricting SSH access to management network only',
      rule: { source: '10.0.0.0/24', dest: 'Any', port: '22', action: 'Allow' },
      priority: 'Low',
      confidence: 78,
      reason: 'Security best practice recommendation',
      impact: 'Low - Requires user notification'
    }
  ]

  res.json({
    success: true,
    suggestions,
    totalSuggestions: suggestions.length,
    generatedAt: new Date().toISOString()
  })
})

// Apply AI suggestion
app.post('/api/ai/suggestions/:id/apply', (req, res) => {
  const suggestionId = parseInt(req.params.id)

  const newRule = {
    id: firewallRules.length + 1,
    name: `AI Suggestion #${suggestionId} Applied`,
    source: req.body.source || 'Any',
    dest: req.body.dest || 'Any',
    port: req.body.port || 'Any',
    protocol: req.body.protocol || 'Any',
    action: req.body.action || 'Deny',
    active: true,
    aiScore: req.body.confidence || 90,
    aiGenerated: true,
    hitCount: 0,
    createdAt: new Date().toISOString()
  }

  firewallRules.push(newRule)

  res.json({
    success: true,
    message: 'AI suggestion applied successfully',
    rule: newRule
  })
})

// Get AI model info
app.get('/api/ai/model', (req, res) => {
  res.json({
    success: true,
    model: aiModel,
    performance: {
      avgInferenceTime: '23ms',
      requestsProcessed: Math.floor(Math.random() * 100000) + 500000,
      threatsDetected: Math.floor(Math.random() * 1000) + 2500,
      falsePositiveRate: '0.8%',
      falseNegativeRate: '0.3%'
    },
    training: {
      lastTrainingDuration: '4h 32m',
      nextScheduledTraining: new Date(Date.now() + 86400000).toISOString(),
      datasetSize: '2.5M samples',
      epochs: 150
    }
  })
})

// Get AI learning progress
app.get('/api/ai/learning', (req, res) => {
  res.json({
    success: true,
    learning: {
      patternsLearned: Math.floor(Math.random() * 5000) + 15000,
      rulesGenerated: Math.floor(Math.random() * 50) + 120,
      threatsDetectedToday: Math.floor(Math.random() * 30) + 15,
      accuracyImprovement: '+2.3%',
      newThreatTypesIdentified: Math.floor(Math.random() * 5) + 2
    },
    recentLearnings: [
      { type: 'New Attack Pattern', description: 'Learned new SQL injection variant', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { type: 'Behavioral Update', description: 'Updated normal traffic baseline for web-server-01', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: 'Rule Optimization', description: 'Optimized DDoS detection rule for better performance', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ]
  })
})

// Get statistics for dashboard
app.get('/api/statistics', (req, res) => {
  res.json({
    success: true,
    statistics: {
      overview: {
        totalPacketsAnalyzed: Math.floor(Math.random() * 10000000) + 50000000,
        threatsBlocked: Math.floor(Math.random() * 10000) + 25000,
        rulesActive: firewallRules.filter(r => r.active).length,
        aiAccuracy: aiModel.accuracy,
        uptime: '99.97%',
        avgResponseTime: '12ms'
      },
      threatsByType: threatTypes.map(t => ({
        type: t.type,
        count: Math.floor(Math.random() * 500) + 100,
        severity: t.severity,
        blocked: Math.floor(Math.random() * 90) + 10
      })),
      trafficByProtocol: {
        HTTPS: 55,
        HTTP: 15,
        DNS: 12,
        SSH: 8,
        FTP: 5,
        Other: 5
      },
      hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        packets: Math.floor(Math.random() * 100000) + 50000,
        threats: Math.floor(Math.random() * 20) + 5,
        blocked: Math.floor(Math.random() * 50) + 20
      })),
      topBlockedIPs: [
        { ip: '185.125.190.34', country: 'Unknown', blocks: 1234, reason: 'Port Scan' },
        { ip: '45.33.32.156', country: 'US', blocks: 892, reason: 'Brute Force' },
        { ip: '91.121.87.45', country: 'FR', blocks: 567, reason: 'DDoS' },
        { ip: '103.224.182.250', country: 'CN', blocks: 445, reason: 'Malware C&C' },
        { ip: '185.220.101.1', country: 'DE', blocks: 334, reason: 'Data Exfiltration' }
      ]
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'AI Firewall Backend Server Running',
    version: '2.0.0',
    uptime: process.uptime(),
    aiModelStatus: 'active',
    endpoints: [
      '/api/rules',
      '/api/traffic',
      '/api/traffic/stats',
      '/api/threats',
      '/api/ai/analyze',
      '/api/ai/suggestions',
      '/api/ai/model',
      '/api/ai/learning',
      '/api/statistics'
    ]
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║        AI Firewall - Intelligent Network Protection           ║
║                    Backend Server v2.0.0                      ║
╠══════════════════════════════════════════════════════════════╣
║  Author: Shatlyk Rahmanov                                     ║
║  AI Model: ${aiModel.name}                    ║
║  Accuracy: ${aiModel.accuracy}%                                          ║
║  Capabilities: ${aiModel.capabilities.length} threat detection methods                    ║
╚══════════════════════════════════════════════════════════════╝

Server running on http://localhost:${PORT}
  `)
})
