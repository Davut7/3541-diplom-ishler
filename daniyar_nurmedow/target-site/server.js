const express = require('express');
const app = express();
const PORT = 7032;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory storage
let comments = [];
let chatMessages = [];

// ============================================================
// HTML TEMPLATE
// ============================================================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function layout(title, body, activeTab, defenseOn) {
  return `<!DOCTYPE html>
<html lang="tk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - TechShop</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #f5f5f5;
      color: #333;
      min-height: 100vh;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #1a237e, #283593);
      color: white;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      text-decoration: none;
      color: white;
    }
    .logo span { color: #64b5f6; }

    /* Defense Toggle */
    .defense-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.1);
      padding: 8px 16px;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .defense-toggle:hover { background: rgba(255,255,255,0.2); }
    .toggle-switch {
      width: 48px;
      height: 24px;
      background: ${defenseOn ? '#4caf50' : '#f44336'};
      border-radius: 12px;
      position: relative;
      transition: background 0.3s;
    }
    .toggle-switch::after {
      content: '';
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: ${defenseOn ? '26px' : '2px'};
      transition: left 0.3s;
    }
    .toggle-label {
      font-size: 0.85rem;
      font-weight: 600;
    }
    .defense-status {
      font-size: 0.75rem;
      padding: 3px 10px;
      border-radius: 10px;
      font-weight: 600;
      background: ${defenseOn ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'};
      color: ${defenseOn ? '#a5d6a7' : '#ef9a9a'};
    }

    /* Nav */
    .nav {
      background: rgba(0,0,0,0.15);
    }
    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 0;
    }
    .nav a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      padding: 12px 20px;
      font-size: 0.9rem;
      transition: all 0.2s;
      border-bottom: 3px solid transparent;
    }
    .nav a:hover { color: white; background: rgba(255,255,255,0.05); }
    .nav a.active {
      color: white;
      border-bottom-color: #64b5f6;
      background: rgba(255,255,255,0.08);
    }

    /* Main */
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Cards */
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      padding: 24px;
      margin-bottom: 20px;
    }
    .card h2 {
      font-size: 1.3rem;
      margin-bottom: 16px;
      color: #1a237e;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card p.desc {
      color: #666;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }

    /* Forms */
    .form-group { margin-bottom: 12px; }
    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 0.85rem;
      color: #555;
    }
    input[type="text"], input[type="password"], input[type="search"], textarea {
      width: 100%;
      padding: 10px 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #1a237e;
    }
    textarea { resize: vertical; min-height: 80px; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: #1a237e;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:hover { background: #283593; transform: translateY(-1px); }
    .btn-danger { background: #d32f2f; }
    .btn-danger:hover { background: #b71c1c; }
    .btn-sm { padding: 6px 12px; font-size: 0.8rem; }

    /* Search results */
    .search-result {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-top: 16px;
      border-left: 4px solid #1a237e;
    }
    .search-result .label {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 4px;
    }

    /* Comments */
    .comment {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }
    .comment:last-child { border-bottom: none; }
    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .comment-author { font-weight: 600; color: #1a237e; }
    .comment-time { font-size: 0.8rem; color: #999; }
    .comment-text { color: #444; line-height: 1.5; }

    /* Chat */
    .chat-box {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 16px;
    }
    .chat-msg {
      margin-bottom: 10px;
      padding: 8px 12px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .chat-msg .name { font-weight: 600; color: #1a237e; font-size: 0.85rem; }
    .chat-msg .text { margin-top: 4px; color: #444; }

    /* Alert banners */
    .alert {
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 16px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.9rem;
    }
    .alert-danger {
      background: #ffebee;
      border: 1px solid #ef9a9a;
      color: #c62828;
    }
    .alert-success {
      background: #e8f5e9;
      border: 1px solid #a5d6a7;
      color: #2e7d32;
    }
    .alert-info {
      background: #e3f2fd;
      border: 1px solid #90caf9;
      color: #1565c0;
    }
    .alert-icon { font-size: 1.2rem; }

    /* Profile */
    .profile-card {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }
    .avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #1a237e, #283593);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .profile-info { flex: 1; }
    .profile-info h3 { color: #1a237e; margin-bottom: 4px; }
    .profile-info .bio { color: #666; margin-top: 8px; }

    /* Code block */
    .code-block {
      background: #263238;
      color: #e0e0e0;
      padding: 14px 18px;
      border-radius: 8px;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      margin-top: 8px;
    }
    .code-block .keyword { color: #ce93d8; }
    .code-block .string { color: #a5d6a7; }
    .code-block .danger { color: #ef9a9a; }
    .code-block .safe { color: #81c784; }

    /* Footer */
    .footer {
      text-align: center;
      padding: 24px;
      color: #999;
      font-size: 0.85rem;
      margin-top: 40px;
      border-top: 1px solid #eee;
    }

    /* Grid */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

    /* Products */
    .product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .product-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .product-card .price { color: #1a237e; font-weight: 700; font-size: 1.2rem; margin-top: 8px; }

    @media (max-width: 768px) {
      .grid-2 { grid-template-columns: 1fr; }
      .product-grid { grid-template-columns: 1fr 1fr; }
      .profile-card { flex-direction: column; align-items: center; text-align: center; }
      .header-top { flex-direction: column; gap: 10px; }
      .nav-inner { flex-wrap: wrap; justify-content: center; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-top">
      <a href="/" class="logo">Tech<span>Shop</span>.tm</a>

      <a href="/toggle-defense?from=${encodeURIComponent(activeTab)}" class="defense-toggle" style="text-decoration:none">
        <div class="toggle-switch"></div>
        <span class="toggle-label">${defenseOn ? 'Goranyş AÇYK' : 'Goranyş ÖÇÜK'}</span>
        <span class="defense-status">${defenseOn ? '🛡 GORAGLY' : '⚠ EJIZ'}</span>
      </a>
    </div>
    <nav class="nav">
      <div class="nav-inner">
        <a href="/" class="${activeTab === 'home' ? 'active' : ''}">🏠 Baş sahypa</a>
        <a href="/search" class="${activeTab === 'search' ? 'active' : ''}">🔍 Gözleg</a>
        <a href="/comments" class="${activeTab === 'comments' ? 'active' : ''}">💬 Teswirler</a>
        <a href="/chat" class="${activeTab === 'chat' ? 'active' : ''}">📨 Chat</a>
        <a href="/profile" class="${activeTab === 'profile' ? 'active' : ''}">👤 Profil</a>
        <a href="/login" class="${activeTab === 'login' ? 'active' : ''}">🔐 Giriş</a>
      </div>
    </nav>
  </header>

  <main class="main">
    ${defenseOn ? `
    <div class="alert alert-success">
      <span class="alert-icon">🛡</span>
      <div><strong>Goranyş rejimi açyk.</strong> Ähli ulanyjy girişleri arassalanýar we howpsuz usulda görkezilýär.</div>
    </div>` : `
    <div class="alert alert-danger">
      <span class="alert-icon">⚠</span>
      <div><strong>Goranyş öçük!</strong> Bu sahypa XSS hüjümlerine ejiz. Islendik HTML/JavaScript kody ýerine ýetirilip bilner.</div>
    </div>`}
    ${body}
  </main>

  <footer class="footer">
    <p>TechShop.tm — XSS Hüjüm & Goranyş Synag Sahypasy | Daniyar Nurmedow — Diplom taslamasy 2026</p>
  </footer>
</body>
</html>`;
}

