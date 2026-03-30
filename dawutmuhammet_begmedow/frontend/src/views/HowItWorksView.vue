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
    const faqs = computed(() => [props.t.howItWorks.faq.q1, props.t.howItWorks.faq.q2, props.t.howItWorks.faq.q3, props.t.howItWorks.faq.q4])
    return { steps, faqs }
  }
}
</script>

<style scoped>
.how-it-works-view { max-width: 900px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.steps-flow { display: flex; justify-content: space-between; margin-bottom: 2rem; position: relative; }
.steps-flow::before { content: ''; position: absolute; top: 20px; left: 40px; right: 40px; height: 2px; background: var(--border-color); z-index: 0; }
.step-item { text-align: center; position: relative; z-index: 1; flex: 1; padding: 0 0.5rem; }
.step-number { width: 40px; height: 40px; background: #ef4444; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; font-weight: 700; }
.step-item h3 { font-size: 0.9rem; margin-bottom: 0.5rem; }
.step-item p { font-size: 0.8rem; color: var(--text-secondary); }
.faq-card h2 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.faq-card h2 i { color: #ef4444; }
@media (max-width: 768px) {
  .steps-flow { flex-direction: column; gap: 1rem; }
  .steps-flow::before { display: none; }
  .page-header h1 { font-size: 1.3rem; }
  .step-item { text-align: left; display: flex; align-items: flex-start; gap: 1rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px; }
  .step-number { margin: 0; flex-shrink: 0; }
}

@media (max-width: 480px) {
  .page-header h1 { font-size: 1.1rem; }
  .page-header p { font-size: 0.85rem; }
  .step-item h3 { font-size: 0.85rem; }
  .step-item p { font-size: 0.75rem; }
}
</style>
