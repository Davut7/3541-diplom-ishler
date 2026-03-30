<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="pi pi-shield"></i>
          <span>{{ language === 'en' ? 'KEYLOGGER PROTECTION' : 'KEYLOGGER GORAGY' }}</span>
        </div>
        <h1>{{ t.home.title }}</h1>
        <p class="hero-subtitle">{{ t.home.subtitle }}</p>
        <p class="hero-description">{{ t.home.description }}</p>
        <div class="hero-actions">
          <router-link to="/scan">
            <Button :label="t.home.startScan" icon="pi pi-search" class="primary-btn" />
          </router-link>
          <router-link to="/processes">
            <Button :label="t.home.viewProcesses" icon="pi pi-list" severity="secondary" outlined />
          </router-link>
        </div>
      </div>
      <div class="hero-visual">
        <div class="shield-container">
          <div class="shield-ring ring-1"></div>
          <div class="shield-ring ring-2"></div>
          <div class="shield-ring ring-3"></div>
          <div class="shield-icon">
            <i class="pi pi-lock"></i>
          </div>
        </div>
        <div class="floating-alerts">
          <div class="alert-item safe"><i class="pi pi-check"></i> {{ language === 'en' ? 'No hooks detected' : 'Hook tapylmady' }}</div>
          <div class="alert-item warning"><i class="pi pi-eye"></i> {{ language === 'en' ? 'Monitoring active' : 'Gözegçilik işjeň' }}</div>
          <div class="alert-item safe"><i class="pi pi-shield"></i> {{ language === 'en' ? 'Protected' : 'Goragly' }}</div>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="quick-stats">
      <div class="stat-card" v-for="stat in quickStats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.gradient }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-section">
      <h2><i class="pi pi-th-large"></i> {{ language === 'en' ? 'Protection Features' : 'Gorag Aýratynlyklary' }}</h2>
      <div class="features-grid">
        <Card v-for="(feature, key) in t.home.features" :key="key" class="feature-card">
          <template #content>
            <div class="feature-icon" :class="'icon-' + key">
              <i :class="getFeatureIcon(key)"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </template>
        </Card>
      </div>
    </section>

    <!-- Threat Types -->
    <section class="threats-section">
      <h2><i class="pi pi-exclamation-triangle"></i> {{ language === 'en' ? 'Keylogger Threat Types' : 'Keylogger Howp Görnüşleri' }}</h2>
      <div class="threats-grid">
        <div class="threat-card danger">
          <div class="threat-header">
            <Tag severity="danger" :value="language === 'en' ? 'High Risk' : 'Ýokary Howp'" />
            <span class="threat-api">SetWindowsHookEx</span>
          </div>
          <p>{{ language === 'en' ? 'Hook-based keylogger using Windows API to intercept keyboard events at system level' : 'Windows API ulanyp ulgam derejesinde klawiatura wakalaryny tutýan hook esasly keylogger' }}</p>
          <div class="threat-indicator">
            <ProgressBar :value="90" :showValue="false" style="height: 4px" />
          </div>
        </div>
        <div class="threat-card warning">
          <div class="threat-header">
            <Tag severity="warn" :value="language === 'en' ? 'Medium Risk' : 'Orta Howp'" />
            <span class="threat-api">GetAsyncKeyState</span>
          </div>
          <p>{{ language === 'en' ? 'API-based monitoring that polls keyboard state continuously' : 'Klawiatura ýagdaýyny yzygiderli barlaýan API esasly gözegçilik' }}</p>
          <div class="threat-indicator">
            <ProgressBar :value="60" :showValue="false" style="height: 4px" />
          </div>
        </div>
        <div class="threat-card info">
          <div class="threat-header">
            <Tag severity="info" :value="language === 'en' ? 'Low Risk' : 'Pes Howp'" />
            <span class="threat-api">Raw Input API</span>
          </div>
          <p>{{ language === 'en' ? 'Direct keyboard input capture using raw input devices' : 'Gönüden-göni girişli enjamlary ulanyp klawiatura giriş tutma' }}</p>
          <div class="threat-indicator">
            <ProgressBar :value="30" :showValue="false" style="height: 4px" />
          </div>
        </div>
      </div>
    </section>

    <!-- System Status -->
    <section class="status-section">
      <Card class="status-card">
        <template #content>
          <div class="status-header">
            <h2><i class="pi pi-desktop"></i> {{ language === 'en' ? 'System Status' : 'Ulgam Ýagdaýy' }}</h2>
            <Tag :severity="systemProtected ? 'success' : 'danger'"
                 :value="systemProtected ? (language === 'en' ? 'PROTECTED' : 'GORAGLY') : (language === 'en' ? 'AT RISK' : 'HOWP ASTYNDA')" />
          </div>
          <div class="status-grid">
            <div class="status-item">
              <i class="pi pi-cog"></i>
              <div class="status-info">
                <span class="status-value">{{ stats.processes }}</span>
                <span class="status-label">{{ language === 'en' ? 'Running Processes' : 'Işleýän Prosesler' }}</span>
              </div>
            </div>
            <div class="status-item">
              <i class="pi pi-link"></i>
              <div class="status-info">
                <span class="status-value">{{ stats.hooks }}</span>
                <span class="status-label">{{ language === 'en' ? 'Keyboard Hooks' : 'Klawiatura Hooklar' }}</span>
              </div>
            </div>
            <div class="status-item">
              <i class="pi pi-clock"></i>
              <div class="status-info">
                <span class="status-value">{{ stats.lastScan }}</span>
                <span class="status-label">{{ language === 'en' ? 'Last Scan' : 'Soňky Skan' }}</span>
              </div>
            </div>
            <div class="status-item">
              <i class="pi pi-shield"></i>
              <div class="status-info">
                <span class="status-value">{{ stats.daysProtected }}</span>
                <span class="status-label">{{ language === 'en' ? 'Days Protected' : 'Gorag Günleri' }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </section>

    <!-- Quick Actions -->
    <section class="actions-section">
      <Card class="actions-card">
        <template #content>
          <h2><i class="pi pi-bolt"></i> {{ language === 'en' ? 'Quick Actions' : 'Çalt Hereketler' }}</h2>
          <div class="actions-grid">
            <router-link to="/scan" class="action-btn">
              <i class="pi pi-search"></i>
              <span>{{ language === 'en' ? 'Run Quick Scan' : 'Çalt Skan' }}</span>
            </router-link>
            <router-link to="/processes" class="action-btn">
              <i class="pi pi-list"></i>
              <span>{{ language === 'en' ? 'View Processes' : 'Prosesleri Gör' }}</span>
            </router-link>
            <router-link to="/protection" class="action-btn">
              <i class="pi pi-lock"></i>
              <span>{{ language === 'en' ? 'Protection Settings' : 'Gorag Sazlamalary' }}</span>
            </router-link>
            <router-link to="/statistics" class="action-btn">
              <i class="pi pi-chart-bar"></i>
              <span>{{ language === 'en' ? 'View Statistics' : 'Statistika' }}</span>
            </router-link>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const systemProtected = ref(true)
    const stats = ref({
      processes: 156,
      hooks: 2,
      lastScan: '2h ago',
      daysProtected: 47
    })

    const quickStats = computed(() => [
      { icon: 'pi pi-shield', value: systemProtected.value ? (props.language === 'en' ? 'Protected' : 'Goragly') : (props.language === 'en' ? 'At Risk' : 'Howp'), label: props.language === 'en' ? 'System Status' : 'Ulgam Ýagdaýy', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
      { icon: 'pi pi-search', value: '0', label: props.language === 'en' ? 'Threats Found' : 'Howplar Tapyldy', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
      { icon: 'pi pi-eye', value: props.language === 'en' ? 'Active' : 'Işjeň', label: props.language === 'en' ? 'Real-time Monitor' : 'Hakyky Wagtda', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
      { icon: 'pi pi-clock', value: stats.value.lastScan, label: props.language === 'en' ? 'Last Scan' : 'Soňky Skan', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' }
    ])

    const getFeatureIcon = (key) => {
      const icons = {
        scan: 'pi pi-search',
        realtime: 'pi pi-eye',
        process: 'pi pi-cog',
        protect: 'pi pi-shield'
      }
      return icons[key] || 'pi pi-star'
    }

    return { stats, quickStats, systemProtected, getFeatureIcon }
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 2rem 0 3rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  color: var(--guard-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--guard-primary);
  margin-bottom: 1rem;
  font-weight: 500;
}

.hero-description {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.primary-btn {
  background: var(--guard-gradient) !important;
  border: none !important;
  padding: 0.85rem 1.75rem !important;
}

/* Hero Visual */
.hero-visual {
  position: relative;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shield-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.shield-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  animation: pulse-ring 3s ease-in-out infinite;
}

.ring-1 {
  inset: 0;
  border-color: rgba(239, 68, 68, 0.3);
  animation-delay: 0s;
}

.ring-2 {
  inset: -20px;
  border-color: rgba(239, 68, 68, 0.2);
  animation-delay: 0.5s;
}

.ring-3 {
  inset: -40px;
  border-color: rgba(239, 68, 68, 0.1);
  animation-delay: 1s;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
}

.shield-icon {
  position: absolute;
  inset: 0;
  background: var(--guard-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.3);
}

.shield-icon i {
  font-size: 4rem;
  color: white;
}

.floating-alerts {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  animation: float-in 0.5s ease-out both;
}

.alert-item:nth-child(1) { animation-delay: 0.3s; }
.alert-item:nth-child(2) { animation-delay: 0.5s; }
.alert-item:nth-child(3) { animation-delay: 0.7s; }

@keyframes float-in {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.alert-item.safe { border-left: 3px solid var(--guard-success); }
.alert-item.safe i { color: var(--guard-success); }
.alert-item.warning { border-left: 3px solid var(--guard-warning); }
.alert-item.warning i { color: var(--guard-warning); }

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 1.25rem;
  color: white;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Features Section */
.features-section {
  margin-bottom: 2.5rem;
}

.features-section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.features-section h2 i {
  color: var(--guard-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.icon-scan { background: linear-gradient(135deg, #ef4444, #f97316); }
.icon-realtime { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
.icon-process { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
.icon-protect { background: linear-gradient(135deg, #22c55e, #10b981); }

.feature-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
}

/* Threats Section */
.threats-section {
  margin-bottom: 2.5rem;
}

.threats-section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.threats-section h2 i {
  color: var(--guard-warning);
}

.threats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.threat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.threat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.threat-card.danger { border-left: 4px solid #ef4444; }
.threat-card.warning { border-left: 4px solid #f59e0b; }
.threat-card.info { border-left: 4px solid #3b82f6; }

.threat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.threat-api {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.threat-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Status Section */
.status-section {
  margin-bottom: 2.5rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  margin: 0;
}

.status-header h2 i {
  color: var(--guard-primary);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: 10px;
}

.status-item i {
  font-size: 1.5rem;
  color: var(--guard-primary);
}

.status-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
}

.status-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Actions Section */
.actions-section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.actions-section h2 i {
  color: var(--guard-primary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.action-btn:hover {
  background: var(--guard-gradient);
  color: white;
  border-color: transparent;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
}

.action-btn i {
  font-size: 1.5rem;
}

.action-btn span {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-visual {
    display: none;
  }

  .hero-actions {
    justify-content: center;
  }

  .quick-stats,
  .features-grid,
  .status-grid,
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .threats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 1rem 0 2rem;
    gap: 1.5rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
  }

  .hero-description {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .hero-badge {
    margin-bottom: 1rem;
  }

  .threat-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .status-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 1.75rem;
  }

  .quick-stats,
  .features-grid,
  .status-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions a,
  .hero-actions .primary-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .hero-badge {
    font-size: 0.65rem;
    padding: 0.35rem 0.75rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .feature-icon {
    width: 50px;
    height: 50px;
  }

  .threat-card {
    padding: 1rem;
  }

  .status-item {
    padding: 0.75rem;
  }

  .action-btn {
    padding: 1rem;
  }
}
</style>
