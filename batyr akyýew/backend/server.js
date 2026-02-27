const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 4001

app.use(cors())
app.use(express.json())

// ============================================
// WAF WITH BEHAVIORAL ANALYSIS
// Author: Batyr Akyýew
// ============================================

// Attack patterns database
const attackPatterns = {
  sqlInjection: {
    name: 'SQL Injection',
    patterns: ["' OR '1'='1", "'; DROP TABLE", "UNION SELECT", "1=1--", "' OR 1=1"],
    severity: 'critical',
    description: 'SQL code injection attempt'
  },
  xss: {
    name: 'Cross-Site Scripting (XSS)',
    patterns: ['<script>', 'javascript:', 'onerror=', 'onload=', '<img src=x'],
    severity: 'high',
    description: 'Malicious script injection'
  },
  pathTraversal: {
    name: 'Path Traversal',
    patterns: ['../', '..\\', '/etc/passwd', 'C:\\Windows'],
    severity: 'high',
    description: 'Directory traversal attempt'
  },
  commandInjection: {
    name: 'Command Injection',
    patterns: ['; ls', '| cat', '&& rm', '`whoami`', '$(id)'],
    severity: 'critical',
    description: 'OS command injection'
  },
  bruteForce: {
    name: 'Brute Force',
    threshold: 5,
    timeWindow: 60000,
    severity: 'medium',
    description: 'Multiple failed login attempts'
  },
  rateLimit: {
    name: 'Rate Limit Exceeded',
    threshold: 100,
    timeWindow: 60000,
    severity: 'low',
    description: 'Too many requests'
  }
}

// WAF Rules
let wafRules = [
  { id: 1, name: 'Block SQL Injection', pattern: 'SQL Keywords', action: 'block', enabled: true, hits: 1523, severity: 'critical' },
  { id: 2, name: 'Block XSS Attacks', pattern: 'Script Tags', action: 'block', enabled: true, hits: 892, severity: 'high' },
  { id: 3, name: 'Block Path Traversal', pattern: 'Directory Patterns', action: 'block', enabled: true, hits: 456, severity: 'high' },
  { id: 4, name: 'Rate Limiting', pattern: '100 req/min', action: 'limit', enabled: true, hits: 2341, severity: 'medium' },
  { id: 5, name: 'Block Command Injection', pattern: 'Shell Commands', action: 'block', enabled: true, hits: 234, severity: 'critical' },
  { id: 6, name: 'Geographic Blocking', pattern: 'Blocked Countries', action: 'block', enabled: false, hits: 0, severity: 'low' },
  { id: 7, name: 'Bot Detection', pattern: 'User-Agent Analysis', action: 'challenge', enabled: true, hits: 5678, severity: 'medium' },
  { id: 8, name: 'Session Anomaly', pattern: 'Behavioral Analysis', action: 'alert', enabled: true, hits: 123, severity: 'high' }
]

// Behavioral profiles storage
const userProfiles = new Map()

// Request history for behavioral analysis
const requestHistory = []

// Blocked IPs
const blockedIPs = new Set(['185.220.101.1', '45.33.32.156', '91.121.87.45'])

