<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-icon">
        <i class="pi pi-shield"></i>
      </div>
      <h1>{{ t.home.title }}</h1>
      <p class="subtitle">{{ t.home.subtitle }}</p>
      <p class="description">{{ t.home.description }}</p>
      <div class="hero-actions">
        <router-link to="/rules">
          <Button :label="t.home.viewRules" icon="pi pi-list" />
        </router-link>
        <router-link to="/ai">
          <Button :label="t.home.aiEngine" icon="pi pi-microchip-ai" severity="secondary" outlined />
        </router-link>
      </div>
    </section>

    <section class="features">
      <Card v-for="(feature, key) in t.home.features" :key="key" class="feature-card">
        <template #content>
          <div class="feature-icon" :class="getFeatureClass(key)">
            <i :class="getFeatureIcon(key)"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </template>
      </Card>
    </section>

    <section class="stats-section">
      <Card>
        <template #content>
          <h2><i class="pi pi-chart-bar"></i> System Status</h2>
          <div class="stats-grid">
            <div class="stat-item safe">
              <i class="pi pi-check-circle"></i>
              <span class="stat-value">Protected</span>
              <span class="stat-label">AI Status</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.rules }}</span>
              <span class="stat-label">Active Rules</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.blocked }}</span>
              <span class="stat-label">Threats Blocked</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.accuracy }}%</span>
              <span class="stat-label">AI Accuracy</span>
            </div>
          </div>
        </template>
      </Card>
    </section>

    <section class="ai-preview">
      <Card>
        <template #content>
          <h2><i class="pi pi-microchip-ai"></i> AI Threat Detection</h2>
          <div class="detection-grid">
            <div class="detection-item">
              <div class="detection-header">
                <Tag severity="success" value="Normal" />
                <span class="confidence">98%</span>
              </div>
              <p>HTTP traffic to google.com</p>
            </div>
            <div class="detection-item">
              <div class="detection-header">
                <Tag severity="danger" value="Threat" />
                <span class="confidence">95%</span>
              </div>
              <p>Port scan attempt from 185.x.x.x</p>
            </div>
            <div class="detection-item">
              <div class="detection-header">
                <Tag severity="warn" value="Suspicious" />
                <span class="confidence">75%</span>
              </div>
              <p>Unusual outbound traffic pattern</p>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const stats = ref({
      rules: 47,
      blocked: 1234,
      accuracy: 97.5
    })

    let interval

    onMounted(() => {
      interval = setInterval(() => {
        stats.value.blocked += Math.floor(Math.random() * 3)
      }, 5000)
    })

    onUnmounted(() => {
      clearInterval(interval)
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
        ai: 'ai-icon',
        auto: 'auto-icon',
        traffic: 'traffic-icon',
        adapt: 'adapt-icon'
      }
      return classes[key] || ''
    }

    return { stats, getFeatureIcon, getFeatureClass }
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
}

.hero-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.hero-icon i {
  font-size: 3rem;
  color: white;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #06b6d4;
  margin-bottom: 1rem;
}

.description {
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  text-align: center;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.ai-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.auto-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.traffic-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
.adapt-icon { background: linear-gradient(135deg, #f97316, #ea580c); }

.feature-card h3 {
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stats-section,
.ai-preview {
  margin-bottom: 2rem;
}

.stats-section h2,
.ai-preview h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stats-section h2 i { color: #06b6d4; }
.ai-preview h2 i { color: #8b5cf6; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
}

.stat-item.safe {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
}

.stat-item.safe i {
  font-size: 2rem;
  color: #22c55e;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #06b6d4;
}

.stat-item.safe .stat-value {
  color: #22c55e;
  font-size: 1.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.detection-grid {
  display: grid;
  gap: 1rem;
}

.detection-item {
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.detection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.confidence {
  font-weight: 600;
  color: #06b6d4;
}

.detection-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
