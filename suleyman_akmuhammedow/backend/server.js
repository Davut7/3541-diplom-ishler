const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const analyzeRoutes = require('./routes/analyze')

const app = express()
const PORT = process.env.PORT || 7091

// Middleware
app.use(cors())
app.use(express.json())

// Persistent investigation history
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const historyPath = path.join(dataDir, 'investigations.json')

function loadHistory() {
  try { if (fs.existsSync(historyPath)) return JSON.parse(fs.readFileSync(historyPath, 'utf8')) } catch (e) {}
  return { investigations: [] }
}
function saveInvestigation(result) {
  const history = loadHistory()
  history.investigations.unshift({
    id: Date.now(),
    target: result.target,
    ip: result.ip,
    riskScore: result.riskScore,
    riskLevel: result.riskLevel,
    openPorts: result.openPorts?.length || 0,
    country: result.geo?.country || 'Unknown',
    analyzedAt: result.analyzedAt || new Date().toISOString()
  })
  if (history.investigations.length > 50) history.investigations = history.investigations.slice(0, 50)
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
}

// Routes
app.use('/api', analyzeRoutes)

// History endpoints
app.get('/api/history', (req, res) => {
  res.json({ success: true, ...loadHistory() })
})

app.delete('/api/history', (req, res) => {
  fs.writeFileSync(historyPath, JSON.stringify({ investigations: [] }, null, 2))
  res.json({ success: true })
})

// Export saveInvestigation for use in routes
app.locals.saveInvestigation = saveInvestigation

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'OSINT Analyzer API is running',
    version: '1.0.0'
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    OSINT.AI Backend Server                    ║
║                         Version 1.0.0                         ║
╚══════════════════════════════════════════════════════════════╝

Server running on http://localhost:${PORT}
API endpoints:
  POST /api/analyze      - Analyze a target (IP or domain)
  GET  /api/demo         - Get demo analysis data
  GET  /api/health       - Health check
  `)
})
