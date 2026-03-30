<template>
  <div class="about-view">
    <div class="about-header">
      <h1>{{ t('about.title') }}</h1>
      <p>{{ t('about.description') }}</p>
    </div>

    <!-- How It Works -->
    <section class="how-it-works">
      <h2>{{ t('about.howItWorks.title') }}</h2>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-icon">
            <i class="pi pi-upload"></i>
          </div>
          <div class="step-number">1</div>
          <h3>{{ t('about.howItWorks.step1.title') }}</h3>
          <p>{{ t('about.howItWorks.step1.desc') }}</p>
        </div>
        <div class="step-card">
          <div class="step-icon">
            <i class="pi pi-cog"></i>
          </div>
          <div class="step-number">2</div>
          <h3>{{ t('about.howItWorks.step2.title') }}</h3>
          <p>{{ t('about.howItWorks.step2.desc') }}</p>
        </div>
        <div class="step-card">
          <div class="step-icon">
            <i class="pi pi-search"></i>
          </div>
          <div class="step-number">3</div>
          <h3>{{ t('about.howItWorks.step3.title') }}</h3>
          <p>{{ t('about.howItWorks.step3.desc') }}</p>
        </div>
        <div class="step-card">
          <div class="step-icon">
            <i class="pi pi-file-pdf"></i>
          </div>
          <div class="step-number">4</div>
          <h3>{{ t('about.howItWorks.step4.title') }}</h3>
          <p>{{ t('about.howItWorks.step4.desc') }}</p>
        </div>
      </div>
    </section>

    <!-- Why Use This Tool -->
    <section class="why-use">
      <h2>{{ t('about.whyUse.title') }}</h2>
      <div class="benefits-grid">
        <div class="benefit-card" v-for="(benefit, index) in benefits" :key="index">
          <i class="pi pi-check-circle"></i>
          <span>{{ benefit }}</span>
        </div>
      </div>
    </section>

    <!-- Technology Stack -->
    <section class="tech-stack">
      <h2>{{ t('about.technology.title') }}</h2>
      <div class="tech-grid">
        <div class="tech-card">
          <h3>
            <i class="pi pi-desktop"></i>
            {{ t('about.technology.frontend') }}
          </h3>
          <ul>
            <li>
              <span class="tech-name">Vue.js 3</span>
              <span class="tech-desc">Progressive JavaScript Framework</span>
            </li>
            <li>
              <span class="tech-name">PrimeVue</span>
              <span class="tech-desc">UI Component Library</span>
            </li>
            <li>
              <span class="tech-name">Vue Router</span>
              <span class="tech-desc">Official Router for Vue.js</span>
            </li>
            <li>
              <span class="tech-name">Axios</span>
              <span class="tech-desc">HTTP Client</span>
            </li>
          </ul>
        </div>
        <div class="tech-card">
          <h3>
            <i class="pi pi-server"></i>
            {{ t('about.technology.backend') }}
          </h3>
          <ul>
            <li>
              <span class="tech-name">Node.js</span>
              <span class="tech-desc">JavaScript Runtime</span>
            </li>
            <li>
              <span class="tech-name">Express.js</span>
              <span class="tech-desc">Web Application Framework</span>
            </li>
            <li>
              <span class="tech-name">Multer</span>
              <span class="tech-desc">File Upload Middleware</span>
            </li>
            <li>
              <span class="tech-name">adm-zip</span>
              <span class="tech-desc">ZIP File Processing</span>
            </li>
          </ul>
        </div>
        <div class="tech-card">
          <h3>
            <i class="pi pi-shield"></i>
            {{ t('about.technology.features') }}
          </h3>
          <ul>
            <li>
              <span class="tech-name">APK Analysis</span>
              <span class="tech-desc">Android Package Inspection</span>
            </li>
            <li>
              <span class="tech-name">Permission Database</span>
              <span class="tech-desc">70+ Known Permissions</span>
            </li>
            <li>
              <span class="tech-name">Risk Assessment</span>
              <span class="tech-desc">Multi-level Risk Scoring</span>
            </li>
            <li>
              <span class="tech-name">i18n Support</span>
              <span class="tech-desc">English & Turkmen</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Security Information -->
    <section class="security-info">
      <h2>Security & Privacy</h2>
      <div class="info-cards">
        <div class="info-card">
          <i class="pi pi-lock"></i>
          <h3>Local Processing</h3>
          <p>All APK analysis is performed on the local server. Your files are not sent to any third-party services.</p>
        </div>
        <div class="info-card">
          <i class="pi pi-trash"></i>
          <h3>Auto Cleanup</h3>
          <p>Uploaded APK files are automatically deleted after analysis is complete.</p>
        </div>
        <div class="info-card">
          <i class="pi pi-eye-slash"></i>
          <h3>No Tracking</h3>
          <p>We don't track your usage or collect any personal information.</p>
        </div>
      </div>
    </section>

    <!-- Author Section -->
    <section class="author-section">
      <h2>{{ t('about.author.title') }}</h2>
      <div class="author-card">
        <div class="author-avatar">
          <i class="pi pi-user"></i>
        </div>
        <div class="author-info">
          <h3>{{ t('about.author.name') }}</h3>
          <p class="author-role">{{ t('about.author.role') }}</p>
          <p class="author-university">{{ t('about.author.university') }}</p>
          <p class="author-department">{{ t('about.author.department') }}</p>
        </div>
        <div class="author-badge">
          <span>2026</span>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <div class="cta-content">
        <h2>Ready to analyze your APK?</h2>
        <p>Start analyzing Android applications for security vulnerabilities now.</p>
        <router-link to="/analyze" class="btn btn-primary">
          <i class="pi pi-upload"></i>
          {{ t('home.hero.uploadBtn') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const i18n = inject('i18n')

function t(key) {
  return i18n.t(key)
}

const benefits = computed(() => {
  const benefitKeys = [
    'about.whyUse.benefits.0',
    'about.whyUse.benefits.1',
    'about.whyUse.benefits.2',
    'about.whyUse.benefits.3',
    'about.whyUse.benefits.4',
    'about.whyUse.benefits.5'
  ]
  return benefitKeys.map(key => t(key))
})
</script>

<style scoped>
.about-view {
  max-width: 1200px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 4rem;
}

.about-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.about-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

section {
  margin-bottom: 4rem;
}

section h2 {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 2rem;
}

/* Steps Grid */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.step-card {
  position: relative;
  padding: 2rem 1.5rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s;
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.step-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.step-icon i {
  font-size: 1.5rem;
  color: white;
}

.step-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 30px;
  height: 30px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--primary-color);
}

.step-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.step-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.benefit-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--card-bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
}

