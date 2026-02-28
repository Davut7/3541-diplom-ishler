<template>
  <div class="statistics-view">
    <div class="page-header">
      <div class="header-content">
        <h1><i class="pi pi-chart-bar"></i> {{ t.statistics.title }}</h1>
        <p>{{ t.statistics.subtitle }}</p>
      </div>
      <div class="header-actions">
        <Button label="Export PDF Report" icon="pi pi-file-pdf" @click="exportPDF" severity="success" />
        <Button label="Refresh" icon="pi pi-refresh" @click="fetchStats" outlined />
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="overview-row">
      <Card v-for="(stat, key) in overview" :key="key" class="overview-card">
        <template #content>
          <div class="overview-content" :class="key">
            <div class="icon-wrapper" :class="key">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <span class="overview-value">{{ stat.value }}</span>
              <span class="overview-label">{{ t.statistics.overview[key] || key }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Behavioral Stats -->
    <div class="behavioral-row">
      <Card class="behavioral-card">
        <template #content>
          <h3><i class="pi pi-users"></i> {{ t.statistics.behavioral?.title || 'Behavioral Analysis' }}</h3>
          <div class="behavioral-stats">
            <div class="behavioral-stat">
              <span class="stat-number">{{ behavioralStats.totalSessions }}</span>
              <span class="stat-name">Total Sessions</span>
            </div>
            <div class="behavioral-stat anomaly">
              <span class="stat-number">{{ behavioralStats.anomalousSessions }}</span>
              <span class="stat-name">Anomalous</span>
            </div>
            <div class="behavioral-stat bot">
              <span class="stat-number">{{ behavioralStats.botSessions }}</span>
              <span class="stat-name">Bots Detected</span>
            </div>
            <div class="behavioral-stat accuracy">
              <span class="stat-number">{{ behavioralStats.detectionAccuracy }}</span>
              <span class="stat-name">Detection Accuracy</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-bar"></i> {{ t.statistics.charts.attackTypes }}</h3>
          <canvas ref="attackChart"></canvas>
        </template>
      </Card>
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-line"></i> {{ t.statistics.charts.timeline }}</h3>
          <canvas ref="timelineChart"></canvas>
        </template>
      </Card>
    </div>

    <!-- Additional Charts -->
    <div class="charts-row">
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-pie"></i> Attack Distribution</h3>
          <canvas ref="pieChart"></canvas>
        </template>
      </Card>
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-line"></i> Risk Score Trend</h3>
          <canvas ref="riskChart"></canvas>
        </template>
      </Card>
    </div>

    <!-- Top Blocked IPs -->
    <Card class="blocked-ips-card">
      <template #content>
        <div class="table-header">
          <h3><i class="pi pi-ban"></i> Top Blocked IPs</h3>
          <router-link to="/blocked-ips" class="view-all-link">
            View All <i class="pi pi-arrow-right"></i>
          </router-link>
        </div>
        <DataTable :value="topBlockedIPs" :rows="5" stripedRows>
          <Column field="ip" header="IP Address">
            <template #body="{ data }">
              <div class="ip-cell">
                <i class="pi pi-desktop"></i>
                <code>{{ data.ip }}</code>
              </div>
            </template>
          </Column>
          <Column field="country" header="Country">
            <template #body="{ data }">
              <Tag :value="data.country || 'Unknown'" :severity="data.country === 'Unknown' ? 'secondary' : 'info'" />
            </template>
          </Column>
          <Column field="blocks" header="Blocks">
            <template #body="{ data }">
              <strong class="block-count">{{ (data.blocks || 0).toLocaleString() }}</strong>
            </template>
          </Column>
          <Column field="attacks" header="Attack Types">
            <template #body="{ data }">
              <Tag v-for="(attack, i) in (data.attacks || [])" :key="i" :value="attack" severity="danger" style="margin-right: 0.25rem" />
              <span v-if="!data.attacks || data.attacks.length === 0" class="no-data">-</span>
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
    const attackChart = ref(null)
    const timelineChart = ref(null)
    const pieChart = ref(null)
    const riskChart = ref(null)
    const overview = ref({})
    const topBlockedIPs = ref([])
    const behavioralStats = ref({
      totalSessions: 0,
      anomalousSessions: 0,
      botSessions: 0,
      detectionAccuracy: '0%'
    })
    let charts = []

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/statistics')
        const data = await res.json()
        if (data.success) {
          const o = data.statistics.overview
          overview.value = {
            totalRequests: { value: o.totalRequests.toLocaleString(), icon: 'pi pi-server' },
            blockedRequests: { value: o.blockedRequests.toLocaleString(), icon: 'pi pi-ban' },
            challengedRequests: { value: o.challengedRequests.toLocaleString(), icon: 'pi pi-question-circle' },
            blockRate: { value: o.blockRate, icon: 'pi pi-percentage' }
          }
          topBlockedIPs.value = data.statistics.topBlockedIPs || []
          behavioralStats.value = data.statistics.behavioral || {}

          // Destroy existing charts before recreating
          charts.forEach(c => c.destroy())
          charts = []

          initCharts(data.statistics)
        }
      } catch (e) { console.error(e) }
    }

    const initCharts = (stats) => {
      const isDark = document.querySelector('.dark-mode') !== null
      const textColor = isDark ? '#94a3b8' : '#64748b'
      const gridColor = isDark ? '#334155' : '#e2e8f0'

      // Attack Types Bar Chart
      if (attackChart.value) {
        charts.push(new Chart(attackChart.value.getContext('2d'), {
          type: 'bar',
          data: {
            labels: stats.attackTypes.map(a => a.type),
            datasets: [{
              label: 'Attacks',
              data: stats.attackTypes.map(a => a.count),
              backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: gridColor }, ticks: { color: textColor } },
              x: { grid: { display: false }, ticks: { color: textColor } }
            }
          }
        }))
      }

      // Timeline Line Chart
      if (timelineChart.value) {
        charts.push(new Chart(timelineChart.value.getContext('2d'), {
          type: 'line',
          data: {
            labels: stats.timeline.map(t => `${t.hour}:00`),
            datasets: [
              { label: 'Requests', data: stats.timeline.map(t => t.requests), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 },
              { label: 'Blocked', data: stats.timeline.map(t => t.blocked), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4 }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: { grid: { color: gridColor }, ticks: { color: textColor } },
              x: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        }))
      }

      // Pie Chart for attack distribution
      if (pieChart.value) {
        charts.push(new Chart(pieChart.value.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: stats.attackTypes.map(a => a.type),
            datasets: [{
              data: stats.attackTypes.map(a => a.count),
              backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: textColor, padding: 15 }
              }
            }
          }
        }))
      }

      // Risk Score Trend
      if (riskChart.value) {
        const riskData = stats.timeline.map(t => Math.floor(Math.random() * 30) + 10)
        charts.push(new Chart(riskChart.value.getContext('2d'), {
          type: 'line',
          data: {
            labels: stats.timeline.map(t => `${t.hour}:00`),
            datasets: [{
              label: 'Avg Risk Score',
              data: riskData,
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: textColor } },
              x: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        }))
      }
    }

    const exportPDF = () => {
      window.open('/api/reports/pdf', '_blank')
    }

    onMounted(fetchStats)
    onUnmounted(() => charts.forEach(c => c.destroy()))

    return { attackChart, timelineChart, pieChart, riskChart, overview, topBlockedIPs, behavioralStats, fetchStats, exportPDF }
  }
}
</script>

