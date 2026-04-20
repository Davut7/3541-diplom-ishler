<template>
  <div class="cyber-home">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span class="terminal-title">xss_shield@security:~$</span>
    </div>

    <!-- Main Terminal Content -->
    <div class="terminal-body">
      <!-- ASCII Art Logo -->
      <pre class="ascii-logo">
██╗  ██╗███████╗███████╗    ███████╗██╗  ██╗██╗███████╗██╗     ██████╗
╚██╗██╔╝██╔════╝██╔════╝    ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
 ╚███╔╝ ███████╗███████╗    ███████╗███████║██║█████╗  ██║     ██║  ██║
 ██╔██╗ ╚════██║╚════██║    ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
██╔╝ ██╗███████║███████║    ███████║██║  ██║██║███████╗███████╗██████╔╝
╚═╝  ╚═╝╚══════╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝
      </pre>

      <!-- Typing Effect Title -->
      <div class="typing-container">
        <span class="prompt">$</span>
        <span class="typing-text">{{ displayedText }}<span class="cursor">_</span></span>
      </div>

      <!-- System Status Grid -->
      <div class="status-grid">
        <div class="status-card" v-for="(stat, index) in systemStats" :key="index">
          <div class="status-header">
            <span class="status-label">{{ stat.label }}</span>
            <span class="status-indicator" :class="stat.status"></span>
          </div>
          <div class="status-value">{{ stat.value }}</div>
          <div class="status-bar">
            <div class="status-fill" :style="{ width: stat.percent + '%' }" :class="stat.status"></div>
          </div>
        </div>
      </div>

      <!-- Command Actions -->
      <div class="command-section">
        <p class="command-hint">> {{ language === 'en' ? 'Available commands:' : 'Elýeterli buýruklar:' }}</p>
        <div class="command-grid">
          <router-link to="/attack-lab" class="command-btn attack">
            <span class="cmd-icon">⚡</span>
            <span class="cmd-text">./attack_lab</span>
            <span class="cmd-desc">{{ language === 'en' ? 'Launch XSS attacks' : 'XSS hüjümlerini başla' }}</span>
          </router-link>
          <router-link to="/defense" class="command-btn defense">
            <span class="cmd-icon">🛡️</span>
            <span class="cmd-text">./defense_mode</span>
            <span class="cmd-desc">{{ language === 'en' ? 'Learn protection' : 'Goragy öwren' }}</span>
          </router-link>
          <router-link to="/scanner" class="command-btn scanner">
            <span class="cmd-icon">🔍</span>
            <span class="cmd-text">./scan_code</span>
            <span class="cmd-desc">{{ language === 'en' ? 'Analyze vulnerabilities' : 'Gowşaklyklary derňe' }}</span>
          </router-link>
          <router-link to="/live-lab" class="command-btn lab">
            <span class="cmd-icon">🧪</span>
            <span class="cmd-text">./live_lab</span>
            <span class="cmd-desc">{{ language === 'en' ? 'Practice attacks' : 'Hüjümleri türgenleş' }}</span>
          </router-link>
        </div>
      </div>

      <!-- Live Attack Feed -->
      <div class="attack-feed">
        <div class="feed-header">
          <span class="feed-title">
            <span class="blink">[LIVE]</span> {{ language === 'en' ? 'Attack Monitor' : 'Hüjüm gözegçiligi' }}
          </span>
          <span class="feed-count">{{ attackLogs.length }} events</span>
        </div>
        <div class="feed-content">
          <div
            v-for="(log, index) in attackLogs"
            :key="index"
            class="log-entry"
            :class="log.type"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-type">[{{ log.type.toUpperCase() }}]</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>

      <!-- Payload Matrix -->
      <div class="payload-matrix">
        <div class="matrix-header">
          <span>💀 {{ language === 'en' ? 'PAYLOAD DATABASE' : 'ÝÜK BAZASY' }}</span>
          <span class="matrix-count">{{ payloads.length }} payloads</span>
        </div>
        <div class="matrix-grid">
          <div
            v-for="(payload, index) in payloads"
            :key="index"
            class="payload-item"
            :class="payload.risk"
            @click="executePayload(payload)"
          >
            <div class="payload-risk">{{ payload.risk }}</div>
            <code class="payload-code">{{ payload.code }}</code>
            <div class="payload-meta">
              <span>{{ payload.type }}</span>
              <span class="payload-exec">▶ RUN</span>
            </div>
          </div>
        </div>
      </div>

      <!-- XSS Types Visual -->
      <div class="xss-types">
        <div class="type-card reflected">
          <div class="type-icon">↩️</div>
          <div class="type-name">REFLECTED</div>
          <div class="type-desc">URL-based injection</div>
          <div class="type-bar"></div>
        </div>
        <div class="type-card stored">
          <div class="type-icon">💾</div>
          <div class="type-name">STORED</div>
          <div class="type-desc">Database persistent</div>
          <div class="type-bar"></div>
        </div>
        <div class="type-card dom">
          <div class="type-icon">🌐</div>
          <div class="type-name">DOM-BASED</div>
          <div class="type-desc">Client-side manipulation</div>
          <div class="type-bar"></div>
        </div>
      </div>

      <!-- Warning Banner -->
      <div class="warning-banner">
        <div class="warning-icon">⚠️</div>
        <div class="warning-text">
          <span class="warning-title">{{ language === 'en' ? 'EDUCATIONAL USE ONLY' : 'DIŇE BILIM MAKSATLY' }}</span>
          <span class="warning-desc">{{ language === 'en' ? 'Unauthorized testing is illegal. Use responsibly.' : 'Rugsatsyz synag bikanun. Jogapkärçilikli ulanyň.' }}</span>
        </div>
        <div class="warning-scan"></div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="cyber-footer">
      <div class="footer-stat">
        <span class="stat-num">{{ globalStats.attacks }}</span>
        <span class="stat-label">ATTACKS</span>
      </div>
      <div class="footer-divider">|</div>
      <div class="footer-stat">
        <span class="stat-num">{{ globalStats.blocked }}</span>
        <span class="stat-label">BLOCKED</span>
      </div>
      <div class="footer-divider">|</div>
      <div class="footer-stat">
        <span class="stat-num">{{ globalStats.scanned }}</span>
        <span class="stat-label">SCANNED</span>
      </div>
      <div class="footer-divider">|</div>
      <div class="footer-stat">
        <span class="stat-num">{{ globalStats.uptime }}</span>
        <span class="stat-label">UPTIME</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const router = useRouter()

    // Typing effect
    const fullText = 'Initializing XSS Shield v2.0... Security protocols loaded.'
    const displayedText = ref('')
    let typeIndex = 0
    let typeInterval = null

    // System stats
    const systemStats = ref([
      { label: 'CPU LOAD', value: '0%', percent: 0, status: 'normal' },
      { label: 'MEMORY', value: '0GB', percent: 0, status: 'normal' },
      { label: 'THREATS', value: '0', percent: 0, status: 'normal' },
      { label: 'FIREWALL', value: 'ACTIVE', percent: 100, status: 'success' }
    ])

    // Attack logs
    const attackLogs = ref([
      { time: '12:45:32', type: 'blocked', message: 'XSS attempt blocked from 192.168.1.45' },
      { time: '12:44:18', type: 'scan', message: 'Vulnerability scan completed - 2 issues found' },
      { time: '12:43:05', type: 'warning', message: 'Suspicious payload detected in input field' },
      { time: '12:42:51', type: 'info', message: 'CSP headers updated successfully' },
      { time: '12:41:33', type: 'blocked', message: 'Script injection prevented on /api/search' }
    ])

    // Payloads
    const payloads = ref([
      { code: '\x3Cscript\x3Ealert(1)\x3C/script\x3E', type: 'Basic', risk: 'critical' },
      { code: '\x3Cimg src=x onerror=alert(1)\x3E', type: 'IMG Tag', risk: 'high' },
      { code: '\x3Csvg/onload=alert(1)\x3E', type: 'SVG', risk: 'high' },
      { code: 'javascript:alert(1)', type: 'URI', risk: 'medium' },
      { code: '\x3Cinput onfocus=alert(1) autofocus\x3E', type: 'Event', risk: 'medium' },
      { code: '\x3Cbody onload=alert(1)\x3E', type: 'Body', risk: 'low' }
    ])

    // Global stats
    const globalStats = ref({
      attacks: '0',
      blocked: '0',
      scanned: '0',
      uptime: '0%'
    })

    let logInterval = null

    const executePayload = (payload) => {
      router.push({ path: '/attack-lab', query: { payload: encodeURIComponent(payload.code) } })
    }

    const addNewLog = () => {
      const types = ['blocked', 'scan', 'warning', 'info']
      const messages = [
        'XSS payload neutralized',
        'New vulnerability pattern detected',
        'Input sanitization applied',
        'Defense module updated',
        'Suspicious activity logged'
      ]

      const now = new Date()
      const time = now.toTimeString().slice(0, 8)

      attackLogs.value.unshift({
        time,
        type: types[Math.floor(Math.random() * types.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      })

      if (attackLogs.value.length > 5) {
        attackLogs.value.pop()
      }
    }

    onMounted(() => {
      // Typing effect
      typeInterval = setInterval(() => {
        if (typeIndex < fullText.length) {
          displayedText.value += fullText[typeIndex]
          typeIndex++
        } else {
          clearInterval(typeInterval)
        }
      }, 50)

      // Live updates
      logInterval = setInterval(addNewLog, 6000)
    })

    onUnmounted(() => {
      if (typeInterval) clearInterval(typeInterval)
      if (logInterval) clearInterval(logInterval)
    })

    return {
      displayedText,
      systemStats,
      attackLogs,
      payloads,
      globalStats,
      executePayload
    }
  }
}
</script>

