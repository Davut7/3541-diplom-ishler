<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-icon">
        <i class="pi pi-sitemap"></i>
      </div>
      <h1>{{ t.home.title }}</h1>
      <p class="subtitle">{{ t.home.subtitle }}</p>
      <p class="description">{{ t.home.description }}</p>
      <div class="hero-actions">
        <router-link to="/capture">
          <Button :label="t.home.startCapture" icon="pi pi-play" />
        </router-link>
        <router-link to="/protocols">
          <Button :label="t.home.viewProtocols" icon="pi pi-list" severity="secondary" outlined />
        </router-link>
      </div>
    </section>

    <section class="features">
      <Card v-for="(feature, key) in t.home.features" :key="key" class="feature-card">
        <template #content>
          <div class="feature-icon">
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
          <h2><i class="pi pi-chart-bar"></i> Network Statistics Demo</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ stats.packets }}</span>
              <span class="stat-label">Packets/sec</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.bandwidth }}</span>
              <span class="stat-label">Bandwidth</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.connections }}</span>
              <span class="stat-label">Active Connections</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.alerts }}</span>
              <span class="stat-label">Alerts</span>
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
      packets: 0,
      bandwidth: '0 KB/s',
      connections: 0,
      alerts: 0
    })

    let interval

    const updateStats = () => {
      stats.value = {
        packets: Math.floor(Math.random() * 1000) + 500,
        bandwidth: (Math.random() * 10 + 1).toFixed(2) + ' MB/s',
        connections: Math.floor(Math.random() * 50) + 10,
        alerts: Math.floor(Math.random() * 5)
      }
    }

    const getFeatureIcon = (key) => {
      const icons = {
        capture: 'pi pi-download',
        analyze: 'pi pi-search',
        protocols: 'pi pi-code',
        security: 'pi pi-shield'
      }
      return icons[key] || 'pi pi-star'
    }

    onMounted(() => {
      updateStats()
      interval = setInterval(updateStats, 2000)
    })

    onUnmounted(() => {
      clearInterval(interval)
    })

    return { stats, getFeatureIcon }
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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
  color: #3b82f6;
  margin-bottom: 1rem;
}

.description {
  color: var(--text-secondary);
  max-width: 600px;
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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

.feature-card h3 {
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stats-section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stats-section h2 i {
  color: #3b82f6;
}

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

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
