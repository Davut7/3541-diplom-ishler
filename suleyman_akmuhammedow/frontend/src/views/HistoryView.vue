<template>
  <div class="history-view">
    <div class="page-header">
      <h1>{{ t.history.title }}</h1>
      <p>{{ t.history.subtitle }}</p>
    </div>

    <!-- Statistics -->
    <div class="stats-grid">
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-search stat-icon"></i>
            <div class="stat-info">
              <span class="stat-value">{{ history.length }}</span>
              <span class="stat-label">{{ t.history.stats.totalScans }}</span>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-chart-line stat-icon warning"></i>
            <div class="stat-info">
              <span class="stat-value">{{ avgRisk }}%</span>
              <span class="stat-label">{{ t.history.stats.avgRisk }}</span>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-exclamation-triangle stat-icon danger"></i>
            <div class="stat-info">
              <span class="stat-value">{{ highRiskCount }}</span>
              <span class="stat-label">{{ t.history.stats.highRisk }}</span>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-clock stat-icon"></i>
            <div class="stat-info">
              <span class="stat-value">{{ lastScanDate }}</span>
              <span class="stat-label">{{ t.history.stats.lastScan }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Chart Section -->
    <Card v-if="history.length > 0" class="chart-card">
      <template #content>
        <h3>{{ language === 'en' ? 'Risk Distribution' : 'Howp Paýlanyşy' }}</h3>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </template>
    </Card>

    <!-- History Table -->
    <Card class="table-card">
      <template #content>
        <div class="table-header">
          <h3>{{ t.history.title }}</h3>
          <Button
            v-if="history.length > 0"
            @click="confirmClear"
            icon="pi pi-trash"
            :label="t.history.clear"
            class="p-button-danger p-button-outlined"
            size="small"
          />
        </div>

        <DataTable
          v-if="history.length > 0"
          :value="history"
          :paginator="true"
          :rows="10"
          stripedRows
          class="history-table"
        >
          <Column field="target" :header="t.history.columns.target">
            <template #body="{ data }">
              <div class="target-cell">
                <i class="pi pi-globe"></i>
                <span>{{ data.target }}</span>
              </div>
            </template>
          </Column>
          <Column field="ip" :header="t.history.columns.ip">
            <template #body="{ data }">
              <code>{{ data.ip }}</code>
            </template>
          </Column>
          <Column field="riskScore" :header="t.history.columns.risk">
            <template #body="{ data }">
              <Tag :severity="getRiskSeverity(data.riskScore)" :value="data.riskScore + '%'" />
            </template>
          </Column>
          <Column field="date" :header="t.history.columns.date">
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
          </Column>
          <Column :header="t.history.columns.actions">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button icon="pi pi-download" @click="exportItem(data)" class="p-button-text p-button-sm" v-tooltip="t.history.actions.export" />
                <Button icon="pi pi-trash" @click="deleteItem(data.id)" class="p-button-text p-button-danger p-button-sm" v-tooltip="t.history.actions.delete" />
              </div>
            </template>
          </Column>
        </DataTable>

        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>{{ t.history.empty }}</p>
          <Button @click="$router.push('/analyze')" icon="pi pi-search" :label="t.home.startAnalysis" />
        </div>
      </template>
    </Card>

    <!-- Clear Confirmation Dialog -->
    <Dialog v-model:visible="showClearDialog" :header="t.history.clear" :modal="true">
      <p>{{ t.history.confirmClear }}</p>
      <template #footer>
        <Button :label="t.common.cancel" @click="showClearDialog = false" class="p-button-text" />
        <Button :label="t.common.confirm" @click="clearHistory" class="p-button-danger" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { getHistory, deleteAnalysis, clearHistory as clearStorageHistory } from '../utils/storage'
import { exportToJson } from '../utils/exportReport'
import Chart from 'chart.js/auto'

export default {
  name: 'HistoryView',
  props: {
    t: Object,
    language: String
  },
  setup(props) {
    const history = ref([])
    const showClearDialog = ref(false)
    const chartCanvas = ref(null)
    let chartInstance = null

    const loadHistory = () => {
      history.value = getHistory()
    }

    const avgRisk = computed(() => {
      if (history.value.length === 0) return 0
      const sum = history.value.reduce((acc, item) => acc + (item.riskScore || 0), 0)
      return Math.round(sum / history.value.length)
    })

    const highRiskCount = computed(() => {
      return history.value.filter(item => item.riskScore >= 50).length
    })

    const lastScanDate = computed(() => {
      if (history.value.length === 0) return 'N/A'
      const latest = history.value[0]
      return new Date(latest.date).toLocaleDateString()
    })

    const getRiskSeverity = (score) => {
      if (score >= 70) return 'danger'
      if (score >= 50) return 'warn'
      if (score >= 30) return 'info'
      return 'success'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    const deleteItem = (id) => {
      deleteAnalysis(id)
      loadHistory()
      updateChart()
    }

    const exportItem = (data) => {
      exportToJson(data)
    }

    const confirmClear = () => {
      showClearDialog.value = true
    }

    const clearHistory = () => {
      clearStorageHistory()
      loadHistory()
      showClearDialog.value = false
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }

    const updateChart = async () => {
      await nextTick()
      if (!chartCanvas.value || history.value.length === 0) return

      if (chartInstance) {
        chartInstance.destroy()
      }

      const riskCounts = {
        low: history.value.filter(h => h.riskScore < 30).length,
        medium: history.value.filter(h => h.riskScore >= 30 && h.riskScore < 50).length,
        high: history.value.filter(h => h.riskScore >= 50 && h.riskScore < 70).length,
        critical: history.value.filter(h => h.riskScore >= 70).length
      }

      chartInstance = new Chart(chartCanvas.value, {
        type: 'doughnut',
        data: {
          labels: [
            props.language === 'en' ? 'Low' : 'Pes',
            props.language === 'en' ? 'Medium' : 'Orta',
            props.language === 'en' ? 'High' : 'Ýokary',
            props.language === 'en' ? 'Critical' : 'Howply'
          ],
          datasets: [{
            data: [riskCounts.low, riskCounts.medium, riskCounts.high, riskCounts.critical],
            backgroundColor: ['#16a34a', '#ca8a04', '#ea580c', '#dc2626'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    onMounted(() => {
      loadHistory()
      updateChart()
    })

    return {
      history,
      avgRisk,
      highRiskCount,
      lastScanDate,
      showClearDialog,
      chartCanvas,
      getRiskSeverity,
      formatDate,
      deleteItem,
      exportItem,
      confirmClear,
      clearHistory
    }
  }
}
</script>

<style scoped>
.history-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  color: var(--primary-color);
}

.stat-icon.warning { color: var(--warning-color); }
.stat-icon.danger { color: var(--danger-color); }

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  display: block;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.chart-card {
  margin-bottom: 1.5rem;
}

.chart-card h3 {
  margin-bottom: 1rem;
}

.chart-container {
  height: 300px;
  max-width: 400px;
  margin: 0 auto;
}

.table-card {
  margin-bottom: 1.5rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-header h3 {
  margin: 0;
}

.target-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.target-cell i {
  color: var(--primary-color);
}

code {
  background: var(--bg-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .stat-content {
    gap: 0.75rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .chart-container {
    height: 250px;
    max-width: 300px;
  }

  .table-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .table-header .p-button {
    width: 100%;
  }

  /* Make DataTable horizontally scrollable on mobile */
  .history-table :deep(.p-datatable-wrapper) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .history-table :deep(.p-datatable-table) {
    min-width: 600px;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-state i {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .chart-container {
    height: 200px;
    max-width: 250px;
  }
}
</style>
