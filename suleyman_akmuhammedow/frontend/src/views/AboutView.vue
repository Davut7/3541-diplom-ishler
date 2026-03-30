<template>
  <div class="about-view">
    <div class="page-header">
      <div class="about-logo">
        <i class="pi pi-shield"></i>
        <h1>OSINT<span class="accent">.AI</span></h1>
      </div>
      <p class="subtitle">{{ t.about.subtitle }}</p>
    </div>

    <!-- Description -->
    <Card class="description-card">
      <template #content>
        <p>{{ t.about.description }}</p>
      </template>
    </Card>

    <!-- What is OSINT -->
    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-question-circle"></i> {{ t.about.whatIsOsint.title }}</h2>
        <p>{{ t.about.whatIsOsint.content }}</p>
      </template>
    </Card>

    <!-- Purpose -->
    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-flag"></i> {{ t.about.purpose.title }}</h2>
        <p>{{ t.about.purpose.content }}</p>
      </template>
    </Card>

    <!-- Features -->
    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-star"></i> {{ t.about.features.title }}</h2>
        <ul class="features-list">
          <li v-for="(feature, i) in t.about.features.list" :key="i">
            <i class="pi pi-check"></i>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </template>
    </Card>

    <!-- Technology -->
    <section class="tech-section">
      <h2>{{ t.about.tech.title }}</h2>
      <div class="tech-grid">
        <Card class="tech-card">
          <template #content>
            <h3><i class="pi pi-desktop"></i> {{ t.about.tech.frontend.title }}</h3>
            <div class="tech-items">
              <Tag v-for="item in t.about.tech.frontend.items" :key="item" :value="item" class="tech-tag" />
            </div>
          </template>
        </Card>
        <Card class="tech-card">
          <template #content>
            <h3><i class="pi pi-server"></i> {{ t.about.tech.backend.title }}</h3>
            <div class="tech-items">
              <Tag v-for="item in t.about.tech.backend.items" :key="item" :value="item" class="tech-tag" />
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- Ethical Use Warning -->
    <Card class="warning-card">
      <template #content>
        <div class="warning-content">
          <i class="pi pi-exclamation-triangle"></i>
          <div>
            <h3>{{ t.about.ethical.title }}</h3>
            <p>{{ t.about.ethical.content }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Author -->
    <Card class="author-card">
      <template #content>
        <h2><i class="pi pi-user"></i> {{ t.about.author.title }}</h2>
        <div class="author-info">
          <div class="author-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="author-details">
            <h3>{{ t.about.author.name }}</h3>
            <p class="author-project">{{ t.about.author.project }}</p>
            <Divider />
            <p class="topic"><strong>EN:</strong> {{ t.about.author.topic }}</p>
            <p class="topic"><strong>TM:</strong> {{ t.about.author.topicTk }}</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  props: {
    t: Object,
    language: String
  }
}
</script>

<style scoped>
.about-view {
  max-width: 900px;
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
  color: var(--primary-color);
}

.about-logo h1 {
  font-size: 2.5rem;
  margin: 0;
}

.about-logo .accent {
  color: var(--primary-color);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.description-card {
  margin-bottom: 1.5rem;
}

.description-card p {
  line-height: 1.7;
  color: var(--text-secondary);
  text-align: center;
}

.section-card {
  margin-bottom: 1.5rem;
}

.section-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.section-card h2 i {
  color: var(--primary-color);
}

.section-card p {
  line-height: 1.7;
  color: var(--text-secondary);
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
  color: var(--primary-color);
}

.tech-section {
  margin-bottom: 1.5rem;
}

.tech-section h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.tech-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: var(--primary-color) !important;
}

.warning-card {
  margin-bottom: 1.5rem;
  border: 2px solid var(--warning-color);
}

.warning-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.warning-content > i {
  font-size: 2rem;
  color: var(--warning-color);
}

.warning-content h3 {
  margin-bottom: 0.5rem;
  color: var(--warning-color);
}

.warning-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.author-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.author-card h2 i {
  color: var(--primary-color);
}

.author-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.author-avatar {
  width: 80px;
  height: 80px;
  background: var(--primary-color);
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

.author-details h3 {
  margin-bottom: 0.25rem;
}

.author-project {
  color: var(--primary-color);
  font-weight: 500;
}

.topic {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

@media (max-width: 768px) {
  .about-logo h1 {
    font-size: 2rem;
  }

  .about-logo i {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .features-list {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .features-list li {
    font-size: 0.9rem;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .author-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-avatar {
    width: 64px;
    height: 64px;
  }

  .author-avatar i {
    font-size: 2rem;
  }

  .section-card h2 {
    font-size: 1.1rem;
  }

  .section-card p,
  .description-card p {
    font-size: 0.9rem;
  }

  .warning-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .warning-content > i {
    font-size: 1.5rem;
  }

  .warning-content p {
    font-size: 0.85rem;
  }

  .topic {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .about-logo h1 {
    font-size: 1.6rem;
  }

  .about-logo i {
    font-size: 2rem;
  }

  .about-logo {
    gap: 0.5rem;
  }

  .section-card h2 {
    font-size: 1rem;
    flex-wrap: wrap;
  }

  .author-details h3 {
    font-size: 1rem;
  }

  .author-project {
    font-size: 0.85rem;
  }
}
</style>
