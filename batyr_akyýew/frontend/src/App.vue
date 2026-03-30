<template>
  <div :class="['app', { 'dark-mode': darkMode, 'sidebar-collapsed': sidebarCollapsed }]">
    <DevNavbar />
    <Toast />

    <!-- Login Page -->
    <LoginView v-if="!isAuthenticated" :t="t" :language="language" @login="handleLogin" />

    <!-- Main App with Sidebar -->
    <template v-else>
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <router-link to="/" class="logo">
            <i class="pi pi-shield"></i>
            <span v-if="!sidebarCollapsed">WAF <strong>Analyzer</strong></span>
          </router-link>
          <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
            <i :class="sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
          </button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-section-title" v-if="!sidebarCollapsed">{{ t.nav.main || 'Main' }}</span>
            <router-link to="/" v-tooltip.right="sidebarCollapsed ? t.nav.home : null">
              <i class="pi pi-home"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.home }}</span>
            </router-link>
            <router-link to="/analyzer" v-tooltip.right="sidebarCollapsed ? t.nav.analyzer : null">
              <i class="pi pi-search"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.analyzer }}</span>
            </router-link>
            <router-link to="/behavioral" v-tooltip.right="sidebarCollapsed ? t.nav.behavioral : null">
              <i class="pi pi-chart-line"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.behavioral }}</span>
            </router-link>
          </div>

          <div class="nav-section">
            <span class="nav-section-title" v-if="!sidebarCollapsed">{{ t.nav.security || 'Security' }}</span>
            <router-link to="/rules" v-tooltip.right="sidebarCollapsed ? t.nav.rules : null">
              <i class="pi pi-list"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.rules }}</span>
            </router-link>
            <router-link to="/logs" v-tooltip.right="sidebarCollapsed ? t.nav.logs : null">
              <i class="pi pi-file"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.logs }}</span>
            </router-link>
            <router-link to="/blocked-ips" v-tooltip.right="sidebarCollapsed ? (t.nav.blockedIPs || 'Blocked IPs') : null">
              <i class="pi pi-ban"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.blockedIPs || 'Blocked IPs' }}</span>
            </router-link>
          </div>

          <div class="nav-section">
            <span class="nav-section-title" v-if="!sidebarCollapsed">{{ t.nav.tools || 'Tools' }}</span>
            <router-link to="/statistics" v-tooltip.right="sidebarCollapsed ? t.nav.statistics : null">
              <i class="pi pi-chart-bar"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.statistics }}</span>
            </router-link>
            <router-link to="/proxy" v-tooltip.right="sidebarCollapsed ? (t.nav.proxy || 'Proxy') : null">
              <i class="pi pi-server"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.proxy || 'Proxy' }}</span>
            </router-link>
            <router-link to="/settings" v-tooltip.right="sidebarCollapsed ? (t.nav.settings || 'Settings') : null">
              <i class="pi pi-cog"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.settings || 'Settings' }}</span>
            </router-link>
          </div>

          <div class="nav-section">
            <span class="nav-section-title" v-if="!sidebarCollapsed">{{ t.nav.info || 'Info' }}</span>
            <router-link to="/how-it-works" v-tooltip.right="sidebarCollapsed ? t.nav.howItWorks : null">
              <i class="pi pi-question-circle"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.howItWorks }}</span>
            </router-link>
            <router-link to="/about" v-tooltip.right="sidebarCollapsed ? t.nav.about : null">
              <i class="pi pi-info-circle"></i>
              <span v-if="!sidebarCollapsed">{{ t.nav.about }}</span>
            </router-link>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card" v-if="user && !sidebarCollapsed">
            <div class="user-avatar">
              <i class="pi pi-user"></i>
            </div>
            <div class="user-details">
              <span class="user-name">{{ user.username }}</span>
              <span class="user-role">{{ user.role || 'Admin' }}</span>
            </div>
          </div>
          <button class="logout-btn" @click="handleLogout" v-tooltip.right="sidebarCollapsed ? 'Logout' : null">
            <i class="pi pi-sign-out"></i>
            <span v-if="!sidebarCollapsed">{{ t.nav.logout || 'Logout' }}</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="main-wrapper">
        <!-- Top Header Bar -->
        <header class="top-header">
          <div class="header-left">
            <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
            <h1 class="page-title">{{ currentPageTitle }}</h1>
          </div>
          <div class="header-right">
            <button class="header-btn" @click="toggleLanguage" v-tooltip.bottom="'Switch Language'">
              <i class="pi pi-globe"></i>
              <span>{{ language === 'en' ? 'EN' : 'TM' }}</span>
            </button>
            <button class="header-btn theme-toggle" @click="toggleTheme" v-tooltip.bottom="darkMode ? 'Light Mode' : 'Dark Mode'">
              <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
            </button>
          </div>
        </header>

        <!-- Mobile Navigation Overlay -->
        <div :class="['mobile-overlay', { active: mobileMenuOpen }]" @click="mobileMenuOpen = false"></div>
        <nav :class="['mobile-sidebar', { open: mobileMenuOpen }]">
          <div class="mobile-sidebar-header">
            <span class="logo-text">WAF Analyzer</span>
            <button @click="mobileMenuOpen = false"><i class="pi pi-times"></i></button>
          </div>
          <router-link to="/" @click="mobileMenuOpen = false"><i class="pi pi-home"></i>{{ t.nav.home }}</router-link>
          <router-link to="/rules" @click="mobileMenuOpen = false"><i class="pi pi-list"></i>{{ t.nav.rules }}</router-link>
          <router-link to="/analyzer" @click="mobileMenuOpen = false"><i class="pi pi-search"></i>{{ t.nav.analyzer }}</router-link>
          <router-link to="/behavioral" @click="mobileMenuOpen = false"><i class="pi pi-chart-line"></i>{{ t.nav.behavioral }}</router-link>
          <router-link to="/logs" @click="mobileMenuOpen = false"><i class="pi pi-file"></i>{{ t.nav.logs }}</router-link>
          <router-link to="/statistics" @click="mobileMenuOpen = false"><i class="pi pi-chart-bar"></i>{{ t.nav.statistics }}</router-link>
          <router-link to="/blocked-ips" @click="mobileMenuOpen = false"><i class="pi pi-ban"></i>{{ t.nav.blockedIPs || 'Blocked IPs' }}</router-link>
          <router-link to="/proxy" @click="mobileMenuOpen = false"><i class="pi pi-server"></i>{{ t.nav.proxy || 'Proxy' }}</router-link>
          <router-link to="/settings" @click="mobileMenuOpen = false"><i class="pi pi-cog"></i>{{ t.nav.settings || 'Settings' }}</router-link>
          <router-link to="/how-it-works" @click="mobileMenuOpen = false"><i class="pi pi-question-circle"></i>{{ t.nav.howItWorks }}</router-link>
          <router-link to="/about" @click="mobileMenuOpen = false"><i class="pi pi-info-circle"></i>{{ t.nav.about }}</router-link>
        </nav>

        <!-- Page Content -->
        <main class="app-main">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" :t="t" :language="language" />
            </transition>
          </router-view>
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <p>&copy; 2026 Batyr Akyýew - {{ t.footer.diploma }}</p>
          <p class="version">WAF Behavioral Analysis v2.0</p>
        </footer>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import en from './locales/en.js'
