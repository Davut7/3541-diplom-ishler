<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <i class="pi pi-shield" style="font-size: 1.5rem; color: var(--primary-color)"></i>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #00d4aa;
  --primary-dark: #00a88a;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --success-color: #10b981;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}

.dark-mode {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-accent {
  color: var(--primary-color);
}

.header-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.nav-link:hover {
  background: var(--bg-primary);
  color: var(--primary-color);
}

.nav-link.router-link-active {
  background: var(--primary-color);
  color: white;
}

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
  border-radius: 8px;
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
  transition: all 0.2s;
}

.lang-btn.active {
  background: var(--primary-color);
  color: white;
}

.theme-toggle {
  padding: 0.5rem;
  border: none;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.theme-toggle:hover {
  color: var(--primary-color);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
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
    padding: 1rem;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
