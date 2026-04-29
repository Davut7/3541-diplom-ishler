// ============================================
// VULNERABLE WEB SHOP — for WAF demo ONLY
// DO NOT deploy to production!
// All vulnerabilities are INTENTIONAL for
// educational/diploma WAF testing purposes
// ============================================

const express = require('express')
const path = require('path')
const fs = require('fs')
// NOTE: execSync used INTENTIONALLY to demonstrate command injection vulnerability
// This is the WHOLE POINT of this vulnerable test application
const { execSync } = require('child_process') // eslint-disable-line security/detect-child-process

const app = express()
const PORT = 7012

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ============================================
// SQLite Database via sql.js (real data)
// ============================================
const initSqlJs = require('sql.js')
let db

async function initDatabase() {
  const SQL = await initSqlJs()
  db = new SQL.Database()

  db.run(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, email TEXT, role TEXT DEFAULT 'user', balance REAL DEFAULT 100.0);
    CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, category TEXT, stock INTEGER DEFAULT 10);
    CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, username TEXT, text TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT, details TEXT, ip TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  `)

  // Seed data
  const count = db.exec('SELECT COUNT(*) FROM users')
  if (count[0].values[0][0] === 0) {
    db.run("INSERT INTO users (username, password, email, role, balance) VALUES ('admin','admin123','admin@shop.local','admin',9999.99)")
    db.run("INSERT INTO users (username, password, email, role, balance) VALUES ('user1','password1','user1@shop.local','user',150.00)")
    db.run("INSERT INTO users (username, password, email, role, balance) VALUES ('user2','password2','user2@shop.local','user',250.00)")
    db.run("INSERT INTO users (username, password, email, role, balance) VALUES ('manager','manager1','mgr@shop.local','manager',500.00)")

    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('Laptop Pro 15','High-performance laptop 16GB RAM, SSD 512GB',1299.99,'electronics',15)")
    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('Wireless Mouse','Ergonomic wireless mouse 2.4GHz',29.99,'accessories',50)")
    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('USB-C Hub','7-in-1 USB-C hub with HDMI',49.99,'accessories',30)")
    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('Mechanical Keyboard','RGB mechanical keyboard Cherry MX',89.99,'accessories',25)")
    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('Monitor 27 inch','4K IPS monitor 144Hz',449.99,'electronics',10)")
    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('Headphones','Noise-cancelling wireless headphones',199.99,'audio',20)")
    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('Webcam HD','1080p webcam with microphone',69.99,'accessories',40)")
    db.run("INSERT INTO products (name, description, price, category, stock) VALUES ('SSD 1TB','NVMe M.2 SSD 1TB 7000MB/s',109.99,'storage',35)")

    db.run("INSERT INTO comments (product_id, username, text) VALUES (1,'user1','Great laptop, very fast!')")
    db.run("INSERT INTO comments (product_id, username, text) VALUES (1,'user2','Battery life could be better')")
    db.run("INSERT INTO comments (product_id, username, text) VALUES (2,'user1','Perfect mouse for daily use')")
    db.run("INSERT INTO comments (product_id, username, text) VALUES (5,'manager','Best monitor in this price range')")

    console.log('[DB] Seeded: 4 users, 8 products, 4 comments')
  }
}

// Helper: run raw SQL and return rows as objects
function queryAll(sql) {
  try {
    const result = db.exec(sql)
    if (!result.length) return []
    const cols = result[0].columns
    return result[0].values.map(row => {
      const obj = {}
      cols.forEach((c, i) => obj[c] = row[i])
      return obj
    })
  } catch (e) { throw e }
}

function queryOne(sql) {
  const rows = queryAll(sql)
  return rows.length ? rows[0] : null
}

// Create sample files for path traversal demo
const filesDir = path.join(__dirname, 'public', 'files')
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true })
  fs.writeFileSync(path.join(filesDir, 'readme.txt'), 'Welcome to the shop file server.\nThis is a public document.')
  fs.writeFileSync(path.join(filesDir, 'prices.csv'), 'product,price\nLaptop,1299.99\nMouse,29.99\nKeyboard,89.99')
  fs.writeFileSync(path.join(filesDir, 'config.txt'), 'DB_HOST=localhost\nDB_USER=shop_admin\nDB_PASS=secret_password_123\nAPI_KEY=sk-live-abc123xyz')
}

// ============================================
// VULN 1: SQL INJECTION (Login)
// Direct string concatenation in SQL query
// ============================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  // INTENTIONALLY VULNERABLE: string concatenation in SQL
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`

  try {
    const user = queryOne(query)
    if (user) {
      try { db.run("INSERT INTO logs (action, details, ip) VALUES ('" + 'login' + "','" + username + "','" + req.ip + "')") } catch(e) {}
      res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role, balance: user.balance } })
    } else {
      res.json({ success: false, error: 'Invalid username or password' })
    }
  } catch (e) {
    // INTENTIONALLY VULNERABLE: exposes SQL error
    res.json({ success: false, error: 'SQL Error: ' + e.message, query })
  }
})

