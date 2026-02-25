<template>
  <div class="analyze-view">
    <div class="page-header">
      <h1>{{ t.analyze.title }}</h1>
      <p>{{ t.analyze.subtitle }}</p>
    </div>

    <!-- Input Section -->
    <Card class="input-card">
      <template #content>
        <div class="input-wrapper">
          <span class="p-input-icon-left input-field">
            <i class="pi pi-search"></i>
            <InputText
              v-model="target"
              :placeholder="t.analyze.placeholder"
              @keyup.enter="startScan"
              :disabled="isScanning"
            />
          </span>
          <Button
            @click="startScan"
            :icon="isScanning ? 'pi pi-spin pi-spinner' : 'pi pi-search'"
            :label="isScanning ? t.analyze.scanning : t.analyze.startScan"
            :disabled="!target.trim() || isScanning"
          />
          <Button
            @click="runDemo"
            icon="pi pi-play"
            :label="t.analyze.demo"
            class="p-button-outlined"
            :disabled="isScanning"
          />
        </div>
      </template>
    </Card>

    <!-- Progress -->
    <Card v-if="isScanning" class="progress-card">
      <template #content>
        <div class="scan-progress">
          <div class="progress-header">
            <i class="pi pi-spin pi-spinner"></i>
            <span>{{ currentStep }}</span>
          </div>
          <ProgressBar :value="progress" :showValue="true" />
          <div class="log-output">
            <div v-for="(log, i) in logs" :key="i" :class="['log-line', log.type]">
              <i :class="getLogIcon(log.type)"></i>
              {{ log.message }}
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Results -->
    <div v-if="result" class="results-section">
      <!-- Overview Card -->
      <Card class="overview-card">
        <template #content>
          <div class="overview-grid">
            <div class="overview-main">
              <div class="target-info">
                <h2>{{ result.target }}</h2>
                <p class="ip-address">{{ result.ip }}</p>
              </div>
              <div class="quick-info">
                <div class="info-item">
                  <i class="pi pi-map-marker"></i>
                  <span>{{ result.geo?.city }}, {{ result.geo?.country }}</span>
                </div>
                <div class="info-item">
                  <i class="pi pi-wifi"></i>
                  <span>{{ result.geo?.isp }}</span>
                </div>
              </div>
            </div>
            <div class="risk-score" :class="getRiskClass(result.riskScore)">
              <div class="score-circle">
                <span class="score-value">{{ result.riskScore }}</span>
                <span class="score-label">%</span>
              </div>
              <div class="risk-level">{{ getRiskLevel(result.riskScore) }}</div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Tabs -->
      <TabView class="results-tabs">
        <TabPanel :header="t.analyze.tabs.overview">
          <div class="info-grid">
            <div class="info-card">
              <label>{{ t.analyze.results.target }}</label>
              <span>{{ result.target }}</span>
            </div>
            <div class="info-card">
              <label>{{ t.analyze.results.ip }}</label>
              <span>{{ result.ip }}</span>
            </div>
            <div class="info-card">
              <label>{{ t.analyze.results.location }}</label>
              <span>{{ result.geo?.city }}, {{ result.geo?.country }}</span>
            </div>
            <div class="info-card">
              <label>{{ t.analyze.results.isp }}</label>
              <span>{{ result.geo?.isp || 'N/A' }}</span>
            </div>
            <div class="info-card">
              <label>{{ t.analyze.results.ping }}</label>
              <span>{{ result.ping?.latency || 'N/A' }} ms</span>
            </div>
            <div class="info-card">
              <label>{{ t.analyze.results.ttl }}</label>
              <span>{{ result.ping?.ttl || 'N/A' }}</span>
            </div>
          </div>
        </TabPanel>

        <TabPanel :header="t.analyze.tabs.ports">
          <div v-if="result.openPorts?.length" class="ports-grid">
            <div v-for="port in result.openPorts" :key="port.port" class="port-item">
              <Tag :severity="getPortSeverity(port.port)" :value="port.port + '/' + port.service" />
            </div>
          </div>
          <div v-else class="empty-state">
            <i class="pi pi-check-circle"></i>
            <p>{{ language === 'en' ? 'No open ports detected' : 'Açyk port tapylmady' }}</p>
          </div>
        </TabPanel>

        <TabPanel :header="t.analyze.tabs.whois">
          <div class="info-grid">
            <div class="info-card">
              <label>{{ t.analyze.results.registrar }}</label>
              <span>{{ result.whois?.registrar || 'N/A' }}</span>
            </div>
            <div class="info-card">
              <label>{{ t.analyze.results.created }}</label>
              <span>{{ result.whois?.created || 'N/A' }}</span>
            </div>
            <div class="info-card">
              <label>{{ t.analyze.results.expires }}</label>
              <span>{{ result.whois?.expires || 'N/A' }}</span>
            </div>
          </div>
        </TabPanel>

        <TabPanel :header="t.analyze.tabs.security">
          <div class="security-section">
            <div v-if="result.issues?.length" class="security-group">
              <h4><i class="pi pi-exclamation-circle"></i> {{ t.analyze.security.issues }}</h4>
              <div v-for="(issue, i) in result.issues" :key="i" class="security-item danger">
                {{ issue }}
              </div>
            </div>
            <div v-if="result.warnings?.length" class="security-group">
              <h4><i class="pi pi-exclamation-triangle"></i> {{ t.analyze.security.warnings }}</h4>
              <div v-for="(warning, i) in result.warnings" :key="i" class="security-item warning">
                {{ warning }}
              </div>
            </div>
            <div v-if="result.recommendations?.length" class="security-group">
              <h4><i class="pi pi-info-circle"></i> {{ t.analyze.security.recommendations }}</h4>
              <div v-for="(rec, i) in result.recommendations" :key="i" class="security-item info">
                {{ rec }}
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <!-- Export Actions -->
      <div class="export-actions">
        <Button @click="exportJson" icon="pi pi-download" :label="t.common.exportJson" class="p-button-outlined" />
        <Button @click="exportHtml" icon="pi pi-file" :label="t.common.exportHtml" class="p-button-outlined" />
        <Button @click="printReport" icon="pi pi-print" :label="t.common.print" class="p-button-outlined" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { saveAnalysis } from '../utils/storage'
