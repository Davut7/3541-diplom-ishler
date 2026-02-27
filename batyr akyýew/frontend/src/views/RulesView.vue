<template>
  <div class="rules-view">
    <div class="page-header">
      <h1>{{ t.rules.title }}</h1>
      <p>{{ t.rules.subtitle }}</p>
    </div>

    <Card>
      <template #content>
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

    const fetchRules = async () => {
      try {
        const res = await fetch('/api/rules')
        const data = await res.json()
        if (data.success) rules.value = data.rules
      } catch (e) {
        console.error('Failed to fetch rules:', e)
      }
    }

    const toggleRule = async (id) => {
      try {
        await fetch(`/api/rules/${id}/toggle`, { method: 'PATCH' })
      } catch (e) {
        console.error('Failed to toggle rule:', e)
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

    return { rules, toggleRule, getActionSeverity, getSeverityColor }
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
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}
</style>
