const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// XSS vulnerability patterns for scanning
const vulnerabilityPatterns = [
  { pattern: 'innerHTML', severity: 'critical', type: 'DOM XSS', desc: 'Direct innerHTML assignment' },
  { pattern: 'document.write', severity: 'critical', type: 'DOM XSS', desc: 'document.write usage' },
  { pattern: 'eval(', severity: 'critical', type: 'Code Injection', desc: 'eval function usage' },
  { pattern: 'outerHTML', severity: 'high', type: 'DOM XSS', desc: 'outerHTML manipulation' },
  { pattern: '.html(', severity: 'high', type: 'jQuery XSS', desc: 'jQuery .html() method' },
  { pattern: 'v-html', severity: 'medium', type: 'Vue XSS', desc: 'Vue v-html directive' },
  { pattern: 'dangerouslySetInnerHTML', severity: 'medium', type: 'React XSS', desc: 'React dangerous HTML' }
]

// Scan code for XSS vulnerabilities
app.post('/api/scan', (req, res) => {
  const { code, language } = req.body
  const vulnerabilities = []

  if (code) {
    const lines = code.split('\n')
    lines.forEach((line, index) => {
      vulnerabilityPatterns.forEach(vuln => {
        if (line.toLowerCase().includes(vuln.pattern.toLowerCase())) {
          vulnerabilities.push({
            id: uuidv4(),
            line: index + 1,
            severity: vuln.severity,
            type: vuln.type,
            description: vuln.desc,
            code: line.trim(),
            recommendation: getRecommendation(vuln.pattern)
          })
        }
      })
    })
  }

  res.json({
    success: true,
    scanId: uuidv4(),
    language,
    totalLines: code ? code.split('\n').length : 0,
    vulnerabilities,
    scannedAt: new Date().toISOString()
  })
})

function getRecommendation(pattern) {
  const recommendations = {
    'innerHTML': 'Use textContent or sanitize with DOMPurify',
    'document.write': 'Use DOM manipulation methods instead',
    'eval(': 'Never use eval() with user input',
    'outerHTML': 'Use safe DOM manipulation methods',
    '.html(': 'Use .text() or sanitize input first',
    'v-html': 'Sanitize content before using v-html',
    'dangerouslySetInnerHTML': 'Use DOMPurify to sanitize content'
  }
  return recommendations[pattern] || 'Sanitize all user input'
}

// Sanitize input
app.post('/api/sanitize', (req, res) => {
  const { input, methods } = req.body
  let output = input

  if (methods.includes('htmlEscape')) {
    output = output
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  if (methods.includes('removeScripts')) {
    output = output.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }

  if (methods.includes('removeEvents')) {
    output = output.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  }

  res.json({
    success: true,
    original: input,
    sanitized: output,
    methodsApplied: methods
  })
})

// Get XSS types information
app.get('/api/xss-types', (req, res) => {
  res.json({
    success: true,
    types: [
      {
        id: 'reflected',
        name: 'Reflected XSS',
        description: 'Script is reflected off a web server in error messages, search results, etc.',
        persistence: 'Non-persistent',
        severity: 'high',
        example: 'https://site.com/search?q=<script>alert(1)</script>'
      },
      {
        id: 'stored',
        name: 'Stored XSS',
        description: 'Script is permanently stored on the target server (database, message forums, etc.)',
        persistence: 'Persistent',
        severity: 'critical',
        example: 'Malicious comment stored in database'
      },
      {
        id: 'dom',
        name: 'DOM-based XSS',
        description: 'Attack payload is executed by modifying the DOM in victim\'s browser',
        persistence: 'Non-persistent',
        severity: 'high',
        example: 'URL fragment manipulation: #<script>alert(1)</script>'
      }
    ]
  })
})

// Get defense techniques
app.get('/api/defenses', (req, res) => {
  res.json({
    success: true,
    defenses: [
      { id: 'inputValidation', name: 'Input Validation', effectiveness: 'high' },
      { id: 'outputEncoding', name: 'Output Encoding', effectiveness: 'high' },
      { id: 'csp', name: 'Content Security Policy', effectiveness: 'very high' },
      { id: 'httpOnly', name: 'HttpOnly Cookies', effectiveness: 'medium' },
      { id: 'sanitization', name: 'HTML Sanitization', effectiveness: 'high' }
    ]
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'XSS Shield API running',
    version: '1.0.0'
  })
})

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                XSS Shield Backend Server                      ║
╚══════════════════════════════════════════════════════════════╝
Server running on http://localhost:${PORT}
  `)
})
