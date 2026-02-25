<template>
  <div class="about-view">
    <div class="page-header">
      <div class="about-logo">
        <i class="pi pi-shield"></i>
        <h1>Virus<span>Detect</span> Pro</h1>
      </div>
      <p>{{ t.about.subtitle }}</p>
    </div>
    <Card class="desc-card"><template #content><p>{{ t.about.description }}</p></template></Card>
    <Card class="author-card">
      <template #content>
        <h2><i class="pi pi-user"></i> {{ t.about.author.title }}</h2>
        <div class="author-info">
          <div class="author-avatar"><i class="pi pi-user"></i></div>
          <div>
            <h3>{{ t.about.author.name }}</h3>
            <p class="project">{{ t.about.author.project }}</p>
            <p class="topic"><strong>EN:</strong> {{ t.about.author.topic }}</p>
            <p class="topic"><strong>TM:</strong> {{ t.about.author.topicTk }}</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default { props: { t: Object, language: String } }
</script>

<style scoped>
.about-view { max-width: 800px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.about-logo { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem; }
.about-logo i { font-size: 3rem; color: #ef4444; }
.about-logo h1 { font-size: 2.5rem; margin: 0; }
.about-logo span { color: #ef4444; }
.desc-card { margin-bottom: 1.5rem; }
.desc-card p { text-align: center; color: var(--text-secondary); line-height: 1.7; }
.author-card h2 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.author-card h2 i { color: #ef4444; }
.author-info { display: flex; gap: 1.5rem; }
.author-avatar { width: 80px; height: 80px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.author-avatar i { font-size: 2.5rem; color: white; }
.author-info h3 { margin-bottom: 0.25rem; }
.project { color: #ef4444; font-weight: 500; }
.topic { color: var(--text-secondary); font-size: 0.9rem; margin: 0.25rem 0; }
</style>