// ============================================================
// DEFENSE STATE (stored in cookie-like session)
// ============================================================
let defenseEnabled = false;

app.get('/toggle-defense', (req, res) => {
  defenseEnabled = !defenseEnabled;
  const from = req.query.from || 'home';
  const redirectMap = {
    home: '/',
    search: '/search',
    comments: '/comments',
    chat: '/chat',
    profile: '/profile',
    login: '/login'
  };
  res.redirect(redirectMap[from] || '/');
});

// Helper: render value based on defense mode
function renderValue(val, defense) {
  if (!val) return '';
  if (defense) return escapeHtml(val);
  return val; // VULNERABLE: raw output
}

// ============================================================
// ROUTES
// ============================================================

// HOME
app.get('/', (req, res) => {
  const body = `
    <div class="card">
      <h2>🏠 TechShop.tm — Synag Sahypasy</h2>
      <p class="desc">Bu sahypa XSS (Cross-Site Scripting) hüjümlerini we goranyş usullaryny synap görmek üçin döredildi.</p>

      <div class="alert alert-info">
        <span class="alert-icon">ℹ</span>
        <div>
          <strong>Nähili ulanmaly:</strong><br>
          1. Ýokardan <strong>Goranyş</strong> düwmesini öçüriň<br>
          2. Islendik sahypada XSS ýüklerini synap görüň<br>
          3. Goranyşy açyň we şol bir ýükleri gaýtadan synap görüň<br>
          4. Tapawudy görüň!
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h2>⚠ Goranyşsyz (Ejiz)</h2>
        <p class="desc">Goranyş öçük bolanda, ulanyjy girişi göni HTML hökmünde görkezilýär:</p>
        <div class="code-block">
          <span class="keyword">element</span>.<span class="danger">innerHTML</span> = <span class="string">userInput</span>;<br>
          <span class="danger">// Howply! XSS kody ýerine ýetirilýär</span>
        </div>
      </div>
      <div class="card">
        <h2>🛡 Goranyşly (Howpsuz)</h2>
        <p class="desc">Goranyş açyk bolanda, ähli ýörite simwollar gaçyrylýar:</p>
        <div class="code-block">
          <span class="keyword">element</span>.<span class="safe">textContent</span> = <span class="string">userInput</span>;<br>
          <span class="safe">// Howpsuz! Tekst hökmünde görkezilýär</span>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>🧪 Synap Görmek Üçin XSS Ýükleri</h2>
      <p class="desc">Bu ýükleri islendik giriş meýdanyna kopiýalaň:</p>
      <div class="code-block" style="line-height:2">
&lt;script&gt;alert('XSS!')&lt;/script&gt;<br>
&lt;img src=x onerror="alert('Hacked!')"&gt;<br>
&lt;svg onload="alert('SVG XSS')"&gt;<br>
&lt;h1 style="color:red;font-size:50px"&gt;SAÝT BOZULDY!&lt;/h1&gt;<br>
&lt;marquee&gt;&lt;h2&gt;Hüjüm edildi!&lt;/h2&gt;&lt;/marquee&gt;<br>
&lt;div style="position:fixed;top:0;left:0;width:100%;height:100%;background:red;color:white;font-size:60px;display:flex;align-items:center;justify-content:center"&gt;HACKED&lt;/div&gt;
      </div>
    </div>
  `;
  res.send(layout('Baş sahypa', body, 'home', defenseEnabled));
});

