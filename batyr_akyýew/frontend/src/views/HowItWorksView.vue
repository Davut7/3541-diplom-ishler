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
.how-it-works-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.step-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.5s ease-out both;
  position: relative;
  overflow: hidden;
}

.step-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #f97316, #ea580c);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.step-card:hover::before {
  opacity: 1;
}

.step-card:nth-child(1) { animation-delay: 0.1s; }
.step-card:nth-child(2) { animation-delay: 0.2s; }
.step-card:nth-child(3) { animation-delay: 0.3s; }
.step-card:nth-child(4) { animation-delay: 0.4s; }
.step-card:nth-child(5) { animation-delay: 0.5s; }

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-card:hover {
  transform: translateX(10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--accent);
}

.step-number {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  transition: all 0.3s ease;
}

.step-card:hover .step-number {
  transform: scale(1.1) rotate(10deg);
}

.step-content {
  flex: 1;
}

.step-content h3 {
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.step-card:hover .step-content h3 {
  color: var(--accent);
}

.step-content p {
  color: var(--text-secondary);
}

.step-icon {
  width: 65px;
  height: 65px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-card:hover .step-icon {
  transform: scale(1.1) rotate(-5deg);
}

.step-icon i {
  font-size: 1.5rem;
  color: white;
}

.step-icon.step1 { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
.step-icon.step2 { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); }
.step-icon.step3 { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
.step-icon.step4 { background: linear-gradient(135deg, #22c55e, #16a34a); box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3); }
.step-icon.step5 { background: linear-gradient(135deg, #06b6d4, #0891b2); box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3); }

.diagram-card {
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.diagram-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.diagram-card h3 i {
  color: #f97316;
}

.architecture-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.arch-layer {
  padding: 1.25rem 2.5rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: scaleIn 0.5s ease-out both;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.arch-layer:nth-child(1) { animation-delay: 0.7s; }
.arch-layer:nth-child(3) { animation-delay: 0.9s; }
.arch-layer:nth-child(5) { animation-delay: 1.1s; }

.arch-layer:hover {
  transform: scale(1.05);
}

.arch-layer.client {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.arch-layer.waf {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
}

.arch-layer.server {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
}

.arch-arrow {
  color: var(--text-secondary);
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.arch-sublayers {
  display: flex;
  gap: 1rem;
  animation: fadeIn 0.5s ease-out 1s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.sublayer {
  padding: 0.75rem 1.25rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.sublayer:hover {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .step-card {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
    gap: 1rem;
  }

  .step-card:hover {
    transform: translateY(-5px);
  }

  .step-number {
    width: 45px;
    height: 45px;
    font-size: 1.25rem;
  }

  .step-icon {
    width: 50px;
    height: 50px;
  }

  .step-icon i {
    font-size: 1.25rem;
  }

  .arch-sublayers {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .sublayer {
    width: 100%;
    max-width: 200px;
    text-align: center;
  }

  .arch-layer {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }

  .step-content h3 {
    font-size: 1rem;
  }

  .step-content p {
    font-size: 0.85rem;
  }
}
</style>
