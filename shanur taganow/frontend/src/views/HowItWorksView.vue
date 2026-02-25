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

    <Card class="diagram-card">
      <template #content>
        <h2><i class="pi pi-share-alt"></i> Packet Capture Flow</h2>
        <div class="flow-diagram">
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-wifi"></i></div>
            <span>Network Traffic</span>
          </div>
          <i class="pi pi-arrow-right flow-arrow"></i>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-server"></i></div>
            <span>Network Interface</span>
          </div>
          <i class="pi pi-arrow-right flow-arrow"></i>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-filter"></i></div>
            <span>Capture Filter</span>
          </div>
          <i class="pi pi-arrow-right flow-arrow"></i>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-database"></i></div>
            <span>Packet Buffer</span>
          </div>
          <i class="pi pi-arrow-right flow-arrow"></i>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-eye"></i></div>
            <span>Analysis Display</span>
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

    <Card class="use-cases">
      <template #content>
        <h2><i class="pi pi-briefcase"></i> Use Cases</h2>
        <div class="cases-grid">
          <div class="case-item">
            <i class="pi pi-shield"></i>
            <h4>Security Analysis</h4>
            <p>Detect intrusions, malware communication, and suspicious network activity</p>
          </div>
          <div class="case-item">
            <i class="pi pi-wrench"></i>
            <h4>Troubleshooting</h4>
            <p>Diagnose network connectivity issues and performance problems</p>
          </div>
          <div class="case-item">
            <i class="pi pi-code"></i>
            <h4>Development</h4>
            <p>Debug network protocols and application communication</p>
          </div>
          <div class="case-item">
            <i class="pi pi-book"></i>
            <h4>Education</h4>
            <p>Learn how network protocols work at the packet level</p>
          </div>
        </div>
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
  background: #3b82f6;
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

.diagram-card,
.faq-card,
.use-cases {
  margin-bottom: 1.5rem;
}

.diagram-card h2,
.faq-card h2,
.use-cases h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.diagram-card h2 i,
.faq-card h2 i,
.use-cases h2 i {
  color: #3b82f6;
}

.flow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 1rem;
}

.flow-item {
  text-align: center;
}

.flow-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
}

.flow-icon i {
  font-size: 1.5rem;
  color: white;
}

.flow-item span {
  font-size: 0.8rem;
  font-weight: 500;
}

.flow-arrow {
  color: #3b82f6;
  font-size: 1.5rem;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.case-item {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  text-align: center;
}

.case-item i {
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 0.75rem;
}

.case-item h4 {
  margin-bottom: 0.5rem;
}

.case-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .steps-flow {
    flex-direction: column;
    gap: 1rem;
  }

  .steps-flow::before {
    display: none;
  }

  .flow-diagram {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
