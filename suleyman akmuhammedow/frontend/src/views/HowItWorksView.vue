<template>
  <div class="how-it-works-view">
    <div class="page-header">
      <h1>{{ t.howItWorks.title }}</h1>
      <p>{{ t.howItWorks.subtitle }}</p>
    </div>

    <!-- Intro -->
    <Card class="intro-card">
      <template #content>
        <div class="intro-content">
          <i class="pi pi-info-circle"></i>
          <p>{{ t.howItWorks.intro }}</p>
        </div>
      </template>
    </Card>

    <!-- Steps -->
    <section class="steps-section">
      <h2>{{ t.howItWorks.steps.title }}</h2>
      <div class="steps-grid">
        <Card v-for="(step, key) in steps" :key="key" class="step-card">
          <template #content>
            <div class="step-number">{{ key + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
            <div class="step-icon">
              <i :class="step.icon"></i>
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- Process Diagram -->
    <Card class="diagram-card">
      <template #content>
        <h3>{{ language === 'en' ? 'Analysis Flow' : 'Derňew Akymy' }}</h3>
        <div class="process-flow">
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-user"></i></div>
            <span>{{ language === 'en' ? 'User Input' : 'Ulanyjy Girişi' }}</span>
          </div>
          <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-cog"></i></div>
            <span>{{ language === 'en' ? 'Processing' : 'Işlenýär' }}</span>
          </div>
          <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-database"></i></div>
            <span>{{ language === 'en' ? 'Data Gathering' : 'Maglumat Ýygnamak' }}</span>
          </div>
          <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-chart-bar"></i></div>
            <span>{{ language === 'en' ? 'Analysis' : 'Derňew' }}</span>
          </div>
          <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>
          <div class="flow-item">
            <div class="flow-icon"><i class="pi pi-file"></i></div>
            <span>{{ language === 'en' ? 'Report' : 'Hasabat' }}</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- FAQ -->
    <section class="faq-section">
      <h2>{{ t.howItWorks.faq.title }}</h2>
      <Accordion>
        <AccordionPanel v-for="(faq, key) in faqs" :key="key" :value="key">
          <AccordionHeader>{{ faq.question }}</AccordionHeader>
          <AccordionContent>
            <p>{{ faq.answer }}</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </section>

    <!-- Tech Stack -->
    <section class="tech-section">
      <h2>{{ t.howItWorks.techStack.title }}</h2>
      <div class="tech-grid">
        <Card class="tech-card">
          <template #content>
            <h3><i class="pi pi-desktop"></i> {{ t.howItWorks.techStack.frontend }}</h3>
            <ul>
              <li><Tag value="Vue.js 3" /></li>
              <li><Tag value="PrimeVue" /></li>
              <li><Tag value="Vue Router" /></li>
              <li><Tag value="Chart.js" /></li>
              <li><Tag value="Axios" /></li>
            </ul>
          </template>
        </Card>
        <Card class="tech-card">
          <template #content>
            <h3><i class="pi pi-server"></i> {{ t.howItWorks.techStack.backend }}</h3>
            <ul>
              <li><Tag value="Node.js" /></li>
              <li><Tag value="Express.js" /></li>
              <li><Tag value="DNS Module" /></li>
              <li><Tag value="Child Process" /></li>
            </ul>
          </template>
        </Card>
        <Card class="tech-card">
          <template #content>
            <h3><i class="pi pi-cog"></i> {{ t.howItWorks.techStack.features }}</h3>
            <ul>
              <li><Tag value="DNS Resolution" /></li>
              <li><Tag value="Port Scanning" /></li>
              <li><Tag value="WHOIS Lookup" /></li>
              <li><Tag value="GeoIP" /></li>
              <li><Tag value="Risk Assessment" /></li>
            </ul>
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'HowItWorksView',
  props: {
    t: Object,
    language: String
  },
  setup(props) {
    const steps = computed(() => [
      { ...props.t.howItWorks.steps.step1, icon: 'pi pi-pencil' },
      { ...props.t.howItWorks.steps.step2, icon: 'pi pi-globe' },
      { ...props.t.howItWorks.steps.step3, icon: 'pi pi-id-card' },
      { ...props.t.howItWorks.steps.step4, icon: 'pi pi-map-marker' },
      { ...props.t.howItWorks.steps.step5, icon: 'pi pi-server' },
      { ...props.t.howItWorks.steps.step6, icon: 'pi pi-chart-bar' }
    ])

    const faqs = computed(() => [
      props.t.howItWorks.faq.q1,
      props.t.howItWorks.faq.q2,
      props.t.howItWorks.faq.q3,
      props.t.howItWorks.faq.q4,
      props.t.howItWorks.faq.q5
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

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.intro-card {
  margin-bottom: 2rem;
}

.intro-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.intro-content i {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.intro-content p {
  line-height: 1.7;
  color: var(--text-secondary);
}

.steps-section {
  margin-bottom: 2rem;
}

.steps-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.step-card {
  position: relative;
  text-align: center;
  overflow: visible;
}

.step-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.step-card h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.step-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.step-icon {
  margin-top: 1rem;
}

.step-icon i {
  font-size: 2rem;
  color: var(--primary-color);
  opacity: 0.5;
}

.diagram-card {
  margin-bottom: 2rem;
}

.diagram-card h3 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.process-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.flow-item {
  text-align: center;
}

.flow-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
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
  color: var(--text-secondary);
}

.flow-arrow {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.faq-section {
  margin-bottom: 2rem;
}

.faq-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.tech-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.tech-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.tech-card h3 i {
  color: var(--primary-color);
}

.tech-card ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 1024px) {
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .process-flow {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