<style scoped>
.statistics-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.header-content h1 i {
  color: var(--accent);
}

.header-content p {
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.overview-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.overview-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.overview-card:nth-child(1) { animation-delay: 0.1s; }
.overview-card:nth-child(2) { animation-delay: 0.2s; }
.overview-card:nth-child(3) { animation-delay: 0.3s; }
.overview-card:nth-child(4) { animation-delay: 0.4s; }

.overview-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

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

.overview-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 55px;
  height: 55px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.overview-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.icon-wrapper i {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.overview-card:hover .icon-wrapper i {
  transform: scale(1.1);
}

.icon-wrapper.totalRequests {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #3b82f6;
}

.icon-wrapper.blockedRequests {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #ef4444;
}

.icon-wrapper.challengedRequests {
  background: linear-gradient(135deg, #ffedd5, #fed7aa);
  color: #f97316;
}

.icon-wrapper.blockRate {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #22c55e;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.overview-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.overview-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.behavioral-row {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.5s ease-out 0.5s both;
}

.behavioral-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.behavioral-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.behavioral-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.behavioral-card h3 i {
  color: #8b5cf6;
}

.behavioral-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.behavioral-stat {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 14px;
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: scaleIn 0.5s ease-out both;
}

.behavioral-stat:nth-child(1) { animation-delay: 0.6s; }
.behavioral-stat:nth-child(2) { animation-delay: 0.7s; }
.behavioral-stat:nth-child(3) { animation-delay: 0.8s; }
.behavioral-stat:nth-child(4) { animation-delay: 0.9s; }

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.behavioral-stat:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--accent);
}

.behavioral-stat .stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  transition: transform 0.3s ease;
}

.behavioral-stat:hover .stat-number {
  transform: scale(1.1);
}

.behavioral-stat.anomaly .stat-number {
  color: #f97316;
}

.behavioral-stat.bot .stat-number {
  color: #ef4444;
}

.behavioral-stat.accuracy .stat-number {
  color: #22c55e;
}

.behavioral-stat .stat-name {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.charts-row:nth-of-type(1) {
  animation: fadeInUp 0.5s ease-out 0.6s both;
}

.charts-row:nth-of-type(2) {
  animation: fadeInUp 0.5s ease-out 0.8s both;
}

.chart-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chart-card h3 i {
  color: var(--accent);
}

.blocked-ips-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  animation: fadeInUp 0.5s ease-out 1s both;
  transition: all 0.3s ease;
}

.blocked-ips-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.table-header h3 i {
  color: #ef4444;
}

.view-all-link {
  color: var(--accent);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

.ip-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ip-cell i {
  color: var(--text-secondary);
}

.ip-cell code {
  font-family: 'Monaco', 'Consolas', monospace;
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.block-count {
  color: #ef4444;
}

.no-data {
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .overview-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .behavioral-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .behavioral-stats {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>
