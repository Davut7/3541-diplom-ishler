import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'

import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Badge from 'primevue/badge'
import ToggleSwitch from 'primevue/toggleswitch'
import Tooltip from 'primevue/tooltip'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import 'primeicons/primeicons.css'

import HomeView from './views/HomeView.vue'
import ScanView from './views/ScanView.vue'
import ProcessesView from './views/ProcessesView.vue'
import ProtectionView from './views/ProtectionView.vue'
import StatisticsView from './views/StatisticsView.vue'
import HowItWorksView from './views/HowItWorksView.vue'
import AboutView from './views/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/scan', component: ScanView },
  { path: '/processes', component: ProcessesView },
  { path: '/protection', component: ProtectionView },
  { path: '/statistics', component: StatisticsView },
  { path: '/how-it-works', component: HowItWorksView },
  { path: '/about', component: AboutView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: { preset: Aura, options: { darkModeSelector: '.dark-mode' } }
})
app.use(ToastService)

app.component('Button', Button)
app.component('Card', Card)
app.component('InputText', InputText)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Tag', Tag)
app.component('ProgressBar', ProgressBar)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)
app.component('Badge', Badge)
app.component('ToggleSwitch', ToggleSwitch)
app.component('Toast', Toast)

app.directive('tooltip', Tooltip)

app.mount('#app')
