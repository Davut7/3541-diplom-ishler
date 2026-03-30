<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="app-container">
    <!-- Biohazard Warning Strip -->
    <div class="biohazard-strip">
      <span v-for="n in 20" :key="n" class="hazard-icon">☣</span>
    </div>

    <header class="app-header">
      <router-link to="/" class="logo">
        <div class="biohazard-logo">
          <span class="bio-symbol">☣</span>
        </div>
        <span class="logo-text">Virus<span class="accent">Detect</span> Pro</span>
      </router-link>

      <nav class="header-nav">
        <router-link to="/" class="nav-link"><i class="pi pi-home"></i> {{ t.nav.home }}</router-link>
        <router-link to="/scan" class="nav-link"><i class="pi pi-search"></i> {{ t.nav.scan }}</router-link>
        <router-link to="/system-scan" class="nav-link"><i class="pi pi-desktop"></i> {{ t.nav.systemScan || 'System Scan' }}</router-link>
        <router-link to="/statistics" class="nav-link"><i class="pi pi-chart-bar"></i> {{ t.nav.statistics }}</router-link>
        <router-link to="/history" class="nav-link"><i class="pi pi-history"></i> {{ t.nav.history }}</router-link>
        <router-link to="/about" class="nav-link"><i class="pi pi-info-circle"></i> {{ t.nav.about }}</router-link>
      </nav>

      <!-- Mobile Sidebar Overlay -->
      <div class="mobile-overlay" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

      <!-- Mobile Sidebar -->
      <aside class="mobile-sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
        <div class="mobile-sidebar-header">
          <div class="mobile-sidebar-logo">
            <span class="bio-symbol">☣</span>
          </div>
          <span class="mobile-sidebar-title">Virus<span class="accent">Detect</span></span>
          <button @click="mobileMenuOpen = false" class="mobile-sidebar-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="mobile-sidebar-strip"></div>
        <nav class="mobile-sidebar-nav">
          <router-link to="/" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="pi pi-home"></i> {{ t.nav.home }}</router-link>
          <router-link to="/scan" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="pi pi-search"></i> {{ t.nav.scan }}</router-link>
          <router-link to="/system-scan" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="pi pi-desktop"></i> {{ t.nav.systemScan || 'System Scan' }}</router-link>
          <router-link to="/statistics" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="pi pi-chart-bar"></i> {{ t.nav.statistics }}</router-link>
          <router-link to="/history" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="pi pi-history"></i> {{ t.nav.history }}</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="pi pi-info-circle"></i> {{ t.nav.about }}</router-link>
        </nav>
        <div class="mobile-sidebar-footer">
          <div class="mobile-sidebar-lang">
            <button @click="setLanguage('en')" :class="{ active: language === 'en' }" class="lang-btn">EN</button>
            <button @click="setLanguage('tk')" :class="{ active: language === 'tk' }" class="lang-btn">TM</button>
          </div>
          <div class="mobile-sidebar-strip"></div>
          <p class="mobile-sidebar-copy">☣ VirusDetect Pro</p>
        </div>
      </aside>

      <div class="header-right">
        <div class="lang-switch">
          <button @click="setLanguage('en')" :class="{ active: language === 'en' }" class="lang-btn">EN</button>
          <button @click="setLanguage('tk')" :class="{ active: language === 'tk' }" class="lang-btn">TM</button>
        </div>
        <button @click="toggleDarkMode" class="theme-toggle">
          <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>
      </div>
    </header>

    <main class="app-main">
      <router-view :t="t" :language="language" />
    </main>

    <footer class="app-footer">
      <div class="footer-hazard">☣</div>
      <p>&copy; 2026 VirusDetect Pro - {{ t.footer.diploma }}</p>
      <p>{{ t.footer.author }}: Dawutmuhammet Begmedow</p>
    </footer>

    <!-- Bottom Warning Strip -->
    <div class="biohazard-strip bottom">
      <span v-for="n in 20" :key="n" class="hazard-icon">☣</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, provide } from 'vue'
import { translations } from './locales'

export default {
  setup() {
    const language = ref(localStorage.getItem('virus-lang') || 'en')
    const isDarkMode = ref(localStorage.getItem('virus-dark') === 'true')
    const mobileMenuOpen = ref(false)
    const t = computed(() => translations[language.value])

    const setLanguage = (lang) => { language.value = lang; localStorage.setItem('virus-lang', lang) }
    const toggleDarkMode = () => { isDarkMode.value = !isDarkMode.value; localStorage.setItem('virus-dark', isDarkMode.value) }

    provide('t', t)
    return { language, isDarkMode, mobileMenuOpen, t, setLanguage, toggleDarkMode }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@400;500;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --primary-color: #dc2626;
  --primary-glow: rgba(220, 38, 38, 0.5);
  --accent-color: #f97316;
  --warning-color: #fbbf24;
  --success-color: #22c55e;
  --bg-primary: #fff5f5;
  --bg-secondary: #fef2f2;
  --bg-card: #ffffff;
  --text-primary: #450a0a;
  --text-secondary: #7f1d1d;
  --border-color: #fecaca;
  --hazard-stripe: repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 10px, #1a1a1a 10px, #1a1a1a 20px);
}

.dark-mode {
  --bg-primary: #1a0505;
  --bg-secondary: #2a0a0a;
  --bg-card: #3a1010;
  --text-primary: #fef2f2;
  --text-secondary: #fca5a5;
  --border-color: #7f1d1d;
}

body {
  font-family: 'Roboto Mono', monospace;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
}

/* Biohazard Warning Strips */
.biohazard-strip {
  height: 8px;
  background: var(--hazard-stripe);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: scroll-hazard 20s linear infinite;
}
.biohazard-strip.bottom { animation-direction: reverse; }
.hazard-icon {
  font-size: 6px;
  color: transparent;
}

@keyframes scroll-hazard {
  from { background-position: 0 0; }
  to { background-position: 40px 0; }
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--primary-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px var(--primary-glow);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
}

.biohazard-logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-hazard 2s ease-in-out infinite;
  box-shadow: 0 0 20px var(--primary-glow);
}

