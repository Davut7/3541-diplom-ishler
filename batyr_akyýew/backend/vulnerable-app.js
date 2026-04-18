/**
 * INTENTIONALLY VULNERABLE WEB APPLICATION
 * For WAF testing and demonstration purposes ONLY
 *
 * This app has SQL Injection, XSS, Path Traversal, and Command Injection
 * vulnerabilities ON PURPOSE — to demonstrate how the WAF blocks them.
 *
 * Author: Batyr Akyýew
 * Usage: node vulnerable-app.js
 * Then enable WAF proxy to protect this app
 */

const express = require('express')
const app = express()
const PORT = 8888

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Simple "database"
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@company.com' },
  { id: 2, username: 'user1', password: 'pass123', role: 'user', email: 'user1@company.com' },
  { id: 3, username: 'manager', password: 'mgr456', role: 'manager', email: 'mgr@company.com' }
]

const comments = [
  { id: 1, user: 'admin', text: 'Welcome to our website!', date: '2026-04-01' },
  { id: 2, user: 'user1', text: 'Great product, thanks!', date: '2026-04-10' }
]

const files = {
  'report.pdf': 'Annual financial report 2026',
  'readme.txt': 'Welcome to the file server',
  'config.ini': 'database_host=192.168.1.20\ndatabase_password=secret123'
}

// ============================================
// VULNERABLE HTML PAGES
// ============================================

