<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="pi pi-shield"></i>
          <span>GAN Security Research</span>
        </div>
        <h1 class="hero-title">{{ t.home.title }}</h1>
        <p class="hero-subtitle">{{ t.home.subtitle }}</p>
        <p class="hero-description">{{ t.home.description }}</p>
        <div class="hero-actions">
          <Button @click="$router.push('/attacks')" icon="pi pi-bolt" :label="t.home.exploreAttacks" class="p-button-lg" />
          <Button @click="$router.push('/defense')" icon="pi pi-shield" :label="t.home.learnDefense" class="p-button-lg p-button-outlined" />
        </div>
      </div>
      <div class="hero-visual">
        <div class="gan-diagram">
          <div class="gan-box generator">
            <i class="pi pi-cog"></i>
            <span>Generator</span>
          </div>
          <div class="gan-arrow"><i class="pi pi-arrow-right"></i></div>
          <div class="gan-box discriminator">
            <i class="pi pi-eye"></i>
            <span>Discriminator</span>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="stat-card" v-for="(stat, i) in stats" :key="i">
        <i :class="stat.icon" class="stat-icon"></i>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </section>

    <section class="features-section">
      <h2 class="section-title">{{ t.home.features.title }}</h2>
      <div class="features-grid">
        <Card v-for="(feature, key) in features" :key="key" class="feature-card">
          <template #content>
            <div class="feature-icon" :style="{ background: feature.color }">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'HomeView',
  props: { t: Object, language: String },
  setup(props) {
    const features = computed(() => ({
      attacks: { icon: 'pi pi-bolt', title: props.t.home.features.attacks.title, desc: props.t.home.features.attacks.desc, color: '#ef4444' },
      defense: { icon: 'pi pi-shield', title: props.t.home.features.defense.title, desc: props.t.home.features.defense.desc, color: '#10b981' },
      simulator: { icon: 'pi pi-play', title: props.t.home.features.simulator.title, desc: props.t.home.features.simulator.desc, color: '#8b5cf6' },
      visualize: { icon: 'pi pi-chart-bar', title: props.t.home.features.visualize.title, desc: props.t.home.features.visualize.desc, color: '#f59e0b' }
    }))

    const stats = computed(() => [
      { icon: 'pi pi-bolt', value: '6+', label: props.t.home.stats.attackTypes },
      { icon: 'pi pi-shield', value: '6+', label: props.t.home.stats.defenseStrategies },
      { icon: 'pi pi-exclamation-triangle', value: '20+', label: props.t.home.stats.vulnerabilities },
      { icon: 'pi pi-check-circle', value: '15+', label: props.t.home.stats.mitigations }
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

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 5px 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 10px 40px rgba(16, 185, 129, 0.5); }
}

@keyframes slideArrow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

.home-view { max-width: 1200px; margin: 0 auto; }

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
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.hero-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions { display: flex; gap: 1rem; }

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gan-diagram {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.gan-box {
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  min-width: 120px;
  transition: all 0.3s ease;
}

.gan-box:hover {
  transform: scale(1.1);
}

.gan-box i { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.gan-box.generator { background: #10b981; color: white; animation: glow 3s ease-in-out infinite; }
.gan-box.discriminator { background: #ef4444; color: white; box-shadow: 0 5px 20px rgba(239, 68, 68, 0.3); }
.gan-arrow { font-size: 2rem; color: var(--primary-color); animation: slideArrow 1.5s ease-in-out infinite; }

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
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s ease;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.stat-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.stat-icon { font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem; }
.stat-value { font-size: 2rem; font-weight: 700; }
.stat-label { color: var(--text-secondary); font-size: 0.9rem; }

.features-section { padding: 3rem 0; }
.section-title { text-align: center; font-size: 2rem; margin-bottom: 2rem; }

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  text-align: center;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s ease;
}

.feature-card:nth-child(1) { animation-delay: 0.4s; }
.feature-card:nth-child(2) { animation-delay: 0.5s; }
.feature-card:nth-child(3) { animation-delay: 0.6s; }
.feature-card:nth-child(4) { animation-delay: 0.7s; }

.feature-card:hover { transform: translateY(-10px); }

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(5deg);
}

.feature-icon i { font-size: 1.5rem; color: white; }
.feature-card h3 { font-size: 1rem; margin-bottom: 0.5rem; }
.feature-card p { color: var(--text-secondary); font-size: 0.85rem; }

@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; text-align: center; }
  .hero-visual { display: none; }
  .hero-actions { justify-content: center; }
  .stats-section, .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero { padding: 1.5rem 0; gap: 2rem; }
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1.1rem; }
  .hero-actions { flex-direction: column; align-items: center; }
  .hero-actions :deep(.p-button) { width: 100%; }
  .section-title { font-size: 1.5rem; }
  .stats-section { gap: 1rem; padding: 1rem 0; }
  .stat-card { padding: 1rem; }
  .stat-icon { font-size: 1.5rem; }
  .stat-value { font-size: 1.5rem; }
  .features-section { padding: 1.5rem 0; }
  .features-grid { gap: 1rem; }
}

@media (max-width: 480px) {
  .stats-section { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr; }
  .hero-title { font-size: 1.6rem; }
  .hero-badge { font-size: 0.75rem; padding: 0.4rem 0.75rem; }
}
</style>
