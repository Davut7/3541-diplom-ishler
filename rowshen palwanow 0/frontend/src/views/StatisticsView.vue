<template>
  <div class="statistics-view">
    <div class="page-header">
      <div class="header-icon">
        <i class="pi pi-chart-bar"></i>
      </div>
      <h1>{{ t.statistics.title }}</h1>
      <p>{{ t.statistics.subtitle }}</p>
    </div>

    <!-- Summary Cards -->
    <div class="stats-grid">
      <Card class="stat-card scans">
        <template #content>
          <div class="stat-icon"><i class="pi pi-search"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalScans }}</span>
            <span class="stat-label">{{ t.statistics.cards.totalScans }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card threats">
        <template #content>
          <div class="stat-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.threatsDetected }}</span>
            <span class="stat-label">{{ t.statistics.cards.threats }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card removed">
        <template #content>
          <div class="stat-icon"><i class="pi pi-trash"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.threatsRemoved }}</span>
            <span class="stat-label">{{ t.statistics.cards.removed }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card protected">
        <template #content>
          <div class="stat-icon"><i class="pi pi-shield"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.daysProtected }}</span>
            <span class="stat-label">{{ t.statistics.cards.daysProtected }}</span>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-pie"></i> {{ t.statistics.charts.threatTypes }}</h3>
          <div class="chart-container">
            <Doughnut :data="threatTypesData" :options="doughnutOptions" />
          </div>
        </template>
      </Card>

      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-bar"></i> {{ t.statistics.charts.riskLevels }}</h3>
          <div class="chart-container">
            <Bar :data="riskLevelsData" :options="barOptions" />
          </div>
        </template>
      </Card>

      <Card class="chart-card wide">
        <template #content>
          <h3><i class="pi pi-chart-line"></i> {{ t.statistics.charts.scanHistory }}</h3>
          <div class="chart-container">
            <Line :data="scanHistoryData" :options="lineOptions" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Detections -->
    <Card class="detections-card">
      <template #content>
        <h3><i class="pi pi-exclamation-circle"></i> {{ t.statistics.recentDetections.title }}</h3>
        <div v-if="recentDetections.length" class="detections-list">
          <div v-for="(detection, i) in recentDetections" :key="i" class="detection-item">
            <div class="detection-icon" :class="detection.riskClass">
              <i :class="detection.icon"></i>
            </div>
            <div class="detection-info">
              <span class="detection-name">{{ detection.name }}</span>
              <span class="detection-type">{{ detection.type }}</span>
            </div>
            <Tag :severity="detection.severity" :value="detection.risk" />
            <span class="detection-date">{{ detection.date }}</span>
          </div>
        </div>
        <div v-else class="empty-detections">
          <i class="pi pi-shield"></i>
          <p>{{ t.statistics.recentDetections.noDetections }}</p>
        </div>
      </template>
    </Card>

    <!-- Protection Status -->
    <Card class="protection-card">
      <template #content>
        <h3><i class="pi pi-lock"></i> {{ t.statistics.protectionStatus.title }}</h3>
        <div class="protection-stats">
          <div class="protection-item">
            <span class="protection-label">{{ t.statistics.protectionStatus.hookMonitor }}</span>
            <Tag severity="success" value="Active" />
          </div>
          <div class="protection-item">
            <span class="protection-label">{{ t.statistics.protectionStatus.apiMonitor }}</span>
            <Tag severity="success" value="Active" />
          </div>
          <div class="protection-item">
            <span class="protection-label">{{ t.statistics.protectionStatus.processGuard }}</span>
            <Tag severity="success" value="Active" />
          </div>
          <div class="protection-item">
            <span class="protection-label">{{ t.statistics.protectionStatus.networkGuard }}</span>
            <Tag severity="warn" value="Partial" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler)

