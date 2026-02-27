<template>
  <div class="about-view">
    <div class="page-header">
      <div class="about-icon"><i class="pi pi-shield"></i></div>
      <h1>{{ t.about.title }}</h1>
      <p>{{ t.about.subtitle }}</p>
    </div>

    <Card class="description-card">
      <template #content>
        <p>{{ t.about.description }}</p>
      </template>
    </Card>

    <Card class="author-card">
      <template #content>
        <h3><i class="pi pi-user"></i> {{ t.about.author.title }}</h3>
        <div class="author-info">
          <div class="author-avatar"><i class="pi pi-user"></i></div>
          <div class="author-details">
            <h4>{{ t.about.author.name }}</h4>
            <p><strong>{{ t.about.author.project }}</strong></p>
            <p class="topic">EN: {{ t.about.author.topic }}</p>
            <p class="topic">TM: {{ t.about.author.topicTk }}</p>
          </div>
        </div>
      </template>
    </Card>

    <Card class="tech-card">
      <template #content>
        <h3><i class="pi pi-code"></i> Technology Stack</h3>
        <div class="tech-grid">
          <div class="tech-item"><Tag value="Vue.js 3" severity="success" /></div>
          <div class="tech-item"><Tag value="PrimeVue 4" severity="info" /></div>
          <div class="tech-item"><Tag value="Node.js" severity="success" /></div>
          <div class="tech-item"><Tag value="Express.js" severity="warn" /></div>
          <div class="tech-item"><Tag value="Chart.js" severity="info" /></div>
          <div class="tech-item"><Tag value="Behavioral AI" severity="danger" /></div>
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
.about-view { max-width: 800px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.about-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
.about-icon i { font-size: 3rem; color: white; }
.description-card, .author-card, .tech-card { margin-bottom: 1.5rem; }
.description-card p { font-size: 1.1rem; line-height: 1.8; }
.author-card h3, .tech-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.author-card h3 i { color: #f97316; }
.tech-card h3 i { color: #8b5cf6; }
.author-info { display: flex; align-items: center; gap: 1.5rem; }
.author-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.author-avatar i { font-size: 2rem; color: white; }
.author-details h4 { font-size: 1.25rem; margin-bottom: 0.5rem; }
.topic { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; }
.tech-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
</style>
