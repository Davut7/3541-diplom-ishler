<template>
  <div class="system-scan-view">
    <div class="page-header">
      <h1><i class="pi pi-desktop"></i> {{ t.systemScan?.title || 'System Scan' }}</h1>
      <p>{{ t.systemScan?.subtitle || 'Scan your entire system for threats' }}</p>
    </div>

    <!-- System Info Card -->
    <Card v-if="systemInfo" class="system-info-card">
      <template #content>
        <div class="system-info-grid">
          <div class="info-item">
            <i class="pi pi-desktop"></i>
            <span>{{ systemInfo.hostname }}</span>
          </div>
          <div class="info-item">
            <i class="pi pi-cog"></i>
            <span>{{ systemInfo.platform }} ({{ systemInfo.arch }})</span>
          </div>
          <div class="info-item">
            <i class="pi pi-server"></i>
            <span>{{ systemInfo.cpus }} CPUs</span>
          </div>
          <div class="info-item">
            <i class="pi pi-database"></i>
            <span>{{ systemInfo.freeMemory }} free</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Scan Type Selection -->
    <div v-show="!isScanning && !scanComplete" class="scan-options">
      <Card class="scan-option-card quick" @click="startScan('quick')">
        <template #content>
          <div class="scan-option">
            <div class="option-icon quick">
              <i class="pi pi-bolt"></i>
            </div>
            <div class="option-info">
              <h3>{{ t.systemScan?.quickScan || 'Quick Scan' }}</h3>
              <p>{{ t.systemScan?.quickDesc || 'Scan common threat locations: Downloads, Desktop, LaunchAgents' }}</p>
              <div class="option-meta">
                <Tag severity="info" value="~2-5 min" />
                <Tag severity="secondary" value="500 files max" />
              </div>
            </div>
            <i class="pi pi-chevron-right option-arrow"></i>
          </div>
        </template>
      </Card>

      <Card class="scan-option-card full" @click="startScan('full')">
        <template #content>
          <div class="scan-option">
            <div class="option-icon full">
              <i class="pi pi-shield"></i>
            </div>
            <div class="option-info">
              <h3>{{ t.systemScan?.fullScan || 'Full System Scan' }}</h3>
              <p>{{ t.systemScan?.fullDesc || 'Deep scan of entire home directory and applications' }}</p>
              <div class="option-meta">
                <Tag severity="warn" value="~10-30 min" />
                <Tag severity="secondary" value="5000 files max" />
              </div>
            </div>
            <i class="pi pi-chevron-right option-arrow"></i>
          </div>
        </template>
      </Card>
    </div>

    <!-- Scanning Progress -->
    <Card v-if="isScanning" class="scanning-card">
      <template #content>
        <div class="scanning-content">
          <div class="scanning-header">
            <div class="scan-type-badge" :class="currentScanType">
              <i :class="currentScanType === 'quick' ? 'pi pi-bolt' : 'pi pi-shield'"></i>
              <span>{{ currentScanType === 'quick' ? 'Quick Scan' : 'Full Scan' }}</span>
            </div>
            <Button
              icon="pi pi-times"
              severity="danger"
              text
              rounded
              @click="cancelScan"
              v-tooltip="'Cancel Scan'"
            />
          </div>

          <div class="progress-section">
            <div class="progress-info">
              <span class="phase">{{ scanProgress.message }}</span>
              <span class="percentage">{{ scanProgress.progress }}%</span>
            </div>
            <ProgressBar :value="scanProgress.progress" :showValue="false" class="scan-progress" />
            <div v-if="scanProgress.current" class="file-info">
              <span>{{ scanProgress.current }} / {{ scanProgress.totalFiles }} files</span>
            </div>
          </div>

          <div class="current-file" v-if="scanProgress.currentFile">
            <i class="pi pi-file"></i>
            <span>{{ truncatePath(scanProgress.currentFile) }}</span>
          </div>

          <!-- Live Threats Found -->
          <div v-if="liveThreats.length" class="live-threats">
            <h4><i class="pi pi-exclamation-triangle"></i> Threats Found ({{ liveThreats.length }})</h4>
            <div class="threat-list">
              <div v-for="(threat, i) in liveThreats.slice(-5)" :key="i" class="threat-item" :class="threat.status">
                <i class="pi pi-times-circle"></i>
                <span class="threat-name">{{ threat.fileName }}</span>
                <Tag :severity="getStatusSeverity(threat.status)" :value="threat.status" size="small" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Scan Results -->
    <div v-if="scanComplete" class="scan-results">
      <Card class="results-summary-card" :class="scanResult.threatsFound > 0 ? 'has-threats' : 'clean'">
        <template #content>
          <div class="results-summary">
            <div class="summary-icon" :class="scanResult.threatsFound > 0 ? 'danger' : 'success'">
              <i :class="scanResult.threatsFound > 0 ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle'"></i>
            </div>
            <div class="summary-info">
              <h2 v-if="scanResult.threatsFound > 0">
                {{ scanResult.threatsFound }} {{ t.systemScan?.threatsFound || 'Threats Found' }}
              </h2>
              <h2 v-else>{{ t.systemScan?.noThreats || 'No Threats Found' }}</h2>
              <p>{{ t.systemScan?.scannedFiles || 'Scanned' }}: {{ scanResult.totalScanned }} files in {{ scanResult.duration }}s</p>
            </div>
            <Button
              :label="t.systemScan?.scanAgain || 'Scan Again'"
              icon="pi pi-refresh"
              @click="resetScan"
            />
          </div>
        </template>
      </Card>

      <!-- Threats Table -->
      <Card v-if="scanResult.threats?.length" class="threats-card">
        <template #content>
          <h3><i class="pi pi-exclamation-triangle" style="color: #ef4444"></i> {{ t.systemScan?.detectedThreats || 'Detected Threats' }}</h3>
          <DataTable :value="scanResult.threats" stripedRows class="threats-table">
            <Column field="fileName" :header="t.history?.columns?.file || 'File'" sortable>
              <template #body="{ data }">
                <div class="file-cell">
                  <i class="pi pi-file"></i>
                  <div>
                    <span class="file-name">{{ data.fileName }}</span>
                    <small>{{ truncatePath(data.filePath) }}</small>
                  </div>
                </div>
              </template>
            </Column>
            <Column field="status" :header="t.history?.columns?.status || 'Status'" sortable>
              <template #body="{ data }">
                <Tag :severity="getStatusSeverity(data.status)" :value="data.status" />
              </template>
            </Column>
            <Column field="threatScore" :header="t.history?.columns?.threat || 'Threat'" sortable>
              <template #body="{ data }">
                <span :class="['threat-score', getScoreClass(data.threatScore)]">{{ data.threatScore }}%</span>
              </template>
            </Column>
            <Column field="fileType" header="Type">
              <template #body="{ data }">
                <span>{{ data.fileType?.type || 'Unknown' }}</span>
              </template>
            </Column>
            <Column header="Actions">
              <template #body="{ data }">
                <Button icon="pi pi-folder-open" v-tooltip="'Show in Finder'" size="small" text @click="openLocation(data.filePath)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Scanned Paths -->
      <Card class="paths-card">
        <template #content>
          <h3><i class="pi pi-folder"></i> {{ t.systemScan?.scannedPaths || 'Scanned Locations' }}</h3>
          <div class="paths-list">
            <div v-for="(p, i) in scanResult.scanPaths" :key="i" class="path-item">
              <i class="pi pi-folder"></i>
              <span>{{ p }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Signature Update + Test Virus Controls (web mode) -->
    <Card v-if="!isElectron" class="web-controls-card">
      <template #content>
        <h3><i class="pi pi-shield"></i> Scanner Controls</h3>
        <div class="controls-grid">
          <div class="control-item">
            <Button label="Update Signatures" icon="pi pi-download" @click="updateSignatures" :loading="updatingSignatures" severity="info" />
            <small v-if="sigStatus">{{ sigStatus.totalSignatures }} hashes + {{ sigStatus.totalPatterns }} patterns</small>
          </div>
          <div class="control-item">
            <Button label="Deploy Test Viruses" icon="pi pi-bug" @click="deployTestViruses" :loading="deploying" severity="warn" />
            <small>Hide 5 malicious test files on your system</small>
          </div>
          <div class="control-item">
            <Button label="Cleanup Test Files" icon="pi pi-trash" @click="cleanupTestViruses" severity="secondary" outlined />
            <small>Remove all test files</small>
          </div>
        </div>
        <div v-if="deployResult" class="deploy-result">
          <h4>Deployed Files:</h4>
          <div v-for="(f, i) in deployResult" :key="i" class="deploy-item" :class="f.risk">
            <Tag :severity="f.risk === 'critical' ? 'danger' : f.risk === 'none' ? 'success' : 'warn'" :value="f.risk" size="small" />
            <span>{{ f.name }}</span>
            <small>{{ f.type }}</small>
          </div>
        </div>
        <div v-if="updateResult" class="update-result">
          <p><i class="pi pi-check-circle" style="color: #22c55e"></i> {{ updateResult }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const API_URL = '/api'

export default {
  props: { t: Object, language: String },
  setup() {
    const toast = useToast()
    const isElectron = ref(false)
    const systemInfo = ref(null)
    const isScanning = ref(false)
    const scanComplete = ref(false)
    const currentScanType = ref('')
    const scanProgress = ref({ phase: '', message: '', progress: 0 })
    const scanResult = ref(null)
    const liveThreats = ref([])

    // Web mode controls
    const updatingSignatures = ref(false)
    const deploying = ref(false)
    const sigStatus = ref(null)
    const deployResult = ref(null)
    const updateResult = ref(null)

    onMounted(async () => {
      isElectron.value = !!window.electronAPI?.isElectron

      if (isElectron.value) {
        systemInfo.value = await window.electronAPI.getSystemInfo()
        window.electronAPI.onSystemScanProgress((data) => { scanProgress.value = data })
        window.electronAPI.onSystemScanThreat((threat) => { liveThreats.value.push(threat) })
      } else {
        // Web mode: fetch signature status
        try { const r = await axios.get(API_URL + '/signatures/status'); sigStatus.value = r.data } catch (e) {}
        // Show system info from os
        try { const r = await axios.get(API_URL + '/health'); systemInfo.value = { hostname: 'Web Mode', platform: 'Server-side scan', arch: '', cpus: '-', freeMemory: 'v' + (r.data.version || '2.0') } } catch (e) {}
      }
    })

    const startScan = async (type) => {
      isScanning.value = true
      scanComplete.value = false
      currentScanType.value = type
      scanProgress.value = { phase: 'starting', message: 'Initializing scan...', progress: 0 }
      liveThreats.value = []

      toast.add({ severity: 'info', summary: type === 'quick' ? 'Quick Scan Started' : 'Full Scan Started', detail: 'Scanning system...', life: 3000 })

      if (isElectron.value) {
        const result = await window.electronAPI.systemScan(type)
        isScanning.value = false
        if (result.cancelled) { toast.add({ severity: 'warn', summary: 'Cancelled', life: 2000 }); return }
        if (result.success) { scanComplete.value = true; scanResult.value = result }
      } else {
        // Web mode: call backend API
        scanProgress.value = { message: 'Collecting files...', progress: 10 }
        try {
          scanProgress.value = { message: 'Scanning files...', progress: 30 }
          const res = await axios.post(API_URL + '/system-scan', { scanType: type })
          scanProgress.value = { message: 'Complete!', progress: 100 }
          isScanning.value = false

          if (res.data.success) {
            scanComplete.value = true
            scanResult.value = {
              ...res.data,
              totalScanned: res.data.scannedFiles,
              duration: Math.round(res.data.scannedFiles * 0.05),
              scanPaths: type === 'quick' ? ['~/Downloads', '~/Desktop', '/tmp', '~/.virusdetect_test'] : ['~/Downloads', '~/Desktop', '~/Documents', '/tmp', '/var/tmp', '~/Library/LaunchAgents']
            }
          }
        } catch (error) {
          isScanning.value = false
          toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 })
          return
        }
      }

      if (scanResult.value && scanResult.value.threatsFound > 0) {
        toast.add({ severity: 'error', summary: scanResult.value.threatsFound + ' Threats Found', detail: 'Review detected threats below', life: 5000 })
      } else if (scanResult.value) {
        toast.add({ severity: 'success', summary: 'Scan Complete', detail: 'No threats detected', life: 3000 })
      }
    }

    const cancelScan = async () => {
      if (isElectron.value) await window.electronAPI.cancelSystemScan()
      isScanning.value = false
    }

    const resetScan = () => { scanComplete.value = false; scanResult.value = null; liveThreats.value = [] }

    const openLocation = (filePath) => {
      if (isElectron.value) window.electronAPI.openFileLocation(filePath)
    }

    // Web mode: signature update
    const updateSignatures = async () => {
      updatingSignatures.value = true; updateResult.value = null
      try {
        const r = await axios.post(API_URL + '/signatures/update')
        updateResult.value = r.data.message
        sigStatus.value = { totalSignatures: r.data.totalSignatures, totalPatterns: r.data.totalPatterns }
        toast.add({ severity: r.data.success ? 'success' : 'info', summary: 'Signatures Updated', detail: r.data.message, life: 4000 })
      } catch (e) { toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 }) }
      updatingSignatures.value = false
    }

    // Web mode: deploy test viruses
    const deployTestViruses = async () => {
      deploying.value = true; deployResult.value = null
      try {
        const r = await axios.post(API_URL + '/test-virus/deploy')
        deployResult.value = r.data.deployed
        toast.add({ severity: 'warn', summary: 'Test Viruses Deployed', detail: r.data.message, life: 4000 })
      } catch (e) { toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 }) }
      deploying.value = false
    }

    const cleanupTestViruses = async () => {
      try {
        const r = await axios.post(API_URL + '/test-virus/cleanup')
        deployResult.value = null
        toast.add({ severity: 'success', summary: 'Cleaned Up', detail: r.data.removed + ' files removed', life: 3000 })
      } catch (e) { toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 }) }
    }

    const truncatePath = (path) => {
      if (!path) return ''
      if (path.length > 60) {
        return '...' + path.slice(-57)
      }
      return path
    }

    const getStatusSeverity = (status) => ({
      clean: 'success',
      suspicious: 'warn',
      malware: 'danger',
      potentially_unwanted: 'info'
    }[status] || 'secondary')

    const getScoreClass = (score) => {
      if (score >= 70) return 'danger'
      if (score >= 40) return 'warning'
      if (score >= 20) return 'info'
      return 'success'
    }

    return {
      isElectron, systemInfo, isScanning, scanComplete, currentScanType,
      scanProgress, scanResult, liveThreats,
      startScan, cancelScan, resetScan, openLocation,
      truncatePath, getStatusSeverity, getScoreClass,
      updatingSignatures, deploying, sigStatus, deployResult, updateResult,
      updateSignatures, deployTestViruses, cleanupTestViruses
    }
  }
}
</script>