// SEARCH (Reflected XSS)
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  const rendered = renderValue(query, defenseEnabled);

  let resultHtml = '';
  if (query) {
    resultHtml = `
      <div class="search-result">
        <div class="label">Gözleg netijeleri:</div>
        <div>${rendered}</div>
      </div>
      <div class="card" style="margin-top:16px">
        <h2>📦 Tapylan harytlar: "${rendered}"</h2>
        <div class="product-grid">
          <div class="product-card">
            <div style="font-size:2.5rem">📱</div>
            <h4>${rendered} Phone</h4>
            <div class="price">2500 TMT</div>
          </div>
          <div class="product-card">
            <div style="font-size:2.5rem">💻</div>
            <h4>${rendered} Laptop</h4>
            <div class="price">8900 TMT</div>
          </div>
          <div class="product-card">
            <div style="font-size:2.5rem">🎧</div>
            <h4>${rendered} Headphones</h4>
            <div class="price">350 TMT</div>
          </div>
        </div>
      </div>
    `;
  }

  const body = `
    <div class="card">
      <h2>🔍 Haryt Gözlegi (Reflected XSS)</h2>
      <p class="desc">Gözleg netijesi ulanyjy girişini göni sahypada görkezýär. Goranyş öçük bolsa, HTML/JS kody ýerine ýetirilýär.</p>
      <form method="GET" action="/search">
        <div class="form-group">
          <label>Haryt gözläň:</label>
          <div style="display:flex;gap:8px">
            <input type="search" name="q" value="${escapeHtml(query)}" placeholder="Mysal: <img src=x onerror=alert('XSS')>">
            <button class="btn" type="submit">🔍 Gözle</button>
          </div>
        </div>
      </form>
      ${resultHtml}
    </div>
  `;
  res.send(layout('Gözleg', body, 'search', defenseEnabled));
});

