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
.about-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.about-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 40px rgba(249, 115, 22, 0.4);
  animation: float 3s ease-in-out infinite, pulse 2s ease-in-out infinite;
  position: relative;
}

.about-icon::before {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 3px solid rgba(249, 115, 22, 0.3);
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 10px 40px rgba(249, 115, 22, 0.4); }
  50% { box-shadow: 0 15px 50px rgba(249, 115, 22, 0.6); }
}

.about-icon i {
  font-size: 3.5rem;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.description-card, .author-card, .tech-card {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.5s ease-out both;
}

.description-card { animation-delay: 0.2s; }
.author-card { animation-delay: 0.3s; }
.tech-card { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.description-card p {
  font-size: 1.1rem;
  line-height: 1.9;
}

.author-card h3, .tech-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.author-card h3 i {
  color: #f97316;
  transition: transform 0.3s ease;
}

.author-card:hover h3 i {
  transform: scale(1.2) rotate(10deg);
}

.tech-card h3 i {
  color: #8b5cf6;
  transition: transform 0.3s ease;
}

.tech-card:hover h3 i {
  transform: scale(1.2) rotate(-10deg);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.author-avatar {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  transition: all 0.3s ease;
}

.author-card:hover .author-avatar {
  transform: scale(1.1) rotate(5deg);
}

.author-avatar i {
  font-size: 2.25rem;
  color: white;
}

.author-details h4 {
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.author-details p {
  margin-bottom: 0.25rem;
}

.topic {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.25rem;
  padding-left: 0.5rem;
  border-left: 3px solid var(--accent);
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-item :deep(.p-tag) {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  cursor: default;
}

.tech-item :deep(.p-tag:hover) {
  transform: scale(1.1) translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
