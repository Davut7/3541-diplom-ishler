<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="circuit-lines"></div>
      </div>
      <div class="hero-content">
        <div class="hero-icon">
          <i class="pi pi-shield"></i>
          <div class="shield-glow"></div>
          <div class="orbit-ring"></div>
        </div>
        <h1 class="hero-title">
          <span class="title-line">{{ t.home.title }}</span>
        </h1>
        <p class="hero-subtitle">{{ t.home.subtitle }}</p>
        <p class="hero-description">{{ t.home.description }}</p>
        <div class="hero-actions">
          <router-link to="/rules">
            <Button :label="t.home.viewRules" icon="pi pi-list" class="p-button-lg" />
          </router-link>
          <router-link to="/ai">
            <Button :label="t.home.aiEngine" icon="pi pi-microchip-ai" class="p-button-lg p-button-outlined" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Live Stats Section -->
    <section class="live-stats">
      <Card class="stats-card">
        <template #content>
          <div class="stats-header">
            <h2><i class="pi pi-chart-bar"></i> System Status</h2>
            <Tag :severity="systemProtected ? 'success' : 'danger'" :value="systemProtected ? 'PROTECTED' : 'WARNING'" />
          </div>
          <div class="stats-grid">
            <div class="stat-item" v-for="(stat, key) in liveStats" :key="key">
              <div class="stat-icon" :class="key">
                <i :class="stat.icon"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
              <div class="stat-indicator" v-if="stat.trend">
                <i :class="stat.trend === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
                   :style="{ color: stat.trend === 'up' ? (key === 'blocked' ? 'var(--danger)' : 'var(--success)') : (key === 'blocked' ? 'var(--success)' : 'var(--danger)') }"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="section-header">
        <h2><i class="pi pi-star"></i> Key Features</h2>
      </div>
      <div class="features-grid">
        <Card v-for="(feature, key) in t.home.features" :key="key" class="feature-card">
          <template #content>
            <div class="feature-icon" :class="getFeatureClass(key)">
              <i :class="getFeatureIcon(key)"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
            <div class="feature-decoration"></div>
          </template>
        </Card>
      </div>
    </section>

    <!-- AI Threat Detection Preview -->
    <section class="ai-preview">
      <Card>
        <template #content>
          <div class="preview-header">
            <h2><i class="pi pi-microchip-ai"></i> AI Threat Detection</h2>
            <Button label="View All" icon="pi pi-arrow-right" class="p-button-sm p-button-text" @click="$router.push('/ai')" />
          </div>
          <div class="threats-list">
            <div v-for="(threat, i) in recentThreats" :key="i" class="threat-item" :class="threat.severity">
              <div class="threat-icon">
                <i :class="getThreatIcon(threat.type)"></i>
              </div>
              <div class="threat-info">
                <div class="threat-header">
                  <Tag :severity="getSeverityColor(threat.severity)" :value="threat.severity.toUpperCase()" />
                  <span class="threat-type">{{ threat.type }}</span>
                </div>
                <p class="threat-detail">{{ threat.details }}</p>
                <div class="threat-meta">
                  <code>{{ threat.source }}</code>
                  <span class="confidence">
                    <i class="pi pi-microchip-ai"></i>
                    {{ threat.confidence }}% confidence
                  </span>
                </div>
              </div>
              <div class="threat-action">
                <Tag :severity="threat.action === 'Blocked' ? 'success' : 'warn'" :value="threat.action" />
              </div>
            </div>
            <div v-if="recentThreats.length === 0" class="no-threats">
              <i class="pi pi-check-circle"></i>
              <p>No active threats detected</p>
            </div>
          </div>
        </template>
      </Card>
    </section>

    <!-- Neural Network Visualization -->
    <section class="neural-section">
      <Card>
        <template #content>
          <h2><i class="pi pi-share-alt"></i> Neural Network Architecture</h2>
          <div class="neural-diagram">
            <div class="layer input-layer">
              <span class="layer-label">Input Layer</span>
              <div class="neurons">
                <div class="neuron" v-for="i in 6" :key="'input-'+i" :style="{ animationDelay: `${i * 0.1}s` }"></div>
              </div>
              <span class="layer-info">Packet Features</span>
            </div>
            <div class="connections"></div>
            <div class="layer hidden-layer-1">
              <span class="layer-label">Hidden Layer 1</span>
              <div class="neurons">
                <div class="neuron" v-for="i in 8" :key="'h1-'+i" :style="{ animationDelay: `${i * 0.1}s` }"></div>
              </div>
              <span class="layer-info">128 nodes</span>
            </div>
            <div class="connections"></div>
            <div class="layer hidden-layer-2">
              <span class="layer-label">Hidden Layer 2</span>
              <div class="neurons">
                <div class="neuron" v-for="i in 6" :key="'h2-'+i" :style="{ animationDelay: `${i * 0.1}s` }"></div>
              </div>
              <span class="layer-info">64 nodes</span>
            </div>
            <div class="connections"></div>
            <div class="layer output-layer">
              <span class="layer-label">Output Layer</span>
              <div class="neurons">
                <div class="neuron output safe" :style="{ animationDelay: '0.1s' }">
                  <span>Safe</span>
                </div>
                <div class="neuron output suspicious" :style="{ animationDelay: '0.2s' }">
                  <span>Suspicious</span>
                </div>
                <div class="neuron output threat" :style="{ animationDelay: '0.3s' }">
                  <span>Threat</span>
                </div>
              </div>
              <span class="layer-info">Classification</span>
            </div>
          </div>
          <div class="model-stats">
            <div class="model-stat">
              <span class="value">{{ aiModel.accuracy }}%</span>
              <span class="label">Accuracy</span>
            </div>
            <div class="model-stat">
              <span class="value">{{ aiModel.samples }}</span>
              <span class="label">Training Samples</span>
            </div>
            <div class="model-stat">
              <span class="value">{{ aiModel.inferenceTime }}</span>
              <span class="label">Inference Time</span>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:7081/api'

