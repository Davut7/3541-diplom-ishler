<template>
  <div class="attack-lab-view">
    <div class="page-header">
      <h1>{{ t.attackLab.title }}</h1>
      <p>{{ t.attackLab.subtitle }}</p>
    </div>

    <Card class="warning-card">
      <template #content>
        <div class="warning-banner">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ t.attackLab.warning }}</span>
        </div>
      </template>
    </Card>

    <div class="lab-layout">
      <Card class="attack-panel">
        <template #content>
          <h3>{{ t.attackLab.selectAttack }}</h3>
          <div class="attack-types">
            <div v-for="(attack, key) in t.attackLab.attackTypes" :key="key"
                 class="attack-type" :class="{ active: selectedAttack === key }"
                 @click="selectedAttack = key">
              <div class="attack-icon">
                <i :class="getAttackIcon(key)"></i>
              </div>
              <div class="attack-info">
                <h4>{{ attack.name }}</h4>
                <p>{{ attack.desc }}</p>
              </div>
            </div>
          </div>

          <div class="payload-section">
            <label>{{ t.attackLab.payload }}</label>
            <Textarea v-model="payload" :placeholder="t.attackLab.payloadPlaceholder" rows="3" class="payload-input" />
          </div>

          <div class="examples-section">
            <h4>{{ t.attackLab.examples.title }}</h4>
            <div class="example-buttons">
              <Button label="Alert XSS" size="small" severity="danger" outlined @click="setPayload('basic')" />
              <Button label="Cookie Steal" size="small" severity="danger" outlined @click="setPayload('cookie')" />
              <Button label="IMG Tag" size="small" severity="warning" outlined @click="setPayload('imgTag')" />
              <Button label="SVG Tag" size="small" severity="warning" outlined @click="setPayload('svgTag')" />
              <Button label="Input Focus" size="small" severity="warning" outlined @click="setPayload('inputTag')" />
              <Button label="Event Handler" size="small" severity="warning" outlined @click="setPayload('eventHandler')" />
              <Button label="iFrame" size="small" severity="info" outlined @click="setPayload('iframe')" />
            </div>
          </div>

          <Button :label="t.attackLab.executeAttack" icon="pi pi-bolt" severity="danger" @click="executeAttack" class="execute-btn" />
        </template>
      </Card>

      <Card class="target-panel">
        <template #content>
          <h3>{{ t.attackLab.targetInput }}</h3>
          <div class="vulnerable-form">
            <label>Search:</label>
            <InputText v-model="userInput" :placeholder="t.attackLab.targetPlaceholder" class="vulnerable-input" />
            <Button label="Submit" icon="pi pi-search" @click="submitInput" />
          </div>

          <div class="result-section" v-if="showResult">
            <h4>{{ t.attackLab.result }}</h4>
            <div class="result-box" :class="{ success: attackSuccess, blocked: !attackSuccess }">
              <i :class="attackSuccess ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
              <span>{{ attackSuccess ? t.attackLab.success : t.attackLab.blocked }}</span>
            </div>
          </div>

          <div class="preview-section">
            <h4>{{ t.attackLab.resultPreview }}</h4>
            <div class="preview-box">
              <div v-if="defenseEnabled" class="sanitized-output">
                <div class="defense-active">
                  <i class="pi pi-shield"></i>
                  <span>Defense Active - Code Escaped:</span>
                </div>
                <code>{{ sanitizedOutput }}</code>
              </div>
              <div v-else class="raw-output">
                <div class="attack-simulation" v-if="attackSuccess">
                  <div class="fake-alert">
                    <div class="alert-header">
                      <span>⚠️ JavaScript Alert</span>
                      <button @click="showResult = false">×</button>
                    </div>
                    <div class="alert-body">
                      <p>{{ currentEffect || 'XSS Attack Executed!' }}</p>
                    </div>
                    <button class="alert-ok">OK</button>
                  </div>
                </div>
                <div class="payload-display">
                  <span class="label">Injected Code:</span>
                  <code>{{ rawOutput }}</code>
                </div>
              </div>
            </div>
          </div>

          <div class="defense-toggle">
            <ToggleSwitch v-model="defenseEnabled" />
            <span>Defense: {{ defenseEnabled ? 'ON' : 'OFF' }}</span>
          </div>
        </template>
      </Card>
    </div>

    <Card class="code-panel">
      <template #content>
        <h3><i class="pi pi-code"></i> XSS Attack Examples & Prevention</h3>
        <TabView>
          <TabPanel header="Reflected XSS">
            <pre class="code-block vulnerable-code">// VULNERABLE: URL parameter directly in HTML
