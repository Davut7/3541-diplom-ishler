<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-badge"><i class="pi pi-shield"></i> Advanced Detection</div>
      <h1>{{ t.home.title }}</h1>
      <p class="subtitle">{{ t.home.subtitle }}</p>
      <p class="description">{{ t.home.description }}</p>
      <div class="hero-actions">
        <Button @click="$router.push('/scan')" icon="pi pi-search" :label="t.home.startScan" class="p-button-lg p-button-danger" />
        <Button @click="$router.push('/techniques')" icon="pi pi-book" :label="t.home.learnMore" class="p-button-lg p-button-outlined" />
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
      <h2>{{ t.home.features.title }}</h2>
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
  props: { t: Object, language: String },
  setup(props) {
    const features = computed(() => ({
      heuristic: { ...props.t.home.features.heuristic, icon: 'pi pi-chart-line', color: '#ef4444' },
      behavioral: { ...props.t.home.features.behavioral, icon: 'pi pi-eye', color: '#f59e0b' },
      aiPowered: { ...props.t.home.features.aiPowered, icon: 'pi pi-microchip-ai', color: '#8b5cf6' },
      signatureless: { ...props.t.home.features.signatureless, icon: 'pi pi-shield', color: '#10b981' }
    }))
    const stats = computed(() => [
      { icon: 'pi pi-file', value: '10K+', label: props.t.home.stats.filesScanned },
      { icon: 'pi pi-exclamation-triangle', value: '500+', label: props.t.home.stats.threatsDetected },
      { icon: 'pi pi-cog', value: '15+', label: props.t.home.stats.evasionTechniques },
      { icon: 'pi pi-percentage', value: '99.2%', label: props.t.home.stats.detectionRate }
    ])
    return { features, stats }
  }
}
</script>

<style scoped>
.home-view { max-width: 1200px; margin: 0 auto; }
.hero { text-align: center; padding: 3rem 0; }
.hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 50px; margin-bottom: 1.5rem; }
.hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.subtitle { font-size: 1.25rem; color: #ef4444; margin-bottom: 1rem; }
.description { color: var(--text-secondary); max-width: 700px; margin: 0 auto 2rem; line-height: 1.6; }
.hero-actions { display: flex; gap: 1rem; justify-content: center; }
.stats-section { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; padding: 2rem 0; }
.stat-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center; }
.stat-icon { font-size: 2rem; color: #ef4444; margin-bottom: 0.5rem; }
.stat-value { font-size: 2rem; font-weight: 700; }
.stat-label { color: var(--text-secondary); }
.features-section { padding: 3rem 0; }
.features-section h2 { text-align: center; margin-bottom: 2rem; }
.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.feature-card { text-align: center; }
.feature-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.feature-icon i { font-size: 1.5rem; color: white; }
.feature-card h3 { font-size: 1rem; margin-bottom: 0.5rem; }
.feature-card p { color: var(--text-secondary); font-size: 0.85rem; }
@media (max-width: 1024px) { .stats-section, .features-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