import tk from './locales/tk.js'
import LoginView from './views/LoginView.vue'
import DevNavbar from './components/DevNavbar.vue'

export default {
  name: 'App',
  components: { LoginView, DevNavbar },
  setup() {
    const route = useRoute()
    const darkMode = ref(false)
    const language = ref('en')
    const isAuthenticated = ref(false)
    const user = ref(null)
    const mobileMenuOpen = ref(false)
    const sidebarCollapsed = ref(false)

    const t = computed(() => language.value === 'en' ? en : tk)

    const currentPageTitle = computed(() => {
      const titles = {
        '/': t.value.nav.home,
        '/rules': t.value.nav.rules,
        '/analyzer': t.value.nav.analyzer,
        '/behavioral': t.value.nav.behavioral,
        '/logs': t.value.nav.logs,
        '/statistics': t.value.nav.statistics,
        '/blocked-ips': t.value.nav.blockedIPs || 'Blocked IPs',
        '/proxy': t.value.nav.proxy || 'Proxy',
        '/settings': t.value.nav.settings || 'Settings',
        '/how-it-works': t.value.nav.howItWorks,
        '/about': t.value.nav.about
      }
      return titles[route.path] || 'Dashboard'
    })

    const toggleTheme = () => {
      darkMode.value = !darkMode.value
      localStorage.setItem('waf-darkMode', darkMode.value)
    }

    const toggleLanguage = () => {
      language.value = language.value === 'en' ? 'tk' : 'en'
      localStorage.setItem('waf-language', language.value)
    }

    const handleLogin = (userData) => {
      isAuthenticated.value = true
      user.value = userData
    }

    const handleLogout = () => {
      localStorage.removeItem('waf_token')
      localStorage.removeItem('waf_user')
      isAuthenticated.value = false
      user.value = null
    }

    const checkAuth = () => {
      const token = localStorage.getItem('waf_token')
      const savedUser = localStorage.getItem('waf_user')
      if (token && savedUser) {
        try {
          user.value = JSON.parse(savedUser)
          isAuthenticated.value = true
        } catch (e) {
          handleLogout()
        }
      }
    }

    onMounted(() => {
      const savedDarkMode = localStorage.getItem('waf-darkMode')
      const savedLanguage = localStorage.getItem('waf-language')
      const savedCollapsed = localStorage.getItem('waf-sidebarCollapsed')
      if (savedDarkMode) darkMode.value = savedDarkMode === 'true'
      if (savedLanguage) language.value = savedLanguage
      if (savedCollapsed) sidebarCollapsed.value = savedCollapsed === 'true'

      checkAuth()
    })

    return {
      darkMode,
      language,
      t,
      isAuthenticated,
      user,
      mobileMenuOpen,
      sidebarCollapsed,
      currentPageTitle,
      toggleTheme,
      toggleLanguage,
      handleLogin,
      handleLogout
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
  --bg-primary: #f0f4f8;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e2e8f0;
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --border-color: #cbd5e0;
  --accent: #0891b2;
  --accent-hover: #0e7490;
  --accent-light: rgba(8, 145, 178, 0.1);
  --accent-gradient: linear-gradient(135deg, #06b6d4, #0891b2);
  --sidebar-bg: #0f172a;
  --sidebar-text: #94a3b8;
  --sidebar-active: #06b6d4;
  --sidebar-hover: rgba(6, 182, 212, 0.1);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 70px;
  --header-height: 64px;
}

.dark-mode {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #374151;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Page Transitions */
.page-enter-active, .page-leave-active {
  transition: all var(--transition-normal);
}
.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* App Layout */
.app {
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  transition: width var(--transition-normal);
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed .sidebar {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar .logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar .logo i {
  font-size: 1.5rem;
  color: var(--sidebar-active);
  flex-shrink: 0;
}

.sidebar .logo strong {
  color: var(--sidebar-active);
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--sidebar-text);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-active);
}

.sidebar-collapsed .collapse-btn {
  margin: 0 auto;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section-title {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--sidebar-text);
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
  white-space: nowrap;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
  white-space: nowrap;
}

.sidebar-nav a:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-active);
  border-left-color: var(--sidebar-active);
}

.sidebar-nav a.router-link-exact-active {
  background: var(--sidebar-hover);
  color: var(--sidebar-active);
  border-left-color: var(--sidebar-active);
}

.sidebar-nav a i {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-collapsed .nav-section-title {
  display: none;
}

.sidebar-collapsed .sidebar-nav a {
  justify-content: center;
  padding: 0.75rem;
}

.sidebar-collapsed .sidebar-nav a span {
  display: none;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--accent-gradient);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar i {
  color: white;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  color: var(--sidebar-text);
  font-size: 0.75rem;
}

.sidebar-footer .logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.sidebar-footer .logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.sidebar-collapsed .user-card {
  display: none;
}

.sidebar-collapsed .sidebar-footer .logout-btn span {
  display: none;
}

/* Main Content Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left var(--transition-normal);
}

.sidebar-collapsed .main-wrapper {
  margin-left: var(--sidebar-collapsed-width);
}

/* Top Header */
.top-header {
  height: var(--header-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.header-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.header-btn.theme-toggle {
  padding: 0.5rem 0.75rem;
}

.header-btn i {
  font-size: 1rem;
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 1.5rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* Footer */
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.app-footer .version {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Mobile Sidebar */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.mobile-overlay.active {
  opacity: 1;
}

.mobile-sidebar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: var(--sidebar-bg);
  z-index: 1200;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
}

.mobile-sidebar.open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-sidebar-header .logo-text {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}

.mobile-sidebar-header button {
  background: none;
  border: none;
  color: var(--sidebar-text);
  font-size: 1.25rem;
  cursor: pointer;
}

.mobile-sidebar a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all var(--transition-fast);
}

.mobile-sidebar a:hover,
.mobile-sidebar a.router-link-exact-active {
  background: var(--sidebar-hover);
  color: var(--sidebar-active);
}

.mobile-sidebar a i {
  width: 24px;
  text-align: center;
}

/* Global Component Overrides */
.p-card {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 12px !important;
  box-shadow: var(--shadow-sm) !important;
  transition: all var(--transition-fast) !important;
}

.p-card:hover {
  box-shadow: var(--shadow-md) !important;
  border-color: var(--accent) !important;
}

.p-button {
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all var(--transition-fast) !important;
}

.p-button-primary:not(.p-button-outlined):not(.p-button-text) {
  background: var(--accent-gradient) !important;
  border: none !important;
}

.p-button-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
}

.p-inputtext {
  border-radius: 8px !important;
  border: 1px solid var(--border-color) !important;
  background: var(--bg-secondary) !important;
  transition: all var(--transition-fast) !important;
}

.p-inputtext:focus {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px var(--accent-light) !important;
}

.p-tag {
  border-radius: 6px !important;
  font-weight: 600 !important;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background: var(--accent-light) !important;
}

.p-datatable .p-datatable-thead > tr > th {
  background: var(--bg-tertiary) !important;
  font-weight: 600 !important;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
  background: var(--accent-gradient) !important;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }

  .main-wrapper {
    margin-left: 0 !important;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-overlay,
  .mobile-sidebar {
    display: block;
  }

  .mobile-sidebar {
    display: flex;
  }
}

@media (max-width: 768px) {
  .app-main {
    padding: 0.75rem;
  }

  .top-header {
    padding: 0 0.75rem;
    height: 56px;
  }

  .page-title {
    font-size: 1rem;
  }

  .header-btn span {
    display: none;
  }

  .header-btn {
    padding: 0.5rem;
  }

  .app-footer {
    padding: 0.75rem;
    font-size: 0.75rem;
  }

  /* Make PrimeVue DataTables horizontally scrollable on mobile */
  .p-datatable {
    overflow-x: auto;
  }

  .p-datatable-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .p-datatable .p-datatable-thead > tr > th,
  .p-datatable .p-datatable-tbody > tr > td {
    white-space: nowrap;
    font-size: 0.8rem !important;
    padding: 0.5rem 0.6rem !important;
  }

  .p-card {
    border-radius: 10px !important;
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: 0.5rem;
  }

  .top-header {
    height: 50px;
    padding: 0 0.5rem;
  }

  .page-title {
    font-size: 0.9rem;
  }

  .mobile-menu-btn {
    width: 36px;
    height: 36px;
  }

  .header-btn {
    padding: 0.4rem;
  }

  .header-btn i {
    font-size: 0.9rem;
  }

  .app-footer {
    font-size: 0.7rem;
    padding: 0.5rem;
  }

  .p-datatable .p-datatable-thead > tr > th,
  .p-datatable .p-datatable-tbody > tr > td {
    font-size: 0.75rem !important;
    padding: 0.4rem 0.5rem !important;
  }
}
</style>
