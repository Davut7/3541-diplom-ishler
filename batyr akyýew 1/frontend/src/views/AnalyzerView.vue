<template>
  <div class="analyzer-view">
    <div class="page-header">
      <h1>{{ t.analyzer.title }}</h1>
      <p>{{ t.analyzer.subtitle }}</p>
    </div>

    <!-- Auto-Test Control Panel -->
    <Card class="auto-test-card">
      <template #content>
        <div class="auto-test-header">
          <div class="auto-test-title">
            <i class="pi pi-sync" :class="{ spinning: autoTestRunning }"></i>
            <h3>Auto Attack Tester</h3>
          </div>
          <div class="auto-test-controls">
            <Button
              :label="autoTestRunning ? 'Stop Testing' : 'Start Auto Test'"
              :icon="autoTestRunning ? 'pi pi-stop' : 'pi pi-play'"
              :severity="autoTestRunning ? 'danger' : 'success'"
              @click="toggleAutoTest"
              :loading="autoTestStarting"
            />
            <Button
              label="Generate 100 Tests"
              icon="pi pi-bolt"
              severity="info"
              @click="generateBulkTests"
              :loading="bulkGenerating"
              :disabled="autoTestRunning"
            />
          </div>
        </div>

        <div class="auto-test-stats" v-if="autoTestStats.totalTests > 0 || autoTestRunning">
          <div class="auto-stat">
            <span class="auto-stat-value">{{ autoTestStats.totalTests }}</span>
            <span class="auto-stat-label">Total Tests</span>
          </div>
          <div class="auto-stat blocked">
            <span class="auto-stat-value">{{ autoTestStats.blocked }}</span>
            <span class="auto-stat-label">Blocked</span>
          </div>
          <div class="auto-stat allowed">
            <span class="auto-stat-value">{{ autoTestStats.allowed }}</span>
            <span class="auto-stat-label">Allowed</span>
          </div>
          <div class="auto-stat">
            <span class="auto-stat-value">{{ autoTestStats.currentAttack || '-' }}</span>
            <span class="auto-stat-label">Current Attack</span>
          </div>
        </div>

        <div class="auto-test-progress" v-if="autoTestRunning">
          <ProgressBar mode="indeterminate" style="height: 6px" />
          <p class="progress-text">Testing: {{ autoTestStats.currentAttack }} attacks...</p>
        </div>

        <div class="auto-test-log" v-if="autoTestLog.length > 0">
          <h4><i class="pi pi-list"></i> Recent Test Results</h4>
          <div class="log-entries">
            <div v-for="(log, i) in autoTestLog.slice(0, 5)" :key="i" class="log-entry" :class="log.action">
              <Tag :severity="log.action === 'block' ? 'danger' : 'success'" :value="log.action.toUpperCase()" />
              <span class="log-type">{{ log.attackType }}</span>
              <span class="log-ip">{{ log.ip }}</span>
              <span class="log-risk">Risk: {{ log.riskScore }}%</span>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <div class="analyzer-grid">
      <Card class="test-card">
        <template #content>
          <h3><i class="pi pi-bolt"></i> {{ t.analyzer.testAttack }}</h3>
          <div class="attack-buttons">
            <Button v-for="(label, key) in t.analyzer.attackTypes" :key="key"
              :label="label"
              :severity="key === 'normal' ? 'success' : 'danger'"
              @click="testAttack(key)"
              :loading="loading && selectedAttack === key"
              :disabled="autoTestRunning"
            />
          </div>

          <div class="error-message" v-if="error">
            <i class="pi pi-exclamation-triangle"></i> {{ error }}
          </div>
        </template>
      </Card>

      <Card class="results-card" v-if="result">
        <template #content>
          <h3><i class="pi pi-chart-bar"></i> {{ t.analyzer.results.title }}</h3>

          <!-- Attack Info -->
          <div class="attack-info" v-if="result.attackType">
            <Tag severity="info" :value="'Test: ' + result.attackType.toUpperCase()" />
            <Tag severity="secondary" :value="'IP: ' + result.sourceIP" style="margin-left: 0.5rem" />
          </div>

          <div class="result-stats">
            <div class="result-stat">
              <div class="risk-circle" :class="getRiskClass(result.riskScore)">
                <span>{{ result.riskScore }}%</span>
              </div>
              <span class="stat-label">{{ t.analyzer.results.riskScore }}</span>
            </div>
            <div class="result-stat">
              <Tag :severity="getActionSeverity(result.action)" :value="result.action.toUpperCase()" style="font-size: 1.2rem; padding: 0.75rem 1.5rem" />
              <span class="stat-label">{{ t.analyzer.results.action }}</span>
            </div>
          </div>

          <div class="threats-section" v-if="result.threats && result.threats.length">
            <h4>{{ t.analyzer.results.threats }}</h4>
            <div class="threat-list">
              <div v-for="(threat, i) in result.threats" :key="i" class="threat-item">
                <Tag :severity="getSeverityColor(threat.severity)" :value="threat.type" />
                <span>{{ threat.details || threat.pattern }}</span>
              </div>
            </div>
          </div>

          <div class="threats-section" v-else-if="result.action === 'allow'">
            <h4>{{ t.analyzer.results.threats }}</h4>
            <p style="color: #22c55e"><i class="pi pi-check-circle"></i> No threats detected - Request is safe</p>
          </div>

          <div class="behavior-section">
            <h4>{{ t.analyzer.results.behavior }}: {{ result.behaviorScore || 0 }}%</h4>
            <div v-if="result.anomalies && result.anomalies.length">
              <Tag v-for="(anomaly, i) in result.anomalies" :key="i" :severity="getSeverityColor(anomaly.severity)" :value="anomaly.type" style="margin-right: 0.5rem; margin-bottom: 0.5rem" />
            </div>
            <p v-else style="color: #22c55e"><i class="pi pi-check-circle"></i> No behavioral anomalies detected</p>
          </div>

          <!-- Geolocation Info -->
          <div class="geo-section" v-if="result.geolocation">
            <h4><i class="pi pi-map-marker"></i> Geolocation</h4>
            <p>{{ result.geolocation.city }}, {{ result.geolocation.country }} ({{ result.geolocation.countryCode }})</p>
          </div>
        </template>
      </Card>

      <!-- Placeholder when no result -->
      <Card class="results-card placeholder-card" v-else>
        <template #content>
          <div class="placeholder-content">
            <i class="pi pi-arrow-left"></i>
            <h3>Select an attack type to test</h3>
            <p>Click on any button to simulate an attack and see WAF analysis results</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const loading = ref(false)
    const selectedAttack = ref(null)
    const result = ref(null)
    const error = ref(null)

    // Auto-test state
    const autoTestRunning = ref(false)
    const autoTestStarting = ref(false)
    const bulkGenerating = ref(false)
    const autoTestInterval = ref(null)
    const autoTestStats = ref({
      totalTests: 0,
      blocked: 0,
      allowed: 0,
      currentAttack: null
    })
    const autoTestLog = ref([])
    const attackTypes = ['sql', 'xss', 'path', 'cmd', 'normal']
    let currentAttackIndex = 0

    // Single attack test
    const testAttack = async (attackType) => {
      loading.value = true
      selectedAttack.value = attackType
      error.value = null
      result.value = null

      try {
        const res = await fetch('/api/test-attack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attackType })
        })

        if (!res.ok) {
          throw new Error('Server error: ' + res.status)
        }

        const data = await res.json()

        result.value = {
          attackType: data.attackType,
          sourceIP: data.sourceIP,
          testPayload: data.testPayload,
          riskScore: data.analysis.riskScore,
          action: data.analysis.isBlocked ? 'block' : data.analysis.action,
          threats: data.analysis.threats || [],
          geolocation: data.analysis.geolocation,
          behaviorScore: 0,
          anomalies: []
        }

        try {
          const analyzeRes = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: data.testPayload.url,
              body: data.testPayload.body,
              ip: data.sourceIP,
              sessionId: 'test-session-' + Date.now(),
              headers: { 'user-agent': 'WAF Test Browser' }
            })
          })

          if (analyzeRes.ok) {
            const analyzeData = await analyzeRes.json()
            if (analyzeData.analysis) {
              result.value.behaviorScore = analyzeData.analysis.behavior?.behaviorScore || 0
              result.value.anomalies = analyzeData.analysis.behavior?.anomalies || []
              result.value.riskScore = analyzeData.analysis.combinedRiskScore || result.value.riskScore
            }
          }
        } catch (e) {
          console.warn('Behavioral analysis failed:', e)
        }

      } catch (e) {
        console.error('Test failed:', e)
        error.value = 'Failed to test attack: ' + e.message
      } finally {
        loading.value = false
      }
    }

    // Auto-test single iteration
    const runSingleAutoTest = async () => {
      const attackType = attackTypes[currentAttackIndex]
      autoTestStats.value.currentAttack = attackType.toUpperCase()

      try {
        const res = await fetch('/api/test-attack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attackType })
        })

        if (res.ok) {
          const data = await res.json()
          const action = data.analysis.isBlocked ? 'block' : 'allow'

          autoTestStats.value.totalTests++
          if (action === 'block') {
            autoTestStats.value.blocked++
          } else {
            autoTestStats.value.allowed++
          }

          // Add to log (keep last 20)
          autoTestLog.value.unshift({
            attackType: attackType.toUpperCase(),
            ip: data.sourceIP,
            riskScore: data.analysis.riskScore,
            action: action,
            timestamp: new Date()
          })
          if (autoTestLog.value.length > 20) {
            autoTestLog.value.pop()
          }
        }
      } catch (e) {
        console.error('Auto-test error:', e)
      }

      // Cycle to next attack type
      currentAttackIndex = (currentAttackIndex + 1) % attackTypes.length
    }

    // Toggle auto-test
    const toggleAutoTest = async () => {
      if (autoTestRunning.value) {
        // Stop
        if (autoTestInterval.value) {
          clearInterval(autoTestInterval.value)
          autoTestInterval.value = null
        }
        autoTestRunning.value = false
        autoTestStats.value.currentAttack = null
      } else {
        // Start
        autoTestStarting.value = true
        autoTestRunning.value = true
        currentAttackIndex = 0

        // Run first test immediately
        await runSingleAutoTest()

        // Then run every 1.5 seconds
        autoTestInterval.value = setInterval(runSingleAutoTest, 1500)
        autoTestStarting.value = false
      }
    }

    // Generate bulk tests
    const generateBulkTests = async () => {
      bulkGenerating.value = true
      try {
        const res = await fetch('/api/generate-test-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: 100 })
        })

        if (res.ok) {
          const data = await res.json()
          autoTestStats.value.totalTests += data.generated.attackLogs
          autoTestStats.value.blocked += Math.floor(data.generated.attackLogs * 0.7)
          autoTestStats.value.allowed += Math.floor(data.generated.attackLogs * 0.3)
        }
      } catch (e) {
        console.error('Bulk generate error:', e)
      } finally {
        bulkGenerating.value = false
      }
    }

    // Cleanup on unmount
    onUnmounted(() => {
      if (autoTestInterval.value) {
        clearInterval(autoTestInterval.value)
      }
    })

    const getRiskClass = (score) => {
      if (score >= 70) return 'critical'
      if (score >= 50) return 'high'
      if (score >= 30) return 'medium'
      return 'low'
    }

    const getActionSeverity = (action) => {
      const map = { block: 'danger', challenge: 'warn', monitor: 'info', allow: 'success' }
      return map[action] || 'info'
    }

    const getSeverityColor = (severity) => {
      const map = { critical: 'danger', high: 'warn', medium: 'info', low: 'secondary' }
      return map[severity] || 'info'
    }

    return {
      loading, selectedAttack, result, error, testAttack, getRiskClass, getActionSeverity, getSeverityColor,
      autoTestRunning, autoTestStarting, bulkGenerating, autoTestStats, autoTestLog,
      toggleAutoTest, generateBulkTests
    }
  }
}
</script>

