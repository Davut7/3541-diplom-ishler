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
            <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop"
              :class="{ 'has-file': uploadedFile }">
              <i :class="uploadedFile ? 'pi pi-file' : 'pi pi-cloud-upload'"></i>
              <p v-if="!uploadedFile">{{ t.analyze.uploadCapture }}</p>
              <p v-else class="file-name">{{ uploadedFile.name }}</p>
              <span v-if="!uploadedFile">.pcap, .pcapng, .cap, .json</span>
              <span v-else class="file-size">{{ formatFileSize(uploadedFile.size) }} - {{ packetCount }} packets</span>
            </div>
            <input ref="fileInput" type="file" accept=".pcap,.pcapng,.cap,.json" @change="handleFileSelect" style="display: none" />
            <Button v-if="uploadedFile" label="Clear" icon="pi pi-times" severity="secondary" @click="clearFile" class="clear-btn" />
          </div>

          <Divider>
            <span class="divider-text">{{ language === 'en' ? 'OR use sample data' : 'Ýa-da nusga maglumatlaryny ulanyň' }}</span>
          </Divider>

          <div class="sample-buttons">
            <Button :label="language === 'en' ? 'Load Sample Capture (500 packets)' : 'Nusga Tutma Ýükle (500 paket)'"
              icon="pi pi-download" severity="secondary" @click="loadSampleData" :loading="isLoadingSample" />
            <Button :label="language === 'en' ? 'Load Large Sample (2000 packets)' : 'Uly Nusga Ýükle (2000 paket)'"
              icon="pi pi-database" severity="info" @click="loadLargeSampleData" :loading="isLoadingSample" />
          </div>

          <div class="paste-section">
            <label>{{ t.analyze.orPaste }}</label>
            <Textarea v-model="pasteData" rows="4" class="paste-textarea"
              :placeholder="language === 'en' ? 'Paste packet data in JSON format...' : 'JSON formatynda paket maglumatlary goýuň...'" />
          </div>

          <Button :label="isAnalyzing ? t.analyze.analyzing : t.analyze.analyze"
            icon="pi pi-search" @click="analyzeTraffic" :loading="isAnalyzing"
            :disabled="!canAnalyze" class="analyze-btn" />
        </template>
      </Card>

      <div v-if="analysisResults" class="results-section">
        <Card class="summary-card">
          <template #content>
            <h3><i class="pi pi-chart-pie"></i> {{ t.analyze.summary.title }}</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="value">{{ analysisResults.summary.totalPackets.toLocaleString() }}</span>
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
                  <div class="bar-fill" :style="{ width: value + '%', backgroundColor: getProtocolColor(protocol) }"></div>
                </div>
                <span class="protocol-value">{{ value }}%</span>
              </div>
            </div>
          </template>
        </Card>

        <Card class="talkers-card">
          <template #content>
            <h3><i class="pi pi-users"></i> {{ t.analyze.topTalkers.title }}</h3>
            <DataTable :value="analysisResults.topTalkers" :rows="10" stripedRows :paginator="analysisResults.topTalkers.length > 10">
              <Column field="rank" header="#">
                <template #body="{ index }">
                  <Tag :severity="index < 3 ? 'warn' : 'secondary'" :value="'#' + (index + 1)" />
                </template>
              </Column>
              <Column field="ip" :header="t.analyze.topTalkers.ip">
                <template #body="{ data }">
                  <code class="ip-code">{{ data.ip }}</code>
                </template>
              </Column>
              <Column field="hostname" :header="language === 'en' ? 'Hostname' : 'Host Ady'"></Column>
              <Column field="packets" :header="t.analyze.topTalkers.packets">
                <template #body="{ data }">
                  {{ data.packets.toLocaleString() }}
                </template>
              </Column>
              <Column field="bytes" :header="t.analyze.topTalkers.bytes"></Column>
              <Column :header="'%'">
                <template #body="{ data }">
                  <div class="percentage-bar">
                    <ProgressBar :value="data.percentage" :showValue="false" style="height: 6px; width: 60px" />
                    <span>{{ data.percentage.toFixed(1) }}%</span>
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>

        <Card class="anomalies-card">
          <template #content>
            <h3><i class="pi pi-exclamation-triangle"></i> {{ t.analyze.anomalies.title }}</h3>
            <div v-if="analysisResults.anomalies.length === 0" class="no-anomalies">
              <i class="pi pi-shield"></i>
              <p>{{ t.analyze.anomalies.none }}</p>
              <span>{{ language === 'en' ? 'Traffic appears normal' : 'Trafik kadaly görünýär' }}</span>
            </div>
            <div v-else class="anomalies-list">
              <div v-for="(anomaly, i) in analysisResults.anomalies" :key="i" class="anomaly-item" :class="'severity-' + anomaly.severity">
                <div class="anomaly-icon">
                  <i :class="getAnomalyIcon(anomaly.type)"></i>
                </div>
                <div class="anomaly-content">
                  <Tag :severity="anomaly.severity === 'danger' ? 'danger' : 'warn'" :value="anomaly.type" />
                  <p>{{ anomaly.description }}</p>
                  <span class="anomaly-details" v-if="anomaly.details">{{ anomaly.details }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Packet List Preview -->
        <Card class="packets-card">
          <template #content>
            <h3><i class="pi pi-list"></i> {{ language === 'en' ? 'Captured Packets Preview' : 'Tutulan Paketler Görnüşi' }}</h3>
            <DataTable :value="analysisResults.packetPreview" :rows="10" :paginator="true"
              stripedRows responsiveLayout="scroll" :rowsPerPageOptions="[10, 25, 50]">
              <Column field="no" header="No" style="width: 60px"></Column>
              <Column field="time" :header="language === 'en' ? 'Time' : 'Wagt'" style="width: 100px">
                <template #body="{ data }">
                  {{ data.timeRelative }}s
                </template>
              </Column>
              <Column field="source" :header="language === 'en' ? 'Source' : 'Çeşme'">
                <template #body="{ data }">
                  <code class="ip-code">{{ data.source }}</code>
                </template>
              </Column>
              <Column field="destination" :header="language === 'en' ? 'Destination' : 'Maksat'">
                <template #body="{ data }">
                  <code class="ip-code">{{ data.destination }}</code>
                </template>
              </Column>
              <Column field="protocol" :header="language === 'en' ? 'Protocol' : 'Protokol'" style="width: 100px">
                <template #body="{ data }">
                  <Tag :style="{ backgroundColor: data.protocolColor }" :value="data.protocol" />
                </template>
              </Column>
              <Column field="length" :header="language === 'en' ? 'Length' : 'Uzynlyk'" style="width: 80px"></Column>
              <Column field="info" :header="language === 'en' ? 'Info' : 'Maglumat'" style="min-width: 250px">
                <template #body="{ data }">
                  <span class="packet-info">{{ data.info }}</span>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const fileInput = ref(null)
    const pasteData = ref('')
    const isAnalyzing = ref(false)
    const isLoadingSample = ref(false)
    const analysisResults = ref(null)
    const uploadedFile = ref(null)
    const fileContent = ref(null)
    const packetCount = ref(0)

    const canAnalyze = computed(() => {
      return uploadedFile.value || pasteData.value.trim().length > 0
    })

    const formatFileSize = (bytes) => {
      if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB'
      if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
      return bytes + ' B'
    }

    const triggerUpload = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = async (event) => {
      const file = event.target.files[0]
      if (file) {
        await processFile(file)
      }
    }

    const handleDrop = async (event) => {
      const file = event.dataTransfer.files[0]
      if (file) {
        await processFile(file)
      }
    }

    const processFile = async (file) => {
      uploadedFile.value = file

      try {
        const text = await file.text()

        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text)
          fileContent.value = Array.isArray(data) ? data : (data.packets || [])
          packetCount.value = fileContent.value.length
        } else {
          // Simulate parsing for .pcap files
          fileContent.value = generateSimulatedPackets(Math.floor(file.size / 100))
          packetCount.value = fileContent.value.length
        }
      } catch (error) {
        console.error('Error processing file:', error)
        packetCount.value = 0
      }
    }

    const clearFile = () => {
      uploadedFile.value = null
      fileContent.value = null
      packetCount.value = 0
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const generateSimulatedPackets = (count) => {
      const protocols = [
        { name: 'TCP', color: '#3b82f6' },
        { name: 'UDP', color: '#10b981' },
        { name: 'HTTP', color: '#22c55e' },
        { name: 'HTTPS', color: '#8b5cf6' },
        { name: 'DNS', color: '#f59e0b' },
        { name: 'ICMP', color: '#6b7280' },
        { name: 'ARP', color: '#ec4899' },
        { name: 'SSH', color: '#14b8a6' }
      ]

      const hosts = [
        { ip: '192.168.1.1', hostname: 'gateway' },
        { ip: '192.168.1.100', hostname: 'workstation-01' },
        { ip: '192.168.1.50', hostname: 'server-main' },
        { ip: '8.8.8.8', hostname: 'dns.google' },
        { ip: '172.217.14.206', hostname: 'google.com' },
        { ip: '13.107.42.14', hostname: 'microsoft.com' },
        { ip: '192.168.1.25', hostname: 'laptop-user' },
        { ip: '31.13.72.36', hostname: 'facebook.com' }
      ]

      const packets = []
      for (let i = 0; i < count; i++) {
        const proto = protocols[Math.floor(Math.random() * protocols.length)]
        const src = hosts[Math.floor(Math.random() * hosts.length)]
        let dst = hosts[Math.floor(Math.random() * hosts.length)]
        while (dst.ip === src.ip) dst = hosts[Math.floor(Math.random() * hosts.length)]

        packets.push({
          no: i + 1,
          timeRelative: (i * 0.05 + Math.random() * 0.02).toFixed(6),
          source: src.ip,
          sourceHostname: src.hostname,
          destination: dst.ip,
          destinationHostname: dst.hostname,
          protocol: proto.name,
          protocolColor: proto.color,
          length: Math.floor(Math.random() * 1400) + 64,
          info: generatePacketInfo(proto.name, src, dst)
        })
      }
      return packets
    }

    const generatePacketInfo = (protocol, src, dst) => {
      switch (protocol) {
        case 'TCP':
          const flags = ['SYN', 'SYN,ACK', 'ACK', 'FIN', 'PSH,ACK']
          return `${Math.floor(Math.random() * 60000 + 1024)} → ${Math.floor(Math.random() * 1000 + 1)} [${flags[Math.floor(Math.random() * flags.length)]}] Seq=${Math.floor(Math.random() * 1000000)}`
        case 'UDP':
          return `Source port: ${Math.floor(Math.random() * 60000 + 1024)}  Destination port: ${Math.floor(Math.random() * 1000 + 1)}`
        case 'HTTP':
          const methods = ['GET', 'POST', 'PUT']
          const paths = ['/', '/api/data', '/index.html', '/images/logo.png']
          return `${methods[Math.floor(Math.random() * methods.length)]} ${paths[Math.floor(Math.random() * paths.length)]} HTTP/1.1`
        case 'HTTPS':
          const tls = ['Application Data', 'Client Hello', 'Server Hello', 'Certificate']
          return `TLSv1.3 ${tls[Math.floor(Math.random() * tls.length)]}`
        case 'DNS':
          const domains = ['google.com', 'facebook.com', 'microsoft.com', 'amazon.com']
          return `Standard query A ${domains[Math.floor(Math.random() * domains.length)]}`
        case 'ICMP':
          return `Echo (ping) ${Math.random() > 0.5 ? 'request' : 'reply'} id=0x${Math.random().toString(16).slice(2, 6)}`
        case 'ARP':
          return `Who has ${dst.ip}? Tell ${src.ip}`
        case 'SSH':
          return `SSH-2.0-OpenSSH_8.9 Encrypted packet`
        default:
          return 'Protocol data'
      }
    }

    const loadSampleData = async () => {
      isLoadingSample.value = true
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))

      // Generate 500 packets locally
      const packets = generateSimulatedPackets(500)
      fileContent.value = packets
      packetCount.value = packets.length
      uploadedFile.value = { name: 'sample_capture.json', size: JSON.stringify(packets).length }

      isLoadingSample.value = false
    }

    const loadLargeSampleData = async () => {
      isLoadingSample.value = true
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800))

      // Generate 2000 packets locally
      const packets = generateSimulatedPackets(2000)
      fileContent.value = packets
      packetCount.value = packets.length
      uploadedFile.value = { name: 'large_capture.json', size: JSON.stringify(packets).length }

      isLoadingSample.value = false
    }

    const analyzeTraffic = async () => {
      isAnalyzing.value = true

      let packets = fileContent.value || []

      if (pasteData.value.trim()) {
        try {
          const parsed = JSON.parse(pasteData.value)
          packets = Array.isArray(parsed) ? parsed : (parsed.packets || [])
        } catch (e) {
          packets = generateSimulatedPackets(100)
        }
      }

      if (packets.length === 0) {
        packets = generateSimulatedPackets(200)
      }

      await new Promise(resolve => setTimeout(resolve, 1500))

      // Analyze packets
      const protocolCounts = {}
      const ipCounts = {}
      let totalBytes = 0

      packets.forEach(p => {
        protocolCounts[p.protocol] = (protocolCounts[p.protocol] || 0) + 1
        ipCounts[p.source] = ipCounts[p.source] || { packets: 0, bytes: 0, hostname: p.sourceHostname }
        ipCounts[p.source].packets++
        ipCounts[p.source].bytes += p.length || 0
        ipCounts[p.destination] = ipCounts[p.destination] || { packets: 0, bytes: 0, hostname: p.destinationHostname }
        ipCounts[p.destination].packets++
        totalBytes += p.length || 0
      })

      const totalPackets = packets.length
      const protocols = {}
      Object.entries(protocolCounts).forEach(([proto, count]) => {
        protocols[proto] = Math.round((count / totalPackets) * 100)
      })

      const topTalkers = Object.entries(ipCounts)
        .map(([ip, data]) => ({
          ip,
          hostname: data.hostname || ip,
          packets: data.packets,
          bytes: formatFileSize(data.bytes),
          percentage: (data.packets / (totalPackets * 2)) * 100
        }))
        .sort((a, b) => b.packets - a.packets)
        .slice(0, 10)

      // Detect anomalies
      const anomalies = []
      const uniqueIPs = Object.keys(ipCounts).length

      // Port scan detection
      if (uniqueIPs > 20 && totalPackets > 500) {
        anomalies.push({
          type: props.t.analyze.anomalies.portScan,
          severity: 'warning',
          description: `Detected ${uniqueIPs} unique IP addresses with high packet count`,
          details: 'Multiple connection attempts to different destinations detected'
        })
      }

      // Data exfiltration
      const highTrafficIPs = topTalkers.filter(t => t.percentage > 30)
      if (highTrafficIPs.length > 0) {
        anomalies.push({
          type: props.t.analyze.anomalies.dataExfil,
          severity: 'danger',
          description: `High traffic concentration: ${highTrafficIPs[0].ip} accounts for ${highTrafficIPs[0].percentage.toFixed(1)}% of traffic`,
          details: `${highTrafficIPs[0].bytes} transferred`
        })
      }

      // DDoS pattern
      if (protocols.UDP > 40 || protocols.ICMP > 20) {
        anomalies.push({
          type: props.t.analyze.anomalies.ddos,
          severity: 'warning',
          description: 'Unusually high UDP/ICMP traffic detected',
          details: `UDP: ${protocols.UDP || 0}%, ICMP: ${protocols.ICMP || 0}%`
        })
      }

      const duration = packets.length > 0 ? parseFloat(packets[packets.length - 1].timeRelative || 0) : 0

      analysisResults.value = {
        summary: {
          totalPackets,
          uniqueIPs,
          protocols: Object.keys(protocolCounts).length,
          duration: `${Math.floor(duration / 60)}m ${Math.round(duration % 60)}s`,
          avgSize: `${Math.round(totalBytes / totalPackets)} bytes`,
          bandwidth: `${((totalBytes / 1048576) / (duration || 1)).toFixed(2)} MB/s`
        },
        protocols,
        topTalkers,
        anomalies,
        packetPreview: packets.slice(0, 100)
      }

      isAnalyzing.value = false
    }

    const getProtocolColor = (protocol) => {
      const colors = {
        TCP: '#3b82f6',
        UDP: '#10b981',
        HTTP: '#22c55e',
        HTTPS: '#8b5cf6',
        DNS: '#f59e0b',
        ICMP: '#6b7280',
        ARP: '#ec4899',
        SSH: '#14b8a6',
        FTP: '#ef4444',
        SMTP: '#a855f7'
      }
      return colors[protocol] || '#64748b'
    }

    const getAnomalyIcon = (type) => {
      if (type.includes('Port') || type.includes('Scan')) return 'pi pi-search'
      if (type.includes('DDoS')) return 'pi pi-bolt'
      if (type.includes('Exfil') || type.includes('Data')) return 'pi pi-upload'
      if (type.includes('Malware')) return 'pi pi-ban'
      return 'pi pi-exclamation-triangle'
    }

    return {
      fileInput,
      pasteData,
      isAnalyzing,
      isLoadingSample,
      analysisResults,
      uploadedFile,
      packetCount,
      canAnalyze,
      formatFileSize,
      triggerUpload,
      handleFileSelect,
      handleDrop,
      clearFile,
      loadSampleData,
      loadLargeSampleData,
      analyzeTraffic,
      getProtocolColor,
      getAnomalyIcon
    }
  }
}
</script>

