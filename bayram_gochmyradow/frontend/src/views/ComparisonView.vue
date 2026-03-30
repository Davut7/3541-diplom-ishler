<template>
  <div class="comparison-view">
    <div class="comparison-header">
      <h1>{{ t('comparison.title') }}</h1>
      <p>{{ t('comparison.subtitle') }}</p>
    </div>

    <!-- Comparison Table -->
    <section class="comparison-table-section">
      <div class="table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>{{ t('comparison.features.feature') }}</th>
              <th class="highlight">
                <div class="tool-header">
                  <i class="pi pi-shield"></i>
                  <span>{{ t('comparison.features.ourTool') }}</span>
                </div>
              </th>
              <th>
                <div class="tool-header">
                  <span>{{ t('comparison.features.virusTotal') }}</span>
                </div>
              </th>
              <th>
                <div class="tool-header">
                  <span>{{ t('comparison.features.mobSF') }}</span>
                </div>
              </th>
              <th>
                <div class="tool-header">
                  <span>{{ t('comparison.features.exodus') }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in comparisonData" :key="index">
              <td class="feature-name">{{ t(row.feature) }}</td>
              <td class="highlight">
                <span :class="getValueClass(row.ourTool)">
                  {{ getValueDisplay(row.ourTool) }}
                </span>
              </td>
              <td>
                <span :class="getValueClass(row.virusTotal)">
                  {{ getValueDisplay(row.virusTotal) }}
                </span>
              </td>
              <td>
                <span :class="getValueClass(row.mobSF)">
                  {{ getValueDisplay(row.mobSF) }}
                </span>
              </td>
              <td>
                <span :class="getValueClass(row.exodus)">
                  {{ getValueDisplay(row.exodus) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Legend -->
    <section class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <span class="value-yes"><i class="pi pi-check"></i></span>
          <span>{{ t('comparison.legend.yes') }}</span>
        </div>
        <div class="legend-item">
          <span class="value-no"><i class="pi pi-times"></i></span>
          <span>{{ t('comparison.legend.no') }}</span>
        </div>
        <div class="legend-item">
          <span class="value-partial"><i class="pi pi-minus"></i></span>
          <span>{{ t('comparison.legend.partial') }}</span>
        </div>
        <div class="legend-item">
          <span class="value-excellent">★★★</span>
          <span>{{ t('comparison.legend.excellent') }}</span>
        </div>
        <div class="legend-item">
          <span class="value-good">★★</span>
          <span>{{ t('comparison.legend.good') }}</span>
        </div>
        <div class="legend-item">
          <span class="value-average">★</span>
          <span>{{ t('comparison.legend.average') }}</span>
        </div>
      </div>
    </section>

    <!-- Our Advantages -->
    <section class="advantages">
      <h2>{{ t('comparison.advantages.title') }}</h2>
      <div class="advantages-grid">
        <div class="advantage-card" v-for="(advantage, index) in advantages" :key="index">
          <div class="advantage-icon">
            <i :class="advantageIcons[index]"></i>
          </div>
          <h3>{{ advantage.title }}</h3>
          <p>{{ advantage.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Tool Descriptions -->
    <section class="tool-descriptions">
      <h2>About the Tools</h2>
      <div class="tools-grid">
        <div class="tool-card">
          <h3>
            <i class="pi pi-shield"></i>
            Android Security Analyzer
          </h3>
          <p>Our tool is a lightweight, privacy-focused solution for analyzing Android APK files. It runs locally on your machine and provides comprehensive permission analysis with multi-language support.</p>
          <div class="tool-features">
            <span class="feature-tag">Open Source</span>
            <span class="feature-tag">Privacy First</span>
            <span class="feature-tag">Multi-language</span>
          </div>
        </div>
        <div class="tool-card">
          <h3>VirusTotal</h3>
          <p>VirusTotal is a popular online service that analyzes files using multiple antivirus engines. While powerful for malware detection, it uploads your files to external servers and may not provide detailed permission analysis.</p>
          <div class="tool-features">
            <span class="feature-tag">Multi-AV</span>
            <span class="feature-tag">Cloud-based</span>
          </div>
        </div>
        <div class="tool-card">
          <h3>MobSF</h3>
          <p>Mobile Security Framework (MobSF) is an automated, all-in-one mobile application security assessment framework. It's powerful but requires complex setup and technical knowledge to use effectively.</p>
          <div class="tool-features">
            <span class="feature-tag">Comprehensive</span>
            <span class="feature-tag">Complex Setup</span>
          </div>
        </div>
        <div class="tool-card">
          <h3>Exodus Privacy</h3>
          <p>Exodus Privacy focuses on tracking trackers and permissions in Android applications. It's specialized for privacy analysis but may not cover all security aspects of APK files.</p>
          <div class="tool-features">
            <span class="feature-tag">Privacy Focus</span>
            <span class="feature-tag">Tracker Detection</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-content">
        <h2>Try Android Security Analyzer</h2>
        <p>Experience fast, private, and comprehensive APK security analysis.</p>
        <router-link to="/analyze" class="btn btn-primary">
          <i class="pi pi-play"></i>
          Start Analysis
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const i18n = inject('i18n')

function t(key) {
  return i18n.t(key)
}

const comparisonData = [
  {
    feature: 'comparison.criteria.permissionAnalysis',
    ourTool: 'excellent',
    virusTotal: 'partial',
    mobSF: 'excellent',
    exodus: 'good'
  },
  {
    feature: 'comparison.criteria.riskAssessment',
    ourTool: 'excellent',
    virusTotal: 'good',
    mobSF: 'excellent',
    exodus: 'partial'
  },
  {
    feature: 'comparison.criteria.manifestInspection',
    ourTool: 'yes',
    virusTotal: 'partial',
    mobSF: 'yes',
    exodus: 'no'
  },
  {
    feature: 'comparison.criteria.multilingual',
    ourTool: 'yes',
    virusTotal: 'yes',
    mobSF: 'partial',
    exodus: 'yes'
  },
  {
    feature: 'comparison.criteria.freeToUse',
    ourTool: 'yes',
    virusTotal: 'partial',
    mobSF: 'yes',
    exodus: 'yes'
  },
  {
    feature: 'comparison.criteria.noRegistration',
    ourTool: 'yes',
    virusTotal: 'partial',
    mobSF: 'yes',
    exodus: 'yes'
  },
  {
    feature: 'comparison.criteria.privacyFocused',
    ourTool: 'yes',
    virusTotal: 'no',
    mobSF: 'yes',
    exodus: 'yes'
  },
  {
    feature: 'comparison.criteria.localAnalysis',
    ourTool: 'yes',
    virusTotal: 'no',
    mobSF: 'yes',
    exodus: 'no'
  },
  {
    feature: 'comparison.criteria.detailedReports',
    ourTool: 'yes',
    virusTotal: 'yes',
    mobSF: 'excellent',
    exodus: 'good'
  },
  {
    feature: 'comparison.criteria.easeOfUse',
    ourTool: 'excellent',
    virusTotal: 'excellent',
    mobSF: 'average',
    exodus: 'good'
  }
]

const advantages = computed(() => {
  const items = []
  for (let i = 0; i < 4; i++) {
    items.push({
      title: t(`comparison.advantages.items.${i}.title`),
      desc: t(`comparison.advantages.items.${i}.desc`)
    })
  }
  return items
})

const advantageIcons = [
  'pi pi-lock',
  'pi pi-bolt',
  'pi pi-search',
  'pi pi-globe'
]

function getValueClass(value) {
  const classes = {
    yes: 'value-yes',
    no: 'value-no',
    partial: 'value-partial',
    excellent: 'value-excellent',
    good: 'value-good',
    average: 'value-average'
  }
  return classes[value] || ''
}

function getValueDisplay(value) {
  const displays = {
    yes: '✓',
    no: '✗',
    partial: '~',
    excellent: '★★★',
    good: '★★',
    average: '★'
  }
  return displays[value] || value
}
</script>

<style scoped>
.comparison-view {
  max-width: 1200px;
  margin: 0 auto;
}

.comparison-header {
  text-align: center;
  margin-bottom: 3rem;
}

.comparison-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.comparison-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

section {
  margin-bottom: 4rem;
}

section h2 {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 2rem;
}

/* Comparison Table */
.table-wrapper {
  overflow-x: auto;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.comparison-table th {
  background: var(--bg-secondary);
  font-weight: 600;
}

.comparison-table th.highlight {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.comparison-table td.highlight {
  background: rgba(16, 185, 129, 0.05);
}

.tool-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.tool-header i {
  font-size: 1.5rem;
}

.feature-name {
  text-align: left;
  font-weight: 500;
}

.comparison-table tbody tr:hover {
  background: var(--bg-secondary);
}

.comparison-table tbody tr:hover td.highlight {
  background: rgba(16, 185, 129, 0.1);
}

/* Value styles */
.value-yes {
  color: #16a34a;
  font-size: 1.25rem;
  font-weight: 700;
}

.value-no {
  color: #dc2626;
  font-size: 1.25rem;
  font-weight: 700;
}

.value-partial {
  color: #ca8a04;
  font-size: 1.25rem;
  font-weight: 700;
}

.value-excellent {
  color: #16a34a;
  font-weight: 700;
}

.value-good {
  color: #ca8a04;
  font-weight: 700;
}

.value-average {
  color: #9ca3af;
  font-weight: 700;
}

/* Legend */
.legend {
  margin-bottom: 4rem;
}

.legend-items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Advantages */
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.advantage-card {
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s;
}

.advantage-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.advantage-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.advantage-icon i {
  font-size: 1.5rem;
  color: white;
}

.advantage-card h3 {
  margin-bottom: 0.75rem;
}

.advantage-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Tool Descriptions */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.tool-card {
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.tool-card:first-child {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05));
}

.tool-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tool-card h3 i {
  color: var(--primary-color);
}

.tool-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* CTA */
.cta {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
  color: white;
}

.cta h2 {
  color: white;
  margin-bottom: 0.75rem;
}

.cta p {
  opacity: 0.9;
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: white;
  color: var(--primary-color);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .comparison-header h1 {
    font-size: 1.75rem;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .legend-items {
    gap: 1rem;
  }
}
</style>
