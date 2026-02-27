<template>
  <div class="ai-view">
    <div class="page-header">
      <h1>{{ t.ai.title }}</h1>
      <p>{{ t.ai.subtitle }}</p>
    </div>

    <div class="ai-status-row">
      <Card class="model-card">
        <template #content>
          <h3><i class="pi pi-microchip-ai"></i> {{ t.ai.model.title }}</h3>
          <div class="model-info">
            <div class="model-header">
              <div class="model-icon">
                <i class="pi pi-bolt"></i>
              </div>
              <div>
                <h4>{{ t.ai.model.name }}</h4>
                <Tag severity="success" value="Active" />
              </div>
            </div>
            <div class="model-stats">
              <div class="model-stat">
                <span class="label">{{ t.ai.model.accuracy }}</span>
                <span class="value">97.5%</span>
              </div>
              <div class="model-stat">
                <span class="label">{{ t.ai.model.trained }}</span>
                <span class="value">2 hours ago</span>
              </div>
              <div class="model-stat">
                <span class="label">{{ t.ai.model.samples }}</span>
                <span class="value">1.2M</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="learning-card">
        <template #content>
          <h3><i class="pi pi-chart-line"></i> {{ t.ai.learning.title }}</h3>
          <div class="learning-stats">
            <div class="learning-item">
              <div class="learning-icon patterns">
                <i class="pi pi-sitemap"></i>
              </div>
              <div>
                <span class="value">{{ learningStats.patterns }}</span>
                <span class="label">{{ t.ai.learning.patterns }}</span>
              </div>
            </div>
            <div class="learning-item">
              <div class="learning-icon rules">
                <i class="pi pi-list"></i>
              </div>
              <div>
                <span class="value">{{ learningStats.rules }}</span>
                <span class="label">{{ t.ai.learning.rules }}</span>
              </div>
            </div>
            <div class="learning-item">
              <div class="learning-icon threats">
                <i class="pi pi-shield"></i>
              </div>
              <div>
                <span class="value">{{ learningStats.threats }}</span>
                <span class="label">{{ t.ai.learning.threats }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card class="capabilities-card">
      <template #content>
        <h3><i class="pi pi-star"></i> {{ t.ai.capabilities.title }}</h3>
        <div class="capabilities-grid">
          <div v-for="(cap, key) in t.ai.capabilities" :key="key" v-if="key !== 'title'" class="capability-item">
            <div class="capability-icon" :class="getCapabilityClass(key)">
              <i :class="getCapabilityIcon(key)"></i>
            </div>
            <span>{{ cap }}</span>
          </div>
        </div>
      </template>
    </Card>

    <Card class="threats-card">
      <template #content>
        <h3><i class="pi pi-exclamation-triangle"></i> {{ t.ai.threats.title }}</h3>
        <div v-if="threats.length === 0" class="no-threats">
          <i class="pi pi-check-circle"></i>
          <p>{{ t.ai.threats.none }}</p>
        </div>
        <DataTable v-else :value="threats" :rows="5">
          <Column field="type" :header="t.ai.threats.type">
            <template #body="{ data }">
              <Tag :severity="getThreatSeverity(data.severity)" :value="data.type" />
            </template>
          </Column>
          <Column field="source" :header="t.ai.threats.source">
            <template #body="{ data }">
              <code>{{ data.source }}</code>
            </template>
          </Column>
          <Column field="confidence" :header="t.ai.threats.confidence">
            <template #body="{ data }">
              <div class="confidence-bar">
                <ProgressBar :value="data.confidence" :showValue="false" style="height: 8px; width: 100px" />
                <span>{{ data.confidence }}%</span>
              </div>
            </template>
          </Column>
          <Column field="action" :header="t.ai.threats.action">
            <template #body="{ data }">
              <Tag :severity="data.action === 'Blocked' ? 'success' : 'warn'" :value="data.action" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card class="neural-network-card">
      <template #content>
        <h3><i class="pi pi-share-alt"></i> Neural Network Architecture</h3>
        <div class="nn-diagram">
          <div class="nn-layer">
            <span class="layer-label">Input Layer</span>
            <div class="neurons">
              <div class="neuron" v-for="i in 5" :key="'i'+i"></div>
            </div>
            <span class="layer-info">Packet Features</span>
          </div>
          <div class="nn-connections"></div>
          <div class="nn-layer">
            <span class="layer-label">Hidden Layer 1</span>
            <div class="neurons">
              <div class="neuron" v-for="i in 8" :key="'h1'+i"></div>
            </div>
            <span class="layer-info">128 nodes</span>
          </div>
          <div class="nn-connections"></div>
          <div class="nn-layer">
            <span class="layer-label">Hidden Layer 2</span>
            <div class="neurons">
              <div class="neuron" v-for="i in 6" :key="'h2'+i"></div>
            </div>
            <span class="layer-info">64 nodes</span>
          </div>
          <div class="nn-connections"></div>
          <div class="nn-layer">
            <span class="layer-label">Output Layer</span>
            <div class="neurons">
              <div class="neuron output" v-for="i in 3" :key="'o'+i"></div>
            </div>
            <span class="layer-info">Safe / Suspicious / Threat</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const learningStats = ref({
      patterns: '15,234',
      rules: '47',
      threats: '23'
    })

    const threats = ref([
      { type: 'Port Scan', source: '185.125.x.x', confidence: 97, severity: 'high', action: 'Blocked' },
      { type: 'Brute Force', source: '192.168.50.x', confidence: 95, severity: 'high', action: 'Blocked' },
      { type: 'Data Exfiltration', source: 'Internal:10.0.0.25', confidence: 82, severity: 'medium', action: 'Monitored' },
      { type: 'Malware Traffic', source: '203.0.113.x', confidence: 92, severity: 'critical', action: 'Blocked' }
    ])

    const getCapabilityIcon = (key) => {
      const icons = {
        anomaly: 'pi pi-chart-line',
        malware: 'pi pi-bug',
        ddos: 'pi pi-cloud',
        intrusion: 'pi pi-lock',
        behavioral: 'pi pi-user',
        zeroDay: 'pi pi-bolt'
      }
      return icons[key] || 'pi pi-star'
    }

    const getCapabilityClass = (key) => {
      const classes = {
        anomaly: 'cap-blue',
        malware: 'cap-red',
        ddos: 'cap-orange',
        intrusion: 'cap-purple',
        behavioral: 'cap-green',
        zeroDay: 'cap-cyan'
      }
      return classes[key] || 'cap-blue'
    }

    const getThreatSeverity = (severity) => {
      const severities = {
        'critical': 'danger',
        'high': 'warn',
        'medium': 'info',
        'low': 'secondary'
      }
      return severities[severity] || 'info'
    }

    return {
      learningStats,
      threats,
      getCapabilityIcon,
      getCapabilityClass,
      getThreatSeverity
    }
  }
}
</script>

