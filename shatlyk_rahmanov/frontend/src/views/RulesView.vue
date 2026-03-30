<template>
  <div class="rules-view">
    <div class="page-header">
      <div class="header-content">
        <h1><i class="pi pi-list"></i> {{ t.rules.title }}</h1>
        <p>{{ t.rules.subtitle }}</p>
      </div>
      <div class="header-stats">
        <div class="stat">
          <span class="value">{{ rules.length }}</span>
          <span class="label">Total Rules</span>
        </div>
        <div class="stat active">
          <span class="value">{{ activeRulesCount }}</span>
          <span class="label">Active</span>
        </div>
        <div class="stat ai">
          <span class="value">{{ aiGeneratedCount }}</span>
          <span class="label">AI Generated</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <Card class="controls-card">
      <template #content>
        <div class="controls-row">
          <div class="controls-left">
            <Button :label="t.rules.addRule" icon="pi pi-plus" @click="showAddDialog = true" />
            <Button :label="t.rules.aiSuggest" icon="pi pi-microchip-ai" severity="info" outlined @click="toggleSuggestions" :badge="suggestions.length.toString()" />
          </div>
          <div class="controls-right">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <InputText v-model="searchQuery" placeholder="Search rules..." />
            </span>
          </div>
        </div>
      </template>
    </Card>

    <!-- AI Suggestions -->
    <transition name="slide">
      <Card v-if="showSuggestions" class="suggestions-card">
        <template #content>
          <div class="suggestions-header">
            <h3><i class="pi pi-microchip-ai"></i> {{ t.rules.suggestions.title }}</h3>
            <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="showSuggestions = false" />
          </div>
          <p class="suggestions-desc">{{ t.rules.suggestions.desc }}</p>
          <div class="suggestions-list">
            <div v-for="suggestion in suggestions" :key="suggestion.id" class="suggestion-item" :class="suggestion.priority.toLowerCase()">
              <div class="suggestion-badge">
                <Tag :severity="getPrioritySeverity(suggestion.priority)" :value="suggestion.priority" />
                <span class="confidence">{{ suggestion.confidence }}% confidence</span>
              </div>
              <div class="suggestion-content">
                <h4>{{ suggestion.name }}</h4>
                <p>{{ suggestion.description }}</p>
                <div class="suggestion-rule">
                  <code>{{ suggestion.rule.source }} → {{ suggestion.rule.dest }} : {{ suggestion.rule.port }} ({{ suggestion.rule.action }})</code>
                </div>
                <p class="suggestion-impact">
                  <i class="pi pi-info-circle"></i>
                  Impact: {{ suggestion.impact }}
                </p>
              </div>
              <div class="suggestion-actions">
                <Button :label="t.rules.suggestions.apply" icon="pi pi-check" size="small" @click="applySuggestion(suggestion)" :loading="applyingId === suggestion.id" />
                <Button :label="t.rules.suggestions.dismiss" icon="pi pi-times" size="small" severity="secondary" outlined @click="dismissSuggestion(suggestion.id)" />
              </div>
            </div>
            <div v-if="suggestions.length === 0" class="no-suggestions">
              <i class="pi pi-check-circle"></i>
              <p>No AI suggestions at this time</p>
            </div>
          </div>
        </template>
      </Card>
    </transition>

    <!-- Rules Table -->
    <Card class="rules-table">
      <template #content>
        <DataTable :value="filteredRules" :paginator="true" :rows="10" stripedRows sortMode="multiple"
                   :loading="loading" responsiveLayout="scroll" :rowHover="true"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                   :rowsPerPageOptions="[5, 10, 20, 50]">
          <template #empty>
            <div class="empty-state">
              <i class="pi pi-inbox"></i>
              <p>No rules found</p>
            </div>
          </template>

          <Column field="id" :header="t.rules.columns.id" sortable style="width: 5%">
            <template #body="{ data }">
              <span class="rule-id">#{{ data.id }}</span>
            </template>
          </Column>

          <Column field="name" :header="t.rules.columns.name" sortable style="width: 20%">
            <template #body="{ data }">
              <div class="rule-name">
                <span>{{ data.name }}</span>
                <Tag v-if="data.aiGenerated" value="AI" severity="info" class="ai-badge" />
              </div>
            </template>
          </Column>

          <Column field="source" :header="t.rules.columns.source" style="width: 12%">
            <template #body="{ data }">
              <code class="ip-code">{{ data.source }}</code>
            </template>
          </Column>

          <Column field="dest" :header="t.rules.columns.dest" style="width: 12%">
            <template #body="{ data }">
              <code class="ip-code">{{ data.dest }}</code>
            </template>
          </Column>

          <Column field="port" :header="t.rules.columns.port" sortable style="width: 8%">
            <template #body="{ data }">
              <span class="port-badge">{{ data.port }}</span>
            </template>
          </Column>

          <Column field="protocol" :header="t.rules.columns.protocol" sortable style="width: 8%">
            <template #body="{ data }">
              <Tag :value="data.protocol" severity="secondary" />
            </template>
          </Column>

          <Column field="action" :header="t.rules.columns.action" sortable style="width: 10%">
            <template #body="{ data }">
              <Tag :severity="getActionSeverity(data.action)" :value="data.action" />
            </template>
          </Column>

          <Column field="active" :header="t.rules.columns.status" style="width: 8%">
            <template #body="{ data }">
              <ToggleSwitch v-model="data.active" @change="toggleRule(data)" />
            </template>
          </Column>

          <Column field="aiScore" :header="t.rules.columns.aiScore" sortable style="width: 12%">
            <template #body="{ data }">
              <div class="ai-score">
                <ProgressBar :value="data.aiScore" :showValue="false" style="height: 8px; flex: 1" />
                <span :class="{ 'high-score': data.aiScore >= 90 }">{{ data.aiScore }}%</span>
              </div>
            </template>
          </Column>

          <Column style="width: 5%">
            <template #body="{ data }">
              <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-rounded" @click="deleteRule(data)" v-tooltip.left="'Delete Rule'" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Add Rule Dialog -->
    <Dialog v-model:visible="showAddDialog" header="Add New Firewall Rule" :modal="true" :style="{ width: '600px' }" class="rule-dialog">
      <div class="dialog-form">
        <div class="form-row">
          <label>Rule Name</label>
          <InputText v-model="newRule.name" placeholder="Enter rule name" class="w-full" />
        </div>
        <div class="form-grid">
          <div class="form-row">
            <label>Source</label>
            <InputText v-model="newRule.source" placeholder="e.g., Any, 192.168.1.0/24" />
          </div>
          <div class="form-row">
            <label>Destination</label>
            <InputText v-model="newRule.dest" placeholder="e.g., Any, 10.0.0.5" />
          </div>
        </div>
        <div class="form-grid">
          <div class="form-row">
            <label>Port</label>
            <InputText v-model="newRule.port" placeholder="e.g., 80, 443, 1-1024" />
          </div>
          <div class="form-row">
            <label>Protocol</label>
            <Select v-model="newRule.protocol" :options="protocols" placeholder="Select Protocol" class="w-full" />
          </div>
        </div>
        <div class="form-row">
          <label>Action</label>
          <div class="action-buttons">
            <Button v-for="action in actions" :key="action" :label="action" :severity="getActionSeverity(action)"
                    :outlined="newRule.action !== action" @click="newRule.action = action" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" severity="secondary" outlined @click="showAddDialog = false" />
        <Button label="Add Rule" icon="pi pi-check" @click="addRule" :loading="adding" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Dialog from 'primevue/dialog'

