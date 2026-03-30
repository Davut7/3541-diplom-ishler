<template>
  <div :class="['app', { 'dark-mode': darkMode }]">
    <Toast position="top-right" />

    <!-- Animated Fire Background -->
    <div class="fire-bg">
      <div class="fire-particles">
        <span v-for="n in 30" :key="'particle-'+n" class="particle"
          :style="{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`
          }"></span>
      </div>
      <div class="fire-glow"></div>
    </div>

    <!-- Header -->
    <header class="app-header">
      <div class="header-container">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <i class="pi pi-shield"></i>
            <div class="logo-flames">
              <span class="flame f1"></span>
              <span class="flame f2"></span>
              <span class="flame f3"></span>
            </div>
          </div>
          <div class="logo-text">
            <span class="logo-ai">AI</span>
            <span class="logo-firewall">FIREWALL</span>
          </div>
        </router-link>

        <nav class="main-nav">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link">
            <i :class="item.icon"></i>
            <span>{{ t.nav[item.key] }}</span>
          </router-link>
        </nav>

        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>

        <div class="header-actions">
          <div class="status-indicator" :class="{ active: systemActive }">
            <span class="status-dot"></span>
            <span class="status-text">{{ systemActive ? 'Protected' : 'Inactive' }}</span>
          </div>
          <button class="action-btn lang-btn" @click="toggleLanguage" v-tooltip.bottom="'Switch Language'">
            <span>{{ language === 'en' ? 'TM' : 'EN' }}</span>
          </button>
          <button class="action-btn theme-btn" @click="toggleTheme" v-tooltip.bottom="darkMode ? 'Light Mode' : 'Dark Mode'">
            <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

    <!-- Mobile Sidebar -->
    <aside class="mobile-sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="mobile-sidebar-header">
        <div class="mobile-logo-icon">
          <i class="pi pi-shield"></i>
          <div class="logo-flames">
            <span class="flame f1"></span>
            <span class="flame f2"></span>
            <span class="flame f3"></span>
          </div>
        </div>
        <div class="logo-text">
          <span class="logo-ai">AI</span>
          <span class="logo-firewall">FIREWALL</span>
        </div>
      </div>
      <nav class="mobile-sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="'mobile-' + item.path"
          :to="item.path"
          class="mobile-nav-link"
          @click="mobileMenuOpen = false"
        >
          <i :class="item.icon"></i>
          <span>{{ t.nav[item.key] }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="app-main">
      <router-view :t="t" :language="language" :darkMode="darkMode" />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-flames">
            <span class="mini-flame"></span>
            <span class="mini-flame"></span>
            <span class="mini-flame"></span>
          </div>
          <p class="footer-tagline">Intelligent Protection Through AI</p>
        </div>
        <div class="footer-info">
          <p>&copy; 2026 <strong>Shatlyk Rahmanov</strong> - Diploma Project</p>
          <p class="footer-topic">Emeli intellekt bilen firewall awtomatizasiýasy</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import en from './locales/en.js'
import tk from './locales/tk.js'

export default {
  name: 'App',
  setup() {
    const darkMode = ref(false)
    const language = ref('en')
    const systemActive = ref(true)
    const mobileMenuOpen = ref(false)
    const route = useRoute()

    watch(() => route.path, () => {
      mobileMenuOpen.value = false
    })

    const navItems = [
      { path: '/', key: 'home', icon: 'pi pi-home' },
      { path: '/rules', key: 'rules', icon: 'pi pi-list' },
      { path: '/traffic', key: 'traffic', icon: 'pi pi-arrows-h' },
      { path: '/ai', key: 'ai', icon: 'pi pi-microchip-ai' },
      { path: '/statistics', key: 'statistics', icon: 'pi pi-chart-bar' },
      { path: '/how-it-works', key: 'howItWorks', icon: 'pi pi-question-circle' },
      { path: '/about', key: 'about', icon: 'pi pi-info-circle' }
    ]

    const t = computed(() => language.value === 'en' ? en : tk)

    const toggleTheme = () => {
      darkMode.value = !darkMode.value
      localStorage.setItem('darkMode', darkMode.value)
    }

    const toggleLanguage = () => {
      language.value = language.value === 'en' ? 'tk' : 'en'
      localStorage.setItem('language', language.value)
    }

    // Simulate system status check
    let statusInterval
    onMounted(() => {
      const savedDarkMode = localStorage.getItem('darkMode')
      const savedLanguage = localStorage.getItem('language')
      if (savedDarkMode) darkMode.value = savedDarkMode === 'true'
      if (savedLanguage) language.value = savedLanguage

      statusInterval = setInterval(() => {
        systemActive.value = Math.random() > 0.02
      }, 5000)
    })

    onUnmounted(() => {
      clearInterval(statusInterval)
    })

    return {
      darkMode,
      language,
      t,
      navItems,
      systemActive,
      toggleTheme,
      toggleLanguage,
      mobileMenuOpen
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Fire Color Palette */
  --fire-red: #dc2626;
  --fire-orange: #ea580c;
  --fire-yellow: #f59e0b;
  --fire-amber: #fbbf24;
  --fire-gradient: linear-gradient(135deg, #dc2626 0%, #ea580c 35%, #f59e0b 70%, #fbbf24 100%);
  --fire-glow: 0 0 30px rgba(234, 88, 12, 0.5), 0 0 60px rgba(234, 88, 12, 0.3);

  /* Light Mode */
  --bg-primary: #fef7ed;
  --bg-secondary: #fff7ed;
  --bg-card: rgba(255, 255, 255, 0.9);
  --text-primary: #7c2d12;
  --text-secondary: #9a3412;
  --border-color: rgba(234, 88, 12, 0.3);
  --shadow-color: rgba(234, 88, 12, 0.15);

  /* Accent Colors */
  --success: #22c55e;
  --warning: #eab308;
  --danger: #ef4444;
  --info: #06b6d4;
}

.dark-mode {
  --bg-primary: #0c0a09;
  --bg-secondary: #1c1917;
  --bg-card: rgba(28, 25, 23, 0.95);
  --text-primary: #fef3c7;
  --text-secondary: #fcd34d;
  --border-color: rgba(234, 88, 12, 0.4);
  --shadow-color: rgba(234, 88, 12, 0.25);
}

body {
  font-family: 'Rajdhani', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Fire Background Animation */
.fire-bg {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 250px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.fire-particles {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
}

.particle {
  position: absolute;
  bottom: -10px;
  width: 8px;
  height: 8px;
  background: var(--fire-gradient);
  border-radius: 50%;
  animation: particle-rise 4s ease-out infinite;
  opacity: 0;
  filter: blur(1px);
}

@keyframes particle-rise {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-200px) scale(0.3) rotate(180deg);
    opacity: 0;
  }
}

.fire-glow {
  position: absolute;
  bottom: -50px;
  left: -10%;
  right: -10%;
  height: 150px;
  background: radial-gradient(ellipse at center bottom, rgba(234, 88, 12, 0.4) 0%, rgba(220, 38, 38, 0.2) 40%, transparent 70%);
  filter: blur(20px);
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; transform: scaleY(1); }
  50% { opacity: 0.9; transform: scaleY(1.1); }
}

/* Header */
.app-header {
  background: var(--bg-secondary);
  border-bottom: 3px solid;
  border-image: var(--fire-gradient) 1;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-icon {
  width: 55px;
  height: 55px;
  background: var(--fire-gradient);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: var(--fire-glow);
  animation: logo-glow 2s ease-in-out infinite;
}

@keyframes logo-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(234, 88, 12, 0.5); }
  50% { box-shadow: 0 0 35px rgba(234, 88, 12, 0.8), 0 0 60px rgba(234, 88, 12, 0.4); }
}

.logo-icon i {
  font-size: 1.6rem;
  color: white;
  z-index: 2;
}

.logo-flames {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;
}

.flame {
  width: 10px;
  height: 16px;
  background: var(--fire-gradient);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flame-flicker 0.4s ease-in-out infinite alternate;
}

.flame.f1 { animation-delay: 0s; }
.flame.f2 { animation-delay: 0.1s; height: 20px; }
.flame.f3 { animation-delay: 0.2s; }

@keyframes flame-flicker {
  0% { transform: scaleY(1) rotate(-5deg); opacity: 0.9; }
  100% { transform: scaleY(1.2) rotate(5deg); opacity: 1; }
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-ai {
  font-family: 'Orbitron', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--fire-orange);
  letter-spacing: 3px;
}

.logo-firewall {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--fire-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

/* Navigation */
.main-nav {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: var(--fire-gradient);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: var(--fire-orange);
  background: rgba(234, 88, 12, 0.1);
}

.nav-link:hover::before {
  width: 80%;
}

.nav-link.router-link-active {
  background: var(--fire-gradient);
  color: white;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.4);
}

.nav-link.router-link-active::before {
  display: none;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--success);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--success);
}

