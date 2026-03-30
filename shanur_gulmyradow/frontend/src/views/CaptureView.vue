<template>
  <div class="capture-view">
    <div class="page-header">
      <div class="header-icon">
        <i class="pi pi-video"></i>
      </div>
      <h1>{{ t.capture.title }}</h1>
      <p>{{ t.capture.subtitle }}</p>
    </div>

    <Card class="capture-controls">
      <template #content>
        <div class="controls-row">
          <div class="control-group">
            <label><i class="pi pi-wifi"></i> {{ t.capture.interface }}</label>
            <Select v-model="selectedInterface" :options="interfaces" optionLabel="name" optionValue="value" :placeholder="t.capture.selectInterface" class="interface-select" />
          </div>
          <div class="control-group filter-group">
            <label><i class="pi pi-filter"></i> {{ t.capture.filter }}</label>
            <InputText v-model="captureFilter" :placeholder="t.capture.filterPlaceholder" class="filter-input" />
          </div>
          <div class="control-actions">
            <Button v-if="!isCapturing" :label="t.capture.startCapture" icon="pi pi-play" @click="startCapture" class="btn-start" />
            <Button v-else :label="t.capture.stopCapture" icon="pi pi-stop" severity="danger" @click="stopCapture" class="btn-stop" />
            <Button :label="t.capture.clearPackets" icon="pi pi-trash" severity="secondary" outlined @click="clearPackets" />
          </div>
        </div>
        <div v-if="isCapturing" class="capture-status">
          <div class="status-badge">
            <span class="status-dot"></span>
            <span>{{ t.capture.capturing }}</span>
          </div>
          <div class="status-stats">
            <div class="status-stat">
              <i class="pi pi-box"></i>
              <span>{{ packets.length }}</span>
              <small>{{ t.capture.packets }}</small>
            </div>
            <div class="status-stat">
              <i class="pi pi-database"></i>
              <span>{{ formatBytes(totalBytes) }}</span>
              <small>{{ t.capture.bytes }}</small>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="packets-table">
      <template #content>
        <DataTable :value="packets" :paginator="true" :rows="20" :rowsPerPageOptions="[10, 20, 50]"
                   selectionMode="single" v-model:selection="selectedPacket" @row-select="onPacketSelect"
                   :emptyMessage="t.capture.noPackets" stripedRows class="cyber-table">
          <Column field="no" :header="t.capture.table.no" style="width: 5%"></Column>
          <Column field="time" :header="t.capture.table.time" style="width: 10%">
            <template #body="{ data }">
              <span class="time-cell">{{ data.time }}</span>
            </template>
          </Column>
          <Column field="source" :header="t.capture.table.source" style="width: 15%">
            <template #body="{ data }">
              <span class="ip-cell">{{ data.source }}</span>
            </template>
          </Column>
          <Column field="destination" :header="t.capture.table.destination" style="width: 15%">
            <template #body="{ data }">
              <span class="ip-cell">{{ data.destination }}</span>
            </template>
          </Column>
          <Column field="protocol" :header="t.capture.table.protocol" style="width: 10%">
            <template #body="{ data }">
              <Tag :class="'proto-' + data.protocol.toLowerCase()" :value="data.protocol" />
            </template>
          </Column>
          <Column field="length" :header="t.capture.table.length" style="width: 10%">
            <template #body="{ data }">
              <span class="length-cell">{{ data.length }} B</span>
            </template>
          </Column>
          <Column field="info" :header="t.capture.table.info" style="width: 35%">
            <template #body="{ data }">
              <span class="info-cell">{{ data.info }}</span>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card v-if="selectedPacket" class="packet-details">
      <template #content>
        <div class="details-header">
          <i class="pi pi-info-circle"></i>
          <h3>{{ t.capture.packetDetails }}</h3>
          <Tag :value="'#' + selectedPacket.no" severity="info" />
        </div>
        <TabView class="cyber-tabs">
          <TabPanel header="Details">
            <div class="detail-grid">
              <div class="detail-section">
                <div class="section-header">
                  <i class="pi pi-box"></i>
                  <h4>Frame</h4>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Packet Number</span>
                  <span class="detail-value">{{ selectedPacket.no }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Capture Time</span>
                  <span class="detail-value">{{ selectedPacket.time }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Frame Length</span>
                  <span class="detail-value">{{ selectedPacket.length }} bytes</span>
                </div>
              </div>
              <div class="detail-section">
                <div class="section-header">
                  <i class="pi pi-globe"></i>
                  <h4>Internet Protocol</h4>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Source IP</span>
                  <span class="detail-value ip">{{ selectedPacket.source }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Destination IP</span>
                  <span class="detail-value ip">{{ selectedPacket.destination }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Protocol</span>
                  <Tag :class="'proto-' + selectedPacket.protocol.toLowerCase()" :value="selectedPacket.protocol" />
                </div>
              </div>
            </div>
            <div class="detail-section full-width">
              <div class="section-header">
                <i class="pi pi-info"></i>
                <h4>Packet Info</h4>
              </div>
              <div class="info-content">{{ selectedPacket.info }}</div>
            </div>
          </TabPanel>
          <TabPanel :header="t.capture.hexDump">
            <pre class="hex-dump">{{ generateHexDump() }}</pre>
          </TabPanel>
        </TabView>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const selectedInterface = ref('eth0')
    const captureFilter = ref('')
    const isCapturing = ref(false)
    const packets = ref([])
    const selectedPacket = ref(null)
    let captureInterval = null
    let packetCounter = 0

    const interfaces = computed(() => [
      { name: props.t.capture.interfaces.eth0, value: 'eth0' },
      { name: props.t.capture.interfaces.wlan0, value: 'wlan0' },
      { name: props.t.capture.interfaces.lo, value: 'lo' },
      { name: props.t.capture.interfaces.any, value: 'any' }
    ])

    const totalBytes = computed(() => {
      return packets.value.reduce((sum, p) => sum + p.length, 0)
    })

    const formatBytes = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }

    const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ICMP', 'ARP', 'SSH', 'FTP']
    const ips = ['192.168.1.1', '192.168.1.100', '10.0.0.1', '8.8.8.8', '1.1.1.1', '172.16.0.1', '192.168.0.50']

    const generatePacket = () => {
      packetCounter++
      const protocol = protocols[Math.floor(Math.random() * protocols.length)]
      const source = ips[Math.floor(Math.random() * ips.length)]
      const dest = ips[Math.floor(Math.random() * ips.length)]

      const infos = {
        TCP: `${Math.floor(Math.random() * 65535)} → ${Math.floor(Math.random() * 1000)} [SYN, ACK] Seq=0 Ack=1 Win=65535`,
        UDP: `Source port: ${Math.floor(Math.random() * 65535)} Destination port: ${Math.floor(Math.random() * 1000)}`,
        HTTP: `GET /api/data HTTP/1.1`,
        HTTPS: `Application Data Protocol: TLSv1.3`,
        DNS: `Standard query 0x${Math.random().toString(16).slice(2, 6)} A www.example.com`,
        ICMP: `Echo (ping) request id=0x${Math.random().toString(16).slice(2, 6)}`,
        ARP: `Who has ${dest}? Tell ${source}`,
        SSH: `Server: SSH-2.0-OpenSSH_8.9`,
        FTP: `Response: 220 Welcome to FTP server`
      }

      return {
        no: packetCounter,
        time: new Date().toLocaleTimeString(),
        source,
        destination: dest,
        protocol,
        length: Math.floor(Math.random() * 1500) + 40,
        info: infos[protocol]
      }
    }

    const startCapture = () => {
      isCapturing.value = true
      captureInterval = setInterval(() => {
        const numPackets = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < numPackets; i++) {
          packets.value.push(generatePacket())
        }
        if (packets.value.length > 500) {
          packets.value = packets.value.slice(-500)
        }
      }, 500)
    }

    const stopCapture = () => {
      isCapturing.value = false
      if (captureInterval) {
        clearInterval(captureInterval)
        captureInterval = null
      }
    }

    const clearPackets = () => {
      packets.value = []
      selectedPacket.value = null
      packetCounter = 0
    }

    const onPacketSelect = (event) => {
      selectedPacket.value = event.data
    }

    const generateHexDump = () => {
      if (!selectedPacket.value) return ''
      const length = selectedPacket.value.length
      let hex = ''
      for (let i = 0; i < Math.min(length, 256); i += 16) {
        let line = i.toString(16).padStart(8, '0') + '  '
        for (let j = 0; j < 16; j++) {
          if (i + j < length) {
            line += Math.floor(Math.random() * 256).toString(16).padStart(2, '0') + ' '
          } else {
            line += '   '
          }
          if (j === 7) line += ' '
        }
        line += ' |'
        for (let j = 0; j < 16 && i + j < length; j++) {
          const c = Math.floor(Math.random() * 94) + 32
          line += String.fromCharCode(c >= 32 && c < 127 ? c : 46)
        }
        line += '|\n'
        hex += line
      }
      return hex
    }

    return {
      selectedInterface,
      captureFilter,
      isCapturing,
      packets,
      selectedPacket,
      interfaces,
      totalBytes,
      formatBytes,
      startCapture,
      stopCapture,
      clearPackets,
      onPacketSelect,
      generateHexDump
    }
  }
}
</script>

