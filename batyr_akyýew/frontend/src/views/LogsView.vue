<template>
  <div class="logs-view">
    <div class="page-header">
      <div class="header-content">
        <h1>{{ t.logs.title }}</h1>
        <p>{{ t.logs.subtitle }}</p>
      </div>
      <div class="header-controls">
        <div class="live-indicator" :class="{ active: autoRefresh }">
          <span class="pulse-dot"></span>
          <span>{{ autoRefresh ? 'LIVE' : 'PAUSED' }}</span>
        </div>
        <Button :icon="autoRefresh ? 'pi pi-pause' : 'pi pi-play'"
                :label="autoRefresh ? 'Pause' : 'Resume'"
                :severity="autoRefresh ? 'secondary' : 'success'"
                @click="toggleAutoRefresh"
                outlined />
        <Button icon="pi pi-refresh" label="Refresh" @click="fetchLogs" :loading="loading" outlined />
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <i class="pi pi-list"></i>
        <span class="stat-value">{{ totalLogs }}</span>
        <span class="stat-label">Total Logs</span>
      </div>
      <div class="stat-item blocked">
        <i class="pi pi-ban"></i>
        <span class="stat-value">{{ blockedCount }}</span>
        <span class="stat-label">Blocked</span>
      </div>
      <div class="stat-item allowed">
        <i class="pi pi-check"></i>
        <span class="stat-value">{{ allowedCount }}</span>
        <span class="stat-label">Allowed</span>
      </div>
      <div class="stat-item">
        <i class="pi pi-clock"></i>
        <span class="stat-value">{{ lastUpdate }}</span>
        <span class="stat-label">Last Update</span>
      </div>
    </div>

    <Card>
      <template #content>
        <DataTable :value="logs" :paginator="true" :rows="15" stripedRows :loading="loading"
                   emptyMessage="No attack logs found" :rowClass="getRowClass">
          <Column field="timestamp" :header="t.logs.columns.time" style="width: 15%">
            <template #body="{ data }">
              <span class="timestamp">{{ formatTime(data.timestamp) }}</span>
            </template>
          </Column>
          <Column field="attack_type" :header="t.logs.columns.type" style="width: 18%">
            <template #body="{ data }"><Tag :severity="getTypeSeverity(data.attack_type)" :value="data.attack_type" /></template>
          </Column>
          <Column field="source_ip" :header="t.logs.columns.source" style="width: 15%">
            <template #body="{ data }"><code>{{ data.source_ip }}</code></template>
          </Column>
          <Column field="target_path" :header="t.logs.columns.target" style="width: 15%">
            <template #body="{ data }"><code>{{ data.target_path }}</code></template>
          </Column>
          <Column field="action" :header="t.logs.columns.action" style="width: 12%">
            <template #body="{ data }"><Tag :severity="getActionSeverity(data.action)" :value="data.action" /></template>
          </Column>
          <Column field="risk_score" :header="t.logs.columns.riskScore" style="width: 12%">
            <template #body="{ data }">
              <span :class="'risk-badge ' + getRiskClass(data.risk_score)">{{ data.risk_score }}%</span>
            </template>
          </Column>
          <Column field="country" header="Country" style="width: 13%">
            <template #body="{ data }"><Badge :value="data.country || 'Unknown'" /></template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const logs = ref([])
    const loading = ref(true)
    const autoRefresh = ref(true)
    const lastUpdate = ref('--:--:--')
    const newLogIds = ref(new Set())
    let refreshInterval = null

    const totalLogs = computed(() => logs.value.length)
    const blockedCount = computed(() => logs.value.filter(l => l.action === 'blocked').length)
    const allowedCount = computed(() => logs.value.filter(l => l.action === 'allowed').length)

    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs?limit=100')
        const data = await res.json()
        if (data.success) {
          // Detect new logs
          const oldIds = new Set(logs.value.map(l => l.id))
          const newLogs = data.logs.filter(l => !oldIds.has(l.id))

          if (newLogs.length > 0) {
            newLogIds.value = new Set(newLogs.map(l => l.id))
            // Clear highlight after 3 seconds
            setTimeout(() => {
              newLogIds.value.clear()
            }, 3000)
          }

          logs.value = data.logs
          lastUpdate.value = new Date().toLocaleTimeString('en-GB')
        }
      } catch (e) {
        console.error('Failed to fetch logs:', e)
      } finally {
        loading.value = false
      }
    }

    const toggleAutoRefresh = () => {
      autoRefresh.value = !autoRefresh.value
      if (autoRefresh.value) {
        startAutoRefresh()
      } else {
        stopAutoRefresh()
      }
    }

    const startAutoRefresh = () => {
      if (refreshInterval) clearInterval(refreshInterval)
      refreshInterval = setInterval(fetchLogs, 3000) // Refresh every 3 seconds
    }

    const stopAutoRefresh = () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        refreshInterval = null
      }
    }

    const getRowClass = (data) => {
      return newLogIds.value.has(data.id) ? 'new-log-row' : ''
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const getTypeSeverity = (type) => {
      const map = {
        'SQL Injection': 'danger',
        'XSS': 'danger',
        'XSS Attack': 'danger',
        'Command Injection': 'danger',
        'Path Traversal': 'warn',
        'Brute Force': 'warn',
        'Bot Detection': 'info',
        'Rate Limit': 'secondary',
        'Blocked IP': 'danger',
        'Blocked IP (Proxy)': 'danger'
      }
      return map[type] || 'info'
    }

    const getActionSeverity = (action) => ({
      blocked: 'danger',
      allowed: 'success',
      challenged: 'warn',
      monitored: 'info'
    }[action] || 'info')

    const getRiskClass = (score) => {
      if (score >= 70) return 'critical'
      if (score >= 50) return 'high'
      if (score >= 30) return 'medium'
      return 'low'
    }

    onMounted(() => {
      fetchLogs()
      startAutoRefresh()
    })

    onUnmounted(() => {
      stopAutoRefresh()
    })

    return {
      logs,
      loading,
      autoRefresh,
      lastUpdate,
      totalLogs,
      blockedCount,
      allowedCount,
      fetchLogs,
      toggleAutoRefresh,
      getRowClass,
      formatTime,
      getTypeSeverity,
      getActionSeverity,
      getRiskClass
    }
  }
}
</script>

