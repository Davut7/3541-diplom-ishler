<template>
  <div class="analyzer-view">
    <div class="page-header">
      <h1>{{ t.analyzer.title }}</h1>
      <p>{{ t.analyzer.subtitle }}</p>
    </div>

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
            />
          </div>
        </template>
      </Card>

      <Card class="results-card" v-if="result">
        <template #content>
          <h3><i class="pi pi-chart-bar"></i> {{ t.analyzer.results.title }}</h3>

          <div class="result-stats">
            <div class="result-stat">
              <div class="risk-circle" :class="getRiskClass(result.analysis.combinedRiskScore)">
                <span>{{ result.analysis.combinedRiskScore }}%</span>
              </div>
              <span class="stat-label">{{ t.analyzer.results.riskScore }}</span>
            </div>
            <div class="result-stat">
              <Tag :severity="getActionSeverity(result.analysis.finalAction)" :value="result.analysis.finalAction" style="font-size: 1.2rem; padding: 0.75rem 1.5rem" />
              <span class="stat-label">{{ t.analyzer.results.action }}</span>
            </div>
          </div>

          <div class="threats-section" v-if="result.analysis.request.threats.length">
            <h4>{{ t.analyzer.results.threats }}</h4>
            <div class="threat-list">
              <div v-for="(threat, i) in result.analysis.request.threats" :key="i" class="threat-item">
                <Tag :severity="getSeverityColor(threat.severity)" :value="threat.type" />
                <span>{{ threat.details }}</span>
              </div>
            </div>
          </div>

          <div class="behavior-section">
            <h4>{{ t.analyzer.results.behavior }}: {{ result.analysis.behavior.behaviorScore }}%</h4>
            <div v-if="result.analysis.behavior.anomalies.length">
              <Tag v-for="(anomaly, i) in result.analysis.behavior.anomalies" :key="i" :severity="getSeverityColor(anomaly.severity)" :value="anomaly.type" style="margin-right: 0.5rem; margin-bottom: 0.5rem" />
            </div>
            <p v-else style="color: #22c55e"><i class="pi pi-check-circle"></i> No behavioral anomalies detected</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const loading = ref(false)
    const selectedAttack = ref(null)
    const result = ref(null)

    const testAttack = async (attackType) => {
      loading.value = true
      selectedAttack.value = attackType
      try {
        const res = await fetch('/api/test-attack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attackType })
        })
        const data = await res.json()

        // Also get behavioral analysis
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data.testPayload, sessionId: 'test-session' })
        })
        result.value = await analyzeRes.json()
      } catch (e) {
        console.error('Test failed:', e)
      } finally {
        loading.value = false
      }
    }

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

    return { loading, selectedAttack, result, testAttack, getRiskClass, getActionSeverity, getSeverityColor }
  }
}
</script>

<style scoped>
.analyzer-view { max-width: 1200px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.analyzer-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem; }

.test-card h3, .results-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.test-card h3 i { color: #f97316; }
.results-card h3 i { color: #8b5cf6; }

.attack-buttons { display: flex; flex-direction: column; gap: 0.75rem; }

.result-stats { display: flex; gap: 2rem; margin-bottom: 2rem; }
.result-stat { text-align: center; }
.stat-label { display: block; margin-top: 0.5rem; color: var(--text-secondary); }

.risk-circle {
  width: 100px; height: 100px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 700; color: white;
}
.risk-circle.low { background: linear-gradient(135deg, #22c55e, #16a34a); }
.risk-circle.medium { background: linear-gradient(135deg, #eab308, #ca8a04); }
.risk-circle.high { background: linear-gradient(135deg, #f97316, #ea580c); }
.risk-circle.critical { background: linear-gradient(135deg, #ef4444, #dc2626); }

.threats-section, .behavior-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
.threats-section h4, .behavior-section h4 { margin-bottom: 1rem; }

.threat-list { display: flex; flex-direction: column; gap: 0.5rem; }
.threat-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--bg-primary); border-radius: 8px; }

@media (max-width: 768px) { .analyzer-grid { grid-template-columns: 1fr; } }
</style>
