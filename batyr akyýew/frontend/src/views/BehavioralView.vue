<template>
  <div class="behavioral-view">
    <div class="page-header">
      <h1>{{ t.behavioral.title }}</h1>
      <p>{{ t.behavioral.subtitle }}</p>
    </div>

    <div class="summary-row">
      <Card class="summary-card">
        <template #content>
          <div class="summary-icon sessions"><i class="pi pi-users"></i></div>
          <span class="summary-value">{{ summary.totalSessions }}</span>
          <span class="summary-label">{{ t.behavioral.sessions }}</span>
        </template>
      </Card>
      <Card class="summary-card">
        <template #content>
          <div class="summary-icon anomalies"><i class="pi pi-exclamation-triangle"></i></div>
          <span class="summary-value">{{ summary.anomalous }}</span>
          <span class="summary-label">{{ t.behavioral.anomalies }}</span>
        </template>
      </Card>
      <Card class="summary-card">
        <template #content>
          <div class="summary-icon bots"><i class="pi pi-android"></i></div>
          <span class="summary-value">{{ summary.bots }}</span>
          <span class="summary-label">{{ t.behavioral.bots }}</span>
        </template>
      </Card>
      <Card class="summary-card">
        <template #content>
          <div class="summary-icon risk"><i class="pi pi-chart-line"></i></div>
          <span class="summary-value">{{ summary.avgRiskScore }}%</span>
          <span class="summary-label">Avg Risk Score</span>
        </template>
      </Card>
    </div>

    <Card>
      <template #content>
        <DataTable :value="sessions" :paginator="true" :rows="10" stripedRows>
          <Column field="sessionId" :header="t.behavioral.columns.session" style="width: 25%">
            <template #body="{ data }">
              <code>{{ data.sessionId.substring(0, 8) }}...</code>
            </template>
          </Column>
          <Column field="requestCount" :header="t.behavioral.columns.requests" style="width: 12%"></Column>
          <Column field="riskScore" :header="t.behavioral.columns.riskScore" style="width: 15%">
            <template #body="{ data }">
              <ProgressBar :value="data.riskScore" :showValue="true" style="height: 20px" :class="getRiskClass(data.riskScore)" />
            </template>
          </Column>
          <Column field="isBot" :header="t.behavioral.columns.isBot" style="width: 10%">
            <template #body="{ data }">
              <Tag :severity="data.isBot ? 'danger' : 'success'" :value="data.isBot ? 'Yes' : 'No'" />
            </template>
          </Column>
          <Column field="behavioral.scrollPattern" header="Scroll" style="width: 12%">
            <template #body="{ data }">
              <Tag :severity="data.behavioral.scrollPattern === 'natural' ? 'success' : 'warn'" :value="data.behavioral.scrollPattern" />
            </template>
          </Column>
          <Column field="lastSeen" :header="t.behavioral.columns.lastSeen" style="width: 26%">
            <template #body="{ data }">
              {{ new Date(data.lastSeen).toLocaleString() }}
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
    const sessions = ref([])
    const summary = ref({ totalSessions: 0, anomalous: 0, bots: 0, avgRiskScore: 0 })

    const fetchBehavioral = async () => {
      try {
        const res = await fetch('/api/behavioral')
        const data = await res.json()
        if (data.success) {
          sessions.value = data.sessions
          summary.value = data.summary
        }
      } catch (e) { console.error('Failed to fetch:', e) }
    }

    const getRiskClass = (score) => score >= 50 ? 'high-risk' : score >= 30 ? 'medium-risk' : 'low-risk'

    onMounted(fetchBehavioral)
    return { sessions, summary, getRiskClass }
  }
}
</script>

<style scoped>
.behavioral-view { max-width: 1400px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.summary-card { text-align: center; }
.summary-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; }
.summary-icon i { font-size: 1.25rem; color: white; }
.summary-icon.sessions { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.summary-icon.anomalies { background: linear-gradient(135deg, #f97316, #ea580c); }
.summary-icon.bots { background: linear-gradient(135deg, #ef4444, #dc2626); }
.summary-icon.risk { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.summary-value { display: block; font-size: 1.75rem; font-weight: 700; }
.summary-label { color: var(--text-secondary); font-size: 0.9rem; }
:deep(.high-risk .p-progressbar-value) { background: #ef4444; }
:deep(.medium-risk .p-progressbar-value) { background: #f97316; }
:deep(.low-risk .p-progressbar-value) { background: #22c55e; }
@media (max-width: 768px) { .summary-row { grid-template-columns: repeat(2, 1fr); } }
</style>
