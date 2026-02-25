<template>
  <div :class="['app', { 'dark-mode': darkMode }]">
    <Toast />
    <header class="app-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <i class="pi pi-shield"></i>
          <span>XSS <strong>Shield</strong></span>
        </router-link>
      </div>
      <nav class="main-nav">
        <router-link to="/">{{ t.nav.home }}</router-link>
        <router-link to="/attack-lab">{{ t.nav.attackLab }}</router-link>
        <router-link to="/defense">{{ t.nav.defense }}</router-link>
        <router-link to="/scanner">{{ t.nav.scanner }}</router-link>
        <router-link to="/how-it-works">{{ t.nav.howItWorks }}</router-link>
        <router-link to="/about">{{ t.nav.about }}</router-link>
      </nav>
      <div class="header-right">
        <button class="lang-btn" @click="toggleLanguage">{{ language === 'en' ? 'TM' : 'EN' }}</button>
        <button class="theme-btn" @click="toggleTheme">
          <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>
      </div>
    </header>
    <main class="app-main">
      <router-view :t="t" :language="language" />
    </main>
    <footer class="app-footer">
      <p>&copy; 2024 Daniyar Sapargeldiyew - Diploma Project</p>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import en from './locales/en.js'
import tk from './locales/tk.js'

export default {
  name: 'App',
  setup() {
    const darkMode = ref(false)
    const language = ref('en')

    const t = computed(() => language.value === 'en' ? en : tk)

    const toggleTheme = () => {
      darkMode.value = !darkMode.value
      localStorage.setItem('darkMode', darkMode.value)
    }

    const toggleLanguage = () => {
      language.value = language.value === 'en' ? 'tk' : 'en'
      localStorage.setItem('language', language.value)
    }

    onMounted(() => {
      const savedDarkMode = localStorage.getItem('darkMode')
      const savedLanguage = localStorage.getItem('language')
      if (savedDarkMode) darkMode.value = savedDarkMode === 'true'
      if (savedLanguage) language.value = savedLanguage
    })

    return { darkMode, language, t, toggleTheme, toggleLanguage }
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
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --accent: #f97316;
  --accent-hover: #ea580c;
}

.dark-mode {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.logo i {
  font-size: 1.5rem;
  color: var(--accent);
}

.logo strong {
  color: var(--accent);
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.main-nav a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.2s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: var(--accent);
}

.header-right {
  display: flex;
  gap: 0.5rem;
}

.lang-btn,
.theme-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.2s;
}

.lang-btn:hover,
.theme-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.theme-btn {
  padding: 0.5rem 0.75rem;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 1rem 2rem;
  text-align: center;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
