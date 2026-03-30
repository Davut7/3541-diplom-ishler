<template>
  <div class="about-view">
    <!-- Hero Section -->
    <div class="about-hero">
      <div class="hero-bg">
        <div class="cyber-grid"></div>
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
      </div>

      <div class="hero-content">
        <div class="hero-emblem">
          <div class="emblem-rings">
            <span class="ring"></span>
            <span class="ring"></span>
            <span class="ring"></span>
          </div>
          <i class="pi pi-wifi"></i>
        </div>
        <h1>Wire<span>Guard</span> Monitor</h1>
        <p class="version">v1.0.0</p>
        <p class="subtitle">{{ t.about.subtitle }}</p>
      </div>
    </div>

    <!-- Description Card -->
    <Card class="desc-card">
      <template #content>
        <div class="desc-icon"><i class="pi pi-info-circle"></i></div>
        <p>{{ t.about.description }}</p>
      </template>
    </Card>

    <!-- Features Section -->
    <div class="features-section">
      <div class="section-header">
        <span class="section-tag">{{ language === 'en' ? 'CAPABILITIES' : 'MÜMKINÇILIKLER' }}</span>
        <h2>{{ language === 'en' ? 'Key Features' : 'Esasy Aýratynlyklar' }}</h2>
      </div>
      <div class="features-grid">
        <div v-for="(feature, i) in t.about.features" :key="i" class="feature-item">
          <div class="feature-check"><i class="pi pi-check"></i></div>
          <span>{{ feature }}</span>
        </div>
      </div>
    </div>

    <!-- Tech Stack -->
    <Card class="tech-card">
      <template #content>
        <div class="section-header">
          <span class="section-tag">{{ language === 'en' ? 'STACK' : 'STEK' }}</span>
          <h2>{{ language === 'en' ? 'Technology Stack' : 'Tehnologiýa' }}</h2>
        </div>
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
            <div class="tech-icon wireshark"><i class="pi pi-sitemap"></i></div>
            <span class="tech-name">Wireshark</span>
            <span class="tech-desc">{{ language === 'en' ? 'Reference' : 'Salgylanma' }}</span>
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
        <div class="section-header">
          <span class="section-tag">{{ language === 'en' ? 'DEVELOPER' : 'DÖREDIJI' }}</span>
          <h2>{{ t.about.author.title }}</h2>
        </div>
        <div class="author-info">
          <div class="author-avatar">
            <span class="avatar-initials">ŞG</span>
            <div class="avatar-ring"></div>
          </div>
          <div class="author-details">
            <h3>{{ t.about.author.name }}</h3>
            <Tag severity="info" :value="t.about.author.project" class="project-tag" />
            <div class="topics">
              <div class="topic-item">
                <span class="topic-lang en">EN</span>
                <span>{{ t.about.author.topic }}</span>
              </div>
              <div class="topic-item">
                <span class="topic-lang tm">TM</span>
                <span>{{ t.about.author.topicTk }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Footer -->
    <div class="about-footer">
      <div class="footer-pulse">
        <span class="pulse-line"></span>
        <span class="pulse-line"></span>
        <span class="pulse-line"></span>
      </div>
      <p>&copy; 2026 WireGuard Monitor</p>
      <p class="footer-sub">{{ language === 'en' ? 'Analyzing Network Flow' : 'Tor Akymyny Seljermek' }}</p>
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
  position: relative;
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cyber-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 212, 170, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 170, 0.03) 1px, transparent 1px);
  background-size: 25px 25px;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.orb-1 {
  width: 250px;
  height: 250px;
  background: var(--cyber-primary);
  top: -80px;
  right: -80px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: var(--cyber-secondary);
  bottom: -60px;
  left: -60px;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-emblem {
  width: 100px;
  height: 100px;
  background: var(--cyber-gradient);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 20px 50px var(--cyber-glow);
  position: relative;
}

.emblem-rings {
  position: absolute;
  inset: -25px;
}

.ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--cyber-primary);
  border-radius: 35px;
  opacity: 0;
  animation: ringPulse 3s ease-out infinite;
}

.ring:nth-child(2) { animation-delay: 1s; }
.ring:nth-child(3) { animation-delay: 2s; }

@keyframes ringPulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0; }
}

.hero-emblem i {
  font-size: 2.5rem;
  color: white;
  position: relative;
  z-index: 1;
}

.about-hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  font-family: 'JetBrains Mono', monospace;
}

