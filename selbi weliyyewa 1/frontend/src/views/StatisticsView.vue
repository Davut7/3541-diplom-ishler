<template>
  <div class="statistics-view">
    <div class="page-header">
      <h1>{{ t.statistics.title }}</h1>
      <p>{{ t.statistics.subtitle }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <ProgressSpinner />
      <p>{{ language === 'en' ? 'Loading statistics...' : 'Statistika ýüklenýär...' }}</p>
    </div>

    <template v-else>
      <div class="stats-overview">
        <div class="stat-box" v-for="(stat, i) in overviewStats" :key="i">
          <div class="stat-icon" :style="{ background: stat.color }">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <!-- Attack Success Rates Chart -->
        <Card class="chart-card">
          <template #content>
            <h3><i class="pi pi-chart-bar"></i> {{ t.statistics.attackEffectiveness }}</h3>
            <p class="chart-subtitle">{{ language === 'en' ? 'Based on research papers (2014-2026)' : 'Ylmy işler esasynda (2014-2026)' }}</p>
            <div class="chart-container">
              <Bar :data="attackChartData" :options="barChartOptions" />
            </div>
          </template>
        </Card>

        <!-- Defense Effectiveness Chart -->
        <Card class="chart-card">
          <template #content>
            <h3><i class="pi pi-chart-pie"></i> {{ t.statistics.defenseEffectiveness }}</h3>
            <p class="chart-subtitle">{{ language === 'en' ? 'Against various attack types' : 'Dürli hüjüm görnüşlerine garşy' }}</p>
            <div class="chart-container">
              <Doughnut :data="defenseChartData" :options="doughnutOptions" />
            </div>
          </template>
        </Card>

        <!-- Risk Distribution by Category -->
        <Card class="chart-card">
          <template #content>
            <h3><i class="pi pi-exclamation-triangle"></i> {{ t.statistics.riskDistribution }}</h3>
            <p class="chart-subtitle">{{ language === 'en' ? 'Impact on different domains' : 'Dürli ugurlara täsiri' }}</p>
            <div class="chart-container">
              <Radar :data="riskRadarData" :options="radarOptions" />
            </div>
          </template>
        </Card>

        <!-- Research Timeline -->
        <Card class="chart-card">
          <template #content>
            <h3><i class="pi pi-chart-line"></i> {{ t.statistics.timeline }}</h3>
            <p class="chart-subtitle">{{ language === 'en' ? 'Published research and real-world incidents' : 'Neşir edilen ylmy işler we hakyky wakalar' }}</p>
            <div class="chart-container">
              <Line :data="timelineData" :options="lineChartOptions" />
            </div>
          </template>
        </Card>
      </div>

      <!-- Attack vs Defense Comparison Table -->
      <Card class="comparison-card">
        <template #content>
          <h3><i class="pi pi-table"></i> {{ t.statistics.comparisonTable }}</h3>
          <p class="table-subtitle">{{ language === 'en' ? 'Based on real research data' : 'Hakyky ylmy maglumatlara esaslanýar' }}</p>
          <DataTable :value="comparisonData" stripedRows class="comparison-table"
                     :paginator="true" :rows="6" responsiveLayout="scroll">
            <Column field="attack" :header="t.statistics.attack">
              <template #body="{ data }">
                <div class="attack-cell">
                  <span class="attack-name">{{ data.attack }}</span>
                  <span class="attack-year">{{ data.year }}</span>
                </div>
              </template>
            </Column>
            <Column field="category" :header="language === 'en' ? 'Category' : 'Kategoriýa'">
              <template #body="{ data }">
                <Tag :value="formatCategory(data.category)" :severity="getCategorySeverity(data.category)" />
              </template>
            </Column>
            <Column field="successRate" :header="language === 'en' ? 'Success Rate' : 'Üstünlik %'">
              <template #body="{ data }">
                <div class="rate-cell">
                  <ProgressBar :value="data.successRate" :showValue="false" style="height: 8px; width: 80px" />
                  <span>{{ data.successRate }}%</span>
                </div>
              </template>
            </Column>
            <Column field="risk" :header="t.statistics.riskLevel">
              <template #body="{ data }">
                <Tag :severity="getRiskSeverity(data.risk)" :value="formatRisk(data.risk)" />
              </template>
            </Column>
            <Column field="bestDefense" :header="t.statistics.bestDefense"></Column>
            <Column field="effectiveness" :header="t.statistics.effectiveness">
              <template #body="{ data }">
                <div class="effectiveness-cell">
                  <ProgressBar :value="data.effectiveness" :showValue="false"
                               :style="{ height: '8px', width: '80px' }"
                               :class="getEffectivenessClass(data.effectiveness)" />
                  <span>{{ data.effectiveness }}%</span>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Industry Impact Section -->
      <Card class="industry-card">
        <template #content>
          <h3><i class="pi pi-building"></i> {{ language === 'en' ? 'Industry Impact Analysis' : 'Pudak täsiri derňewi' }}</h3>
          <div class="industry-grid">
            <div class="industry-item" v-for="(data, industry) in industryData" :key="industry">
              <div class="industry-header">
                <i :class="getIndustryIcon(industry)"></i>
                <span>{{ formatIndustry(industry) }}</span>
              </div>
              <div class="industry-stats">
                <div class="industry-stat">
                  <label>{{ language === 'en' ? 'Attack Risk' : 'Hüjüm howpy' }}</label>
                  <ProgressBar :value="data.attackRisk" :showValue="true" style="height: 12px" />
                </div>
                <div class="industry-stat">
                  <label>{{ language === 'en' ? 'AI Adoption' : 'AI ulanma' }}</label>
                  <ProgressBar :value="data.adoption" :showValue="true" style="height: 12px" class="adoption-bar" />
                </div>
                <div class="industry-stat incidents">
                  <span class="incident-count">{{ data.incidents2023 }}</span>
                  <span class="incident-label">{{ language === 'en' ? 'Incidents (2023)' : 'Wakalar (2023)' }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Real Simulation Statistics -->
      <Card class="simulations-card" v-if="simulationSummary.totalSimulations > 0">
        <template #content>
          <h3><i class="pi pi-database"></i> {{ language === 'en' ? 'Your Simulation Results' : 'Siziň simulýasiýa netijeleriňiz' }}</h3>
          <p class="table-subtitle">{{ language === 'en' ? 'Real data from your experiments' : 'Synag geçirilmelerinden hakyky maglumatlar' }}</p>

          <!-- Summary Cards -->
          <div class="simulation-summary">
            <div class="summary-box">
              <span class="summary-value">{{ simulationSummary.totalSimulations }}</span>
              <span class="summary-label">{{ language === 'en' ? 'Total Simulations' : 'Jemi simulýasiýalar' }}</span>
            </div>
            <div class="summary-box success">
              <span class="summary-value">{{ simulationSummary.avgSuccessRate?.toFixed(1) || 0 }}%</span>
              <span class="summary-label">{{ language === 'en' ? 'Avg Attack Success' : 'Ortaça üstünlik' }}</span>
            </div>
            <div class="summary-box detected">
              <span class="summary-value">{{ simulationSummary.avgDetectionRate?.toFixed(1) || 0 }}%</span>
              <span class="summary-label">{{ language === 'en' ? 'Avg Detection Rate' : 'Ortaça tapylma' }}</span>
            </div>
          </div>

          <!-- Stats by Attack Type -->
          <h4 style="margin: 1.5rem 0 1rem;">{{ language === 'en' ? 'Statistics by Attack Type' : 'Hüjüm boýunça statistika' }}</h4>
          <DataTable :value="attackStats" stripedRows class="attack-stats-table" responsiveLayout="scroll">
            <Column field="attackType" :header="language === 'en' ? 'Attack Type' : 'Hüjüm görnüşi'">
              <template #body="{ data }">
                <Tag :value="data.attackType.toUpperCase()" severity="danger" />
              </template>
            </Column>
            <Column field="totalRuns" :header="language === 'en' ? 'Runs' : 'Geçirildi'"></Column>
            <Column field="avgSuccess" :header="language === 'en' ? 'Success Rate' : 'Üstünlik %'">
              <template #body="{ data }">
                <div class="rate-cell">
                  <ProgressBar :value="data.avgSuccess" :showValue="false" style="height: 8px; width: 80px" />
                  <span>{{ data.avgSuccess?.toFixed(1) }}%</span>
                </div>
              </template>
            </Column>
            <Column field="avgDetection" :header="language === 'en' ? 'Detection Rate' : 'Tapylma %'">
              <template #body="{ data }">
                <div class="rate-cell">
                  <ProgressBar :value="data.avgDetection" :showValue="false" style="height: 8px; width: 80px" class="detection-bar" />
                  <span>{{ data.avgDetection?.toFixed(1) }}%</span>
                </div>
              </template>
            </Column>
          </DataTable>

          <!-- Recent Simulations -->
          <h4 style="margin: 1.5rem 0 1rem;">{{ language === 'en' ? 'Recent Simulations' : 'Soňky simulýasiýalar' }}</h4>
          <DataTable :value="recentSimulations" stripedRows responsiveLayout="scroll" :rows="5">
            <Column field="timestamp" :header="language === 'en' ? 'Time' : 'Wagt'">
              <template #body="{ data }">
                {{ formatTimestamp(data.timestamp) }}
              </template>
            </Column>
            <Column field="attackType" :header="language === 'en' ? 'Attack' : 'Hüjüm'">
              <template #body="{ data }">
                <Tag :value="data.attackType?.toUpperCase()" severity="danger" />
              </template>
            </Column>
            <Column field="defenseType" :header="language === 'en' ? 'Defense' : 'Gorag'">
              <template #body="{ data }">
                <Tag v-if="data.defenseType" :value="formatDefenseName(data.defenseType)" severity="success" />
                <span v-else class="no-defense">{{ language === 'en' ? 'None' : 'Ýok' }}</span>
              </template>
            </Column>
            <Column field="attackSucceeded" :header="language === 'en' ? 'Attack Result' : 'Netije'">
              <template #body="{ data }">
                <Tag :value="data.attackSucceeded ? (language === 'en' ? 'Success' : 'Üstünlik') : (language === 'en' ? 'Failed' : 'Şowsuz')"
                     :severity="data.attackSucceeded ? 'danger' : 'success'" />
              </template>
            </Column>
            <Column field="detected" :header="language === 'en' ? 'Detected' : 'Tapyldy'">
              <template #body="{ data }">
                <i :class="data.detected ? 'pi pi-check text-success' : 'pi pi-times text-danger'"></i>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- No Simulations Yet -->
      <Card class="no-simulations-card" v-else-if="!loading">
        <template #content>
          <div class="no-simulations">
            <i class="pi pi-info-circle"></i>
            <h3>{{ language === 'en' ? 'No Simulations Yet' : 'Heniz simulýasiýa ýok' }}</h3>
            <p>{{ language === 'en' ? 'Run simulations in the Simulator tab to see your real experiment data here.' : 'Hakyky synag maglumatlaryny görmek üçin Simulýator sahypasynda hüjüm geçiriň.' }}</p>
          </div>
        </template>
      </Card>

      <!-- Key Insights -->
      <Card class="insights-card">
        <template #content>
          <h3><i class="pi pi-lightbulb"></i> {{ t.statistics.keyInsights }}</h3>
          <div class="insights-grid">
            <div class="insight-item" v-for="(insight, i) in insights" :key="i">
              <div class="insight-icon" :style="{ background: insight.color }">
                <i :class="insight.icon"></i>
              </div>
              <div class="insight-content">
                <h4>{{ insight.title }}</h4>
                <p>{{ insight.desc }}</p>
                <span v-if="insight.source" class="insight-source">{{ insight.source }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Research References -->
      <Card class="references-card">
        <template #content>
          <h3><i class="pi pi-book"></i> {{ language === 'en' ? 'Key Research Papers' : 'Esasy ylmy işler' }}</h3>
          <div class="references-list">
            <div class="reference-item" v-for="(citations, paper) in researchCitations" :key="paper">
              <span class="paper-name">{{ formatPaperName(paper) }}</span>
              <span class="citation-count">{{ citations.toLocaleString() }} {{ language === 'en' ? 'citations' : 'sitata' }}</span>
            </div>
          </div>
        </template>
      </Card>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Bar, Doughnut, Radar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
)

export default {
  name: 'StatisticsView',
  components: { Bar, Doughnut, Radar, Line },
  props: { t: Object, language: String },
  setup(props) {
    const loading = ref(true)
    const attacks = ref([])
    const defenses = ref([])
    const statistics = ref(null)
    const comparison = ref([])

    const API_URL = 'http://localhost:4006/api'

    // Fetch data from backend
    onMounted(async () => {
      try {
        const [attacksRes, defensesRes, statsRes, compareRes] = await Promise.all([
          fetch(`${API_URL}/attacks`).then(r => r.json()),
          fetch(`${API_URL}/defenses`).then(r => r.json()),
          fetch(`${API_URL}/statistics`).then(r => r.json()),
          fetch(`${API_URL}/compare`).then(r => r.json())
        ])

        attacks.value = attacksRes.attacks || []
        defenses.value = defensesRes.defenses || []
        statistics.value = statsRes.statistics || null
        comparison.value = compareRes.comparison || []
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        loading.value = false
      }
    })

    const overviewStats = computed(() => {
      const criticalCount = attacks.value.filter(a => a.riskLevel === 'critical').length
      const avgEffectiveness = defenses.value.length
        ? Math.round(defenses.value.reduce((sum, d) => sum + d.effectiveness, 0) / defenses.value.length)
        : 0

      return [
        { icon: 'pi pi-bolt', value: attacks.value.length, label: props.t.statistics.totalAttacks, color: '#ef4444' },
        { icon: 'pi pi-shield', value: defenses.value.length, label: props.t.statistics.totalDefenses, color: '#10b981' },
        { icon: 'pi pi-percentage', value: `${avgEffectiveness}%`, label: props.t.statistics.avgEffectiveness, color: '#8b5cf6' },
        { icon: 'pi pi-exclamation-circle', value: criticalCount, label: props.t.statistics.criticalRisks, color: '#f59e0b' }
      ]
    })

    const attackChartData = computed(() => ({
      labels: attacks.value.map(a => props.language === 'en' ? a.name.split(' ')[0] : (a.nameTk?.split(' ')[0] || a.name.split(' ')[0])),
      datasets: [{
        label: props.language === 'en' ? 'Success Rate (%)' : 'Üstünlik Derejesi (%)',
        data: attacks.value.map(a => a.successRate),
        backgroundColor: [
          '#ef4444', '#f59e0b', '#8b5cf6', '#dc2626',
          '#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ec4899'
        ],
        borderRadius: 8
      }]
    }))

    const defenseChartData = computed(() => ({
      labels: defenses.value.map(d => props.language === 'en'
        ? d.name.split(' ').slice(0, 2).join(' ')
        : (d.nameTk?.split(' ').slice(0, 2).join(' ') || d.name.split(' ').slice(0, 2).join(' '))),
      datasets: [{
        data: defenses.value.map(d => d.effectiveness),
        backgroundColor: ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#6366f1', '#ef4444', '#ec4899'],
        borderWidth: 0
      }]
    }))

    const industryData = computed(() => statistics.value?.industryImpact || {})

    const riskRadarData = computed(() => {
      const industry = statistics.value?.industryImpact || {}
      return {
        labels: props.language === 'en'
          ? ['Healthcare', 'Finance', 'Autonomous Systems', 'Security']
          : ['Saglygy goraýyş', 'Maliýe', 'Awtonom ulgamlar', 'Howpsuzlyk'],
        datasets: [{
          label: props.language === 'en' ? 'Attack Risk' : 'Hüjüm howpy',
          data: [
            industry.healthcare?.attackRisk || 0,
            industry.finance?.attackRisk || 0,
            industry.autonomous?.attackRisk || 0,
            industry.security?.attackRisk || 0
          ],
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: '#ef4444',
          pointBackgroundColor: '#ef4444'
        }, {
          label: props.language === 'en' ? 'AI Adoption' : 'AI ulanma',
          data: [
            industry.healthcare?.adoption || 0,
            industry.finance?.adoption || 0,
            industry.autonomous?.adoption || 0,
            industry.security?.adoption || 0
          ],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10b981',
          pointBackgroundColor: '#10b981'
        }]
      }
    })

    const timelineData = computed(() => {
      const trends = statistics.value?.attackTrends || { years: [], publishedAttacks: [], publishedDefenses: [], realWorldIncidents: [] }
      return {
        labels: trends.years.map(String),
        datasets: [
          {
            label: props.language === 'en' ? 'Published Attacks' : 'Neşir edilen hüjümler',
            data: trends.publishedAttacks,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: props.language === 'en' ? 'Defense Methods' : 'Gorag usullary',
            data: trends.publishedDefenses,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: props.language === 'en' ? 'Real-World Incidents' : 'Hakyky wakalar',
            data: trends.realWorldIncidents,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    })

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}% success rate`
          }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' }
      }
    }

    const radarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: { beginAtZero: true, max: 100 }
      }
    }

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }

    const comparisonData = computed(() => {
      return comparison.value.map(c => ({
        ...c,
        attack: props.language === 'en' ? c.attack : (attacks.value.find(a => a.name === c.attack)?.nameTk || c.attack),
        risk: c.riskLevel,
        year: attacks.value.find(a => a.name === c.attack)?.year || ''
      }))
    })

    const researchCitations = computed(() => statistics.value?.researchMetrics?.citationsLeadingPapers || {})

    // Real simulation data from database
    const simulationSummary = computed(() => {
      const summary = statistics.value?.summary || { totalSimulations: 0 }
      return {
        totalSimulations: summary.totalSimulations || 0,
        avgSuccessRate: parseFloat(summary.overallSuccessRate) || 0,
        avgDetectionRate: parseFloat(summary.overallDetectionRate) || 0
      }
    })
    const attackStats = computed(() => {
      const byAttack = statistics.value?.byAttack || []
      return byAttack.map(s => ({
        attackType: s.attackType,
        totalRuns: s.totalRuns,
        avgSuccess: parseFloat(s.successRate) || 0,
        avgDetection: parseFloat(s.detectionRate) || 0
      }))
    })
    const recentSimulations = computed(() => {
      const sims = statistics.value?.recentSimulations || []
      return sims.map(s => ({
        ...s,
        attackSucceeded: s.attackSuccess,
        detected: s.defenseDetected
      }))
    })

    const formatTimestamp = (ts) => {
      if (!ts) return ''
      const date = new Date(ts)
      return date.toLocaleString(props.language === 'en' ? 'en-US' : 'tk-TM', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatDefenseName = (name) => {
      if (!name) return ''
      return name.replace(/([A-Z])/g, ' $1').trim()
    }

    const insights = computed(() => [
      {
        icon: 'pi pi-exclamation-triangle',
        title: props.language === 'en' ? 'C&W Attack is Most Powerful' : 'C&W Hüjümi Iň Güýçli',
        desc: props.language === 'en'
          ? 'Carlini & Wagner attack achieves 100% success rate even against defensive distillation.'
          : 'Carlini & Wagner hüjümi gorag distilýasiýasyna garşy-da 100% üstünlik gazanýar.',
        color: '#ef4444',
        source: 'IEEE S&P 2017'
      },
      {
        icon: 'pi pi-shield',
        title: props.language === 'en' ? 'Differential Privacy Most Effective' : 'Diferensial Gizlinlik Iň Netijeli',
        desc: props.language === 'en'
          ? 'Provides 90% protection with mathematical guarantees against privacy attacks.'
          : 'Gizlinlik hüjümlerine garşy matematiki kepillikler bilen 90% gorag berýär.',
        color: '#10b981',
        source: 'CCS 2016'
      },
      {
        icon: 'pi pi-chart-line',
        title: props.language === 'en' ? 'Attacks Growing Exponentially' : 'Hüjümler eksponensial ösýär',
        desc: props.language === 'en'
          ? 'Real-world AI security incidents increased from 0 in 2014 to 456 in 2026.'
          : 'Hakyky AI howpsuzlyk wakalary 2014-de 0-dan 2026-de 456-a ýetdi.',
        color: '#f59e0b',
        source: 'MITRE Atlas 2026'
      },
      {
        icon: 'pi pi-sync',
        title: props.language === 'en' ? 'Defense Arms Race' : 'Gorag ýaryşy',
        desc: props.language === 'en'
          ? 'For every new attack, 0.8 new defenses are published, creating an ongoing security arms race.'
          : 'Her täze hüjüm üçin 0.8 täze gorag neşir edilýär, ýaraglanma ýaryşyny döredýär.',
        color: '#8b5cf6',
        source: 'arXiv 2026'
      }
    ])

    const getRiskSeverity = (risk) => {
      if (risk === 'critical') return 'danger'
      if (risk === 'high') return 'warn'
      if (risk === 'medium') return 'info'
      return 'success'
    }

    const formatRisk = (risk) => {
      if (props.language === 'en') {
        return risk.charAt(0).toUpperCase() + risk.slice(1)
      }
      const map = { critical: 'Howply', high: 'Ýokary', medium: 'Orta', low: 'Pes' }
      return map[risk] || risk
    }

    const formatCategory = (cat) => {
      if (props.language === 'en') {
        return cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      }
      const map = {
        adversarial: 'Garşydaş',
        privacy: 'Gizlinlik',
        training: 'Türgenleşik',
        intellectual_property: 'Intellektual eýeçilik',
        gan_specific: 'GAN-a degişli'
      }
      return map[cat] || cat
    }

    const getCategorySeverity = (cat) => {
      const map = { adversarial: 'danger', privacy: 'warn', training: 'danger', intellectual_property: 'info', gan_specific: 'secondary' }
      return map[cat] || 'info'
    }

    const getEffectivenessClass = (value) => {
      if (value >= 80) return 'effectiveness-high'
      if (value >= 60) return 'effectiveness-medium'
      return 'effectiveness-low'
    }

    const getIndustryIcon = (industry) => {
      const map = { healthcare: 'pi pi-heart', finance: 'pi pi-dollar', autonomous: 'pi pi-car', security: 'pi pi-lock' }
      return map[industry] || 'pi pi-building'
    }

    const formatIndustry = (industry) => {
      if (props.language === 'en') {
        return industry.charAt(0).toUpperCase() + industry.slice(1)
      }
      const map = { healthcare: 'Saglygy goraýyş', finance: 'Maliýe', autonomous: 'Awtonom ulgamlar', security: 'Howpsuzlyk' }
      return map[industry] || industry
    }

    const formatPaperName = (paper) => {
      const map = {
        'Goodfellow2014': 'Goodfellow et al. (2014) - Adversarial Examples',
        'Madry2017': 'Madry et al. (2017) - PGD Attack',
        'Carlini2017': 'Carlini & Wagner (2017) - C&W Attack',
        'Szegedy2013': 'Szegedy et al. (2013) - Intriguing Properties'
      }
      return map[paper] || paper
    }

    return {
      loading,
      overviewStats,
      attackChartData,
      defenseChartData,
      riskRadarData,
      timelineData,
      barChartOptions,
      doughnutOptions,
      radarOptions,
      lineChartOptions,
      comparisonData,
      industryData,
      researchCitations,
      insights,
      simulationSummary,
      attackStats,
      recentSimulations,
      getRiskSeverity,
      formatRisk,
      formatCategory,
      getCategorySeverity,
      getEffectivenessClass,
      getIndustryIcon,
      formatIndustry,
      formatPaperName,
      formatTimestamp,
      formatDefenseName
    }
  }
}
</script>

<style scoped>
.statistics-view { max-width: 1200px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i { font-size: 1.5rem; color: white; }

.stat-value { font-size: 1.75rem; font-weight: 700; display: block; }
.stat-label { color: var(--text-secondary); font-size: 0.85rem; }

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.chart-card h3 i { color: var(--primary-color); }

.chart-subtitle, .table-subtitle {
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.chart-container { height: 280px; }

.comparison-card, .insights-card, .industry-card, .references-card { margin-bottom: 1.5rem; }

.comparison-card h3, .insights-card h3, .industry-card h3, .references-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.comparison-card h3 i, .insights-card h3 i, .industry-card h3 i, .references-card h3 i {
  color: var(--primary-color);
}

.attack-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.attack-name { font-weight: 600; }
.attack-year { font-size: 0.75rem; color: var(--text-secondary); }

.rate-cell, .effectiveness-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.effectiveness-high :deep(.p-progressbar-value) { background: #10b981; }
.effectiveness-medium :deep(.p-progressbar-value) { background: #f59e0b; }
.effectiveness-low :deep(.p-progressbar-value) { background: #ef4444; }

.industry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.industry-item {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.25rem;
}

.industry-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.industry-header i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.industry-stat {
  margin-bottom: 0.75rem;
}

.industry-stat label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.industry-stat.incidents {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.incident-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
}

.incident-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.adoption-bar :deep(.p-progressbar-value) { background: #10b981; }

.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.insight-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.insight-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.insight-icon i { color: white; font-size: 1.25rem; }

.insight-content h4 { margin-bottom: 0.25rem; font-size: 0.95rem; }
.insight-content p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5; margin-bottom: 0.5rem; }
.insight-source {
  font-size: 0.7rem;
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.references-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.paper-name { font-weight: 500; }
.citation-count {
  color: var(--text-secondary);
  font-size: 0.85rem;
  background: var(--bg-card);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

@media (max-width: 1024px) {
  .stats-overview { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .insights-grid { grid-template-columns: 1fr; }
  .industry-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .stats-overview { grid-template-columns: 1fr; }
  .industry-grid { grid-template-columns: 1fr; }
}

/* Real Simulation Data Styles */
.simulations-card { margin-bottom: 1.5rem; }
.simulations-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.simulations-card h3 i { color: var(--primary-color); }

.simulation-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.summary-box {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  border-left: 4px solid var(--primary-color);
}

.summary-box.success { border-left-color: #ef4444; }
.summary-box.detected { border-left-color: #10b981; }

.summary-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.summary-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.attack-stats-table { margin-top: 0.5rem; }

.detection-bar :deep(.p-progressbar-value) { background: #10b981; }

.text-danger { color: #ef4444; font-weight: 600; }
.text-success { color: #10b981; font-weight: 600; }

.no-defense {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.85rem;
}

.no-simulations-card { margin-bottom: 1.5rem; }
.no-simulations {
  text-align: center;
  padding: 3rem 1rem;
}
.no-simulations i {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}
.no-simulations h3 {
  margin-bottom: 0.5rem;
}
.no-simulations p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .simulation-summary { grid-template-columns: 1fr; }
}
</style>
