<template>
  <div class="statistics-view">
    <div class="page-header">
      <h1>{{ t.statistics?.title || 'Network Statistics' }}</h1>
      <p>{{ t.statistics?.subtitle || 'Real-time network traffic analysis and visualization' }}</p>
      <div class="header-actions">
        <Button :label="language === 'en' ? 'Refresh Data' : 'Maglumatlary Täzele'" icon="pi pi-refresh" @click="fetchStatistics" :loading="isLoading" />
        <Tag :severity="isLive ? 'success' : 'secondary'" :value="isLive ? (language === 'en' ? 'LIVE' : 'GÖNI') : (language === 'en' ? 'PAUSED' : 'SAKLANDY')" />
      </div>
    </div>

    <ProgressBar v-if="isLoading && !statistics" mode="indeterminate" style="height: 4px; margin-bottom: 1rem" />

    <!-- Overview Stats -->
    <div class="stats-overview" v-if="statistics">
      <div class="stat-box" v-for="(stat, i) in overviewStats" :key="i">
        <div class="stat-icon" :style="{ background: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="charts-grid" v-if="statistics">
      <!-- Protocol Distribution -->
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-pie"></i> {{ language === 'en' ? 'Protocol Distribution' : 'Protokol Paýlanyşy' }}</h3>
          <div class="chart-container">
            <Doughnut :data="protocolChartData" :options="doughnutOptions" />
          </div>
          <div class="protocol-legend">
            <div v-for="(data, proto) in statistics.protocols" :key="proto" class="legend-item">
              <span class="legend-color" :style="{ background: data.color }"></span>
              <span class="legend-name">{{ proto }}</span>
              <span class="legend-value">{{ data.packets }}%</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Traffic Over Time -->
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-line"></i> {{ language === 'en' ? 'Traffic Over Time (24h)' : 'Wagtyň Dowamynda Trafik (24s)' }}</h3>
          <div class="chart-container">
            <Line :data="trafficTimelineData" :options="lineChartOptions" />
          </div>
        </template>
      </Card>

      <!-- Packet Sizes -->
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-bar"></i> {{ language === 'en' ? 'Packet Size Distribution' : 'Paket Ölçeg Paýlanyşy' }}</h3>
          <div class="chart-container">
            <Bar :data="packetSizeData" :options="barChartOptions" />
          </div>
        </template>
      </Card>

      <!-- Top Ports -->
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-server"></i> {{ language === 'en' ? 'Top Ports' : 'Iň Köp Ulanylýan Portlar' }}</h3>
          <div class="chart-container">
            <Bar :data="topPortsData" :options="horizontalBarOptions" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Top Talkers Table -->
    <Card class="talkers-card" v-if="statistics">
      <template #content>
        <h3><i class="pi pi-users"></i> {{ language === 'en' ? 'Top Talkers' : 'Iň Köp Gepleşýänler' }}</h3>
        <DataTable :value="topTalkers" stripedRows :paginator="true" :rows="5"
          :rowsPerPageOptions="[5, 10, 20]" responsiveLayout="scroll">
          <Column field="rank" :header="'#'" style="width: 60px">
            <template #body="{ data }">
              <Tag :severity="data.rank <= 3 ? 'warn' : 'secondary'" :value="'#' + data.rank" />
            </template>
          </Column>
          <Column field="ip" :header="language === 'en' ? 'IP Address' : 'IP Salgysy'">
            <template #body="{ data }">
              <code class="ip-code">{{ data.ip }}</code>
            </template>
          </Column>
          <Column field="hostname" :header="language === 'en' ? 'Hostname' : 'Host Ady'"></Column>
          <Column field="packetsIn" :header="language === 'en' ? 'Packets In' : 'Gelen Paketler'">
            <template #body="{ data }">
              <span class="packets-in">↓ {{ data.packetsIn.toLocaleString() }}</span>
            </template>
          </Column>
          <Column field="packetsOut" :header="language === 'en' ? 'Packets Out' : 'Giden Paketler'">
            <template #body="{ data }">
              <span class="packets-out">↑ {{ data.packetsOut.toLocaleString() }}</span>
            </template>
          </Column>
          <Column field="totalBytes" :header="language === 'en' ? 'Total Data' : 'Jemi Maglumat'">
            <template #body="{ data }">
              <strong>{{ formatBytes(data.bytesIn + data.bytesOut) }}</strong>
            </template>
          </Column>
          <Column :header="language === 'en' ? 'Traffic Share' : 'Trafik Paýy'" style="width: 150px">
            <template #body="{ data }">
              <div class="traffic-share">
                <ProgressBar :value="data.percentage" :showValue="false" style="height: 8px" />
                <span>{{ data.percentage.toFixed(1) }}%</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Connection States -->
    <Card class="connections-card" v-if="statistics">
      <template #content>
        <h3><i class="pi pi-link"></i> {{ language === 'en' ? 'TCP Connection States' : 'TCP Baglanyşyk Ýagdaýlary' }}</h3>
        <div class="connection-states">
          <div v-for="state in connectionStates" :key="state.name" class="state-item">
            <div class="state-header">
              <span class="state-name">{{ state.name }}</span>
              <span class="state-count">{{ state.count.toLocaleString() }}</span>
            </div>
            <ProgressBar :value="state.percentage" :showValue="false" style="height: 10px" />
            <span class="state-desc">{{ state.description }}</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Security Alerts -->
    <Card class="alerts-card" v-if="statistics">
      <template #content>
        <h3><i class="pi pi-exclamation-triangle"></i> {{ language === 'en' ? 'Security Alerts' : 'Howpsuzlyk Duýduryşlary' }}</h3>
        <div v-if="securityAlerts.length === 0" class="no-alerts">
          <i class="pi pi-shield"></i>
          <p>{{ language === 'en' ? 'No security threats detected' : 'Hiç hili howpsuzlyk howpy tapylmady' }}</p>
          <span>{{ language === 'en' ? 'Network is operating normally' : 'Tor kadaly işleýär' }}</span>
        </div>
        <div v-else class="alerts-list">
          <div v-for="(alert, i) in securityAlerts" :key="i" class="alert-item" :class="'severity-' + alert.severity">
            <div class="alert-icon">
              <i :class="getAlertIcon(alert.type)"></i>
            </div>
            <div class="alert-content">
              <div class="alert-header">
                <Tag :severity="getSeverityColor(alert.severity)" :value="alert.type" />
                <span class="alert-time">{{ alert.time }}</span>
              </div>
              <p>{{ alert.description }}</p>
              <div class="alert-meta">
                <span><i class="pi pi-map-marker"></i> {{ language === 'en' ? 'Source' : 'Çeşme' }}: {{ alert.source }}</span>
                <span v-if="alert.destination"><i class="pi pi-arrow-right"></i> {{ alert.destination }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Capture Info -->
    <Card class="info-card" v-if="statistics">
      <template #content>
        <div class="capture-info">
          <div class="info-item">
            <i class="pi pi-clock"></i>
            <div>
              <span class="info-label">{{ language === 'en' ? 'Capture Duration' : 'Tutma Wagty' }}</span>
              <span class="info-value">{{ statistics.summary.captureTime }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="pi pi-bolt"></i>
            <div>
              <span class="info-label">{{ language === 'en' ? 'Packets/sec' : 'Paket/sek' }}</span>
              <span class="info-value">{{ statistics.summary.packetsPerSecond.toLocaleString() }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="pi pi-download"></i>
            <div>
              <span class="info-label">{{ language === 'en' ? 'Throughput' : 'Geçirijilik' }}</span>
              <span class="info-value">{{ formatBytes(statistics.summary.bytesPerSecond) }}/s</span>
            </div>
          </div>
          <div class="info-item">
            <i class="pi pi-box"></i>
            <div>
              <span class="info-label">{{ language === 'en' ? 'Avg Packet Size' : 'Ort. Paket Ölçegi' }}</span>
              <span class="info-value">{{ statistics.summary.avgPacketSize }} bytes</span>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Doughnut, Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
)

const API_URL = 'http://localhost:7009/api'

export default {
  name: 'StatisticsView',
  components: { Doughnut, Line, Bar },
  props: { t: Object, language: String },
  setup(props) {
    const statistics = ref(null)
    const isLoading = ref(false)
    const isLive = ref(true)
    const lastUpdate = ref(null)
    let updateInterval = null

    const fetchStatistics = async () => {
      isLoading.value = true
      try {
        const response = await fetch(`${API_URL}/statistics`)
        const data = await response.json()
        if (data.success) {
          statistics.value = data.statistics
          lastUpdate.value = new Date()
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchStatistics()
      updateInterval = setInterval(() => {
        if (isLive.value) {
          fetchStatistics()
        }
      }, 5000)
    })

    onUnmounted(() => {
      if (updateInterval) clearInterval(updateInterval)
    })

    const formatBytes = (bytes) => {
      if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB'
      if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB'
      if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
      return bytes + ' B'
    }

    const overviewStats = computed(() => {
      if (!statistics.value) return []
      const s = statistics.value.summary
      return [
        { icon: 'pi pi-inbox', value: s.totalPackets.toLocaleString(), label: props.language === 'en' ? 'Total Packets' : 'Jemi Paketler', color: '#3b82f6' },
        { icon: 'pi pi-database', value: formatBytes(s.totalBytes), label: props.language === 'en' ? 'Total Data' : 'Jemi Maglumat', color: '#10b981' },
        { icon: 'pi pi-bolt', value: s.packetsPerSecond.toLocaleString() + '/s', label: props.language === 'en' ? 'Packet Rate' : 'Paket Tizligi', color: '#8b5cf6' },
        { icon: 'pi pi-clock', value: s.captureTime, label: props.language === 'en' ? 'Capture Time' : 'Tutma Wagty', color: '#f59e0b' }
      ]
    })

    const protocolChartData = computed(() => {
      if (!statistics.value) return { labels: [], datasets: [] }
      const protocols = statistics.value.protocols
      return {
        labels: Object.keys(protocols),
        datasets: [{
          data: Object.values(protocols).map(p => p.packets),
          backgroundColor: Object.values(protocols).map(p => p.color),
          borderWidth: 0
        }]
      }
    })

    const trafficTimelineData = computed(() => {
      // Generate realistic 24-hour traffic pattern
      const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
      const baseIncoming = [120, 80, 60, 45, 40, 55, 150, 380, 520, 480, 450, 490, 510, 480, 420, 460, 520, 580, 490, 420, 350, 280, 200, 150]
      const baseOutgoing = [100, 60, 45, 35, 30, 45, 120, 320, 450, 420, 390, 430, 460, 420, 380, 400, 470, 520, 430, 380, 300, 240, 170, 120]

      return {
        labels: hours,
        datasets: [
          {
            label: props.language === 'en' ? 'Incoming (Mbps)' : 'Gelýän (Mbps)',
            data: baseIncoming.map(v => v + Math.floor(Math.random() * 50)),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: props.language === 'en' ? 'Outgoing (Mbps)' : 'Gidýän (Mbps)',
            data: baseOutgoing.map(v => v + Math.floor(Math.random() * 40)),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    })

    const packetSizeData = computed(() => {
      if (!statistics.value) return { labels: [], datasets: [] }
      const sizes = statistics.value.packetSizes
      return {
        labels: Object.keys(sizes).map(k => k + ' bytes'),
        datasets: [{
          label: props.language === 'en' ? 'Packets' : 'Paketler',
          data: Object.values(sizes),
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#ec4899'],
          borderRadius: 6
        }]
      }
    })

    const topPortsData = computed(() => {
      if (!statistics.value) return { labels: [], datasets: [] }
      const ports = statistics.value.topPorts
      return {
        labels: ports.map(p => `${p.port} (${p.name})`),
        datasets: [{
          label: props.language === 'en' ? 'Connections' : 'Baglanyşyklar',
          data: ports.map(p => p.connections),
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
          borderRadius: 6
        }]
      }
    })

    const topTalkers = computed(() => {
      if (!statistics.value) return []
      const total = statistics.value.topTalkers.reduce((sum, t) => sum + t.bytesIn + t.bytesOut, 0)
      return statistics.value.topTalkers.map(t => ({
        ...t,
        percentage: ((t.bytesIn + t.bytesOut) / total) * 100
      }))
    })

    const connectionStates = computed(() => {
      const total = 2847
      return [
        { name: 'ESTABLISHED', count: 1482, percentage: 52, description: props.language === 'en' ? 'Active connections' : 'Işjeň baglanyşyklar' },
        { name: 'TIME_WAIT', count: 627, percentage: 22, description: props.language === 'en' ? 'Waiting to close' : 'Ýapylmagyna garaşýar' },
        { name: 'CLOSE_WAIT', count: 285, percentage: 10, description: props.language === 'en' ? 'Remote closed' : 'Uzakdan ýapyldy' },
        { name: 'SYN_SENT', count: 171, percentage: 6, description: props.language === 'en' ? 'Connection attempt' : 'Baglanyşyk synanyşygy' },
        { name: 'LISTENING', count: 282, percentage: 10, description: props.language === 'en' ? 'Waiting for connection' : 'Baglanyşyga garaşýar' }
      ]
    })

    const securityAlerts = ref([])

    // Fetch security alerts periodically
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_URL}/analyze`, { method: 'POST' })
        const data = await response.json()
        if (data.success && data.analysis.anomalies) {
          securityAlerts.value = data.analysis.anomalies.map(a => ({
            type: a.type,
            severity: a.severity,
            time: new Date(a.timestamp).toLocaleTimeString(),
            description: a.description,
            source: a.source,
            destination: a.destination
          }))
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      }
    }

    onMounted(() => {
      fetchAlerts()
    })

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      cutout: '60%'
    }

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Mbps' } },
        x: { ticks: { maxTicksLimit: 12 } }
      },
      interaction: { intersect: false, mode: 'index' }
    }

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }

    const horizontalBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } }
    }

    const getAlertIcon = (type) => {
      const icons = {
        'Port Scan': 'pi pi-search',
        'Unusual Traffic': 'pi pi-exclamation-circle',
        'DDoS Pattern': 'pi pi-bolt',
        'Data Exfiltration': 'pi pi-upload',
        'DNS Tunneling': 'pi pi-globe',
        'Malware': 'pi pi-ban'
      }
      return icons[type] || 'pi pi-info-circle'
    }

    const getSeverityColor = (severity) => {
      const colors = { danger: 'danger', warning: 'warn', info: 'info' }
      return colors[severity] || 'secondary'
    }

    return {
      statistics,
      isLoading,
      isLive,
      fetchStatistics,
      formatBytes,
      overviewStats,
      protocolChartData,
      trafficTimelineData,
      packetSizeData,
      topPortsData,
      topTalkers,
      connectionStates,
      securityAlerts,
      doughnutOptions,
      lineChartOptions,
      barChartOptions,
      horizontalBarOptions,
      getAlertIcon,
      getSeverityColor
    }
  }
}
</script>

<style scoped>
.statistics-view { max-width: 1400px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); margin-bottom: 1rem; }
.header-actions { display: flex; gap: 1rem; justify-content: center; align-items: center; }

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i { font-size: 1.5rem; color: white; }
.stat-value { font-size: 1.75rem; font-weight: 700; display: block; }
.stat-label { color: var(--text-secondary); font-size: 0.85rem; }

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chart-card h3 i { color: #3b82f6; }
.chart-container { height: 280px; }

.protocol-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-value {
  color: var(--text-secondary);
  font-weight: 600;
}

.talkers-card, .connections-card, .alerts-card, .info-card { margin-bottom: 1.5rem; }

.talkers-card h3, .connections-card h3, .alerts-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.talkers-card h3 i, .connections-card h3 i, .alerts-card h3 i { color: #3b82f6; }

.ip-code {
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
}

.packets-in { color: #10b981; font-weight: 600; }
.packets-out { color: #3b82f6; font-weight: 600; }

.traffic-share {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.traffic-share span {
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 45px;
}

.connection-states {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.state-item {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 8px;
}

.state-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.state-name { font-weight: 600; font-size: 0.85rem; }
.state-count { font-weight: 700; color: #3b82f6; }
.state-desc { font-size: 0.75rem; color: var(--text-secondary); display: block; margin-top: 0.5rem; }

.no-alerts {
  text-align: center;
  padding: 3rem;
  color: #22c55e;
}

.no-alerts i { font-size: 3rem; margin-bottom: 1rem; display: block; }
.no-alerts p { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
.no-alerts span { color: var(--text-secondary); }

.alerts-list { display: flex; flex-direction: column; gap: 1rem; }

.alert-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.severity-danger { border-color: #ef4444; }
.alert-item.severity-warning { border-color: #f59e0b; }
.alert-item.severity-info { border-color: #3b82f6; }

.alert-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.alert-icon i { font-size: 1.25rem; color: var(--text-secondary); }
.alert-content { flex: 1; }

.alert-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.alert-time { font-size: 0.8rem; color: var(--text-secondary); }
.alert-content p { margin-bottom: 0.5rem; font-size: 0.9rem; }

.alert-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.alert-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.capture-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.info-item i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.info-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.info-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .stats-overview { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .connection-states { grid-template-columns: repeat(2, 1fr); }
  .capture-info { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .stats-overview { grid-template-columns: 1fr; }
  .connection-states { grid-template-columns: 1fr; }
  .capture-info { grid-template-columns: 1fr; }
}
</style>
