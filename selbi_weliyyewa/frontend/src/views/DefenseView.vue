<template>
  <div class="defense-view">
    <div class="page-header">
      <h1>{{ t.defense.title }}</h1>
      <p>{{ t.defense.subtitle }}</p>
    </div>

    <div class="defense-grid">
      <Card v-for="(defense, key) in defenses" :key="key" class="defense-card">
        <template #content>
          <div class="defense-header">
            <div class="defense-icon" :style="{ background: defense.color }">
              <i :class="defense.icon"></i>
            </div>
            <div>
              <h3>{{ defense.title }}</h3>
              <p class="defense-desc">{{ defense.desc }}</p>
            </div>
          </div>

          <p class="defense-details">{{ defense.details }}</p>

          <div class="effectiveness-section">
            <div class="effectiveness-label">
              <span>{{ t.defense.effectiveness }}</span>
              <span class="effectiveness-value">{{ defense.effectiveness }}%</span>
            </div>
            <ProgressBar :value="defense.effectiveness" :showValue="false" :style="{ height: '8px' }" />
          </div>

          <div class="complexity-badge">
            <Tag :severity="getComplexitySeverity(defense.complexity)" :value="t.defense.implementation + ': ' + defense.complexity" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DefenseView',
  props: { t: Object, language: String },
  setup(props) {
    const defenses = computed(() => ({
      adversarialTraining: {
        ...props.t.defense.categories.adversarialTraining,
        icon: 'pi pi-sync',
        color: '#10b981',
        complexity: props.language === 'en' ? 'Medium' : 'Orta'
      },
      inputPreprocessing: {
        ...props.t.defense.categories.inputPreprocessing,
        icon: 'pi pi-filter',
        color: '#0ea5e9',
        complexity: props.language === 'en' ? 'Low' : 'Pes'
      },
      gradientMasking: {
        ...props.t.defense.categories.gradientMasking,
        icon: 'pi pi-eye-slash',
        color: '#8b5cf6',
        complexity: props.language === 'en' ? 'High' : 'Ýokary'
      },
      differentialPrivacy: {
        ...props.t.defense.categories.differentialPrivacy,
        icon: 'pi pi-lock',
        color: '#f59e0b',
        complexity: props.language === 'en' ? 'High' : 'Ýokary'
      },
      ensembleMethods: {
        ...props.t.defense.categories.ensembleMethods,
        icon: 'pi pi-th-large',
        color: '#6366f1',
        complexity: props.language === 'en' ? 'Medium' : 'Orta'
      },
      detectionMethods: {
        ...props.t.defense.categories.detectionMethods,
        icon: 'pi pi-search',
        color: '#ef4444',
        complexity: props.language === 'en' ? 'Medium' : 'Orta'
      }
    }))

    const getComplexitySeverity = (complexity) => {
      if (complexity === 'High' || complexity === 'Ýokary') return 'danger'
      if (complexity === 'Medium' || complexity === 'Orta') return 'warn'
      return 'success'
    }

    return { defenses, getComplexitySeverity }
  }
}
</script>

<style scoped>
.defense-view { max-width: 1200px; margin: 0 auto; }

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.defense-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.defense-card { transition: transform 0.2s; }
.defense-card:hover { transform: translateY(-4px); }

.defense-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.defense-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.defense-icon i { font-size: 1.5rem; color: white; }

.defense-header h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
.defense-desc { color: var(--text-secondary); font-size: 0.85rem; }

.defense-details {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.effectiveness-section { margin-bottom: 1rem; }

.effectiveness-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.effectiveness-value {
  font-weight: 600;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .defense-grid { grid-template-columns: 1fr; }
  .page-header h1 { font-size: 1.5rem; }
  .defense-header h3 { font-size: 1rem; }
  .defense-icon { width: 42px; height: 42px; }
  .defense-icon i { font-size: 1.2rem; }
}

@media (max-width: 480px) {
  .defense-header { gap: 0.75rem; }
  .defense-desc { font-size: 0.8rem; }
  .defense-details { font-size: 0.85rem; }
}
</style>
