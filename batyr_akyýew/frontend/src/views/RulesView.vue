<template>
  <div class="rules-view">
    <div class="page-header">
      <h1>{{ t.rules.title }}</h1>
      <p>{{ t.rules.subtitle }}</p>
    </div>

    <!-- Real Attack Test Panel -->
    <Card class="attack-test-card">
      <template #content>
        <div class="attack-test-header">
          <h3><i class="pi pi-bolt"></i> Real Attack Test</h3>
          <p>Test real attacks against a target website through WAF proxy</p>
        </div>

        <div class="target-config">
          <div class="input-group">
            <label>Target URL:</label>
            <InputText v-model="targetUrl" placeholder="https://your-university-site.edu" style="width: 100%" />
          </div>
        </div>

        <div class="attack-test-buttons">
          <Button
            v-for="(label, key) in attackLabels"
            :key="key"
            :label="'🔥 ' + label"
            :severity="key === 'normal' ? 'success' : 'danger'"
            @click="sendRealAttack(key)"
            :loading="attackLoading === key"
            :disabled="!targetUrl"
          />
        </div>

        <div class="attack-result" v-if="attackResult">
          <h4><i class="pi pi-shield"></i> WAF Analysis Result</h4>
          <div class="result-grid">
            <div class="result-item">
              <span class="result-label">Status:</span>
              <Tag :severity="attackResult.blocked ? 'danger' : 'success'" :value="attackResult.blocked ? 'BLOCKED' : 'ALLOWED'" />
            </div>
            <div class="result-item">
              <span class="result-label">Risk Score:</span>
              <span class="result-value risk" :class="getRiskClass(attackResult.riskScore)">{{ attackResult.riskScore }}%</span>
            </div>
            <div class="result-item">
              <span class="result-label">Attack Type:</span>
              <span class="result-value">{{ attackResult.attackType }}</span>
            </div>
            <div class="result-item" v-if="attackResult.threats && attackResult.threats.length">
              <span class="result-label">Threats:</span>
              <span class="result-value">{{ attackResult.threats.map(t => t.type).join(', ') }}</span>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <div class="rules-header">
          <h3>Protection Rules</h3>
          <div class="rules-actions">
            <Button
              v-if="!allEnabled"
              label="Enable All"
              icon="pi pi-check-circle"
              severity="success"
              @click="toggleAllRules(true)"
              :loading="togglingAll"
            />
            <Button
              v-else
              label="Disable All"
              icon="pi pi-times-circle"
              severity="danger"
              @click="toggleAllRules(false)"
              :loading="togglingAll"
            />
            <Button label="Refresh" icon="pi pi-refresh" severity="secondary" @click="fetchRules" />
          </div>
        </div>

        <DataTable :value="rules" :paginator="true" :rows="10" stripedRows>
          <Column field="name" :header="t.rules.columns.name" style="width: 25%"></Column>
          <Column field="pattern" :header="t.rules.columns.pattern" style="width: 20%"></Column>
          <Column field="action" :header="t.rules.columns.action" style="width: 12%">
            <template #body="{ data }">
              <Tag :severity="getActionSeverity(data.action)" :value="data.action" />
            </template>
          </Column>
          <Column field="severity" :header="t.rules.columns.severity" style="width: 12%">
            <template #body="{ data }">
              <Tag :severity="getSeverityColor(data.severity)" :value="data.severity" />
            </template>
          </Column>
          <Column field="hits" :header="t.rules.columns.hits" style="width: 12%">
            <template #body="{ data }">
              <strong>{{ data.hits.toLocaleString() }}</strong>
            </template>
          </Column>
          <Column field="enabled" :header="t.rules.columns.status" style="width: 19%">
            <template #body="{ data }">
              <ToggleSwitch v-model="data.enabled" @change="toggleRule(data.id)" />
              <Tag :severity="data.enabled ? 'success' : 'secondary'" :value="data.enabled ? 'Active' : 'Disabled'" style="margin-left: 0.5rem" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const rules = ref([])
    const loading = ref(true)
    const togglingAll = ref(false)
    const allEnabled = ref(false)

    // Real attack test state
    const targetUrl = ref('')
    const attackLoading = ref(null)
    const attackResult = ref(null)
    const attackLabels = {
      sql: 'SQL Injection',
      xss: 'XSS Attack',
      path: 'Path Traversal',
      cmd: 'Command Injection',
      normal: 'Normal Request'
    }

    const fetchRules = async () => {
      try {
        const res = await fetch('/api/rules')
        const data = await res.json()
        if (data.success) {
          // Convert enabled from 0/1 to boolean
          rules.value = data.rules.map(rule => ({
            ...rule,
            enabled: Boolean(rule.enabled)
          }))
          // Check if all rules are enabled
          allEnabled.value = rules.value.length > 0 && rules.value.every(r => r.enabled)
        }
      } catch (e) {
        console.error('Failed to fetch rules:', e)
      } finally {
        loading.value = false
      }
    }

    const toggleRule = async (id) => {
      try {
        const res = await fetch(`/api/rules/${id}/toggle`, { method: 'PATCH' })
        const data = await res.json()
        if (data.success) {
          // Update local state
          const rule = rules.value.find(r => r.id === id)
          if (rule) {
            rule.enabled = Boolean(data.rule.enabled)
          }
          // Update allEnabled state
          allEnabled.value = rules.value.length > 0 && rules.value.every(r => r.enabled)
        }
      } catch (e) {
        console.error('Failed to toggle rule:', e)
        // Revert on error
        fetchRules()
      }
    }

    // Toggle all rules (enable or disable)
    const toggleAllRules = async (enable) => {
      togglingAll.value = true
      try {
        const endpoint = enable ? '/api/rules/enable-all' : '/api/rules/disable-all'
        const res = await fetch(endpoint, { method: 'POST' })
        const data = await res.json()
        if (data.success) {
          rules.value = data.rules.map(rule => ({
            ...rule,
            enabled: Boolean(rule.enabled)
          }))
          allEnabled.value = enable
        }
      } catch (e) {
        console.error('Failed to toggle all rules:', e)
      } finally {
        togglingAll.value = false
      }
    }

    // Send real attack
    const sendRealAttack = async (attackType) => {
      attackLoading.value = attackType
      attackResult.value = null

      // Build attack payload based on type
      let attackPayload = {}
      const targetWithPayload = targetUrl.value

      // Attack payloads - using string concatenation to avoid Vue template issues
      const scriptTag = '<' + 'script>alert("XSS")</' + 'script>'
      const imgTag = '<' + 'img src=x onerror=alert(document.cookie)>'

      switch (attackType) {
        case 'sql':
          attackPayload = {
            url: targetWithPayload + "?id=1' OR '1'='1'--",
            body: { query: "SELECT * FROM users WHERE id='1' OR '1'='1'" },
            method: 'GET'
          }
          break
        case 'xss':
          attackPayload = {
            url: targetWithPayload + '?search=' + scriptTag,
            body: { comment: imgTag },
            method: 'GET'
          }
          break
        case 'path':
          attackPayload = {
            url: targetWithPayload + '/../../../etc/passwd',
            body: { file: '../../etc/shadow' },
            method: 'GET'
          }
          break
        case 'cmd':
          attackPayload = {
            url: targetWithPayload + '?cmd=;cat /etc/passwd',
            body: { exec: '&& rm -rf /' },
            method: 'GET'
          }
          break
        default:
          attackPayload = {
            url: targetWithPayload,
            body: { action: 'view', page: 'home' },
            method: 'GET'
          }
      }

      try {
        // Send to WAF analyze endpoint
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...attackPayload,
            ip: '192.168.1.' + Math.floor(Math.random() * 255),
            sessionId: 'real-attack-test-' + Date.now(),
            headers: { 'user-agent': 'Real Attack Tester / WAF Demo' }
          })
        })

        const data = await res.json()

        if (data.success) {
          attackResult.value = {
            attackType: attackLabels[attackType],
            blocked: data.analysis.request.isBlocked,
            riskScore: data.analysis.combinedRiskScore,
            threats: data.analysis.request.threats,
            action: data.analysis.finalAction,
            targetUrl: targetWithPayload
          }
        }
      } catch (e) {
        console.error('Real attack test failed:', e)
        attackResult.value = {
          attackType: attackLabels[attackType],
          blocked: false,
          riskScore: 0,
          error: e.message
        }
      } finally {
        attackLoading.value = null
      }
    }

    const getActionSeverity = (action) => {
      const map = { block: 'danger', allow: 'success', challenge: 'warn', limit: 'info', alert: 'secondary' }
      return map[action] || 'info'
    }

    const getSeverityColor = (severity) => {
      const map = { critical: 'danger', high: 'warn', medium: 'info', low: 'secondary' }
      return map[severity] || 'info'
    }

    const getRiskClass = (score) => {
      if (score >= 70) return 'critical'
      if (score >= 50) return 'high'
      if (score >= 30) return 'medium'
      return 'low'
    }

    onMounted(fetchRules)

    return {
      rules, loading, toggleRule, getActionSeverity, getSeverityColor, fetchRules,
      togglingAll, toggleAllRules, allEnabled,
      targetUrl, attackLoading, attackResult, attackLabels, sendRealAttack, getRiskClass
    }
  }
}
</script>

