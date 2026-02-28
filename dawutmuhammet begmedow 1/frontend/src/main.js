import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'

import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

import HomeView from './views/HomeView.vue'
import ScanView from './views/ScanView.vue'
import SystemScanView from './views/SystemScanView.vue'
import TechniquesView from './views/TechniquesView.vue'
import StatisticsView from './views/StatisticsView.vue'
import HistoryView from './views/HistoryView.vue'
import HowItWorksView from './views/HowItWorksView.vue'
import AboutView from './views/AboutView.vue'

import 'primeicons/primeicons.css'

const routes = [
  { path: '/', component: HomeView },
  { path: '/scan', component: ScanView },
  { path: '/system-scan', component: SystemScanView },
  { path: '/techniques', component: TechniquesView },
  { path: '/statistics', component: StatisticsView },
  { path: '/history', component: HistoryView },
  { path: '/how-it-works', component: HowItWorksView },
  { path: '/about', component: AboutView }
]

const router = createRouter({ history: createWebHistory(), routes })

const app = createApp(App)
app.use(router)
app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: '.dark-mode' } } })
app.use(ToastService)

app.component('Button', Button)
app.component('Card', Card)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Tag', Tag)
app.component('ProgressBar', ProgressBar)
app.component('FileUpload', FileUpload)
app.component('Toast', Toast)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)

app.directive('tooltip', Tooltip)
app.mount('#app')
