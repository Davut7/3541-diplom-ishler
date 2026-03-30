<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="app-container">
    <!-- Noir Background -->
    <div class="noir-bg">
      <div class="scan-line"></div>
    </div>

    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <div class="detective-badge">
            <i class="pi pi-eye"></i>
          </div>
          <span class="logo-text">OSINT<span class="logo-accent">.AI</span></span>
        </router-link>
      </div>

      <nav class="header-nav">
        <router-link to="/" class="nav-link">
          <i class="pi pi-home"></i>
          {{ t.nav.home }}
        </router-link>
        <router-link to="/analyze" class="nav-link">
          <i class="pi pi-search"></i>
          {{ t.nav.analyze }}
        </router-link>
        <router-link to="/history" class="nav-link">
          <i class="pi pi-history"></i>
          {{ t.nav.history }}
        </router-link>
        <router-link to="/how-it-works" class="nav-link">
          <i class="pi pi-question-circle"></i>
          {{ t.nav.howItWorks }}
        </router-link>
        <router-link to="/comparison" class="nav-link">
          <i class="pi pi-chart-bar"></i>
          {{ t.nav.comparison }}
        </router-link>
        <router-link to="/about" class="nav-link">
          <i class="pi pi-info-circle"></i>
          {{ t.nav.about }}
        </router-link>
      </nav>

      <div class="header-right">
        <div class="lang-switch">
          <button
            @click="setLanguage('en')"
            :class="{ active: language === 'en' }"
            class="lang-btn"
          >EN</button>
          <button
            @click="setLanguage('tk')"
            :class="{ active: language === 'tk' }"
            class="lang-btn"
          >TM</button>
        </div>
        <button @click="toggleDarkMode" class="theme-toggle">
          <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <router-view :t="t" :language="language" />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-badge">
        <span class="dot"></span>
        <span>INTELLIGENCE ACTIVE</span>
        <span class="dot"></span>
      </div>
      <p>&copy; 2026 OSINT.AI - {{ t.footer.diploma }}</p>
      <p>{{ t.footer.author }}: Süleýman Akmuhammedow</p>
    </footer>
  </div>
</template>

<script>
import { ref, computed, provide } from 'vue'
import { translations } from './locales'

export default {
  name: 'App',
  setup() {
    const language = ref(localStorage.getItem('osint-language') || 'en')
    const isDarkMode = ref(localStorage.getItem('osint-darkmode') === 'true')

    const t = computed(() => translations[language.value])

    const setLanguage = (lang) => {
      language.value = lang
      localStorage.setItem('osint-language', lang)
    }

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('osint-darkmode', isDarkMode.value)
    }

    // Provide to all components
    provide('language', language)
    provide('t', t)

    return {
      language,
      isDarkMode,
      t,
      setLanguage,
      toggleDarkMode
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&family=Courier+Prime:wght@400;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --emerald: #10b981;
  --emerald-dark: #059669;
  --emerald-light: #34d399;
  --noir-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --success-color: #10b981;
  --bg-primary: #f0fdf4;
  --bg-secondary: #ecfdf5;
  --bg-card: #ffffff;
  --text-primary: #064e3b;
  --text-secondary: #065f46;
  --border-color: #a7f3d0;
  --glow: rgba(16, 185, 129, 0.3);
}

.dark-mode {
  --bg-primary: #0a0a0f;
  --bg-secondary: #111118;
  --bg-card: #1a1a24;
  --text-primary: #d1fae5;
  --text-secondary: #6ee7b7;
  --border-color: #064e3b;
  --glow: rgba(16, 185, 129, 0.5);
}

body {
  font-family: 'Source Code Pro', monospace;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: all 0.3s ease;
  position: relative;
}

/* Noir Background */
.noir-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--emerald), transparent);
  animation: scan 4s linear infinite;
  opacity: 0.3;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--emerald);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px var(--glow);
}

.header-left {
  display: flex;
  align-items: center;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
}

.detective-badge {
  width: 48px;
  height: 48px;
  background: var(--noir-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--emerald);
  position: relative;
  box-shadow: 0 0 20px var(--glow);
}

.detective-badge i {
  font-size: 1.4rem;
  color: var(--emerald);
  animation: watchPulse 2s ease-in-out infinite;
}

@keyframes watchPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.logo-text {
  font-family: 'Courier Prime', monospace;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.logo-accent {
  color: var(--emerald);
  text-shadow: 0 0 10px var(--glow);
}

/* Navigation */
.header-nav {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid transparent;
}

.nav-link:hover {
  color: var(--emerald);
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--emerald);
}

.nav-link.router-link-active {
  background: var(--noir-gradient);
  color: var(--emerald);
  border-color: var(--emerald);
  box-shadow: 0 0 15px var(--glow);
}

/* Header Right */
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lang-switch {
  display: flex;
  gap: 0.25rem;
  background: var(--bg-primary);
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.lang-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 3px;
  font-weight: 600;
  font-size: 0.8rem;
  font-family: 'Courier Prime', monospace;
  transition: all 0.3s;
}

.lang-btn:hover {
  color: var(--emerald);
}

.lang-btn.active {
  background: var(--noir-gradient);
  color: var(--emerald);
  border: 1px solid var(--emerald);
}

.theme-toggle {
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.theme-toggle:hover {
  color: var(--emerald);
  border-color: var(--emerald);
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
  border-top: 2px solid var(--emerald);
  color: var(--text-secondary);
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.footer-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-family: 'Courier Prime', monospace;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: var(--emerald);
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--emerald);
  border-radius: 50%;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; box-shadow: 0 0 10px var(--emerald); }
  50% { opacity: 0.3; box-shadow: none; }
}

.app-footer p {
  margin: 0.25rem 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .detective-badge {
    width: 36px;
    height: 36px;
  }

  .detective-badge i {
    font-size: 1rem;
  }

  .app-main {
    padding: 1rem 0.75rem;
  }

  .app-footer {
    padding: 1rem 0.75rem;
    font-size: 0.8rem;
  }

  .footer-badge {
    font-size: 0.7rem;
    gap: 0.5rem;
  }

  .lang-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }

  .theme-toggle {
    padding: 0.4rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 0.5rem 0.75rem;
  }

  .header-right {
    gap: 0.5rem;
  }

  .logo-text {
    font-size: 1rem;
    letter-spacing: 1px;
  }

  .detective-badge {
    width: 32px;
    height: 32px;
  }

  .app-main {
    padding: 0.75rem 0.5rem;
  }

  .app-footer p {
    font-size: 0.75rem;
    word-break: break-word;
  }
}
</style>
