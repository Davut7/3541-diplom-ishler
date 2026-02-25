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
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const i18n = inject('i18n')
const router = useRouter()

function t(key) {
  return i18n.t(key)
}

function loadDemo() {
  router.push({ path: '/analyze', query: { demo: 'true' } })
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 2rem 0;
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
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
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
}

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
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
