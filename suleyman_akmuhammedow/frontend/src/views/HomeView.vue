<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="pi pi-shield"></i>
          <span>OSINT Intelligence Platform</span>
        </div>
        <h1 class="hero-title">{{ t.home.title }}</h1>
        <p class="hero-subtitle">{{ t.home.subtitle }}</p>
        <p class="hero-description">{{ t.home.description }}</p>
        <div class="hero-actions">
          <Button @click="$router.push('/analyze')" icon="pi pi-search" :label="t.home.startAnalysis" class="p-button-lg" />
          <Button @click="$router.push('/history')" icon="pi pi-history" :label="t.home.viewHistory" class="p-button-lg p-button-outlined" />
        </div>
      </div>
      <div class="hero-visual">
        <div class="cyber-grid">
          <div class="grid-item" v-for="i in 9" :key="i"></div>
        </div>
        <div class="floating-icons">
          <i class="pi pi-globe icon-float"></i>
          <i class="pi pi-server icon-float"></i>
          <i class="pi pi-database icon-float"></i>
          <i class="pi pi-lock icon-float"></i>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <i :class="stat.icon" class="stat-icon"></i>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">{{ t.home.features.title }}</h2>
      <div class="features-grid">
        <Card v-for="(feature, key) in features" :key="key" class="feature-card">
          <template #content>
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </template>
        </Card>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>{{ language === 'en' ? 'Ready to Start?' : 'Başlamaga taýynmy?' }}</h2>
        <p>{{ language === 'en' ? 'Begin your OSINT analysis journey today' : 'OSINT derňew syýahatyňyzy şu gün başlaň' }}</p>
        <Button @click="$router.push('/analyze')" icon="pi pi-arrow-right" :label="t.home.startAnalysis" class="p-button-lg" />
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'HomeView',
  props: {
    t: Object,
    language: String
  },
  setup(props) {
    const features = computed(() => ({
      dns: {
        icon: 'pi pi-globe',
        title: props.t.home.features.dns.title,
        desc: props.t.home.features.dns.desc
      },
      whois: {
        icon: 'pi pi-id-card',
        title: props.t.home.features.whois.title,
        desc: props.t.home.features.whois.desc
      },
      geo: {
        icon: 'pi pi-map-marker',
        title: props.t.home.features.geo.title,
        desc: props.t.home.features.geo.desc
      },
      ports: {
        icon: 'pi pi-server',
        title: props.t.home.features.ports.title,
        desc: props.t.home.features.ports.desc
      },
      risk: {
        icon: 'pi pi-exclamation-triangle',
        title: props.t.home.features.risk.title,
        desc: props.t.home.features.risk.desc
      },
      reports: {
        icon: 'pi pi-file-export',
        title: props.t.home.features.reports.title,
        desc: props.t.home.features.reports.desc
      }
    }))

    const stats = computed(() => [
      { icon: 'pi pi-search', value: '1000+', label: props.t.home.stats.scansPerformed },
      { icon: 'pi pi-sitemap', value: '500+', label: props.t.home.stats.targetsAnalyzed },
      { icon: 'pi pi-exclamation-circle', value: '250+', label: props.t.home.stats.risksIdentified },
      { icon: 'pi pi-file', value: '100+', label: props.t.home.stats.reportsGenerated }
    ])

    return { features, stats }
  }
}
</script>

<style scoped>
/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 3rem 0;
}

.hero-content {
  animation: fadeInLeft 0.8s ease-out;
}

.hero-visual {
  animation: fadeInRight 0.8s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: var(--text-primary);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 500;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cyber-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  opacity: 0.5;
}

.grid-item {
  width: 80px;
  height: 80px;
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  animation: pulse 2s ease-in-out infinite;
}

.grid-item:nth-child(odd) {
  animation-delay: 0.5s;
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.icon-float {
  position: absolute;
  font-size: 2rem;
  color: var(--primary-color);
  animation: float 3s ease-in-out infinite;
}

.icon-float:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
.icon-float:nth-child(2) { top: 20%; right: 20%; animation-delay: 0.5s; }
.icon-float:nth-child(3) { bottom: 20%; left: 30%; animation-delay: 1s; }
.icon-float:nth-child(4) { bottom: 30%; right: 30%; animation-delay: 1.5s; }

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 2rem 0;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.stat-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.stat-card:hover .stat-icon {
  transform: scale(1.2);
}

.stat-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.features-section {
  padding: 3rem 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out both;
}

.feature-card:nth-child(1) { animation-delay: 0.5s; }
.feature-card:nth-child(2) { animation-delay: 0.6s; }
.feature-card:nth-child(3) { animation-delay: 0.7s; }
.feature-card:nth-child(4) { animation-delay: 0.8s; }
.feature-card:nth-child(5) { animation-delay: 0.9s; }
.feature-card:nth-child(6) { animation-delay: 1.0s; }

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.feature-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.cta-section {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  margin: 3rem 0;
  animation: fadeInUp 0.8s ease-out 1.1s both;
  transition: all 0.3s ease;
}

.cta-section:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}

.cta-content h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.cta-content p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 1.5rem;
}

.cta-content .p-button {
  background: white;
  color: var(--primary-color);
  border: none;
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-visual {
    display: none;
  }

  .hero-actions {
    justify-content: center;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .stats-section {
    grid-template-columns: 1fr 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
