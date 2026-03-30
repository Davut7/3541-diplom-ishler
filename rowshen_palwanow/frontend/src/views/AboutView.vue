<template>
  <div class="about-view">
    <!-- Hero Section -->
    <div class="about-hero">
      <div class="hero-emblem">
        <i class="pi pi-lock"></i>
      </div>
      <h1>Key<span>Guard</span></h1>
      <p class="version">v1.0.0</p>
      <p class="subtitle">{{ t.about.subtitle }}</p>
    </div>

    <!-- Description Card -->
    <Card class="desc-card">
      <template #content>
        <p>{{ t.about.description }}</p>
      </template>
    </Card>

    <!-- Features Section -->
    <div class="features-section">
      <h2><i class="pi pi-star"></i> {{ language === 'en' ? 'Key Features' : 'Esasy Aýratynlyklar' }}</h2>
      <div class="features-grid">
        <div v-for="(feature, i) in t.about.features" :key="i" class="feature-item">
          <i class="pi pi-check-circle"></i>
          <span>{{ feature }}</span>
        </div>
      </div>
    </div>

    <!-- Tech Stack -->
    <Card class="tech-card">
      <template #content>
        <h2><i class="pi pi-code"></i> {{ language === 'en' ? 'Technology Stack' : 'Tehnologiýa' }}</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <div class="tech-icon vue"><i class="pi pi-bolt"></i></div>
            <span class="tech-name">Vue.js 3</span>
            <span class="tech-desc">Frontend</span>
          </div>
          <div class="tech-item">
            <div class="tech-icon node"><i class="pi pi-server"></i></div>
            <span class="tech-name">Node.js</span>
            <span class="tech-desc">Backend</span>
          </div>
          <div class="tech-item">
            <div class="tech-icon windows"><i class="pi pi-microsoft"></i></div>
            <span class="tech-name">Windows</span>
            <span class="tech-desc">Target OS</span>
          </div>
          <div class="tech-item">
            <div class="tech-icon primevue"><i class="pi pi-palette"></i></div>
            <span class="tech-name">PrimeVue</span>
            <span class="tech-desc">UI Library</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Author Card -->
    <Card class="author-card">
      <template #content>
        <h2><i class="pi pi-user"></i> {{ t.about.author.title }}</h2>
        <div class="author-info">
          <div class="author-avatar">
            <span class="avatar-initials">RO</span>
          </div>
          <div class="author-details">
            <h3>{{ t.about.author.name }}</h3>
            <Tag severity="warn" :value="t.about.author.project" />
            <div class="topics">
              <div class="topic-item">
                <span class="topic-lang">EN</span>
                <span>{{ t.about.author.topic }}</span>
              </div>
              <div class="topic-item">
                <span class="topic-lang">TM</span>
                <span>{{ t.about.author.topicTk }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Footer -->
    <div class="about-footer">
      <div class="footer-emblem"><i class="pi pi-lock"></i></div>
      <p>&copy; 2026 KeyGuard</p>
      <p class="footer-sub">{{ language === 'en' ? 'Securing Your Digital Vault' : 'Sanly Howpsuzlygyňyz' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: { t: Object, language: String }
}
</script>

<style scoped>
.about-view { max-width: 900px; margin: 0 auto; }

/* Hero Section */
.about-hero {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--bg-card);
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 2px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.hero-emblem {
  width: 80px;
  height: 80px;
  background: var(--vault-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 10px 30px rgba(212, 165, 116, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(212, 165, 116, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 15px 40px rgba(212, 165, 116, 0.5); }
}

.hero-emblem i { font-size: 2.5rem; color: white; }

.about-hero h1 {
  font-size: 2.5rem;
  font-family: 'Cinzel', serif;
  margin: 0 0 0.5rem;
}

.about-hero h1 span { color: var(--gold-dark); }

.version {
  display: inline-block;
  background: var(--vault-gradient);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Description Card */
.desc-card { margin-bottom: 2rem; }
.desc-card p {
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.05rem;
}

/* Features Section */
.features-section { margin-bottom: 2rem; }

.features-section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-family: 'Cinzel', serif;
}

.features-section h2 i { color: var(--gold-primary); }

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: var(--gold-primary);
  transform: translateX(5px);
}

.feature-item i {
  font-size: 1.25rem;
  color: var(--gold-primary);
}

/* Tech Card */
.tech-card { margin-bottom: 2rem; }

.tech-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-family: 'Cinzel', serif;
}

.tech-card h2 i { color: var(--gold-primary); }

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.tech-item {
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.tech-item:hover { transform: translateY(-5px); border-color: var(--gold-primary); }

.tech-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.tech-icon i { font-size: 1.5rem; color: white; }

.tech-icon.vue { background: linear-gradient(135deg, #42b883, #35495e); }
.tech-icon.node { background: linear-gradient(135deg, #68a063, #3c873a); }
.tech-icon.windows { background: linear-gradient(135deg, #0078d4, #005a9e); }
.tech-icon.primevue { background: linear-gradient(135deg, #10b981, #059669); }

.tech-name { display: block; font-weight: 600; margin-bottom: 0.25rem; }
.tech-desc { font-size: 0.85rem; color: var(--text-secondary); }

/* Author Card */
.author-card { margin-bottom: 2rem; }

.author-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-family: 'Cinzel', serif;
}

.author-card h2 i { color: var(--gold-primary); }

.author-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.author-avatar {
  width: 100px;
  height: 100px;
  background: var(--vault-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 30px rgba(212, 165, 116, 0.3);
}

.avatar-initials {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  font-family: 'Cinzel', serif;
}

.author-details h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-family: 'Cinzel', serif;
}

.topics { margin-top: 1rem; }

.topic-item {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
}

.topic-lang {
  background: var(--gold-primary);
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Footer */
.about-footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.footer-emblem i {
  font-size: 2rem;
  color: var(--gold-primary);
  margin-bottom: 0.5rem;
}

.footer-sub {
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-family: 'Cinzel', serif;
  color: var(--gold-dark);
}

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
  .author-info { flex-direction: column; align-items: center; text-align: center; }
  .about-hero h1 { font-size: 1.75rem; }

  .about-hero {
    padding: 2rem 0.75rem;
  }

  .hero-emblem {
    width: 60px;
    height: 60px;
  }

  .hero-emblem i {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .desc-card p {
    font-size: 0.95rem;
  }

  .author-avatar {
    width: 80px;
    height: 80px;
  }

  .avatar-initials {
    font-size: 1.5rem;
  }

  .author-details h3 {
    font-size: 1.25rem;
  }

  .topic-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
    font-size: 0.85rem;
  }

  .topic-lang {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .tech-grid { grid-template-columns: 1fr; }
  .about-hero h1 { font-size: 1.5rem; }

  .tech-item {
    padding: 1rem;
  }

  .tech-icon {
    width: 48px;
    height: 48px;
  }

  .tech-icon i {
    font-size: 1.25rem;
  }

  .feature-item {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .about-footer {
    padding: 1.5rem 0.5rem;
  }
}
</style>