// Generate user behavior profile
const generateBehaviorProfile = (sessionId) => {
  return {
    sessionId,
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    requestCount: Math.floor(Math.random() * 100) + 10,
    avgRequestInterval: Math.floor(Math.random() * 5000) + 1000,
    commonPaths: ['/api/data', '/api/user', '/dashboard'],
    commonMethods: ['GET', 'POST'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    riskScore: Math.floor(Math.random() * 40),
    anomalyCount: Math.floor(Math.random() * 3),
    isBot: Math.random() > 0.9,
    behavioral: {
      typingSpeed: Math.floor(Math.random() * 100) + 50,
      mouseMovement: Math.random() > 0.2,
      scrollPattern: Math.random() > 0.3 ? 'natural' : 'suspicious',
      sessionDuration: Math.floor(Math.random() * 3600) + 60,
      pageViewPattern: Math.random() > 0.1 ? 'normal' : 'anomalous'
    }
  }
}

// Analyze request for attacks
const analyzeRequest = (request) => {
  const { url, body, headers, method, ip } = request
  const detectedThreats = []
  let riskScore = 0

  // Check blocked IPs
  if (blockedIPs.has(ip)) {
    detectedThreats.push({
      type: 'Blocked IP',
      severity: 'critical',
      action: 'blocked',
      details: `IP ${ip} is in blocklist`
    })
    riskScore += 100
  }

  // Check SQL Injection
  const sqlPatterns = attackPatterns.sqlInjection.patterns
  const content = JSON.stringify({ url, body })
  for (const pattern of sqlPatterns) {
    if (content.toLowerCase().includes(pattern.toLowerCase())) {
      detectedThreats.push({
        type: 'SQL Injection',
        severity: 'critical',
        action: 'blocked',
        pattern: pattern,
        details: 'SQL injection pattern detected'
      })
      riskScore += 40
      break
    }
  }

  // Check XSS
  const xssPatterns = attackPatterns.xss.patterns
  for (const pattern of xssPatterns) {
    if (content.toLowerCase().includes(pattern.toLowerCase())) {
      detectedThreats.push({
        type: 'XSS Attack',
        severity: 'high',
        action: 'blocked',
        pattern: pattern,
        details: 'Cross-site scripting pattern detected'
      })
      riskScore += 30
      break
    }
  }

  // Check Path Traversal
  const pathPatterns = attackPatterns.pathTraversal.patterns
  for (const pattern of pathPatterns) {
    if (content.includes(pattern)) {
      detectedThreats.push({
        type: 'Path Traversal',
        severity: 'high',
        action: 'blocked',
        pattern: pattern,
        details: 'Directory traversal attempt detected'
      })
      riskScore += 30
      break
    }
  }

  // Check Command Injection
  const cmdPatterns = attackPatterns.commandInjection.patterns
  for (const pattern of cmdPatterns) {
    if (content.includes(pattern)) {
      detectedThreats.push({
        type: 'Command Injection',
        severity: 'critical',
        action: 'blocked',
        pattern: pattern,
        details: 'OS command injection detected'
      })
      riskScore += 40
      break
    }
  }

  return {
    isBlocked: riskScore >= 30,
    riskScore: Math.min(riskScore, 100),
    threats: detectedThreats,
    action: riskScore >= 30 ? 'block' : riskScore >= 10 ? 'monitor' : 'allow'
  }
}

// Behavioral analysis
const analyzeBehavior = (sessionId, request) => {
  let profile = userProfiles.get(sessionId)

  if (!profile) {
    profile = generateBehaviorProfile(sessionId)
    userProfiles.set(sessionId, profile)
  }

  const anomalies = []
  let behaviorScore = 0

  // Check request frequency
  if (profile.requestCount > 50 && profile.avgRequestInterval < 500) {
    anomalies.push({ type: 'High Request Frequency', severity: 'medium', score: 15 })
    behaviorScore += 15
  }

  // Check for bot-like behavior
  if (profile.isBot) {
    anomalies.push({ type: 'Bot-like Behavior', severity: 'high', score: 25 })
    behaviorScore += 25
  }

  // Check scroll pattern
  if (profile.behavioral.scrollPattern === 'suspicious') {
    anomalies.push({ type: 'Suspicious Scroll Pattern', severity: 'low', score: 10 })
    behaviorScore += 10
  }

  // Check page view pattern
  if (profile.behavioral.pageViewPattern === 'anomalous') {
    anomalies.push({ type: 'Anomalous Navigation', severity: 'medium', score: 15 })
    behaviorScore += 15
  }

  // Check typing speed (if applicable)
  if (profile.behavioral.typingSpeed > 120) {
    anomalies.push({ type: 'Unusually Fast Input', severity: 'medium', score: 10 })
    behaviorScore += 10
  }

  return {
    sessionId,
    profile,
    anomalies,
    behaviorScore,
    isAnomaly: behaviorScore >= 25,
    recommendation: behaviorScore >= 40 ? 'block' : behaviorScore >= 25 ? 'challenge' : 'allow'
  }
}

// Generate attack logs
const generateAttackLog = () => {
  const attackTypes = ['SQL Injection', 'XSS', 'Path Traversal', 'Brute Force', 'Bot Traffic', 'Rate Limit']
  const actions = ['blocked', 'allowed', 'challenged', 'monitored']
  const ips = ['185.220.101.x', '45.33.32.x', '192.168.1.x', '10.0.0.x', '172.16.0.x']

  return {
    id: uuidv4(),
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
    sourceIP: ips[Math.floor(Math.random() * ips.length)],
    targetPath: ['/api/login', '/api/admin', '/api/data', '/upload'][Math.floor(Math.random() * 4)],
    action: actions[Math.floor(Math.random() * actions.length)],
    riskScore: Math.floor(Math.random() * 100),
    userAgent: 'Mozilla/5.0 (compatible)',
    country: ['US', 'CN', 'RU', 'DE', 'Unknown'][Math.floor(Math.random() * 5)]
  }
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'WAF Behavioral Analysis Server Running',
    version: '1.0.0',
    uptime: process.uptime()
  })
})

// Get WAF rules
app.get('/api/rules', (req, res) => {
  res.json({
    success: true,
    rules: wafRules,
    totalRules: wafRules.length,
    activeRules: wafRules.filter(r => r.enabled).length
  })
})

// Toggle rule
app.patch('/api/rules/:id/toggle', (req, res) => {
  const rule = wafRules.find(r => r.id === parseInt(req.params.id))
  if (rule) {
    rule.enabled = !rule.enabled
    res.json({ success: true, rule })
  } else {
    res.status(404).json({ success: false, error: 'Rule not found' })
  }
})