.about-hero h1 span {
  background: var(--cyber-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.version {
  display: inline-block;
  background: var(--cyber-gradient);
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', monospace;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.section-tag {
  display: inline-block;
  background: rgba(0, 212, 170, 0.1);
  color: var(--cyber-primary);
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Description Card */
.desc-card { margin-bottom: 2rem; }

.desc-icon {
  width: 50px;
  height: 50px;
  background: var(--cyber-gradient);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.desc-icon i {
  font-size: 1.5rem;
  color: white;
}

.desc-card p {
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.05rem;
}

/* Features Section */
.features-section { margin-bottom: 2rem; }

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
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: var(--cyber-primary);
  transform: translateX(8px);
  box-shadow: 0 8px 25px var(--cyber-glow);
}

.feature-check {
  width: 32px;
  height: 32px;
  background: var(--cyber-gradient);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-check i {
  color: white;
  font-size: 0.9rem;
}

/* Tech Card */
.tech-card { margin-bottom: 2rem; }

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.tech-item {
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--bg-primary);
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.tech-item:hover {
  transform: translateY(-8px);
  border-color: var(--cyber-primary);
  box-shadow: 0 15px 40px var(--cyber-glow);
}

.tech-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
}

.tech-item:hover .tech-icon {
  transform: scale(1.1) rotate(5deg);
}

.tech-icon i { font-size: 1.5rem; color: white; }

.tech-icon.vue { background: linear-gradient(135deg, #42b883, #35495e); }
.tech-icon.node { background: linear-gradient(135deg, #68a063, #3c873a); }
.tech-icon.wireshark { background: linear-gradient(135deg, #00d4aa, #06b6d4); }
.tech-icon.primevue { background: linear-gradient(135deg, #7c3aed, #a855f7); }

.tech-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
}

.tech-desc { font-size: 0.85rem; color: var(--text-secondary); }

/* Author Card */
.author-card { margin-bottom: 2rem; }

.author-info {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.author-avatar {
  width: 100px;
  height: 100px;
  background: var(--cyber-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 15px 40px var(--cyber-glow);
  position: relative;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border: 2px solid var(--cyber-primary);
  border-radius: 50%;
  opacity: 0.5;
  animation: avatarPulse 2s ease-in-out infinite;
}

@keyframes avatarPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

.avatar-initials {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  font-family: 'JetBrains Mono', monospace;
}

.author-details h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.project-tag {
  background: var(--cyber-gradient) !important;
  border: none !important;
}

.topics { margin-top: 1rem; }

.topic-item {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--bg-primary);
  border-radius: 10px;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.topic-item:hover {
  border-color: var(--cyber-primary);
}

.topic-lang {
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.topic-lang.en {
  background: linear-gradient(135deg, #00d4aa, #06b6d4);
  color: white;
}

.topic-lang.tm {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
}

/* Footer */
.about-footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.footer-pulse {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 1rem;
}

.pulse-line {
  width: 35px;
  height: 4px;
  background: var(--cyber-gradient);
  border-radius: 4px;
  animation: pulseLine 1.5s ease-in-out infinite;
}

.pulse-line:nth-child(2) { animation-delay: 0.3s; }
.pulse-line:nth-child(3) { animation-delay: 0.6s; }

@keyframes pulseLine {
  0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
  50% { opacity: 1; transform: scaleX(1); }
}

.footer-sub {
  font-size: 0.9rem;
  margin-top: 0.25rem;
  background: var(--cyber-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
  .author-info { flex-direction: column; align-items: center; text-align: center; }
  .about-hero h1 { font-size: 1.75rem; }
  .topics { text-align: left; }

  .about-hero {
    padding: 2.5rem 1.25rem;
    border-radius: 16px;
  }

  .hero-emblem {
    width: 80px;
    height: 80px;
    border-radius: 22px;
  }

  .hero-emblem i {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .section-header h2 {
    font-size: 1.25rem;
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

  .desc-card p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .about-hero {
    padding: 2rem 1rem;
  }

  .about-hero h1 {
    font-size: 1.4rem;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .tech-item {
    padding: 1.25rem 1rem;
  }

  .feature-item {
    padding: 0.85rem 1rem;
  }

  .feature-item span {
    font-size: 0.85rem;
  }

  .topic-item {
    padding: 0.7rem 0.85rem;
    font-size: 0.85rem;
  }

  .author-info {
    gap: 1.25rem;
  }
}
</style>
