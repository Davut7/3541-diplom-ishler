import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'

// PrimeVue Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

// Views
import HomeView from './views/HomeView.vue'
import AnalyzeView from './views/AnalyzeView.vue'
import HistoryView from './views/HistoryView.vue'
import AboutView from './views/AboutView.vue'
import HowItWorksView from './views/HowItWorksView.vue'
import ComparisonView from './views/ComparisonView.vue'

// Styles
import 'primeicons/primeicons.css'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/analyze', name: 'analyze', component: AnalyzeView },
  { path: '/history', name: 'history', component: HistoryView },
  { path: '/how-it-works', name: 'howItWorks', component: HowItWorksView },
  { path: '/comparison', name: 'comparison', component: ComparisonView },
  { path: '/about', name: 'about', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode'
    }
  }
})
app.use(ToastService)

// Register components
app.component('Button', Button)
app.component('Card', Card)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Tag', Tag)
app.component('ProgressBar', ProgressBar)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('Badge', Badge)
app.component('Divider', Divider)
app.component('Panel', Panel)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)

app.directive('tooltip', Tooltip)

app.mount('#app')
