<template>
  <div class="rules-view">
    <div class="page-header">
      <h1>{{ t.rules.title }}</h1>
      <p>{{ t.rules.subtitle }}</p>
    </div>

    <Card>
      <template #content>
        <div class="rules-header">
          <h3>Protection Rules</h3>
          <div class="rules-actions">
            <Button
              v-if="!allEnabled"
              label="Enable All"
              icon="pi pi-check-circle"
              severity="success"
              @click="toggleAllRules(true)"
              :loading="togglingAll"
            />
            <Button
              v-else
              label="Disable All"
              icon="pi pi-times-circle"
              severity="danger"
              @click="toggleAllRules(false)"
              :loading="togglingAll"
            />
            <Button label="Refresh" icon="pi pi-refresh" severity="secondary" @click="fetchRules" />
          </div>
        </div>

        <DataTable :value="rules" :paginator="true" :rows="10" stripedRows>
          <Column field="name" :header="t.rules.columns.name" style="width: 25%"></Column>
          <Column field="pattern" :header="t.rules.columns.pattern" style="width: 20%"></Column>
          <Column field="action" :header="t.rules.columns.action" style="width: 12%">
            <template #body="{ data }">
              <Tag :severity="getActionSeverity(data.action)" :value="data.action" />
            </template>
          </Column>
          <Column field="severity" :header="t.rules.columns.severity" style="width: 12%">
            <template #body="{ data }">
              <Tag :severity="getSeverityColor(data.severity)" :value="data.severity" />
            </template>
          </Column>
          <Column field="hits" :header="t.rules.columns.hits" style="width: 12%">
            <template #body="{ data }">
              <strong>{{ data.hits.toLocaleString() }}</strong>
            </template>
          </Column>
          <Column field="enabled" :header="t.rules.columns.status" style="width: 19%">
            <template #body="{ data }">
              <ToggleSwitch v-model="data.enabled" @change="toggleRule(data.id)" />
              <Tag :severity="data.enabled ? 'success' : 'secondary'" :value="data.enabled ? 'Active' : 'Disabled'" style="margin-left: 0.5rem" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const rules = ref([])
    const loading = ref(true)
    const togglingAll = ref(false)
    const allEnabled = ref(false)

    const fetchRules = async () => {
      try {
        const res = await fetch('/api/rules')
        const data = await res.json()
        if (data.success) {
          // Convert enabled from 0/1 to boolean
          rules.value = data.rules.map(rule => ({
            ...rule,
            enabled: Boolean(rule.enabled)
          }))
          // Check if all rules are enabled
          allEnabled.value = rules.value.length > 0 && rules.value.every(r => r.enabled)
        }
      } catch (e) {
        console.error('Failed to fetch rules:', e)
      } finally {
        loading.value = false
      }
    }

    const toggleRule = async (id) => {
      try {
        const res = await fetch(`/api/rules/${id}/toggle`, { method: 'PATCH' })
        const data = await res.json()
        if (data.success) {
          // Update local state
          const rule = rules.value.find(r => r.id === id)
          if (rule) {
            rule.enabled = Boolean(data.rule.enabled)
          }
          // Update allEnabled state
          allEnabled.value = rules.value.length > 0 && rules.value.every(r => r.enabled)
        }
      } catch (e) {
        console.error('Failed to toggle rule:', e)
        // Revert on error
        fetchRules()
      }
    }

    // Toggle all rules (enable or disable)
    const toggleAllRules = async (enable) => {
      togglingAll.value = true
      try {
        const endpoint = enable ? '/api/rules/enable-all' : '/api/rules/disable-all'
        const res = await fetch(endpoint, { method: 'POST' })
        const data = await res.json()
        if (data.success) {
          rules.value = data.rules.map(rule => ({
            ...rule,
            enabled: Boolean(rule.enabled)
          }))
          allEnabled.value = enable
        }
      } catch (e) {
        console.error('Failed to toggle all rules:', e)
      } finally {
        togglingAll.value = false
      }
    }

    const getActionSeverity = (action) => {
      const map = { block: 'danger', allow: 'success', challenge: 'warn', limit: 'info', alert: 'secondary' }
      return map[action] || 'info'
    }

    const getSeverityColor = (severity) => {
      const map = { critical: 'danger', high: 'warn', medium: 'info', low: 'secondary' }
      return map[severity] || 'info'
    }

    onMounted(fetchRules)

    return {
      rules, loading, toggleRule, getActionSeverity, getSeverityColor, fetchRules,
      togglingAll, toggleAllRules, allEnabled
    }
  }
}
</script>

<style scoped>
.rules-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.page-header p {
  color: var(--text-secondary);
}

/* Rules Header */
.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.rules-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.rules-actions {
  display: flex;
  gap: 0.5rem;
}

:deep(.p-card) {
  animation: fadeInUp 0.6s ease-out 0.2s both;
  border-radius: 16px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-datatable-tbody > tr) {
  transition: all 0.3s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  transform: scale(1.01);
}

:deep(.p-toggleswitch) {
  transition: all 0.3s ease;
}

:deep(.p-toggleswitch:hover) {
  transform: scale(1.1);
}

:deep(.p-tag) {
  transition: all 0.3s ease;
}

:deep(.p-tag:hover) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .rules-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .rules-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  :deep(.p-datatable-table-container) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }


  .result-value {
    font-size: 1rem;
  }
}
</style>
