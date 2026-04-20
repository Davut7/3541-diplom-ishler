<template>
  <div :class="['app', { 'dark-mode': darkMode }]">
    <Toast />

    <!-- Scanline effect -->
    <div class="scanline"></div>

    <header class="app-header">
      <div class="header-container">
        <div class="header-left">
          <router-link to="/" class="logo">
            <div class="logo-icon">
              <span class="bracket">[</span>
              <i class="pi pi-shield"></i>
              <span class="bracket">]</span>
            </div>
            <div class="logo-text">
              <span class="xss">XSS</span>
              <span class="shield">_SHIELD</span>
            </div>
            <span class="cursor-blink">_</span>
          </router-link>
        </div>

        <nav class="main-nav">
          <router-link to="/" class="nav-item">
            <span class="nav-prefix">~/</span>home
          </router-link>
          <router-link to="/attack-lab" class="nav-item">
            <span class="nav-prefix">./</span>attack
          </router-link>
          <router-link to="/defense" class="nav-item">
            <span class="nav-prefix">./</span>defense
          </router-link>
          <router-link to="/scanner" class="nav-item">
            <span class="nav-prefix">./</span>scanner
          </router-link>
          <router-link to="/how-it-works" class="nav-item">
            <span class="nav-prefix">./</span>docs
          </router-link>
          <router-link to="/live-lab" class="nav-item">
            <span class="nav-prefix">./</span>lab
          </router-link>
          <router-link to="/about" class="nav-item">
            <span class="nav-prefix">./</span>about
          </router-link>
        </nav>

        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>

        <div class="header-right">
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">SECURE</span>
          </div>
          <button class="lang-btn" @click="toggleLanguage">
            <span class="btn-bracket">[</span>
            {{ language === 'en' ? 'EN' : 'TM' }}
            <span class="btn-bracket">]</span>
          </button>
          <button class="theme-btn" @click="toggleTheme">
            <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <router-view :t="t" :language="language" />
    </main>

    <div class="mobile-overlay" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

    <aside class="mobile-sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="mobile-sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <span class="bracket">[</span>
            <i class="pi pi-shield"></i>
            <span class="bracket">]</span>
          </div>
          <div class="logo-text">
            <span class="xss">XSS</span>
            <span class="shield">_SHIELD</span>
          </div>
        </div>
        <button class="mobile-close-btn" @click="mobileMenuOpen = false">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <nav class="mobile-sidebar-nav">
        <router-link to="/" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <span class="nav-prefix">~/</span>home
        </router-link>
        <router-link to="/attack-lab" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <span class="nav-prefix">./</span>attack
        </router-link>
        <router-link to="/defense" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <span class="nav-prefix">./</span>defense
        </router-link>
        <router-link to="/scanner" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <span class="nav-prefix">./</span>scanner
        </router-link>
        <router-link to="/how-it-works" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <span class="nav-prefix">./</span>docs
        </router-link>
        <router-link to="/live-lab" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <span class="nav-prefix">./</span>lab
        </router-link>
        <router-link to="/about" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <span class="nav-prefix">./</span>about
        </router-link>
      </nav>
    </aside>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-left">
          <span class="footer-prompt">root@xss-shield:~$</span>
          <span class="footer-text">echo "© 2026 Daniyar Nurmetow - Diploma Project"</span>
        </div>
        <div class="footer-right">
          <span class="connection-status">
            <span class="status-dot"></span>
            CONNECTION_SECURE
          </span>
        </div>
      </div>
    </footer>
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
    const darkMode = ref(true)
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
      if (savedDarkMode !== null) darkMode.value = savedDarkMode === 'true'
      if (savedLanguage) language.value = savedLanguage
    })

    const mobileMenuOpen = ref(false)
    const route = useRoute()

    watch(() => route.path, () => {
      mobileMenuOpen.value = false
    })

    return { darkMode, language, t, toggleTheme, toggleLanguage, mobileMenuOpen }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

  /* Light Theme (Default) */
  --cyber-bg: #f0f4f8;
  --cyber-surface: #ffffff;
  --cyber-surface-2: #e8eef3;
  --cyber-border: #c5d3e0;
  --cyber-border-glow: #00996640;
  --cyber-primary: #00996b;
  --cyber-secondary: #0088cc;
  --cyber-danger: #dc2626;
  --cyber-warning: #d97706;
  --cyber-text: #1e293b;
  --cyber-text-dim: #64748b;
  --cyber-code-bg: #f1f5f9;
  --cyber-glow: 0 0 15px rgba(0, 153, 107, 0.2);
  --cyber-glow-danger: 0 0 15px rgba(220, 38, 38, 0.2);
}