<style scoped>
.ai-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.ai-status-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.model-card h3,
.learning-card h3,
.capabilities-card h3,
.threats-card h3,
.neural-network-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.model-card h3 i { color: #8b5cf6; }
.learning-card h3 i { color: #06b6d4; }
.capabilities-card h3 i { color: #eab308; }
.threats-card h3 i { color: #ef4444; }
.neural-network-card h3 i { color: #22c55e; }

.model-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.model-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-icon i {
  font-size: 1.75rem;
  color: white;
}

.model-header h4 {
  margin-bottom: 0.5rem;
}

.model-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.model-stat {
  text-align: center;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.model-stat .label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.model-stat .value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #8b5cf6;
}

.learning-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.learning-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.learning-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.learning-icon i {
  font-size: 1.25rem;
  color: white;
}

.learning-icon.patterns { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.learning-icon.rules { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.learning-icon.threats { background: linear-gradient(135deg, #ef4444, #dc2626); }

.learning-item .value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
}

.learning-item .label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.capabilities-card,
.threats-card,
.neural-network-card {
  margin-bottom: 1.5rem;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.capability-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capability-icon i {
  color: white;
}

.cap-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.cap-red { background: linear-gradient(135deg, #ef4444, #dc2626); }
.cap-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.cap-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.cap-green { background: linear-gradient(135deg, #22c55e, #16a34a); }
.cap-cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }

.no-threats {
  text-align: center;
  padding: 2rem;
  color: #22c55e;
}

.no-threats i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.confidence-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nn-diagram {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
}

.nn-layer {
  text-align: center;
}

.layer-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.neurons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.neuron {
  width: 20px;
  height: 20px;
  background: #06b6d4;
  border-radius: 50%;
}

.neuron.output {
  background: #22c55e;
}

.layer-info {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.nn-connections {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #06b6d4, #8b5cf6, #22c55e);
  margin: 0 1rem;
}

@media (max-width: 768px) {
  .ai-status-row {
    grid-template-columns: 1fr;
  }

  .capabilities-grid {
    grid-template-columns: 1fr;
  }

  .nn-diagram {
    flex-direction: column;
    gap: 1rem;
  }

  .nn-connections {
    width: 2px;
    height: 30px;
    background: linear-gradient(180deg, #06b6d4, #8b5cf6, #22c55e);
    margin: 0;
  }
}
</style>
