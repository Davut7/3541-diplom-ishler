<template>
  <div class="about-view">
    <div class="page-header">
      <div class="about-logo">
        <i class="pi pi-sitemap"></i>
        <h1>Wire<span>Guard</span> Monitor</h1>
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
            <p>Vue.js 3, PrimeVue, Chart.js</p>
          </div>
          <div class="tech-item">
            <i class="pi pi-server"></i>
            <h4>Backend</h4>
            <p>Node.js, Express.js</p>
          </div>
          <div class="tech-item">
            <i class="pi pi-sitemap"></i>
            <h4>Network</h4>
            <p>Packet Capture Simulation</p>
          </div>
          <div class="tech-item">
            <i class="pi pi-chart-bar"></i>
            <h4>Analysis</h4>
            <p>Protocol Decoding, Statistics</p>
          </div>
        </div>
      </template>
    </Card>

    <Card class="features-card">
      <template #content>
        <h2><i class="pi pi-star"></i> Key Features</h2>
        <ul class="features-list">
          <li><i class="pi pi-check"></i> Real-time packet capture simulation</li>
          <li><i class="pi pi-check"></i> Protocol analysis and decoding</li>
          <li><i class="pi pi-check"></i> Traffic statistics and visualization</li>
          <li><i class="pi pi-check"></i> Anomaly detection</li>
          <li><i class="pi pi-check"></i> Packet filtering capabilities</li>
          <li><i class="pi pi-check"></i> Hex dump viewer</li>
          <li><i class="pi pi-check"></i> OSI model reference</li>
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
  color: #3b82f6;
}

.about-logo h1 {
  font-size: 2.5rem;
  margin: 0;
}

.about-logo span {
  color: #3b82f6;
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

.author-card h2 i,
.tech-card h2 i,
.features-card h2 i {
  color: #3b82f6;
}

.author-info {
  display: flex;
  gap: 1.5rem;
}

.author-avatar {
  width: 80px;
  height: 80px;
  background: #3b82f6;
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
  color: #3b82f6;
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
  color: #3b82f6;
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
  .tech-grid,
  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
