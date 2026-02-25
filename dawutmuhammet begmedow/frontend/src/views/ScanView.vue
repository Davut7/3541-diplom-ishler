<template>
  <div class="scan-view">
    <div class="page-header">
      <h1>{{ t.scan.title }}</h1>
      <p>{{ t.scan.subtitle }}</p>
    </div>

    <Card class="upload-card">
      <template #content>
        <div class="dropzone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerUpload">
          <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none" />
          <i class="pi pi-cloud-upload"></i>
          <p>{{ t.scan.dropzone }}</p>
        </div>
      </template>
    </Card>

    <Card v-if="isScanning" class="progress-card">
      <template #content>
        <div class="scanning">
          <i class="pi pi-spin pi-spinner"></i>
          <span>{{ t.scan.scanning }}</span>
        </div>
        <ProgressBar :value="progress" />
        <div class="scan-logs">
          <div v-for="(log, i) in logs" :key="i" :class="['log-line', log.type]">{{ log.message }}</div>
        </div>
      </template>
    </Card>

    <Card v-if="result" class="result-card">
      <template #content>
        <h3>{{ t.scan.results.title }}</h3>
        <div class="result-grid">
          <div class="result-item"><label>{{ t.scan.results.fileName }}</label><span>{{ result.fileName }}</span></div>
          <div class="result-item"><label>{{ t.scan.results.fileSize }}</label><span>{{ result.fileSize }}</span></div>
          <div class="result-item"><label>{{ t.scan.results.hash }}</label><span class="hash">{{ result.hash }}</span></div>
          <div class="result-item">
            <label>{{ t.scan.results.status }}</label>
            <Tag :severity="getStatusSeverity(result.status)" :value="t.scan.status[result.status]" />
          </div>
          <div class="result-item"><label>{{ t.scan.results.threatLevel }}</label><span>{{ result.threatLevel }}%</span></div>
        </div>
        <div v-if="result.details.length" class="details-section">
          <h4>{{ t.scan.results.details }}</h4>
          <ul><li v-for="(detail, i) in result.details" :key="i">{{ detail }}</li></ul>
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
    const fileInput = ref(null)
    const isScanning = ref(false)
    const progress = ref(0)
    const logs = ref([])
    const result = ref(null)

    const triggerUpload = () => fileInput.value?.click()
    const handleDrop = (e) => { if (e.dataTransfer.files.length) scanFile(e.dataTransfer.files[0]) }
    const handleFileSelect = (e) => { if (e.target.files.length) scanFile(e.target.files[0]) }

    const scanFile = async (file) => {
      isScanning.value = true
      progress.value = 0
      logs.value = []
      result.value = null

      const steps = [
        { msg: props.language === 'en' ? 'Starting scan...' : 'Skan başlanýar...', type: 'info' },
        { msg: props.language === 'en' ? 'Computing file hash...' : 'Faýl hash hasaplanýar...', type: 'info' },
        { msg: props.language === 'en' ? 'Static analysis...' : 'Statik derňew...', type: 'info' },
        { msg: props.language === 'en' ? 'Heuristic analysis...' : 'Ewristiki derňew...', type: 'info' },
        { msg: props.language === 'en' ? 'Behavioral analysis...' : 'Özüni alyp baryş derňewi...', type: 'info' },
        { msg: props.language === 'en' ? 'AI model classification...' : 'AI model klassifikasiýasy...', type: 'info' },
        { msg: props.language === 'en' ? 'Generating report...' : 'Hasabat döredilýär...', type: 'success' }
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 500))
        logs.value.push(steps[i])
        progress.value = ((i + 1) / steps.length) * 100
      }

      // Simulate result
      const statuses = ['clean', 'clean', 'clean', 'suspicious', 'malware']
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      result.value = {
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        hash: 'SHA256:' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
        status,
        threatLevel: status === 'clean' ? 0 : status === 'suspicious' ? 45 : 85,
        details: status !== 'clean' ? [
          props.language === 'en' ? 'Suspicious API calls detected' : 'Şübheli API çagyryşlary tapyldy',
          props.language === 'en' ? 'Encrypted strings found' : 'Şifrlenen setirler tapyldy'
        ] : []
      }

      isScanning.value = false
    }

    const getStatusSeverity = (status) => ({ clean: 'success', suspicious: 'warn', malware: 'danger', unknown: 'info' }[status])

    return { fileInput, isScanning, progress, logs, result, triggerUpload, handleDrop, handleFileSelect, getStatusSeverity }
  }
}
</script>

<style scoped>
.scan-view { max-width: 800px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }
.upload-card { margin-bottom: 1.5rem; }
.dropzone { border: 2px dashed var(--border-color); border-radius: 12px; padding: 3rem; text-align: center; cursor: pointer; transition: border-color 0.2s; }
.dropzone:hover { border-color: #ef4444; }
.dropzone i { font-size: 3rem; color: #ef4444; margin-bottom: 1rem; }
.dropzone p { color: var(--text-secondary); }
.progress-card { margin-bottom: 1.5rem; }
.scanning { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: #ef4444; }
.scan-logs { margin-top: 1rem; font-family: monospace; font-size: 0.85rem; background: var(--bg-secondary); padding: 1rem; border-radius: 8px; max-height: 150px; overflow-y: auto; }
.log-line { padding: 0.25rem 0; }
.log-line.info { color: var(--text-secondary); }
.log-line.success { color: #10b981; }
.result-card h3 { margin-bottom: 1rem; }
.result-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.result-item { background: var(--bg-secondary); padding: 1rem; border-radius: 8px; }
.result-item label { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
.hash { font-family: monospace; font-size: 0.7rem; word-break: break-all; }
.details-section { margin-top: 1.5rem; }
.details-section h4 { margin-bottom: 0.5rem; }
.details-section ul { padding-left: 1.5rem; color: var(--text-secondary); }
</style>