const API_URL = 'http://localhost:7081/api'

export default {
  components: { Dialog },
  props: { t: Object, language: String },
  setup(props, { emit }) {
    const rules = ref([])
    const suggestions = ref([])
    const loading = ref(false)
    const showSuggestions = ref(false)
    const showAddDialog = ref(false)
    const adding = ref(false)
    const applyingId = ref(null)
    const searchQuery = ref('')

    const protocols = ['TCP', 'UDP', 'ICMP', 'Any']
    const actions = ['Allow', 'Deny', 'Drop', 'Log']

    const newRule = ref({
      name: '',
      source: 'Any',
      dest: 'Any',
      port: 'Any',
      protocol: 'TCP',
      action: 'Allow',
      active: true
    })

    const activeRulesCount = computed(() => rules.value.filter(r => r.active).length)
    const aiGeneratedCount = computed(() => rules.value.filter(r => r.aiGenerated).length)

    const filteredRules = computed(() => {
      if (!searchQuery.value) return rules.value
      const query = searchQuery.value.toLowerCase()
      return rules.value.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.source.toLowerCase().includes(query) ||
        r.dest.toLowerCase().includes(query) ||
        r.protocol.toLowerCase().includes(query)
      )
    })

    const fetchRules = async () => {
      loading.value = true
      try {
        const response = await axios.get(`${API_URL}/rules`)
        if (response.data.success) {
          rules.value = response.data.rules
        }
      } catch (error) {
        console.log('Using default rules')
        rules.value = [
          { id: 1, name: 'Block SSH Brute Force', source: 'Any', dest: '10.0.0.0/24', port: '22', protocol: 'TCP', action: 'Deny', active: true, aiScore: 95, aiGenerated: true },
          { id: 2, name: 'Allow HTTP Traffic', source: 'Any', dest: 'Any', port: '80', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100, aiGenerated: false },
          { id: 3, name: 'Allow HTTPS Traffic', source: 'Any', dest: 'Any', port: '443', protocol: 'TCP', action: 'Allow', active: true, aiScore: 100, aiGenerated: false },
          { id: 4, name: 'Block Known Malware IPs', source: '185.x.x.x', dest: 'Any', port: 'Any', protocol: 'Any', action: 'Drop', active: true, aiScore: 98, aiGenerated: true },
          { id: 5, name: 'DNS Traffic', source: 'Internal', dest: '8.8.8.8', port: '53', protocol: 'UDP', action: 'Allow', active: true, aiScore: 92, aiGenerated: false },
          { id: 6, name: 'Log Suspicious Traffic', source: 'Any', dest: 'DMZ', port: 'Any', protocol: 'Any', action: 'Log', active: false, aiScore: 75, aiGenerated: false },
          { id: 7, name: 'Block Port Scans', source: 'External', dest: 'Internal', port: '1-1024', protocol: 'TCP', action: 'Drop', active: true, aiScore: 88, aiGenerated: true },
          { id: 8, name: 'Allow VPN Traffic', source: 'Any', dest: 'VPN Server', port: '1194', protocol: 'UDP', action: 'Allow', active: true, aiScore: 97, aiGenerated: false }
        ]
      }
      loading.value = false
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`${API_URL}/ai/suggestions`)
        if (response.data.success) {
          suggestions.value = response.data.suggestions
        }
      } catch (error) {
        suggestions.value = [
          { id: 1, name: 'Block Suspicious IP Range', description: 'AI detected 47 failed login attempts from 185.x.x.x subnet', rule: { source: '185.0.0.0/8', dest: 'Any', port: '22', action: 'Drop' }, priority: 'High', confidence: 96, impact: 'Low - No legitimate traffic from this range' },
          { id: 2, name: 'Rate Limit API Endpoint', description: 'Unusual high request rate detected', rule: { source: 'Any', dest: 'API Server', port: '443', action: 'Limit' }, priority: 'Medium', confidence: 84, impact: 'Medium - May affect high-volume users' }
        ]
      }
    }

    const toggleSuggestions = () => {
      showSuggestions.value = !showSuggestions.value
      if (showSuggestions.value && suggestions.value.length === 0) {
        fetchSuggestions()
      }
    }

    const addRule = async () => {
      if (!newRule.value.name) return
      adding.value = true
      try {
        const response = await axios.post(`${API_URL}/rules`, newRule.value)
        if (response.data.success) {
          rules.value.push(response.data.rule)
        }
      } catch (error) {
        const rule = {
          ...newRule.value,
          id: rules.value.length + 1,
          aiScore: Math.floor(Math.random() * 20) + 80,
          aiGenerated: false
        }
        rules.value.push(rule)
      }
      showAddDialog.value = false
      newRule.value = { name: '', source: 'Any', dest: 'Any', port: 'Any', protocol: 'TCP', action: 'Allow', active: true }
      adding.value = false
    }

    const toggleRule = async (rule) => {
      try {
        await axios.patch(`${API_URL}/rules/${rule.id}/toggle`)
      } catch (error) {
        console.log('Toggle saved locally')
      }
    }

    const deleteRule = async (rule) => {
      try {
        await axios.delete(`${API_URL}/rules/${rule.id}`)
      } catch (error) {
        console.log('Deleted locally')
      }
      rules.value = rules.value.filter(r => r.id !== rule.id)
    }

    const applySuggestion = async (suggestion) => {
      applyingId.value = suggestion.id
      try {
        const response = await axios.post(`${API_URL}/ai/suggestions/${suggestion.id}/apply`, suggestion.rule)
        if (response.data.success) {
          rules.value.push(response.data.rule)
        }
      } catch (error) {
        const rule = {
          id: rules.value.length + 1,
          name: suggestion.name,
          ...suggestion.rule,
          active: true,
          aiScore: suggestion.confidence,
          aiGenerated: true
        }
        rules.value.push(rule)
      }
      suggestions.value = suggestions.value.filter(s => s.id !== suggestion.id)
      applyingId.value = null
    }

    const dismissSuggestion = (id) => {
      suggestions.value = suggestions.value.filter(s => s.id !== id)
    }

    const getActionSeverity = (action) => {
      const severities = { 'Allow': 'success', 'Deny': 'danger', 'Drop': 'danger', 'Log': 'warn', 'Limit': 'info' }
      return severities[action] || 'info'
    }

    const getPrioritySeverity = (priority) => {
      const severities = { 'High': 'danger', 'Critical': 'danger', 'Medium': 'warn', 'Low': 'info' }
      return severities[priority] || 'info'
    }

    onMounted(() => {
      fetchRules()
      fetchSuggestions()
    })

    return {
      rules,
      suggestions,
      loading,
      showSuggestions,
      showAddDialog,
      adding,
      applyingId,
      searchQuery,
      newRule,
      protocols,
      actions,
      activeRulesCount,
      aiGeneratedCount,
      filteredRules,
      toggleSuggestions,
      addRule,
      toggleRule,
      deleteRule,
      applySuggestion,
      dismissSuggestion,
      getActionSeverity,
      getPrioritySeverity
    }
  }
}
</script>

