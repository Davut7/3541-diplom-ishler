const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 4004

app.use(cors())
app.use(express.json())

// Simulated malware signatures database
const malwareDatabase = {
  signatures: ['4d5a90', 'ffd8ffe0', '504b0304'],
  suspiciousStrings: ['cmd.exe', 'powershell', 'base64', 'eval(', 'CreateRemoteThread'],
  knownHashes: ['abc123', 'def456', 'ghi789']
}

// Scan endpoint
app.post('/api/scan', (req, res) => {
  const { fileData, fileName, fileSize } = req.body

  // Simulate analysis
  const hash = crypto.createHash('sha256').update(fileName + Date.now()).digest('hex')
  const riskScore = Math.random() * 100

  let status = 'clean'
  let threatLevel = 0
  const details = []

  if (riskScore > 70) {
    status = 'malware'
    threatLevel = Math.round(riskScore)
    details.push('Malicious code pattern detected')
    details.push('Known malware signature found')
  } else if (riskScore > 40) {
    status = 'suspicious'
    threatLevel = Math.round(riskScore)
    details.push('Suspicious API calls detected')
    details.push('Encrypted strings found')
  }

  res.json({
    success: true,
    result: {
      id: uuidv4(),
      fileName,
      fileSize: fileSize || 'Unknown',
      hash: 'SHA256:' + hash,
      status,
      threatLevel,
      details,
      analyzedAt: new Date().toISOString()
    }
  })
})

// Evasion techniques info
app.get('/api/techniques', (req, res) => {
  res.json({
    success: true,
    techniques: [
      { id: 'polymorphic', name: 'Polymorphic Code', risk: 'high', detectMethod: 'Behavioral analysis' },
      { id: 'metamorphic', name: 'Metamorphic Code', risk: 'critical', detectMethod: 'AI pattern recognition' },
      { id: 'packing', name: 'Packing/Encryption', risk: 'medium', detectMethod: 'Entropy analysis' },
      { id: 'fileless', name: 'Fileless Malware', risk: 'high', detectMethod: 'Memory scanning' },
      { id: 'rootkit', name: 'Rootkits', risk: 'critical', detectMethod: 'Low-level scanning' },
      { id: 'sandbox', name: 'Sandbox Evasion', risk: 'high', detectMethod: 'Multi-environment simulation' }
    ]
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VirusDetect Pro API running', version: '1.0.0' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              VirusDetect Pro Backend Server                   ║
╚══════════════════════════════════════════════════════════════╝
Server running on http://localhost:${PORT}
  `)
})
