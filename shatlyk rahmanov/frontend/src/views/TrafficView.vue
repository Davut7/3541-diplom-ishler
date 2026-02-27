<template>
  <div class="traffic-view">
    <div class="page-header">
      <h1>{{ t.traffic.title }}</h1>
      <p>{{ t.traffic.subtitle }}</p>
    </div>

    <div class="stats-row">
      <Card v-for="(stat, key) in stats" :key="key" class="stat-card">
        <template #content>
          <div class="stat-content" :class="key">
            <i :class="getStatIcon(key)"></i>
            <div>
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ t.traffic.stats[key] }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="charts-row">
      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-chart-pie"></i> {{ t.traffic.protocols }}</h3>
          <div class="protocol-bars">
            <div v-for="(value, protocol) in protocols" :key="protocol" class="protocol-item">
              <span class="protocol-name">{{ protocol }}</span>
              <div class="protocol-bar-container">
                <div class="protocol-bar" :style="{ width: value + '%', background: getProtocolColor(protocol) }"></div>
              </div>
              <span class="protocol-value">{{ value }}%</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="chart-card">
        <template #content>
          <h3><i class="pi pi-users"></i> {{ t.traffic.topSources }}</h3>
          <div class="top-list">
            <div v-for="(source, i) in topSources" :key="i" class="top-item">
              <span class="rank">{{ i + 1 }}</span>
              <code>{{ source.ip }}</code>
              <span class="count">{{ source.count }} requests</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card class="connections-card">
      <template #content>
        <h3><i class="pi pi-list"></i> {{ t.traffic.recentConnections }}</h3>
        <DataTable :value="connections" :paginator="true" :rows="10" stripedRows>
          <Column field="time" :header="t.traffic.columns.time" style="width: 12%"></Column>
          <Column field="source" :header="t.traffic.columns.source" style="width: 18%">
            <template #body="{ data }">
              <code>{{ data.source }}</code>
            </template>
          </Column>
          <Column field="dest" :header="t.traffic.columns.dest" style="width: 18%">
            <template #body="{ data }">
              <code>{{ data.dest }}</code>
            </template>
          </Column>
          <Column field="protocol" :header="t.traffic.columns.protocol" style="width: 12%">
            <template #body="{ data }">
              <Tag :value="data.protocol" severity="info" />
            </template>
          </Column>
          <Column field="status" :header="t.traffic.columns.status" style="width: 15%">
            <template #body="{ data }">
              <Tag :severity="getStatusSeverity(data.status)" :value="data.status" />
            </template>
          </Column>
          <Column field="aiDecision" :header="t.traffic.columns.aiDecision" style="width: 25%">
            <template #body="{ data }">
              <div class="ai-decision">
                <i class="pi pi-microchip-ai"></i>
                <span>{{ data.aiDecision }}</span>
                <Badge :value="data.confidence + '%'" :severity="getConfidenceSeverity(data.confidence)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const stats = ref({
      incoming: { value: '2.5 GB' },
      outgoing: { value: '1.8 GB' },
      blocked: { value: '1,234' },
      allowed: { value: '45,678' }
    })

    const protocols = ref({
      'HTTP/HTTPS': 65,
      'DNS': 15,
      'SSH': 8,
      'FTP': 5,
      'Other': 7
    })

    const topSources = ref([
      { ip: '192.168.1.100', count: 5234 },
      { ip: '10.0.0.50', count: 3456 },
      { ip: '172.16.0.25', count: 2345 },
      { ip: '8.8.8.8', count: 1234 },
      { ip: '1.1.1.1', count: 876 }
    ])

    const connections = ref([
      { time: '14:32:05', source: '192.168.1.100:54321', dest: '8.8.8.8:443', protocol: 'HTTPS', status: 'Allowed', aiDecision: 'Normal traffic', confidence: 98 },
      { time: '14:32:04', source: '185.125.x.x:12345', dest: '10.0.0.5:22', protocol: 'SSH', status: 'Blocked', aiDecision: 'Brute force attempt', confidence: 95 },
      { time: '14:32:03', source: '192.168.1.50:45678', dest: 'google.com:443', protocol: 'HTTPS', status: 'Allowed', aiDecision: 'Normal traffic', confidence: 99 },
      { time: '14:32:02', source: '10.0.0.25:33333', dest: '192.168.1.1:53', protocol: 'DNS', status: 'Allowed', aiDecision: 'DNS query', confidence: 100 },
      { time: '14:32:01', source: '192.168.50.x:9999', dest: 'malware.com:80', protocol: 'HTTP', status: 'Blocked', aiDecision: 'Malware communication', confidence: 92 },
      { time: '14:32:00', source: '172.16.0.10:22222', dest: '10.0.0.1:3389', protocol: 'RDP', status: 'Allowed', aiDecision: 'Internal RDP', confidence: 85 },
      { time: '14:31:59', source: 'External:Random', dest: 'Internal:1-1024', protocol: 'TCP', status: 'Blocked', aiDecision: 'Port scan detected', confidence: 97 },
      { time: '14:31:58', source: '192.168.1.75:11111', dest: 'api.service.com:443', protocol: 'HTTPS', status: 'Allowed', aiDecision: 'API call', confidence: 94 }
    ])

    let interval

    onMounted(() => {
      interval = setInterval(() => {
        stats.value.blocked.value = (parseInt(stats.value.blocked.value.replace(',', '')) + Math.floor(Math.random() * 3)).toLocaleString()
        stats.value.allowed.value = (parseInt(stats.value.allowed.value.replace(',', '')) + Math.floor(Math.random() * 10)).toLocaleString()
      }, 3000)
    })

    onUnmounted(() => {
      clearInterval(interval)
    })

    const getStatIcon = (key) => {
      const icons = {
        incoming: 'pi pi-download',
        outgoing: 'pi pi-upload',
        blocked: 'pi pi-times-circle',
        allowed: 'pi pi-check-circle'
      }
      return icons[key]
    }

    const getProtocolColor = (protocol) => {
      const colors = {
        'HTTP/HTTPS': '#06b6d4',
        'DNS': '#8b5cf6',
        'SSH': '#22c55e',
        'FTP': '#f97316',
        'Other': '#6b7280'
      }
      return colors[protocol] || '#6b7280'
    }

    const getStatusSeverity = (status) => {
      return status === 'Allowed' ? 'success' : 'danger'
    }

    const getConfidenceSeverity = (confidence) => {
      if (confidence >= 90) return 'success'
      if (confidence >= 75) return 'warn'
      return 'danger'
    }

    return {
      stats,
      protocols,
      topSources,
      connections,
      getStatIcon,
      getProtocolColor,
      getStatusSeverity,
      getConfidenceSeverity
    }
  }
}
</script>

<style scoped>
.traffic-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.stats-row {
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

.stat-content i {
  font-size: 2rem;
}

.stat-content.incoming i { color: #22c55e; }
.stat-content.outgoing i { color: #3b82f6; }
.stat-content.blocked i { color: #ef4444; }
.stat-content.allowed i { color: #06b6d4; }

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  color: var(--text-secondary);
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chart-card h3 i {
  color: #06b6d4;
}

.protocol-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.protocol-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.protocol-name {
  width: 100px;
  font-weight: 500;
}

.protocol-bar-container {
  flex: 1;
  height: 20px;
  background: var(--bg-primary);
  border-radius: 10px;
  overflow: hidden;
}

.protocol-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s;
}

.protocol-value {
  width: 50px;
  text-align: right;
  color: var(--text-secondary);
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.rank {
  width: 24px;
  height: 24px;
  background: #06b6d4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

.top-item code {
  flex: 1;
  font-size: 0.9rem;
}

.count {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.connections-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.connections-card h3 i {
  color: #06b6d4;
}

.connections-card code {
  font-size: 0.85rem;
}

.ai-decision {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-decision i {
  color: #8b5cf6;
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
