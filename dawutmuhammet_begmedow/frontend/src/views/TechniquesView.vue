<template>
  <div class="techniques-view">
    <div class="page-header">
      <h1>{{ t.techniques.title }}</h1>
      <p>{{ t.techniques.subtitle }}</p>
    </div>

    <h2><i class="pi pi-exclamation-triangle" style="color: #ef4444"></i> {{ t.techniques.evasion.title }}</h2>
    <div class="techniques-grid">
      <Card v-for="(tech, key) in evasionTechniques" :key="key" class="technique-card">
        <template #content>
          <div class="tech-header">
            <div class="tech-icon" :style="{ background: tech.color }">
              <i :class="tech.icon"></i>
            </div>
            <h3>{{ tech.title }}</h3>
          </div>
          <p class="tech-desc">{{ tech.desc }}</p>
          <div class="detection-method">
            <strong>{{ language === 'en' ? 'Detection:' : 'Anyklaýyş:' }}</strong>
            <p>{{ tech.detection }}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  props: { t: Object, language: String },
  setup(props) {
    const evasionTechniques = computed(() => ({
      polymorphic: { ...props.t.techniques.evasion.polymorphic, icon: 'pi pi-sync', color: '#ef4444' },
      metamorphic: { ...props.t.techniques.evasion.metamorphic, icon: 'pi pi-refresh', color: '#f59e0b' },
      packing: { ...props.t.techniques.evasion.packing, icon: 'pi pi-box', color: '#8b5cf6' },
      fileless: { ...props.t.techniques.evasion.fileless, icon: 'pi pi-cloud', color: '#0ea5e9' },
      rootkit: { ...props.t.techniques.evasion.rootkit, icon: 'pi pi-eye-slash', color: '#10b981' },
      sandboxEvasion: { ...props.t.techniques.evasion.sandboxEvasion, icon: 'pi pi-desktop', color: '#6366f1' }
    }))
    return { evasionTechniques }
  }
}
</script>

<style scoped>
.techniques-view { max-width: 1200px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }
h2 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.techniques-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
.technique-card { transition: transform 0.2s; }
.technique-card:hover { transform: translateY(-4px); }
.tech-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.tech-icon { width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.tech-icon i { font-size: 1.5rem; color: white; }
.tech-header h3 { font-size: 1rem; }
.tech-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem; }
.detection-method { background: var(--bg-secondary); padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; }
.detection-method strong { color: #10b981; }
.detection-method p { margin-top: 0.25rem; color: var(--text-secondary); }
@media (max-width: 1024px) { .techniques-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .techniques-grid { grid-template-columns: 1fr; }
  .page-header h1 { font-size: 1.3rem; }
  h2 { font-size: 1.1rem; }
  .tech-header h3 { font-size: 0.95rem; }
}

@media (max-width: 480px) {
  .page-header h1 { font-size: 1.1rem; }
  .page-header p { font-size: 0.85rem; }
  .tech-icon { width: 40px; height: 40px; }
  .tech-icon i { font-size: 1.2rem; }
  .tech-desc { font-size: 0.85rem; }
  .detection-method { font-size: 0.8rem; padding: 0.5rem; }
}
</style>
