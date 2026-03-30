<template>
  <div class="how-it-works-view">
    <div class="page-header">
      <h1>{{ t.howItWorks.title }}</h1>
      <p>{{ t.howItWorks.subtitle }}</p>
    </div>

    <!-- GAN Basics -->
    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-cog"></i> {{ t.howItWorks.ganBasics.title }}</h2>
        <p class="section-text">{{ t.howItWorks.ganBasics.content }}</p>

        <div class="gan-flow">
          <div class="gan-component">
            <div class="component-icon generator"><i class="pi pi-cog"></i></div>
            <h4>Generator</h4>
            <p>{{ t.howItWorks.ganBasics.generator }}</p>
          </div>
          <div class="flow-arrow"><i class="pi pi-arrows-h"></i></div>
          <div class="gan-component">
            <div class="component-icon discriminator"><i class="pi pi-eye"></i></div>
            <h4>Discriminator</h4>
            <p>{{ t.howItWorks.ganBasics.discriminator }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Attack Process -->
    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-bolt"></i> {{ t.howItWorks.attackProcess.title }}</h2>
        <div class="process-steps">
          <div v-for="(step, i) in attackSteps" :key="i" class="step">
            <div class="step-number">{{ i + 1 }}</div>
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Defense Process -->
    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-shield"></i> {{ t.howItWorks.defenseProcess.title }}</h2>
        <div class="process-steps defense">
          <div v-for="(step, i) in defenseSteps" :key="i" class="step">
            <div class="step-number">{{ i + 1 }}</div>
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- FAQ -->
    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-question-circle"></i> {{ t.howItWorks.faq.title }}</h2>
        <Accordion>
          <AccordionPanel v-for="(faq, i) in faqs" :key="i" :value="i">
            <AccordionHeader>{{ faq.question }}</AccordionHeader>
            <AccordionContent>
              <p>{{ faq.answer }}</p>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </template>
    </Card>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'HowItWorksView',
  props: { t: Object, language: String },
  setup(props) {
    const attackSteps = computed(() => [
      props.t.howItWorks.attackProcess.step1,
      props.t.howItWorks.attackProcess.step2,
      props.t.howItWorks.attackProcess.step3,
      props.t.howItWorks.attackProcess.step4,
      props.t.howItWorks.attackProcess.step5
    ])

    const defenseSteps = computed(() => [
      props.t.howItWorks.defenseProcess.step1,
      props.t.howItWorks.defenseProcess.step2,
      props.t.howItWorks.defenseProcess.step3,
      props.t.howItWorks.defenseProcess.step4,
      props.t.howItWorks.defenseProcess.step5
    ])

    const faqs = computed(() => [
      props.t.howItWorks.faq.q1,
      props.t.howItWorks.faq.q2,
      props.t.howItWorks.faq.q3,
      props.t.howItWorks.faq.q4
    ])

    return { attackSteps, defenseSteps, faqs }
  }
}
</script>

<style scoped>
.how-it-works-view { max-width: 900px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.section-card { margin-bottom: 1.5rem; }

.section-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.section-card h2 i { color: var(--primary-color); }

.section-text {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.gan-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
}

.gan-component { text-align: center; }

.component-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.component-icon i { font-size: 2rem; color: white; }
.component-icon.generator { background: #10b981; }
.component-icon.discriminator { background: #ef4444; }

.gan-component h4 { margin-bottom: 0.5rem; }
.gan-component p { color: var(--text-secondary); font-size: 0.85rem; max-width: 200px; }

.flow-arrow { font-size: 2rem; color: var(--primary-color); }

.process-steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.step { text-align: center; position: relative; }

.step-number {
  width: 40px;
  height: 40px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin: 0 auto 0.75rem;
}

.process-steps.defense .step-number { background: #10b981; }

.step h4 { font-size: 0.9rem; margin-bottom: 0.5rem; }
.step p { color: var(--text-secondary); font-size: 0.8rem; }

@media (max-width: 768px) {
  .gan-flow { flex-direction: column; gap: 1rem; }
  .flow-arrow { transform: rotate(90deg); }
  .process-steps { grid-template-columns: 1fr; }
  .page-header h1 { font-size: 1.5rem; }
  .section-card h2 { font-size: 1.1rem; }
  .component-icon { width: 60px; height: 60px; }
  .component-icon i { font-size: 1.5rem; }
  .gan-component p { max-width: none; }
}

@media (max-width: 480px) {
  .step-number { width: 32px; height: 32px; font-size: 0.85rem; }
  .step h4 { font-size: 0.85rem; }
  .step p { font-size: 0.75rem; }
}
</style>
