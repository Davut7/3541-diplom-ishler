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

        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>

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

    <div class="mobile-overlay" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

    <div class="mobile-sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="mobile-sidebar-header">
        <div class="logo">
          <i class="pi pi-shield"></i>
          <span>{{ t('app.title') }}</span>
        </div>
      </div>
      <nav class="mobile-nav-links">
        <router-link to="/" class="mobile-nav-link">
          <i class="pi pi-home"></i>
          {{ t('nav.home') }}
        </router-link>
        <router-link to="/analyze" class="mobile-nav-link">
          <i class="pi pi-search"></i>
          {{ t('nav.analyze') }}
        </router-link>
        <router-link to="/history" class="mobile-nav-link">
          <i class="pi pi-history"></i>
          {{ t('nav.history') }}
        </router-link>
        <router-link to="/test" class="mobile-nav-link">
          <i class="pi pi-play"></i>
          {{ t('nav.test') }}
        </router-link>
        <router-link to="/comparison" class="mobile-nav-link">
          <i class="pi pi-chart-bar"></i>
          {{ t('nav.comparison') }}
        </router-link>
        <router-link to="/about" class="mobile-nav-link">
          <i class="pi pi-info-circle"></i>
          {{ t('nav.about') }}
        </router-link>
      </nav>
    </div>

    <main class="app-main">
      <router-view :language="currentLocale" />
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
          <p>&copy; 2026 Android Security Analyzer. {{ t('footer.rights') }}</p>
          <p class="author-credit">Developed by Bayram Gochmyradow</p>
          <p class="disclaimer">{{ t('footer.disclaimer') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { availableLocales } from './locales/index.js'

const route = useRoute()
const i18n = inject('i18n')
const mobileMenuOpen = ref(false)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

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
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary-color);
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.logo:hover {
  opacity: 0.8;
}

.logo i {
  font-size: 1.4rem;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.8rem;
  white-space: nowrap;
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
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-color);
  color: var(--text-secondary);
  white-space: nowrap;
  font-size: 0.8rem;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  flex-shrink: 0;
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

.author-credit {
  margin-top: 0.5rem;
  font-weight: 500;
  color: var(--primary-color);
}

.disclaimer {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

@media (max-width: 1350px) {
  .nav-link {
    padding: 0.45rem 0.5rem;
    font-size: 0.75rem;
  }

  .nav-link i {
    font-size: 0.9rem;
  }

  .logo {
    font-size: 0.85rem;
  }

  .logo i {
    font-size: 1.2rem;
  }

  .lang-btn {
    padding: 0.3rem 0.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 1150px) {
  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 0.6rem;
  }

  .nav-link i {
    font-size: 1.1rem;
  }
}

@media (max-width: 900px) {
  .header-content {
    padding: 0.75rem 1rem;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .nav-link span {
    display: inline;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    padding: 0.5rem 0.75rem;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }

  .nav-link i {
    font-size: 0.9rem;
  }

  .language-selector {
    flex-wrap: wrap;
  }

  .app-main {
    padding: 1rem 0.75rem;
  }

  .footer-content {
    padding: 2rem 1rem 1rem;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .footer-logo {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0.5rem;
  }

  .logo {
    font-size: 0.8rem;
  }

  .logo i {
    font-size: 1.1rem;
  }

  .nav-links {
    gap: 0.15rem;
  }

  .nav-link {
    padding: 0.35rem 0.45rem;
    font-size: 0.7rem;
  }

  .nav-link i {
    font-size: 0.8rem;
  }

  .lang-btn {
    padding: 0.25rem 0.4rem;
    font-size: 0.7rem;
  }

  .theme-btn {
    width: 32px;
    height: 32px;
  }

  .header-actions {
    gap: 0.5rem;
  }

  .app-main {
    padding: 0.75rem 0.5rem;
  }

  .footer-content {
    padding: 1.5rem 0.75rem 1rem;
  }

  .footer-info p {
    font-size: 0.85rem;
  }

  .footer-bottom {
    font-size: 0.75rem;
  }
}

/* Mobile menu */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.mobile-menu-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

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

.mobile-sidebar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: var(--bg-color);
  border-right: 1px solid var(--border-color);
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.mobile-sidebar.mobile-open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 14px 20px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.mobile-nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-color);
}

.mobile-nav-link.router-link-active {
  background: var(--bg-secondary);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.mobile-nav-link i {
  font-size: 1.15rem;
  width: 24px;
  text-align: center;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .mobile-sidebar {
    display: block;
  }

  .nav-links {
    display: none !important;
  }
}

/* Dark mode PrimeVue overrides */
.dark-mode .p-card {
  background: var(--card-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}
.dark-mode .p-card .p-card-content {
  color: var(--text-color) !important;
}
.dark-mode .p-datatable {
  color: var(--text-color) !important;
}
.dark-mode .p-datatable .p-datatable-thead > tr > th {
  background: var(--bg-color) !important;
  color: var(--text-secondary) !important;
  border-color: var(--border-color) !important;
}
.dark-mode .p-datatable .p-datatable-tbody > tr {
  background: var(--card-bg) !important;
  color: var(--text-color) !important;
}
.dark-mode .p-datatable .p-datatable-tbody > tr > td {
  border-color: var(--border-color) !important;
}
.dark-mode .p-datatable .p-datatable-tbody > tr:hover {
  background: rgba(52, 211, 153, 0.1) !important;
}
.dark-mode .p-paginator {
  background: var(--card-bg) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}
.dark-mode .p-inputtext {
  background: var(--bg-color) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}
.dark-mode .p-dialog {
  background: var(--card-bg) !important;
  color: var(--text-color) !important;
}
.dark-mode .p-dialog .p-dialog-header {
  background: var(--card-bg) !important;
  color: var(--text-color) !important;
}
.dark-mode .p-dialog .p-dialog-content {
  background: var(--card-bg) !important;
  color: var(--text-color) !important;
}
.dark-mode .p-progressbar {
  background: var(--border-color) !important;
}
.dark-mode .p-select {
  background: var(--bg-color) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}
.dark-mode h1, .dark-mode h2, .dark-mode h3, .dark-mode h4 {
  color: var(--text-color);
}
.dark-mode p {
  color: var(--text-secondary);
}
.dark-mode label {
  color: var(--text-secondary) !important;
}
.dark-mode code {
  background: var(--bg-color) !important;
  color: var(--primary-color) !important;
}
</style>
