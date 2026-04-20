<template>
  <div class="home-view">
    <section class="hero">
      <div class="biohazard-hero-icon">☣</div>
      <div class="hero-badge"><span class="hazard-symbol">☣</span> Advanced Detection</div>
      <h1>{{ t.home.title }}</h1>
      <p class="subtitle">{{ t.home.subtitle }}</p>
      <p class="description">{{ t.home.description }}</p>
      <div class="hero-actions">
        <Button @click="$router.push('/scan')" icon="pi pi-search" :label="t.home.startScan" class="p-button-lg scan-btn" />
        <Button @click="$router.push('/techniques')" icon="pi pi-book" :label="t.home.learnMore" class="p-button-lg p-button-outlined learn-btn" />
      </div>
    </section>

    <section class="warning-banner">
      <div class="warning-content">
        <span class="warning-icon">⚠</span>
        <span>THREAT DETECTION ACTIVE</span>
        <span class="warning-icon">⚠</span>
      </div>
    </section>

    <section class="stats-section">
      <div class="stat-card" v-for="(stat, i) in stats" :key="i">
        <div class="stat-hazard-corner"></div>
        <i :class="stat.icon" class="stat-icon"></i>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </section>

    <section class="features-section">
      <h2><span class="section-hazard">☣</span> {{ t.home.features.title }}</h2>
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
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const realStats = ref({ totalScans: 0, malware: 0, suspicious: 0 })

    onMounted(async () => {
      try {
        const res = await axios.get('/api/history/stats')
        realStats.value = res.data
      } catch (e) { /* ignore */ }
    })

    const features = computed(() => ({
      heuristic: { ...props.t.home.features.heuristic, icon: 'pi pi-chart-line', color: 'linear-gradient(135deg, #dc2626, #b91c1c)' },
      behavioral: { ...props.t.home.features.behavioral, icon: 'pi pi-eye', color: 'linear-gradient(135deg, #f97316, #ea580c)' },
      aiPowered: { ...props.t.home.features.aiPowered, icon: 'pi pi-microchip-ai', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
      signatureless: { ...props.t.home.features.signatureless, icon: 'pi pi-shield', color: 'linear-gradient(135deg, #dc2626, #f97316)' }
    }))
    const evasionTechniqueCount = ['polymorphic', 'metamorphic', 'packing', 'fileless', 'rootkit', 'sandboxEvasion'].length
    const detectionRate = computed(() => {
      const total = realStats.value.totalScans || 0
      if (total > 0) {
        return ((realStats.value.malware + realStats.value.suspicious) / total * 100).toFixed(1) + '%'
      }
      return '0%'
    })
    const stats = computed(() => [
      { icon: 'pi pi-file', value: realStats.value.totalScans || 0, label: props.t.home.stats.filesScanned },
      { icon: 'pi pi-exclamation-triangle', value: (realStats.value.malware || 0) + (realStats.value.suspicious || 0), label: props.t.home.stats.threatsDetected },
      { icon: 'pi pi-cog', value: evasionTechniqueCount, label: props.t.home.stats.evasionTechniques },
      { icon: 'pi pi-percentage', value: detectionRate.value, label: props.t.home.stats.detectionRate }
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

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
    text-shadow: 0 0 10px rgba(220, 38, 38, 0.8);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.6);
    text-shadow: 0 0 20px rgba(220, 38, 38, 1);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes warningFlash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes scanline {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

.home-view { max-width: 1200px; margin: 0 auto; }

/* Hero Section */
.hero {
  text-align: center;
  padding: 3rem 0;
  animation: fadeInDown 0.8s ease-out;
  position: relative;
}

.biohazard-hero-icon {
  font-size: 5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  animation: pulseGlow 2s ease-in-out infinite;
  text-shadow: 0 0 30px var(--primary-glow);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #dc2626, #f97316);
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 0.85rem;
  border: 2px solid #fbbf24;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

.hazard-symbol {
  font-size: 1.2rem;
  animation: rotate 4s linear infinite;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
}

.description {
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.8;
}

.hero-actions { display: flex; gap: 1rem; justify-content: center; }

.scan-btn {
  background: linear-gradient(135deg, #dc2626, #f97316) !important;
  border: none !important;
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px !important;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4) !important;
  transition: all 0.3s ease !important;
}
.scan-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 30px rgba(220, 38, 38, 0.6) !important;
}

.learn-btn {
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 600 !important;
}
.learn-btn:hover {
  background: var(--primary-color) !important;
  color: white !important;
}

/* Warning Banner */
.warning-banner {
  background: repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 10px, #1a1a1a 10px, #1a1a1a 20px);
  padding: 3px;
  margin: 2rem 0;
  border-radius: 4px;
}

.warning-content {
  background: #1a1a1a;
  color: #fbbf24;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  animation: warningFlash 1s ease-in-out infinite;
}

.warning-icon {
  font-size: 1.2rem;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 2rem 0;
}

.stat-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-hazard-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 40px 40px 0;
  border-color: transparent var(--primary-color) transparent transparent;
  transition: all 0.3s ease;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.25);
  border-color: var(--primary-color);
}

.stat-card:hover .stat-hazard-corner {
  border-width: 0 50px 50px 0;
}

.stat-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.2);
  text-shadow: 0 0 15px var(--primary-glow);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  font-family: 'Orbitron', sans-serif;
  color: var(--primary-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Features Section */
.features-section {
  padding: 3rem 0;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Orbitron', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.section-hazard {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  text-align: center;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color) !important;
  border-radius: 8px !important;
}

.feature-card:nth-child(1) { animation-delay: 0.4s; }
.feature-card:nth-child(2) { animation-delay: 0.5s; }
.feature-card:nth-child(3) { animation-delay: 0.6s; }
.feature-card:nth-child(4) { animation-delay: 0.7s; }

.feature-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary-color) !important;
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.feature-icon::before {
  content: '☣';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.8rem;
  color: var(--primary-color);
  opacity: 0;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon::before {
  opacity: 1;
}

.feature-card:hover .feature-icon {
  transform: scale(1.15);
  box-shadow: 0 5px 25px rgba(0,0,0,0.3);
}

.feature-icon i { font-size: 1.8rem; color: white; }

.feature-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-family: 'Orbitron', sans-serif;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .stats-section, .features-grid { grid-template-columns: repeat(2, 1fr); }
  .hero h1 { font-size: 2rem; }
  .biohazard-hero-icon { font-size: 3rem; }
}

