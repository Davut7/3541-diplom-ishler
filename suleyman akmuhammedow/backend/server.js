const express = require('express')
const cors = require('cors')
const analyzeRoutes = require('./routes/analyze')

const app = express()
const PORT = process.env.PORT || 4009

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', analyzeRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'OSINT Analyzer API is running',
    version: '1.0.0'
  })
})

// Start server
app.listen(PORT, () => {
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