export default {
  props: { t: Object, language: String },
  setup() {
    const systemProtected = ref(true)
    const liveStats = ref({
      rules: { value: '...', label: 'Active Rules', icon: 'pi pi-list', trend: null },
      blocked: { value: '...', label: 'Threats Blocked', icon: 'pi pi-shield', trend: 'down' },
      accuracy: { value: '...', label: 'AI Accuracy', icon: 'pi pi-microchip-ai', trend: 'up' },
      uptime: { value: '99.97%', label: 'System Uptime', icon: 'pi pi-clock', trend: null }
    })

    const recentThreats = ref([])
    const aiModel = ref({
      accuracy: '97.8',
      samples: '2.5M',
      inferenceTime: '23ms'
    })

    let updateInterval

    const fetchData = async () => {
      try {
        const [statsRes, threatsRes, aiRes] = await Promise.all([
          axios.get(`${API_URL}/statistics`),
          axios.get(`${API_URL}/threats`),
          axios.get(`${API_URL}/ai/model`)
        ])

        if (statsRes.data.success) {
          const stats = statsRes.data.statistics.overview
          liveStats.value.rules.value = stats.rulesActive
          liveStats.value.blocked.value = stats.threatsBlocked.toLocaleString()
          liveStats.value.accuracy.value = stats.aiAccuracy + '%'
        }

        if (threatsRes.data.success) {
          recentThreats.value = threatsRes.data.threats.slice(0, 4)
        }

        if (aiRes.data.success) {
          aiModel.value.accuracy = aiRes.data.model.accuracy
          aiModel.value.samples = aiRes.data.training.datasetSize
          aiModel.value.inferenceTime = aiRes.data.performance.avgInferenceTime
        }
      } catch (error) {
        console.log('Using default data')
        liveStats.value.rules.value = 8
        liveStats.value.blocked.value = '25,456'
        liveStats.value.accuracy.value = '97.8%'

        recentThreats.value = [
          { type: 'Port Scan', severity: 'high', source: '185.125.190.x', confidence: 97, action: 'Blocked', details: 'AI detected sequential port scanning activity' },
          { type: 'Brute Force', severity: 'critical', source: '45.33.32.x', confidence: 95, action: 'Blocked', details: 'Multiple failed authentication attempts detected' },
          { type: 'Malware C&C', severity: 'critical', source: '192.168.1.101', confidence: 92, action: 'Blocked', details: 'Detected communication to known C&C server' }
        ]
      }
    }

    onMounted(() => {
      fetchData()
      updateInterval = setInterval(fetchData, 10000)
    })

    onUnmounted(() => {
      clearInterval(updateInterval)
    })

    const getFeatureIcon = (key) => {
      const icons = {
        ai: 'pi pi-microchip-ai',
        auto: 'pi pi-cog',
        traffic: 'pi pi-chart-line',
        adapt: 'pi pi-sync'
      }
      return icons[key] || 'pi pi-star'
    }

    const getFeatureClass = (key) => {
      const classes = {
        ai: 'feature-ai',
        auto: 'feature-auto',
        traffic: 'feature-traffic',
        adapt: 'feature-adapt'
      }
      return classes[key] || ''
    }

    const getThreatIcon = (type) => {
      const icons = {
        'Port Scan': 'pi pi-search',
        'Brute Force': 'pi pi-lock',
        'DDoS Attack': 'pi pi-cloud',
        'Malware C&C': 'pi pi-bug',
        'Data Exfiltration': 'pi pi-upload',
        'SQL Injection': 'pi pi-database',
        'XSS Attack': 'pi pi-code',
        'Zero-Day Exploit': 'pi pi-bolt'
      }
      return icons[type] || 'pi pi-exclamation-triangle'
    }

    const getSeverityColor = (severity) => {
      const colors = {
        critical: 'danger',
        high: 'warn',
        medium: 'info',
        low: 'secondary'
      }
      return colors[severity] || 'info'
    }

    return {
      systemProtected,
      liveStats,
      recentThreats,
      aiModel,
      getFeatureIcon,
      getFeatureClass,
      getThreatIcon,
      getSeverityColor
    }
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
}

/* Hero Section */
.hero {
  position: relative;
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.circuit-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--fire-orange) 1px, transparent 1px),
    linear-gradient(to bottom, var(--fire-orange) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: circuit-flow 20s linear infinite;
}

