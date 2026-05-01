// XSS Defense Guides — STATIC educational page
// Shows code EXAMPLES (as escaped text) for 12 frameworks
// NO user input, NO dynamic content — purely static HTML

module.exports = (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XSS Defense Guides</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; }
    h1 { color: #38bdf8; margin-bottom: 1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; margin-top: 1rem; }
    .card { background: #1e293b; border-radius: 12px; padding: 1.25rem; border-left: 4px solid #38bdf8; }
    .card h3 { color: #38bdf8; margin-bottom: 0.5rem; }
    .card p { color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem; }
    pre { background: #0f172a; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; overflow-x: auto; color: #a5f3fc; border: 1px solid #334155; }
    a { color: #38bdf8; text-decoration: none; }
    .back { display: inline-block; margin-bottom: 1rem; padding: 0.5rem 1rem; background: #1e293b; border-radius: 8px; }
  </style>
</head>
<body>
  <a href="/" class="back">&larr; Back</a>
  <h1>XSS Defense Guides</h1>
  <p>How to prevent Cross-Site Scripting in popular frameworks.</p>
  <div class="grid">
    <div class="card"><h3>1. JavaScript</h3><p>Use textContent instead of innerHTML</p><pre>// Safe\nelement.textContent = userInput;</pre></div>
    <div class="card"><h3>2. React</h3><p>React escapes by default in JSX</p><pre>// Safe by default\n&lt;div&gt;{userInput}&lt;/div&gt;</pre></div>
    <div class="card"><h3>3. Vue.js</h3><p>Use {{ }} interpolation, avoid v-html</p><pre>// Safe\n&lt;p&gt;{{ userInput }}&lt;/p&gt;</pre></div>
    <div class="card"><h3>4. Django (Python)</h3><p>Templates auto-escape by default</p><pre>// Safe\n{{ user_input }}</pre></div>
    <div class="card"><h3>5. PHP</h3><p>Always use htmlspecialchars()</p><pre>echo htmlspecialchars($input, ENT_QUOTES, 'UTF-8');</pre></div>
    <div class="card"><h3>6. Spring (Java)</h3><p>Thymeleaf escapes with th:text</p><pre>&lt;p th:text="userInput"&gt;&lt;/p&gt;</pre></div>
    <div class="card"><h3>7. Node.js / Express</h3><p>Escape HTML entities manually or use template engine</p><pre>str.replace(/&lt;/g, '&amp;lt;').replace(/&gt;/g, '&amp;gt;')</pre></div>
    <div class="card"><h3>8. ASP.NET (C#)</h3><p>Razor auto-escapes @Model values</p><pre>@Model.UserInput  // auto-escaped</pre></div>
    <div class="card"><h3>9. Go</h3><p>Use html/template (NOT text/template)</p><pre>import "html/template"  // auto-escapes</pre></div>
    <div class="card"><h3>10. Ruby on Rails</h3><p>ERB auto-escapes, avoid raw()</p><pre>&lt;%= user_input %&gt;  // auto-escaped</pre></div>
    <div class="card"><h3>11. Content Security Policy</h3><p>HTTP header to restrict script sources</p><pre>Content-Security-Policy: script-src 'self';</pre></div>
    <div class="card"><h3>12. DOMPurify</h3><p>Sanitize HTML when you must render it</p><pre>const clean = DOMPurify.sanitize(dirty);</pre></div>
  </div>
</body>
</html>`);
};
