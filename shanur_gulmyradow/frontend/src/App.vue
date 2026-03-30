<template>
  <div :class="['app', { 'dark-mode': darkMode, 'sidebar-collapsed': sidebarCollapsed }]">
    <DevNavbar />
    <Toast />

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="sidebar-header">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <div class="signal-bars">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </div>
          </div>
          <div class="logo-text" v-if="!sidebarCollapsed">
            <span class="logo-main">Wire<strong>Guard</strong></span>
            <span class="logo-sub">Monitor</span>
          </div>
        </router-link>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <i :class="sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" @click="mobileMenuOpen = false">
          <i class="pi pi-home"></i>
          <span v-if="!sidebarCollapsed">{{ t.nav.home }}</span>
        </router-link>
        <router-link to="/capture" @click="mobileMenuOpen = false">
          <i class="pi pi-video"></i>
          <span v-if="!sidebarCollapsed">{{ t.nav.capture }}</span>
        </router-link>
        <router-link to="/analyze" @click="mobileMenuOpen = false">
          <i class="pi pi-search"></i>
          <span v-if="!sidebarCollapsed">{{ t.nav.analyze }}</span>
        </router-link>
        <router-link to="/protocols" @click="mobileMenuOpen = false">
          <i class="pi pi-list"></i>
          <span v-if="!sidebarCollapsed">{{ t.nav.protocols }}</span>
        </router-link>
        <router-link to="/statistics" @click="mobileMenuOpen = false">
          <i class="pi pi-chart-bar"></i>
          <span v-if="!sidebarCollapsed">{{ t.nav.statistics }}</span>
        </router-link>
        <router-link to="/how-it-works" @click="mobileMenuOpen = false">
          <i class="pi pi-question-circle"></i>
          <span v-if="!sidebarCollapsed">{{ t.nav.howItWorks }}</span>
        </router-link>
        <router-link to="/about" @click="mobileMenuOpen = false">
          <i class="pi pi-info-circle"></i>
          <span v-if="!sidebarCollapsed">{{ t.nav.about }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="status-indicator" v-if="!sidebarCollapsed">
          <span class="status-dot"></span>
          <span>{{ language === 'en' ? 'Online' : 'Onlaýn' }}</span>
        </div>
        <div class="footer-actions">
          <button class="action-btn" @click="toggleLanguage" :title="language === 'en' ? 'Türkmen' : 'English'">
            <i class="pi pi-globe"></i>
            <span v-if="!sidebarCollapsed">{{ language === 'en' ? 'TM' : 'EN' }}</span>
          </button>
          <button class="action-btn" @click="toggleTheme" :title="darkMode ? 'Light Mode' : 'Dark Mode'">
            <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

    <!-- Main Content -->
    <div class="main-wrapper">
      <header class="top-header">
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <i class="pi pi-bars"></i>
        </button>
        <div class="header-title">
          <h1>{{ currentPageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="live-badge">
            <span class="live-dot"></span>
            <span>{{ language === 'en' ? 'Live' : 'Göni' }}</span>
          </div>
        </div>
      </header>

      <main class="app-main">
        <router-view :t="t" :language="language" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import en from './locales/en.js'
import tk from './locales/tk.js'
import DevNavbar from './components/DevNavbar.vue'

export default {
  name: 'App',
  components: { DevNavbar },
  setup() {
    const route = useRoute()
    const darkMode = ref(true)
    const language = ref('en')
    const mobileMenuOpen = ref(false)
    const sidebarCollapsed = ref(false)

    const t = computed(() => language.value === 'en' ? en : tk)

    const currentPageTitle = computed(() => {
      const path = route.path
      if (path === '/') return t.value.nav.home
      if (path === '/capture') return t.value.nav.capture
      if (path === '/analyze') return t.value.nav.analyze
      if (path === '/protocols') return t.value.nav.protocols
      if (path === '/statistics') return t.value.nav.statistics
      if (path === '/how-it-works') return t.value.nav.howItWorks
      if (path === '/about') return t.value.nav.about
      return 'WireGuard Monitor'
    })

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
      if (savedDarkMode !== null) darkMode.value = savedDarkMode === 'true'
      if (savedLanguage) language.value = savedLanguage
    })

    watch(route, () => {
      mobileMenuOpen.value = false
    })

    return { darkMode, language, mobileMenuOpen, sidebarCollapsed, t, currentPageTitle, toggleTheme, toggleLanguage }
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
  --cyber-primary: #00d4aa;
  --cyber-secondary: #7c3aed;
  --cyber-accent: #06b6d4;
  --cyber-glow: rgba(0, 212, 170, 0.4);
  --cyber-purple: rgba(124, 58, 237, 0.3);
  --cyber-gradient: linear-gradient(135deg, #00d4aa 0%, #06b6d4 50%, #7c3aed 100%);
  --sidebar-width: 260px;
  --sidebar-collapsed: 70px;
  --header-height: 60px;
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --bg-sidebar: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}

.dark-mode {
  --bg-primary: #0a0f1a;
  --bg-secondary: #111827;
  --bg-card: #1e293b;
  --bg-sidebar: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
  --cyber-glow: rgba(0, 212, 170, 0.5);
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
}

/* Sidebar */
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: width 0.3s ease;
}

.sidebar-collapsed .sidebar {
  width: var(--sidebar-collapsed);
}

.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-icon {
  width: 42px;
  height: 42px;
  background: var(--cyber-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px var(--cyber-glow);
  flex-shrink: 0;
}

.signal-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 18px;
}

.bar {
  width: 3px;
  background: white;
  border-radius: 2px;
  animation: signalPulse 1.5s ease-in-out infinite;
}

.bar:nth-child(1) { height: 5px; animation-delay: 0s; }
.bar:nth-child(2) { height: 9px; animation-delay: 0.15s; }
.bar:nth-child(3) { height: 13px; animation-delay: 0.3s; }
.bar:nth-child(4) { height: 17px; animation-delay: 0.45s; }

@keyframes signalPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-main {
  font-size: 1.1rem;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
}

.logo-main strong {
  background: var(--cyber-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.logo-sub {
  font-size: 0.65rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.collapse-btn:hover {
  border-color: var(--cyber-primary);
  color: var(--cyber-primary);
}

.sidebar-collapsed .collapse-btn {
  position: absolute;
  right: -14px;
  top: 30px;
  background: var(--bg-sidebar);
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.sidebar-nav a i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-nav a:hover {
  color: var(--cyber-primary);
  background: rgba(0, 212, 170, 0.1);
}

.sidebar-nav a.router-link-active {
  background: var(--cyber-gradient);
  color: white;
  box-shadow: 0 4px 15px var(--cyber-glow);
}

.sidebar-collapsed .sidebar-nav a {
  justify-content: center;
  padding: 0.85rem;
}

.sidebar-collapsed .sidebar-nav a span {
  display: none;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 212, 170, 0.1);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  color: var(--cyber-primary);
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--cyber-primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px var(--cyber-glow);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

.sidebar-collapsed .footer-actions {
  flex-direction: column;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.6rem;
  cursor: pointer;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.action-btn:hover {
  border-color: var(--cyber-primary);
  color: var(--cyber-primary);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .main-wrapper {
  margin-left: var(--sidebar-collapsed);
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
  z-index: 100;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
}

.header-title h1 {
  font-size: 1.25rem;
  font-weight: 600;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 212, 170, 0.1);
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--cyber-primary);
  font-weight: 600;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--cyber-primary);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
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
  z-index: 150;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .main-wrapper {
    margin-left: 0;
  }

  .sidebar-collapsed .main-wrapper {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-overlay {
    display: block;
  }

  .collapse-btn {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: var(--sidebar-width);
  }

  .sidebar-nav a {
    padding: 0.75rem 1rem;
  }

  .top-header {
    padding: 0 1rem;
  }
}

@media (max-width: 640px) {
  .app-main {
    padding: 0.75rem;
  }

  .header-title h1 {
    font-size: 1rem;
  }

  .live-badge span:last-child {
    display: none;
  }

  .top-header {
    padding: 0 0.75rem;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: 0.5rem;
  }

  .header-title h1 {
    font-size: 0.9rem;
  }

  .sidebar {
    width: 85vw;
    max-width: 280px;
  }
}
</style>