/* Dark Theme */
.dark-mode {
  --cyber-bg: #0a0e17;
  --cyber-surface: #111827;
  --cyber-surface-2: #1a2332;
  --cyber-border: #1e3a5f;
  --cyber-border-glow: #00ff8840;
  --cyber-primary: #00ff88;
  --cyber-secondary: #00d4ff;
  --cyber-danger: #ff3366;
  --cyber-warning: #ffcc00;
  --cyber-text: #e0e6ed;
  --cyber-text-dim: #a8b8cc;
  --cyber-code-bg: #0d1117;
  --cyber-glow: 0 0 20px rgba(0, 255, 136, 0.3);
  --cyber-glow-danger: 0 0 20px rgba(255, 51, 102, 0.3);
}

/* Light mode specific styles */
.app:not(.dark-mode) .scanline {
  display: none;
}

/* Light mode - remove text shadows and adjust colors */
.app:not(.dark-mode) .logo-text .xss,
.app:not(.dark-mode) .logo-text .shield {
  text-shadow: none;
}

.app:not(.dark-mode) .nav-item.router-link-active {
  box-shadow: none;
}

body {
  font-family: var(--font-mono);
  background: var(--cyber-bg);
  color: var(--cyber-text);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--cyber-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--cyber-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--cyber-primary);
}

/* Selection */
::selection {
  background: var(--cyber-primary);
  color: var(--cyber-bg);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--cyber-bg);
}

/* Dark mode terminal-style background */
.app.dark-mode {
  background:
    linear-gradient(180deg, rgba(0, 255, 136, 0.02) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 136, 0.01) 2px,
      rgba(0, 255, 136, 0.01) 4px
    ),
    var(--cyber-bg);
}

/* Scanline effect */
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  opacity: 0.3;
}