<style scoped>
.capture-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.header-icon {
  width: 70px;
  height: 70px;
  background: var(--cyber-gradient);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 10px 40px var(--cyber-glow);
}

.header-icon i {
  font-size: 2rem;
  color: white;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: var(--cyber-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: var(--text-secondary);
}

.capture-controls {
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.controls-row {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.control-group label i {
  color: var(--cyber-primary);
}

.interface-select {
  min-width: 220px;
}

.filter-group {
  flex: 1;
  min-width: 250px;
}

.filter-input {
  width: 100%;
}

.control-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-start {
  background: var(--cyber-gradient) !important;
  border: none !important;
  box-shadow: 0 4px 20px var(--cyber-glow) !important;
}

.btn-start:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 30px var(--cyber-glow) !important;
}

.btn-stop {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}

.capture-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 212, 170, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: var(--cyber-primary);
  font-weight: 600;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: var(--cyber-primary);
  border-radius: 50%;
  animation: blink 1s ease-in-out infinite;
  box-shadow: 0 0 10px var(--cyber-glow);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-stats {
  display: flex;
  gap: 2rem;
}

.status-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
}

.status-stat i {
  color: var(--cyber-primary);
}

.status-stat span {
  font-weight: 700;
  font-size: 1.1rem;
}

.status-stat small {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.packets-table {
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.time-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.ip-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--cyber-primary);
}

.length-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.info-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Protocol Tags */
.proto-tcp { background: linear-gradient(135deg, #00d4aa, #06b6d4) !important; }
.proto-udp { background: linear-gradient(135deg, #7c3aed, #a855f7) !important; }
.proto-http { background: linear-gradient(135deg, #10b981, #059669) !important; }
.proto-https { background: linear-gradient(135deg, #059669, #047857) !important; }
.proto-dns { background: linear-gradient(135deg, #f59e0b, #d97706) !important; }
.proto-icmp { background: linear-gradient(135deg, #6b7280, #4b5563) !important; }
.proto-arp { background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important; }
.proto-ssh { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; }
.proto-ftp { background: linear-gradient(135deg, #ef4444, #dc2626) !important; }

/* Packet Details */
.packet-details {
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.details-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.details-header i {
  font-size: 1.5rem;
  color: var(--cyber-primary);
}

.details-header h3 {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-section {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
}

.detail-section.full-width {
  grid-column: 1 / -1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.section-header i {
  color: var(--cyber-primary);
}

.section-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px dashed var(--border-color);
}

.detail-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.detail-value {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
}

.detail-value.ip {
  color: var(--cyber-primary);
}

.info-content {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  color: var(--text-secondary);
}

.hex-dump {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 12px;
  overflow-x: auto;
  white-space: pre;
  color: var(--cyber-primary);
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }

  .control-actions {
    flex-wrap: wrap;
  }

  .capture-status {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
