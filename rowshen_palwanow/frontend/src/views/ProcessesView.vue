<template>
  <div class="processes-view">
    <div class="page-header">
      <h1>{{ t.processes.title }}</h1>
      <p>{{ t.processes.subtitle }}</p>
    </div>

    <Card class="controls-card">
      <template #content>
        <div class="controls-row">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <InputText v-model="searchQuery" :placeholder="t.processes.filter" class="search-input" />
          </div>
          <Button :label="t.processes.refresh" icon="pi pi-refresh" @click="refreshProcesses" />
        </div>
      </template>
    </Card>

    <Card class="processes-table">
      <template #content>
        <DataTable :value="filteredProcesses" :paginator="true" :rows="15" :rowsPerPageOptions="[10, 15, 25]"
                   selectionMode="single" v-model:selection="selectedProcess" @row-select="onProcessSelect"
                   stripedRows sortMode="multiple">
          <Column field="pid" :header="t.processes.columns.pid" sortable style="width: 8%"></Column>
          <Column field="name" :header="t.processes.columns.name" sortable style="width: 25%">
            <template #body="{ data }">
              <div class="process-name">
                <i class="pi pi-cog"></i>
                <span>{{ data.name }}</span>
              </div>
            </template>
          </Column>
          <Column field="cpu" :header="t.processes.columns.cpu" sortable style="width: 10%">
            <template #body="{ data }">
              <span :class="{ 'high-cpu': data.cpu > 50 }">{{ data.cpu }}%</span>
            </template>
          </Column>
          <Column field="memory" :header="t.processes.columns.memory" sortable style="width: 12%"></Column>
          <Column field="hooks" :header="t.processes.columns.hooks" sortable style="width: 10%">
            <template #body="{ data }">
              <Badge v-if="data.hooks > 0" :value="data.hooks" severity="warn" />
              <span v-else>0</span>
            </template>
          </Column>
          <Column field="risk" :header="t.processes.columns.risk" sortable style="width: 12%">
            <template #body="{ data }">
              <Tag :severity="getRiskSeverity(data.risk)" :value="data.risk" />
            </template>
          </Column>
          <Column :header="t.processes.columns.action" style="width: 23%">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button :label="t.processes.analyze" icon="pi pi-search" size="small" severity="info" @click="analyzeProcess(data)" />
                <Button v-if="data.risk !== 'Safe'" :label="t.processes.terminate" icon="pi pi-times" size="small" severity="danger" outlined />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card v-if="selectedProcess" class="process-details">
      <template #content>
        <h3><i class="pi pi-info-circle"></i> {{ t.processes.details.title }}</h3>
        <div class="details-grid">
          <div class="detail-item">
            <span class="label">{{ t.processes.details.path }}:</span>
            <code>{{ selectedProcess.path }}</code>
          </div>
          <div class="detail-item">
            <span class="label">{{ t.processes.details.publisher }}:</span>
            <span>{{ selectedProcess.publisher }}</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ t.processes.details.started }}:</span>
            <span>{{ selectedProcess.started }}</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ t.processes.details.threads }}:</span>
            <span>{{ selectedProcess.threads }}</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ t.processes.details.handles }}:</span>
            <span>{{ selectedProcess.handles }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const searchQuery = ref('')
    const selectedProcess = ref(null)

    const processes = ref([
      { pid: 4, name: 'System', cpu: 0.1, memory: '0.1 MB', hooks: 0, risk: 'Safe', path: 'NT Kernel', publisher: 'Microsoft', started: 'System Boot', threads: 150, handles: 2000 },
      { pid: 612, name: 'csrss.exe', cpu: 0.5, memory: '5.2 MB', hooks: 0, risk: 'Safe', path: 'C:\\Windows\\System32\\csrss.exe', publisher: 'Microsoft', started: '10:30 AM', threads: 12, handles: 500 },
      { pid: 1024, name: 'explorer.exe', cpu: 2.1, memory: '85.3 MB', hooks: 2, risk: 'Low', path: 'C:\\Windows\\explorer.exe', publisher: 'Microsoft', started: '10:31 AM', threads: 45, handles: 1200 },
      { pid: 2048, name: 'chrome.exe', cpu: 15.3, memory: '512.0 MB', hooks: 0, risk: 'Safe', path: 'C:\\Program Files\\Google\\Chrome\\chrome.exe', publisher: 'Google', started: '11:00 AM', threads: 80, handles: 800 },
      { pid: 3072, name: 'svchost.exe', cpu: 1.2, memory: '45.6 MB', hooks: 0, risk: 'Safe', path: 'C:\\Windows\\System32\\svchost.exe', publisher: 'Microsoft', started: '10:30 AM', threads: 25, handles: 600 },
      { pid: 4096, name: 'KeyCapture.exe', cpu: 5.5, memory: '12.3 MB', hooks: 3, risk: 'High', path: 'C:\\Users\\AppData\\Local\\Temp\\KeyCapture.exe', publisher: 'Unknown', started: '11:15 AM', threads: 8, handles: 150 },
      { pid: 5120, name: 'notepad.exe', cpu: 0.2, memory: '8.5 MB', hooks: 0, risk: 'Safe', path: 'C:\\Windows\\System32\\notepad.exe', publisher: 'Microsoft', started: '11:20 AM', threads: 4, handles: 100 },
      { pid: 6144, name: 'HookLogger.dll', cpu: 8.2, memory: '25.1 MB', hooks: 5, risk: 'Critical', path: 'C:\\Windows\\Temp\\HookLogger.dll', publisher: 'Unknown', started: '11:25 AM', threads: 15, handles: 200 },
      { pid: 7168, name: 'code.exe', cpu: 12.5, memory: '350.2 MB', hooks: 0, risk: 'Safe', path: 'C:\\Program Files\\VS Code\\code.exe', publisher: 'Microsoft', started: '11:30 AM', threads: 60, handles: 700 },
      { pid: 8192, name: 'winlogon.exe', cpu: 0.3, memory: '6.8 MB', hooks: 1, risk: 'Low', path: 'C:\\Windows\\System32\\winlogon.exe', publisher: 'Microsoft', started: '10:30 AM', threads: 8, handles: 300 }
    ])

    const filteredProcesses = computed(() => {
      if (!searchQuery.value) return processes.value
      const query = searchQuery.value.toLowerCase()
      return processes.value.filter(p => p.name.toLowerCase().includes(query))
    })

    const refreshProcesses = () => {
      // Simulate refresh
      processes.value.forEach(p => {
        p.cpu = Math.round((Math.random() * 20) * 10) / 10
      })
    }

    const onProcessSelect = (event) => {
      selectedProcess.value = event.data
    }

    const analyzeProcess = (process) => {
      selectedProcess.value = process
    }

    const getRiskSeverity = (risk) => {
      const severities = {
        'Safe': 'success',
        'Low': 'info',
        'Medium': 'warn',
        'High': 'warn',
        'Critical': 'danger'
      }
      return severities[risk] || 'info'
    }

    return {
      searchQuery,
      selectedProcess,
      filteredProcesses,
      refreshProcesses,
      onProcessSelect,
      analyzeProcess,
      getRiskSeverity
    }
  }
}
</script>

<style scoped>
.processes-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.controls-card,
.processes-table,
.process-details {
  margin-bottom: 1.5rem;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  color: var(--text-secondary);
}

.search-input {
  flex: 1;
}

.process-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.process-name i {
  color: #8b5cf6;
}

.high-cpu {
  color: #ef4444;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.process-details h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.process-details h3 i {
  color: #8b5cf6;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item .label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.detail-item code {
  font-size: 0.85rem;
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
  }

  .search-box {
    max-width: none;
    width: 100%;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.35rem;
  }

  .action-buttons :deep(.p-button) {
    width: 100%;
    font-size: 0.8rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .page-header p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 1rem;
  }

  .detail-item code {
    font-size: 0.75rem;
    word-break: break-all;
  }
}
</style>
