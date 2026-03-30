<template>
  <div :class="['app', { 'dark-mode': darkMode }]">
    <Toast />

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="sidebar-header">
        <router-link to="/" class="logo" @click="mobileMenuOpen = false">
          <div class="logo-icon">
            <i class="pi pi-shield"></i>
          </div>
          <div class="logo-text">
            <span class="logo-title">Key<strong>Guard</strong></span>
            <span class="logo-subtitle">Protection</span>
          </div>
        </router-link>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" @click="mobileMenuOpen = false" class="nav-item">
          <i class="pi pi-home"></i>
          <span>{{ t.nav.home }}</span>
        </router-link>
        <router-link to="/scan" @click="mobileMenuOpen = false" class="nav-item">
          <i class="pi pi-search"></i>
          <span>{{ t.nav.scan }}</span>
        </router-link>
        <router-link to="/processes" @click="mobileMenuOpen = false" class="nav-item">
          <i class="pi pi-list"></i>
          <span>{{ t.nav.processes }}</span>
        </router-link>
        <router-link to="/protection" @click="mobileMenuOpen = false" class="nav-item">
          <i class="pi pi-lock"></i>
          <span>{{ t.nav.protection }}</span>
        </router-link>
        <router-link to="/statistics" @click="mobileMenuOpen = false" class="nav-item">
          <i class="pi pi-chart-bar"></i>
          <span>{{ t.nav.statistics }}</span>
        </router-link>
        <router-link to="/how-it-works" @click="mobileMenuOpen = false" class="nav-item">
          <i class="pi pi-question-circle"></i>
          <span>{{ t.nav.howItWorks }}</span>
        </router-link>
        <router-link to="/about" @click="mobileMenuOpen = false" class="nav-item">
          <i class="pi pi-info-circle"></i>
          <span>{{ t.nav.about }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="protection-status" :class="{ 'active': protectionActive }">
          <i :class="protectionActive ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'"></i>
          <span>{{ protectionActive ? (language === 'en' ? 'Protected' : 'Goragly') : (language === 'en' ? 'Unprotected' : 'Goragsyz') }}</span>
        </div>
        <div class="sidebar-controls">
          <button class="control-btn" @click="toggleLanguage" :title="language === 'en' ? 'Switch to Turkmen' : 'Switch to English'">
            {{ language === 'en' ? 'TM' : 'EN' }}
          </button>
          <button class="control-btn" @click="toggleTheme" :title="darkMode ? 'Light Mode' : 'Dark Mode'">
            <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" :class="{ 'active': mobileMenuOpen }" @click="mobileMenuOpen = false"></div>

    <!-- Main Content -->
    <div class="main-wrapper">
      <header class="top-header">
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>
        <div class="header-title">
          <h1>{{ currentPageTitle }}</h1>
        </div>
        <div class="header-status">
          <div class="status-indicator" :class="{ 'scanning': isScanning }">
            <span class="status-dot"></span>
            <span class="status-text">{{ isScanning ? (language === 'en' ? 'Scanning...' : 'Skanirlenýär...') : (language === 'en' ? 'Ready' : 'Taýýar') }}</span>
          </div>
        </div>
      </header>

      <main class="app-main">
        <router-view :t="t" :language="language" @start-scan="startScan" @stop-scan="stopScan" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import en from './locales/en.js'
import tk from './locales/tk.js'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const darkMode = ref(true)
    const language = ref('en')
    const mobileMenuOpen = ref(false)
    const protectionActive = ref(true)
    const isScanning = ref(false)

    const t = computed(() => language.value === 'en' ? en : tk)

    const currentPageTitle = computed(() => {
      const path = route.path
      if (path === '/') return t.value.nav.home
      if (path === '/scan') return t.value.nav.scan
      if (path === '/processes') return t.value.nav.processes
      if (path === '/protection') return t.value.nav.protection
      if (path === '/statistics') return t.value.nav.statistics
      if (path === '/how-it-works') return t.value.nav.howItWorks
      if (path === '/about') return t.value.nav.about
      return 'KeyGuard'
    })

    const toggleTheme = () => {
      darkMode.value = !darkMode.value
      localStorage.setItem('darkMode', darkMode.value)
    }

    const toggleLanguage = () => {
      language.value = language.value === 'en' ? 'tk' : 'en'
      localStorage.setItem('language', language.value)
    }

    const startScan = () => {
      isScanning.value = true
    }

    const stopScan = () => {
      isScanning.value = false
    }

    onMounted(() => {
      const savedDarkMode = localStorage.getItem('darkMode')
      const savedLanguage = localStorage.getItem('language')
      if (savedDarkMode !== null) darkMode.value = savedDarkMode === 'true'
      if (savedLanguage) language.value = savedLanguage
    })

    watch(() => route.path, () => {
      mobileMenuOpen.value = false
    })

    return {
      darkMode, language, mobileMenuOpen, t,
      toggleTheme, toggleLanguage, currentPageTitle,
      protectionActive, isScanning, startScan, stopScan
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --guard-primary: #ef4444;
  --guard-secondary: #f97316;
  --guard-accent: #22c55e;
  --guard-gradient: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  --guard-success: #22c55e;
  --guard-warning: #f59e0b;
  --guard-danger: #ef4444;

  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #1a1a24;
  --bg-hover: #22222e;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #2a2a3a;

  --sidebar-width: 260px;
  --header-height: 64px;
}

.app:not(.dark-mode) {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --bg-hover: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

.app {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: var(--guard-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.logo-icon i {
  font-size: 1.4rem;
  color: white;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: -0.5px;
}

.logo-title strong {
  color: var(--guard-primary);
  font-weight: 700;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.nav-item i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.router-link-active {
  background: var(--guard-gradient);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.protection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--guard-danger);
}

.protection-status.active {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: var(--guard-success);
}

.protection-status i {
  font-size: 1rem;
}

.sidebar-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  flex: 1;
  padding: 0.6rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  font-family: 'JetBrains Mono', monospace;
}

.control-btn:hover {
  background: var(--bg-hover);
  color: var(--guard-primary);
  border-color: var(--guard-primary);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Top Header */
.top-header {
  height: var(--header-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-title h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mobile-menu-btn {
  display: none;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  border-color: var(--guard-primary);
  color: var(--guard-primary);
}

/* Status Indicator */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--guard-success);
}

.status-indicator.scanning {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--guard-primary);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.scanning .status-dot {
  animation: pulse 0.8s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 1.5rem;
  background: var(--bg-primary);
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-overlay.active {
  opacity: 1;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-overlay {
    display: block;
    pointer-events: none;
  }

  .mobile-overlay.active {
    pointer-events: auto;
  }

  .main-wrapper {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .app-main {
    padding: 0.75rem;
  }

  .top-header {
    padding: 0 0.75rem;
  }

  .header-title h1 {
    font-size: 1rem;
  }

  .status-text {
    display: none;
  }

  .status-indicator {
    padding: 0.4rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: 0.5rem;
  }

  .top-header {
    padding: 0 0.5rem;
    height: 52px;
  }

  .header-title h1 {
    font-size: 0.9rem;
  }

  .sidebar {
    width: 260px;
  }
}

/* Global Card Styles */
:deep(.p-card) {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.p-card .p-card-content) {
  padding: 1.25rem;
}

/* Global Button Styles */
:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

:deep(.p-button.p-button-primary) {
  background: var(--guard-gradient);
  border: none;
}

:deep(.p-button.p-button-primary:hover) {
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

/* Global responsive table wrapper */
@media (max-width: 768px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.p-datatable-wrapper) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.p-datatable table) {
    min-width: 600px;
  }

  :deep(.p-card .p-card-content) {
    padding: 0.75rem;
  }

  :deep(.p-button) {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  :deep(.p-datatable table) {
    min-width: 500px;
  }

  :deep(.p-card .p-card-content) {
    padding: 0.5rem;
  }

  :deep(.p-button) {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }

  :deep(.p-paginator) {
    flex-wrap: wrap;
    gap: 0.25rem;
    padding: 0.5rem;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--guard-primary);
}
</style>