<style scoped>
.system-scan-view { max-width: 1000px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; font-family: 'Orbitron', sans-serif; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.page-header h1 i { color: var(--primary-color); }
.page-header p { color: var(--text-secondary); }

/* System Info */
.system-info-card { margin-bottom: 2rem; }
.system-info-grid { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
.info-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); }
.info-item i { color: var(--primary-color); }

/* Scan Options */
.scan-options { display: flex; flex-direction: column; gap: 1rem; }
.scan-option-card { cursor: pointer; transition: all 0.3s; border: 2px solid transparent; }
.scan-option-card:hover { transform: translateY(-2px); border-color: var(--primary-color); box-shadow: 0 8px 25px var(--primary-glow); }
.scan-option { display: flex; align-items: center; gap: 1.5rem; }
.option-icon { width: 70px; height: 70px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.option-icon i { font-size: 2rem; color: white; }
.option-icon.quick { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.option-icon.full { background: linear-gradient(135deg, #ef4444, #dc2626); }
.option-info { flex: 1; }
.option-info h3 { font-family: 'Orbitron', sans-serif; margin-bottom: 0.5rem; }
.option-info p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.75rem; }
.option-meta { display: flex; gap: 0.5rem; }
.option-arrow { font-size: 1.5rem; color: var(--text-secondary); }

/* Scanning Card */
.scanning-card { margin-bottom: 2rem; }
.scanning-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.scan-type-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; }
.scan-type-badge.quick { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
.scan-type-badge.full { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }

.progress-section { margin-bottom: 1.5rem; }
.progress-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.phase { color: var(--text-secondary); }
.percentage { font-weight: 700; font-family: 'Orbitron', sans-serif; color: var(--primary-color); }
.scan-progress { height: 12px; }
.file-info { text-align: center; margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; }

.current-file { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary); }
.current-file i { color: var(--primary-color); }

/* Live Threats */
.live-threats { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
.live-threats h4 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: #ef4444; }
.threat-list { display: flex; flex-direction: column; gap: 0.5rem; }
.threat-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 6px; border-left: 3px solid #ef4444; }
.threat-item i { color: #ef4444; }
.threat-name { flex: 1; font-size: 0.9rem; }

/* Results */
.results-summary-card { margin-bottom: 1.5rem; }
.results-summary-card.has-threats { border-left: 4px solid #ef4444; }
.results-summary-card.clean { border-left: 4px solid #22c55e; }
.results-summary { display: flex; align-items: center; gap: 1.5rem; }
.summary-icon { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.summary-icon i { font-size: 2.5rem; color: white; }
.summary-icon.danger { background: linear-gradient(135deg, #ef4444, #dc2626); }
.summary-icon.success { background: linear-gradient(135deg, #22c55e, #16a34a); }
.summary-info { flex: 1; }
.summary-info h2 { font-family: 'Orbitron', sans-serif; margin-bottom: 0.25rem; }
.summary-info p { color: var(--text-secondary); }

/* Threats Table */
.threats-card { margin-bottom: 1.5rem; }
.threats-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.file-cell { display: flex; align-items: center; gap: 0.75rem; }
.file-cell i { color: var(--primary-color); }
.file-name { display: block; font-weight: 500; }
.file-cell small { color: var(--text-secondary); font-size: 0.75rem; }
.threat-score { font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 20px; }
.threat-score.success { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.threat-score.info { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
.threat-score.warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.threat-score.danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

/* Paths */
.paths-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.paths-card h3 i { color: var(--primary-color); }
.paths-list { display: flex; flex-direction: column; gap: 0.5rem; }
.path-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--bg-secondary); border-radius: 6px; font-size: 0.85rem; }
.path-item i { color: var(--text-secondary); }

/* Web Controls */
.web-controls-card { margin-bottom: 2rem; }
.web-controls-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.web-controls-card h3 i { color: var(--primary-color); }
.controls-grid { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.control-item { display: flex; flex-direction: column; gap: 0.5rem; }
.control-item small { color: var(--text-secondary); font-size: 0.8rem; }
.deploy-result { margin-top: 1rem; }
.deploy-result h4 { margin-bottom: 0.5rem; }
.deploy-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; background: var(--bg-secondary); border-radius: 6px; margin-bottom: 0.25rem; font-size: 0.9rem; }
.deploy-item small { color: var(--text-secondary); margin-left: auto; }
.update-result { margin-top: 0.75rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px; }

@media (max-width: 768px) {
  .scan-option { flex-direction: column; text-align: center; }
  .option-arrow { display: none; }
  .results-summary { flex-direction: column; text-align: center; }
  .system-info-grid { flex-direction: column; gap: 0.75rem; }
  .page-header h1 { font-size: 1.3rem; }
  .option-icon { width: 55px; height: 55px; }
  .option-icon i { font-size: 1.5rem; }
  .summary-icon { width: 60px; height: 60px; }
  .summary-icon i { font-size: 1.75rem; }
  .summary-info h2 { font-size: 1.2rem; }
  .threats-card :deep(.p-datatable) { overflow-x: auto; }
  .threats-card :deep(.p-datatable-table) { min-width: 550px; }
  .warning-content { flex-direction: column; text-align: center; gap: 1rem; }
  .warning-content > i { font-size: 2rem; }
}

@media (max-width: 480px) {
  .page-header h1 { font-size: 1.1rem; }
  .page-header p { font-size: 0.85rem; }
  .option-info h3 { font-size: 0.95rem; }
  .option-info p { font-size: 0.8rem; }
  .option-meta { justify-content: center; flex-wrap: wrap; }
  .summary-icon { width: 50px; height: 50px; }
  .summary-icon i { font-size: 1.5rem; }
  .summary-info h2 { font-size: 1rem; }
  .scan-type-badge { font-size: 0.85rem; padding: 0.4rem 0.75rem; }
  .current-file { font-size: 0.75rem; }
  .threat-item { font-size: 0.85rem; }
}
</style>
