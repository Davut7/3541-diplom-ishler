import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'

import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
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
import Dropdown from 'primevue/dropdown'
import Slider from 'primevue/slider'
import FileUpload from 'primevue/fileupload'
import Image from 'primevue/image'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Knob from 'primevue/knob'
import Timeline from 'primevue/timeline'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import StepItem from 'primevue/stepitem'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Divider from 'primevue/divider'

import HomeView from './views/HomeView.vue'
import AttacksView from './views/AttacksView.vue'
import DefenseView from './views/DefenseView.vue'
import SimulatorView from './views/SimulatorView.vue'
import StatisticsView from './views/StatisticsView.vue'
import HowItWorksView from './views/HowItWorksView.vue'
import AboutView from './views/AboutView.vue'

import 'primeicons/primeicons.css'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/attacks', name: 'attacks', component: AttacksView },
  { path: '/defense', name: 'defense', component: DefenseView },
  { path: '/simulator', name: 'simulator', component: SimulatorView },
  { path: '/statistics', name: 'statistics', component: StatisticsView },
  { path: '/how-it-works', name: 'howItWorks', component: HowItWorksView },
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
    options: { darkModeSelector: '.dark-mode' }
  }
})
app.use(ToastService)

app.component('Button', Button)
app.component('Card', Card)
app.component('InputText', InputText)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Tag', Tag)
app.component('ProgressBar', ProgressBar)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('Dropdown', Dropdown)
app.component('Slider', Slider)
app.component('FileUpload', FileUpload)
app.component('Image', Image)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)
app.component('Knob', Knob)
app.component('Timeline', Timeline)
app.component('Stepper', Stepper)
app.component('StepList', StepList)
app.component('StepPanels', StepPanels)
app.component('StepItem', StepItem)
app.component('Step', Step)
app.component('StepPanel', StepPanel)
app.component('Divider', Divider)

app.directive('tooltip', Tooltip)

app.mount('#app')
