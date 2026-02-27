<template>
  <div class="statistics-view">
    <div class="page-header">
      <h1>{{ t.statistics.title }}</h1>
      <p>{{ t.statistics.subtitle }}</p>
    </div>

    <!-- Summary Stats -->
    <div class="summary-row">
      <Card v-for="(stat, key) in summaryStats" :key="key" class="summary-card">
        <template #content>
          <div class="summary-content" :class="key">
            <div class="summary-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="summary-info">
              <span class="summary-value">{{ stat.value }}</span>
              <span class="summary-label">{{ t.statistics.summary[key] }}</span>
              <span class="summary-trend" :class="stat.trend > 0 ? 'up' : 'down'">
                <i :class="stat.trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                {{ Math.abs(stat.trend) }}%
              </span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-bar"></i> {{ t.statistics.charts.threatsByType }}</h3>
          <canvas ref="threatTypeChart"></canvas>
        </template>
      </Card>

      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-pie"></i> {{ t.statistics.charts.trafficDistribution }}</h3>
          <canvas ref="trafficPieChart"></canvas>
        </template>
      </Card>
    </div>

    <!-- Timeline Chart -->
    <Card class="timeline-card">
      <template #content>
        <h3><i class="pi pi-chart-line"></i> {{ t.statistics.charts.activityTimeline }}</h3>
        <canvas ref="timelineChart"></canvas>
      </template>
    </Card>

    <!-- AI Performance -->
    <div class="performance-row">
      <Card class="performance-card">
        <template #content>
          <h3><i class="pi pi-microchip-ai"></i> {{ t.statistics.aiPerformance.title }}</h3>
          <div class="performance-metrics">
            <div class="metric-item">
              <div class="metric-circle" :style="{ '--progress': aiMetrics.accuracy }">
                <span class="metric-value">{{ aiMetrics.accuracy }}%</span>
              </div>
              <span class="metric-label">{{ t.statistics.aiPerformance.accuracy }}</span>
            </div>
            <div class="metric-item">
              <div class="metric-circle" :style="{ '--progress': aiMetrics.precision }">
                <span class="metric-value">{{ aiMetrics.precision }}%</span>
              </div>
              <span class="metric-label">{{ t.statistics.aiPerformance.precision }}</span>
            </div>
            <div class="metric-item">
              <div class="metric-circle" :style="{ '--progress': aiMetrics.recall }">
                <span class="metric-value">{{ aiMetrics.recall }}%</span>
              </div>
              <span class="metric-label">{{ t.statistics.aiPerformance.recall }}</span>
            </div>
            <div class="metric-item">
              <div class="metric-circle" :style="{ '--progress': aiMetrics.f1Score }">
                <span class="metric-value">{{ aiMetrics.f1Score }}%</span>
              </div>
              <span class="metric-label">{{ t.statistics.aiPerformance.f1Score }}</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="rules-stats-card">
        <template #content>
          <h3><i class="pi pi-list-check"></i> {{ t.statistics.rulesStats.title }}</h3>
          <div class="rules-breakdown">
            <div class="rule-stat">
              <div class="rule-icon allow"><i class="pi pi-check"></i></div>
              <div class="rule-info">
                <span class="rule-value">{{ rulesStats.allow }}</span>
                <span class="rule-label">{{ t.statistics.rulesStats.allow }}</span>
              </div>
            </div>
            <div class="rule-stat">
              <div class="rule-icon deny"><i class="pi pi-times"></i></div>
              <div class="rule-info">
                <span class="rule-value">{{ rulesStats.deny }}</span>
                <span class="rule-label">{{ t.statistics.rulesStats.deny }}</span>
              </div>
            </div>
            <div class="rule-stat">
              <div class="rule-icon drop"><i class="pi pi-ban"></i></div>
              <div class="rule-info">
                <span class="rule-value">{{ rulesStats.drop }}</span>
                <span class="rule-label">{{ t.statistics.rulesStats.drop }}</span>
              </div>
            </div>
            <div class="rule-stat">
              <div class="rule-icon log"><i class="pi pi-file"></i></div>
              <div class="rule-info">
                <span class="rule-value">{{ rulesStats.log }}</span>
                <span class="rule-label">{{ t.statistics.rulesStats.log }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Top Threats Table -->
    <Card class="threats-table-card">
      <template #content>
        <h3><i class="pi pi-exclamation-triangle"></i> {{ t.statistics.topThreats.title }}</h3>
        <DataTable :value="topThreats" :rows="5" stripedRows>
          <Column field="type" :header="t.statistics.topThreats.type">
            <template #body="{ data }">
              <Tag :severity="getThreatSeverity(data.severity)" :value="data.type" />
            </template>
          </Column>
          <Column field="count" :header="t.statistics.topThreats.count">
            <template #body="{ data }">
              <strong>{{ data.count }}</strong>
            </template>
          </Column>
          <Column field="blocked" :header="t.statistics.topThreats.blocked">
            <template #body="{ data }">
              <Tag severity="success" :value="data.blocked + '%'" />
            </template>
          </Column>
          <Column field="lastSeen" :header="t.statistics.topThreats.lastSeen">
            <template #body="{ data }">
              <span class="time-ago">{{ data.lastSeen }}</span>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  props: { t: Object, language: String },
  setup() {
    const threatTypeChart = ref(null)
    const trafficPieChart = ref(null)
    const timelineChart = ref(null)

    let chartInstances = []

    const summaryStats = ref({
      totalThreats: { value: '1,247', icon: 'pi pi-shield', trend: -12 },
      blockedAttacks: { value: '1,198', icon: 'pi pi-lock', trend: 8 },
      activeRules: { value: '47', icon: 'pi pi-list', trend: 5 },
      avgResponseTime: { value: '0.3ms', icon: 'pi pi-bolt', trend: -15 }
    })

    const aiMetrics = ref({
      accuracy: 97,
      precision: 95,
      recall: 93,
      f1Score: 94
    })

    const rulesStats = ref({
      allow: 18,
      deny: 15,
      drop: 8,
      log: 6
    })

    const topThreats = ref([
      { type: 'Port Scan', severity: 'high', count: 456, blocked: 99, lastSeen: '2 min ago' },
      { type: 'Brute Force', severity: 'critical', count: 312, blocked: 100, lastSeen: '5 min ago' },
      { type: 'DDoS Attempt', severity: 'critical', count: 189, blocked: 98, lastSeen: '12 min ago' },
      { type: 'SQL Injection', severity: 'high', count: 145, blocked: 100, lastSeen: '18 min ago' },
      { type: 'Malware Traffic', severity: 'critical', count: 87, blocked: 97, lastSeen: '25 min ago' }
    ])

    const getThreatSeverity = (severity) => {
      const map = { critical: 'danger', high: 'warn', medium: 'info', low: 'secondary' }
      return map[severity] || 'info'
    }

    const initCharts = () => {
      // Threat Type Bar Chart
      if (threatTypeChart.value) {
        const ctx1 = threatTypeChart.value.getContext('2d')
        const chart1 = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: ['Port Scan', 'Brute Force', 'DDoS', 'SQL Injection', 'XSS', 'Malware', 'Zero-Day'],
            datasets: [{
              label: 'Detected',
              data: [456, 312, 189, 145, 98, 87, 23],
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: '#ef4444',
              borderWidth: 1
            }, {
              label: 'Blocked',
              data: [451, 312, 185, 145, 96, 84, 21],
              backgroundColor: 'rgba(34, 197, 94, 0.7)',
              borderColor: '#22c55e',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
          }
        })
        chartInstances.push(chart1)
      }

      // Traffic Distribution Pie Chart
      if (trafficPieChart.value) {
        const ctx2 = trafficPieChart.value.getContext('2d')
        const chart2 = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['Safe Traffic', 'Suspicious', 'Blocked Threats', 'Monitored'],
            datasets: [{
              data: [78, 12, 7, 3],
              backgroundColor: ['#22c55e', '#eab308', '#ef4444', '#3b82f6'],
              borderWidth: 2,
              borderColor: '#1e293b'
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'right' } }
          }
        })
        chartInstances.push(chart2)
      }

      // Timeline Line Chart
      if (timelineChart.value) {
        const ctx3 = timelineChart.value.getContext('2d')
        const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
        const chart3 = new Chart(ctx3, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Traffic Volume',
              data: [120, 95, 78, 65, 55, 48, 52, 89, 156, 234, 289, 312, 298, 276, 289, 301, 287, 312, 345, 298, 234, 189, 156, 132],
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              fill: true,
              tension: 0.4
            }, {
              label: 'Threats Detected',
              data: [5, 3, 2, 1, 1, 0, 2, 4, 8, 12, 15, 18, 14, 11, 13, 16, 14, 19, 22, 15, 10, 7, 6, 4],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: {
              y: { beginAtZero: true }
            }
          }
        })
        chartInstances.push(chart3)
      }
    }

    onMounted(() => {
      setTimeout(initCharts, 100)
    })

    onUnmounted(() => {
      chartInstances.forEach(chart => chart.destroy())
    })

    return {
      threatTypeChart,
      trafficPieChart,
      timelineChart,
      summaryStats,
      aiMetrics,
      rulesStats,
      topThreats,
      getThreatSeverity
    }
  }
}
</script>

