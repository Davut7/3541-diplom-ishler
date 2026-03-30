<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="app-container">
    <!-- Neural Network Background Animation -->
    <div class="neural-bg">
      <div class="neural-line" v-for="n in 5" :key="n" :style="{ animationDelay: `${n * 0.5}s` }"></div>
    </div>

    <header class="app-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <div class="neural-logo">
            <div class="neuron-core"></div>
            <div class="neuron-ring"></div>
            <div class="neuron-ring ring-2"></div>
          </div>
          <span class="logo-text">GAN<span class="logo-accent">Security</span></span>
        </router-link>
      </div>

      <nav class="header-nav">
        <router-link to="/" class="nav-link">
          <i class="pi pi-home"></i>
          {{ t.nav.home }}
        </router-link>
        <router-link to="/attacks" class="nav-link">
          <i class="pi pi-bolt"></i>
          {{ t.nav.attacks }}
        </router-link>
        <router-link to="/defense" class="nav-link">
          <i class="pi pi-shield"></i>
          {{ t.nav.defense }}
        </router-link>
        <router-link to="/simulator" class="nav-link">
          <i class="pi pi-play"></i>
          {{ t.nav.simulator }}
        </router-link>
        <router-link to="/statistics" class="nav-link">
          <i class="pi pi-chart-bar"></i>
          {{ t.nav.statistics }}
        </router-link>
        <router-link to="/how-it-works" class="nav-link">
          <i class="pi pi-question-circle"></i>
          {{ t.nav.howItWorks }}
        </router-link>
        <router-link to="/about" class="nav-link">
          <i class="pi pi-info-circle"></i>
          {{ t.nav.about }}
        </router-link>
      </nav>

      <div class="header-right">
        <div class="lang-switch">
          <button @click="setLanguage('en')" :class="{ active: language === 'en' }" class="lang-btn">EN</button>
          <button @click="setLanguage('tk')" :class="{ active: language === 'tk' }" class="lang-btn">TM</button>
        </div>
        <button @click="toggleDarkMode" class="theme-toggle">
          <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>
      </div>
    </header>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

    <!-- Mobile Sidebar -->
    <aside class="mobile-sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="mobile-sidebar-header">
        <div class="neural-logo">
          <div class="neuron-core"></div>
          <div class="neuron-ring"></div>
          <div class="neuron-ring ring-2"></div>
        </div>
        <span class="logo-text">GAN<span class="logo-accent">Security</span></span>
      </div>
      <nav class="mobile-sidebar-nav">
        <router-link to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <i class="pi pi-home"></i>
          {{ t.nav.home }}
        </router-link>
        <router-link to="/attacks" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <i class="pi pi-bolt"></i>
          {{ t.nav.attacks }}
        </router-link>
        <router-link to="/defense" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <i class="pi pi-shield"></i>
          {{ t.nav.defense }}
        </router-link>
        <router-link to="/simulator" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <i class="pi pi-play"></i>
          {{ t.nav.simulator }}
        </router-link>
        <router-link to="/statistics" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <i class="pi pi-chart-bar"></i>
          {{ t.nav.statistics }}
        </router-link>
        <router-link to="/how-it-works" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <i class="pi pi-question-circle"></i>
          {{ t.nav.howItWorks }}
        </router-link>
        <router-link to="/about" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <i class="pi pi-info-circle"></i>
          {{ t.nav.about }}
        </router-link>
      </nav>
    </aside>

    <main class="app-main">
      <router-view :t="t" :language="language" />
    </main>

    <footer class="app-footer">
      <div class="footer-neural">
        <span class="pulse-dot"></span>
        <span class="pulse-dot"></span>
        <span class="pulse-dot"></span>
      </div>
      <p>&copy; 2026 GAN Security - {{ t.footer.diploma }}</p>
      <p>{{ t.footer.author }}: Selbi Weliýewa</p>
    </footer>
  </div>
</template>

<script>
import { ref, computed, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { translations } from './locales'

export default {
  name: 'App',
  setup() {
    const language = ref(localStorage.getItem('gan-language') || 'en')
    const isDarkMode = ref(localStorage.getItem('gan-darkmode') === 'true')
    const mobileMenuOpen = ref(false)
    const route = useRoute()

    const t = computed(() => translations[language.value])

    const setLanguage = (lang) => {
      language.value = lang
      localStorage.setItem('gan-language', lang)
    }

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('gan-darkmode', isDarkMode.value)
    }

    watch(() => route.path, () => {
      mobileMenuOpen.value = false
    })

    provide('language', language)
    provide('t', t)

    return { language, isDarkMode, t, setLanguage, toggleDarkMode, mobileMenuOpen }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Space+Grotesk:wght@400;500;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --gradient-start: #ec4899;
  --gradient-mid: #8b5cf6;
  --gradient-end: #06b6d4;
  --neural-gradient: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%);
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --success-color: #10b981;
  --bg-primary: #faf5ff;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --text-primary: #1e1b4b;
  --text-secondary: #6b7280;
  --border-color: #e9d5ff;
  --glow-color: rgba(139, 92, 246, 0.3);
}

.dark-mode {
  --bg-primary: #0c0a1d;
  --bg-secondary: #1a1533;
  --bg-card: #1a1533;
  --text-primary: #f5f3ff;
  --text-secondary: #a5b4fc;
  --border-color: #312e81;
  --glow-color: rgba(139, 92, 246, 0.5);
}

