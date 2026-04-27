import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'

import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
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
import Textarea from 'primevue/textarea'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import Tooltip from 'primevue/tooltip'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import 'primeicons/primeicons.css'

import HomeView from './views/HomeView.vue'
import AttackLabView from './views/AttackLabView.vue'
import DefenseView from './views/DefenseView.vue'
import ScannerView from './views/ScannerView.vue'
import HowItWorksView from './views/HowItWorksView.vue'
import LiveLabView from './views/LiveLabView.vue'
import AboutView from './views/AboutView.vue'
import ComparisonView from './views/ComparisonView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/attack-lab', component: AttackLabView },
  { path: '/defense', component: DefenseView },
  { path: '/comparison', component: ComparisonView },
  { path: '/scanner', component: ScannerView },
  { path: '/how-it-works', component: HowItWorksView },
  { path: '/live-lab', component: LiveLabView },
  { path: '/about', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(),
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
app.component('Dropdown', Dropdown)
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
app.component('Textarea', Textarea)
app.component('ToggleSwitch', ToggleSwitch)
app.component('Select', Select)
app.component('Toast', Toast)

app.directive('tooltip', Tooltip)

app.mount('#app')