// URL: example.com/search?q=&lt;script&gt;alert('XSS')&lt;/script&gt;

app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`&lt;h1&gt;Results for: ${query}&lt;/h1&gt;`); // DANGER!
});

// ATTACK PAYLOADS:
// &lt;script&gt;alert('XSS')&lt;/script&gt;
// &lt;img src=x onerror="alert('XSS')"&gt;
// &lt;svg onload="alert('XSS')"&gt;</pre>
          </TabPanel>
          <TabPanel header="Stored XSS">
            <pre class="code-block vulnerable-code">// VULNERABLE: User comment saved and displayed
// Attacker posts: &lt;script&gt;stealCookies()&lt;/script&gt;

// Saving comment (NO SANITIZATION)
db.saveComment(req.body.comment);

// Displaying comments (DANGEROUS)
comments.forEach(c => {
  html += `&lt;div class="comment"&gt;${c.text}&lt;/div&gt;`;
});

// Every user who views the page gets attacked!</pre>
          </TabPanel>
          <TabPanel header="DOM XSS">
            <pre class="code-block vulnerable-code">// VULNERABLE: DOM manipulation with user input
// URL: example.com/page#&lt;img src=x onerror=alert('XSS')&gt;

// Reading from URL hash
const userInput = location.hash.substring(1);

// DANGEROUS: Direct DOM insertion
document.getElementById('output').innerHTML = userInput;

// DANGEROUS: eval() usage
eval('var data = "' + userInput + '"');

// DANGEROUS: document.write
document.write('Hello ' + userInput);</pre>
          </TabPanel>
          <TabPanel header="Secure Code">
            <pre class="code-block secure-code">// SECURE: Always sanitize and encode!

// 1. Use textContent instead of innerHTML
element.textContent = userInput;

// 2. HTML Entity Encoding
function escapeHtml(text) {
  const map = {
    '&': '&amp;', '&lt;': '&lt;', '&gt;': '&gt;',
    '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&amp;&lt;&gt;"']/g, m => map[m]);
}

// 3. Use DOMPurify library
const clean = DOMPurify.sanitize(dirty);

// 4. Content Security Policy Header
Content-Security-Policy: default-src 'self';
  script-src 'self'; style-src 'self';</pre>
          </TabPanel>
          <TabPanel header="CSP Examples">
            <pre class="code-block secure-code">// Content Security Policy (CSP) Headers

// Basic - Only allow same origin
Content-Security-Policy: default-src 'self'

// Block inline scripts (prevents most XSS)
Content-Security-Policy: script-src 'self'

// Allow specific domains
Content-Security-Policy:
  script-src 'self' https://trusted.com;
  style-src 'self' https://fonts.googleapis.com;
  img-src 'self' data: https:;

// Nonce-based (most secure)
Content-Security-Policy: script-src 'nonce-abc123'
&lt;script nonce="abc123"&gt;...&lt;/script&gt;

