<template>
  <div class="statistics-view">
    <div class="page-header">
      <h1>{{ t.statistics.title }}</h1>
      <p>{{ t.statistics.subtitle }}</p>
    </div>

    <div class="overview-row">
      <Card v-for="(stat, key) in overview" :key="key" class="overview-card">
        <template #content>
          <div class="overview-content" :class="key">
            <i :class="stat.icon"></i>
            <div>
              <span class="overview-value">{{ stat.value }}</span>
              <span class="overview-label">{{ t.statistics.overview[key] || key }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

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

    <Card class="blocked-ips-card">
      <template #content>
        <h3><i class="pi pi-ban"></i> Top Blocked IPs</h3>
        <DataTable :value="topBlockedIPs" :rows="5" stripedRows>
          <Column field="ip" header="IP Address"><template #body="{ data }"><code>{{ data.ip }}</code></template></Column>
          <Column field="country" header="Country"><template #body="{ data }"><Badge :value="data.country" /></template></Column>
          <Column field="blocks" header="Blocks"><template #body="{ data }"><strong>{{ data.blocks.toLocaleString() }}</strong></template></Column>
          <Column field="attacks" header="Attack Types">
            <template #body="{ data }">
              <Tag v-for="(attack, i) in data.attacks" :key="i" :value="attack" severity="danger" style="margin-right: 0.25rem" />
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
    const overview = ref({})
    const topBlockedIPs = ref([])
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
          topBlockedIPs.value = data.statistics.topBlockedIPs
          initCharts(data.statistics)
        }
      } catch (e) { console.error(e) }
    }

    const initCharts = (stats) => {
      if (attackChart.value) {
        charts.push(new Chart(attackChart.value.getContext('2d'), {
          type: 'bar',
          data: {
            labels: stats.attackTypes.map(a => a.type),
            datasets: [{ label: 'Attacks', data: stats.attackTypes.map(a => a.count), backgroundColor: '#f97316' }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        }))
      }
      if (timelineChart.value) {
        charts.push(new Chart(timelineChart.value.getContext('2d'), {
          type: 'line',
          data: {
            labels: stats.timeline.map(t => `${t.hour}:00`),
            datasets: [
              { label: 'Requests', data: stats.timeline.map(t => t.requests), borderColor: '#3b82f6', tension: 0.4 },
              { label: 'Blocked', data: stats.timeline.map(t => t.blocked), borderColor: '#ef4444', tension: 0.4 }
            ]
          },
          options: { responsive: true }
        }))
      }
    }

    onMounted(fetchStats)
    onUnmounted(() => charts.forEach(c => c.destroy()))

    return { attackChart, timelineChart, overview, topBlockedIPs }
  }
}
</script>

<style scoped>
.statistics-view { max-width: 1400px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.overview-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.overview-content { display: flex; align-items: center; gap: 1rem; }
.overview-content i { font-size: 2rem; }
.overview-content.totalRequests i { color: #3b82f6; }
.overview-content.blockedRequests i { color: #ef4444; }
.overview-content.challengedRequests i { color: #f97316; }
.overview-content.blockRate i { color: #22c55e; }
.overview-value { display: block; font-size: 1.5rem; font-weight: 700; }
.overview-label { color: var(--text-secondary); font-size: 0.9rem; }
.charts-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
.chart-card h3, .blocked-ips-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.chart-card h3 i { color: #f97316; }
.blocked-ips-card h3 i { color: #ef4444; }
@media (max-width: 1024px) { .overview-row { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } }
</style>
