<template>
  <div class="how-it-works-view">
    <div class="page-header">
      <h1>{{ t.howItWorks.title }}</h1>
      <p>{{ t.howItWorks.subtitle }}</p>
    </div>

    <!-- How KeyGuard App Works (NEW SECTION) -->
    <Card class="app-arch-card">
      <template #content>
        <h2><i class="pi pi-shield"></i> {{ t.howItWorks.appArchitecture.title }}</h2>
        <p class="section-subtitle">{{ t.howItWorks.appArchitecture.subtitle }}</p>

        <div class="arch-grid">
          <div class="arch-item electron">
            <div class="arch-icon"><i class="pi pi-desktop"></i></div>
            <h3>{{ t.howItWorks.appArchitecture.electron.name }}</h3>
            <p>{{ t.howItWorks.appArchitecture.electron.desc }}</p>
          </div>
          <div class="arch-item scanning">
            <div class="arch-icon"><i class="pi pi-search"></i></div>
            <h3>{{ t.howItWorks.appArchitecture.scanning.name }}</h3>
            <p>{{ t.howItWorks.appArchitecture.scanning.desc }}</p>
          </div>
          <div class="arch-item detection">
            <div class="arch-icon"><i class="pi pi-database"></i></div>
            <h3>{{ t.howItWorks.appArchitecture.detection.name }}</h3>
            <p>{{ t.howItWorks.appArchitecture.detection.desc }}</p>
          </div>
          <div class="arch-item heuristic">
            <div class="arch-icon"><i class="pi pi-chart-line"></i></div>
            <h3>{{ t.howItWorks.appArchitecture.heuristic.name }}</h3>
            <p>{{ t.howItWorks.appArchitecture.heuristic.desc }}</p>
          </div>
          <div class="arch-item risk">
            <div class="arch-icon"><i class="pi pi-exclamation-triangle"></i></div>
            <h3>{{ t.howItWorks.appArchitecture.risk.name }}</h3>
            <p>{{ t.howItWorks.appArchitecture.risk.desc }}</p>
          </div>
          <div class="arch-item response">
            <div class="arch-icon"><i class="pi pi-trash"></i></div>
            <h3>{{ t.howItWorks.appArchitecture.response.name }}</h3>
            <p>{{ t.howItWorks.appArchitecture.response.desc }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Scan Stages Explained (NEW SECTION) -->
    <Card class="stages-card">
      <template #content>
        <h2><i class="pi pi-sync"></i> {{ t.howItWorks.scanStages.title }}</h2>
        <div class="stages-timeline">
          <div v-for="(stage, i) in scanStages" :key="i" class="stage-item" :class="'stage-' + (i + 1)">
            <div class="stage-progress-bar">
              <div class="stage-fill" :style="{ width: stageWidths[i] }"></div>
            </div>
            <h3>{{ stage.name }}</h3>
            <p>{{ stage.desc }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Detection Steps Flow -->
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

    const scanStages = computed(() => [
      props.t.howItWorks.scanStages.stage1,
      props.t.howItWorks.scanStages.stage2,
      props.t.howItWorks.scanStages.stage3,
      props.t.howItWorks.scanStages.stage4,
      props.t.howItWorks.scanStages.stage5
    ])

    const stageWidths = ['15%', '15%', '40%', '15%', '15%']

    return { steps, faqs, scanStages, stageWidths }
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

/* App Architecture Section */
.app-arch-card,
.stages-card {
  margin-bottom: 1.5rem;
}

.app-arch-card h2,
.stages-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.app-arch-card h2 i { color: #ef4444; }
.stages-card h2 i { color: #22c55e; }

.section-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.arch-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.arch-item {
  padding: 1.25rem;
  border-radius: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.arch-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.arch-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.arch-icon i {
  font-size: 1.3rem;
  color: white;
}

.arch-item.electron .arch-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.arch-item.scanning .arch-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
.arch-item.detection .arch-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.arch-item.heuristic .arch-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.arch-item.risk .arch-icon { background: linear-gradient(135deg, #f97316, #ea580c); }
.arch-item.response .arch-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }

.arch-item h3 {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.arch-item p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Scan Stages Timeline */
.stages-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.stage-item {
  padding: 1rem 1.25rem;
  background: var(--bg-primary);
  border-radius: 10px;
  border-left: 4px solid;
}

.stage-item.stage-1 { border-color: #3b82f6; }
.stage-item.stage-2 { border-color: #8b5cf6; }
.stage-item.stage-3 { border-color: #ef4444; }
.stage-item.stage-4 { border-color: #f59e0b; }
.stage-item.stage-5 { border-color: #22c55e; }

.stage-progress-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.stage-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s;
}

.stage-item.stage-1 .stage-fill { background: #3b82f6; }
.stage-item.stage-2 .stage-fill { background: #8b5cf6; }
.stage-item.stage-3 .stage-fill { background: #ef4444; }
.stage-item.stage-4 .stage-fill { background: #f59e0b; }
.stage-item.stage-5 .stage-fill { background: #22c55e; }

.stage-item h3 {
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

.stage-item p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Steps Flow */
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

  .types-grid,
  .arch-grid {
    grid-template-columns: 1fr;
  }

  .api-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .api-item code {
    font-size: 0.9rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .type-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .step-item h3 {
    font-size: 0.85rem;
  }

  .step-item p {
    font-size: 0.75rem;
  }

  .step-number {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }

  .type-header i {
    font-size: 1.25rem;
  }

  .type-item p {
    font-size: 0.85rem;
  }

  .type-examples {
    font-size: 0.8rem;
  }

  .api-item p {
    font-size: 0.8rem;
  }

  .arch-item {
    padding: 1rem;
  }

  .arch-item h3 {
    font-size: 0.9rem;
  }

  .arch-item p {
    font-size: 0.8rem;
  }

  .stage-item h3 {
    font-size: 0.9rem;
  }

  .stage-item p {
    font-size: 0.8rem;
  }
}
</style>