const pageHeader = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TestCorp - Demo Website</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #1e293b, #334155); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ef4444; }
    .header h1 { font-size: 1.4rem; }
    .header h1 span { color: #ef4444; }
    .header nav a { color: #94a3b8; text-decoration: none; margin-left: 1.5rem; font-size: 0.9rem; }
    .header nav a:hover { color: #ef4444; }
    .warning-bar { background: #fbbf24; color: #1a1a1a; text-align: center; padding: 0.4rem; font-weight: 700; font-size: 0.8rem; letter-spacing: 1px; }
    .container { max-width: 800px; margin: 2rem auto; padding: 0 1.5rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .card h2 { color: #ef4444; margin-bottom: 1rem; font-size: 1.2rem; }
    input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #475569; border-radius: 8px; background: #0f172a; color: #e2e8f0; margin-bottom: 0.75rem; font-size: 0.95rem; }
    button { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; }
    button:hover { opacity: 0.9; }
    .result { background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 1rem; margin-top: 1rem; white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; }
    .result.danger { border-color: #ef4444; background: rgba(239,68,68,0.1); }
    .result.success { border-color: #22c55e; background: rgba(34,197,94,0.1); }
    .comment { background: #0f172a; padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid #3b82f6; }
    .comment .user { color: #3b82f6; font-weight: 600; }
    .badge { display: inline-block; background: #ef4444; color: white; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; margin-left: 0.5rem; }
    .footer { text-align: center; padding: 2rem; color: #475569; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="warning-bar">&#9888; INTENTIONALLY VULNERABLE — FOR WAF TESTING ONLY &#9888;</div>
  <div class="header">
    <h1>Test<span>Corp</span></h1>
    <nav>
      <a href="/">Home</a>
      <a href="/login">Login</a>
      <a href="/search">Search</a>
      <a href="/comments">Comments</a>
      <a href="/files">Files</a>
    </nav>
  </div>
`

const pageFooter = `
  <div class="footer">
    <p>TestCorp Demo — Intentionally Vulnerable Web Application</p>
    <p>Protected by WAF Behavioral Analysis v2.0 (when proxy is enabled)</p>
  </div>
</body>
</html>
`

// HOME PAGE
app.get('/', (req, res) => {
  res.send(`${pageHeader}
    <div class="container">
      <div class="card">
        <h2>TestCorp — Demo Web Application</h2>
        <p>This is an intentionally vulnerable web application for demonstrating WAF protection.</p>
        <p style="margin-top: 1rem; color: #f59e0b;">Try these attacks:</p>
        <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: #94a3b8; line-height: 2;">
          <li><strong>SQL Injection</strong> — Go to <a href="/login" style="color: #3b82f6;">Login</a>, enter: <code style="color: #ef4444;">' OR '1'='1</code></li>
          <li><strong>XSS Attack</strong> — Go to <a href="/search" style="color: #3b82f6;">Search</a>, enter: <code style="color: #ef4444;">&lt;script&gt;alert('XSS')&lt;/script&gt;</code></li>
          <li><strong>Path Traversal</strong> — Go to <a href="/files" style="color: #3b82f6;">Files</a>, enter: <code style="color: #ef4444;">../../../etc/passwd</code></li>
          <li><strong>Command Injection</strong> — Go to <a href="/search" style="color: #3b82f6;">Search</a>, enter: <code style="color: #ef4444;">; cat /etc/passwd</code></li>
        </ul>
        <p style="margin-top: 1.5rem; color: #22c55e;"><strong>With WAF proxy enabled, all these attacks will be BLOCKED!</strong></p>
      </div>
    </div>
  ${pageFooter}`)
})

// LOGIN PAGE — VULNERABLE TO SQL INJECTION
app.get('/login', (req, res) => {
  res.send(`${pageHeader}
    <div class="container">
      <div class="card">
        <h2>Login <span class="badge">SQL Injection Vulnerable</span></h2>
        <form method="POST" action="/login">
          <input name="username" placeholder="Username (try: ' OR '1'='1)" />
          <input name="password" type="password" placeholder="Password (try: anything)" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  ${pageFooter}`)
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  // INTENTIONALLY VULNERABLE — simulates SQL injection
  // In a real app this would be: SELECT * FROM users WHERE username='X' AND password='Y'
  let found = null

  if (username && username.includes("' OR '1'='1")) {
    // SQL injection detected — return all users (as if the query bypassed auth)
    found = users
  } else if (username && username.includes("'; DROP TABLE")) {
    found = 'TABLE_DROPPED'
  } else {
    found = users.find(u => u.username === username && u.password === password)
  }

  if (found === 'TABLE_DROPPED') {
    res.send(`${pageHeader}
      <div class="container">
        <div class="card">
          <h2>SQL Injection — DROP TABLE</h2>
          <div class="result danger">CRITICAL: SQL Injection executed!
Query: SELECT * FROM users WHERE username=''; DROP TABLE users;--' AND password='...'
Result: Users table DROPPED! All data lost!

This is what happens without WAF protection.</div>
          <a href="/login"><button style="margin-top:1rem">Back to Login</button></a>
        </div>
      </div>
    ${pageFooter}`)
  } else if (Array.isArray(found)) {
    // SQL injection — dumped all users
    const userDump = found.map(u => `ID: ${u.id} | User: ${u.username} | Pass: ${u.password} | Role: ${u.role} | Email: ${u.email}`).join('\n')
    res.send(`${pageHeader}
      <div class="container">
        <div class="card">
          <h2>SQL Injection Successful!</h2>
          <div class="result danger">SQL INJECTION ATTACK SUCCEEDED!
Query: SELECT * FROM users WHERE username='' OR '1'='1' AND password='...'

ALL USER DATA EXPOSED:
${userDump}

Passwords, emails, roles — everything leaked!
Without WAF: attacker gets full database access.</div>
          <a href="/login"><button style="margin-top:1rem">Back to Login</button></a>
        </div>
      </div>
    ${pageFooter}`)
  } else if (found) {
    res.send(`${pageHeader}
      <div class="container">
        <div class="card">
          <h2>Welcome, ${found.username}!</h2>
          <div class="result success">Login successful. Role: ${found.role}</div>
        </div>
      </div>
    ${pageFooter}`)
  } else {
    res.send(`${pageHeader}
      <div class="container">
        <div class="card">
          <h2>Login Failed</h2>
          <div class="result">Invalid username or password.</div>
          <a href="/login"><button style="margin-top:1rem">Try Again</button></a>
        </div>
      </div>
    ${pageFooter}`)
  }
})

// SEARCH PAGE — VULNERABLE TO XSS AND COMMAND INJECTION
app.get('/search', (req, res) => {
  const query = req.query.q || ''

  let resultHTML = ''
  if (query) {
    // INTENTIONALLY VULNERABLE — reflects user input without sanitization
    if (query.includes(';') || query.includes('|') || query.includes('&&')) {
      // Command injection simulation
      resultHTML = `<div class="result danger">COMMAND INJECTION DETECTED!
Server executed: search "${query}"
Output:
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin

Attacker gained access to system files!</div>`
    } else {
      // XSS — reflects input directly (no sanitization)
      resultHTML = `<div class="result danger">Search results for: ${query}

No products found matching your query.

Note: Your search term was reflected in the page WITHOUT sanitization.
If it contained &lt;script&gt; tags, they would execute!</div>`
    }
  }

  res.send(`${pageHeader}
    <div class="container">
      <div class="card">
        <h2>Product Search <span class="badge">XSS Vulnerable</span></h2>
        <form method="GET" action="/search">
          <input name="q" placeholder="Search products (try: <script>alert('XSS')</script>)" value="" />
          <button type="submit">Search</button>
        </form>
        ${resultHTML}
      </div>
    </div>
  ${pageFooter}`)
})

// COMMENTS PAGE — STORED XSS
app.get('/comments', (req, res) => {
  const commentsList = comments.map(c => `
    <div class="comment">
      <span class="user">${c.user}</span> <span style="color:#475569;font-size:0.8rem">${c.date}</span>
      <p style="margin-top:0.5rem">${c.text}</p>
    </div>
  `).join('')

  res.send(`${pageHeader}
    <div class="container">
      <div class="card">
        <h2>User Comments <span class="badge">Stored XSS Vulnerable</span></h2>
        ${commentsList}
        <form method="POST" action="/comments" style="margin-top:1rem">
          <input name="user" placeholder="Your name" />
          <textarea name="text" placeholder="Your comment (try: <img src=x onerror=alert('XSS')>)" rows="3"></textarea>
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  ${pageFooter}`)
})

app.post('/comments', (req, res) => {
  const { user, text } = req.body

  if (user && text) {
    // INTENTIONALLY VULNERABLE — stores unsanitized input
    comments.push({
      id: comments.length + 1,
      user: user,
      text: text, // No sanitization!
      date: new Date().toISOString().split('T')[0]
    })
  }

  res.redirect('/comments')
})

// FILES PAGE — PATH TRAVERSAL VULNERABLE
app.get('/files', (req, res) => {
  const fileList = Object.keys(files).map(f => `<li><a href="/files/download?name=${f}" style="color:#3b82f6">${f}</a></li>`).join('')

  res.send(`${pageHeader}
    <div class="container">
      <div class="card">
        <h2>File Manager <span class="badge">Path Traversal Vulnerable</span></h2>
        <ul style="list-style:none;margin-bottom:1rem;">${fileList}</ul>
        <form method="GET" action="/files/download">
          <input name="name" placeholder="Filename (try: ../../../etc/passwd)" />
          <button type="submit">Download</button>
        </form>
      </div>
    </div>
  ${pageFooter}`)
})

app.get('/files/download', (req, res) => {
  const fileName = req.query.name || ''

  // INTENTIONALLY VULNERABLE — no path validation
  if (fileName.includes('../') || fileName.includes('etc/passwd') || fileName.includes('etc/shadow')) {
    res.send(`${pageHeader}
      <div class="container">
        <div class="card">
          <h2>Path Traversal Attack!</h2>
          <div class="result danger">PATH TRAVERSAL SUCCEEDED!
Requested file: ${fileName}

File contents:
root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false

Attacker accessed sensitive system files outside the web directory!</div>
          <a href="/files"><button style="margin-top:1rem">Back to Files</button></a>
        </div>
      </div>
    ${pageFooter}`)
  } else if (files[fileName]) {
    res.send(`${pageHeader}
      <div class="container">
        <div class="card">
          <h2>File: ${fileName}</h2>
          <div class="result">${files[fileName]}</div>
          <a href="/files"><button style="margin-top:1rem">Back</button></a>
        </div>
      </div>
    ${pageFooter}`)
  } else {
    res.send(`${pageHeader}
      <div class="container">
        <div class="card">
          <h2>File Not Found</h2>
          <div class="result">File "${fileName}" does not exist.</div>
          <a href="/files"><button style="margin-top:1rem">Back</button></a>
        </div>
      </div>
    ${pageFooter}`)
  }
})

// API endpoint (for testing WAF JSON analysis)
app.post('/api/data', (req, res) => {
  res.json({ success: true, message: 'Data received', data: req.body })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vulnerable test app running', port: PORT, vulnerable: true })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║      ⚠  INTENTIONALLY VULNERABLE WEB APPLICATION  ⚠         ║
║              FOR WAF TESTING PURPOSES ONLY                   ║
╠══════════════════════════════════════════════════════════════╣
║  Vulnerabilities:                                            ║
║    • SQL Injection  (/login)                                ║
║    • XSS Attack     (/search, /comments)                    ║
║    • Path Traversal (/files)                                ║
║    • Command Injection (/search)                             ║
╠══════════════════════════════════════════════════════════════╣
║  WITHOUT WAF: All attacks succeed                            ║
║  WITH WAF:    All attacks are BLOCKED                        ║
╚══════════════════════════════════════════════════════════════╝

Test app: http://localhost:${PORT}
  `)
})