/* Header */
.app-header {
  background: var(--cyber-surface);
  border-bottom: 1px solid var(--cyber-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.dark-mode .app-header {
  background: linear-gradient(180deg, var(--cyber-surface) 0%, var(--cyber-bg) 100%);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), inset 0 -1px 0 var(--cyber-border-glow);
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--cyber-primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.logo-icon .bracket {
  color: var(--cyber-text-dim);
  font-weight: 300;
}

.logo-icon i {
  color: var(--cyber-primary);
  text-shadow: var(--cyber-glow);
  font-size: 1.25rem;
}

.logo-text .xss {
  color: var(--cyber-danger);
  text-shadow: var(--cyber-glow-danger);
}

.logo-text .shield {
  color: var(--cyber-primary);
  text-shadow: var(--cyber-glow);
}

.cursor-blink {
  color: var(--cyber-primary);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.main-nav {
  display: flex;
  gap: 0.25rem;
}

.nav-item {
  text-decoration: none;
  color: var(--cyber-text-dim);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.nav-item .nav-prefix {
  color: var(--cyber-secondary);
  opacity: 0.7;
}

.nav-item:hover {
  color: var(--cyber-primary);
  background: rgba(0, 255, 136, 0.05);
  border-color: var(--cyber-border);
}

.nav-item.router-link-active {
  color: var(--cyber-primary);
  background: rgba(0, 255, 136, 0.1);
  border-color: var(--cyber-primary);
  box-shadow: var(--cyber-glow);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid var(--cyber-primary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--cyber-primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 10px var(--cyber-primary);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.9); }
}

.status-text {
  color: var(--cyber-primary);
}

.lang-btn,
.theme-btn {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: var(--cyber-text);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.lang-btn .btn-bracket {
  color: var(--cyber-text-dim);
}

.lang-btn:hover,
.theme-btn:hover {
  border-color: var(--cyber-primary);
  color: var(--cyber-primary);
  box-shadow: var(--cyber-glow);
}

.theme-btn {
  padding: 0.5rem 0.6rem;
}

/* Main content */
.app-main {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

/* Footer */
.app-footer {
  background: var(--cyber-surface);
  border-top: 1px solid var(--cyber-border);
  padding: 1rem 2rem;
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-prompt {
  color: var(--cyber-primary);
  font-weight: 600;
}

.footer-text {
  color: var(--cyber-text-dim);
  font-size: 0.85rem;
}

.footer-right .connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--cyber-primary);
  font-weight: 500;
}

/* Global card styling for PrimeVue */
.p-card {
  background: var(--cyber-surface) !important;
  border: 1px solid var(--cyber-border) !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

.p-card .p-card-content {
  padding: 1.5rem !important;
}

/* Global button styling */
.p-button {
  font-family: var(--font-mono) !important;
  font-weight: 500 !important;
}

.p-button.p-button-danger {
  background: var(--cyber-danger) !important;
  border-color: var(--cyber-danger) !important;
}

.p-button.p-button-success {
  background: var(--cyber-primary) !important;
  border-color: var(--cyber-primary) !important;
  color: var(--cyber-bg) !important;
}

/* Input styling */
.p-inputtext,
.p-textarea,
.p-dropdown {
  font-family: var(--font-mono) !important;
  background: var(--cyber-code-bg) !important;
  border: 1px solid var(--cyber-border) !important;
  color: var(--cyber-text) !important;
}

.p-inputtext:focus,
.p-textarea:focus {
  border-color: var(--cyber-primary) !important;
  box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.2) !important;
}

/* Tag styling */
.p-tag {
  font-family: var(--font-mono) !important;
}

/* DataTable styling */
.p-datatable {
  font-family: var(--font-mono) !important;
}

.p-datatable .p-datatable-header,
.p-datatable .p-datatable-thead > tr > th {
  background: var(--cyber-surface-2) !important;
  border-color: var(--cyber-border) !important;
  color: var(--cyber-text) !important;
}

.p-datatable .p-datatable-tbody > tr {
  background: var(--cyber-surface) !important;
  border-color: var(--cyber-border) !important;
  color: var(--cyber-text) !important;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background: var(--cyber-surface-2) !important;
}

/* TabView styling */
.p-tabview .p-tabview-nav {
  background: var(--cyber-surface) !important;
  border-color: var(--cyber-border) !important;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  background: transparent !important;
  color: var(--cyber-text-dim) !important;
  border-color: transparent !important;
  font-family: var(--font-mono) !important;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  color: var(--cyber-primary) !important;
  border-color: var(--cyber-primary) !important;
}

.p-tabview .p-tabview-panels {
  background: var(--cyber-surface) !important;
  border-color: var(--cyber-border) !important;
}

/* Accordion styling */
.p-accordion .p-accordion-header .p-accordion-header-link {
  background: var(--cyber-surface-2) !important;
  border-color: var(--cyber-border) !important;
  color: var(--cyber-text) !important;
  font-family: var(--font-mono) !important;
}

.p-accordion .p-accordion-content {
  background: var(--cyber-surface) !important;
  border-color: var(--cyber-border) !important;
  color: var(--cyber-text) !important;
}

/* Toast styling */
.p-toast {
  font-family: var(--font-mono) !important;
}

/* Toggle styling */
.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
  background: var(--cyber-primary) !important;
}

/* Light Mode - PrimeVue Overrides */
.app:not(.dark-mode) .p-card {
  background: var(--cyber-surface) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

.app:not(.dark-mode) .p-inputtext,
.app:not(.dark-mode) .p-textarea,
.app:not(.dark-mode) .p-dropdown {
  background: var(--cyber-code-bg) !important;
}

.app:not(.dark-mode) .p-datatable .p-datatable-header,
.app:not(.dark-mode) .p-datatable .p-datatable-thead > tr > th {
  background: var(--cyber-surface-2) !important;
}

.app:not(.dark-mode) .p-datatable .p-datatable-tbody > tr {
  background: var(--cyber-surface) !important;
}

.app:not(.dark-mode) .p-tabview .p-tabview-nav {
  background: var(--cyber-surface) !important;
}

.app:not(.dark-mode) .p-tabview .p-tabview-panels {
  background: var(--cyber-surface) !important;
}

.app:not(.dark-mode) .p-accordion .p-accordion-header .p-accordion-header-link {
  background: var(--cyber-surface-2) !important;
}

.app:not(.dark-mode) .p-accordion .p-accordion-content {
  background: var(--cyber-surface) !important;
}

/* Dark mode PrimeVue Dialog overrides */
.dark-mode .p-dialog {
  background: var(--cyber-surface) !important;
  color: var(--cyber-text) !important;
  border-color: var(--cyber-border) !important;
}
.dark-mode .p-dialog .p-dialog-header {
  background: var(--cyber-surface) !important;
  color: var(--cyber-text) !important;
}
.dark-mode .p-dialog .p-dialog-content {
  background: var(--cyber-surface) !important;
  color: var(--cyber-text) !important;
}

/* Mobile menu button - hidden by default */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 4px;
  padding: 0.5rem 0.6rem;
  cursor: pointer;
  color: var(--cyber-primary);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  border-color: var(--cyber-primary);
  box-shadow: var(--cyber-glow);
}

/* Mobile overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Mobile sidebar */
.mobile-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: var(--cyber-surface);
  border-right: 1px solid var(--cyber-border);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.dark-mode .mobile-sidebar {
  background: linear-gradient(180deg, var(--cyber-surface) 0%, var(--cyber-bg) 100%);
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.5);
}

.mobile-sidebar.mobile-open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--cyber-border);
}

