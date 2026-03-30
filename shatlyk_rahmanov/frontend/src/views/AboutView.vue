<template>
  <div class="about-view">
    <div class="page-header">
      <div class="about-logo">
        <i class="pi pi-shield"></i>
        <h1>AI <span>Firewall</span></h1>
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
            <i class="pi pi-microchip-ai"></i>
            <h4>AI/ML</h4>
            <p>Neural Networks, Pattern Recognition</p>
          </div>
          <div class="tech-item">
            <i class="pi pi-shield"></i>
            <h4>Security</h4>
            <p>Threat Detection, Rule Generation</p>
          </div>
        </div>
      </template>
    </Card>

    <Card class="features-card">
      <template #content>
        <h2><i class="pi pi-star"></i> Key Features</h2>
        <ul class="features-list">
          <li><i class="pi pi-check"></i> AI-powered threat detection</li>
          <li><i class="pi pi-check"></i> Automatic rule generation</li>
          <li><i class="pi pi-check"></i> Real-time traffic analysis</li>
          <li><i class="pi pi-check"></i> Zero-day threat detection</li>
          <li><i class="pi pi-check"></i> Behavioral analysis</li>
          <li><i class="pi pi-check"></i> DDoS protection</li>
          <li><i class="pi pi-check"></i> Continuous learning</li>
          <li><i class="pi pi-check"></i> Bilingual interface (EN/TM)</li>
        </ul>
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
  color: #06b6d4;
}

.about-logo h1 {
  font-size: 2.5rem;
  margin: 0;
}

.about-logo span {
  color: #06b6d4;
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
.features-card {
  margin-bottom: 1.5rem;
}

.author-card h2,
.tech-card h2,
.features-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.author-card h2 i { color: #06b6d4; }
.tech-card h2 i { color: #8b5cf6; }
.features-card h2 i { color: #eab308; }

.author-info {
  display: flex;
  gap: 1.5rem;
}

.author-avatar {
  width: 80px;
  height: 80px;
  background: #06b6d4;
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
  color: #06b6d4;
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
  color: #06b6d4;
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

@media (max-width: 768px) {
  .about-logo h1 {
    font-size: 1.8rem;
  }

  .about-logo i {
    font-size: 2.2rem;
  }

  .author-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-avatar {
    width: 65px;
    height: 65px;
  }

  .author-avatar i {
    font-size: 2rem;
  }

  .tech-grid,
  .features-list {
    grid-template-columns: 1fr;
  }

  .tech-item {
    padding: 1rem;
  }

  .author-card h2,
  .tech-card h2,
  .features-card h2 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .about-logo h1 {
    font-size: 1.5rem;
  }

  .about-logo i {
    font-size: 1.8rem;
  }

  .topic {
    font-size: 0.8rem;
  }

  .desc-card p {
    font-size: 0.9rem;
  }
}
</style>
