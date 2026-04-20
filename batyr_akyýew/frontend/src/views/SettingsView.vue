<template>
  <div class="settings-view">
    <div class="page-header">
      <h1><i class="pi pi-cog"></i> {{ t.settings?.title || 'Settings' }}</h1>
      <p>{{ t.settings?.subtitle || 'Configure WAF system settings' }}</p>
    </div>

    <div class="settings-grid">
      <!-- Export Reports -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-file-pdf"></i>
            <span>{{ t.settings?.exportReports || 'Export Reports' }}</span>
          </div>
        </template>
        <template #content>
          <p class="info-text">Generate comprehensive security reports in PDF format.</p>
          <div class="export-buttons">
            <Button label="Download PDF Report" icon="pi pi-download" @click="downloadPDF" severity="success" />
          </div>
          <div class="report-info">
            <h4>Report includes:</h4>
            <ul>
              <li><i class="pi pi-check"></i> Security overview statistics</li>
              <li><i class="pi pi-check"></i> Attack types distribution</li>
              <li><i class="pi pi-check"></i> Top blocked IP addresses</li>
              <li><i class="pi pi-check"></i> WAF rules status</li>
              <li><i class="pi pi-check"></i> Recent attack logs</li>
            </ul>
          </div>
        </template>
      </Card>

      <!-- System Info -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-server"></i>
            <span>{{ t.settings?.systemInfo || 'System Information' }}</span>
          </div>
        </template>
        <template #content>
          <div class="system-info">
            <div class="info-row">
              <span class="label">Server Status:</span>
              <Tag :value="serverHealth.status === 'healthy' ? 'Online' : 'Offline'"
                   :severity="serverHealth.status === 'healthy' ? 'success' : 'danger'" />
            </div>
            <div class="info-row">
              <span class="label">Version:</span>
              <span class="value">{{ serverHealth.version || '2.0.0' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Database:</span>
              <span class="value">{{ serverHealth.database || 'SQLite' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Uptime:</span>
              <span class="value">{{ formatUptime(serverHealth.uptime) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Total Logs:</span>
              <span class="value">{{ serverHealth.totalLogs || 0 }}</span>
            </div>
            <div class="info-row">
              <span class="label">Active Sessions:</span>
              <span class="value">{{ serverHealth.activeSessions || 0 }}</span>
            </div>
          </div>
          <Button label="Refresh Status" icon="pi pi-refresh" @click="fetchHealth" outlined class="mt-3" />
        </template>
      </Card>

      <!-- WAF Test Runner -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-play"></i>
            <span>WAF Test Runner</span>
          </div>
        </template>
        <template #content>
          <p class="info-text">Re-run WAF tests to refresh all dashboard data with real detection results.</p>
          <Button label="Run WAF Tests" icon="pi pi-refresh" @click="runWAFTests" :loading="runningTests" severity="info" />
          <p v-if="testResult" class="test-result">{{ testResult }}</p>
        </template>
      </Card>

      <!-- Data Management -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-database"></i>
            <span>{{ t.settings?.dangerZone || 'Data Management' }}</span>
          </div>
        </template>
        <template #content>
          <p class="info-text">Clear all attack logs and start fresh.</p>
          <Button label="Clear All Logs" icon="pi pi-trash" severity="danger" outlined @click="clearLogs" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'SettingsView',
  props: ['t', 'language'],
  setup() {
    const serverHealth = ref({})
    const runningTests = ref(false)
    const testResult = ref('')

    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health')
        const data = await res.json()
        serverHealth.value = data
      } catch (error) {
        console.error('Failed to fetch health:', error)
        serverHealth.value = { status: 'offline' }
      }
    }

    const downloadPDF = () => {
      window.open('/api/reports/pdf', '_blank')
    }

    const runWAFTests = async () => {
      runningTests.value = true
      testResult.value = ''
      try {
        const res = await fetch('/api/run-waf-tests', { method: 'POST' })
        const data = await res.json()
        testResult.value = data.message
        fetchHealth()
      } catch (error) {
        testResult.value = 'Failed to run tests.'
      }
      runningTests.value = false
    }

    const clearLogs = async () => {
      if (confirm('Are you sure you want to clear all attack logs? This action cannot be undone.')) {
        try {
          const res = await fetch('/api/logs', { method: 'DELETE' })
          if (res.ok) {
            alert('All logs have been cleared.')
            fetchHealth()
          } else {
            throw new Error('Failed')
          }
        } catch (error) {
          alert('Failed to clear logs.')
        }
      }
    }

    const formatUptime = (seconds) => {
      if (!seconds) return 'N/A'
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      if (days > 0) return `${days}d ${hours}h ${minutes}m`
      return `${hours}h ${minutes}m`
    }

    onMounted(() => {
      fetchHealth()
    })

    return {
      serverHealth,
      runningTests,
      testResult,
      fetchHealth,
      downloadPDF,
      runWAFTests,
      clearLogs,
      formatUptime
    }
  }
}
</script>

<style scoped>
.settings-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header h1 i {
  color: var(--accent);
  transition: transform 0.3s ease;
}

.page-header:hover h1 i {
  transform: rotate(90deg);
}

.page-header p {
  color: var(--text-secondary);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.settings-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s ease;
}

.settings-card:nth-child(1) { animation-delay: 0.1s; }
.settings-card:nth-child(2) { animation-delay: 0.2s; }
.settings-card:nth-child(3) { animation-delay: 0.3s; }
.settings-card:nth-child(4) { animation-delay: 0.4s; }

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

.settings-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.card-title i {
  color: var(--accent);
  transition: transform 0.3s ease;
}

.settings-card:hover .card-title i {
  transform: scale(1.2) rotate(10deg);
}

.card-title.danger i {
  color: #ef4444;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group :deep(input) {
  width: 100%;
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-text {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.export-buttons {
  margin-bottom: 1.5rem;
}

.report-info h4 {
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.report-info ul {
  list-style: none;
}

.report-info li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.report-info li i {
  color: #22c55e;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: var(--text-secondary);
}

.info-row .value {
  font-weight: 500;
}

.test-result {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.mt-3 {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .danger-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .card-title {
    font-size: 1rem;
  }
}
</style>