// Analyze request
app.post('/api/analyze', (req, res) => {
  const { url, body, headers, method, ip } = req.body

  const requestAnalysis = analyzeRequest({ url, body, headers, method, ip: ip || '192.168.1.1' })
  const sessionId = req.body.sessionId || uuidv4()
  const behaviorAnalysis = analyzeBehavior(sessionId, req.body)

  const combinedRiskScore = Math.min(
    Math.round((requestAnalysis.riskScore + behaviorAnalysis.behaviorScore) / 2),
    100
  )

  res.json({
    success: true,
    analysis: {
      request: requestAnalysis,
      behavior: behaviorAnalysis,
      combinedRiskScore,
      finalAction: requestAnalysis.isBlocked ? 'block' : behaviorAnalysis.recommendation,
      timestamp: new Date().toISOString()
    }
  })
})

// Get attack logs
app.get('/api/logs', (req, res) => {
  const logs = []
  for (let i = 0; i < 50; i++) {
    logs.push(generateAttackLog())
  }
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  res.json({
    success: true,
    logs,
    totalLogs: logs.length
  })
})

// Get statistics
app.get('/api/statistics', (req, res) => {
  res.json({
    success: true,
    statistics: {
      overview: {
        totalRequests: Math.floor(Math.random() * 1000000) + 500000,
        blockedRequests: Math.floor(Math.random() * 50000) + 10000,
        challengedRequests: Math.floor(Math.random() * 20000) + 5000,
        allowedRequests: Math.floor(Math.random() * 900000) + 400000,
        blockRate: (Math.random() * 5 + 2).toFixed(2) + '%'
      },
      attackTypes: [
        { type: 'SQL Injection', count: Math.floor(Math.random() * 5000) + 1000, blocked: 99 },
        { type: 'XSS', count: Math.floor(Math.random() * 4000) + 800, blocked: 98 },
        { type: 'Path Traversal', count: Math.floor(Math.random() * 2000) + 500, blocked: 97 },
        { type: 'Brute Force', count: Math.floor(Math.random() * 8000) + 2000, blocked: 95 },
        { type: 'Bot Traffic', count: Math.floor(Math.random() * 15000) + 5000, blocked: 85 },
        { type: 'Rate Limit', count: Math.floor(Math.random() * 10000) + 3000, blocked: 100 }
      ],
      behavioral: {
        totalSessions: Math.floor(Math.random() * 100000) + 50000,
        anomalousSessions: Math.floor(Math.random() * 5000) + 1000,
        botSessions: Math.floor(Math.random() * 3000) + 500,
        averageSessionDuration: Math.floor(Math.random() * 300) + 60,
        detectionAccuracy: (95 + Math.random() * 4).toFixed(1) + '%'
      },
      timeline: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        requests: Math.floor(Math.random() * 50000) + 10000,
        blocked: Math.floor(Math.random() * 2000) + 500,
        anomalies: Math.floor(Math.random() * 100) + 20
      })),
      topBlockedIPs: [
        { ip: '185.220.101.1', country: 'Unknown', blocks: 4523, attacks: ['SQL Injection', 'XSS'] },
        { ip: '45.33.32.156', country: 'US', blocks: 3421, attacks: ['Brute Force'] },
        { ip: '91.121.87.45', country: 'FR', blocks: 2134, attacks: ['Bot Traffic'] },
        { ip: '103.224.182.250', country: 'CN', blocks: 1876, attacks: ['Path Traversal'] },
        { ip: '193.34.167.89', country: 'RU', blocks: 1234, attacks: ['SQL Injection'] }
      ]
    }
  })
})

// Get behavioral analysis data
app.get('/api/behavioral', (req, res) => {
  const sessions = []
  for (let i = 0; i < 20; i++) {
    sessions.push(generateBehaviorProfile(uuidv4()))
  }

  res.json({
    success: true,
    sessions,
    summary: {
      totalSessions: sessions.length,
      anomalous: sessions.filter(s => s.riskScore > 30).length,
      bots: sessions.filter(s => s.isBot).length,
      avgRiskScore: Math.round(sessions.reduce((a, b) => a + b.riskScore, 0) / sessions.length)
    }
  })
})

// Test attack endpoint (for demo)
app.post('/api/test-attack', (req, res) => {
  const { attackType } = req.body
  let testPayload = {}

  switch (attackType) {
    case 'sql':
      testPayload = { url: "/api/users?id=1' OR '1'='1", body: {} }
      break
    case 'xss':
      testPayload = { url: '/api/comment', body: { text: '<script>alert("XSS")</script>' } }
      break
    case 'path':
      testPayload = { url: '/api/files?path=../../../etc/passwd', body: {} }
      break
    case 'cmd':
      testPayload = { url: '/api/exec', body: { command: '; cat /etc/passwd' } }
      break
    default:
      testPayload = { url: '/api/normal', body: { data: 'normal request' } }
  }

  const analysis = analyzeRequest({ ...testPayload, ip: '192.168.1.100' })

  res.json({
    success: true,
    attackType,
    testPayload,
    analysis
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║       WAF with Behavioral Analysis - Backend Server          ║
║                       Version 1.0.0                          ║
╠══════════════════════════════════════════════════════════════╣
║  Author: Batyr Akyýew                                        ║
║  Features: Attack Detection, Behavioral Analysis, WAF Rules  ║
╚══════════════════════════════════════════════════════════════╝

Server running on http://localhost:${PORT}
  `)
})