export default {
  components: { Doughnut, Bar, Line },
  props: { t: Object, language: String },
  setup(props) {
    const stats = ref({
      totalScans: 47,
      threatsDetected: 12,
      threatsRemoved: 11,
      daysProtected: 31
    })

    const recentDetections = ref([
      { name: 'KeyCapture.exe', type: 'Hook-based Keylogger', risk: 'Critical', severity: 'danger', icon: 'pi pi-exclamation-triangle', riskClass: 'critical', date: '2 hours ago' },
      { name: 'HookLogger.dll', type: 'API Monitor', risk: 'High', severity: 'warn', icon: 'pi pi-eye', riskClass: 'high', date: '1 day ago' },
      { name: 'InputMonitor.sys', type: 'Kernel Driver', risk: 'Critical', severity: 'danger', icon: 'pi pi-cog', riskClass: 'critical', date: '3 days ago' }
    ])

    const threatTypesData = computed(() => ({
      labels: [
        props.language === 'en' ? 'Hook-based' : 'Hook esasly',
        props.language === 'en' ? 'API-based' : 'API esasly',
        props.language === 'en' ? 'Form Grabbers' : 'Form tutujylar',
        props.language === 'en' ? 'Kernel-level' : 'Kernel derejeli'
      ],
      datasets: [{
        data: [5, 3, 2, 2],
        backgroundColor: ['#d4a574', '#b8860b', '#cd7f32', '#8b7355'],
        borderColor: ['#c49464', '#a87600', '#bd6f22', '#7b6345'],
        borderWidth: 2
      }]
    }))

    const riskLevelsData = computed(() => ({
      labels: [
        props.language === 'en' ? 'Critical' : 'Kritiki',
        props.language === 'en' ? 'High' : 'Yokary',
        props.language === 'en' ? 'Medium' : 'Orta',
        props.language === 'en' ? 'Low' : 'Pes'
      ],
      datasets: [{
        label: props.language === 'en' ? 'Detections' : 'Tapylanlar',
        data: [4, 5, 2, 1],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
        borderRadius: 8
      }]
    }))

    const scanHistoryData = computed(() => {
      const days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        days.push(d.toLocaleDateString('en-US', { weekday: 'short' }))
      }
      return {
        labels: days,
        datasets: [{
          label: props.language === 'en' ? 'Scans' : 'Skanlar',
          data: [2, 4, 1, 3, 5, 2, 4],
          borderColor: '#d4a574',
          backgroundColor: 'rgba(212, 165, 116, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#d4a574',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      }
    })

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } } }
    }

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }

    const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }

    return { stats, recentDetections, threatTypesData, riskLevelsData, scanHistoryData, doughnutOptions, barOptions, lineOptions }
  }
}
</script>

<style scoped>
.statistics-view { max-width: 1200px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }
.header-icon { font-size: 3rem; color: var(--gold-primary); margin-bottom: 1rem; }
.page-header h1 { font-family: 'Cinzel', serif; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }

.stat-card { transition: transform 0.3s; overflow: hidden; }
.stat-card:hover { transform: translateY(-5px); }
.stat-card :deep(.p-card-content) { display: flex; align-items: center; gap: 1rem; padding: 1.25rem !important; }

.stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-icon i { font-size: 1.75rem; color: white; }

.stat-card.scans .stat-icon { background: linear-gradient(135deg, #d4a574, #b8860b); }
.stat-card.threats .stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
.stat-card.removed .stat-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
.stat-card.protected .stat-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }

.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 2rem; font-weight: 700; font-family: 'Cinzel', serif; color: var(--text-primary); }
.stat-label { font-size: 0.85rem; color: var(--text-secondary); }

/* Charts */
.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
.chart-card.wide { grid-column: span 2; }
.chart-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 1rem; font-family: 'Cinzel', serif; }
.chart-card h3 i { color: var(--gold-primary); }
.chart-container { height: 280px; position: relative; }

/* Detections Card */
.detections-card { margin-bottom: 2rem; }
.detections-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-family: 'Cinzel', serif; }
.detections-card h3 i { color: var(--gold-primary); }

.detections-list { display: flex; flex-direction: column; gap: 1rem; }
.detection-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-primary); border-radius: 10px; border: 1px solid var(--border-color); }

.detection-icon { width: 45px; height: 45px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.detection-icon i { font-size: 1.25rem; color: white; }
.detection-icon.critical { background: linear-gradient(135deg, #ef4444, #dc2626); }
.detection-icon.high { background: linear-gradient(135deg, #f97316, #ea580c); }

.detection-info { flex: 1; display: flex; flex-direction: column; }
.detection-name { font-weight: 600; }
.detection-type { font-size: 0.85rem; color: var(--text-secondary); }
.detection-date { font-size: 0.8rem; color: var(--text-secondary); }

.empty-detections { text-align: center; padding: 2rem; color: var(--text-secondary); }
.empty-detections i { font-size: 3rem; margin-bottom: 0.5rem; opacity: 0.3; color: var(--gold-primary); }

/* Protection Card */
.protection-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-family: 'Cinzel', serif; }
.protection-card h3 i { color: var(--gold-primary); }

.protection-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.protection-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border-color); }
.protection-label { font-weight: 500; }

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .chart-card.wide { grid-column: span 1; }
  .protection-stats { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
  .detection-item { flex-wrap: wrap; }
}
</style>
