<template>
  <div class="capture-view">
    <div class="page-header">
      <h1>{{ t.capture.title }}</h1>
      <p>{{ t.capture.subtitle }}</p>
    </div>

    <Card class="capture-controls">
      <template #content>
        <div class="controls-row">
          <div class="control-group">
            <label>{{ t.capture.interface }}</label>
            <Select v-model="selectedInterface" :options="interfaces" optionLabel="name" optionValue="value" :placeholder="t.capture.selectInterface" class="interface-select" />
          </div>
          <div class="control-group filter-group">
            <label>{{ t.capture.filter }}</label>
            <InputText v-model="captureFilter" :placeholder="t.capture.filterPlaceholder" class="filter-input" />
          </div>
          <div class="control-actions">
            <Button v-if="!isCapturing" :label="t.capture.startCapture" icon="pi pi-play" @click="startCapture" />
            <Button v-else :label="t.capture.stopCapture" icon="pi pi-stop" severity="danger" @click="stopCapture" />
            <Button :label="t.capture.clearPackets" icon="pi pi-trash" severity="secondary" outlined @click="clearPackets" />
          </div>
        </div>
        <div v-if="isCapturing" class="capture-status">
          <Tag severity="success" :value="t.capture.capturing" />
          <span>{{ t.capture.packets }}: {{ packets.length }}</span>
          <span>{{ t.capture.bytes }}: {{ totalBytes }}</span>
        </div>
      </template>
    </Card>

    <Card class="packets-table">
      <template #content>
        <DataTable :value="packets" :paginator="true" :rows="20" :rowsPerPageOptions="[10, 20, 50]"
                   selectionMode="single" v-model:selection="selectedPacket" @row-select="onPacketSelect"
                   :emptyMessage="t.capture.noPackets" stripedRows>
          <Column field="no" :header="t.capture.table.no" style="width: 5%"></Column>
          <Column field="time" :header="t.capture.table.time" style="width: 10%"></Column>
          <Column field="source" :header="t.capture.table.source" style="width: 15%"></Column>
          <Column field="destination" :header="t.capture.table.destination" style="width: 15%"></Column>
          <Column field="protocol" :header="t.capture.table.protocol" style="width: 10%">
            <template #body="{ data }">
              <Tag :severity="getProtocolSeverity(data.protocol)" :value="data.protocol" />
            </template>
          </Column>
          <Column field="length" :header="t.capture.table.length" style="width: 10%"></Column>
          <Column field="info" :header="t.capture.table.info" style="width: 35%"></Column>
        </DataTable>
      </template>
    </Card>

    <Card v-if="selectedPacket" class="packet-details">
      <template #content>
        <h3><i class="pi pi-info-circle"></i> {{ t.capture.packetDetails }}</h3>
        <TabView>
          <TabPanel header="Details">
            <div class="detail-section">
              <h4>Frame</h4>
              <p>Packet Number: {{ selectedPacket.no }}</p>
              <p>Capture Time: {{ selectedPacket.time }}</p>
              <p>Frame Length: {{ selectedPacket.length }} bytes</p>
            </div>
            <div class="detail-section">
              <h4>Internet Protocol</h4>
              <p>Source: {{ selectedPacket.source }}</p>
              <p>Destination: {{ selectedPacket.destination }}</p>
              <p>Protocol: {{ selectedPacket.protocol }}</p>
            </div>
            <div class="detail-section">
              <h4>Info</h4>
              <p>{{ selectedPacket.info }}</p>
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

    const getProtocolSeverity = (protocol) => {
      const severities = {
        TCP: 'info',
        UDP: 'secondary',
        HTTP: 'success',
        HTTPS: 'success',
        DNS: 'warn',
        ICMP: 'secondary',
        ARP: 'secondary',
        SSH: 'contrast',
        FTP: 'danger'
      }
      return severities[protocol] || 'info'
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
      startCapture,
      stopCapture,
      clearPackets,
      onPacketSelect,
      getProtocolSeverity,
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

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.capture-controls {
  margin-bottom: 1.5rem;
}

.controls-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  font-size: 0.9rem;
}

.interface-select {
  min-width: 200px;
}

.filter-group {
  flex: 1;
}

.filter-input {
  width: 100%;
}

.control-actions {
  display: flex;
  gap: 0.5rem;
}

.capture-status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.packets-table {
  margin-bottom: 1.5rem;
}

.packet-details h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.packet-details h3 i {
  color: #3b82f6;
}

.detail-section {
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.detail-section h4 {
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.detail-section p {
  margin: 0.25rem 0;
  font-family: monospace;
}

.hex-dump {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }

  .control-actions {
    flex-wrap: wrap;
  }
}
</style>