<style scoped>
.statistics-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-icon i {
  font-size: 1.5rem;
  color: white;
}

.summary-content.totalThreats .summary-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
.summary-content.blockedAttacks .summary-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
.summary-content.activeRules .summary-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.summary-content.avgResponseTime .summary-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }

.summary-info {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.summary-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.summary-trend {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.summary-trend.up { color: #22c55e; }
.summary-trend.down { color: #ef4444; }

.charts-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card h3,
.timeline-card h3,
.performance-card h3,
.rules-stats-card h3,
.threats-table-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chart-card h3 i { color: #06b6d4; }
.timeline-card h3 i { color: #8b5cf6; }
.performance-card h3 i { color: #22c55e; }
.rules-stats-card h3 i { color: #f97316; }
.threats-table-card h3 i { color: #ef4444; }

.timeline-card {
  margin-bottom: 1.5rem;
}

.performance-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.metric-item {
  text-align: center;
}

.metric-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: conic-gradient(#22c55e calc(var(--progress) * 1%), var(--bg-primary) 0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  position: relative;
}

.metric-circle::before {
  content: '';
  position: absolute;
  width: 70px;
  height: 70px;
  background: var(--bg-secondary);
  border-radius: 50%;
}

.metric-value {
  position: relative;
  z-index: 1;
  font-weight: 700;
  font-size: 1.1rem;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.rules-breakdown {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.rule-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 10px;
}

.rule-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rule-icon i {
  color: white;
  font-size: 1.25rem;
}

.rule-icon.allow { background: linear-gradient(135deg, #22c55e, #16a34a); }
.rule-icon.deny { background: linear-gradient(135deg, #ef4444, #dc2626); }
.rule-icon.drop { background: linear-gradient(135deg, #f97316, #ea580c); }
.rule-icon.log { background: linear-gradient(135deg, #3b82f6, #2563eb); }

.rule-info {
  display: flex;
  flex-direction: column;
}

.rule-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.rule-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.threats-table-card {
  margin-bottom: 1.5rem;
}

.time-ago {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .summary-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row,
  .performance-row {
    grid-template-columns: 1fr;
  }

  .performance-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .summary-row {
    grid-template-columns: 1fr;
  }

  .rules-breakdown {
    grid-template-columns: 1fr;
  }
}
</style>