// Report violations
Content-Security-Policy-Report-Only:
  default-src 'self'; report-uri /csp-report</pre>
          </TabPanel>
        </TabView>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const selectedAttack = ref('reflected')
    const payload = ref('')
    const userInput = ref('')
    const showResult = ref(false)
    const attackSuccess = ref(false)
    const defenseEnabled = ref(false)

    const payloads = {
      basic: { code: '<script>alert("XSS")<\/script>', effect: 'Shows alert popup with "XSS"' },
      cookie: { code: '<script>alert(document.cookie)<\/script>', effect: 'Steals and displays cookies' },
      imgTag: { code: '<img src=x onerror="alert(1)">', effect: 'Image error triggers JS' },
      svgTag: { code: '<svg onload="alert(1)">', effect: 'SVG load triggers JS' },
      inputTag: { code: '<input onfocus=alert(1) autofocus>', effect: 'Auto-focus triggers JS' },
      eventHandler: { code: '<div onmouseover="alert(1)">Hover</div>', effect: 'Mouse hover triggers JS' },
      iframe: { code: '<iframe src="javascript:alert(1)">', effect: 'iFrame executes JS' }
    }

    const currentEffect = ref('')

    const setPayload = (type) => {
      payload.value = payloads[type].code
      currentEffect.value = payloads[type].effect
    }

    const escapeHtml = (text) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
      return text.replace(/[&<>"']/g, m => map[m])
    }

    const rawOutput = computed(() => {
      return userInput.value || payload.value
    })

    const sanitizedOutput = computed(() => {
      return escapeHtml(userInput.value || payload.value)
    })

    const hasXssPattern = (input) => {
      const patterns = [/<script/i, /onerror/i, /onload/i, /onfocus/i, /onmouseover/i, /javascript:/i, /<svg/i, /<iframe/i]
      return patterns.some(p => p.test(input))
    }

    const executeAttack = () => {
      userInput.value = payload.value
      showResult.value = true
      attackSuccess.value = !defenseEnabled.value && hasXssPattern(payload.value)
    }

    const submitInput = () => {
      showResult.value = true
      attackSuccess.value = !defenseEnabled.value && hasXssPattern(userInput.value)
    }

    const getAttackIcon = (key) => {
      const icons = {
        reflected: 'pi pi-replay',
        stored: 'pi pi-database',
        dom: 'pi pi-sitemap'
      }
      return icons[key] || 'pi pi-bolt'
    }

    return {
      selectedAttack,
      payload,
      userInput,
      showResult,
      attackSuccess,
      defenseEnabled,
      rawOutput,
      sanitizedOutput,
      currentEffect,
      setPayload,
      executeAttack,
      submitInput,
      getAttackIcon
    }
  }
}
</script>

<style scoped>
.attack-lab-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.warning-card {
  margin-bottom: 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
}

.warning-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ef4444;
  font-weight: 500;
}

.warning-banner i {
  font-size: 1.5rem;
}

.lab-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.attack-panel h3,
.target-panel h3 {
  margin-bottom: 1rem;
}

.attack-types {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.attack-type {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.attack-type:hover {
  border-color: #f97316;
}

.attack-type.active {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
}

.attack-icon {
  width: 40px;
  height: 40px;
  background: #ef4444;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attack-icon i {
  color: white;
}

.attack-info h4 {
  margin-bottom: 0.25rem;
}

.attack-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.payload-section {
  margin-bottom: 1rem;
}

.payload-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.payload-input {
  width: 100%;
  font-family: monospace;
}

.examples-section h4 {
  margin-bottom: 0.5rem;
}

.example-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.execute-btn {
  width: 100%;
}

.vulnerable-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.vulnerable-input {
  width: 100%;
}

.result-section {
  margin-bottom: 1rem;
}

.result-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
}

.result-box.success {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.result-box.blocked {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.result-box i {
  font-size: 1.25rem;
}

.preview-section h4 {
  margin-bottom: 0.5rem;
}

.preview-box {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 8px;
  min-height: 120px;
  border: 1px dashed var(--border-color);
}

.defense-active {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #22c55e;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.defense-active i {
  font-size: 1.25rem;
}

.sanitized-output code {
  display: block;
  background: rgba(34, 197, 94, 0.1);
  padding: 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  word-break: break-all;
}

.attack-simulation {
  margin-bottom: 1rem;
}

.fake-alert {
  background: #1e1e2e;
  border: 2px solid #ef4444;
  border-radius: 8px;
  max-width: 300px;
  margin: 0 auto;
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.3);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.alert-header {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.alert-header button {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
}

.alert-body {
  padding: 1.5rem;
  text-align: center;
  color: #fff;
}

.alert-body p {
  margin: 0;
  font-size: 1rem;
}

.alert-ok {
  display: block;
  width: calc(100% - 2rem);
  margin: 0 1rem 1rem;
  padding: 0.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.payload-display {
  margin-top: 0.75rem;
}

.payload-display .label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.payload-display code {
  display: block;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  color: #ef4444;
  word-break: break-all;
}

.defense-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.code-panel h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.code-panel h3 i {
  color: #f97316;
}

.code-block {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre;
}

.vulnerable-code {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
}

.secure-code {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
}

@media (max-width: 768px) {
  .lab-layout {
    grid-template-columns: 1fr;
  }
}
</style>
