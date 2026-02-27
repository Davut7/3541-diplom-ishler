<template>
  <div class="logs-view">
    <div class="page-header">
      <h1>{{ t.logs.title }}</h1>
      <p>{{ t.logs.subtitle }}</p>
    </div>
    <Card>
      <template #content>
        <DataTable :value="logs" :paginator="true" :rows="15" stripedRows :loading="loading">
          <Column field="timestamp" :header="t.logs.columns.time" style="width: 15%">
            <template #body="{ data }">{{ new Date(data.timestamp).toLocaleTimeString() }}</template>
          </Column>
          <Column field="type" :header="t.logs.columns.type" style="width: 18%">
            <template #body="{ data }"><Tag :severity="getTypeSeverity(data.type)" :value="data.type" /></template>
          </Column>
          <Column field="sourceIP" :header="t.logs.columns.source" style="width: 15%">
            <template #body="{ data }"><code>{{ data.sourceIP }}</code></template>
          </Column>
          <Column field="targetPath" :header="t.logs.columns.target" style="width: 15%">
            <template #body="{ data }"><code>{{ data.targetPath }}</code></template>
          </Column>
          <Column field="action" :header="t.logs.columns.action" style="width: 12%">
            <template #body="{ data }"><Tag :severity="getActionSeverity(data.action)" :value="data.action" /></template>
          </Column>
          <Column field="riskScore" :header="t.logs.columns.riskScore" style="width: 12%">
            <template #body="{ data }">
              <span :class="'risk-badge ' + getRiskClass(data.riskScore)">{{ data.riskScore }}%</span>
            </template>
          </Column>
          <Column field="country" header="Country" style="width: 13%">
            <template #body="{ data }"><Badge :value="data.country" /></template>
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
    const logs = ref([])
    const loading = ref(true)
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs')
        const data = await res.json()
        if (data.success) logs.value = data.logs
      } catch (e) { console.error(e) } finally { loading.value = false }
    }
    const getTypeSeverity = (type) => {
      const map = { 'SQL Injection': 'danger', 'XSS': 'danger', 'Path Traversal': 'warn', 'Brute Force': 'warn', 'Bot Traffic': 'info', 'Rate Limit': 'secondary' }
      return map[type] || 'info'
    }
    const getActionSeverity = (action) => ({ blocked: 'danger', allowed: 'success', challenged: 'warn', monitored: 'info' }[action] || 'info')
    const getRiskClass = (score) => score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low'
    onMounted(fetchLogs)
    return { logs, loading, getTypeSeverity, getActionSeverity, getRiskClass }
  }
}
</script>

<style scoped>
.logs-view { max-width: 1400px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.risk-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; }
.risk-badge.low { background: #dcfce7; color: #166534; }
.risk-badge.medium { background: #fef3c7; color: #92400e; }
.risk-badge.high { background: #fed7aa; color: #c2410c; }
.risk-badge.critical { background: #fee2e2; color: #991b1b; }
</style>
