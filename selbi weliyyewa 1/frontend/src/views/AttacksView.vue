<template>
  <div class="attacks-view">
    <div class="page-header">
      <h1>{{ t.attacks.title }}</h1>
      <p>{{ t.attacks.subtitle }}</p>
    </div>

    <div class="attacks-grid">
      <Card v-for="(attack, key) in attacks" :key="key" class="attack-card" @click="selectedAttack = key">
        <template #content>
          <div class="attack-header">
            <div class="attack-icon" :style="{ background: attack.color }">
              <i :class="attack.icon"></i>
            </div>
            <div>
              <h3>{{ attack.title }}</h3>
              <p class="attack-desc">{{ attack.desc }}</p>
            </div>
          </div>

          <div class="attack-meta">
            <Tag :severity="getRiskSeverity(attack.risk)" :value="t.attacks.riskLevel + ': ' + attack.risk" />
          </div>

          <p class="attack-details">{{ attack.details }}</p>

          <div class="attack-methods">
            <h4>{{ language === 'en' ? 'Attack Methods:' : 'Hüjüm Usullary:' }}</h4>
            <div class="methods-list">
              <Tag v-for="method in attack.methods" :key="method" :value="method" severity="secondary" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'AttacksView',
  props: { t: Object, language: String },
  setup(props) {
    const selectedAttack = ref(null)

    const attacks = computed(() => ({
      adversarial: {
        ...props.t.attacks.categories.adversarial,
        icon: 'pi pi-bolt',
        color: '#ef4444',
        risk: props.language === 'en' ? 'High' : 'Ýokary'
      },
      inversion: {
        ...props.t.attacks.categories.inversion,
        icon: 'pi pi-replay',
        color: '#f59e0b',
        risk: props.language === 'en' ? 'Critical' : 'Howply'
      },
      membership: {
        ...props.t.attacks.categories.membership,
        icon: 'pi pi-users',
        color: '#8b5cf6',
        risk: props.language === 'en' ? 'Medium' : 'Orta'
      },
      poisoning: {
        ...props.t.attacks.categories.poisoning,
        icon: 'pi pi-exclamation-triangle',
        color: '#dc2626',
        risk: props.language === 'en' ? 'Critical' : 'Howply'
      },
      modeCollapse: {
        ...props.t.attacks.categories.modeCollapse,
        icon: 'pi pi-chart-line',
        color: '#6366f1',
        risk: props.language === 'en' ? 'Medium' : 'Orta'
      },
      stealing: {
        ...props.t.attacks.categories.stealing,
        icon: 'pi pi-download',
        color: '#0ea5e9',
        risk: props.language === 'en' ? 'High' : 'Ýokary'
      }
    }))

    const getRiskSeverity = (risk) => {
      if (risk === 'Critical' || risk === 'Howply') return 'danger'
      if (risk === 'High' || risk === 'Ýokary') return 'warn'
      return 'info'
    }

    return { attacks, selectedAttack, getRiskSeverity }
  }
}
</script>

<style scoped>
.attacks-view { max-width: 1200px; margin: 0 auto; }

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.attacks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.attack-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.attack-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.attack-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.attack-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.attack-icon i { font-size: 1.5rem; color: white; }

.attack-header h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
.attack-desc { color: var(--text-secondary); font-size: 0.85rem; }

.attack-meta { margin-bottom: 1rem; }

.attack-details {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.attack-methods h4 {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.methods-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .attacks-grid { grid-template-columns: 1fr; }
}
</style>
