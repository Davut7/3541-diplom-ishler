<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="pi pi-verified"></i>
          <span>Security Analysis Tool</span>
        </div>
        <h1>{{ t('home.hero.title') }}</h1>
        <p>{{ t('home.hero.subtitle') }}</p>
        <div class="hero-actions">
          <router-link to="/analyze" class="btn btn-primary">
            <i class="pi pi-upload"></i>
            {{ t('home.hero.uploadBtn') }}
          </router-link>
          <button @click="loadDemo" class="btn btn-secondary">
            <i class="pi pi-play"></i>
            {{ t('home.hero.demoBtn') }}
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="android-icon">
          <i class="pi pi-android"></i>
          <div class="scan-line"></div>
        </div>
        <div class="floating-badges">
          <span class="badge badge-danger">SMS</span>
          <span class="badge badge-warning">Camera</span>
          <span class="badge badge-success">Storage</span>
          <span class="badge badge-info">Location</span>
        </div>
      </div>
    </section>

    <!-- Live Stats Section -->
    <section class="live-stats">
      <div class="live-stats-header">
        <div class="live-indicator">
          <span class="pulse-dot"></span>
          <span>{{ language === 'en' ? 'Live System Status' : 'Ulgam ýagdaýy' }}</span>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card animated">
          <div class="stat-icon blue">
            <i class="pi pi-search"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number counter">{{ animatedStats.scansToday }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Scans Today' : 'Şu günki skanlar' }}</span>
          </div>
          <div class="stat-trend up">
            <i class="pi pi-arrow-up"></i> +12%
          </div>
        </div>
        <div class="stat-card animated">
          <div class="stat-icon red">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number counter">{{ animatedStats.threatsDetected }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Threats Detected' : 'Tapylan howplar' }}</span>
          </div>
          <div class="stat-trend down">
            <i class="pi pi-arrow-down"></i> -5%
          </div>
        </div>
        <div class="stat-card animated">
          <div class="stat-icon green">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number counter">{{ animatedStats.safeApps }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Safe Apps' : 'Howpsuz programmalar' }}</span>
          </div>
        </div>
        <div class="stat-card animated">
          <div class="stat-icon purple">
            <i class="pi pi-lock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number counter">{{ animatedStats.permissionsAnalyzed }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Permissions Analyzed' : 'Derňelen rugsat' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Sample APKs Section -->
    <section class="sample-apks">
      <h2>
        <i class="pi pi-android"></i>
        {{ language === 'en' ? 'Try Sample Analysis' : 'Synag derňewi' }}
      </h2>
      <p class="section-desc">{{ language === 'en' ? 'Click on any sample APK below to see how our analyzer works' : 'Analizatoryň nähili işleýändigini görmek üçin islendik APK-a basyň' }}</p>
      <div class="samples-grid">
        <div
          v-for="sample in sampleApks"
          :key="sample.id"
          class="sample-card"
          :class="'risk-' + sample.riskLevel"
          @click="analyzeSample(sample.id)"
        >
          <div class="sample-icon">
            <i :class="sample.icon"></i>
          </div>
          <div class="sample-info">
            <h4>{{ sample.name }}</h4>
            <p>{{ sample.description[language] || sample.description.en }}</p>
            <div class="sample-meta">
              <span class="risk-badge" :class="sample.riskLevel">{{ sample.riskLevel.toUpperCase() }}</span>
              <span class="perm-count"><i class="pi pi-lock"></i> {{ sample.permissions }}</span>
            </div>
          </div>
          <div class="sample-action">
            <i class="pi pi-chevron-right"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity Feed -->
    <section class="activity-feed">
      <h2>
        <i class="pi pi-clock"></i>
        {{ language === 'en' ? 'Recent Analysis Activity' : 'Soňky derňew işjeňligi' }}
      </h2>
      <div class="activity-list">
        <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item" :class="'type-' + activity.type">
          <div class="activity-icon">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          <div class="activity-content">
            <p>{{ activity.message[language] || activity.message.en }}</p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
          <div class="activity-status" :class="activity.status">
            {{ activity.status === 'safe' ? '✓ Safe' : activity.status === 'threat' ? '⚠ Threat' : '○ Info' }}
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-lock"></i>
        </div>
        <div class="stat-info">
          <span class="stat-number">70+</span>
          <span class="stat-label">{{ t('home.stats.permissions') }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-chart-pie"></i>
        </div>
        <div class="stat-info">
          <span class="stat-number">4</span>
          <span class="stat-label">{{ t('home.stats.categories') }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-number">15+</span>
          <span class="stat-label">{{ t('home.stats.checks') }}</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2>{{ t('home.features.title') }}</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="pi pi-lock"></i>
          </div>
          <h3>{{ t('home.features.permission.title') }}</h3>
          <p>{{ t('home.features.permission.desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="pi pi-file"></i>
          </div>
          <h3>{{ t('home.features.manifest.title') }}</h3>
          <p>{{ t('home.features.manifest.desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="pi pi-shield"></i>
          </div>
          <h3>{{ t('home.features.security.title') }}</h3>
          <p>{{ t('home.features.security.desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="pi pi-file-pdf"></i>
          </div>
          <h3>{{ t('home.features.report.title') }}</h3>
          <p>{{ t('home.features.report.desc') }}</p>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <h2>{{ t('about.howItWorks.title') }}</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>{{ t('about.howItWorks.step1.title') }}</h3>
            <p>{{ t('about.howItWorks.step1.desc') }}</p>
          </div>
        </div>
        <div class="step-arrow">
          <i class="pi pi-arrow-right"></i>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>{{ t('about.howItWorks.step2.title') }}</h3>
            <p>{{ t('about.howItWorks.step2.desc') }}</p>
          </div>
        </div>
        <div class="step-arrow">
          <i class="pi pi-arrow-right"></i>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>{{ t('about.howItWorks.step3.title') }}</h3>
            <p>{{ t('about.howItWorks.step3.desc') }}</p>
          </div>
        </div>
        <div class="step-arrow">
          <i class="pi pi-arrow-right"></i>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>{{ t('about.howItWorks.step4.title') }}</h3>
            <p>{{ t('about.howItWorks.step4.desc') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  language: {
    type: String,
    default: 'en'
  }
})

const i18n = inject('i18n')
const router = useRouter()

const language = computed(() => props.language || i18n?.locale || 'en')

// Animated statistics
const animatedStats = ref({
  scansToday: 0,
  threatsDetected: 0,
  safeApps: 0,
  permissionsAnalyzed: 0
})

const targetStats = {
  scansToday: 0,
  threatsDetected: 0,
  safeApps: 0,
  permissionsAnalyzed: 0
}

// Sample APKs from backend
const sampleApks = ref([
  {
    id: 'safe-app',
    name: 'Calculator Pro',
    icon: 'pi pi-calculator',
    description: { en: 'A simple calculator app with minimal permissions', tk: 'Az rugsatly ýönekeý kalkulýator' },
    riskLevel: 'low',
    permissions: 1
  },
  {
    id: 'medium-app',
    name: 'Social Media App',
    icon: 'pi pi-users',
    description: { en: 'Social app with camera and location access', tk: 'Kamera we ýerleşiş girelgeli sosial programma' },
    riskLevel: 'medium',
    permissions: 8
  },
  {
    id: 'suspicious-app',
    name: 'Free VPN Unlimited',
    icon: 'pi pi-shield',
    description: { en: 'VPN app requesting excessive permissions', tk: 'Artyk rugsatlar talap edýän VPN programmasy' },
    riskLevel: 'high',
    permissions: 15
  },
  {
    id: 'malware-app',
    name: 'FlashLight FREE',
    icon: 'pi pi-bolt',
    description: { en: 'Fake flashlight app - potential malware with SMS/call access', tk: 'Galp çyra programmasy - SMS/jaň girelgeli mümkin zyýanly programma' },
    riskLevel: 'critical',
    permissions: 24
  }
])

// Recent activity feed
const recentActivity = ref([])

let statsInterval = null

function t(key) {
  return i18n.t(key)
}

function loadDemo() {
  router.push({ path: '/analyze', query: { demo: 'true' } })
}

function analyzeSample(sampleId) {
  router.push({ path: '/analyze', query: { sample: sampleId } })
}

function getActivityIcon(type) {
  const icons = {
    scan: 'pi pi-search',
    warning: 'pi pi-exclamation-triangle',
    alert: 'pi pi-times-circle',
    info: 'pi pi-info-circle'
  }
  return icons[type] || 'pi pi-circle'
}

function animateStats() {
  const duration = 2000
  const steps = 60
  const interval = duration / steps

  let step = 0
  const animate = () => {
    step++
    const progress = step / steps
    const easeOut = 1 - Math.pow(1 - progress, 3)

    animatedStats.value = {
      scansToday: Math.round(targetStats.scansToday * easeOut),
      threatsDetected: Math.round(targetStats.threatsDetected * easeOut),
      safeApps: Math.round(targetStats.safeApps * easeOut),
      permissionsAnalyzed: Math.round(targetStats.permissionsAnalyzed * easeOut)
    }

    if (step < steps) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
}


onMounted(async () => {
  // Animate stats on load
  animateStats()

  // Try to fetch real sample data
  try {
    const response = await axios.get('/api/analyze/samples')
    if (response.data && Array.isArray(response.data)) {
      sampleApks.value = response.data.map(s => ({
        id: s.id,
        name: s.name,
        icon: 'pi ' + (s.icon || 'pi-android'),
        description: s.description,
        riskLevel: s.riskLevel,
        permissions: getPermCount(s.riskLevel)
      }))
    }
  } catch (e) {
    // Use default sample data
  }
})

onUnmounted(() => {
  if (statsInterval) clearInterval(statsInterval)
})

function getAppIcon(id) {
  const icons = {
    calculator: 'pi pi-calculator',
    social: 'pi pi-users',
    vpn: 'pi pi-shield',
    flashlight: 'pi pi-bolt'
  }
  return icons[id] || 'pi pi-android'
}

function getPermCount(riskLevel) {
  const counts = { low: 1, medium: 8, high: 15, critical: 24 }
  return counts[riskLevel] || 5
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Animations */
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

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Live Stats Section */
.live-stats {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.live-stats-header {
  margin-bottom: 1.5rem;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card.animated {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  position: relative;
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s ease;
}

.stat-card.animated:nth-child(1) { animation-delay: 0.1s; }
.stat-card.animated:nth-child(2) { animation-delay: 0.2s; }
.stat-card.animated:nth-child(3) { animation-delay: 0.3s; }
.stat-card.animated:nth-child(4) { animation-delay: 0.4s; }

.stat-card.animated:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-card .stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card .stat-icon i {
  font-size: 1.5rem;
  color: white;
}

.stat-card .stat-icon.blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.stat-card .stat-icon.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
.stat-card .stat-icon.green { background: linear-gradient(135deg, #22c55e, #16a34a); }
.stat-card .stat-icon.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.stat-card .stat-number.counter {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  animation: countUp 0.3s ease-out;
}

.stat-trend {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-trend.up { color: #22c55e; }
.stat-trend.down { color: #ef4444; }

/* Sample APKs Section */
.sample-apks {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.sample-apks h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.sample-apks h2 i {
  color: var(--primary-color);
}

.section-desc {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.samples-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.sample-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  animation: fadeInUp 0.5s ease-out both;
}

.sample-card:nth-child(1) { animation-delay: 0.1s; }
.sample-card:nth-child(2) { animation-delay: 0.2s; }
.sample-card:nth-child(3) { animation-delay: 0.3s; }
.sample-card:nth-child(4) { animation-delay: 0.4s; }

.sample-card:hover {
  transform: translateX(10px);
  box-shadow: var(--shadow-lg);
}

.sample-card.risk-low:hover { border-color: #22c55e; }
.sample-card.risk-medium:hover { border-color: #eab308; }
.sample-card.risk-high:hover { border-color: #f97316; }
.sample-card.risk-critical:hover { border-color: #ef4444; }

.sample-icon {
  width: 50px;
  height: 50px;
  background: var(--card-bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sample-card.risk-low .sample-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
.sample-card.risk-medium .sample-icon { background: linear-gradient(135deg, #eab308, #ca8a04); }
.sample-card.risk-high .sample-icon { background: linear-gradient(135deg, #f97316, #ea580c); }
.sample-card.risk-critical .sample-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }

.sample-icon i {
  font-size: 1.5rem;
  color: white;
}

.sample-info {
  flex: 1;
}

.sample-info h4 {
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.sample-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.sample-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sample-meta .risk-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
}

.sample-meta .risk-badge.low { background: #dcfce7; color: #16a34a; }
.sample-meta .risk-badge.medium { background: #fef9c3; color: #ca8a04; }
.sample-meta .risk-badge.high { background: #fed7aa; color: #ea580c; }
.sample-meta .risk-badge.critical { background: #fecaca; color: #dc2626; }

.perm-count {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.sample-action {
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.sample-card:hover .sample-action {
  color: var(--primary-color);
  transform: translateX(5px);
}

/* Activity Feed */
.activity-feed {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.activity-feed h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.activity-feed h2 i {
  color: var(--primary-color);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  animation: slideInRight 0.4s ease-out both;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.activity-item:nth-child(1) { animation-delay: 0.1s; }
.activity-item:nth-child(2) { animation-delay: 0.15s; }
.activity-item:nth-child(3) { animation-delay: 0.2s; }
.activity-item:nth-child(4) { animation-delay: 0.25s; }
.activity-item:nth-child(5) { animation-delay: 0.3s; }

.activity-item:hover {
  transform: translateX(5px);
  box-shadow: var(--shadow);
}

.activity-item.type-scan { border-left-color: #3b82f6; }
.activity-item.type-warning { border-left-color: #f97316; }
.activity-item.type-alert { border-left-color: #ef4444; }
.activity-item.type-info { border-left-color: #6b7280; }

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-item.type-scan .activity-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.activity-item.type-warning .activity-icon { background: rgba(249, 115, 22, 0.1); color: #f97316; }
.activity-item.type-alert .activity-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.activity-item.type-info .activity-icon { background: rgba(107, 114, 128, 0.1); color: #6b7280; }

.activity-content {
  flex: 1;
}

.activity-content p {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.activity-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.activity-status.safe { background: #dcfce7; color: #16a34a; }
.activity-status.threat { background: #fecaca; color: #dc2626; }
.activity-status.info { background: #e5e7eb; color: #6b7280; }

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 20px 60px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 20px 80px rgba(16, 185, 129, 0.5);
  }
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 2rem 0;
  animation: fadeInUp 0.8s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 2rem;
  font-size: 0.875rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.android-icon {
  position: relative;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.3);
  animation: glow 3s ease-in-out infinite, fadeInRight 0.8s ease-out;
}

.android-icon i {
  font-size: 6rem;
  color: white;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: scan 2s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { top: 10%; }
  50% { top: 90%; }
}

.floating-badges {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.badge {
  position: absolute;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: var(--shadow);
  animation: float 3s ease-in-out infinite;
}

.badge-danger {
  background: #fef2f2;
  color: #dc2626;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.badge-warning {
  background: #fffbeb;
  color: #d97706;
  top: 20%;
  right: 5%;
  animation-delay: 0.5s;
}

.badge-success {
  background: #f0fdf4;
  color: #16a34a;
  bottom: 20%;
  left: 5%;
  animation-delay: 1s;
}

.badge-info {
  background: #eff6ff;
  color: #2563eb;
  bottom: 10%;
  right: 15%;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Stats Section */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s ease;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 1.75rem;
  color: white;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Features Section */
.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  animation: fadeInUp 0.6s ease-out both;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
  background: var(--primary-color);
}

.feature-card:hover .feature-icon i {
  color: white;
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.feature-icon i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.feature-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* How It Works */
.how-it-works h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
}

.step {
  flex: 1;
  max-width: 250px;
  text-align: center;
}

.step-number {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
}

.step:hover .step-number {
  transform: scale(1.15);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

.step {
  animation: fadeInUp 0.6s ease-out both;
}

.step:nth-child(1) { animation-delay: 0.1s; }
.step:nth-child(3) { animation-delay: 0.2s; }
.step:nth-child(5) { animation-delay: 0.3s; }
.step:nth-child(7) { animation-delay: 0.4s; }

.step-content h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.step-arrow {
  display: flex;
  align-items: center;
  padding-top: 15px;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content p {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    display: none;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps {
    flex-wrap: wrap;
  }

  .step-arrow {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .samples-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-view {
    gap: 2rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    justify-content: center;
    padding: 0.85rem 1.5rem;
  }

  .stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .features h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .live-stats {
    padding: 1.25rem;
  }

  .sample-apks {
    padding: 1.25rem;
  }

  .sample-apks h2 {
    font-size: 1.25rem;
  }

  .activity-feed {
    padding: 1.25rem;
  }

  .activity-feed h2 {
    font-size: 1.25rem;
  }

  .activity-item {
    flex-wrap: wrap;
    padding: 0.75rem;
  }

  .activity-status {
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
  }

  .how-it-works h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .step {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .home-view {
    gap: 1.5rem;
  }

  .hero-content h1 {
    font-size: 1.6rem;
  }

  .hero-content p {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  .hero-badge {
    font-size: 0.75rem;
    padding: 0.35rem 0.75rem;
    margin-bottom: 1rem;
  }

  .stat-card.animated {
    padding: 1rem;
    gap: 0.75rem;
  }

  .stat-card .stat-number.counter {
    font-size: 1.4rem;
  }

  .stat-card .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-card .stat-icon i {
    font-size: 1.1rem;
  }

  .sample-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .sample-icon {
    width: 40px;
    height: 40px;
  }

  .sample-icon i {
    font-size: 1.1rem;
  }

  .sample-info h4 {
    font-size: 0.9rem;
  }

  .sample-info p {
    font-size: 0.8rem;
  }

  .activity-item {
    gap: 0.75rem;
    padding: 0.65rem;
  }

  .activity-content p {
    font-size: 0.8rem;
  }

  .stat-card {
    padding: 1rem;
    gap: 1rem;
  }

  .stat-icon {
    width: 45px;
    height: 45px;
  }

  .stat-icon i {
    font-size: 1.25rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .feature-card {
    padding: 1.25rem;
  }

  .feature-card h3 {
    font-size: 1rem;
  }

  .feature-card p {
    font-size: 0.85rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .step-content h3 {
    font-size: 0.9rem;
  }

  .step-content p {
    font-size: 0.8rem;
  }
}
</style>