import { exportToJson, exportToHtml, printReport as printReportUtil } from '../utils/exportReport'

export default {
  name: 'AnalyzeView',
  props: {
    t: Object,
    language: String
  },
  setup(props) {
    const target = ref('')
    const isScanning = ref(false)
    const progress = ref(0)
    const currentStep = ref('')
    const logs = ref([])
    const result = ref(null)

    const addLog = (message, type = 'info') => {
      logs.value.push({ message, type, time: new Date() })
    }

    const getLogIcon = (type) => {
      const icons = {
        info: 'pi pi-info-circle',
        success: 'pi pi-check-circle',
        warning: 'pi pi-exclamation-triangle',
        error: 'pi pi-times-circle'
      }
      return icons[type] || icons.info
    }

    const startScan = async () => {
      if (!target.value.trim() || isScanning.value) return

      isScanning.value = true
      progress.value = 0
      logs.value = []
      result.value = null

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: target.value.trim(), language: props.language })
        })

        const data = await response.json()

        if (data.success) {
          // Animate logs
          for (let i = 0; i < data.logs.length; i++) {
            await new Promise(r => setTimeout(r, 150))
            addLog(data.logs[i].message, data.logs[i].type)
            progress.value = Math.round(((i + 1) / data.logs.length) * 100)
            currentStep.value = data.logs[i].message
          }

          result.value = data
          saveAnalysis(data)
        } else {
          addLog(data.error || 'Scan failed', 'error')
        }
      } catch (error) {
        addLog(`Connection error: ${error.message}`, 'error')
      }

      isScanning.value = false
    }

    const runDemo = async () => {
      target.value = 'example.com'
      await startScan()
    }

    const getRiskClass = (score) => {
      if (score >= 70) return 'critical'
      if (score >= 50) return 'high'
      if (score >= 30) return 'medium'
      return 'low'
    }

    const getRiskLevel = (score) => {
      if (score >= 70) return props.t.analyze.risks.critical
      if (score >= 50) return props.t.analyze.risks.high
      if (score >= 30) return props.t.analyze.risks.medium
      return props.t.analyze.risks.low
    }

    const getPortSeverity = (port) => {
      const critical = [21, 22, 23, 3389, 445, 3306, 5432]
      const warning = [80, 443, 8080, 8443]
      if (critical.includes(port)) return 'danger'
      if (warning.includes(port)) return 'warn'
      return 'info'
    }

    const exportJson = () => {
      if (result.value) exportToJson(result.value)
    }

    const exportHtml = () => {
      if (result.value) exportToHtml(result.value, props.t)
    }

    const printReport = () => {
      if (result.value) printReportUtil(result.value, props.t)
    }

    return {
      target,
      isScanning,
      progress,
      currentStep,
      logs,
      result,
      startScan,
      runDemo,
      getLogIcon,
      getRiskClass,
      getRiskLevel,
      getPortSeverity,
      exportJson,
      exportHtml,
      printReport
    }
  }
}
</script>

<style scoped>
.analyze-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.page-header p {
  color: var(--text-secondary);
}

.input-card {
  margin-bottom: 1.5rem;
}

.input-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-field {
  flex: 1;
}

.input-field input {
  width: 100%;
}

.progress-card {
  margin-bottom: 1.5rem;
}

.scan-progress {
  padding: 1rem 0;
}

.progress-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.log-output {
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  font-family: monospace;
  font-size: 0.85rem;
}

.log-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.log-line.success { color: var(--success-color); }
.log-line.warning { color: var(--warning-color); }
.log-line.error { color: var(--danger-color); }
.log-line.info { color: var(--text-secondary); }

.overview-card {
  margin-bottom: 1.5rem;
}

.overview-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-main h2 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.ip-address {
  color: var(--text-secondary);
  font-family: monospace;
  margin-bottom: 1rem;
}

.quick-info {
  display: flex;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.info-item i {
  color: var(--primary-color);
}

.risk-score {
  text-align: center;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid currentColor;
  margin-bottom: 0.5rem;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
}

.score-label {
  font-size: 1rem;
}

.risk-level {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.risk-score.critical { color: #dc2626; }
.risk-score.high { color: #ea580c; }
.risk-score.medium { color: #ca8a04; }
.risk-score.low { color: #16a34a; }

.results-tabs {
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.info-card {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
}

.info-card label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.info-card span {
  font-weight: 500;
  color: var(--text-primary);
}

.ports-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  color: var(--success-color);
  margin-bottom: 1rem;
}

.security-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-group h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.security-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.security-item.danger {
  background: rgba(220, 38, 38, 0.1);
  border-left: 3px solid #dc2626;
}

.security-item.warning {
  background: rgba(234, 88, 12, 0.1);
  border-left: 3px solid #ea580c;
}

.security-item.info {
  background: rgba(0, 212, 170, 0.1);
  border-left: 3px solid var(--primary-color);
}

.export-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .input-wrapper {
    flex-direction: column;
  }

  .overview-grid {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .quick-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
