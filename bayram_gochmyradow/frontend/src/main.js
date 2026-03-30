import { createApp, reactive } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import 'primeicons/primeicons.css'

import App from './App.vue'
import { createI18n } from './locales/index.js'

// Import views
import HomeView from './views/HomeView.vue'
import AnalyzeView from './views/AnalyzeView.vue'
import TestView from './views/TestView.vue'
import HistoryView from './views/HistoryView.vue'
import AboutView from './views/AboutView.vue'
import ComparisonView from './views/ComparisonView.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/analyze', name: 'analyze', component: AnalyzeView },
    { path: '/test', name: 'test', component: TestView },
    { path: '/history', name: 'history', component: HistoryView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/comparison', name: 'comparison', component: ComparisonView }
  ]
})

// Create app
const app = createApp(App)

// Create reactive i18n instance
const i18n = reactive(createI18n())

// Provide i18n globally
app.provide('i18n', i18n)

// Use plugins
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode'
    }
  }
})

// Mount app
app.mount('#app')
