<template>
  <div class="comparison-view">
    <div class="page-header">
      <h1>{{ t.comparison.title }}</h1>
      <p>{{ t.comparison.subtitle }}</p>
    </div>

    <!-- Comparison Table -->
    <Card class="comparison-card">
      <template #content>
        <div class="table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>{{ language === 'en' ? 'Feature' : 'Aýratynlyk' }}</th>
                <th class="highlight">{{ t.comparison.tools.osint }}</th>
                <th>{{ t.comparison.tools.shodan }}</th>
                <th>{{ t.comparison.tools.censys }}</th>
                <th>{{ t.comparison.tools.nmap }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(feature, key) in features" :key="key">
                <td>{{ t.comparison.features[key] }}</td>
                <td class="highlight">
                  <i v-if="feature.osint === true" class="pi pi-check-circle success"></i>
                  <i v-else-if="feature.osint === false" class="pi pi-times-circle danger"></i>
                  <span v-else class="partial">{{ feature.osint }}</span>
                </td>
                <td>
                  <i v-if="feature.shodan === true" class="pi pi-check-circle success"></i>
                  <i v-else-if="feature.shodan === false" class="pi pi-times-circle danger"></i>
                  <span v-else class="partial">{{ feature.shodan }}</span>
                </td>
                <td>
                  <i v-if="feature.censys === true" class="pi pi-check-circle success"></i>
                  <i v-else-if="feature.censys === false" class="pi pi-times-circle danger"></i>
                  <span v-else class="partial">{{ feature.censys }}</span>
                </td>
                <td>
                  <i v-if="feature.nmap === true" class="pi pi-check-circle success"></i>
                  <i v-else-if="feature.nmap === false" class="pi pi-times-circle danger"></i>
                  <span v-else class="partial">{{ feature.nmap }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Card>

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item">
        <i class="pi pi-check-circle success"></i>
        <span>{{ t.comparison.legend.yes }}</span>
      </div>
      <div class="legend-item">
        <i class="pi pi-times-circle danger"></i>
        <span>{{ t.comparison.legend.no }}</span>
      </div>
      <div class="legend-item">
        <span class="partial-badge">~</span>
        <span>{{ t.comparison.legend.partial }}</span>
      </div>
      <div class="legend-item">
        <span class="paid-badge">$</span>
        <span>{{ t.comparison.legend.paid }}</span>
      </div>
    </div>

    <!-- Advantages -->
    <section class="advantages-section">
      <h2>{{ t.comparison.advantages.title }}</h2>
      <div class="advantages-grid">
        <Card v-for="(adv, key) in advantages" :key="key" class="advantage-card">
          <template #content>
            <i :class="adv.icon"></i>
            <h3>{{ adv.title }}</h3>
            <p>{{ adv.desc }}</p>
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ComparisonView',
  props: {
    t: Object,
    language: String
  },
  setup(props) {
    const features = {
      dnsLookup: { osint: true, shodan: true, censys: true, nmap: true },
      whoisQuery: { osint: true, shodan: true, censys: true, nmap: false },
      geoLocation: { osint: true, shodan: true, censys: true, nmap: false },
      portScanning: { osint: true, shodan: true, censys: true, nmap: true },
      riskAssessment: { osint: true, shodan: '~', censys: '~', nmap: false },
      reportGeneration: { osint: true, shodan: '$', censys: '$', nmap: true },
      multilingual: { osint: true, shodan: false, censys: false, nmap: false },
      freeToUse: { osint: true, shodan: '~', censys: '~', nmap: true },
      noApiKey: { osint: true, shodan: false, censys: false, nmap: true },
      localExecution: { osint: true, shodan: false, censys: false, nmap: true },
      openSource: { osint: true, shodan: false, censys: false, nmap: true },
      privacyFocused: { osint: true, shodan: false, censys: false, nmap: true }
    }

    const advantages = computed(() => [
      {
        icon: 'pi pi-dollar',
        title: props.t.comparison.advantages.free.title,
        desc: props.t.comparison.advantages.free.desc
      },
      {
        icon: 'pi pi-lock',
        title: props.t.comparison.advantages.privacy.title,
        desc: props.t.comparison.advantages.privacy.desc
      },
      {
        icon: 'pi pi-globe',
        title: props.t.comparison.advantages.bilingual.title,
        desc: props.t.comparison.advantages.bilingual.desc
      },
      {
        icon: 'pi pi-check',
        title: props.t.comparison.advantages.simple.title,
        desc: props.t.comparison.advantages.simple.desc
      }
    ])

    return { features, advantages }
  }
}
</script>

<style scoped>
.comparison-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.comparison-card {
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.comparison-table th {
  background: var(--bg-secondary);
  font-weight: 600;
}

.comparison-table th:first-child,
.comparison-table td:first-child {
  text-align: left;
}

.comparison-table th.highlight,
.comparison-table td.highlight {
  background: rgba(0, 212, 170, 0.1);
}

.comparison-table th.highlight {
  color: var(--primary-color);
}

.success {
  color: var(--success-color);
  font-size: 1.2rem;
}

.danger {
  color: var(--danger-color);
  font-size: 1.2rem;
}

.partial {
  background: var(--warning-color);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.partial-badge,
.paid-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.partial-badge {
  background: var(--warning-color);
  color: white;
}

.paid-badge {
  background: var(--danger-color);
  color: white;
}

.advantages-section h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.advantage-card {
  text-align: center;
}

.advantage-card i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.advantage-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.advantage-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .legend {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