<style scoped>
/* Use global theme variables from App.vue */
.cyber-home {
  background: var(--cyber-bg);
  min-height: 100vh;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  color: var(--cyber-text);
  padding: 0;
  margin: -2rem;
  width: calc(100% + 4rem);
}

/* Define cyber-muted locally since it's not in global theme */
.cyber-home {
  --cyber-muted: var(--cyber-text-dim);
}

/* Terminal Header */
.terminal-header {
  background: var(--cyber-surface-2);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--cyber-border);
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

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27ca40; }

.terminal-title {
  color: var(--cyber-primary);
  font-size: 0.9rem;
}

/* Terminal Body */
.terminal-body {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* ASCII Logo */
.ascii-logo {
  color: var(--cyber-primary);
  font-size: 0.5rem;
  line-height: 1.2;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px var(--cyber-primary);
  animation: glowPulse 2s ease-in-out infinite;
  overflow-x: auto;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; text-shadow: 0 0 10px var(--cyber-primary); }
  50% { opacity: 0.8; text-shadow: 0 0 20px var(--cyber-primary), 0 0 30px var(--cyber-primary); }
}

/* Typing Effect */
.typing-container {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.prompt {
  color: var(--cyber-primary);
  margin-right: 0.5rem;
}

.typing-text {
  color: var(--cyber-text);
}

.cursor {
  color: var(--cyber-primary);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-card {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.status-card:hover {
  border-color: var(--cyber-primary);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-label {
  font-size: 0.7rem;
  color: var(--cyber-muted);
  letter-spacing: 1px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.normal { background: var(--cyber-secondary); }
.status-indicator.success { background: var(--cyber-primary); box-shadow: 0 0 10px var(--cyber-primary); }
.status-indicator.warning { background: var(--cyber-warning); }
.status-indicator.danger { background: var(--cyber-danger); }

.status-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cyber-text);
  margin-bottom: 0.5rem;
}

.status-bar {
  height: 4px;
  background: var(--cyber-border);
  border-radius: 2px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.status-fill.normal { background: var(--cyber-secondary); }
.status-fill.success { background: var(--cyber-primary); }
.status-fill.warning { background: var(--cyber-warning); }

/* Command Section */
.command-section {
  margin-bottom: 2rem;
}

.command-hint {
  color: var(--cyber-muted);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.command-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.command-btn {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  padding: 1.25rem;
  text-decoration: none;
  color: var(--cyber-text);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.command-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s ease;
}

.command-btn:hover::before {
  left: 100%;
}

.command-btn:hover {
  transform: translateY(-3px);
}

.command-btn.attack { border-color: var(--cyber-danger); }
.command-btn.attack:hover { box-shadow: 0 0 20px rgba(255, 51, 102, 0.3); }

.command-btn.defense { border-color: var(--cyber-primary); }
.command-btn.defense:hover { box-shadow: 0 0 20px rgba(0, 255, 136, 0.3); }

.command-btn.scanner { border-color: var(--cyber-secondary); }
.command-btn.scanner:hover { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }

.command-btn.lab { border-color: var(--cyber-warning); }
.command-btn.lab:hover { box-shadow: 0 0 20px rgba(255, 204, 0, 0.3); }

.cmd-icon {
  font-size: 1.5rem;
}

.cmd-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.command-btn.attack .cmd-text { color: var(--cyber-danger); }
.command-btn.defense .cmd-text { color: var(--cyber-primary); }
.command-btn.scanner .cmd-text { color: var(--cyber-secondary); }
.command-btn.lab .cmd-text { color: var(--cyber-warning); }

.cmd-desc {
  font-size: 0.75rem;
  color: var(--cyber-muted);
}

/* Attack Feed */
.attack-feed {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.feed-header {
  background: var(--cyber-surface-2);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--cyber-border);
}

.feed-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.blink {
  color: var(--cyber-danger);
  animation: blink 1s infinite;
}

.feed-count {
  font-size: 0.75rem;
  color: var(--cyber-muted);
}

.feed-content {
  max-height: 200px;
  overflow-y: auto;
}

.log-entry {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--cyber-border);
  font-size: 0.8rem;
  display: flex;
  gap: 1rem;
  transition: background 0.2s;
}

.log-entry:hover {
  background: var(--cyber-surface-2);
}

.log-time {
  color: var(--cyber-muted);
  min-width: 70px;
}

.log-type {
  min-width: 80px;
  font-weight: 600;
}

.log-entry.blocked .log-type { color: var(--cyber-danger); }
.log-entry.scan .log-type { color: var(--cyber-secondary); }
.log-entry.warning .log-type { color: var(--cyber-warning); }
.log-entry.info .log-type { color: var(--cyber-primary); }

.log-message {
  color: var(--cyber-text);
}

/* Payload Matrix */
.payload-matrix {
  margin-bottom: 2rem;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.matrix-count {
  font-size: 0.75rem;
  color: var(--cyber-muted);
}

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.payload-item {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payload-item:hover {
  transform: scale(1.02);
}

.payload-item.critical { border-left: 3px solid var(--cyber-danger); }
.payload-item.critical:hover { box-shadow: 0 0 20px rgba(255, 51, 102, 0.2); }

.payload-item.high { border-left: 3px solid #ff6b35; }
.payload-item.high:hover { box-shadow: 0 0 20px rgba(255, 107, 53, 0.2); }

.payload-item.medium { border-left: 3px solid var(--cyber-warning); }
.payload-item.medium:hover { box-shadow: 0 0 20px rgba(255, 204, 0, 0.2); }

.payload-item.low { border-left: 3px solid var(--cyber-primary); }
.payload-item.low:hover { box-shadow: 0 0 20px rgba(0, 255, 136, 0.2); }

.payload-risk {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.payload-item.critical .payload-risk { color: var(--cyber-danger); }
.payload-item.high .payload-risk { color: #ff6b35; }
.payload-item.medium .payload-risk { color: var(--cyber-warning); }
.payload-item.low .payload-risk { color: var(--cyber-primary); }

.payload-code {
  display: block;
  background: var(--cyber-code-bg);
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--cyber-danger);
  margin-bottom: 0.5rem;
  overflow-x: auto;
  white-space: nowrap;
}

.payload-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--cyber-muted);
}

.payload-exec {
  color: var(--cyber-primary);
  opacity: 0;
  transition: opacity 0.3s;
}

.payload-item:hover .payload-exec {
  opacity: 1;
}

/* XSS Types */
.xss-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-card {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.type-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.type-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.type-desc {
  font-size: 0.75rem;
  color: var(--cyber-muted);
}

.type-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.type-card.reflected .type-bar { background: var(--cyber-secondary); }
.type-card.stored .type-bar { background: var(--cyber-danger); }
.type-card.dom .type-bar { background: var(--cyber-warning); }

.type-card.reflected .type-name { color: var(--cyber-secondary); }
.type-card.stored .type-name { color: var(--cyber-danger); }
.type-card.dom .type-name { color: var(--cyber-warning); }

/* Warning Banner */
.warning-banner {
  background: linear-gradient(90deg, rgba(255, 51, 102, 0.1) 0%, rgba(255, 204, 0, 0.1) 100%);
  border: 1px solid var(--cyber-danger);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.warning-icon {
  font-size: 2rem;
}

.warning-text {
  flex: 1;
}

.warning-title {
  display: block;
  color: var(--cyber-danger);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.warning-desc {
  font-size: 0.8rem;
  color: var(--cyber-muted);
}

.warning-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 51, 102, 0.2), transparent);
  animation: scanLine 3s infinite;
}

@keyframes scanLine {
  0% { left: -50%; }
  100% { left: 150%; }
}

/* Cyber Footer */
.cyber-footer {
  background: var(--cyber-surface-2);
  border-top: 1px solid var(--cyber-border);
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.footer-stat {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cyber-primary);
}

.footer-stat .stat-label {
  font-size: 0.65rem;
  color: var(--cyber-muted);
  letter-spacing: 1px;
}

.footer-divider {
  color: var(--cyber-border);
}

/* Responsive */
@media (max-width: 1024px) {
  .status-grid,
  .command-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .matrix-grid,
  .xss-types {
    grid-template-columns: repeat(2, 1fr);
  }

  .ascii-logo {
    font-size: 0.35rem;
  }
}

@media (max-width: 768px) {
  .cyber-home {
    margin: -0.75rem;
    width: calc(100% + 1.5rem);
  }

  .terminal-body {
    padding: 0.75rem;
  }

  .status-grid,
  .command-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .matrix-grid,
  .xss-types {
    grid-template-columns: 1fr;
  }

  .ascii-logo {
    display: none;
  }

  .typing-container {
    font-size: 0.85rem;
    padding: 0.75rem 1rem;
  }

  .status-value {
    font-size: 1.2rem;
  }

  .command-btn {
    padding: 1rem;
  }

  .cmd-text {
    font-size: 0.8rem;
  }

  .warning-banner {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
  }

  .warning-icon {
    font-size: 1.5rem;
  }

  .cyber-footer {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }

  .footer-divider {
    display: none;
  }

  .log-entry {
    flex-wrap: wrap;
    font-size: 0.75rem;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
  }

  .log-time {
    min-width: auto;
  }

  .log-type {
    min-width: auto;
  }

  .log-message {
    width: 100%;
  }

  .feed-header {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .payload-item {
    padding: 0.75rem;
  }

  .payload-code {
    font-size: 0.7rem;
    padding: 0.5rem;
  }

  .matrix-header {
    font-size: 0.9rem;
  }

  .type-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .cyber-home {
    margin: -0.5rem;
    width: calc(100% + 1rem);
  }

  .terminal-body {
    padding: 0.5rem;
  }

  .status-grid,
  .command-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .typing-container {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .status-value {
    font-size: 1rem;
  }

  .status-label {
    font-size: 0.6rem;
  }

  .command-btn {
    padding: 0.75rem;
  }

  .cyber-footer {
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .stat-num {
    font-size: 1rem;
  }

  .warning-title {
    font-size: 0.8rem;
  }

  .warning-desc {
    font-size: 0.7rem;
  }
}
</style>