.mobile-close-btn {
  background: none;
  border: 1px solid var(--cyber-border);
  border-radius: 4px;
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  color: var(--cyber-text-dim);
  font-size: 1rem;
  transition: all 0.2s;
}

.mobile-close-btn:hover {
  color: var(--cyber-danger);
  border-color: var(--cyber-danger);
}

.mobile-sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
}

.mobile-nav-item {
  text-decoration: none;
  color: var(--cyber-text-dim);
  padding: 14px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.mobile-nav-item .nav-prefix {
  color: var(--cyber-secondary);
  opacity: 0.7;
}

.mobile-nav-item:hover {
  color: var(--cyber-primary);
  background: rgba(0, 255, 136, 0.05);
  border-left-color: var(--cyber-primary);
}

.mobile-nav-item.router-link-active {
  color: var(--cyber-primary);
  background: rgba(0, 255, 136, 0.1);
  border-left-color: var(--cyber-primary);
}

.dark-mode .mobile-nav-item.router-link-active {
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

/* Responsive */
@media (max-width: 1024px) {
  .header-container {
    flex-wrap: wrap;
    padding: 1rem;
  }

  .main-nav {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--cyber-border);
  }

  .status-indicator {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-main {
    padding: 0.75rem;
  }

  .header-container {
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }

  .main-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .logo {
    font-size: 0.95rem;
  }

  .logo-icon i {
    font-size: 1rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .footer-left {
    flex-direction: column;
    gap: 0.25rem;
  }

  .footer-text {
    font-size: 0.75rem;
  }

  .app-footer {
    padding: 0.75rem 1rem;
  }

  .lang-btn,
  .theme-btn {
    padding: 0.4rem 0.5rem;
    font-size: 0.75rem;
  }

  .header-right {
    gap: 0.5rem;
  }

  /* PrimeVue overrides for mobile */
  .p-card .p-card-content {
    padding: 1rem !important;
  }

  .p-tabview .p-tabview-nav {
    overflow-x: auto !important;
    flex-wrap: nowrap !important;
  }

  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    white-space: nowrap !important;
    font-size: 0.75rem !important;
    padding: 0.5rem 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: 0.5rem;
  }

  .header-container {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .logo-text {
    font-size: 0.85rem;
  }

  .nav-item {
    padding: 0.35rem 0.4rem;
    font-size: 0.7rem;
  }

  .footer-prompt {
    font-size: 0.75rem;
  }

  .footer-text {
    font-size: 0.7rem;
  }

  .footer-right .connection-status {
    font-size: 0.65rem;
  }
}
</style>