<style scoped>
.rules-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.page-header p {
  color: var(--text-secondary);
}

/* Real Attack Test Card */
.attack-test-card {
  margin-bottom: 2rem;
  border: 2px solid #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

.attack-test-header {
  margin-bottom: 1.5rem;
}

.attack-test-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
  color: #dc2626;
  font-size: 1.25rem;
}

.attack-test-header h3 i {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.attack-test-header p {
  color: var(--text-secondary);
  margin: 0;
}

.target-config {
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: var(--text-primary);
}

.attack-test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.attack-test-buttons :deep(.p-button) {
  font-weight: 600;
  transition: all 0.3s ease;
}

.attack-test-buttons :deep(.p-button:hover) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.attack-result {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.attack-result h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.attack-result h4 i {
  color: #06b6d4;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.result-value {
  font-weight: 600;
  font-size: 1.1rem;
}

.result-value.risk {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
  width: fit-content;
  color: white;
}

.result-value.risk.low { background: #22c55e; }
.result-value.risk.medium { background: #eab308; }
.result-value.risk.high { background: #f97316; }
.result-value.risk.critical { background: #ef4444; }

/* Rules Header */
.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.rules-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.rules-actions {
  display: flex;
  gap: 0.5rem;
}

:deep(.p-card) {
  animation: fadeInUp 0.6s ease-out 0.2s both;
  border-radius: 16px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-datatable-tbody > tr) {
  transition: all 0.3s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  transform: scale(1.01);
}

:deep(.p-toggleswitch) {
  transition: all 0.3s ease;
}

:deep(.p-toggleswitch:hover) {
  transform: scale(1.1);
}

:deep(.p-tag) {
  transition: all 0.3s ease;
}

:deep(.p-tag:hover) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .attack-test-buttons {
    flex-direction: column;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }

  .rules-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .rules-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  :deep(.p-datatable-table-container) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .attack-test-header h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }

  .attack-result {
    padding: 1rem;
  }

  .result-value {
    font-size: 1rem;
  }
}
</style>
