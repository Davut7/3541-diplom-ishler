<template>
  <div class="scan-view">
    <div class="page-header">
      <h1>{{ t.scan.title }}</h1>
      <p>{{ t.scan.subtitle }}</p>
    </div>

    <Card class="scan-options">
      <template #content>
        <div class="scan-types">
          <div class="scan-type" :class="{ active: scanType === 'quick' }" @click="scanType = 'quick'">
            <i class="pi pi-bolt"></i>
            <h3>{{ t.scan.quickScan }}</h3>
            <p>~2 min</p>
          </div>
          <div class="scan-type" :class="{ active: scanType === 'full' }" @click="scanType = 'full'">
            <i class="pi pi-search"></i>
            <h3>{{ t.scan.fullScan }}</h3>
            <p>~15 min</p>
          </div>
          <div class="scan-type" :class="{ active: scanType === 'custom' }" @click="scanType = 'custom'">
            <i class="pi pi-cog"></i>
            <h3>{{ t.scan.customScan }}</h3>
            <p>Custom</p>
          </div>
        </div>

        <div v-if="scanType === 'custom'" class="scan-areas">
          <h4>Scan Areas:</h4>
          <div class="area-checkboxes">
            <div v-for="(area, key) in t.scan.scanAreas" :key="key" class="area-item">
              <ToggleSwitch v-model="scanAreas[key]" />
              <span>{{ area }}</span>
            </div>
          </div>
        </div>

        <Button v-if="!isScanning" label="Start Scan" icon="pi pi-play" @click="startScan" class="start-btn" />
        <Button v-else label="Cancel" icon="pi pi-times" severity="danger" @click="cancelScan" class="start-btn" />
      </template>
    </Card>

    <Card v-if="isScanning" class="scan-progress">
      <template #content>
        <div class="progress-header">
          <i class="pi pi-spin pi-spinner"></i>
          <span>{{ t.scan.scanning }}</span>
        </div>
        <ProgressBar :value="scanProgress" :showValue="true" />
        <p class="current-action">{{ currentAction }}</p>
      </template>
    </Card>

    <Card v-if="scanComplete" class="scan-results">
      <template #content>
        <div class="results-header" :class="{ clean: threats.length === 0, infected: threats.length > 0 }">
          <i :class="threats.length === 0 ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
          <div>
            <h2>{{ t.scan.scanComplete }}</h2>
            <p>{{ threats.length === 0 ? t.scan.results.clean : t.scan.results.infected }}</p>
          </div>
        </div>

        <div v-if="threats.length > 0" class="threats-table">
          <DataTable :value="threats" :paginator="threats.length > 5" :rows="5">
            <Column field="name" :header="t.scan.results.name"></Column>
            <Column field="type" :header="t.scan.results.type">
              <template #body="{ data }">
                <Tag :value="data.type" severity="warn" />
              </template>
            </Column>
            <Column field="location" :header="t.scan.results.location" style="max-width: 300px">
              <template #body="{ data }">
                <code>{{ data.location }}</code>
              </template>
            </Column>
            <Column field="risk" :header="t.scan.results.risk">
              <template #body="{ data }">
                <Tag :severity="getRiskSeverity(data.risk)" :value="data.risk" />
              </template>
            </Column>
            <Column :header="t.scan.results.action" style="width: 200px">
              <template #body>
                <div class="action-buttons">
                  <Button :label="t.scan.results.remove" icon="pi pi-trash" size="small" severity="danger" />
                  <Button :label="t.scan.results.quarantine" icon="pi pi-box" size="small" severity="warn" outlined />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <div v-else class="clean-result">
          <i class="pi pi-shield"></i>
          <p>No keyloggers or suspicious keyboard monitoring software detected.</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const scanType = ref('quick')
    const isScanning = ref(false)
    const scanComplete = ref(false)
    const scanProgress = ref(0)
    const currentAction = ref('')
    const threats = ref([])

    const scanAreas = ref({
      processes: true,
      registry: true,
      startup: true,
      hooks: true,
      files: false,
      network: false
    })

    const scanActions = [
      'Scanning running processes...',
      'Checking keyboard hooks...',
      'Analyzing registry entries...',
      'Scanning startup items...',
      'Checking API calls...',
      'Analyzing network connections...',
      'Finalizing scan...'
    ]

    const startScan = async () => {
      isScanning.value = true
      scanComplete.value = false
      scanProgress.value = 0
      threats.value = []

      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 200))
        scanProgress.value = i
        currentAction.value = scanActions[Math.floor(i / 15)] || scanActions[scanActions.length - 1]
      }

      // Simulate random threat detection
      if (Math.random() > 0.6) {
        threats.value = [
          { name: 'SuspiciousHook.dll', type: 'Hook-based', location: 'C:\\Windows\\Temp\\SuspiciousHook.dll', risk: 'High' },
          { name: 'KeyCapture.exe', type: 'API-based', location: 'C:\\Users\\AppData\\Local\\KeyCapture.exe', risk: 'Critical' }
        ]
      }

      isScanning.value = false
      scanComplete.value = true
    }

    const cancelScan = () => {
      isScanning.value = false
    }

    const getRiskSeverity = (risk) => {
      const severities = {
        'Critical': 'danger',
        'High': 'warn',
        'Medium': 'info',
        'Low': 'secondary'
      }
      return severities[risk] || 'info'
    }

    return {
      scanType,
      isScanning,
      scanComplete,
      scanProgress,
      currentAction,
      threats,
      scanAreas,
      startScan,
      cancelScan,
      getRiskSeverity
    }
  }
}
</script>

<style scoped>
.scan-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.scan-options,
.scan-progress,
.scan-results {
  margin-bottom: 1.5rem;
}

.scan-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.scan-type {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.scan-type:hover {
  border-color: #8b5cf6;
}

.scan-type.active {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.scan-type i {
  font-size: 2rem;
  color: #8b5cf6;
  margin-bottom: 0.5rem;
}

.scan-type h3 {
  margin-bottom: 0.25rem;
}

.scan-type p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.scan-areas {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.scan-areas h4 {
  margin-bottom: 1rem;
}

.area-checkboxes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.area-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.start-btn {
  width: 100%;
}

.progress-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.progress-header i {
  font-size: 1.25rem;
  color: #8b5cf6;
}

.current-action {
  margin-top: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.results-header.clean {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
}

.results-header.infected {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
}

.results-header i {
  font-size: 2.5rem;
}

.results-header.clean i { color: #22c55e; }
.results-header.infected i { color: #ef4444; }

.results-header h2 {
  margin-bottom: 0.25rem;
}

.results-header p {
  color: var(--text-secondary);
}

.threats-table code {
  font-size: 0.8rem;
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.clean-result {
  text-align: center;
  padding: 2rem;
  color: #22c55e;
}

.clean-result i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .scan-types {
    grid-template-columns: 1fr;
  }

  .area-checkboxes {
    grid-template-columns: 1fr;
  }
}
</style>
