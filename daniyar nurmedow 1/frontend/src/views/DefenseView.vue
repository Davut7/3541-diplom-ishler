<template>
  <div class="defense-view">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="terminal-title">defense_mode.exe -- XSS Protection Module</div>
      <div class="terminal-status">
        <span class="status-badge success">
          <i class="pi pi-shield"></i>
          DEFENSE_ACTIVE
        </span>
      </div>
    </div>

    <div class="page-header">
      <div class="glitch-title" data-text="// DEFENSE SYSTEMS">// DEFENSE SYSTEMS</div>
      <p class="subtitle">
        <span class="prompt">&gt;</span> {{ t.defense.subtitle }}
      </p>
    </div>

    <!-- Defense Techniques Grid -->
    <div class="techniques-grid">
      <div v-for="(technique, key) in t.defense.techniques" :key="key" class="cyber-card technique-card">
        <div class="card-header">
          <div class="technique-icon" :class="getIconClass(key)">
            <i :class="getIcon(key)"></i>
          </div>
          <span class="header-title">{{ technique.name }}</span>
        </div>
        <div class="card-content">
          <p class="technique-desc">{{ technique.desc }}</p>
          <div class="technique-example">
            <span class="example-label">// Example:</span>
            <code>{{ technique.example }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Card -->
    <div class="cyber-card demo-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-shield"></i></span>
        <span class="header-title">DEFENSE_SIMULATOR</span>
      </div>
      <div class="card-content">
        <div class="demo-layout">
          <div class="input-section">
            <label>
              <span class="label-prefix">&gt;</span>
              {{ t.defense.inputLabel }}
            </label>
            <Textarea v-model="maliciousInput" rows="3" class="cyber-input" :placeholder="'\x3Cimg src=x onerror=alert(1)\x3E'" />
          </div>

          <div class="defense-options">
            <div class="option-label">
              <span class="label-prefix">#</span>
              Active Defenses:
            </div>
            <div class="options-grid">
              <div class="defense-option" v-for="defense in defenses" :key="defense.id" :class="{ active: defense.enabled }">
                <ToggleSwitch v-model="defense.enabled" />
                <span class="option-name">{{ defense.name }}</span>
              </div>
            </div>
          </div>

          <button class="test-btn" @click="testDefense">
            <i class="pi pi-check-circle"></i>
            <span>RUN_SANITIZATION</span>
          </button>

          <div class="output-section">
            <label>
              <span class="label-prefix">&gt;</span>
              {{ t.defense.outputLabel }}
            </label>
            <div class="output-box">
              <div class="output-header">
                <span class="output-label">SANITIZED_OUTPUT:</span>
                <span class="output-status">
                  <i class="pi pi-shield"></i>
                  PROTECTED
                </span>
              </div>
              <pre class="output-code">{{ sanitizedOutput }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CSP Card -->
    <div class="cyber-card csp-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-lock"></i></span>
        <span class="header-title">CONTENT_SECURITY_POLICY</span>
      </div>
      <div class="card-content">
        <div class="csp-grid">
          <div class="csp-item">
            <h4>
              <span class="csp-prefix">[01]</span>
              Basic CSP
            </h4>
            <code>Content-Security-Policy: default-src 'self'</code>
            <p>Only allow resources from same origin</p>
          </div>
          <div class="csp-item">
            <h4>
              <span class="csp-prefix">[02]</span>
              Strict CSP
            </h4>
            <code>Content-Security-Policy: script-src 'self'; style-src 'self'; img-src 'self' data:</code>
            <p>Strict control over scripts, styles, and images</p>
          </div>
          <div class="csp-item">
            <h4>
              <span class="csp-prefix">[03]</span>
              Nonce-based CSP
            </h4>
            <code>Content-Security-Policy: script-src 'nonce-abc123'</code>
            <p>Only scripts with matching nonce attribute can execute</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Code Examples Card -->
    <div class="cyber-card code-examples-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-code"></i></span>
        <span class="header-title">DEFENSE_CODE_EXAMPLES</span>
      </div>
      <div class="card-content">
        <div class="code-sections">
          <div class="code-section">
            <h4>
              <span class="section-num">[01]</span>
              HTML Entity Encoding (JavaScript)
            </h4>
            <pre class="code-block"><span class="code-keyword">function</span> <span class="code-safe">escapeHtml</span>(text) {
  <span class="code-keyword">const</span> map = {
    <span class="code-string">'&'</span>: <span class="code-string">'&amp;amp;'</span>,
    <span class="code-string">'&lt;'</span>: <span class="code-string">'&amp;lt;'</span>,
    <span class="code-string">'&gt;'</span>: <span class="code-string">'&amp;gt;'</span>,
    <span class="code-string">'"'</span>: <span class="code-string">'&amp;quot;'</span>,
    <span class="code-string">"'"</span>: <span class="code-string">'&amp;#039;'</span>
  };
  <span class="code-keyword">return</span> text.replace(<span class="code-string">/[&amp;&lt;&gt;"']/g</span>, m => map[m]);
}

<span class="code-comment">// Usage</span>
<span class="code-keyword">const</span> userInput = <span class="code-danger">'&lt;script&gt;alert("XSS")&lt;/script&gt;'</span>;
<span class="code-keyword">const</span> safe = <span class="code-safe">escapeHtml</span>(userInput);
<span class="code-comment">// Result: &amp;lt;script&amp;gt;alert("XSS")&amp;lt;/script&amp;gt;</span></pre>
          </div>

          <div class="code-section">
            <h4>
              <span class="section-num">[02]</span>
              DOM Manipulation (Safe Way)
            </h4>
            <pre class="code-block"><span class="code-danger">// UNSAFE - Don't do this!</span>
element.innerHTML = userInput;

<span class="code-safe">// SAFE - Use textContent</span>
element.<span class="code-safe">textContent</span> = userInput;

<span class="code-safe">// SAFE - Create elements properly</span>
<span class="code-keyword">const</span> div = document.<span class="code-safe">createElement</span>(<span class="code-string">'div'</span>);
div.<span class="code-safe">textContent</span> = userInput;
container.appendChild(div);</pre>
          </div>

          <div class="code-section">
            <h4>
              <span class="section-num">[03]</span>
              Node.js/Express Middleware
            </h4>
            <pre class="code-block"><span class="code-keyword">const</span> express = require(<span class="code-string">'express'</span>);
<span class="code-keyword">const</span> helmet = require(<span class="code-string">'helmet'</span>);
<span class="code-keyword">const</span> xss = require(<span class="code-string">'xss-clean'</span>);

<span class="code-keyword">const</span> app = express();

<span class="code-comment">// Security headers</span>
app.use(<span class="code-safe">helmet()</span>);

<span class="code-comment">// XSS protection</span>
app.use(<span class="code-safe">xss()</span>);

<span class="code-comment">// CSP Header</span>
app.use(helmet.<span class="code-safe">contentSecurityPolicy</span>({
  directives: {
    defaultSrc: [<span class="code-string">"'self'"</span>],
    scriptSrc: [<span class="code-string">"'self'"</span>],
    styleSrc: [<span class="code-string">"'self'"</span>, <span class="code-string">"'unsafe-inline'"</span>],
    imgSrc: [<span class="code-string">"'self'"</span>, <span class="code-string">"data:"</span>, <span class="code-string">"https:"</span>]
  }
}));</pre>
          </div>

          <div class="code-section">
            <h4>
              <span class="section-num">[04]</span>
              Vue.js Safe Practices
            </h4>
            <pre class="code-block" v-pre><span class="code-comment">&lt;!-- SAFE: Vue auto-escapes by default --&gt;</span>
&lt;div&gt;&#123;&#123; userInput &#125;&#125;&lt;/div&gt;

<span class="code-danger">&lt;!-- UNSAFE: v-html renders raw HTML --&gt;</span>
&lt;div v-html=<span class="code-string">"userInput"</span>&gt;&lt;/div&gt;

<span class="code-safe">&lt;!-- SAFE: Use DOMPurify with v-html --&gt;</span>
&lt;div v-html=<span class="code-string">"sanitizedInput"</span>&gt;&lt;/div&gt;

&lt;script&gt;
<span class="code-keyword">import</span> DOMPurify <span class="code-keyword">from</span> <span class="code-string">'dompurify'</span>;

<span class="code-keyword">export default</span> {
  computed: {
    sanitizedInput() {
      <span class="code-keyword">return</span> <span class="code-safe">DOMPurify.sanitize</span>(<span class="code-keyword">this</span>.userInput);
    }
  }
}
&lt;/script&gt;</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Checklist Card -->
    <div class="cyber-card checklist-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-check-square"></i></span>
        <span class="header-title">XSS_PREVENTION_CHECKLIST</span>
      </div>
      <div class="card-content">
        <div class="checklist">
          <div class="checklist-item" v-for="(item, i) in checklist" :key="i">
            <div class="check-icon">
              <i class="pi pi-check"></i>
            </div>
            <span class="check-text">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const maliciousInput = ref("\x3Cscript\x3Ealert('XSS')\x3C/script\x3E")

    const defenses = ref([
      { id: 'htmlEscape', name: 'HTML_ESCAPE', enabled: true },
      { id: 'removeScripts', name: 'REMOVE_SCRIPTS', enabled: true },
      { id: 'removeEvents', name: 'REMOVE_EVENTS', enabled: true },
      { id: 'encodeUrl', name: 'URL_ENCODE', enabled: false }
    ])

    const checklist = [
      'Never trust user input - always validate and sanitize',
      'Use output encoding appropriate to the context (HTML, JS, URL)',
      'Implement Content Security Policy (CSP) headers',
      'Set HttpOnly and Secure flags on cookies',
      'Use modern frameworks that auto-escape by default',
      'Regularly update dependencies and scan for vulnerabilities',
      'Use parameterized queries for database operations',
      'Implement input validation on both client and server side'
    ]

    const escapeHtml = (text) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
      return text.replace(/[&<>"']/g, m => map[m])
    }

    const sanitizedOutput = computed(() => {
      let output = maliciousInput.value

      if (defenses.value.find(d => d.id === 'removeScripts' && d.enabled)) {
        output = output.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT_REMOVED]')
      }

      if (defenses.value.find(d => d.id === 'removeEvents' && d.enabled)) {
        output = output.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '[EVENT_REMOVED]')
      }

      if (defenses.value.find(d => d.id === 'htmlEscape' && d.enabled)) {
        output = escapeHtml(output)
      }

      if (defenses.value.find(d => d.id === 'encodeUrl' && d.enabled)) {
        output = encodeURIComponent(output)
      }

      return output
    })

    const testDefense = () => {
      // Triggers reactive update
    }

    const getIcon = (key) => {
      const icons = {
        inputValidation: 'pi pi-check',
        outputEncoding: 'pi pi-code',
        csp: 'pi pi-lock',
        httpOnly: 'pi pi-key',
        sanitization: 'pi pi-filter',
        escaping: 'pi pi-directions'
      }
      return icons[key] || 'pi pi-shield'
    }

    const getIconClass = (key) => {
      const classes = {
        inputValidation: 'icon-cyan',
        outputEncoding: 'icon-green',
        csp: 'icon-purple',
        httpOnly: 'icon-yellow',
        sanitization: 'icon-pink',
        escaping: 'icon-blue'
      }
      return classes[key] || 'icon-cyan'
    }

    return {
      maliciousInput,
      defenses,
      checklist,
      sanitizedOutput,
      testDefense,
      getIcon,
      getIconClass
    }
  }
}
</script>

<style scoped>
.defense-view {
  max-width: 1400px;
  margin: 0 auto;
}

/* Terminal Header */
.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--cyber-surface-2);
  border: 1px solid var(--cyber-border);
  border-radius: 8px 8px 0 0;
  padding: 0.75rem 1rem;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dots .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dots .dot.red { background: #ff5f56; }
.terminal-dots .dot.yellow { background: #ffbd2e; }
.terminal-dots .dot.green { background: #27c93f; }

.terminal-title {
  font-size: 0.85rem;
  color: var(--cyber-text-dim);
}

.terminal-status .status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.success {
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid var(--cyber-primary);
  color: var(--cyber-primary);
}

/* Page Header */
.page-header {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.glitch-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--cyber-primary);
  text-shadow: var(--cyber-glow);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--cyber-text-dim);
  font-size: 0.95rem;
}

.subtitle .prompt {
  color: var(--cyber-primary);
}

/* Cyber Card */
.cyber-card {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--cyber-surface-2);
  border-bottom: 1px solid var(--cyber-border);
}

