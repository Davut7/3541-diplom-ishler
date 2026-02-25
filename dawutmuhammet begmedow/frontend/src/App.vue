<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="app-container">
    <header class="app-header">
      <router-link to="/" class="logo">
        <i class="pi pi-shield" style="font-size: 1.5rem; color: #ef4444"></i>
        <span class="logo-text">Virus<span style="color: #ef4444">Detect</span> Pro</span>
      </router-link>

      <nav class="header-nav">
        <router-link to="/" class="nav-link"><i class="pi pi-home"></i> {{ t.nav.home }}</router-link>
        <router-link to="/scan" class="nav-link"><i class="pi pi-search"></i> {{ t.nav.scan }}</router-link>
        <router-link to="/techniques" class="nav-link"><i class="pi pi-cog"></i> {{ t.nav.techniques }}</router-link>
        <router-link to="/history" class="nav-link"><i class="pi pi-history"></i> {{ t.nav.history }}</router-link>
        <router-link to="/how-it-works" class="nav-link"><i class="pi pi-question-circle"></i> {{ t.nav.howItWorks }}</router-link>
        <router-link to="/about" class="nav-link"><i class="pi pi-info-circle"></i> {{ t.nav.about }}</router-link>
      </nav>

      <div class="header-right">
        <div class="lang-switch">
          <button @click="setLanguage('en')" :class="{ active: language === 'en' }" class="lang-btn">EN</button>
          <button @click="setLanguage('tk')" :class="{ active: language === 'tk' }" class="lang-btn">TM</button>
        </div>
        <button @click="toggleDarkMode" class="theme-toggle">
          <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>
      </div>
    </header>

    <main class="app-main">
      <router-view :t="t" :language="language" />
    </main>

    <footer class="app-footer">
      <p>&copy; 2024 VirusDetect Pro - {{ t.footer.diploma }}</p>
      <p>{{ t.footer.author }}: Dawutmuhammet Begmedow</p>
    </footer>
  </div>
</template>

<script>
import { ref, computed, provide } from 'vue'
import { translations } from './locales'

export default {
  setup() {
    const language = ref(localStorage.getItem('virus-lang') || 'en')
    const isDarkMode = ref(localStorage.getItem('virus-dark') === 'true')
    const t = computed(() => translations[language.value])

    const setLanguage = (lang) => { language.value = lang; localStorage.setItem('virus-lang', lang) }
    const toggleDarkMode = () => { isDarkMode.value = !isDarkMode.value; localStorage.setItem('virus-dark', isDarkMode.value) }

    provide('t', t)
    return { language, isDarkMode, t, setLanguage, toggleDarkMode }
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --primary-color: #ef4444;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
.dark-mode {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}
body { font-family: 'Inter', sans-serif; background: var(--bg-primary); color: var(--text-primary); }
.app-container { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-primary); }
.app-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 100; }
.logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: var(--text-primary); }
.logo-text { font-size: 1.5rem; font-weight: 700; }
.header-nav { display: flex; gap: 0.5rem; }
.nav-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; text-decoration: none; color: var(--text-secondary); border-radius: 8px; font-size: 0.9rem; }
.nav-link:hover { background: var(--bg-primary); color: var(--primary-color); }
.nav-link.router-link-active { background: var(--primary-color); color: white; }
.header-right { display: flex; align-items: center; gap: 1rem; }
.lang-switch { display: flex; gap: 0.25rem; background: var(--bg-primary); padding: 0.25rem; border-radius: 8px; }
.lang-btn { padding: 0.5rem 0.75rem; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 6px; font-weight: 600; font-size: 0.8rem; }
.lang-btn.active { background: var(--primary-color); color: white; }
.theme-toggle { padding: 0.5rem; border: none; background: var(--bg-primary); color: var(--text-secondary); cursor: pointer; border-radius: 8px; font-size: 1.1rem; }
.app-main { flex: 1; padding: 2rem; max-width: 1400px; margin: 0 auto; width: 100%; }
.app-footer { text-align: center; padding: 1.5rem; background: var(--bg-secondary); border-top: 1px solid var(--border-color); color: var(--text-secondary); }
@media (max-width: 1024px) { .header-nav { display: none; } }
</style>
