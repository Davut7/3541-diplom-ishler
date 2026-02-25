<template>
  <div class="defense-view">
    <div class="page-header">
      <h1>{{ t.defense.title }}</h1>
      <p>{{ t.defense.subtitle }}</p>
    </div>

    <div class="techniques-grid">
      <Card v-for="(technique, key) in t.defense.techniques" :key="key" class="technique-card">
        <template #content>
          <div class="technique-header">
            <div class="technique-icon" :class="getIconClass(key)">
              <i :class="getIcon(key)"></i>
            </div>
            <h3>{{ technique.name }}</h3>
          </div>
          <p class="technique-desc">{{ technique.desc }}</p>
          <div class="technique-example">
            <code>{{ technique.example }}</code>
          </div>
        </template>
      </Card>
    </div>

    <Card class="demo-card">
      <template #content>
        <h2><i class="pi pi-shield"></i> {{ t.defense.tryDefense }}</h2>

        <div class="demo-layout">
          <div class="input-section">
            <label>{{ t.defense.inputLabel }}</label>
            <Textarea v-model="maliciousInput" rows="3" class="demo-input" placeholder="<script>alert('XSS')</script>" />
          </div>

          <div class="defense-options">
            <div class="defense-option" v-for="defense in defenses" :key="defense.id">
              <ToggleSwitch v-model="defense.enabled" />
              <span>{{ defense.name }}</span>
            </div>
          </div>

          <Button :label="t.defense.testDefense" icon="pi pi-check" @click="testDefense" class="test-btn" />

          <div class="output-section">
            <label>{{ t.defense.outputLabel }}</label>
            <div class="output-box">
              <pre>{{ sanitizedOutput }}</pre>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="csp-card">
      <template #content>
        <h2><i class="pi pi-lock"></i> Content Security Policy Examples</h2>
        <div class="csp-examples">
          <div class="csp-example">
            <h4>Basic CSP</h4>
            <code>Content-Security-Policy: default-src 'self'</code>
            <p>Only allow resources from same origin</p>
          </div>
          <div class="csp-example">
            <h4>Strict CSP</h4>
            <code>Content-Security-Policy: script-src 'self'; style-src 'self'; img-src 'self' data:</code>
            <p>Strict control over scripts, styles, and images</p>
          </div>
          <div class="csp-example">
            <h4>Nonce-based CSP</h4>
            <code>Content-Security-Policy: script-src 'nonce-abc123'</code>
            <p>Only scripts with matching nonce attribute can execute</p>
          </div>
        </div>
      </template>
    </Card>

    <Card class="checklist-card">
      <template #content>
        <h2><i class="pi pi-check-square"></i> XSS Prevention Checklist</h2>
        <div class="checklist">
          <div class="checklist-item" v-for="(item, i) in checklist" :key="i">
            <i class="pi pi-check-circle"></i>
            <span>{{ item }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const maliciousInput = ref("<script>alert('XSS')</script>")

    const defenses = ref([
      { id: 'htmlEscape', name: 'HTML Escape', enabled: true },
      { id: 'removeScripts', name: 'Remove Script Tags', enabled: true },
      { id: 'removeEvents', name: 'Remove Event Handlers', enabled: true },
      { id: 'encodeUrl', name: 'URL Encode', enabled: false }
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
        output = output.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT REMOVED]')
      }

      if (defenses.value.find(d => d.id === 'removeEvents' && d.enabled)) {
        output = output.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '[EVENT REMOVED]')
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
        inputValidation: 'icon-blue',
        outputEncoding: 'icon-green',
        csp: 'icon-purple',
        httpOnly: 'icon-yellow',
        sanitization: 'icon-red',
        escaping: 'icon-cyan'
      }
      return classes[key] || 'icon-blue'
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.techniques-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.technique-card {
  transition: transform 0.2s;
}

.technique-card:hover {
  transform: translateY(-4px);
}

.technique-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.technique-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.technique-icon i {
  font-size: 1.5rem;
  color: white;
}

.icon-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.icon-green { background: linear-gradient(135deg, #22c55e, #16a34a); }
.icon-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.icon-yellow { background: linear-gradient(135deg, #eab308, #ca8a04); }
.icon-red { background: linear-gradient(135deg, #ef4444, #dc2626); }
.icon-cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }

.technique-desc {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.technique-example {
  background: var(--bg-primary);
  padding: 0.75rem;
  border-radius: 8px;
}

.technique-example code {
  font-family: monospace;
  font-size: 0.85rem;
  color: #22c55e;
}

.demo-card,
.csp-card,
.checklist-card {
  margin-bottom: 1.5rem;
}

.demo-card h2,
.csp-card h2,
.checklist-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.demo-card h2 i { color: #22c55e; }
.csp-card h2 i { color: #8b5cf6; }
.checklist-card h2 i { color: #3b82f6; }

.demo-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section label,
.output-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.demo-input {
  width: 100%;
  font-family: monospace;
}

.defense-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.defense-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.test-btn {
  align-self: flex-start;
}

.output-box {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #22c55e;
}

.output-box pre {
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.csp-examples {
  display: grid;
  gap: 1rem;
}

.csp-example {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 8px;
}

.csp-example h4 {
  margin-bottom: 0.5rem;
  color: #8b5cf6;
}

.csp-example code {
  display: block;
  font-family: monospace;
  font-size: 0.85rem;
  background: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.csp-example p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.checklist {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.checklist-item i {
  color: #22c55e;
  margin-top: 0.1rem;
}
</style>
