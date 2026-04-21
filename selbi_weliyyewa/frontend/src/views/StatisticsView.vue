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
      <!-- Overview Stats from Real Data -->
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

      <!-- WAF Protection Analytics -->
      <Card class="waf-analytics-card">
        <template #content>
          <h3><i class="pi pi-shield"></i> {{ language === 'en' ? 'WAF Protection Analytics' : 'WAF Gorag Analitikasy' }}</h3>
          <p class="table-subtitle">{{ language === 'en' ? 'Real-time Web Application Firewall statistics' : 'Hakyky wagtda Web Programma Firewall statistikasy' }}</p>

          <!-- WAF Summary Cards -->
          <div class="waf-summary">
            <div class="waf-stat-box">
              <div class="waf-stat-icon threats">
                <i class="pi pi-exclamation-triangle"></i>
              </div>
              <div class="waf-stat-content">
                <span class="waf-stat-value">{{ wafStats.totalThreats }}</span>
                <span class="waf-stat-label">{{ language === 'en' ? 'Total Threats' : 'Jemi howplar' }}</span>
              </div>
            </div>
            <div class="waf-stat-box">
              <div class="waf-stat-icon blocked">
                <i class="pi pi-ban"></i>
              </div>
              <div class="waf-stat-content">
                <span class="waf-stat-value">{{ wafStats.blocked }}</span>
                <span class="waf-stat-label">{{ language === 'en' ? 'Blocked' : 'Bloklanan' }}</span>
              </div>
            </div>
            <div class="waf-stat-box">
              <div class="waf-stat-icon alerted">
                <i class="pi pi-bell"></i>
              </div>
              <div class="waf-stat-content">
                <span class="waf-stat-value">{{ wafStats.alerted }}</span>
                <span class="waf-stat-label">{{ language === 'en' ? 'Alerted' : 'Duýdurylan' }}</span>
              </div>
            </div>
            <div class="waf-stat-box">
              <div class="waf-stat-icon rate">
                <i class="pi pi-percentage"></i>
              </div>
              <div class="waf-stat-content">
                <span class="waf-stat-value">{{ wafStats.blockRate }}%</span>
                <span class="waf-stat-label">{{ language === 'en' ? 'Block Rate' : 'Bloklama %' }}</span>
              </div>
            </div>
          </div>

          <!-- WAF Threats by Type -->
          <div v-if="wafStats.byType && wafStats.byType.length > 0" class="waf-threats-section">
            <h4 style="margin: 1.5rem 0 1rem;">{{ language === 'en' ? 'Threats by Type' : 'Görnüşi boýunça howplar' }}</h4>
            <DataTable :value="wafStats.byType" stripedRows responsiveLayout="scroll">
              <Column field="type" :header="language === 'en' ? 'Attack Type' : 'Hüjüm görnüşi'">
                <template #body="{ data }">
                  <Tag :value="formatWafType(data.type)" :severity="getWafTypeSeverity(data.type)" />
                </template>
              </Column>
              <Column field="count" :header="language === 'en' ? 'Detected' : 'Tapyldy'"></Column>
              <Column field="blocked" :header="language === 'en' ? 'Blocked' : 'Bloklanan'"></Column>
              <Column field="avgRisk" :header="language === 'en' ? 'Avg Risk Score' : 'Ortaça howp baly'">
                <template #body="{ data }">
                  <div class="rate-cell">
                    <ProgressBar :value="data.avgRisk" :showValue="false" style="height: 8px; width: 80px"
                                 :class="data.avgRisk >= 85 ? 'risk-critical' : data.avgRisk >= 70 ? 'risk-high' : 'risk-medium'" />
                    <span>{{ data.avgRisk }}</span>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Recent WAF Threats -->
          <div v-if="wafStats.recentThreats && wafStats.recentThreats.length > 0" class="waf-threats-section">
            <h4 style="margin: 1.5rem 0 1rem;">{{ language === 'en' ? 'Recent Threats' : 'Soňky howplar' }}</h4>
            <DataTable :value="wafStats.recentThreats" stripedRows responsiveLayout="scroll" :rows="5" :paginator="wafStats.recentThreats.length > 5">
              <Column field="timestamp" :header="language === 'en' ? 'Time' : 'Wagt'">
                <template #body="{ data }">
                  {{ formatTimestamp(data.timestamp) }}
                </template>
              </Column>
              <Column field="ip" header="IP"></Column>
              <Column field="attackType" :header="language === 'en' ? 'Type' : 'Görnüşi'">
                <template #body="{ data }">
                  <Tag :value="formatWafType(data.attackType)" :severity="getWafTypeSeverity(data.attackType)" />
                </template>
              </Column>
              <Column field="path" :header="language === 'en' ? 'Target' : 'Nyşan'">
                <template #body="{ data }">
                  <code class="path-code">{{ data.method }} {{ data.path }}</code>
                </template>
              </Column>
              <Column field="action" :header="language === 'en' ? 'Action' : 'Hereket'">
                <template #body="{ data }">
                  <Tag :value="data.action === 'block' ? (language === 'en' ? 'BLOCKED' : 'BLOKLANAN') : (language === 'en' ? 'ALERT' : 'DUÝDURYŞ')"
                       :severity="data.action === 'block' ? 'danger' : 'warn'" />
                </template>
              </Column>
              <Column field="riskScore" :header="language === 'en' ? 'Risk' : 'Howp'">
                <template #body="{ data }">
                  <span :class="['risk-badge', data.riskScore >= 85 ? 'critical' : data.riskScore >= 70 ? 'high' : 'medium']">
                    {{ data.riskScore }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Blocked IPs -->
          <div v-if="wafStats.blockedIPs && wafStats.blockedIPs.length > 0" class="waf-threats-section">
            <h4 style="margin: 1.5rem 0 1rem;">{{ language === 'en' ? 'Currently Blocked IPs' : 'Häzir bloklanan IP-ler' }}</h4>
            <DataTable :value="wafStats.blockedIPs" stripedRows responsiveLayout="scroll">
              <Column field="ip" header="IP"></Column>
              <Column field="violations" :header="language === 'en' ? 'Violations' : 'Bozulmalar'"></Column>
              <Column field="blockedUntil" :header="language === 'en' ? 'Blocked Until' : 'Bloklanan wagty'">
                <template #body="{ data }">
                  {{ formatTimestamp(data.blockedUntil) }}
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- No threats message -->
          <div v-if="wafStats.totalThreats === 0" class="waf-no-threats">
            <i class="pi pi-check-circle"></i>
            <p>{{ language === 'en' ? 'No threats detected yet. WAF is actively monitoring all requests.' : 'Heniz howp tapylmady. WAF ähli soraglary işjeň gözegçilik edýär.' }}</p>
          </div>
        </template>
      </Card>

      <!-- Simulation Charts (from real data) -->
      <div class="charts-grid" v-if="attackStats.length > 0">
        <!-- Attack Success Rate from Simulations -->
        <Card class="chart-card">
          <template #content>
            <h3><i class="pi pi-chart-bar"></i> {{ language === 'en' ? 'Simulation Results by Attack' : 'Hüjüm boýunça simulýasiýa netijeleri' }}</h3>
            <p class="chart-subtitle">{{ language === 'en' ? 'Real data from your experiments' : 'Siziň synag maglumatlaryňyz' }}</p>
            <div class="chart-container">
              <Bar :data="simAttackChartData" :options="barChartOptions" />
            </div>
          </template>
        </Card>

        <!-- Detection vs Success -->
        <Card class="chart-card">
          <template #content>
            <h3><i class="pi pi-chart-bar"></i> {{ language === 'en' ? 'Detection vs Success Rate' : 'Tapylma we Üstünlik deňeşdirmesi' }}</h3>
            <p class="chart-subtitle">{{ language === 'en' ? 'How well defenses detect attacks' : 'Goraglar hüjümleri nähili gowy tapýar' }}</p>
            <div class="chart-container">
              <Bar :data="detectionVsSuccessData" :options="groupedBarOptions" />
            </div>
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'StatisticsView',
  components: { Bar },
  props: { t: Object, language: String },
  setup(props) {
    const loading = ref(true)
    const statistics = ref(null)

    const API_URL = 'http://localhost:7061/api'

    // Fetch real data from backend
    onMounted(async () => {
      try {
        const statsRes = await fetch(`${API_URL}/statistics`).then(r => r.json())
        statistics.value = statsRes.statistics || null
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        loading.value = false
      }
    })

    const overviewStats = computed(() => {
      const summary = statistics.value?.summary || {}
      const waf = statistics.value?.waf || {}
      const totalSims = summary.totalSimulations || 0
      const successRate = parseFloat(summary.overallSuccessRate) || 0
      const detectionRate = parseFloat(summary.overallDetectionRate) || 0
      const wafThreats = waf.totalThreats || 0

      return [
        { icon: 'pi pi-play', value: totalSims, label: props.language === 'en' ? 'Simulations Run' : 'Geçirilen simulýasiýalar', color: '#6366f1' },
        { icon: 'pi pi-bolt', value: `${successRate}%`, label: props.language === 'en' ? 'Attack Success Rate' : 'Hüjüm üstünligi', color: '#ef4444' },
        { icon: 'pi pi-eye', value: `${detectionRate}%`, label: props.language === 'en' ? 'Detection Rate' : 'Tapylma derejesi', color: '#10b981' },
        { icon: 'pi pi-shield', value: wafThreats, label: props.language === 'en' ? 'WAF Threats Caught' : 'WAF tutulan howplar', color: '#f59e0b' }
      ]
    })

    // Charts based on real simulation data
    const simAttackChartData = computed(() => {
      const byAttack = statistics.value?.byAttack || []
      return {
        labels: byAttack.map(s => s.attackType.toUpperCase()),
        datasets: [{
          label: props.language === 'en' ? 'Success Rate (%)' : 'Üstünlik (%)',
          data: byAttack.map(s => parseFloat(s.successRate) || 0),
          backgroundColor: [
            '#ef4444', '#f59e0b', '#8b5cf6', '#dc2626',
            '#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ec4899'
          ],
          borderRadius: 8
        }]
      }
    })

    const detectionVsSuccessData = computed(() => {
      const byAttack = statistics.value?.byAttack || []
      return {
        labels: byAttack.map(s => s.attackType.toUpperCase()),
        datasets: [
          {
            label: props.language === 'en' ? 'Attack Success %' : 'Hüjüm üstünligi %',
            data: byAttack.map(s => parseFloat(s.successRate) || 0),
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderRadius: 6
          },
          {
            label: props.language === 'en' ? 'Detection Rate %' : 'Tapylma derejesi %',
            data: byAttack.map(s => parseFloat(s.detectionRate) || 0),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderRadius: 6
          }
        ]
      }
    })

    const groupedBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}%`
          }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }

    // WAF statistics
    const wafStats = computed(() => {
      const waf = statistics.value?.waf || {}
      return {
        totalThreats: waf.totalThreats || 0,
        blocked: waf.blocked || 0,
        alerted: waf.alerted || 0,
        blockRate: waf.blockRate || 0,
        byType: waf.byType || [],
        recentThreats: waf.recentThreats || [],
        blockedIPs: waf.blockedIPs || []
      }
    })

    const formatWafType = (type) => {
      const map = {
        sql_injection: 'SQL Injection',
        xss: 'XSS',
        path_traversal: 'Path Traversal',
        command_injection: 'CMD Injection',
        bot_signatures: 'Bot/Scanner',
        blocked_ip: 'Blocked IP'
      }
      return map[type] || type
    }

    const getWafTypeSeverity = (type) => {
      const map = {
        sql_injection: 'danger',
        xss: 'danger',
        command_injection: 'danger',
        path_traversal: 'warn',
        bot_signatures: 'info',
        blocked_ip: 'danger'
      }
      return map[type] || 'info'
    }

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

    return {
      loading,
      overviewStats,
      simAttackChartData,
      detectionVsSuccessData,
      barChartOptions,
      groupedBarOptions,
      simulationSummary,
      attackStats,
      recentSimulations,
      wafStats,
      formatWafType,
      getWafTypeSeverity,
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

.rate-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 1024px) {
  .stats-overview { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .page-header h1 { font-size: 1.5rem; }
  .stat-box { padding: 1rem; gap: 0.75rem; }
  .stat-value { font-size: 1.4rem; }
  .stat-icon { width: 40px; height: 40px; }
  .stat-icon i { font-size: 1.2rem; }
  .chart-container { height: 220px; }
  .chart-card h3 { font-size: 0.9rem; }
  .simulations-card :deep(.p-datatable) { overflow-x: auto; }
}

@media (max-width: 600px) {
  .stats-overview { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .stat-box { padding: 0.75rem; }
  .stat-value { font-size: 1.2rem; }
  .stat-label { font-size: 0.8rem; }
  .chart-container { height: 180px; }
  .summary-value { font-size: 1.5rem; }
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
  .summary-box { padding: 1rem; }
}

/* WAF Analytics Styles */
.waf-analytics-card { margin-bottom: 1.5rem; }
.waf-analytics-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.waf-analytics-card h3 i { color: #10b981; }

.waf-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.waf-stat-box {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.waf-stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.waf-stat-icon i { color: white; font-size: 1.2rem; }
.waf-stat-icon.threats { background: #f59e0b; }
.waf-stat-icon.blocked { background: #ef4444; }
.waf-stat-icon.alerted { background: #6366f1; }
.waf-stat-icon.rate { background: #10b981; }

.waf-stat-value { display: block; font-size: 1.5rem; font-weight: 700; }
.waf-stat-label { color: var(--text-secondary); font-size: 0.8rem; }

.waf-threats-section { margin-top: 1rem; }

.risk-critical :deep(.p-progressbar-value) { background: #ef4444; }
.risk-high :deep(.p-progressbar-value) { background: #f59e0b; }
.risk-medium :deep(.p-progressbar-value) { background: #6366f1; }

.path-code {
  font-family: monospace;
  font-size: 0.8rem;
  background: var(--bg-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.risk-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.risk-badge.critical { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.risk-badge.high { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.risk-badge.medium { background: rgba(99, 102, 241, 0.15); color: #6366f1; }

.waf-no-threats {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}
.waf-no-threats i {
  font-size: 2.5rem;
  color: #10b981;
  margin-bottom: 0.75rem;
  display: block;
}

@media (max-width: 1024px) {
  .waf-summary { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .waf-summary { grid-template-columns: 1fr; }
}
</style>
