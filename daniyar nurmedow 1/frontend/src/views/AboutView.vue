<template>
  <div class="about-view">
    <div class="page-header">
      <div class="about-logo">
        <i class="pi pi-shield"></i>
        <h1>XSS <span>Shield</span></h1>
      </div>
      <p>{{ t.about.subtitle }}</p>
    </div>

    <Card class="desc-card">
      <template #content>
        <p>{{ t.about.description }}</p>
      </template>
    </Card>

    <Card class="author-card">
      <template #content>
        <h2><i class="pi pi-user"></i> {{ t.about.author.title }}</h2>
        <div class="author-info">
          <div class="author-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div>
            <h3>{{ t.about.author.name }}</h3>
            <p class="project">{{ t.about.author.project }}</p>
            <p class="topic"><strong>EN:</strong> {{ t.about.author.topic }}</p>
            <p class="topic"><strong>TM:</strong> {{ t.about.author.topicTk }}</p>
          </div>
        </div>
      </template>
    </Card>

    <Card class="tech-card">
      <template #content>
        <h2><i class="pi pi-cog"></i> Technology Stack</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <i class="pi pi-desktop"></i>
            <h4>Frontend</h4>
            <p>Vue.js 3, PrimeVue</p>
          </div>
          <div class="tech-item">
            <i class="pi pi-server"></i>
            <h4>Backend</h4>
            <p>Node.js, Express.js</p>
          </div>
          <div class="tech-item">
            <i class="pi pi-shield"></i>
            <h4>Security</h4>
            <p>XSS Simulation, Sanitization</p>
          </div>
          <div class="tech-item">
            <i class="pi pi-book"></i>
            <h4>Education</h4>
            <p>Attack & Defense Demos</p>
          </div>
        </div>
      </template>
    </Card>

    <Card class="features-card">
      <template #content>
        <h2><i class="pi pi-star"></i> Key Features</h2>
        <ul class="features-list">
          <li><i class="pi pi-check"></i> Interactive XSS attack simulation</li>
          <li><i class="pi pi-check"></i> Defense technique demonstrations</li>
          <li><i class="pi pi-check"></i> Code vulnerability scanner</li>
          <li><i class="pi pi-check"></i> Multiple XSS types (Reflected, Stored, DOM)</li>
          <li><i class="pi pi-check"></i> Real-time sanitization preview</li>
          <li><i class="pi pi-check"></i> CSP implementation examples</li>
          <li><i class="pi pi-check"></i> Educational FAQ section</li>
          <li><i class="pi pi-check"></i> Bilingual interface (EN/TM)</li>
        </ul>
      </template>
    </Card>

    <Card class="resources-card">
      <template #content>
        <h2><i class="pi pi-link"></i> Learning Resources</h2>
        <div class="resources-list">
          <a href="https://owasp.org/www-community/attacks/xss/" target="_blank" class="resource-item">
            <i class="pi pi-external-link"></i>
            <span>OWASP XSS Guide</span>
          </a>
          <a href="https://portswigger.net/web-security/cross-site-scripting" target="_blank" class="resource-item">
            <i class="pi pi-external-link"></i>
            <span>PortSwigger XSS Tutorial</span>
          </a>
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank" class="resource-item">
            <i class="pi pi-external-link"></i>
            <span>XSS Prevention Cheat Sheet</span>
          </a>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  props: { t: Object, language: String }
}
</script>

<style scoped>
.about-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.about-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.about-logo i {
  font-size: 3rem;
  color: #f97316;
}

.about-logo h1 {
  font-size: 2.5rem;
  margin: 0;
}

.about-logo span {
  color: #f97316;
}

.desc-card {
  margin-bottom: 1.5rem;
}

.desc-card p {
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.7;
}

.author-card,
.tech-card,
.features-card,
.resources-card {
  margin-bottom: 1.5rem;
}

.author-card h2,
.tech-card h2,
.features-card h2,
.resources-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.author-card h2 i { color: #f97316; }
.tech-card h2 i { color: #3b82f6; }
.features-card h2 i { color: #eab308; }
.resources-card h2 i { color: #22c55e; }

.author-info {
  display: flex;
  gap: 1.5rem;
}

.author-avatar {
  width: 80px;
  height: 80px;
  background: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-avatar i {
  font-size: 2.5rem;
  color: white;
}

.author-info h3 {
  margin-bottom: 0.25rem;
}

.project {
  color: #f97316;
  font-weight: 500;
}

.topic {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.tech-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
}

.tech-item i {
  font-size: 2rem;
  color: #f97316;
  margin-bottom: 0.5rem;
}

.tech-item h4 {
  margin-bottom: 0.25rem;
}

.tech-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.features-list i {
  color: #22c55e;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
}

.resource-item:hover {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.resource-item i {
  color: #f97316;
}

@media (max-width: 768px) {
  .tech-grid,
  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
