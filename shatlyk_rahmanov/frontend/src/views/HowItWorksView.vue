<template>
  <div class="how-it-works-view">
    <div class="page-header">
      <h1>{{ t.howItWorks.title }}</h1>
      <p>{{ t.howItWorks.subtitle }}</p>
    </div>

    <div class="steps-flow">
      <div v-for="(step, i) in steps" :key="i" class="step-item">
        <div class="step-number">{{ i + 1 }}</div>
        <h3>{{ step.title }}</h3>
        <p>{{ step.desc }}</p>
      </div>
    </div>

    <Card class="comparison-card">
      <template #content>
        <h2><i class="pi pi-th-large"></i> Traditional vs AI Firewall</h2>
        <div class="comparison-table">
          <div class="comparison-header">
            <span></span>
            <span>Traditional Firewall</span>
            <span>AI Firewall</span>
          </div>
          <div class="comparison-row">
            <span>Rule Management</span>
            <span><i class="pi pi-times red"></i> Manual configuration</span>
            <span><i class="pi pi-check green"></i> Auto-generated</span>
          </div>
          <div class="comparison-row">
            <span>Zero-Day Threats</span>
            <span><i class="pi pi-times red"></i> Cannot detect</span>
            <span><i class="pi pi-check green"></i> Pattern recognition</span>
          </div>
          <div class="comparison-row">
            <span>False Positives</span>
            <span><i class="pi pi-times red"></i> High rate</span>
            <span><i class="pi pi-check green"></i> Machine learning reduces</span>
          </div>
          <div class="comparison-row">
            <span>Adaptation</span>
            <span><i class="pi pi-times red"></i> Static rules</span>
            <span><i class="pi pi-check green"></i> Continuous learning</span>
          </div>
          <div class="comparison-row">
            <span>Behavioral Analysis</span>
            <span><i class="pi pi-times red"></i> Not available</span>
            <span><i class="pi pi-check green"></i> Built-in</span>
          </div>
        </div>
      </template>
    </Card>

    <Card class="faq-card">
      <template #content>
        <h2><i class="pi pi-question-circle"></i> FAQ</h2>
        <Accordion>
          <AccordionPanel v-for="(faq, i) in faqs" :key="i" :value="i">
            <AccordionHeader>{{ faq.question }}</AccordionHeader>
            <AccordionContent><p>{{ faq.answer }}</p></AccordionContent>
          </AccordionPanel>
        </Accordion>
      </template>
    </Card>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const steps = computed(() => [
      props.t.howItWorks.steps.step1,
      props.t.howItWorks.steps.step2,
      props.t.howItWorks.steps.step3,
      props.t.howItWorks.steps.step4,
      props.t.howItWorks.steps.step5
    ])

    const faqs = computed(() => [
      props.t.howItWorks.faq.q1,
      props.t.howItWorks.faq.q2,
      props.t.howItWorks.faq.q3,
      props.t.howItWorks.faq.q4
    ])

    return { steps, faqs }
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
  margin-bottom: 2rem;
}

.steps-flow {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.steps-flow::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 40px;
  right: 40px;
  height: 2px;
  background: var(--border-color);
  z-index: 0;
}

.step-item {
  text-align: center;
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 0 0.5rem;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #06b6d4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  font-weight: 700;
}

.step-item h3 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.step-item p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.comparison-card,
.faq-card {
  margin-bottom: 1.5rem;
}

.comparison-card h2,
.faq-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.comparison-card h2 i { color: #06b6d4; }
.faq-card h2 i { color: #8b5cf6; }

.comparison-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comparison-header,
.comparison-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.comparison-header {
  background: var(--bg-primary);
  font-weight: 600;
}

.comparison-row {
  border-bottom: 1px solid var(--border-color);
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-row span:first-child {
  font-weight: 500;
}

.comparison-row i {
  margin-right: 0.5rem;
}

.comparison-row i.green {
  color: #22c55e;
}

.comparison-row i.red {
  color: #ef4444;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.4rem;
  }

  .steps-flow {
    flex-direction: column;
    gap: 1rem;
  }

  .steps-flow::before {
    display: none;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-card);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .comparison-card h2,
  .faq-card h2 {
    font-size: 1.1rem;
  }

  .comparison-header,
  .comparison-row {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .comparison-header span:first-child,
  .comparison-row span:first-child {
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .comparison-table {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.2rem;
  }

  .page-header p {
    font-size: 0.9rem;
  }

  .step-number {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }

  .step-item h3 {
    font-size: 0.85rem;
  }

  .comparison-row {
    font-size: 0.85rem;
  }
}
</style>