<style scoped>
.rules-view {
  max-width: 1500px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Orbitron', monospace;
  margin-bottom: 0.5rem;
}

.header-content h1 i {
  color: var(--fire-orange);
}

.header-content p {
  color: var(--text-secondary);
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.header-stats .stat {
  text-align: center;
  padding: 1rem 1.5rem;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.header-stats .stat .value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.header-stats .stat .label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.header-stats .stat.active .value { color: var(--success); }
.header-stats .stat.ai .value { color: var(--fire-orange); }

/* Controls */
.controls-card {
  margin-bottom: 1.5rem;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.controls-left {
  display: flex;
  gap: 0.75rem;
}

.controls-right {
  display: flex;
  gap: 0.75rem;
}

/* Suggestions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.suggestions-card {
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--fire-orange);
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.suggestions-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Orbitron', monospace;
}

.suggestions-header h3 i {
  color: var(--fire-orange);
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
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.suggestion-item.critical,
.suggestion-item.high { border-left-color: var(--danger); }
.suggestion-item.medium { border-left-color: var(--warning); }
.suggestion-item.low { border-left-color: var(--info); }

.suggestion-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 20px var(--shadow-color);
}

.suggestion-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.suggestion-badge .confidence {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.suggestion-content {
  flex: 1;
}

.suggestion-content h4 {
  margin-bottom: 0.25rem;
}

.suggestion-content p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.suggestion-rule {
  margin-bottom: 0.5rem;
}

.suggestion-rule code {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(234, 88, 12, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.suggestion-impact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.suggestion-impact i {
  color: var(--info);
}

.suggestion-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.no-suggestions {
  text-align: center;
  padding: 2rem;
  color: var(--success);
}

.no-suggestions i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* Rules Table */
.rules-table {
  overflow: hidden;
}

.rule-id {
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-secondary);
}

.rule-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-badge {
  font-size: 0.65rem !important;
}

.ip-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  background: rgba(234, 88, 12, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.port-badge {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}

.ai-score {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ai-score span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  min-width: 40px;
  text-align: right;
}

.ai-score .high-score {
  color: var(--success);
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Dialog */
.rule-dialog {
  background: var(--bg-card);
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row label {
  font-weight: 600;
  font-size: 0.9rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.w-full {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .header-content h1 {
    font-size: 1.2rem;
  }

  .header-stats {
    width: 100%;
    justify-content: space-between;
  }

  .header-stats .stat {
    padding: 0.75rem 1rem;
  }

  .header-stats .stat .value {
    font-size: 1.4rem;
  }

  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-left,
  .controls-right {
    width: 100%;
  }

  .controls-left {
    flex-direction: column;
  }

  .controls-right :deep(.p-inputtext) {
    width: 100%;
  }

  .suggestion-item {
    flex-direction: column;
  }

  .suggestion-badge {
    flex-direction: row;
    justify-content: flex-start;
  }

  .suggestion-actions {
    flex-direction: row;
  }

  .suggestion-rule code {
    font-size: 0.75rem;
    word-break: break-all;
  }

  .rules-table {
    overflow-x: auto;
  }

  .rules-table :deep(.p-datatable-wrapper) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .rules-table :deep(.p-datatable-table) {
    min-width: 800px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  :deep(.p-dialog) {
    width: 95vw !important;
    max-width: 95vw !important;
  }
}

@media (max-width: 480px) {
  .header-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .header-stats .stat {
    padding: 0.5rem 0.75rem;
  }

  .header-stats .stat .value {
    font-size: 1.2rem;
  }

  .suggestions-header h3 {
    font-size: 0.9rem;
  }

  .suggestion-actions {
    flex-direction: column;
  }
}
</style>