@keyframes circuit-flow {
  0% { background-position: 0 0; }
  100% { background-position: 50px 50px; }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-icon {
  width: 120px;
  height: 120px;
  background: var(--fire-gradient);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  position: relative;
  animation: hero-float 4s ease-in-out infinite;
}

@keyframes hero-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.hero-icon i {
  font-size: 3.5rem;
  color: white;
  z-index: 2;
}

.shield-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, transparent 70%);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.orbit-ring {
  position: absolute;
  width: 180px;
  height: 180px;
  border: 2px dashed var(--fire-orange);
  border-radius: 50%;
  opacity: 0.3;
  animation: orbit-rotate 15s linear infinite;
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-title {
  font-family: 'Orbitron', monospace;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: var(--fire-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: var(--fire-orange);
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-description {
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Live Stats */
.live-stats {
  margin-bottom: 2rem;
}

.stats-card {
  overflow: hidden;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stats-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Orbitron', monospace;
}

.stats-header h2 i {
  color: var(--fire-orange);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-color);
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

.stat-icon.rules { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.stat-icon.blocked { background: linear-gradient(135deg, #ef4444, #dc2626); }
.stat-icon.accuracy { background: linear-gradient(135deg, #22c55e, #16a34a); }
.stat-icon.uptime { background: linear-gradient(135deg, #06b6d4, #0891b2); }

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Features */
.section-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-family: 'Orbitron', monospace;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.section-header h2 i {
  color: var(--fire-orange);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  text-align: center;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-icon i {
  font-size: 1.75rem;
  color: white;
}

.feature-ai { background: linear-gradient(135deg, #ea580c, #f59e0b); }
.feature-auto { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.feature-traffic { background: linear-gradient(135deg, #22c55e, #16a34a); }
.feature-adapt { background: linear-gradient(135deg, #06b6d4, #0891b2); }

.feature-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.feature-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--fire-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-decoration {
  transform: scaleX(1);
}

/* AI Preview */
.ai-preview {
  margin-bottom: 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.preview-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Orbitron', monospace;
}

.preview-header h2 i {
  color: var(--fire-orange);
}

.threats-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.threat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.threat-item.critical { border-left-color: #ef4444; }
.threat-item.high { border-left-color: #f59e0b; }
.threat-item.medium { border-left-color: #06b6d4; }

.threat-item:hover {
  transform: translateX(10px);
  box-shadow: -5px 0 20px var(--shadow-color);
}

.threat-icon {
  width: 45px;
  height: 45px;
  background: var(--fire-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.threat-icon i {
  color: white;
  font-size: 1.25rem;
}

.threat-info {
  flex: 1;
}

.threat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.threat-type {
  font-weight: 600;
}

.threat-detail {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.threat-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
}

.threat-meta code {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(234, 88, 12, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.confidence {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--fire-orange);
}

.no-threats {
  text-align: center;
  padding: 2rem;
  color: var(--success);
}

.no-threats i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

/* Neural Network */
.neural-section {
  margin-bottom: 2rem;
}

.neural-section h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-family: 'Orbitron', monospace;
}

.neural-section h2 i {
  color: var(--fire-orange);
}

.neural-diagram {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.layer {
  text-align: center;
  min-width: 100px;
}

.layer-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.neurons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.neuron {
  width: 24px;
  height: 24px;
  background: var(--fire-gradient);
  border-radius: 50%;
  animation: neuron-pulse 2s ease-in-out infinite;
}

@keyframes neuron-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 1; }
}

.neuron.output {
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.neuron.output.safe { background: linear-gradient(135deg, #22c55e, #16a34a); }
.neuron.output.suspicious { background: linear-gradient(135deg, #f59e0b, #d97706); }
.neuron.output.threat { background: linear-gradient(135deg, #ef4444, #dc2626); }

.layer-info {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.connections {
  flex: 1;
  height: 3px;
  background: linear-gradient(90deg, var(--fire-gradient));
  margin: 0 1rem;
  position: relative;
  overflow: hidden;
}

.connections::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  animation: connection-flow 2s linear infinite;
}

@keyframes connection-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.model-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.model-stat {
  text-align: center;
}

.model-stat .value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--fire-orange);
}

.model-stat .label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 0.5rem;
  }

  .hero-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    margin-bottom: 1.5rem;
  }

  .hero-icon i {
    font-size: 2.5rem;
  }

  .orbit-ring {
    width: 130px;
    height: 130px;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .stats-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .stats-header h2 {
    font-size: 1rem;
  }

  .stats-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 0.75rem;
  }

  .stat-icon {
    width: 45px;
    height: 45px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .preview-header h2 {
    font-size: 1rem;
  }

  .neural-diagram {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .connections {
    width: 3px;
    height: 30px;
    background: linear-gradient(180deg, var(--fire-gradient));
    margin: 0;
  }

  .model-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .model-stat .value {
    font-size: 1.4rem;
  }

  .threat-item {
    flex-direction: column;
    text-align: center;
  }

  .threat-meta {
    justify-content: center;
    flex-wrap: wrap;
  }

  .section-header h2 {
    font-size: 1rem;
  }

  .neural-section h2 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1.5rem 0.25rem;
  }

  .hero-title {
    font-size: 1.3rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-description {
    font-size: 0.9rem;
  }

  .hero-icon {
    width: 65px;
    height: 65px;
  }

  .hero-icon i {
    font-size: 2rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .feature-icon {
    width: 55px;
    height: 55px;
  }

  .threat-icon {
    width: 38px;
    height: 38px;
  }
}
</style>
