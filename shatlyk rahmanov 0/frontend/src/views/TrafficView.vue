<template>
  <div class="traffic-view">
    <div class="page-header">
      <div class="header-content">
        <h1><i class="pi pi-arrows-h"></i> {{ t.traffic.title }}</h1>
        <p>{{ t.traffic.subtitle }}</p>
      </div>
      <div class="live-indicator">
        <span class="pulse"></span>
        <span>LIVE</span>
      </div>
    </div>

    <!-- Traffic Stats -->
    <div class="stats-grid">
      <Card v-for="(stat, key) in trafficStats" :key="key" :class="['stat-card', key]">
        <template #content>
          <div class="stat-icon">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}<small v-if="stat.unit">{{ stat.unit }}</small></span>
            <span class="stat-label">{{ t.traffic.stats[key] || stat.label }}</span>
          </div>
          <div v-if="stat.trend" class="stat-trend" :class="stat.trend">
            <i :class="stat.trend === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            <span>{{ stat.change }}%</span>
          </div>
        </template>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Protocol Distribution -->
      <Card class="protocol-card">
        <template #content>
          <h3><i class="pi pi-chart-pie"></i> {{ t.traffic.protocols }}</h3>
          <div class="protocol-list">
            <div v-for="(data, protocol) in protocols" :key="protocol" class="protocol-item">
              <div class="protocol-info">
                <div class="protocol-color" :style="{ background: data.color }"></div>
                <span class="protocol-name">{{ protocol }}</span>
              </div>
              <div class="protocol-bar">
                <div class="bar-fill" :style="{ width: data.percentage + '%', background: data.color }"></div>
              </div>
              <div class="protocol-stats">
                <span class="percentage">{{ data.percentage }}%</span>
                <span class="bytes">{{ data.bytes }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Top Sources -->
      <Card class="sources-card">
        <template #content>
          <h3><i class="pi pi-server"></i> {{ t.traffic.topSources }}</h3>
          <div class="sources-list">
            <div v-for="(source, i) in topSources" :key="i" class="source-item">
              <div class="source-rank">{{ i + 1 }}</div>
              <div class="source-info">
                <code>{{ source.ip }}</code>
                <span class="hostname">{{ source.hostname }}</span>
              </div>
              <div class="source-stats">
                <span class="connections">{{ source.connections.toLocaleString() }} conn</span>
                <span class="bytes">{{ source.bytes }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Traffic Timeline -->
    <Card class="timeline-card">
      <template #content>
        <h3><i class="pi pi-chart-line"></i> 24-Hour Traffic Timeline</h3>
        <div class="timeline-chart">
          <div class="chart-bars">
            <div v-for="(hour, i) in timeline" :key="i" class="bar-group" v-tooltip.top="`${hour.hour}: ${hour.incoming} in / ${hour.outgoing} out / ${hour.blocked} blocked`">
              <div class="bar incoming" :style="{ height: (hour.incoming / maxTraffic * 100) + '%' }"></div>
              <div class="bar outgoing" :style="{ height: (hour.outgoing / maxTraffic * 100) + '%' }"></div>
              <div class="bar blocked" :style="{ height: (hour.blocked / maxTraffic * 15) + '%' }"></div>
              <span class="hour-label">{{ hour.hour.split(':')[0] }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item incoming"><span class="dot"></span> Incoming</span>
            <span class="legend-item outgoing"><span class="dot"></span> Outgoing</span>
            <span class="legend-item blocked"><span class="dot"></span> Blocked</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Live Connections Table -->
    <Card class="connections-card">
      <template #content>
        <div class="connections-header">
          <h3><i class="pi pi-table"></i> {{ t.traffic.recentConnections }}</h3>
          <div class="connections-controls">
            <Button icon="pi pi-refresh" class="p-button-text" @click="fetchTraffic" :loading="loading" v-tooltip.left="'Refresh'" />
          </div>
        </div>
        <DataTable :value="trafficData" :paginator="true" :rows="10" stripedRows :loading="loading" responsiveLayout="scroll" :rowHover="true">
          <Column field="timestamp" :header="t.traffic.columns.time" sortable style="width: 12%">
            <template #body="{ data }">
              <span class="time-badge">{{ formatTime(data.timestamp) }}</span>
            </template>
          </Column>
          <Column field="source" :header="t.traffic.columns.source" style="width: 18%">
            <template #body="{ data }">
              <div class="ip-cell">
                <code>{{ data.source }}</code>
                <small>{{ data.sourceHostname }}</small>
              </div>
            </template>
          </Column>
          <Column field="destination" :header="t.traffic.columns.dest" style="width: 18%">
            <template #body="{ data }">
              <div class="ip-cell">
                <code>{{ data.destination }}</code>
                <small>{{ data.destHostname }}</small>
              </div>
            </template>
          </Column>
          <Column field="protocol" :header="t.traffic.columns.protocol" style="width: 10%">
            <template #body="{ data }">
              <Tag :value="data.protocol" :severity="getProtocolSeverity(data.protocol)" />
            </template>
          </Column>
          <Column field="bytes" header="Size" style="width: 10%">
            <template #body="{ data }">
              <span class="size-badge">{{ formatBytes(data.bytes) }}</span>
            </template>
          </Column>
          <Column field="action" :header="t.traffic.columns.status" style="width: 12%">
            <template #body="{ data }">
              <Tag :severity="getStatusSeverity(data.action)" :value="data.action" />
            </template>
          </Column>
          <Column field="aiDecision" :header="t.traffic.columns.aiDecision" style="width: 20%">
            <template #body="{ data }">
              <div class="ai-decision">
                <i class="pi pi-microchip-ai"></i>
                <span>{{ data.aiDecision }}</span>
                <span class="confidence">({{ data.aiConfidence }}%)</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:7081/api'

export default {
  props: { t: Object, language: String },
  setup() {
    const loading = ref(false)
    const trafficData = ref([])
    const trafficStats = ref({
      incoming: { value: '0', unit: 'GB', label: 'Incoming', icon: 'pi pi-download', trend: 'up', change: 12 },
      outgoing: { value: '0', unit: 'GB', label: 'Outgoing', icon: 'pi pi-upload', trend: 'up', change: 8 },
      blocked: { value: '0', label: 'Blocked', icon: 'pi pi-ban', trend: 'down', change: 15 },
      allowed: { value: '0', label: 'Allowed', icon: 'pi pi-check', trend: 'up', change: 5 }
    })

    const protocols = ref({
      'HTTPS': { percentage: 55, bytes: '2.8 GB', color: '#8b5cf6' },
      'HTTP': { percentage: 15, bytes: '780 MB', color: '#22c55e' },
      'DNS': { percentage: 12, bytes: '620 MB', color: '#f59e0b' },
      'SSH': { percentage: 8, bytes: '410 MB', color: '#06b6d4' },
      'FTP': { percentage: 5, bytes: '260 MB', color: '#ef4444' },
      'Other': { percentage: 5, bytes: '260 MB', color: '#6b7280' }
    })

    const topSources = ref([])
    const timeline = ref([])

    let refreshInterval

    const maxTraffic = computed(() => {
      if (timeline.value.length === 0) return 500
      return Math.max(...timeline.value.map(h => Math.max(h.incoming, h.outgoing)))
    })

    const fetchTraffic = async () => {
      loading.value = true
      try {
        const [trafficRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/traffic`),
          axios.get(`${API_URL}/traffic/stats`)
        ])

        if (trafficRes.data.success) {
          trafficData.value = trafficRes.data.traffic
        }

        if (statsRes.data.success) {
          const stats = statsRes.data.stats
          trafficStats.value.incoming.value = stats.incoming.value
          trafficStats.value.incoming.trend = stats.incoming.trend
          trafficStats.value.incoming.change = stats.incoming.change
          trafficStats.value.outgoing.value = stats.outgoing.value
          trafficStats.value.outgoing.trend = stats.outgoing.trend
          trafficStats.value.outgoing.change = stats.outgoing.change
          trafficStats.value.blocked.value = stats.blocked.value.toLocaleString()
          trafficStats.value.blocked.change = stats.blocked.change
          trafficStats.value.allowed.value = stats.allowed.value.toLocaleString()
          trafficStats.value.allowed.change = stats.allowed.change

          protocols.value = statsRes.data.protocols
          topSources.value = statsRes.data.topSources
          timeline.value = statsRes.data.timeline
        }
      } catch (error) {
        console.log('Using default traffic data')
        trafficStats.value.incoming.value = '3.2'
        trafficStats.value.outgoing.value = '2.1'
        trafficStats.value.blocked.value = '847'
        trafficStats.value.allowed.value = '125,456'

        topSources.value = [
          { ip: '192.168.1.100', hostname: 'workstation-01', connections: 15234, bytes: '1.2 GB' },
          { ip: '192.168.1.101', hostname: 'workstation-02', connections: 12456, bytes: '980 MB' },
          { ip: '192.168.1.10', hostname: 'web-server-01', connections: 8901, bytes: '2.1 GB' },
          { ip: '10.0.0.5', hostname: 'admin-pc', connections: 5678, bytes: '450 MB' },
          { ip: '192.168.1.20', hostname: 'db-server-01', connections: 3456, bytes: '890 MB' }
        ]

        timeline.value = Array.from({ length: 24 }, (_, i) => ({
          hour: `${String(i).padStart(2, '0')}:00`,
          incoming: Math.floor(Math.random() * 400) + 100,
          outgoing: Math.floor(Math.random() * 300) + 80,
          blocked: Math.floor(Math.random() * 50) + 10
        }))

        trafficData.value = Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          sourceHostname: `host-${i}`,
          destination: `10.0.0.${Math.floor(Math.random() * 255)}`,
          destHostname: `server-${i % 5}`,
          protocol: ['HTTP', 'HTTPS', 'DNS', 'SSH', 'TCP'][Math.floor(Math.random() * 5)],
          bytes: Math.floor(Math.random() * 50000) + 100,
          action: Math.random() > 0.15 ? 'Allowed' : 'Blocked',
          aiDecision: ['Normal', 'Suspicious', 'Safe', 'Monitored'][Math.floor(Math.random() * 4)],
          aiConfidence: Math.floor(Math.random() * 25) + 75
        }))
      }
      loading.value = false
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('en-US', { hour12: false })
    }

    const formatBytes = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1024 / 1024).toFixed(1) + ' MB'
    }

    const getProtocolSeverity = (protocol) => {
      const severities = { 'HTTPS': 'info', 'HTTP': 'success', 'DNS': 'warn', 'SSH': 'secondary', 'FTP': 'danger' }
      return severities[protocol] || 'secondary'
    }

    const getStatusSeverity = (status) => {
      const severities = { 'Allowed': 'success', 'Blocked': 'danger', 'Monitored': 'warn', 'Rate Limited': 'info' }
      return severities[status] || 'info'
    }

    onMounted(() => {
      fetchTraffic()
      refreshInterval = setInterval(fetchTraffic, 10000)
    })

    onUnmounted(() => {
      clearInterval(refreshInterval)
    })

    return {
      loading,
      trafficData,
      trafficStats,
      protocols,
      topSources,
      timeline,
      maxTraffic,
      fetchTraffic,
      formatTime,
      formatBytes,
      getProtocolSeverity,
      getStatusSeverity
    }
  }
}
</script>

<style scoped>
.traffic-view {
  max-width: 1500px;
  margin: 0 auto;
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
  font-family: 'Orbitron', monospace;
  margin-bottom: 0.5rem;
}

.header-content h1 i {
  color: var(--fire-orange);
}

.header-content p {
  color: var(--text-secondary);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--success);
  border-radius: 20px;
  font-weight: 700;
  color: var(--success);
  text-transform: uppercase;
  font-size: 0.85rem;
}

.pulse {
  width: 10px;
  height: 10px;
  background: var(--success);
  border-radius: 50%;
  animation: pulse-animation 1.5s ease-in-out infinite;
}

@keyframes pulse-animation {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  overflow: hidden;
}

.stat-card :deep(.p-card-content) {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 55px;
  height: 55px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 1.5rem;
  color: white;
}

.stat-card.incoming .stat-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
.stat-card.outgoing .stat-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.stat-card.blocked .stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
.stat-card.allowed .stat-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.stat-content {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.stat-value small {
  font-size: 1rem;
  margin-left: 0.25rem;
  opacity: 0.7;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-trend.up { color: var(--success); }
.stat-trend.down { color: var(--danger); }

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.protocol-card h3,
.sources-card h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Orbitron', monospace;
  margin-bottom: 1.5rem;
}

.protocol-card h3 i { color: var(--fire-orange); }
.sources-card h3 i { color: #8b5cf6; }

/* Protocol List */
.protocol-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.protocol-item {
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  align-items: center;
  gap: 1rem;
}

.protocol-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.protocol-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.protocol-name {
  font-weight: 600;
}

.protocol-bar {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.protocol-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.percentage {
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.bytes {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Sources List */
.sources-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.source-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px var(--shadow-color);
}

.source-rank {
  width: 28px;
  height: 28px;
  background: var(--fire-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
}

.source-info {
  flex: 1;
}

.source-info code {
  font-family: 'JetBrains Mono', monospace;
  display: block;
  margin-bottom: 0.15rem;
}

.hostname {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.source-stats {
  text-align: right;
}

.connections {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Timeline */
.timeline-card {
  margin-bottom: 1.5rem;
}

.timeline-card h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Orbitron', monospace;
  margin-bottom: 1.5rem;
}

.timeline-card h3 i {
  color: var(--fire-orange);
}

.timeline-chart {
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 200px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.bar-group .bar {
  width: 8px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: absolute;
  bottom: 25px;
}

.bar-group:hover .bar {
  opacity: 0.8;
  transform: scaleX(1.5);
}

.bar.incoming { background: var(--success); left: 2px; }
.bar.outgoing { background: var(--info); left: 12px; }
.bar.blocked { background: var(--danger); left: 22px; }

.hour-label {
  position: absolute;
  bottom: 0;
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.legend-item .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-item.incoming .dot { background: var(--success); }
.legend-item.outgoing .dot { background: var(--info); }
.legend-item.blocked .dot { background: var(--danger); }

/* Connections Table */
.connections-card {
  overflow: hidden;
}

.connections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.connections-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Orbitron', monospace;
}

.connections-header h3 i {
  color: var(--fire-orange);
}

.time-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  background: rgba(234, 88, 12, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.ip-cell {
  display: flex;
  flex-direction: column;
}

.ip-cell code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.ip-cell small {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.size-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.ai-decision {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.ai-decision i {
  color: var(--fire-orange);
}

.confidence {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .protocol-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .protocol-stats {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
}
</style>
