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

    <Card class="types-card">
      <template #content>
        <h2><i class="pi pi-list"></i> {{ t.howItWorks.keyloggerTypes.title }}</h2>
        <div class="types-grid">
          <div class="type-item software">
            <div class="type-header">
              <i class="pi pi-desktop"></i>
              <h3>{{ t.howItWorks.keyloggerTypes.software.name }}</h3>
            </div>
            <p>{{ t.howItWorks.keyloggerTypes.software.desc }}</p>
            <div class="type-examples">
              <strong>Examples:</strong> {{ t.howItWorks.keyloggerTypes.software.examples }}
            </div>
          </div>

          <div class="type-item hardware">
            <div class="type-header">
              <i class="pi pi-microchip-ai"></i>
              <h3>{{ t.howItWorks.keyloggerTypes.hardware.name }}</h3>
            </div>
            <p>{{ t.howItWorks.keyloggerTypes.hardware.desc }}</p>
            <div class="type-examples">
              <strong>Examples:</strong> {{ t.howItWorks.keyloggerTypes.hardware.examples }}
            </div>
          </div>

          <div class="type-item kernel">
            <div class="type-header">
              <i class="pi pi-server"></i>
              <h3>{{ t.howItWorks.keyloggerTypes.kernel.name }}</h3>
            </div>
            <p>{{ t.howItWorks.keyloggerTypes.kernel.desc }}</p>
            <div class="type-examples">
              <strong>Examples:</strong> {{ t.howItWorks.keyloggerTypes.kernel.examples }}
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="api-card">
      <template #content>
        <h2><i class="pi pi-code"></i> Windows APIs Used by Keyloggers</h2>
        <div class="api-list">
          <div class="api-item danger">
            <code>SetWindowsHookEx</code>
            <Tag severity="danger" value="High Risk" />
            <p>Installs keyboard hooks to intercept keystrokes system-wide</p>
          </div>
          <div class="api-item danger">
            <code>GetAsyncKeyState</code>
            <Tag severity="danger" value="High Risk" />
            <p>Polls keyboard state to detect key presses</p>
          </div>
          <div class="api-item warning">
            <code>GetKeyboardState</code>
            <Tag severity="warn" value="Medium Risk" />
            <p>Retrieves the status of all 256 virtual keys</p>
          </div>
          <div class="api-item warning">
            <code>RegisterRawInputDevices</code>
            <Tag severity="warn" value="Medium Risk" />
            <p>Registers for raw keyboard input</p>
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
  background: #8b5cf6;
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

.types-card,
.api-card,
.faq-card {
  margin-bottom: 1.5rem;
}

.types-card h2,
.api-card h2,
.faq-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.types-card h2 i { color: #8b5cf6; }
.api-card h2 i { color: #ef4444; }
.faq-card h2 i { color: #3b82f6; }

.types-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.type-item {
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid;
}

.type-item.software {
  background: rgba(139, 92, 246, 0.05);
  border-color: #8b5cf6;
}

.type-item.hardware {
  background: rgba(249, 115, 22, 0.05);
  border-color: #f97316;
}

.type-item.kernel {
  background: rgba(239, 68, 68, 0.05);
  border-color: #ef4444;
}

.type-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.type-item.software .type-header i { color: #8b5cf6; }
.type-item.hardware .type-header i { color: #f97316; }
.type-item.kernel .type-header i { color: #ef4444; }

.type-header i {
  font-size: 1.5rem;
}

.type-item p {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.type-examples {
  font-size: 0.85rem;
  padding: 0.5rem;
  background: var(--bg-primary);
  border-radius: 4px;
}

.api-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  flex-wrap: wrap;
}

.api-item.danger {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid #ef4444;
}

.api-item.warning {
  background: rgba(249, 115, 22, 0.05);
  border: 1px solid #f97316;
}

.api-item code {
  font-family: monospace;
  font-weight: 600;
  font-size: 1rem;
}

.api-item p {
  width: 100%;
  margin-top: 0.5rem;
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

  .types-grid {
    grid-template-columns: 1fr;
  }
}
</style>