.header-icon {
  color: var(--cyber-primary);
  font-size: 1.1rem;
}

.header-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--cyber-text);
}

.card-content {
  padding: 1.5rem;
}

/* Techniques Grid */
.techniques-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.technique-card .card-header {
  padding: 1rem;
}

.technique-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.icon-cyan { background: linear-gradient(135deg, #00d4ff, #0099cc); color: white; }
.icon-green { background: linear-gradient(135deg, #00ff88, #00cc6a); color: #0a0e17; }
.icon-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; }
.icon-yellow { background: linear-gradient(135deg, #ffcc00, #ff9900); color: #0a0e17; }
.icon-pink { background: linear-gradient(135deg, #ff3366, #ff6b9d); color: white; }
.icon-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }

.technique-desc {
  color: var(--cyber-text-dim);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.technique-example {
  background: var(--cyber-code-bg);
  border: 1px solid var(--cyber-border);
  border-radius: 6px;
  padding: 0.75rem;
}

.example-label {
  display: block;
  color: var(--cyber-text-dim);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.technique-example code {
  color: var(--cyber-primary);
  font-size: 0.85rem;
  word-break: break-all;
}

/* Demo Card */
.demo-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section label,
.output-section label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--cyber-text);
  font-weight: 500;
  font-size: 0.9rem;
}

.label-prefix {
  color: var(--cyber-primary);
}

.cyber-input {
  width: 100%;
  background: var(--cyber-code-bg) !important;
  border: 1px solid var(--cyber-border) !important;
  color: var(--cyber-text) !important;
  font-family: var(--font-mono) !important;
}

.defense-options {
  background: var(--cyber-code-bg);
  border: 1px solid var(--cyber-border);
  border-radius: 6px;
  padding: 1rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--cyber-text);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.defense-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 4px;
  transition: all 0.2s;
}

.defense-option.active {
  border-color: var(--cyber-primary);
  background: rgba(0, 255, 136, 0.05);
}

.option-name {
  font-size: 0.8rem;
  color: var(--cyber-text);
}

.test-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--cyber-primary), #00cc6a);
  border: none;
  border-radius: 6px;
  color: var(--cyber-bg);
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
}

.output-box {
  background: var(--cyber-code-bg);
  border: 1px solid var(--cyber-primary);
  border-radius: 6px;
  overflow: hidden;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(0, 255, 136, 0.1);
  border-bottom: 1px solid var(--cyber-primary);
}

.output-label {
  font-size: 0.8rem;
  color: var(--cyber-text-dim);
}

.output-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cyber-primary);
}

.output-code {
  padding: 1rem;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--cyber-primary);
  word-break: break-all;
  white-space: pre-wrap;
}

