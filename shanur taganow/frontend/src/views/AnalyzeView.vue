<template>
  <div class="analyze-view">
    <div class="page-header">
      <h1>{{ t.analyze.title }}</h1>
      <p>{{ t.analyze.subtitle }}</p>
    </div>

    <div class="analyze-layout">
      <Card class="upload-card">
        <template #content>
          <div class="upload-section">
            <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
              <i class="pi pi-cloud-upload"></i>
              <p>{{ t.analyze.uploadCapture }}</p>
              <span>.pcap, .pcapng, .cap</span>
            </div>
            <input ref="fileInput" type="file" accept=".pcap,.pcapng,.cap" @change="handleFileSelect" style="display: none" />
          </div>

          <div class="paste-section">
            <label>{{ t.analyze.orPaste }}</label>
            <Textarea v-model="pasteData" rows="4" class="paste-textarea" />
          </div>

          <Button :label="isAnalyzing ? t.analyze.analyzing : t.analyze.analyze" icon="pi pi-search" @click="analyzeTraffic" :loading="isAnalyzing" class="analyze-btn" />
        </template>
      </Card>

      <div v-if="analysisResults" class="results-section">
        <Card class="summary-card">
          <template #content>
            <h3><i class="pi pi-chart-pie"></i> {{ t.analyze.summary.title }}</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="value">{{ analysisResults.summary.totalPackets }}</span>
                <span class="label">{{ t.analyze.summary.totalPackets }}</span>
              </div>
              <div class="summary-item">
                <span class="value">{{ analysisResults.summary.uniqueIPs }}</span>
                <span class="label">{{ t.analyze.summary.uniqueIPs }}</span>
              </div>
              <div class="summary-item">
                <span class="value">{{ analysisResults.summary.protocols }}</span>
                <span class="label">{{ t.analyze.summary.protocols }}</span>
              </div>
              <div class="summary-item">
                <span class="value">{{ analysisResults.summary.duration }}</span>
                <span class="label">{{ t.analyze.summary.duration }}</span>
              </div>
              <div class="summary-item">
                <span class="value">{{ analysisResults.summary.avgSize }}</span>
                <span class="label">{{ t.analyze.summary.avgSize }}</span>
              </div>
              <div class="summary-item">
                <span class="value">{{ analysisResults.summary.bandwidth }}</span>
                <span class="label">{{ t.analyze.summary.bandwidth }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card class="protocols-card">
          <template #content>
            <h3><i class="pi pi-chart-bar"></i> {{ t.analyze.protocols.title }}</h3>
            <div class="protocol-bars">
              <div v-for="(value, protocol) in analysisResults.protocols" :key="protocol" class="protocol-bar">
                <span class="protocol-name">{{ protocol }}</span>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: value + '%' }"></div>
                </div>
                <span class="protocol-value">{{ value }}%</span>
              </div>
            </div>
          </template>
        </Card>

        <Card class="talkers-card">
          <template #content>
            <h3><i class="pi pi-users"></i> {{ t.analyze.topTalkers.title }}</h3>
            <DataTable :value="analysisResults.topTalkers" :rows="5">
              <Column field="ip" :header="t.analyze.topTalkers.ip"></Column>
              <Column field="packets" :header="t.analyze.topTalkers.packets"></Column>
              <Column field="bytes" :header="t.analyze.topTalkers.bytes"></Column>
            </DataTable>
          </template>
        </Card>

        <Card class="anomalies-card">
          <template #content>
            <h3><i class="pi pi-exclamation-triangle"></i> {{ t.analyze.anomalies.title }}</h3>
            <div v-if="analysisResults.anomalies.length === 0" class="no-anomalies">
              <i class="pi pi-check-circle"></i>
              <p>{{ t.analyze.anomalies.none }}</p>
            </div>
            <div v-else class="anomalies-list">
              <div v-for="(anomaly, i) in analysisResults.anomalies" :key="i" class="anomaly-item">
                <Tag :severity="anomaly.severity" :value="anomaly.type" />
                <span>{{ anomaly.description }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const fileInput = ref(null)
    const pasteData = ref('')
    const isAnalyzing = ref(false)
    const analysisResults = ref(null)

    const triggerUpload = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        pasteData.value = `Loaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      }
    }

    const handleDrop = (event) => {
      const file = event.dataTransfer.files[0]
      if (file) {
        pasteData.value = `Loaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      }
    }

    const analyzeTraffic = async () => {
      isAnalyzing.value = true

      await new Promise(resolve => setTimeout(resolve, 2000))

      const hasAnomalies = Math.random() > 0.5
      const anomalies = hasAnomalies ? [
        { type: props.t.analyze.anomalies.portScan, severity: 'warn', description: 'Multiple connection attempts to different ports from 192.168.1.50' },
        { type: props.t.analyze.anomalies.dataExfil, severity: 'danger', description: 'Large data transfer to external IP 203.0.113.100' }
      ] : []

      analysisResults.value = {
        summary: {
          totalPackets: Math.floor(Math.random() * 10000) + 1000,
          uniqueIPs: Math.floor(Math.random() * 50) + 10,
          protocols: Math.floor(Math.random() * 8) + 3,
          duration: `${Math.floor(Math.random() * 60) + 1}m ${Math.floor(Math.random() * 60)}s`,
          avgSize: `${Math.floor(Math.random() * 500) + 100} bytes`,
          bandwidth: `${(Math.random() * 10 + 1).toFixed(2)} MB/s`
        },
        protocols: {
          TCP: Math.floor(Math.random() * 40) + 30,
          UDP: Math.floor(Math.random() * 20) + 10,
          HTTP: Math.floor(Math.random() * 15) + 5,
          HTTPS: Math.floor(Math.random() * 20) + 10,
          DNS: Math.floor(Math.random() * 10) + 2,
          Other: Math.floor(Math.random() * 5) + 1
        },
        topTalkers: [
          { ip: '192.168.1.1', packets: Math.floor(Math.random() * 5000) + 1000, bytes: `${(Math.random() * 5 + 1).toFixed(2)} MB` },
          { ip: '192.168.1.100', packets: Math.floor(Math.random() * 3000) + 500, bytes: `${(Math.random() * 3 + 0.5).toFixed(2)} MB` },
          { ip: '8.8.8.8', packets: Math.floor(Math.random() * 1000) + 200, bytes: `${(Math.random() * 1 + 0.1).toFixed(2)} MB` },
          { ip: '10.0.0.1', packets: Math.floor(Math.random() * 800) + 100, bytes: `${(Math.random() * 0.8 + 0.05).toFixed(2)} MB` },
          { ip: '172.16.0.50', packets: Math.floor(Math.random() * 500) + 50, bytes: `${(Math.random() * 0.5).toFixed(2)} MB` }
        ],
        anomalies
      }

      isAnalyzing.value = false
    }

    return {
      fileInput,
      pasteData,
      isAnalyzing,
      analysisResults,
      triggerUpload,
      handleFileSelect,
      handleDrop,
      analyzeTraffic
    }
  }
}
</script>

<style scoped>
.analyze-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.upload-card {
  margin-bottom: 1.5rem;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.upload-area i {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.upload-area p {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.upload-area span {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.paste-section {
  margin-bottom: 1.5rem;
}

.paste-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.paste-textarea {
  width: 100%;
}

.analyze-btn {
  width: 100%;
}

.results-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.summary-card,
.anomalies-card {
  grid-column: span 2;
}

.results-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.results-section h3 i {
  color: #3b82f6;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.summary-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.summary-item .value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.summary-item .label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.protocol-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.protocol-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.protocol-name {
  width: 60px;
  font-weight: 500;
}

.bar-container {
  flex: 1;
  height: 20px;
  background: var(--bg-primary);
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 10px;
  transition: width 0.5s;
}

.protocol-value {
  width: 50px;
  text-align: right;
  color: var(--text-secondary);
}

.no-anomalies {
  text-align: center;
  padding: 2rem;
  color: #22c55e;
}

.no-anomalies i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.anomalies-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.anomaly-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .results-section {
    grid-template-columns: 1fr;
  }

  .summary-card,
  .anomalies-card {
    grid-column: span 1;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
