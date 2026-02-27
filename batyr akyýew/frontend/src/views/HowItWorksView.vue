<template>
  <div class="how-it-works-view">
    <div class="page-header">
      <h1>{{ t.howItWorks.title }}</h1>
      <p>{{ t.howItWorks.subtitle }}</p>
    </div>

    <div class="steps-container">
      <div v-for="(step, key) in t.howItWorks.steps" :key="key" class="step-card">
        <div class="step-number">{{ key.replace('step', '') }}</div>
        <div class="step-content">
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </div>
        <div class="step-icon" :class="key">
          <i :class="getStepIcon(key)"></i>
        </div>
      </div>
    </div>

    <Card class="diagram-card">
      <template #content>
        <h3><i class="pi pi-sitemap"></i> WAF Architecture</h3>
        <div class="architecture-diagram">
          <div class="arch-layer client">
            <i class="pi pi-user"></i>
            <span>Client Request</span>
          </div>
          <div class="arch-arrow"><i class="pi pi-arrow-down"></i></div>
          <div class="arch-layer waf">
            <i class="pi pi-shield"></i>
            <span>WAF Layer</span>
          </div>
          <div class="arch-sublayers">
            <div class="sublayer">Signature Detection</div>
            <div class="sublayer">Behavioral Analysis</div>
            <div class="sublayer">Rate Limiting</div>
          </div>
          <div class="arch-arrow"><i class="pi pi-arrow-down"></i></div>
          <div class="arch-layer server">
            <i class="pi pi-server"></i>
            <span>Web Application</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  props: { t: Object, language: String },
  setup() {
    const getStepIcon = (key) => {
      const icons = { step1: 'pi pi-arrow-right-arrow-left', step2: 'pi pi-search', step3: 'pi pi-user', step4: 'pi pi-cog', step5: 'pi pi-sync' }
      return icons[key] || 'pi pi-star'
    }
    return { getStepIcon }
  }
}
</script>

<style scoped>
.how-it-works-view { max-width: 1000px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 3rem; }
.steps-container { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
.step-card { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; }
.step-number { width: 50px; height: 50px; background: linear-gradient(135deg, #f97316, #ea580c); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
.step-content { flex: 1; }
.step-content h3 { margin-bottom: 0.5rem; }
.step-content p { color: var(--text-secondary); }
.step-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.step-icon i { font-size: 1.5rem; color: white; }
.step-icon.step1 { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.step-icon.step2 { background: linear-gradient(135deg, #ef4444, #dc2626); }
.step-icon.step3 { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.step-icon.step4 { background: linear-gradient(135deg, #22c55e, #16a34a); }
.step-icon.step5 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.diagram-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; }
.diagram-card h3 i { color: #f97316; }
.architecture-diagram { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.arch-layer { padding: 1rem 2rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; }
.arch-layer.client { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
.arch-layer.waf { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
.arch-layer.server { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; }
.arch-arrow { color: var(--text-secondary); }
.arch-sublayers { display: flex; gap: 1rem; }
.sublayer { padding: 0.5rem 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.85rem; }
</style>
