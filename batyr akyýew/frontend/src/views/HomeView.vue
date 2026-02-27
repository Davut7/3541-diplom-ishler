<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-content">
        <h1>{{ t.home.title }}</h1>
        <p class="subtitle">{{ t.home.subtitle }}</p>
        <p class="description">{{ t.home.description }}</p>
        <div class="hero-buttons">
          <router-link to="/analyzer" class="btn btn-primary">
            <i class="pi pi-search"></i> {{ t.home.startAnalysis }}
          </router-link>
          <router-link to="/logs" class="btn btn-secondary">
            <i class="pi pi-list"></i> {{ t.home.viewLogs }}
          </router-link>
        </div>
      </div>
      <div class="hero-visual">
        <div class="shield-icon">
          <i class="pi pi-shield"></i>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card" v-for="(feature, key) in t.home.features" :key="key">
        <div class="feature-icon" :class="key">
          <i :class="getFeatureIcon(key)"></i>
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </div>
    </section>

    <section class="stats-section">
      <Card>
        <template #content>
          <h2><i class="pi pi-chart-bar"></i> Real-time Statistics</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ stats.totalRequests }}</span>
              <span class="stat-label">Total Requests</span>
            </div>
            <div class="stat-item blocked">
              <span class="stat-value">{{ stats.blocked }}</span>
              <span class="stat-label">Blocked Attacks</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.anomalies }}</span>
              <span class="stat-label">Anomalies Detected</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.accuracy }}</span>
              <span class="stat-label">Detection Accuracy</span>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const stats = ref({
      totalRequests: '1.2M',
      blocked: '15,234',
      anomalies: '2,341',
      accuracy: '98.5%'
    })

    const getFeatureIcon = (key) => {
      const icons = {
        waf: 'pi pi-shield',
        behavioral: 'pi pi-user',
        realtime: 'pi pi-bolt',
        learning: 'pi pi-sync'
      }
      return icons[key] || 'pi pi-star'
    }

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
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 3rem 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.description {
  margin-bottom: 2rem;
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: #f97316;
  color: #f97316;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.shield-icon {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.shield-icon i {
  font-size: 5rem;
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px 10px rgba(249, 115, 22, 0.2); }
}

.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 3rem 0;
}

.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

.feature-icon.waf { background: linear-gradient(135deg, #f97316, #ea580c); }
.feature-icon.behavioral { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.feature-icon.realtime { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.feature-icon.learning { background: linear-gradient(135deg, #22c55e, #16a34a); }

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
  color: #f97316;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #f97316;
}

.stat-item.blocked .stat-value {
  color: #ef4444;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-visual {
    order: -1;
  }

  .hero-buttons {
    justify-content: center;
  }

  .features {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .features, .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