@media (max-width: 768px) {
  .hero { padding: 2rem 0; }
  .hero h1 { font-size: 1.6rem; }
  .biohazard-hero-icon { font-size: 2.5rem; }
  .subtitle { font-size: 1rem; }
  .description { font-size: 0.9rem; line-height: 1.6; }
  .hero-actions { flex-direction: column; align-items: center; gap: 0.75rem; }
  .hero-badge { font-size: 0.75rem; padding: 0.5rem 1rem; letter-spacing: 1px; }
  .warning-content { font-size: 0.75rem; letter-spacing: 1.5px; padding: 0.5rem 1rem; }
  .stats-section { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .stat-value { font-size: 1.8rem; }
  .features-grid { grid-template-columns: 1fr; gap: 1rem; }
  .features-section { padding: 2rem 0; }
  .features-section h2 { font-size: 1.1rem; }
}

@media (max-width: 480px) {
  .hero { padding: 1.5rem 0; }
  .hero h1 { font-size: 1.3rem; }
  .biohazard-hero-icon { font-size: 2rem; }
  .subtitle { font-size: 0.9rem; }
  .stats-section { grid-template-columns: 1fr; gap: 0.75rem; }
  .stat-card { padding: 1rem; }
  .stat-value { font-size: 1.5rem; }
  .stat-label { font-size: 0.8rem; }
  .warning-content { font-size: 0.65rem; letter-spacing: 1px; gap: 0.5rem; }
}
</style>
