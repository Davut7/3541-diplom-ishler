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
        <router-link to="/attack-lab">
          <Button :label="t.home.tryAttackLab" icon="pi pi-bolt" severity="danger" />
        </router-link>
        <router-link to="/defense">
          <Button :label="t.home.learnDefense" icon="pi pi-shield" severity="success" outlined />
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

    <section class="warning-section">
      <Card class="warning-card">
        <template #content>
          <div class="warning-content">
            <i class="pi pi-exclamation-triangle"></i>
            <div>
              <h3>Educational Purposes Only</h3>
              <p>This platform is designed for learning and authorized security testing only. Never use these techniques on systems without explicit permission.</p>
            </div>
          </div>
        </template>
      </Card>
    </section>

    <section class="stats-section">
      <Card>
        <template #content>
          <h2><i class="pi pi-chart-bar"></i> XSS Statistics</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">#7</span>
              <span class="stat-label">OWASP Top 10</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">40%</span>
              <span class="stat-label">of Web Attacks</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">75%</span>
              <span class="stat-label">Sites Vulnerable</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">$3.9M</span>
              <span class="stat-label">Avg. Breach Cost</span>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script>
export default {
  props: { t: Object, language: String },
  setup() {
    const getFeatureIcon = (key) => {
      const icons = {
        attack: 'pi pi-bolt',
        defense: 'pi pi-shield',
        scanner: 'pi pi-search',
        learn: 'pi pi-book'
      }
      return icons[key] || 'pi pi-star'
    }

    const getFeatureClass = (key) => {
      const classes = {
        attack: 'attack-icon',
        defense: 'defense-icon',
        scanner: 'scanner-icon',
        learn: 'learn-icon'
      }
      return classes[key] || ''
    }

    return { getFeatureIcon, getFeatureClass }
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
  background: linear-gradient(135deg, #f97316, #ea580c);
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
  color: #f97316;
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

.attack-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.defense-icon {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.scanner-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.learn-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.feature-card h3 {
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.warning-section {
  margin-bottom: 2rem;
}

.warning-card {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1));
  border: 1px solid #f97316;
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.warning-content > i {
  font-size: 2.5rem;
  color: #f97316;
}

.warning-content h3 {
  color: #f97316;
  margin-bottom: 0.25rem;
}

.warning-content p {
  color: var(--text-secondary);
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
  color: #f97316;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .warning-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