body {
  font-family: 'Space Grotesk', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: all 0.3s;
  position: relative;
  overflow-x: hidden;
}

/* Neural Network Background */
.neural-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  opacity: 0.1;
}

.neural-line {
  position: absolute;
  width: 200%;
  height: 2px;
  background: var(--neural-gradient);
  animation: neuralFlow 8s ease-in-out infinite;
}

.neural-line:nth-child(1) { top: 20%; transform: rotate(-15deg); }
.neural-line:nth-child(2) { top: 40%; transform: rotate(10deg); }
.neural-line:nth-child(3) { top: 60%; transform: rotate(-5deg); }
.neural-line:nth-child(4) { top: 80%; transform: rotate(15deg); }
.neural-line:nth-child(5) { top: 95%; transform: rotate(-10deg); }

@keyframes neuralFlow {
  0%, 100% { transform: translateX(-50%) rotate(var(--rotation, 0deg)); opacity: 0.3; }
  50% { transform: translateX(0%) rotate(var(--rotation, 0deg)); opacity: 0.7; }
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 2px solid transparent;
  border-image: var(--neural-gradient) 1;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

/* Neural Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
}

.neural-logo {
  width: 45px;
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.neuron-core {
  width: 20px;
  height: 20px;
  background: var(--neural-gradient);
  border-radius: 50%;
  position: relative;
  z-index: 2;
  animation: pulse 2s ease-in-out infinite;
}

.neuron-ring {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(var(--bg-secondary), var(--bg-secondary)) padding-box,
              var(--neural-gradient) border-box;
  animation: rotateRing 4s linear infinite;
}

.neuron-ring.ring-2 {
  inset: 5px;
  animation-direction: reverse;
  animation-duration: 3s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px var(--glow-color); }
  50% { transform: scale(1.1); box-shadow: 0 0 30px var(--glow-color); }
}

@keyframes rotateRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-text {
  font-family: 'Exo 2', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.logo-accent {
  background: var(--neural-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navigation */
.header-nav { display: flex; gap: 0.25rem; }

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 0.3s;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--neural-gradient);
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link:hover::before {
  opacity: 0.1;
}

.nav-link.router-link-active {
  background: var(--neural-gradient);
  color: white;
  box-shadow: 0 4px 15px var(--glow-color);
}

.nav-link i,
.nav-link span {
  position: relative;
  z-index: 1;
}

/* Header Right */
.header-right { display: flex; align-items: center; gap: 1rem; }

.lang-switch {
  display: flex;
  gap: 0.25rem;
  background: var(--bg-primary);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.lang-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  font-family: 'Exo 2', sans-serif;
  transition: all 0.3s;
}

.lang-btn:hover {
  color: var(--gradient-mid);
}

.lang-btn.active {
  background: var(--neural-gradient);
  color: white;
}

.theme-toggle {
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.theme-toggle:hover {
  border-color: var(--gradient-mid);
  color: var(--gradient-mid);
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-top: 2px solid transparent;
  border-image: var(--neural-gradient) 1;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

.footer-neural {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neural-gradient);
  animation: pulseDot 1.5s ease-in-out infinite;
}

.pulse-dot:nth-child(2) { animation-delay: 0.3s; }
.pulse-dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 1; }
}

@media (max-width: 1024px) {
  .header-nav {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    max-width: 50vw;
    flex-shrink: 1;
  }
  .header-nav::-webkit-scrollbar { display: none; }
  .nav-link { white-space: nowrap; font-size: 0.8rem; padding: 0.5rem 0.75rem; }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.mobile-menu-btn:hover {
  border-color: var(--gradient-mid);
  color: var(--gradient-mid);
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
  backdrop-filter: blur(2px);
}

/* Mobile Sidebar */
.mobile-sidebar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 2px solid transparent;
  border-image: var(--neural-gradient) 1;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
  flex-direction: column;
}

.mobile-sidebar.mobile-open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(6, 182, 212, 0.08) 100%);
}

.mobile-sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 14px 20px;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.mobile-nav-link:hover {
  color: var(--text-primary);
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.06) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(6, 182, 212, 0.06) 100%);
  border-left-color: var(--gradient-mid);
}

.mobile-nav-link.router-link-active {
  background: var(--neural-gradient);
  color: white;
  border-left-color: transparent;
  box-shadow: 0 2px 10px var(--glow-color);
}

.mobile-nav-link i {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.75rem 1rem;
  }
  .header-left { flex-shrink: 0; }
  .header-nav { display: none; }
  .header-right { flex-shrink: 0; }
  .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
  .mobile-sidebar { display: flex; }
  .mobile-overlay { display: block; }
  .logo-text { font-size: 1.2rem; }
  .neural-logo { width: 35px; height: 35px; }
  .neuron-core { width: 16px; height: 16px; }
  .app-main { padding: 1rem; }
  .app-footer { padding: 1rem; }
  .app-footer p { font-size: 0.85rem; }
}

@media (max-width: 480px) {
  .app-header { padding: 0.5rem 0.75rem; }
  .logo-text { font-size: 1rem; }
  .nav-link { font-size: 0.75rem; padding: 0.4rem 0.5rem; }
  .nav-link i { font-size: 0.85rem; }
  .lang-btn { padding: 0.4rem 0.5rem; font-size: 0.7rem; }
  .theme-toggle { padding: 0.4rem; font-size: 0.9rem; }
  .header-right { gap: 0.5rem; }
  .app-main { padding: 0.75rem; }
}
</style>