// COMMENTS (Stored XSS)
app.get('/comments', (req, res) => {
  const commentsHtml = comments.length > 0
    ? comments.map(c => `
      <div class="comment">
        <div class="comment-header">
          <span class="comment-author">${renderValue(c.name, defenseEnabled)}</span>
          <span class="comment-time">${c.time}</span>
        </div>
        <div class="comment-text">${renderValue(c.text, defenseEnabled)}</div>
      </div>
    `).join('')
    : '<div style="text-align:center;padding:20px;color:#999">Heniz teswir ýok. Ilkinji teswiri ýazyň!</div>';

  const body = `
    <div class="card">
      <h2>💬 Müşderi Teswirleri (Stored XSS)</h2>
      <p class="desc">Teswirler maglumatlar bazasynda saklanýar we ähli ulanyjylara görkezilýär. Goranyş öçük bolsa, zyýanly kod hemmelere täsir edýär.</p>
      <form method="POST" action="/comments">
        <div class="form-group">
          <label>Adyňyz:</label>
          <input type="text" name="name" placeholder="Mysal: <b>Bold Name</b>" required>
        </div>
        <div class="form-group">
          <label>Teswiriňiz:</label>
          <textarea name="text" placeholder="Mysal: <img src=x onerror=alert('Stored XSS!')>" required></textarea>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn" type="submit">💬 Teswir goýmak</button>
          <a href="/clear-comments" class="btn btn-danger btn-sm" style="text-decoration:none">🗑 Arassala</a>
        </div>
      </form>
    </div>
    <div class="card">
      <h2>📋 Teswirler (${comments.length})</h2>
      ${commentsHtml}
    </div>
  `;
  res.send(layout('Teswirler', body, 'comments', defenseEnabled));
});

app.post('/comments', (req, res) => {
  const { name, text } = req.body;
  if (name && text) {
    comments.push({
      name,
      text,
      time: new Date().toLocaleTimeString('tk-TM')
    });
  }
  res.redirect('/comments');
});

app.get('/clear-comments', (req, res) => {
  comments = [];
  res.redirect('/comments');
});

// CHAT (Stored XSS - real-time style)
app.get('/chat', (req, res) => {
  const messagesHtml = chatMessages.length > 0
    ? chatMessages.map(m => `
      <div class="chat-msg">
        <div class="name">${renderValue(m.name, defenseEnabled)}</div>
        <div class="text">${renderValue(m.text, defenseEnabled)}</div>
      </div>
    `).join('')
    : '<div style="text-align:center;padding:20px;color:#999">Chat boş. Habar ýazyň!</div>';

  const body = `
    <div class="card">
      <h2>📨 Janly Chat (Stored XSS)</h2>
      <p class="desc">Chat habarlary ähli ulanyjylara görkezilýär. Zyýanly kod girizmek arkaly beýleki ulanyjylaryň brauzerinde skript ýerine ýetirilip bilner.</p>
      <div class="chat-box">${messagesHtml}</div>
      <form method="POST" action="/chat">
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <input type="text" name="name" placeholder="Adyňyz" required style="width:200px">
          <input type="text" name="text" placeholder="Habaryňyz... <script>alert('XSS')</script>" required style="flex:1">
          <button class="btn" type="submit">📤 Iber</button>
        </div>
      </form>
      <a href="/clear-chat" class="btn btn-danger btn-sm" style="text-decoration:none">🗑 Chaty arassala</a>
    </div>
  `;
  res.send(layout('Chat', body, 'chat', defenseEnabled));
});

app.post('/chat', (req, res) => {
  const { name, text } = req.body;
  if (name && text) {
    chatMessages.push({ name, text });
    if (chatMessages.length > 50) chatMessages.shift();
  }
  res.redirect('/chat');
});

app.get('/clear-chat', (req, res) => {
  chatMessages = [];
  res.redirect('/chat');
});

