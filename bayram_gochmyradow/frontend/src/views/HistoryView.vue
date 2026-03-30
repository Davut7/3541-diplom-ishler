<template>
  <div class="history-view">
    <div class="history-header">
      <h1>{{ t('history.title') }}</h1>
      <p>{{ t('history.subtitle') }}</p>
    </div>

    <!-- Statistics Cards -->
    <section v-if="stats" class="statistics">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="pi pi-chart-bar"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalAnalyses }}</span>
          <span class="stat-label">{{ t('history.stats.totalAnalyses') }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="pi pi-percentage"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.averageRiskScore }}%</span>
          <span class="stat-label">{{ t('history.stats.avgRisk') }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalIssuesFound }}</span>
          <span class="stat-label">{{ t('history.stats.issuesFound') }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">
          <i class="pi pi-info-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalWarningsFound }}</span>
          <span class="stat-label">{{ t('history.stats.warnings') }}</span>
        </div>
      </div>
    </section>

    <!-- Risk Distribution Chart -->
    <section v-if="stats" class="chart-section">
      <div class="chart-card">
        <h3>{{ t('history.riskDistribution') }}</h3>
        <div class="risk-chart">
          <div class="chart-bars">
            <div class="chart-bar-wrapper">
              <div
                class="chart-bar critical"
                :style="{ height: getBarHeight(stats.riskDistribution.critical) }"
              >
                <span class="bar-value">{{ stats.riskDistribution.critical }}</span>
              </div>
              <span class="bar-label">Critical</span>
            </div>
            <div class="chart-bar-wrapper">
              <div
                class="chart-bar high"
                :style="{ height: getBarHeight(stats.riskDistribution.high) }"
              >
                <span class="bar-value">{{ stats.riskDistribution.high }}</span>
              </div>
              <span class="bar-label">High</span>
            </div>
            <div class="chart-bar-wrapper">
              <div
                class="chart-bar medium"
                :style="{ height: getBarHeight(stats.riskDistribution.medium) }"
              >
                <span class="bar-value">{{ stats.riskDistribution.medium }}</span>
              </div>
              <span class="bar-label">Medium</span>
            </div>
            <div class="chart-bar-wrapper">
              <div
                class="chart-bar low"
                :style="{ height: getBarHeight(stats.riskDistribution.low) }"
              >
                <span class="bar-value">{{ stats.riskDistribution.low }}</span>
              </div>
              <span class="bar-label">Low</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>{{ t('history.riskBreakdown') }}</h3>
        <div class="pie-chart">
          <div class="pie-segments">
            <div
              class="pie-segment"
              v-for="(value, key) in stats.riskDistribution"
              :key="key"
              :class="key"
              :style="{ '--percentage': getPercentage(value) + '%' }"
            >
            </div>
          </div>
          <div class="pie-legend">
            <div class="legend-item" v-for="(value, key) in stats.riskDistribution" :key="key">
              <span class="legend-color" :class="key"></span>
              <span class="legend-label">{{ key }}</span>
              <span class="legend-value">{{ getPercentage(value) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- History List -->
    <section class="history-list-section">
      <div class="section-header">
        <h2>{{ t('history.recentAnalyses') }}</h2>
        <div class="header-actions">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.search') + '...'"
              @keyup.enter="searchAnalyses"
            />
            <button v-if="searchQuery" @click="searchQuery = ''; loadData()" class="clear-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="filter-buttons">
            <button
              @click="filterByRisk('')"
              :class="{ active: !filterRisk }"
              class="filter-btn"
            >
              {{ t('common.all') }}
            </button>
            <button
              @click="filterByRisk('critical')"
              :class="{ active: filterRisk === 'critical' }"
              class="filter-btn critical"
            >
              Critical
            </button>
            <button
              @click="filterByRisk('high')"
              :class="{ active: filterRisk === 'high' }"
              class="filter-btn high"
            >
              High
            </button>
            <button
              @click="filterByRisk('medium')"
              :class="{ active: filterRisk === 'medium' }"
              class="filter-btn medium"
            >
              Medium
            </button>
            <button
              @click="filterByRisk('low')"
              :class="{ active: filterRisk === 'low' }"
              class="filter-btn low"
            >
              Low
            </button>
          </div>
          <button v-if="history.length > 0" @click="clearAllHistory" class="btn btn-danger">
            <i class="pi pi-trash"></i>
            {{ t('history.clearAll') }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="history.length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <h3>{{ t('history.noHistory') }}</h3>
        <p>{{ t('history.noHistoryDesc') }}</p>
        <router-link to="/analyze" class="btn btn-primary">
          <i class="pi pi-upload"></i>
          {{ t('history.startAnalysis') }}
        </router-link>
      </div>

      <div v-else class="history-list">
        <div
          v-for="item in history"
          :key="item.id"
          class="history-item"
          :class="'risk-' + item.riskLevel"
        >
          <div class="item-icon">
            <i class="pi pi-android"></i>
          </div>
          <div class="item-info">
            <h4>{{ item.fileName }}</h4>
            <p>{{ item.packageName }}</p>
            <span class="item-date">{{ formatDate(item.analyzedAt) }}</span>
          </div>
          <div class="item-stats">
            <div class="stat">
              <span class="value">{{ item.riskScore }}%</span>
              <span class="label">Risk</span>
            </div>
            <div class="stat">
              <span class="value">{{ item.permissionCount }}</span>
              <span class="label">Perms</span>
            </div>
            <div class="stat">
              <span class="value">{{ item.summary.issues }}</span>
              <span class="label">Issues</span>
            </div>
          </div>
          <div class="item-risk">
            <span class="risk-badge" :class="item.riskLevel">
              {{ item.riskLevel.toUpperCase() }}
            </span>
          </div>
          <button @click="removeItem(item.id)" class="remove-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:7021/api'

const i18n = inject('i18n')

const history = ref([])
const stats = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const filterRisk = ref('')

function t(key) {
  return i18n.t(key)
}

async function loadData() {
  loading.value = true
  try {
    const [historyRes, statsRes] = await Promise.all([
      axios.get(`${API_URL}/history`),
      axios.get(`${API_URL}/history/stats`)
    ])

    if (historyRes.data.success) {
      history.value = historyRes.data.data
    }

    if (statsRes.data.success && statsRes.data.data) {
      stats.value = statsRes.data.data
    }
  } catch (error) {
    console.error('Error loading history:', error)
  } finally {
    loading.value = false
  }
}

async function clearAllHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    try {
      await axios.delete(`${API_URL}/history`)
      history.value = []
      stats.value = null
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }
}

async function removeItem(id) {
  try {
    await axios.delete(`${API_URL}/history/${id}`)
    await loadData()
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

async function searchAnalyses() {
  if (!searchQuery.value.trim()) {
    await loadData()
    return
  }

  loading.value = true
  try {
    const res = await axios.get(`${API_URL}/history/search`, {
      params: { q: searchQuery.value }
    })
    if (res.data.success) {
      history.value = res.data.data
    }
  } catch (error) {
    console.error('Error searching:', error)
  } finally {
    loading.value = false
  }
}

async function filterByRisk(level) {
  if (!level) {
    filterRisk.value = ''
    await loadData()
    return
  }

  loading.value = true
  filterRisk.value = level
  try {
    const res = await axios.get(`${API_URL}/history/filter/${level}`)
    if (res.data.success) {
      history.value = res.data.data
    }
  } catch (error) {
    console.error('Error filtering:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getBarHeight(value) {
  if (!stats.value || stats.value.totalAnalyses === 0) return '0%'
  const maxValue = Math.max(
    stats.value.riskDistribution.critical,
    stats.value.riskDistribution.high,
    stats.value.riskDistribution.medium,
    stats.value.riskDistribution.low
  )
  if (maxValue === 0) return '0%'
  return Math.max(20, (value / maxValue) * 100) + '%'
}

function getPercentage(value) {
  if (!stats.value || stats.value.totalAnalyses === 0) return 0
  return Math.round((value / stats.value.totalAnalyses) * 100)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.history-view {
  max-width: 1200px;
  margin: 0 auto;
}

.history-header {
  text-align: center;
  margin-bottom: 3rem;
}

.history-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.history-header p {
  color: var(--text-secondary);
}

/* Statistics */
.statistics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 1.25rem;
  color: white;
}

.stat-icon.blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.stat-icon.orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.stat-icon.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
.stat-icon.yellow { background: linear-gradient(135deg, #eab308, #ca8a04); }

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Charts */
.chart-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.chart-card h3 {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: var(--text-secondary);
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 1rem 0;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.chart-bar {
  width: 50px;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
  min-height: 30px;
  transition: height 0.3s;
}

.chart-bar.critical { background: linear-gradient(180deg, #ef4444, #dc2626); }
.chart-bar.high { background: linear-gradient(180deg, #f97316, #ea580c); }
.chart-bar.medium { background: linear-gradient(180deg, #eab308, #ca8a04); }
.chart-bar.low { background: linear-gradient(180deg, #22c55e, #16a34a); }

.bar-value {
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
}

.bar-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.pie-segments {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #dc2626 0% 25%,
    #ea580c 25% 50%,
    #ca8a04 50% 75%,
    #16a34a 75% 100%
  );
  position: relative;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.critical { background: #dc2626; }
.legend-color.high { background: #ea580c; }
.legend-color.medium { background: #ca8a04; }
.legend-color.low { background: #16a34a; }

.legend-label {
  text-transform: capitalize;
  flex: 1;
}

.legend-value {
  font-weight: 600;
}

/* History List */
.section-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  color: var(--text-secondary);
}

.search-box input {
  width: 100%;
  padding: 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-box .clear-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 2rem;
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.filter-btn.critical.active {
  background: #dc2626;
  border-color: #dc2626;
}

.filter-btn.high.active {
  background: #ea580c;
  border-color: #ea580c;
}

.filter-btn.medium.active {
  background: #ca8a04;
  border-color: #ca8a04;
}

.filter-btn.low.active {
  background: #16a34a;
  border-color: #16a34a;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.loading-state i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.loading-state p {
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.empty-state i {
  font-size: 4rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: var(--card-bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.history-item:hover {
  box-shadow: var(--shadow);
  border-color: var(--primary-color);
}

.item-icon {
  width: 50px;
  height: 50px;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin-bottom: 0.25rem;
}

.item-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: monospace;
}

.item-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.item-stats {
  display: flex;
  gap: 1.5rem;
}

.item-stats .stat {
  text-align: center;
}

.item-stats .value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
}

.item-stats .label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.risk-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-badge.critical { background: #fef2f2; color: #dc2626; }
.risk-badge.high { background: #fff7ed; color: #ea580c; }
.risk-badge.medium { background: #fefce8; color: #ca8a04; }
.risk-badge.low { background: #f0fdf4; color: #16a34a; }

.remove-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

@media (max-width: 1024px) {
  .statistics {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .statistics {
    grid-template-columns: 1fr;
  }

  .history-item {
    flex-wrap: wrap;
  }

  .item-stats {
    width: 100%;
    justify-content: space-around;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }
}
</style>