.status-indicator.active .status-dot {
  background: var(--success);
  animation: pulse-dot 2s ease-in-out infinite;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--danger);
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-primary);
  font-weight: 700;
  font-family: 'Orbitron', monospace;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: var(--fire-orange);
  color: var(--fire-orange);
  box-shadow: 0 0 20px rgba(234, 88, 12, 0.3);
  transform: translateY(-2px);
}

.lang-btn {
  width: auto;
  padding: 0 1rem;
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Footer */
.app-footer {
  background: var(--bg-secondary);
  border-top: 3px solid;
  border-image: var(--fire-gradient) 1;
  padding: 1.5rem 2rem;
  position: relative;
  z-index: 1;
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-flames {
  display: flex;
  gap: 0.5rem;
}

.mini-flame {
  width: 10px;
  height: 15px;
  background: var(--fire-gradient);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: mini-flicker 0.3s ease-in-out infinite alternate;
}

.mini-flame:nth-child(2) { animation-delay: 0.1s; height: 18px; }
.mini-flame:nth-child(3) { animation-delay: 0.2s; }

@keyframes mini-flicker {
  0% { transform: scaleY(1) rotate(-3deg); opacity: 0.8; }
  100% { transform: scaleY(1.15) rotate(3deg); opacity: 1; }
}

.footer-tagline {
  font-family: 'Orbitron', monospace;
  color: var(--fire-orange);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.footer-info {
  text-align: right;
}

.footer-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-topic {
  font-size: 0.8rem !important;
  opacity: 0.8;
  margin-top: 0.25rem;
}

/* Global Card Styles */
:deep(.p-card) {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 16px !important;
  box-shadow: 0 4px 20px var(--shadow-color) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

:deep(.p-card:hover) {
  border-color: var(--fire-orange) !important;
  box-shadow: 0 8px 30px var(--shadow-color), 0 0 20px rgba(234, 88, 12, 0.15) !important;
}

:deep(.p-card-content) {
  padding: 1.5rem !important;
}

/* Button Styles */
:deep(.p-button) {
  font-family: 'Rajdhani', sans-serif !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

:deep(.p-button-primary) {
  background: var(--fire-gradient) !important;
  border: none !important;
}

:deep(.p-button-primary:hover) {
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.5) !important;
  transform: translateY(-2px);
}

/* DataTable Styles */
:deep(.p-datatable) {
  font-family: 'Rajdhani', sans-serif !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  border-color: var(--border-color) !important;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background: transparent !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
  transition: all 0.2s ease;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: rgba(234, 88, 12, 0.05) !important;
}

/* Tag Styles */
:deep(.p-tag) {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

/* Progress Bar */
:deep(.p-progressbar) {
  background: var(--bg-primary) !important;
  border-radius: 10px !important;
}

:deep(.p-progressbar-value) {
  background: var(--fire-gradient) !important;
}

/* Toast Styles */
:deep(.p-toast-message) {
  backdrop-filter: blur(10px);
  border-radius: 12px !important;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  border-color: var(--fire-orange);
  color: var(--fire-orange);
  box-shadow: 0 0 20px rgba(234, 88, 12, 0.3);
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Mobile Sidebar */
.mobile-sidebar {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: var(--bg-secondary);
  border-right: 3px solid;
  border-image: var(--fire-gradient) 1;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-sidebar.mobile-open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid var(--border-color);
}

.mobile-logo-icon {
  width: 45px;
  height: 45px;
  background: var(--fire-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: var(--fire-glow);
  flex-shrink: 0;
}

.mobile-logo-icon i {
  font-size: 1.4rem;
  color: white;
  z-index: 2;
}

.mobile-sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  padding: 14px 20px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.mobile-nav-link:hover {
  color: var(--fire-orange);
  background: rgba(234, 88, 12, 0.1);
  border-left-color: var(--fire-orange);
}

.mobile-nav-link.router-link-active {
  background: var(--fire-gradient);
  color: white;
  border-left-color: transparent;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15);
}

.mobile-nav-link i {
  font-size: 1.15rem;
  width: 24px;
  text-align: center;
}

/* Responsive */
@media (max-width: 1200px) {
  .header-container {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .main-nav {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .mobile-sidebar {
    display: flex;
  }

  .main-nav {
    display: none;
  }

  .header-container {
    padding: 0.75rem 1rem;
    flex-wrap: nowrap;
    gap: 0.5rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .logo-icon i {
    font-size: 1.2rem;
  }

  .logo-flames {
    top: -8px;
  }

  .flame {
    width: 7px;
    height: 12px;
  }

  .flame.f2 {
    height: 15px;
  }

  .logo-ai {
    font-size: 0.8rem;
    letter-spacing: 2px;
  }

  .logo-firewall {
    font-size: 1.1rem;
    letter-spacing: 1px;
  }

  .header-actions {
    gap: 0.5rem;
  }

  .status-indicator .status-text {
    display: none;
  }

  .status-indicator {
    padding: 0.4rem 0.6rem;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }

  .lang-btn {
    padding: 0 0.75rem;
  }

  .app-main {
    padding: 0.75rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .footer-info {
    text-align: center;
  }

  .footer-tagline {
    font-size: 0.8rem;
  }

  .fire-bg {
    height: 150px;
  }

  /* Global table scroll on mobile */
  :deep(.p-datatable-wrapper) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.p-card-content) {
    padding: 1rem !important;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.5rem 0.75rem;
  }

  .logo {
    gap: 0.5rem;
  }

  .logo-icon {
    width: 35px;
    height: 35px;
  }

  .logo-ai {
    font-size: 0.7rem;
  }

  .logo-firewall {
    font-size: 0.9rem;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .app-main {
    padding: 0.5rem;
  }

  .app-footer {
    padding: 1rem;
  }

  .footer-tagline {
    font-size: 0.7rem;
  }

  .footer-info p {
    font-size: 0.8rem;
  }

  :deep(.p-card-content) {
    padding: 0.75rem !important;
  }
}
</style>
