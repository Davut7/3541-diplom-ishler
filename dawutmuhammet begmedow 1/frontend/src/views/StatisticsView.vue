<template>
  <div class="statistics-view">
    <div class="page-header">
      <h1><i class="pi pi-chart-bar"></i> {{ t.statistics.title }}</h1>
      <p>{{ t.statistics.subtitle }}</p>
    </div>

    <!-- Summary Stats Cards -->
    <div class="stats-grid">
      <Card class="stat-card total">
        <template #content>
          <div class="stat-icon"><i class="pi pi-file"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalScans }}</span>
            <span class="stat-label">{{ t.statistics.cards.totalScans }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card clean">
        <template #content>
          <div class="stat-icon"><i class="pi pi-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.cleanFiles }}</span>
            <span class="stat-label">{{ t.statistics.cards.cleanFiles }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card suspicious">
        <template #content>
          <div class="stat-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.suspicious }}</span>
            <span class="stat-label">{{ t.statistics.cards.suspicious }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card malware">
        <template #content>
          <div class="stat-icon"><i class="pi pi-times-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.malware }}</span>
            <span class="stat-label">{{ t.statistics.cards.malware }}</span>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-pie"></i> {{ t.statistics.charts.statusDistribution }}</h3>
          <div class="chart-container">
            <Doughnut :data="statusChartData" :options="doughnutOptions" />
          </div>
        </template>
      </Card>

      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-bar"></i> {{ t.statistics.charts.threatLevels }}</h3>
          <div class="chart-container">
            <Bar :data="threatChartData" :options="barOptions" />
          </div>
        </template>
      </Card>

      <Card class="chart-card wide">
        <template #content>
          <h3><i class="pi pi-chart-line"></i> {{ t.statistics.charts.scanHistory }}</h3>
          <div class="chart-container">
            <Line :data="historyChartData" :options="lineOptions" />
          </div>
        </template>
      </Card>
    </div>

    <!-- File Types Section -->
    <Card class="file-types-card">
      <template #content>
        <h3><i class="pi pi-folder"></i> {{ t.statistics.fileTypes.title }}</h3>
        <div v-if="fileTypeStats.length" class="file-types-grid">
          <div v-for="(type, i) in fileTypeStats" :key="i" class="file-type-item">
            <i :class="type.icon"></i>
            <span class="type-name">{{ type.name }}</span>
            <span class="type-count">{{ type.count }}</span>
            <ProgressBar :value="type.percentage" :showValue="false" />
          </div>
        </div>
        <div v-else class="empty-types">
          <p>{{ language === 'en' ? 'No file types scanned yet' : 'Heniz fayl gormesi skanirlenmandir' }}</p>
        </div>
      </template>
    </Card>

    <!-- Top Patterns Section -->
    <Card class="patterns-card">
      <template #content>
        <h3><i class="pi pi-exclamation-triangle" style="color: #f59e0b"></i> {{ t.statistics.patterns.title }}</h3>
        <div v-if="topPatterns.length" class="patterns-list">
          <div v-for="(pattern, i) in topPatterns" :key="i" class="pattern-item">
            <Tag :severity="getSeverityColor(pattern.severity)" :value="pattern.severity" />
            <span class="pattern-name">{{ pattern.name }}</span>
            <span class="pattern-count">{{ pattern.count }}x</span>
          </div>
        </div>
        <div v-else class="empty-patterns">
          <i class="pi pi-shield"></i>
          <p>{{ t.statistics.patterns.noPatterns }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js'
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler)

const API_URL = '/api'

export default {
  components: { Doughnut, Bar, Line },
  props: { t: Object, language: String },
  setup(props) {
    const stats = ref({
      totalScans: 0,
      cleanFiles: 0,
      suspicious: 0,
      malware: 0
    })
    const history = ref([])
    const topPatterns = ref([])
    const scansByDay = ref({})

    onMounted(async () => {
      await loadStats()
    })

    const loadStats = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          axios.get(`${API_URL}/history/stats`),
          axios.get(`${API_URL}/history`)
        ])

        const data = statsRes.data
        stats.value = {
          totalScans: data.totalScans || 0,
          cleanFiles: data.cleanFiles || 0,
          suspicious: data.suspicious || 0,
          malware: data.malware || 0
        }

        topPatterns.value = data.topPatterns || []
        scansByDay.value = data.scansByDay || {}
        history.value = historyRes.data
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    const statusChartData = computed(() => ({
      labels: [
        props.language === 'en' ? 'Clean' : 'Arassa',
        props.language === 'en' ? 'Suspicious' : 'Shubheli',
        props.language === 'en' ? 'Malware' : 'Zyyanly',
        props.language === 'en' ? 'Unknown' : 'Nabelii'
      ],
      datasets: [{
        data: [
          stats.value.cleanFiles || 1,
          stats.value.suspicious || 0,
          stats.value.malware || 0,
          0
        ],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#6366f1'],
        borderColor: ['#16a34a', '#d97706', '#dc2626', '#4f46e5'],
        borderWidth: 2
      }]
    }))

    const threatChartData = computed(() => {
      const h = history.value
      const levels = {
        '0-20': h.filter(s => s.threatScore < 20).length || 1,
        '20-40': h.filter(s => s.threatScore >= 20 && s.threatScore < 40).length || 0,
        '40-60': h.filter(s => s.threatScore >= 40 && s.threatScore < 60).length || 0,
        '60-80': h.filter(s => s.threatScore >= 60 && s.threatScore < 80).length || 0,
        '80-100': h.filter(s => s.threatScore >= 80).length || 0
      }
      return {
        labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
        datasets: [{
          label: props.language === 'en' ? 'Files' : 'Fayllar',
          data: Object.values(levels),
          backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'],
          borderRadius: 8
        }]
      }
    })

    const historyChartData = computed(() => {
      const days = []
      const counts = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        days.push(displayDate)
        counts.push(scansByDay.value[dateStr] || 0)
      }

      return {
        labels: days,
        datasets: [{
          label: props.language === 'en' ? 'Scans' : 'Skanlar',
          data: counts.some(c => c > 0) ? counts : [0, 1, 2, 1, 3, 2, 4],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      }
    })

    const fileTypeStats = computed(() => {
      const types = {}
      history.value.forEach(s => {
        const type = s.fileType?.type || 'Unknown'
        types[type] = (types[type] || 0) + 1
      })
      const total = history.value.length || 1
      const icons = {
        'PE Executable': 'pi pi-desktop',
        'DLL Library': 'pi pi-box',
        'ZIP Archive': 'pi pi-box',
        'PDF Document': 'pi pi-file-pdf',
        'MS Word': 'pi pi-file-word',
        'PNG Image': 'pi pi-image',
        'JPEG Image': 'pi pi-image',
        'PowerShell': 'pi pi-code',
        'Unknown': 'pi pi-file'
      }
      return Object.entries(types).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
        icon: icons[name] || 'pi pi-file'
      })).sort((a, b) => b.count - a.count).slice(0, 6)
    })

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
      }
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

    const getSeverityColor = (severity) => ({
      critical: 'danger',
      high: 'warn',
      medium: 'info',
      low: 'secondary'
    }[severity] || 'info')

    return {
      stats, history, topPatterns,
      statusChartData, threatChartData, historyChartData, fileTypeStats,
      doughnutOptions, barOptions, lineOptions, getSeverityColor
    }
  }
}
</script>

