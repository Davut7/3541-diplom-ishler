<template>
  <div class="scan-view">
    <div class="page-header">
      <h1>{{ t.scan.title }}</h1>
      <p>{{ t.scan.subtitle }}</p>
    </div>

    <Card class="upload-card">
      <template #content>
        <div class="scan-options">
          <div class="dropzone" @click="selectFile" @dragover.prevent @drop.prevent="handleDrop">
            <i class="pi pi-file"></i>
            <p>{{ t.scan.dropzone }}</p>
            <small>{{ t.scan.clickOrDrag }}</small>
          </div>

          <div class="or-divider">{{ language === 'en' ? 'OR' : 'ýa-da' }}</div>

          <div class="dropzone folder-zone" @click="selectFolder">
            <i class="pi pi-folder-open"></i>
            <p>{{ t.scan.scanFolder }}</p>
            <small>{{ t.scan.selectFolder }}</small>
          </div>
        </div>

        <!-- Hidden file input for web mode -->
        <input ref="fileInput" type="file" style="display: none" @change="onFileSelected" />
      </template>
    </Card>

    <!-- Sample Files Section (always visible for demo) -->
    <Card class="samples-card">
      <template #content>
        <h3><i class="pi pi-flask"></i> {{ language === 'en' ? 'Test Samples' : 'Synag faýllary' }}</h3>
        <p class="samples-desc">{{ language === 'en' ? 'Click any sample to see how the scanner analyzes different file types' : 'Skaneriň dürli faýl görnüşlerini nähili seljerýändigini görmek üçin basyň' }}</p>
        <div class="samples-grid">
          <div v-for="sample in samples" :key="sample.id" class="sample-item" :class="sample.riskLevel" @click="scanSample(sample.id)">
            <i :class="'pi ' + sample.icon"></i>
            <div class="sample-info">
              <span class="sample-name">{{ sample.name }}</span>
              <small>{{ language === 'en' ? sample.description.en : sample.description.tk }}</small>
            </div>
            <Tag :severity="getRiskSeverity(sample.riskLevel)" :value="sample.riskLevel" size="small" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Progress Card -->
    <Card v-if="isScanning" class="progress-card">
      <template #content>
        <div class="scanning-header">
          <i class="pi pi-spin pi-spinner"></i>
          <span>{{ currentStep }}</span>
        </div>
        <ProgressBar :value="progress" :showValue="true" />
        <div class="scan-logs">
          <div v-for="(log, i) in logs" :key="i" :class="['log-line', log.type]">
            <i :class="log.icon"></i>
            {{ log.message }}
          </div>
        </div>
      </template>
    </Card>

    <!-- Single File Result -->
    <Card v-if="result && !isFolderScan" class="result-card">
      <template #content>
        <div class="result-header">
          <div class="status-badge" :class="result.status">
            <i :class="getStatusIcon(result.status)"></i>
            <span>{{ t.scan.status[result.status] || result.status }}</span>
          </div>
          <div class="threat-score">
            <span class="score-label">{{ t.scan.results.threatScore }}</span>
            <span class="score-value" :class="getScoreClass(result.threatScore)">{{ result.threatScore }}%</span>
          </div>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <label>{{ t.scan.results.fileName }}</label>
            <span class="file-name">{{ result.fileName }}</span>
          </div>
          <div class="result-item">
            <label>{{ t.scan.results.fileSize }}</label>
            <span>{{ result.fileSizeFormatted }}</span>
          </div>
          <div class="result-item">
            <label>{{ t.scan.results.fileType }}</label>
            <Tag :severity="getFileTypeSeverity(result.fileType.risk)" :value="result.fileType.type" />
          </div>
          <div class="result-item">
            <label>{{ t.scan.results.entropy }}</label>
            <span>{{ result.entropy.entropy }} - {{ result.entropy.interpretation }}</span>
          </div>
        </div>

        <div class="hashes-section">
          <h4><i class="pi pi-key"></i> {{ t.scan.results.hashes }}</h4>
          <div class="hash-item" v-for="(hash, type) in result.hashes" :key="type">
            <label>{{ type.toUpperCase() }}</label>
            <code @click="copyToClipboard(hash)">{{ hash }}</code>
            <i class="pi pi-copy copy-btn" @click="copyToClipboard(hash)" v-tooltip="'Copy'"></i>
          </div>
        </div>

        <div v-if="result.patterns.length" class="patterns-section">
          <h4><i class="pi pi-exclamation-triangle"></i> {{ t.scan.results.suspiciousPatterns }}</h4>
          <div class="pattern-list">
            <div v-for="(pattern, i) in result.patterns" :key="i" class="pattern-item" :class="pattern.severity">
              <Tag :severity="getSeverityClass(pattern.severity)" :value="pattern.severity" />
              <span>{{ pattern.name }}</span>
              <span class="count">({{ pattern.count }}x)</span>
            </div>
          </div>
        </div>

        <div v-if="result.virusTotal && result.virusTotal.available" class="virustotal-section">
          <h4><i class="pi pi-shield"></i> VirusTotal Results</h4>
          <div v-if="result.virusTotal.found" class="vt-stats">
            <div class="vt-stat malicious">
              <span class="num">{{ result.virusTotal.stats.malicious }}</span>
              <span class="label">Malicious</span>
            </div>
            <div class="vt-stat suspicious">
              <span class="num">{{ result.virusTotal.stats.suspicious }}</span>
              <span class="label">Suspicious</span>
            </div>
            <div class="vt-stat harmless">
              <span class="num">{{ result.virusTotal.stats.harmless }}</span>
              <span class="label">Harmless</span>
            </div>
            <div class="vt-stat undetected">
              <span class="num">{{ result.virusTotal.stats.undetected }}</span>
              <span class="label">Undetected</span>
            </div>
          </div>
          <div v-else class="vt-not-found">
            <i class="pi pi-info-circle"></i>
            {{ result.virusTotal.message || 'File not found in VirusTotal database' }}
          </div>
        </div>

        <div class="result-actions">
          <Button :label="language === 'en' ? 'Export Report' : 'Hasabaty eksportla'" icon="pi pi-download" @click="exportReport" severity="secondary" />
        </div>
      </template>
    </Card>

    <!-- Folder Scan Results -->
    <Card v-if="folderResults && isFolderScan" class="folder-results-card">
      <template #content>
        <h3><i class="pi pi-folder"></i> {{ t.scan.folderResults }}</h3>
        <p class="folder-summary">{{ t.scan.scannedFiles }}: {{ folderResults.totalFiles }}</p>
        <DataTable :value="folderResults.results" :paginator="true" :rows="10" sortField="threatScore" :sortOrder="-1" class="folder-table">
          <Column field="fileName" :header="t.scan.results.fileName" sortable />
          <Column field="fileType" :header="t.scan.results.fileType" sortable />
          <Column field="entropy" :header="t.scan.results.entropy" sortable />
          <Column field="threatScore" header="Threat" sortable>
            <template #body="{ data }">
              <Tag :severity="getScoreSeverity(data.threatScore)" :value="data.threatScore + '%'" />
            </template>
          </Column>
        </DataTable>
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
  setup(props) {
    const toast = useToast()
    const fileInput = ref(null)
    const isScanning = ref(false)
    const progress = ref(0)
    const currentStep = ref('')
    const logs = ref([])
    const result = ref(null)
    const folderResults = ref(null)
    const isFolderScan = ref(false)
    const samples = ref([])

    const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined

    onMounted(async () => {
      // Load sample files
      try {
        const res = await axios.get(`${API_URL}/samples`)
        samples.value = res.data
      } catch (e) { /* ignore */ }

      if (isElectron) {
        try {
          window.electronAPI.onScanProgress((data) => {
            progress.value = data.progress
            const stepNames = {
              hashes: props.language === 'en' ? 'Calculating file hashes...' : 'Faýl hashlary hasaplanýar...',
              entropy: props.language === 'en' ? 'Analyzing entropy...' : 'Entropiýa derňelýär...',
              filetype: props.language === 'en' ? 'Detecting file type...' : 'Faýl görnüşi anyklanýar...',
              patterns: props.language === 'en' ? 'Scanning for patterns...' : 'Nagyşlar skanirlenýär...',
              virustotal: props.language === 'en' ? 'Checking VirusTotal...' : 'VirusTotal barlanýar...',
              complete: props.language === 'en' ? 'Complete!' : 'Tamamlandy!'
            }
            currentStep.value = stepNames[data.step] || data.step
            logs.value.push({
              message: stepNames[data.step],
              type: data.step === 'complete' ? 'success' : 'info',
              icon: data.step === 'complete' ? 'pi pi-check-circle' : 'pi pi-spin pi-spinner'
            })
          })

          window.electronAPI.onFolderScanProgress((data) => {
            progress.value = (data.current / data.total) * 100
            currentStep.value = `${props.language === 'en' ? 'Scanning' : 'Skanirlenýär'}: ${data.file} (${data.current}/${data.total})`
          })
        } catch (e) { /* ignore */ }
      }
    })

    // Simulate scanning steps for web mode
    const simulateProgress = async () => {
      const steps = [
        { step: 'hashes', label: props.language === 'en' ? 'Calculating file hashes...' : 'Faýl hashlary hasaplanýar...', pct: 20 },
        { step: 'entropy', label: props.language === 'en' ? 'Analyzing entropy...' : 'Entropiýa derňelýär...', pct: 40 },
        { step: 'filetype', label: props.language === 'en' ? 'Detecting file type...' : 'Faýl görnüşi anyklanýar...', pct: 60 },
        { step: 'patterns', label: props.language === 'en' ? 'Scanning for patterns...' : 'Nagyşlar skanirlenýär...', pct: 80 },
        { step: 'virustotal', label: props.language === 'en' ? 'Checking VirusTotal...' : 'VirusTotal barlanýar...', pct: 90 }
      ]
      for (const s of steps) {
        progress.value = s.pct
        currentStep.value = s.label
        logs.value.push({ message: s.label, type: 'info', icon: 'pi pi-spin pi-spinner' })
        await new Promise(r => setTimeout(r, 400))
      }
    }

    const selectFile = async () => {
      if (isElectron) {
        const filePath = await window.electronAPI.selectFile()
        if (filePath) await scanFileElectron(filePath)
      } else {
        // Web mode: use file input
        fileInput.value.click()
      }
    }

    const onFileSelected = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      await scanFileWeb(file)
      event.target.value = '' // Reset input
    }

    const handleDrop = async (e) => {
      const files = e.dataTransfer.files
      if (files.length > 0) {
        if (isElectron) {
          toast.add({ severity: 'info', summary: 'Info', detail: 'Please use the file picker for security reasons', life: 3000 })
        } else {
          await scanFileWeb(files[0])
        }
      }
    }

    const selectFolder = async () => {
      if (isElectron) {
        const folderPath = await window.electronAPI.selectFolder()
        if (folderPath) await scanFolderElectron(folderPath)
      } else {
        toast.add({ severity: 'info', summary: props.language === 'en' ? 'Web Mode' : 'Web Režimi', detail: props.language === 'en' ? 'Folder scanning requires the desktop app. Use file upload or test samples.' : 'Bukja skani üçin desktop programma gerek. Faýl ýükleme ýa-da synag faýllaryny ulanyň.', life: 4000 })
      }
    }

    // Web mode: upload file to backend for real analysis
    const scanFileWeb = async (file) => {
      isScanning.value = true
      isFolderScan.value = false
      progress.value = 0
      logs.value = []
      result.value = null
      folderResults.value = null

      try {
        // Simulate progress while uploading
        const progressPromise = simulateProgress()

        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post(`${API_URL}/scan/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        await progressPromise

        progress.value = 100
        currentStep.value = props.language === 'en' ? 'Complete!' : 'Tamamlandy!'
        logs.value.push({ message: currentStep.value, type: 'success', icon: 'pi pi-check-circle' })

        if (response.data.success) {
          result.value = response.data.result
          toast.add({
            severity: response.data.result.status === 'clean' ? 'success' : 'warn',
            summary: props.language === 'en' ? 'Scan Complete' : 'Skan Tamamlandy',
            detail: props.t.scan.status[response.data.result.status] || response.data.result.status,
            life: 5000
          })
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 })
      }

      isScanning.value = false
    }

    // Scan a sample file via API
    const scanSample = async (sampleId) => {
      isScanning.value = true
      isFolderScan.value = false
      progress.value = 0
      logs.value = []
      result.value = null

      try {
        const progressPromise = simulateProgress()
        const response = await axios.get(`${API_URL}/samples/${sampleId}`)
        await progressPromise

        progress.value = 100
        currentStep.value = props.language === 'en' ? 'Complete!' : 'Tamamlandy!'
        logs.value.push({ message: currentStep.value, type: 'success', icon: 'pi pi-check-circle' })

        if (response.data.success) {
          result.value = response.data.result
          toast.add({
            severity: response.data.result.status === 'clean' ? 'success' : 'warn',
            summary: props.language === 'en' ? 'Scan Complete' : 'Skan Tamamlandy',
            detail: props.t.scan.status[response.data.result.status] || response.data.result.status,
            life: 5000
          })
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 })
      }

      isScanning.value = false
    }

    // Electron mode scan functions
    const scanFileElectron = async (filePath) => {
      isScanning.value = true
      isFolderScan.value = false
      progress.value = 0
      logs.value = []
      result.value = null
      folderResults.value = null

      try {
        const response = await window.electronAPI.scanFile(filePath)
        if (response.success) {
          result.value = response.result
          toast.add({
            severity: response.result.status === 'clean' ? 'success' : 'warn',
            summary: props.language === 'en' ? 'Scan Complete' : 'Skan Tamamlandy',
            detail: props.t.scan.status[response.result.status] || response.result.status,
            life: 5000
          })
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: response.error, life: 5000 })
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 })
      }
      isScanning.value = false
    }

    const scanFolderElectron = async (folderPath) => {
      isScanning.value = true
      isFolderScan.value = true
      progress.value = 0
      logs.value = []
      result.value = null
      folderResults.value = null

      try {
        const response = await window.electronAPI.scanFolder(folderPath)
        if (response.success) {
          folderResults.value = response
          toast.add({
            severity: 'success',
            summary: props.language === 'en' ? 'Folder Scan Complete' : 'Bukja Skany Tamamlandy',
            detail: `${response.totalFiles} ${props.language === 'en' ? 'files scanned' : 'faýl skanirlendy'}`,
            life: 5000
          })
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 })
      }
      isScanning.value = false
    }

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
      toast.add({ severity: 'success', summary: 'Copied!', life: 2000 })
    }

    const exportReport = () => {
      if (!result.value) return
      const report = {
        title: 'VirusDetect Pro - Scan Report',
        generatedAt: new Date().toISOString(),
        file: { name: result.value.fileName, size: result.value.fileSizeFormatted, type: result.value.fileType?.type || 'Unknown' },
        analysis: { status: result.value.status, threatScore: result.value.threatScore, entropy: result.value.entropy },
        hashes: result.value.hashes,
        suspiciousPatterns: result.value.patterns,
        virusTotal: result.value.virusTotal
      }
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scan-report-${result.value.fileName.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.add({ severity: 'success', summary: props.language === 'en' ? 'Exported' : 'Eksportlandy', life: 3000 })
    }

    const getStatusIcon = (status) => ({
      clean: 'pi pi-check-circle', suspicious: 'pi pi-exclamation-triangle',
      malware: 'pi pi-times-circle', potentially_unwanted: 'pi pi-question-circle'
    }[status] || 'pi pi-info-circle')

    const getScoreClass = (score) => score >= 70 ? 'danger' : score >= 40 ? 'warning' : score >= 20 ? 'info' : 'success'
    const getScoreSeverity = (score) => score >= 70 ? 'danger' : score >= 40 ? 'warn' : score >= 20 ? 'info' : 'success'
    const getFileTypeSeverity = (risk) => ({ critical: 'danger', high: 'warn', medium: 'info', low: 'success' }[risk] || 'secondary')
    const getSeverityClass = (severity) => ({ critical: 'danger', high: 'warn', medium: 'info', low: 'secondary' }[severity] || 'info')
    const getRiskSeverity = (risk) => ({ critical: 'danger', high: 'danger', medium: 'warn', low: 'success' }[risk] || 'info')

    return {
      fileInput, isScanning, progress, currentStep, logs, result, folderResults, isFolderScan, samples,
      selectFile, selectFolder, onFileSelected, handleDrop, scanSample, copyToClipboard, exportReport,
      getStatusIcon, getScoreClass, getScoreSeverity, getFileTypeSeverity, getSeverityClass, getRiskSeverity
    }
  }
}
</script>

<style scoped>
.scan-view { max-width: 1000px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.upload-card, .progress-card, .result-card, .folder-results-card, .samples-card { margin-bottom: 1.5rem; }

.scan-options { display: flex; gap: 1.5rem; align-items: center; }
.or-divider { color: var(--text-secondary); font-weight: 600; }

.dropzone {
  flex: 1; border: 2px dashed var(--border-color); border-radius: 16px;
  padding: 2.5rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s;
}
.dropzone:hover { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
.dropzone i { font-size: 3rem; color: #ef4444; margin-bottom: 1rem; }
.dropzone p { font-weight: 600; margin-bottom: 0.25rem; }
.dropzone small { color: var(--text-secondary); font-size: 0.85rem; }
.folder-zone i { color: #f59e0b; }
.folder-zone:hover { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }

/* Samples */
.samples-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.samples-card h3 i { color: var(--primary-color); }
.samples-desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem; }
.samples-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
.sample-item {
  display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
  background: var(--bg-secondary); border-radius: 10px; cursor: pointer;
  border: 1px solid var(--border-color); transition: all 0.3s;
}
.sample-item:hover { border-color: var(--primary-color); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.sample-item i { font-size: 1.5rem; color: var(--text-secondary); }
.sample-item.critical i, .sample-item.high i { color: #ef4444; }
.sample-item.medium i { color: #f59e0b; }
.sample-item.low i { color: #22c55e; }
.sample-info { flex: 1; }
.sample-name { display: block; font-weight: 600; font-size: 0.9rem; }
.sample-info small { color: var(--text-secondary); font-size: 0.8rem; }

/* Scanning */
.scanning-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; font-weight: 600; color: #ef4444; }
.scan-logs { margin-top: 1rem; background: var(--bg-secondary); padding: 1rem; border-radius: 8px; max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 0.85rem; }
.log-line { display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0; }
.log-line.info { color: var(--text-secondary); }
.log-line.success { color: #10b981; }

/* Result */
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
.status-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 700; font-size: 1.1rem; }
.status-badge.clean { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.suspicious { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-badge.malware { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.status-badge.potentially_unwanted { background: rgba(99, 102, 241, 0.1); color: #6366f1; }

.threat-score { text-align: right; }
.score-label { display: block; font-size: 0.85rem; color: var(--text-secondary); }
.score-value { font-size: 2rem; font-weight: 700; }
.score-value.success { color: #10b981; }
.score-value.info { color: #6366f1; }
.score-value.warning { color: #f59e0b; }
.score-value.danger { color: #ef4444; }

.result-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.result-item { background: var(--bg-secondary); padding: 1rem; border-radius: 8px; }
.result-item label { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
.file-name { word-break: break-all; font-weight: 500; }

.hashes-section, .patterns-section, .virustotal-section { margin-bottom: 1.5rem; }
.hashes-section h4, .patterns-section h4, .virustotal-section h4 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.hashes-section h4 i { color: #6366f1; }
.patterns-section h4 i { color: #f59e0b; }
.virustotal-section h4 i { color: #10b981; }

.hash-item { display: flex; align-items: center; gap: 0.75rem; background: var(--bg-secondary); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; }
.hash-item label { font-weight: 600; min-width: 60px; font-size: 0.85rem; }
.hash-item code { flex: 1; font-size: 0.75rem; word-break: break-all; cursor: pointer; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px; }
.copy-btn { cursor: pointer; color: var(--text-secondary); transition: color 0.2s; }
.copy-btn:hover { color: #ef4444; }

.pattern-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pattern-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--bg-secondary); border-radius: 8px; font-size: 0.9rem; }
.pattern-item .count { color: var(--text-secondary); font-size: 0.8rem; }

.vt-stats { display: flex; gap: 1rem; }
.vt-stat { flex: 1; text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: 8px; }
.vt-stat .num { display: block; font-size: 2rem; font-weight: 700; }
.vt-stat .label { font-size: 0.85rem; color: var(--text-secondary); }
.vt-stat.malicious .num { color: #ef4444; }
.vt-stat.suspicious .num { color: #f59e0b; }
.vt-stat.harmless .num { color: #10b981; }
.vt-stat.undetected .num { color: #6366f1; }
.vt-not-found { padding: 1rem; background: var(--bg-secondary); border-radius: 8px; color: var(--text-secondary); }

.result-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
.folder-summary { color: var(--text-secondary); margin-bottom: 1rem; }

@media (max-width: 768px) {
  .scan-options { flex-direction: column; }
  .or-divider { display: none; }
  .result-grid { grid-template-columns: 1fr; }
  .vt-stats { flex-wrap: wrap; }
  .vt-stat { min-width: 45%; }
  .result-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
  .threat-score { text-align: left; }
  .result-actions { flex-direction: column; }
  .hash-item { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .hash-item label { min-width: unset; }
  .hash-item code { width: 100%; font-size: 0.65rem; }
  .samples-grid { grid-template-columns: 1fr; }
  .dropzone { padding: 1.5rem 1rem; }
  .dropzone i { font-size: 2rem; }
  .page-header h1 { font-size: 1.4rem; }
}

@media (max-width: 480px) {
  .page-header h1 { font-size: 1.2rem; }
  .page-header p { font-size: 0.85rem; }
  .status-badge { font-size: 0.9rem; padding: 0.5rem 1rem; }
  .score-value { font-size: 1.5rem; }
  .vt-stat { min-width: 100%; }
  .vt-stat .num { font-size: 1.5rem; }
  .dropzone { padding: 1.25rem 0.75rem; }
  .dropzone i { font-size: 1.75rem; margin-bottom: 0.5rem; }
  .dropzone p { font-size: 0.9rem; }
  .pattern-item { font-size: 0.8rem; padding: 0.4rem 0.75rem; }
}
</style>