// ============================================
// VULN 2: XSS (Search — reflected, Comments — stored)
// No input sanitization
// ============================================
app.get('/api/search', (req, res) => {
  const { q } = req.query
  if (!q) return res.json({ results: [], query: '' })

  // INTENTIONALLY VULNERABLE: SQL injection + reflected XSS
  const query = `SELECT * FROM products WHERE name LIKE '%${q}%' OR description LIKE '%${q}%' OR category LIKE '%${q}%'`
  try {
    const results = queryAll(query)
    res.json({ results, query: q, total: results.length })
  } catch (e) {
    res.json({ results: [], query: q, error: e.message })
  }
})

app.post('/api/comments', (req, res) => {
  const { product_id, username, text } = req.body
  // INTENTIONALLY VULNERABLE: stored XSS — no sanitization
  try { db.run(`INSERT INTO comments (product_id, username, text) VALUES (${product_id}, '${username}', '${text}')`) } catch(e) {}
  res.json({ success: true })
})

app.get('/api/comments/:productId', (req, res) => {
  const comments = queryAll(`SELECT * FROM comments WHERE product_id = ${req.params.productId} ORDER BY created_at DESC`)
  res.json({ comments })
})

// ============================================
// VULN 3: PATH TRAVERSAL (File viewer)
// No path validation
// ============================================
app.get('/api/files', (req, res) => {
  const { name } = req.query
  if (!name) return res.json({ error: 'No filename' })

  // INTENTIONALLY VULNERABLE: allows ../../etc/passwd
  const filePath = path.join(__dirname, 'public', 'files', name)
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    res.json({ success: true, filename: name, content, path: filePath })
  } catch (e) {
    res.json({ success: false, error: e.message, path: filePath })
  }
})

// ============================================
// VULN 4: COMMAND INJECTION (Network tools)
// Unsanitized input in shell commands
// ============================================
app.post('/api/tools/ping', (req, res) => {
  const { host } = req.body
  if (!host) return res.json({ error: 'No host' })

  // INTENTIONALLY VULNERABLE: command injection via shell
  // e.g. host = "127.0.0.1; cat /etc/passwd"
  const cmd = process.platform === 'win32' ? `ping -n 2 ${host}` : `ping -c 2 ${host}`
  try {
    const output = execSync(cmd, { timeout: 10000, encoding: 'utf-8' })
    res.json({ success: true, host, output })
  } catch (e) {
    res.json({ success: false, host, error: e.stderr || e.message })
  }
})

app.post('/api/tools/lookup', (req, res) => {
  const { domain } = req.body
  if (!domain) return res.json({ error: 'No domain' })

  // INTENTIONALLY VULNERABLE: command injection
  const cmd = process.platform === 'win32' ? `nslookup ${domain}` : `host ${domain}`
  try {
    const output = execSync(cmd, { timeout: 10000, encoding: 'utf-8' })
    res.json({ success: true, domain, output })
  } catch (e) {
    res.json({ success: false, domain, error: e.stderr || e.message })
  }
})

// ============================================
// NORMAL ENDPOINTS
// ============================================
app.get('/api/products', (req, res) => {
  res.json({ products: queryAll('SELECT * FROM products') })
})

app.get('/api/products/:id', (req, res) => {
  const product = queryOne('SELECT * FROM products WHERE id = ' + req.params.id)
  if (!product) return res.status(404).json({ error: 'Not found' })
  const comments = queryAll('SELECT * FROM comments WHERE product_id = ' + req.params.id)
  res.json({ product, comments })
})

// INTENTIONALLY VULNERABLE: exposes all user data
app.get('/api/users', (req, res) => {
  res.json({ users: queryAll('SELECT * FROM users') })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'running', name: 'Vulnerable Shop', port: PORT,
    vulnerabilities: ['SQL Injection', 'XSS (Reflected + Stored)', 'Path Traversal', 'Command Injection'],
    warning: 'INTENTIONALLY VULNERABLE — for WAF testing only'
  })
})

// Serve frontend
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))

initDatabase().then(() => {
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║     VULNERABLE WEB SHOP — for WAF testing ONLY           ║
║     DO NOT deploy to production!                         ║
╠═══════════════════════════════════════════════════════════╣
║  http://localhost:${PORT}                                   ║
║                                                           ║
║  SQL Injection  → POST /api/login                         ║
║  XSS            → GET  /api/search?q=<script>             ║
║  Path Traversal → GET  /api/files?name=../../etc/passwd   ║
║  CMD Injection  → POST /api/tools/ping                    ║
╚═══════════════════════════════════════════════════════════╝
  `)
})
})