/* CSP Card */
.csp-grid {
  display: grid;
  gap: 1rem;
}

.csp-item {
  background: var(--cyber-code-bg);
  border: 1px solid var(--cyber-border);
  border-radius: 6px;
  padding: 1rem;
}

.csp-item h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--cyber-secondary);
  font-size: 0.95rem;
}

.csp-prefix {
  color: var(--cyber-text-dim);
  font-size: 0.8rem;
}

.csp-item code {
  display: block;
  background: var(--cyber-surface);
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--cyber-primary);
  margin-bottom: 0.5rem;
  word-break: break-all;
}

.csp-item p {
  color: var(--cyber-text-dim);
  font-size: 0.85rem;
  margin: 0;
}

/* Code Examples */
.code-sections {
  display: grid;
  gap: 1.5rem;
}

.code-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--cyber-secondary);
  font-size: 0.95rem;
}

.section-num {
  color: var(--cyber-text-dim);
  font-size: 0.8rem;
}

.code-block {
  background: var(--cyber-code-bg);
  border: 1px solid var(--cyber-border);
  border-radius: 6px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.6;
  overflow-x: auto;
  color: var(--cyber-text);
  margin: 0;
}

.code-keyword { color: var(--cyber-secondary); }
.code-string { color: var(--cyber-warning); }
.code-comment { color: var(--cyber-text-dim); }
.code-safe { color: var(--cyber-primary); }
.code-danger { color: var(--cyber-danger); }

/* Checklist */
.checklist {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--cyber-code-bg);
  border: 1px solid var(--cyber-border);
  border-radius: 6px;
  transition: all 0.2s;
}

.checklist-item:hover {
  border-color: var(--cyber-primary);
  background: rgba(0, 255, 136, 0.05);
}

.check-icon {
  width: 24px;
  height: 24px;
  background: var(--cyber-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-icon i {
  font-size: 0.75rem;
  color: var(--cyber-bg);
}

.check-text {
  color: var(--cyber-text);
  font-size: 0.85rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .terminal-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .terminal-dots {
    display: none;
  }

  .glitch-title {
    font-size: 1.5rem;
  }

  .techniques-grid {
    grid-template-columns: 1fr;
  }

  .checklist {
    grid-template-columns: 1fr;
  }
}
</style>
