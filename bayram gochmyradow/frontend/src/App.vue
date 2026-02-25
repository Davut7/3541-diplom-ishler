<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <i class="pi pi-shield"></i>
          <span>{{ t('app.title') }}</span>
        </div>

        <nav class="nav-links">
          <router-link to="/" class="nav-link">
            <i class="pi pi-home"></i>
            {{ t('nav.home') }}
          </router-link>
          <router-link to="/analyze" class="nav-link">
            <i class="pi pi-search"></i>
            {{ t('nav.analyze') }}
          </router-link>
          <router-link to="/history" class="nav-link">
            <i class="pi pi-history"></i>
            {{ t('nav.history') }}
          </router-link>
          <router-link to="/test" class="nav-link">
            <i class="pi pi-play"></i>
            {{ t('nav.test') }}
          </router-link>
          <router-link to="/comparison" class="nav-link">
            <i class="pi pi-chart-bar"></i>
            {{ t('nav.comparison') }}
          </router-link>
          <router-link to="/about" class="nav-link">
            <i class="pi pi-info-circle"></i>
            {{ t('nav.about') }}
          </router-link>
        </nav>

        <div class="header-actions">
          <div class="language-selector">
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              @click="setLocale(locale.code)"
              :class="{ active: currentLocale === locale.code }"
              class="lang-btn"
            >
              {{ locale.flag }} {{ locale.name }}
            </button>
          </div>

          <button @click="toggleDarkMode" class="theme-btn">
            <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo">
            <i class="pi pi-shield"></i>
            <span>Android Security Analyzer</span>
          </div>
          <p>{{ t('footer.description') }}</p>
        </div>
        <div class="footer-links">
          <router-link to="/">{{ t('nav.home') }}</router-link>
          <router-link to="/analyze">{{ t('nav.analyze') }}</router-link>
          <router-link to="/about">{{ t('nav.about') }}</router-link>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Android Security Analyzer. {{ t('footer.rights') }}</p>
          <p class="disclaimer">{{ t('footer.disclaimer') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { availableLocales } from './locales/index.js'

const i18n = inject('i18n')

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

const currentLocale = computed(() => i18n.locale)

function t(key) {
  return i18n.t(key)
}

function setLocale(code) {
  i18n.setLocale(code)
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #10b981;
  --primary-dark: #059669;
  --secondary-color: #3b82f6;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --success-color: #22c55e;
  --text-color: #1f2937;
  --text-secondary: #6b7280;
  --bg-color: #ffffff;
  --bg-secondary: #f3f4f6;
  --border-color: #e5e7eb;
  --card-bg: #ffffff;
  --header-bg: rgba(255, 255, 255, 0.95);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dark-mode {
  --primary-color: #34d399;
  --text-color: #f3f4f6;
  --text-secondary: #9ca3af;
  --bg-color: #111827;
  --bg-secondary: #1f2937;
  --border-color: #374151;
  --card-bg: #1f2937;
  --header-bg: rgba(17, 24, 39, 0.95);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--header-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.logo i {
  font-size: 1.75rem;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-color);
}

.nav-link.router-link-active {
  background: var(--primary-color);
  color: white;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-selector {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-color);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.lang-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.lang-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.theme-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.app-main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem 1.5rem;
}

.footer-info {
  margin-bottom: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}

.footer-info p {
  color: var(--text-secondary);
  max-width: 400px;
}

.footer-links {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.disclaimer {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    padding: 1rem;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-link span {
    display: none;
  }

  .language-selector {
    flex-wrap: wrap;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
