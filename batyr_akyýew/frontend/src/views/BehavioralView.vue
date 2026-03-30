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
        <DataTable :value="sessions" :paginator="true" :rows="10" stripedRows :loading="loading"
                   emptyMessage="No sessions found">
          <Column field="session_id" :header="t.behavioral.columns.session" style="width: 20%">
            <template #body="{ data }">
              <code>{{ data.session_id?.substring(0, 12) }}...</code>
            </template>
          </Column>
          <Column field="request_count" :header="t.behavioral.columns.requests" style="width: 12%">
            <template #body="{ data }">
              <strong>{{ data.request_count || 0 }}</strong>
            </template>
          </Column>
          <Column field="risk_score" :header="t.behavioral.columns.riskScore" style="width: 18%">
            <template #body="{ data }">
              <ProgressBar :value="data.risk_score || 0" :showValue="true" style="height: 20px" :class="getRiskClass(data.risk_score)" />
            </template>
          </Column>
          <Column field="is_bot" :header="t.behavioral.columns.isBot" style="width: 10%">
            <template #body="{ data }">
              <Tag :severity="data.is_bot ? 'danger' : 'success'" :value="data.is_bot ? 'Bot' : 'Human'" />
            </template>
          </Column>
          <Column field="ip_address" header="IP Address" style="width: 15%">
            <template #body="{ data }">
              <code>{{ data.ip_address || '-' }}</code>
            </template>
          </Column>
          <Column field="last_seen" :header="t.behavioral.columns.lastSeen" style="width: 25%">
            <template #body="{ data }">
              {{ formatDate(data.last_seen) }}
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
    const loading = ref(true)

    const fetchBehavioral = async () => {
      try {
        const res = await fetch('/api/behavioral')
        const data = await res.json()
        if (data.success) {
          sessions.value = data.sessions
          summary.value = data.summary
        }
      } catch (e) {
        console.error('Failed to fetch behavioral data:', e)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getRiskClass = (score) => {
      if (score >= 50) return 'high-risk'
      if (score >= 30) return 'medium-risk'
      return 'low-risk'
    }

    onMounted(fetchBehavioral)

    return { sessions, summary, loading, formatDate, getRiskClass }
  }
}
</script>

<style scoped>
.behavioral-view {
  max-width: 1400px;
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
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  text-align: center;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.summary-card:nth-child(1) { animation-delay: 0.1s; }
.summary-card:nth-child(2) { animation-delay: 0.2s; }
.summary-card:nth-child(3) { animation-delay: 0.3s; }
.summary-card:nth-child(4) { animation-delay: 0.4s; }

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

.summary-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.summary-icon {
  width: 55px;
  height: 55px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  transition: all 0.3s ease;
}

.summary-card:hover .summary-icon {
  transform: scale(1.1) rotate(5deg);
}

.summary-icon i {
  font-size: 1.35rem;
  color: white;
}

.summary-icon.sessions {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.summary-icon.anomalies {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
}

.summary-icon.bots {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.summary-icon.risk {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.summary-value {
  display: block;
  font-size: 1.85rem;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.summary-card:hover .summary-value {
  transform: scale(1.1);
}

.summary-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

:deep(.p-card) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
  border-radius: 16px;
}

:deep(.p-datatable-tbody > tr) {
  transition: all 0.3s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  transform: scale(1.005);
}

:deep(.p-progressbar) {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.p-progressbar-value) {
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.high-risk .p-progressbar-value) {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

:deep(.medium-risk .p-progressbar-value) {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
}

:deep(.low-risk .p-progressbar-value) {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

:deep(.p-tag) {
  transition: all 0.3s ease;
}

:deep(.p-tag:hover) {
  transform: scale(1.05);
}

code {
  font-family: 'Monaco', 'Consolas', monospace;
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

code:hover {
  background: var(--accent-light);
  color: var(--accent);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .summary-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .summary-icon {
    width: 45px;
    height: 45px;
  }

  .summary-icon i {
    font-size: 1.1rem;
  }

  .summary-value {
    font-size: 1.4rem;
  }

  .summary-label {
    font-size: 0.8rem;
  }

  :deep(.p-datatable-table-container) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }

  .summary-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .summary-value {
    font-size: 1.2rem;
  }

  .summary-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
}
</style>
