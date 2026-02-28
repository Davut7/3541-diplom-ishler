<template>
  <div class="about-view">
    <div class="page-header">
      <div class="about-logo">
        <i class="pi pi-shield"></i>
        <h1>GAN<span class="accent">Security</span></h1>
      </div>
      <p class="subtitle">{{ t.about.subtitle }}</p>
    </div>

    <Card class="section-card">
      <template #content>
        <p class="description">{{ t.about.description }}</p>
      </template>
    </Card>

    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-question-circle"></i> {{ t.about.whatIsGan.title }}</h2>
        <p>{{ t.about.whatIsGan.content }}</p>
      </template>
    </Card>

    <Card class="section-card">
      <template #content>
        <h2><i class="pi pi-flag"></i> {{ t.about.purpose.title }}</h2>
        <p>{{ t.about.purpose.content }}</p>
      </template>
    </Card>

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
  props: { t: Object, language: String }
}
</script>

<style scoped>
.about-view { max-width: 800px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }

.about-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.about-logo i { font-size: 3rem; color: var(--primary-color); }
.about-logo h1 { font-size: 2.5rem; margin: 0; }
.about-logo .accent { color: var(--primary-color); }

.subtitle { color: var(--text-secondary); font-size: 1.1rem; }

.section-card { margin-bottom: 1.5rem; }

.section-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.section-card h2 i { color: var(--primary-color); }

.section-card p, .description {
  color: var(--text-secondary);
  line-height: 1.7;
}

.description { text-align: center; }

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
}

.author-avatar i { font-size: 2.5rem; color: white; }

.author-details h3 { margin-bottom: 0.25rem; }
.author-project { color: var(--primary-color); font-weight: 500; }
.topic { color: var(--text-secondary); font-size: 0.9rem; margin: 0.25rem 0; }
</style>