.benefit-card i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.benefit-card span {
  font-size: 0.95rem;
}

/* Tech Grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.tech-card {
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.tech-card h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.tech-card h3 i {
  color: var(--primary-color);
}

.tech-card ul {
  list-style: none;
  padding: 0;
}

.tech-card li {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.tech-card li:last-child {
  border-bottom: none;
}

.tech-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.tech-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Security Info */
.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.info-card {
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  text-align: center;
}

.info-card i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.info-card h3 {
  margin-bottom: 0.75rem;
}

.info-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Author Section */
.author-section {
  margin-bottom: 4rem;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.author-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.author-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-avatar i {
  font-size: 3rem;
  color: white;
}

.author-info {
  flex: 1;
}

.author-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.author-role {
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.author-university {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.author-department {
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-style: italic;
}

.author-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  font-size: 0.9rem;
}

/* CTA */
.cta {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
  color: white;
}

.cta h2 {
  color: white;
  margin-bottom: 0.75rem;
}

.cta p {
  opacity: 0.9;
  margin-bottom: 2rem;
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
  background: white;
  color: var(--primary-color);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tech-grid,
  .info-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .steps-grid,
  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .about-header {
    margin-bottom: 2.5rem;
  }

  .about-header h1 {
    font-size: 1.75rem;
  }

  .about-header p {
    font-size: 0.95rem;
  }

  section {
    margin-bottom: 2.5rem;
  }

  section h2 {
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
  }

  .step-card {
    padding: 1.5rem 1.25rem;
  }

  .benefit-card {
    padding: 1rem;
  }

  .benefit-card span {
    font-size: 0.85rem;
  }

  .author-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
    gap: 1rem;
  }

  .author-avatar {
    width: 80px;
    height: 80px;
  }

  .author-avatar i {
    font-size: 2.5rem;
  }

  .author-info h3 {
    font-size: 1.25rem;
  }

  .author-badge {
    position: static;
    margin-top: 0.5rem;
  }

  .cta {
    padding: 2.5rem 1.25rem;
  }

  .cta h2 {
    font-size: 1.4rem;
  }

  .info-card {
    padding: 1.5rem;
  }

  .info-card i {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .about-header h1 {
    font-size: 1.4rem;
  }

  .about-header p {
    font-size: 0.85rem;
  }

  section h2 {
    font-size: 1.2rem;
  }

  .step-card {
    padding: 1.25rem 1rem;
  }

  .step-icon {
    width: 50px;
    height: 50px;
  }

  .step-icon i {
    font-size: 1.25rem;
  }

  .step-card h3 {
    font-size: 0.9rem;
  }

  .step-card p {
    font-size: 0.8rem;
  }

  .benefit-card {
    padding: 0.85rem;
    gap: 0.75rem;
  }

  .benefit-card i {
    font-size: 1rem;
  }

  .benefit-card span {
    font-size: 0.8rem;
  }

  .tech-card {
    padding: 1rem;
  }

  .tech-card h3 {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }

  .tech-name {
    font-size: 0.9rem;
  }

  .tech-desc {
    font-size: 0.75rem;
  }

  .info-card {
    padding: 1.25rem;
  }

  .info-card i {
    font-size: 1.75rem;
  }

  .info-card h3 {
    font-size: 1rem;
  }

  .info-card p {
    font-size: 0.8rem;
  }

  .author-card {
    padding: 1.25rem;
  }

  .author-avatar {
    width: 70px;
    height: 70px;
  }

  .author-avatar i {
    font-size: 2rem;
  }

  .author-info h3 {
    font-size: 1.1rem;
  }

  .author-role {
    font-size: 0.9rem;
  }

  .author-university,
  .author-department {
    font-size: 0.8rem;
  }

  .cta {
    padding: 2rem 1rem;
    border-radius: 1rem;
  }

  .cta h2 {
    font-size: 1.2rem;
  }

  .cta p {
    font-size: 0.85rem;
  }

  .btn {
    padding: 0.85rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
