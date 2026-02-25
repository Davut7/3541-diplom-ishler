<template>
  <div class="rules-view">
    <div class="page-header">
      <h1>{{ t.rules.title }}</h1>
      <p>{{ t.rules.subtitle }}</p>
    </div>

    <Card class="controls-card">
      <template #content>
        <div class="controls-row">
          <Button :label="t.rules.addRule" icon="pi pi-plus" />
          <Button :label="t.rules.aiSuggest" icon="pi pi-microchip-ai" severity="info" outlined @click="showSuggestions = !showSuggestions" />
        </div>
      </template>
    </Card>

    <Card v-if="showSuggestions" class="suggestions-card">
      <template #content>
        <h3><i class="pi pi-microchip-ai"></i> {{ t.rules.suggestions.title }}</h3>
        <p class="suggestions-desc">{{ t.rules.suggestions.desc }}</p>
        <div class="suggestions-list">
          <div v-for="(suggestion, i) in aiSuggestions" :key="i" class="suggestion-item">
            <div class="suggestion-info">
              <Tag :severity="getSeverity(suggestion.priority)" :value="suggestion.priority" />
              <span class="suggestion-name">{{ suggestion.name }}</span>
              <span class="suggestion-desc">{{ suggestion.description }}</span>
            </div>
            <div class="suggestion-actions">
              <Button :label="t.rules.suggestions.apply" icon="pi pi-check" size="small" />
              <Button :label="t.rules.suggestions.dismiss" icon="pi pi-times" size="small" severity="secondary" outlined />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="rules-table">
      <template #content>
        <DataTable :value="rules" :paginator="true" :rows="10" stripedRows sortMode="multiple">
          <Column field="id" :header="t.rules.columns.id" sortable style="width: 5%"></Column>
          <Column field="name" :header="t.rules.columns.name" sortable style="width: 20%"></Column>
          <Column field="source" :header="t.rules.columns.source" style="width: 12%">
            <template #body="{ data }">
              <code>{{ data.source }}</code>
            </template>
          </Column>
          <Column field="dest" :header="t.rules.columns.dest" style="width: 12%">
            <template #body="{ data }">
              <code>{{ data.dest }}</code>
            </template>
          </Column>
          <Column field="port" :header="t.rules.columns.port" style="width: 8%"></Column>
          <Column field="protocol" :header="t.rules.columns.protocol" style="width: 8%">
            <template #body="{ data }">
              <Tag :value="data.protocol" severity="info" />
            </template>
          </Column>
          <Column field="action" :header="t.rules.columns.action" style="width: 10%">
            <template #body="{ data }">
              <Tag :severity="getActionSeverity(data.action)" :value="data.action" />
            </template>
          </Column>
          <Column field="status" :header="t.rules.columns.status" style="width: 10%">
            <template #body="{ data }">
              <ToggleSwitch v-model="data.active" />
            </template>
          </Column>
          <Column field="aiScore" :header="t.rules.columns.aiScore" style="width: 15%">
            <template #body="{ data }">
              <div class="ai-score">
                <ProgressBar :value="data.aiScore" :showValue="false" style="height: 8px" />
                <span>{{ data.aiScore }}%</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const showSuggestions = ref(false)

    const rules = ref([
      { id: 1, name: 'Block SSH Brute Force', source: 'Any', dest: '10.0.0.0/24', port: '22', protocol: 'TCP', action: 'Deny', active: true, aiScore: 95 },
      { id: 2, name: 'Allow HTTP Traffic', source: 'Any', dest: 'Any', port: '80', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100 },
      { id: 3, name: 'Allow HTTPS Traffic', source: 'Any', dest: 'Any', port: '443', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100 },
      { id: 4, name: 'Block Known Malware IPs', source: '185.x.x.x', dest: 'Any', port: 'Any', protocol: 'Any', action: 'Drop', active: true, aiScore: 98 },
      { id: 5, name: 'DNS Traffic', source: 'Internal', dest: '8.8.8.8', port: '53', protocol: 'UDP', action: 'Allow', active: true, aiScore: 92 },
      { id: 6, name: 'Log Suspicious Traffic', source: 'Any', dest: 'DMZ', port: 'Any', protocol: 'Any', action: 'Log', active: false, aiScore: 75 },
      { id: 7, name: 'Block Port Scans', source: 'External', dest: 'Internal', port: '1-1024', protocol: 'TCP', action: 'Drop', active: true, aiScore: 88 },
      { id: 8, name: 'Allow VPN Traffic', source: 'Any', dest: 'VPN Server', port: '1194', protocol: 'UDP', action: 'Allow', active: true, aiScore: 97 }
    ])

    const aiSuggestions = ref([
      { name: 'Block Suspicious IP Range', description: 'Multiple failed login attempts detected from 192.168.50.0/24', priority: 'High' },
      { name: 'Rate Limit API Endpoint', description: 'Unusual high traffic to /api/v1/users detected', priority: 'Medium' },
      { name: 'Update SSH Rule', description: 'Recommend changing SSH port from 22 to non-standard', priority: 'Low' }
    ])

    const getActionSeverity = (action) => {
      const severities = {
        'Allow': 'success',
        'Deny': 'danger',
        'Drop': 'danger',
        'Log': 'warn'
      }
      return severities[action] || 'info'
    }

    const getSeverity = (priority) => {
      const severities = {
        'High': 'danger',
        'Medium': 'warn',
        'Low': 'info'
      }
      return severities[priority] || 'info'
    }

    return {
      showSuggestions,
      rules,
      aiSuggestions,
      getActionSeverity,
      getSeverity
    }
  }
}
</script>

<style scoped>
.rules-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.controls-card,
.suggestions-card,
.rules-table {
  margin-bottom: 1.5rem;
}

.controls-row {
  display: flex;
  gap: 1rem;
}

.suggestions-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.suggestions-card h3 i {
  color: #06b6d4;
}

.suggestions-desc {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.suggestion-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.suggestion-name {
  font-weight: 500;
}

.suggestion-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.suggestion-actions {
  display: flex;
  gap: 0.5rem;
}

.rules-table code {
  font-size: 0.85rem;
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.ai-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-score span {
  font-size: 0.85rem;
  color: var(--text-secondary);
  min-width: 40px;
}

@media (max-width: 768px) {
  .suggestion-item {
    flex-direction: column;
    gap: 1rem;
  }

  .suggestion-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