<style scoped>
.analyzer-view {
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

.analyzer-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
}

.test-card {
  animation: slideInLeft 0.6s ease-out;
}

.results-card {
  animation: slideInRight 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.test-card h3, .results-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.test-card h3 i {
  color: #06b6d4;
  animation: pulse 2s infinite;
}

.results-card h3 i {
  color: #8b5cf6;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.attack-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attack-buttons :deep(.p-button) {
  justify-content: flex-start;
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.attack-buttons :deep(.p-button:hover) {
  transform: translateX(8px);
  box-shadow: -4px 0 0 var(--accent), 0 4px 15px rgba(0, 0, 0, 0.1);
}

.result-stats {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2rem;
  justify-content: center;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-stat {
  text-align: center;
}

.stat-label {
  display: block;
  margin-top: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.risk-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 700;
  color: white;
  position: relative;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.risk-circle::before {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 3px solid currentColor;
  opacity: 0.3;
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.3); opacity: 0; }
}

.risk-circle.low {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
}

.risk-circle.medium {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  box-shadow: 0 8px 25px rgba(234, 179, 8, 0.4);
}

.risk-circle.high {
  background: linear-gradient(135deg, #f97316, #ea580c);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
}

.risk-circle.critical {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), shake 0.5s ease 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.threats-section, .behavior-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  animation: fadeIn 0.5s ease-out 0.3s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.threats-section h4, .behavior-section h4 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.threat-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.threat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  animation: slideInRight 0.4s ease-out both;
}

.threat-item:nth-child(1) { animation-delay: 0.1s; }
.threat-item:nth-child(2) { animation-delay: 0.2s; }
.threat-item:nth-child(3) { animation-delay: 0.3s; }

.threat-item:hover {
  transform: translateX(5px);
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-message {
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
  border-radius: 12px;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: shake 0.5s ease;
}

.attack-info {
  margin-bottom: 1.5rem;
  animation: fadeIn 0.4s ease-out;
}

.attack-info :deep(.p-tag) {
  animation: scaleIn 0.3s ease-out;
}

.geo-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  animation: fadeIn 0.5s ease-out 0.4s both;
}

.geo-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.geo-section h4 i {
  color: #f97316;
}

.placeholder-card {
  animation: fadeIn 0.5s ease-out;
}

.placeholder-card .placeholder-content {
  text-align: center;
  padding: 4rem 1.5rem;
  color: var(--text-secondary);
}

.placeholder-content i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: var(--border-color);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.placeholder-content h3 {
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .analyzer-grid {
    grid-template-columns: 1fr;
  }

  .result-stats {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
}

/* Auto-Test Styles */
.auto-test-card {
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out;
  border: 2px solid var(--accent);
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
}

.auto-test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.auto-test-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auto-test-title i {
  font-size: 1.5rem;
  color: var(--accent);
}

.auto-test-title i.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auto-test-title h3 {
  margin: 0;
  font-size: 1.25rem;
}

.auto-test-controls {
  display: flex;
  gap: 0.75rem;
}

.auto-test-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.auto-stat {
  text-align: center;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.auto-stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.auto-stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
}

.auto-stat.blocked .auto-stat-value {
  color: #ef4444;
}

.auto-stat.allowed .auto-stat-value {
  color: #22c55e;
}

.auto-stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.auto-test-progress {
  margin-bottom: 1.5rem;
}

.progress-text {
  text-align: center;
  color: var(--text-secondary);
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.auto-test-log h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.auto-test-log h4 i {
  color: var(--accent);
}

.log-entries {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  border-left: 4px solid var(--accent);
  animation: slideInRight 0.3s ease-out;
  font-size: 0.9rem;
}

.log-entry.block {
  border-left-color: #ef4444;
}

.log-entry.allow {
  border-left-color: #22c55e;
}

.log-type {
  font-weight: 600;
  min-width: 100px;
}

.log-ip {
  color: var(--text-secondary);
  font-family: monospace;
  min-width: 120px;
}

.log-risk {
  color: var(--text-secondary);
  margin-left: auto;
}

@media (max-width: 768px) {
  .auto-test-header {
    flex-direction: column;
    align-items: stretch;
  }

  .auto-test-controls {
    flex-direction: column;
  }

  .auto-test-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .log-entry {
    flex-wrap: wrap;
  }
}
</style>