// PROFILE (DOM-based XSS)
app.get('/profile', (req, res) => {
  const username = req.query.user || 'Daniyar';
  const bio = req.query.bio || 'TechShop müşderisi';
  const rendered_user = renderValue(username, defenseEnabled);
  const rendered_bio = renderValue(bio, defenseEnabled);

  const body = `
    <div class="card">
      <h2>👤 Ulanyjy Profili (DOM / Reflected XSS)</h2>
      <p class="desc">Profil maglumatlary URL parametrlerinden alynýar. Goranyş öçük bolsa, URL arkaly zyýanly kod sanjylyp bilner.</p>

      <div class="alert alert-info">
        <span class="alert-icon">💡</span>
        <div>Synap görüň: URL-y üýtgediň, mysal üçin:<br>
        <code style="background:#e3f2fd;padding:2px 6px;border-radius:4px">/profile?user=&lt;img src=x onerror=alert('XSS')&gt;&bio=hacked</code></div>
      </div>
    </div>

    <div class="card">
      <div class="profile-card">
        <div class="avatar">${rendered_user.charAt(0).toUpperCase()}</div>
        <div class="profile-info">
          <h3>${rendered_user}</h3>
          <div style="color:#666;font-size:0.85rem">Agza boldy: 2025-nji ýylda</div>
          <div class="bio" style="margin-top:12px">${rendered_bio}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>✏ Profili Üýtget</h2>
      <form method="GET" action="/profile">
        <div class="form-group">
          <label>Ulanyjy ady:</label>
          <input type="text" name="user" value="${escapeHtml(username)}" placeholder="<script>alert('XSS')</script>">
        </div>
        <div class="form-group">
          <label>Bio:</label>
          <input type="text" name="bio" value="${escapeHtml(bio)}" placeholder="<h1>Hacked!</h1>">
        </div>
        <button class="btn" type="submit">💾 Ýatda sakla</button>
      </form>
    </div>
  `;
  res.send(layout('Profil', body, 'profile', defenseEnabled));
});

// LOGIN (Phishing / Credential stealing demo)
app.get('/login', (req, res) => {
  const error = req.query.error || '';
  const rendered_error = renderValue(error, defenseEnabled);

  const body = `
    <div class="card" style="max-width:500px;margin:0 auto">
      <h2>🔐 Ulgama Girmek</h2>
      <p class="desc">Ýalňyşlyk habary URL-dan alynýar. Goranyş öçük bolsa, ýalňyşlyk habaryna XSS sanjylyp bilner.</p>

      ${error ? `<div class="alert alert-danger"><span class="alert-icon">❌</span><div>${rendered_error}</div></div>` : ''}

      <div class="alert alert-info">
        <span class="alert-icon">💡</span>
        <div>Synap görüň:<br>
        <code style="background:#e3f2fd;padding:2px 6px;border-radius:4px;font-size:0.8rem">/login?error=&lt;img src=x onerror=alert('XSS')&gt;</code></div>
      </div>

      <form method="POST" action="/login">
        <div class="form-group">
          <label>Ulanyjy ady:</label>
          <input type="text" name="username" placeholder="admin" required>
        </div>
        <div class="form-group">
          <label>Parol:</label>
          <input type="password" name="password" placeholder="••••••••" required>
        </div>
        <button class="btn" type="submit" style="width:100%;justify-content:center">🔑 Girmek</button>
      </form>
    </div>
  `;
  res.send(layout('Giriş', body, 'login', defenseEnabled));
});

app.post('/login', (req, res) => {
  res.redirect('/login?error=Ýalňyş ulanyjy ady ýa-da parol!');
});

// HEALTH
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', defense: defenseEnabled });
});

// START
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║       XSS Target Site - TechShop.tm                  ║
  ║                                                      ║
  ║       http://localhost:${PORT}                          ║
  ║       Defense: ${defenseEnabled ? 'ON ' : 'OFF'}                                    ║
  ║                                                      ║
  ║       Pages:                                         ║
  ║         /          - Home                            ║
  ║         /search    - Reflected XSS                   ║
  ║         /comments  - Stored XSS                      ║
  ║         /chat      - Stored XSS (chat)               ║
  ║         /profile   - DOM/Reflected XSS               ║
  ║         /login     - Reflected XSS (error msg)       ║
  ╚══════════════════════════════════════════════════════╝
  `);
});