<style scoped>
.logs-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
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

.header-content h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: var(--text-secondary);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: #fee2e2;
  color: #991b1b;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.live-indicator.active {
  background: #dcfce7;
  color: #166534;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
}

.live-indicator.active .pulse-dot {
  animation: pulseDot 1.5s infinite;
}

@keyframes pulseDot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

.stats-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s ease;
}

.stat-item:nth-child(1) { animation-delay: 0.1s; }
.stat-item:nth-child(2) { animation-delay: 0.15s; }
.stat-item:nth-child(3) { animation-delay: 0.2s; }
.stat-item:nth-child(4) { animation-delay: 0.25s; }

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

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-item i {
  font-size: 1.5rem;
  color: var(--accent);
}

.stat-item.blocked i {
  color: #ef4444;
}

.stat-item.allowed i {
  color: #22c55e;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

:deep(.p-card) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

:deep(.p-datatable-tbody > tr) {
  animation: slideIn 0.3s ease-out both;
  transition: all 0.3s ease;
}

:deep(.p-datatable-tbody > tr.new-log-row) {
  animation: highlightNew 0.5s ease-out;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.2), transparent) !important;
}

@keyframes highlightNew {
  0% {
    background: rgba(34, 197, 94, 0.4);
    transform: scale(1.01);
  }
  100% {
    background: rgba(34, 197, 94, 0.2);
    transform: scale(1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timestamp {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.risk-badge {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
  transition: all 0.3s ease;
}

.risk-badge:hover {
  transform: scale(1.1);
}

.risk-badge.low {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #166534;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.risk-badge.medium {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.2);
}

.risk-badge.high {
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  color: #c2410c;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
}

.risk-badge.critical {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2); }
  50% { box-shadow: 0 2px 15px rgba(239, 68, 68, 0.4); }
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
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-controls {
    width: 100%;
    justify-content: flex-start;
  }

  .stats-row {
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1 1 45%;
  }
}
</style>