<style scoped>
.analyze-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
  background: var(--cyber-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p { color: var(--text-secondary); }

.upload-card {
  margin-bottom: 1.5rem;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.upload-area:hover {
  border-color: var(--cyber-primary);
  background: rgba(0, 212, 170, 0.05);
}

.upload-area.has-file {
  border-color: var(--cyber-primary);
  background: rgba(0, 212, 170, 0.1);
}

.upload-area i {
  font-size: 3rem;
  color: var(--cyber-primary);
  margin-bottom: 1rem;
}

.upload-area.has-file i {
  color: var(--cyber-primary);
}

.upload-area p {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.upload-area .file-name {
  font-size: 1.1rem;
  color: #10b981;
}

.upload-area span {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.upload-area .file-size {
  color: #10b981;
  font-weight: 600;
}

.clear-btn {
  width: 100%;
  margin-bottom: 1rem;
}

.divider-text {
  background: var(--bg-secondary);
  padding: 0 1rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.sample-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.sample-buttons .p-button {
  flex: 1;
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
.anomalies-card,
.packets-card {
  grid-column: span 2;
}

.results-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.results-section h3 i {
  color: var(--cyber-primary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.summary-item {
  text-align: center;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.summary-item .value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cyber-primary);
  font-family: 'JetBrains Mono', monospace;
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
  width: 70px;
  font-weight: 500;
}

.bar-container {
  flex: 1;
  height: 22px;
  background: var(--bg-primary);
  border-radius: 11px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 11px;
  transition: width 0.5s;
}

.protocol-value {
  width: 50px;
  text-align: right;
  font-weight: 600;
  color: var(--text-secondary);
}

.ip-code {
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--cyber-primary);
}

.percentage-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.percentage-bar span {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 40px;
}

.no-anomalies {
  text-align: center;
  padding: 3rem;
  color: #22c55e;
}

.no-anomalies i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.no-anomalies p {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.no-anomalies span {
  color: var(--text-secondary);
}

.anomalies-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.anomaly-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: 8px;
  border-left: 4px solid;
}

.anomaly-item.severity-danger { border-color: #ef4444; }
.anomaly-item.severity-warning { border-color: #f59e0b; }

.anomaly-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.anomaly-icon i {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.anomaly-content p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.anomaly-details {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.packet-info {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.packets-card :deep(.p-datatable) {
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .results-section {
    grid-template-columns: 1fr;
  }

  .summary-card,
  .anomalies-card,
  .packets-card {
    grid-column: span 1;
  }

  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .sample-buttons {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .upload-area {
    padding: 1.5rem;
  }

  .upload-area i {
    font-size: 2rem;
  }

  .talkers-card :deep(.p-datatable-wrapper),
  .packets-card :deep(.p-datatable-wrapper) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .talkers-card :deep(.p-datatable-table),
  .packets-card :deep(.p-datatable-table) {
    min-width: 600px;
  }

  .anomaly-item {
    padding: 1rem;
  }

  .no-anomalies {
    padding: 2rem;
  }
}

@media (max-width: 600px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .summary-item .value {
    font-size: 1.25rem;
  }

  .upload-area {
    padding: 1.25rem;
  }

  .upload-area i {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .anomaly-item {
    flex-direction: column;
    gap: 0.75rem;
  }

  .protocol-bar {
    gap: 0.5rem;
  }

  .protocol-name {
    width: 50px;
    font-size: 0.8rem;
  }

  .protocol-value {
    width: 40px;
    font-size: 0.85rem;
  }
}
</style>