<style scoped>
.statistics-view { max-width: 1200px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; font-family: 'Orbitron', sans-serif; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.page-header h1 i { color: var(--primary-color); }
.page-header p { color: var(--text-secondary); }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }

.stat-card { transition: transform 0.3s; overflow: hidden; }
.stat-card:hover { transform: translateY(-5px); }
.stat-card :deep(.p-card-content) { display: flex; align-items: center; gap: 1rem; padding: 1.25rem !important; }

.stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-icon i { font-size: 1.75rem; color: white; }

.stat-card.total .stat-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.stat-card.clean .stat-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
.stat-card.suspicious .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-card.malware .stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }

.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 2rem; font-weight: 700; font-family: 'Orbitron', sans-serif; color: var(--text-primary); }
.stat-label { font-size: 0.85rem; color: var(--text-secondary); }

/* Charts Grid */
.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
.chart-card.wide { grid-column: span 2; }
.chart-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 1rem; }
.chart-card h3 i { color: var(--primary-color); }
.chart-container { height: 280px; position: relative; }

/* File Types Card */
.file-types-card, .patterns-card { margin-bottom: 2rem; }
.file-types-card h3, .patterns-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.file-types-card h3 i { color: var(--primary-color); }
.file-types-grid { display: flex; flex-direction: column; gap: 1rem; }
.file-type-item { display: grid; grid-template-columns: 40px 1fr auto auto; gap: 1rem; align-items: center; padding: 0.75rem 1rem; background: var(--bg-secondary); border-radius: 8px; }
.file-type-item i { font-size: 1.5rem; color: var(--text-secondary); }
.type-name { font-weight: 500; }
.type-count { font-weight: 700; color: var(--primary-color); min-width: 40px; text-align: right; }
.file-type-item :deep(.p-progressbar) { width: 100px; height: 8px; }

.empty-types { text-align: center; padding: 2rem; color: var(--text-secondary); }

/* Patterns Card */
.patterns-list { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.pattern-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--bg-secondary); border-radius: 8px; }
.pattern-name { font-size: 0.9rem; }
.pattern-count { font-weight: 700; color: var(--primary-color); }
.empty-patterns { text-align: center; padding: 2rem; color: var(--text-secondary); }
.empty-patterns i { font-size: 3rem; margin-bottom: 0.5rem; opacity: 0.3; }

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .chart-card.wide { grid-column: span 1; }
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
  .file-type-item { grid-template-columns: 40px 1fr auto; }
  .file-type-item :deep(.p-progressbar) { display: none; }
}
</style>
