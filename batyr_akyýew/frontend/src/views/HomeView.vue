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
import { ref, onMounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const stats = ref({
      totalRequests: '...',
      blocked: '...',
      anomalies: '...',
      accuracy: '...'
    })
    const loading = ref(true)

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/statistics')
        const data = await res.json()
        if (data.success) {
          stats.value = {
            totalRequests: data.statistics.overview.totalRequests.toLocaleString(),
            blocked: data.statistics.overview.blockedRequests.toLocaleString(),
            anomalies: data.statistics.behavioral.anomalousSessions.toLocaleString(),
            accuracy: data.statistics.behavioral.detectionAccuracy
          }
        }
      } catch (e) {
        console.error('Failed to fetch stats:', e)
        stats.value = { totalRequests: 'N/A', blocked: 'N/A', anomalies: 'N/A', accuracy: 'N/A' }
      } finally {
        loading.value = false
      }
    }

    const getFeatureIcon = (key) => {
      const icons = {
        waf: 'pi pi-shield',
        behavioral: 'pi pi-user',
        realtime: 'pi pi-bolt',
        learning: 'pi pi-sync'
      }
      return icons[key] || 'pi pi-star'
    }

    onMounted(fetchStats)

    return { stats, loading, getFeatureIcon }
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

.hero-content {
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero h1 {
  font-size: 2.75rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #06b6d4, #0891b2, #06b6d4);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientFlow 3s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.description {
  margin-bottom: 2rem;
  line-height: 1.8;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
}

.btn-primary:active {
  transform: translateY(-1px) scale(1);
}

.btn-primary i {
  transition: transform 0.3s ease;
}

.btn-primary:hover i {
  transform: rotate(15deg) scale(1.1);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: #06b6d4;
  color: #06b6d4;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: floatIn 1s ease-out;
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

.shield-icon {
  width: 220px;
  height: 220px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 3s infinite ease-in-out, float 6s infinite ease-in-out;
  position: relative;
}

.shield-icon::before {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 3px solid rgba(249, 115, 22, 0.3);
  animation: ripple 2s infinite;
}

.shield-icon::after {
  content: '';
  position: absolute;
  inset: -25px;
  border-radius: 50%;
  border: 2px solid rgba(249, 115, 22, 0.15);
  animation: ripple 2s infinite 0.5s;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.shield-icon i {
  font-size: 5.5rem;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: iconPulse 2s infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4),
                0 10px 40px rgba(249, 115, 22, 0.3);
  }
  50% {
    box-shadow: 0 0 40px 15px rgba(249, 115, 22, 0.2),
                0 15px 50px rgba(249, 115, 22, 0.4);
  }
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
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out both;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--accent);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  transition: all 0.4s ease;
  position: relative;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon i {
  font-size: 1.75rem;
  color: white;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon i {
  transform: scale(1.1);
}

.feature-icon.waf { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.feature-icon.behavioral { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.feature-icon.realtime { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.feature-icon.learning { background: linear-gradient(135deg, #22c55e, #16a34a); }

.feature-card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.feature-card:hover h3 {
  color: var(--accent);
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.stats-section {
  animation: fadeInUp 0.8s ease-out 0.5s both;
}

.stats-section h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.stats-section h2 i {
  color: #06b6d4;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-tertiary));
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.1), transparent);
  transition: left 0.8s ease;
}

.stat-item:hover::before {
  left: 100%;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--accent);
}

.stat-value {
  display: block;
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-value {
  transform: scale(1.1);
}

.stat-item.blocked .stat-value {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: block;
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

  .hero h1 {
    font-size: 2rem;
  }

  .shield-icon {
    width: 160px;
    height: 160px;
  }

  .shield-icon i {
    font-size: 4rem;
  }
}
</style>
