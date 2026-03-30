<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="cyber-grid"></div>
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <i class="pi pi-shield"></i>
          <span>{{ language === 'en' ? 'Network Security Tool' : 'Tor Howpsuzlyk Guraly' }}</span>
        </div>

        <div class="hero-icon">
          <div class="icon-rings">
            <span class="ring"></span>
            <span class="ring"></span>
            <span class="ring"></span>
          </div>
          <i class="pi pi-wifi"></i>
        </div>

        <h1>{{ t.home.title }}</h1>
        <p class="subtitle">{{ t.home.subtitle }}</p>
        <p class="description">{{ t.home.description }}</p>

        <div class="hero-actions">
          <router-link to="/capture">
            <Button :label="t.home.startCapture" icon="pi pi-play" class="btn-primary" />
          </router-link>
          <router-link to="/protocols">
            <Button :label="t.home.viewProtocols" icon="pi pi-list" severity="secondary" outlined class="btn-outline" />
          </router-link>
        </div>

        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-num">7+</span>
            <span class="stat-label">{{ language === 'en' ? 'Protocols' : 'Protokollar' }}</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">100%</span>
            <span class="stat-label">{{ language === 'en' ? 'Real-time' : 'Hakyky wagt' }}</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">OSI</span>
            <span class="stat-label">{{ language === 'en' ? 'Model' : 'Modeli' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="section-header">
        <span class="section-tag">{{ language === 'en' ? 'CAPABILITIES' : 'MÜMKINÇILIKLER' }}</span>
        <h2>{{ language === 'en' ? 'Powerful Features' : 'Güýçli Aýratynlyklar' }}</h2>
      </div>

      <div class="features-grid">
        <div v-for="(feature, key) in t.home.features" :key="key" class="feature-card">
          <div class="feature-icon" :class="key">
            <i :class="getFeatureIcon(key)"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
          <div class="feature-glow"></div>
        </div>
      </div>
    </section>

    <!-- Live Stats Section -->
    <section class="stats-section">
      <div class="section-header">
        <span class="section-tag">{{ language === 'en' ? 'LIVE DEMO' : 'GÖNI DEMO' }}</span>
        <h2>{{ language === 'en' ? 'Network Statistics' : 'Tor Statistikasy' }}</h2>
      </div>

      <div class="stats-card">
        <div class="stats-header">
          <div class="live-indicator">
            <span class="live-dot"></span>
            <span>{{ language === 'en' ? 'Live Data' : 'Göni Maglumat' }}</span>
          </div>
          <span class="refresh-text">{{ language === 'en' ? 'Auto-refresh: 2s' : 'Awtomatik täzeleme: 2s' }}</span>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon packets"><i class="pi pi-box"></i></div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.packets }}</span>
              <span class="stat-label">{{ language === 'en' ? 'Packets/sec' : 'Paket/sek' }}</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon bandwidth"><i class="pi pi-chart-line"></i></div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.bandwidth }}</span>
              <span class="stat-label">{{ language === 'en' ? 'Bandwidth' : 'Giňişlik' }}</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon connections"><i class="pi pi-sitemap"></i></div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.connections }}</span>
              <span class="stat-label">{{ language === 'en' ? 'Connections' : 'Baglanyşyklar' }}</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon alerts"><i class="pi pi-exclamation-triangle"></i></div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.alerts }}</span>
              <span class="stat-label">{{ language === 'en' ? 'Alerts' : 'Duýduryşlar' }}</span>
            </div>
          </div>
        </div>

        <div class="stats-visual">
          <div class="visual-bar" v-for="i in 20" :key="i" :style="{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.1}s` }"></div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>{{ language === 'en' ? 'Ready to Analyze?' : 'Seljermäge Taýýarmy?' }}</h2>
        <p>{{ language === 'en' ? 'Start capturing and analyzing network traffic now' : 'Häzir tor trafikini tutmaga we seljermäge başlaň' }}</p>
        <router-link to="/capture">
          <Button :label="language === 'en' ? 'Get Started' : 'Başla'" icon="pi pi-arrow-right" iconPos="right" class="btn-cta" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const stats = ref({
      packets: 0,
      bandwidth: '0 KB/s',
      connections: 0,
      alerts: 0
    })

    let interval

    const updateStats = () => {
      stats.value = {
        packets: Math.floor(Math.random() * 1000) + 500,
        bandwidth: (Math.random() * 10 + 1).toFixed(2) + ' MB/s',
        connections: Math.floor(Math.random() * 50) + 10,
        alerts: Math.floor(Math.random() * 5)
      }
    }

    const getFeatureIcon = (key) => {
      const icons = {
        capture: 'pi pi-download',
        analyze: 'pi pi-search',
        protocols: 'pi pi-code',
        security: 'pi pi-shield'
      }
      return icons[key] || 'pi pi-star'
    }

    onMounted(() => {
      updateStats()
      interval = setInterval(updateStats, 2000)
    })

    onUnmounted(() => {
      clearInterval(interval)
    })

    return { stats, getFeatureIcon }
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero {
  position: relative;
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  margin-bottom: 3rem;
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
    linear-gradient(rgba(0, 212, 170, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 170, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--cyber-primary);
  top: -100px;
  right: -50px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: var(--cyber-secondary);
  bottom: -80px;
  left: -50px;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 212, 170, 0.1);
  border: 1px solid rgba(0, 212, 170, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  color: var(--cyber-primary);
  font-weight: 600;
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-icon {
  width: 120px;
  height: 120px;
  background: var(--cyber-gradient);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  position: relative;
  box-shadow: 0 20px 60px var(--cyber-glow);
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 20px 60px var(--cyber-glow); }
  50% { box-shadow: 0 30px 80px var(--cyber-glow), 0 0 30px var(--cyber-glow); }
}

.icon-rings {
  position: absolute;
  inset: -30px;
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
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
}

.hero-icon i {
  font-size: 3.5rem;
  color: white;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  background: var(--cyber-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.subtitle {
  font-size: 1.25rem;
  color: var(--cyber-primary);
  margin-bottom: 1rem;
  font-weight: 500;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.description {
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.05rem;
  line-height: 1.7;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.btn-primary {
  background: var(--cyber-gradient) !important;
  border: none !important;
  padding: 0.75rem 2rem !important;
  font-weight: 600 !important;
  box-shadow: 0 10px 30px var(--cyber-glow) !important;
  transition: all 0.3s ease !important;
}

.btn-primary:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 15px 40px var(--cyber-glow) !important;
}

.btn-outline {
  border-color: var(--cyber-primary) !important;
  color: var(--cyber-primary) !important;
}

.btn-outline:hover {
  background: rgba(0, 212, 170, 0.1) !important;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.hero-stat {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  background: var(--cyber-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Features Section */
.features {
  margin-bottom: 3rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-tag {
  display: inline-block;
  background: rgba(0, 212, 170, 0.1);
  color: var(--cyber-primary);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 0.75rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s ease;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: var(--cyber-primary);
  box-shadow: 0 20px 50px var(--cyber-glow);
}

.feature-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--cyber-gradient);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature-card:hover .feature-glow {
  transform: scaleX(1);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: all 0.4s ease;
}

.feature-icon.capture { background: linear-gradient(135deg, #00d4aa, #06b6d4); }
.feature-icon.analyze { background: linear-gradient(135deg, #7c3aed, #a855f7); }
.feature-icon.protocols { background: linear-gradient(135deg, #06b6d4, #0284c7); }
.feature-icon.security { background: linear-gradient(135deg, #f59e0b, #ef4444); }

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-icon i {
  font-size: 1.75rem;
  color: white;
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  margin-bottom: 3rem;
}

.stats-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  overflow: hidden;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--cyber-primary);
}

.live-dot {
  width: 10px;
  height: 10px;
  background: var(--cyber-primary);
  border-radius: 50%;
  animation: livePulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 10px var(--cyber-glow);
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.refresh-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-item:hover {
  border-color: var(--cyber-primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--cyber-glow);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.packets { background: linear-gradient(135deg, #00d4aa, #06b6d4); }
.stat-icon.bandwidth { background: linear-gradient(135deg, #7c3aed, #a855f7); }
.stat-icon.connections { background: linear-gradient(135deg, #06b6d4, #0284c7); }
.stat-icon.alerts { background: linear-gradient(135deg, #f59e0b, #ef4444); }

.stat-icon i {
  font-size: 1.25rem;
  color: white;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.stat-item:hover .stat-value {
  color: var(--cyber-primary);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.stats-visual {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 80px;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  gap: 4px;
}

.visual-bar {
  flex: 1;
  background: var(--cyber-gradient);
  border-radius: 4px;
  animation: barPulse 2s ease-in-out infinite;
}

@keyframes barPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* CTA Section */
.cta-section {
  background: var(--cyber-gradient);
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
}

.cta-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.btn-cta {
  background: white !important;
  color: var(--cyber-primary) !important;
  border: none !important;
  padding: 1rem 2.5rem !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}

.btn-cta:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 3rem 1.5rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-num {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-content h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
  }

  .hero-stats {
    flex-wrap: wrap;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