.bio-symbol {
  font-size: 1.8rem;
  color: white;
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
}

@keyframes pulse-hazard {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px var(--primary-glow); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px var(--primary-glow), 0 0 50px var(--primary-glow); }
}

.logo-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
}
.logo-text .accent {
  color: var(--primary-color);
  text-shadow: 0 0 10px var(--primary-glow);
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
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}
.nav-link:hover {
  background: var(--bg-card);
  color: var(--primary-color);
  border-color: var(--primary-color);
}
.nav-link.router-link-active {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 15px var(--primary-glow);
}

/* Header Right */
.header-right { display: flex; align-items: center; gap: 1rem; }
.lang-switch {
  display: flex;
  gap: 0.25rem;
  background: var(--bg-card);
  padding: 0.25rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}
.lang-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s ease;
}
.lang-btn:hover { color: var(--primary-color); }
.lang-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
}
.theme-toggle {
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.theme-toggle:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-top: 2px solid var(--primary-color);
  color: var(--text-secondary);
  position: relative;
}
.footer-hazard {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  animation: pulse-hazard 2s ease-in-out infinite;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.mobile-menu-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
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
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #1a0505 0%, #2a0a0a 50%, #1a0505 100%);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  flex-direction: column;
  overflow-y: auto;
  border-right: 2px solid var(--primary-color);
  box-shadow: 4px 0 25px var(--primary-glow);
}
.mobile-sidebar.mobile-open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 1rem;
}
.mobile-sidebar-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px var(--primary-glow);
  animation: pulse-hazard 2s ease-in-out infinite;
  flex-shrink: 0;
}
.mobile-sidebar-logo .bio-symbol {
  font-size: 1.4rem;
  color: white;
}
.mobile-sidebar-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  color: #fef2f2;
  flex: 1;
}
.mobile-sidebar-title .accent {
  color: var(--primary-color);
  text-shadow: 0 0 10px var(--primary-glow);
}
.mobile-sidebar-close {
  padding: 0.5rem;
  border: 1px solid #7f1d1d;
  background: rgba(220, 38, 38, 0.1);
  color: #fca5a5;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}
.mobile-sidebar-close:hover {
  background: rgba(220, 38, 38, 0.3);
  border-color: var(--primary-color);
  color: white;
}

.mobile-sidebar-strip {
  height: 4px;
  background: var(--hazard-stripe);
  margin: 0;
}

.mobile-sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
  flex: 1;
}
.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 14px 20px;
  text-decoration: none;
  color: #fca5a5;
  font-size: 0.9rem;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}
.mobile-nav-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}
.mobile-nav-link:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #fef2f2;
  border-left-color: var(--accent-color);
}
.mobile-nav-link.router-link-active {
  background: linear-gradient(90deg, rgba(220, 38, 38, 0.25), transparent);
  color: white;
  border-left-color: var(--primary-color);
  box-shadow: inset 0 0 20px rgba(220, 38, 38, 0.1);
}
.mobile-nav-link.router-link-active i {
  color: var(--accent-color);
  text-shadow: 0 0 8px var(--primary-glow);
}

.mobile-sidebar-footer {
  margin-top: auto;
  padding: 0.75rem 0 0;
}
.mobile-sidebar-lang {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  justify-content: center;
}
.mobile-sidebar-lang .lang-btn {
  color: #fca5a5;
  border: 1px solid #7f1d1d;
  background: rgba(220, 38, 38, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 6px;
}
.mobile-sidebar-lang .lang-btn:hover {
  background: rgba(220, 38, 38, 0.25);
  color: white;
}
.mobile-sidebar-lang .lang-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border-color: var(--primary-color);
}
.mobile-sidebar-copy {
  text-align: center;
  color: #7f1d1d;
  font-size: 0.75rem;
  padding: 0.75rem;
  font-family: 'Orbitron', sans-serif;
}

@media (max-width: 1024px) {
  .header-nav {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mobile-overlay {
    display: block;
  }
  .mobile-sidebar {
    display: flex;
  }
  .logo-text { font-size: 1.1rem; }
  .biohazard-logo { width: 35px; height: 35px; }
  .bio-symbol { font-size: 1.4rem; }
}

@media (max-width: 768px) {
  .app-main {
    padding: 1rem;
  }
  .app-footer {
    padding: 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 640px) {
  .app-header { padding: 0.75rem 1rem; }
  .header-right { gap: 0.5rem; }
  .lang-switch { display: none; }
  .app-main {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .app-header { padding: 0.5rem 0.75rem; }
  .logo-text { font-size: 0.95rem; }
  .biohazard-logo { width: 30px; height: 30px; }
  .bio-symbol { font-size: 1.2rem; }
  .logo { gap: 0.5rem; }
  .header-right { gap: 0.35rem; }
  .theme-toggle { padding: 0.4rem; font-size: 1rem; }
  .mobile-menu-btn { padding: 0.4rem; font-size: 1rem; }
  .app-main { padding: 0.5rem; }
  .app-footer { padding: 0.75rem; font-size: 0.8rem; }
  .footer-hazard { font-size: 1.2rem; }
}
</style>
