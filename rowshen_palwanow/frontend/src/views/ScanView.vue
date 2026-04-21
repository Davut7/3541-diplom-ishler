<template>
  <div class="scan-view">
    <div class="page-header">
      <h1>{{ t.scan.title }}</h1>
      <p>{{ t.scan.subtitle }}</p>
      <Tag v-if="isElectron" severity="success" :value="language === 'en' ? 'Desktop Mode - Real Scan' : 'Iş stoly tertibi - Hakyky Skan'" />
      <Tag v-else severity="warn" :value="language === 'en' ? 'Demo Mode' : 'Demo tertibi'" />
    </div>

    <Card class="scan-options" v-if="!isScanning && !scanComplete">
      <template #content>
        <div class="scan-types">
          <div class="scan-type" :class="{ active: scanType === 'quick' }" @click="scanType = 'quick'">
            <div class="scan-icon quick"><i class="pi pi-bolt"></i></div>
            <h3>{{ t.scan.quickScan }}</h3>
            <p>{{ language === 'en' ? 'Processes only' : 'Diňe prosesler' }}</p>
          </div>
          <div class="scan-type" :class="{ active: scanType === 'full' }" @click="scanType = 'full'">
            <div class="scan-icon full"><i class="pi pi-search"></i></div>
            <h3>{{ t.scan.fullScan }}</h3>
            <p>{{ language === 'en' ? 'Complete system scan' : 'Doly ulgam skany' }}</p>
          </div>
          <div class="scan-type" :class="{ active: scanType === 'custom' }" @click="scanType = 'custom'">
            <div class="scan-icon custom"><i class="pi pi-cog"></i></div>
            <h3>{{ t.scan.customScan }}</h3>
            <p>{{ language === 'en' ? 'Select scan areas' : 'Skan meýdanlaryny saýlaň' }}</p>
          </div>
        </div>

        <div v-if="scanType === 'custom'" class="scan-areas">
          <h4><i class="pi pi-sliders-h"></i> {{ language === 'en' ? 'Scan Areas' : 'Skan Meýdanlary' }}</h4>
          <div class="area-grid">
            <div v-for="(area, key) in t.scan.scanAreas" :key="key" class="area-item" :class="{ active: scanAreas[key] }" @click="scanAreas[key] = !scanAreas[key]">
              <i :class="getAreaIcon(key)"></i>
              <span>{{ area }}</span>
              <i :class="scanAreas[key] ? 'pi pi-check-circle' : 'pi pi-circle'" class="check-icon"></i>
            </div>
          </div>
        </div>

        <Button :label="language === 'en' ? 'Start Scan' : 'Skany Başla'" icon="pi pi-play" @click="startScan" class="start-btn" />

        <div v-if="isElectron" class="test-section">
          <p class="test-label"><i class="pi pi-flask"></i> {{ language === 'en' ? 'Testing Tools' : 'Synag Gurallary' }}</p>
          <div class="test-buttons">
            <Button :label="language === 'en' ? 'Create Test Threats' : 'Synag Howplaryny Döret'" icon="pi pi-exclamation-triangle" severity="warn" outlined size="small" @click="createTestFiles" :loading="creatingTests" />
            <Button :label="language === 'en' ? 'Remove Test Threats' : 'Synag Howplaryny Poz'" icon="pi pi-trash" severity="secondary" outlined size="small" @click="removeTestFiles" />
          </div>
          <small v-if="testMessage" class="test-message" :class="testMessageType">{{ testMessage }}</small>
        </div>
      </template>
    </Card>

    <!-- Scanning Progress -->
    <Card v-if="isScanning" class="scan-progress">
      <template #content>
        <div class="progress-visual">
          <div class="scanner-animation">
            <div class="scan-ring"></div>
            <i class="pi pi-shield"></i>
          </div>
          <div class="progress-info">
            <h3>{{ t.scan.scanning }} <span class="scan-timer">{{ formatTime(scanTime) }}</span></h3>
            <ProgressBar :value="scanProgress" :showValue="true" style="height: 12px" />
            <p class="current-action"><i class="pi pi-angle-right"></i> {{ currentAction }}</p>
            <p class="current-stage" v-if="currentStage">
              <Tag :value="currentStage" severity="info" />
            </p>
          </div>
        </div>
        <div class="scan-stats">
          <div class="scan-stat">
            <span class="stat-value">{{ scannedItems.processes }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Processes' : 'Prosesler' }}</span>
          </div>
          <div class="scan-stat">
            <span class="stat-value">{{ scannedItems.hooks }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Hooks' : 'Hooklar' }}</span>
          </div>
          <div class="scan-stat">
            <span class="stat-value">{{ scannedItems.files }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Files' : 'Faýllar' }}</span>
          </div>
          <div class="scan-stat">
            <span class="stat-value">{{ scannedItems.persistence }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Startup Items' : 'Başlangyç' }}</span>
          </div>
          <div class="scan-stat">
            <span class="stat-value">{{ scannedItems.network }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Connections' : 'Baglanyşyklar' }}</span>
          </div>
          <div class="scan-stat warning">
            <span class="stat-value">{{ threats.length }}</span>
            <span class="stat-label">{{ language === 'en' ? 'Threats' : 'Howplar' }}</span>
          </div>
        </div>
        <Button :label="language === 'en' ? 'Cancel Scan' : 'Skany Ýatyr'" icon="pi pi-times" severity="danger" @click="cancelScan" class="cancel-btn" />
      </template>
    </Card>

    <!-- Scan Results -->
    <Card v-if="scanComplete" class="scan-results">
      <template #content>
        <div class="results-header" :class="{ clean: threats.length === 0, infected: threats.length > 0 }">
          <div class="result-icon">
            <i :class="threats.length === 0 ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
          </div>
          <div class="result-info">
            <h2>{{ t.scan.scanComplete }}</h2>
            <p>{{ threats.length === 0 ? t.scan.results.clean : t.scan.results.infected }}</p>
            <small>{{ language === 'en' ? 'Scan completed in' : 'Skan tamamlandy' }} {{ formatTime(scanTime) }}</small>
          </div>
          <div class="result-stats">
            <span>{{ scannedItems.processes }} {{ language === 'en' ? 'processes' : 'proses' }}</span>
            <span>{{ scannedItems.files }} {{ language === 'en' ? 'files' : 'faýl' }}</span>
            <span>{{ scannedItems.hooks }} {{ language === 'en' ? 'hooks' : 'hook' }}</span>
            <span>{{ scannedItems.persistence }} {{ language === 'en' ? 'startup' : 'başlangyç' }}</span>
            <span>{{ threats.length }} {{ language === 'en' ? 'threats' : 'howp' }}</span>
          </div>
        </div>

        <!-- Medium Risk Items -->
        <div v-if="mediumRiskItems.length > 0" class="medium-risk-list">
          <h3><i class="pi pi-info-circle"></i> {{ language === 'en' ? 'Items to Review' : 'Barlamaly Elementler' }} ({{ mediumRiskItems.length }})</h3>
          <DataTable :value="mediumRiskItems" :paginator="mediumRiskItems.length > 5" :rows="5" stripedRows>
            <Column field="name" :header="language === 'en' ? 'Name' : 'Ady'">
              <template #body="{ data }">
                <div class="item-name">
                  <i class="pi pi-info-circle"></i>
                  <span>{{ data.name }}</span>
                </div>
              </template>
            </Column>
            <Column field="type" :header="language === 'en' ? 'Type' : 'Görnüşi'">
              <template #body="{ data }">
                <Tag :value="data.type" severity="warn" />
              </template>
            </Column>
            <Column field="reason" :header="language === 'en' ? 'Reason' : 'Sebäbi'" />
          </DataTable>
        </div>

        <!-- High Risk Threats -->
        <div v-if="threats.length > 0" class="threats-list">
          <h3><i class="pi pi-exclamation-triangle"></i> {{ language === 'en' ? 'Detected Threats' : 'Ýüze Çykarylan Howplar' }}</h3>
          <DataTable :value="threats" :paginator="threats.length > 5" :rows="5" stripedRows>
            <Column field="name" :header="t.scan.results.name">
              <template #body="{ data }">
                <div class="threat-name">
                  <i class="pi pi-file"></i>
                  <span>{{ data.name }}</span>
                </div>
              </template>
            </Column>
            <Column field="type" :header="t.scan.results.type">
              <template #body="{ data }">
                <Tag :value="data.type" severity="danger" />
              </template>
            </Column>
            <Column field="location" :header="t.scan.results.location" style="max-width: 250px">
              <template #body="{ data }">
                <code class="location-code">{{ data.location || data.path || 'N/A' }}</code>
              </template>
            </Column>
            <Column field="reason" :header="language === 'en' ? 'Reason' : 'Sebäbi'">
              <template #body="{ data }">
                <span class="reason-text">{{ data.reason }}</span>
              </template>
            </Column>
            <Column :header="language === 'en' ? 'Actions' : 'Hereketler'" style="width: 220px" v-if="isElectron">
              <template #body="{ data }">
                <div class="threat-actions" v-if="data.path && !data.removed">
                  <Button :label="language === 'en' ? 'Quarantine' : 'Karantin'" icon="pi pi-lock" severity="warn" size="small" @click="quarantineThreat(data)" :loading="data.removing" />
                  <Button :label="language === 'en' ? 'Delete' : 'Poz'" icon="pi pi-trash" severity="danger" size="small" @click="deleteThreat(data)" :loading="data.removing" />
                </div>
                <Tag v-else-if="data.removed" :value="data.removed === 'quarantined' ? (language === 'en' ? 'Quarantined' : 'Karantinde') : (language === 'en' ? 'Deleted' : 'Pozuldy')" :severity="data.removed === 'quarantined' ? 'warn' : 'success'" />
              </template>
            </Column>
          </DataTable>

          <div v-if="threats.some(t => t.path && !t.removed)" class="bulk-actions">
            <Button :label="language === 'en' ? 'Quarantine All Threats' : 'Ähli Howplary Karantinle'" icon="pi pi-lock" severity="warn" @click="quarantineAll" />
            <Button :label="language === 'en' ? 'Delete All Threats' : 'Ähli Howplary Poz'" icon="pi pi-trash" severity="danger" outlined @click="deleteAll" />
          </div>
        </div>

        <div v-else class="clean-result">
          <div class="clean-icon">
            <i class="pi pi-shield"></i>
          </div>
          <h3>{{ language === 'en' ? 'Your System is Clean!' : 'Ulgamyňyz Arassa!' }}</h3>
          <p>{{ language === 'en' ? 'No keyloggers or suspicious keyboard monitoring software detected.' : 'Keylogger ýa-da şübheli klawiatura gözegçilik programma üpjünçiligi tapylmady.' }}</p>
        </div>

        <div class="result-actions">
          <Button :label="language === 'en' ? 'Scan Again' : 'Täzeden Skanirle'" icon="pi pi-refresh" @click="resetScan" />
          <Button :label="language === 'en' ? 'View Details' : 'Jikme-jik Gör'" icon="pi pi-list" severity="secondary" outlined @click="showDetails = !showDetails" />
        </div>
      </template>
    </Card>

    <!-- Detailed Results -->
    <Card v-if="scanComplete && showDetails" class="detailed-results">
      <template #content>
        <h3><i class="pi pi-list"></i> {{ language === 'en' ? 'Detailed Scan Results' : 'Jikme-jik Skan Netijeleri' }}</h3>

        <Accordion>
          <AccordionPanel value="processes">
            <AccordionHeader>
              <i class="pi pi-cog"></i> {{ language === 'en' ? 'Processes' : 'Prosesler' }} ({{ scanResults.processes?.length || 0 }})
            </AccordionHeader>
            <AccordionContent>
              <DataTable :value="scanResults.processes" :paginator="true" :rows="10" size="small">
                <Column field="pid" header="PID" style="width: 80px" />
                <Column field="name" :header="language === 'en' ? 'Name' : 'Ady'" />
                <Column field="cpu" header="CPU%" style="width: 80px">
                  <template #body="{ data }">{{ data.cpu?.toFixed(1) }}%</template>
                </Column>
                <Column field="memory" :header="language === 'en' ? 'Memory' : 'Ýat'" style="width: 80px">
                  <template #body="{ data }">{{ typeof data.memory === 'number' ? data.memory.toFixed(1) : data.memory }}%</template>
                </Column>
                <Column field="risk.level" :header="language === 'en' ? 'Risk' : 'Howp'" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :value="data.risk?.level" :severity="getRiskSeverity(data.risk?.level)" />
                  </template>
                </Column>
              </DataTable>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="hooks">
            <AccordionHeader>
              <i class="pi pi-link"></i> {{ language === 'en' ? 'Keyboard Hooks' : 'Klawiatura Hooklary' }} ({{ scanResults.hooks?.length || 0 }})
            </AccordionHeader>
            <AccordionContent>
              <DataTable :value="scanResults.hooks" size="small">
                <Column field="type" :header="language === 'en' ? 'Type' : 'Görnüşi'" />
                <Column field="process" :header="language === 'en' ? 'Process' : 'Proses'" />
                <Column field="description" :header="language === 'en' ? 'Description' : 'Düşündiriş'" />
                <Column field="risk" :header="language === 'en' ? 'Risk' : 'Howp'" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :value="data.risk" :severity="getRiskSeverity(data.risk)" />
                  </template>
                </Column>
              </DataTable>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="files">
            <AccordionHeader>
              <i class="pi pi-folder"></i> {{ language === 'en' ? 'Scanned Files' : 'Skanerlenen Faýllar' }} ({{ language === 'en' ? (scannedItems.files + ' checked, ' + (scanResults.files?.length || 0) + ' suspicious') : (scannedItems.files + ' barlandy, ' + (scanResults.files?.length || 0) + ' şübheli') }})
            </AccordionHeader>
            <AccordionContent>
              <p v-if="!scanResults.files?.length" class="no-data">{{ language === 'en' ? 'No suspicious files found.' : 'Şübheli faýl tapylmady.' }}</p>
              <DataTable v-else :value="scanResults.files" :paginator="true" :rows="10" size="small">
                <Column field="name" :header="language === 'en' ? 'File Name' : 'Faýl Ady'" />
                <Column field="path" :header="language === 'en' ? 'Path' : 'Ýoly'" style="max-width: 300px">
                  <template #body="{ data }">
                    <code style="font-size: 0.85em; word-break: break-all;">{{ data.path }}</code>
                  </template>
                </Column>
                <Column field="reason" :header="language === 'en' ? 'Reason' : 'Sebäbi'" />
                <Column field="risk.level" :header="language === 'en' ? 'Risk' : 'Howp'" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :value="data.risk?.level" :severity="getRiskSeverity(data.risk?.level)" />
                  </template>
                </Column>
              </DataTable>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="persistence">
            <AccordionHeader>
              <i class="pi pi-power-off"></i> {{ language === 'en' ? 'Startup Items' : 'Başlangyç Elementleri' }} ({{ scanResults.persistence?.length || 0 }})
            </AccordionHeader>
            <AccordionContent>
              <DataTable :value="scanResults.persistence" size="small">
                <Column field="name" :header="language === 'en' ? 'Name' : 'Ady'" />
                <Column field="location" :header="language === 'en' ? 'Location' : 'Ýerleşýän Ýeri'" />
                <Column field="risk.level" :header="language === 'en' ? 'Risk' : 'Howp'" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :value="data.risk?.level" :severity="getRiskSeverity(data.risk?.level)" />
                  </template>
                </Column>
              </DataTable>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="network">
            <AccordionHeader>
              <i class="pi pi-globe"></i> {{ language === 'en' ? 'Network Connections' : 'Tor Baglanyşyklary' }} ({{ scanResults.network?.length || 0 }})
            </AccordionHeader>
            <AccordionContent>
              <DataTable :value="scanResults.network" :paginator="true" :rows="10" size="small">
                <Column field="protocol" header="Protocol" style="width: 80px" />
                <Column field="localAddress" :header="language === 'en' ? 'Local' : 'Ýerli'" />
                <Column field="foreignAddress" :header="language === 'en' ? 'Foreign' : 'Daşary'" />
                <Column field="state" :header="language === 'en' ? 'State' : 'Ýagdaý'" style="width: 120px" />
              </DataTable>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </template>
    </Card>

    <!-- System Info -->
    <Card v-if="isElectron && systemInfo" class="system-info">
      <template #content>
        <h3><i class="pi pi-desktop"></i> {{ language === 'en' ? 'System Information' : 'Ulgam Maglumatlary' }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ language === 'en' ? 'Platform' : 'Platforma' }}</span>
            <span class="info-value">{{ systemInfo.platformName }} {{ systemInfo.osVersion }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ language === 'en' ? 'Architecture' : 'Arhitektura' }}</span>
            <span class="info-value">{{ systemInfo.arch }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ language === 'en' ? 'Hostname' : 'Host Ady' }}</span>
            <span class="info-value">{{ systemInfo.hostname }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ language === 'en' ? 'CPU' : 'Prosessor' }}</span>
            <span class="info-value">{{ systemInfo.cpus }} cores</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ language === 'en' ? 'Memory' : 'Ýat' }}</span>
            <span class="info-value">{{ formatBytes(systemInfo.totalMemory) }} ({{ systemInfo.memoryUsagePercent }}% used)</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ language === 'en' ? 'Uptime' : 'Işlän Wagt' }}</span>
            <span class="info-value">{{ systemInfo.uptimeFormatted }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ language === 'en' ? 'User' : 'Ulanyjy' }}</span>
            <span class="info-value">{{ systemInfo.username }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  props: { t: Object, language: String },
  emits: ['start-scan', 'stop-scan'],
  setup(props, { emit }) {
    const scanType = ref('full')
    const isScanning = ref(false)
    const scanComplete = ref(false)
    const scanProgress = ref(0)
    const currentAction = ref('')
    const currentStage = ref('')
    const threats = ref([])
    const mediumRiskItems = ref([])
    const systemInfo = ref(null)
    const scanResults = ref({})
    const showDetails = ref(false)
    const scanTime = ref(0)
    let scanTimer = null
    const scannedItems = ref({ processes: 0, hooks: 0, persistence: 0, network: 0, files: 0 })

    const isElectron = computed(() => {
      return typeof window !== 'undefined' && window.electronAPI
    })

    const creatingTests = ref(false)
    const testMessage = ref('')
    const testMessageType = ref('')

    const scanAreas = ref({
      processes: true,
      registry: true,
      startup: true,
      hooks: true,
      files: false,
      network: true
    })

    const getAreaIcon = (key) => {
      const icons = {
        processes: 'pi pi-cog',
        registry: 'pi pi-database',
        startup: 'pi pi-power-off',
        hooks: 'pi pi-link',
        files: 'pi pi-folder',
        network: 'pi pi-globe'
      }
      return icons[key] || 'pi pi-circle'
    }

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
    }

    const formatBytes = (bytes) => {
      const gb = bytes / (1024 * 1024 * 1024)
      return `${gb.toFixed(1)} GB`
    }

    const startScan = async () => {
      isScanning.value = true
      scanComplete.value = false
      scanProgress.value = 0
      scanTime.value = 0
      threats.value = []
      mediumRiskItems.value = []
      scanResults.value = {}
      scannedItems.value = { processes: 0, hooks: 0, persistence: 0, network: 0, files: 0 }
      emit('start-scan')

      // Start timer
      scanTimer = setInterval(() => {
        scanTime.value++
      }, 1000)

      if (isElectron.value) {
        try {
          // Listen for progress updates
          window.electronAPI.onScanProgress((data) => {
            scanProgress.value = data.progress
            currentStage.value = data.stage
            updateCurrentAction(data.stage, data)
            if (data.filesScanned) {
              scannedItems.value.files = data.filesScanned
            }
            if (data.currentDir) {
              currentAction.value += ` (${data.currentDir.split('/').slice(-2).join('/')})`
            }
          })

          if (scanType.value === 'quick') {
            // Quick scan - only processes
            currentAction.value = props.language === 'en' ? 'Scanning running processes...' : 'Işleýän prosesleri skanirleýär...'
            const result = await window.electronAPI.getProcesses()
            if (result.success) {
              scanResults.value.processes = result.processes
              scannedItems.value.processes = result.processes.length

              // Find threats
              result.processes.filter(p => p.risk.level === 'high').forEach(p => {
                threats.value.push({
                  type: 'Suspicious Process',
                  name: p.name,
                  path: p.path,
                  reason: p.risk.reason,
                  details: p.risk.details,
                  removed: null,
                  removing: false
                })
              })

              // Find medium risk
              result.processes.filter(p => p.risk.level === 'medium').forEach(p => {
                mediumRiskItems.value.push({
                  type: 'Process',
                  name: p.name,
                  reason: p.risk.reason
                })
              })
            }
            scanProgress.value = 100
          } else {
            // Full scan
            currentAction.value = props.language === 'en' ? 'Running full system scan...' : 'Doly ulgam skanyny işledýär...'

            const result = await window.electronAPI.runFullScan()

            if (result.success) {
              scanResults.value = result.results
              scannedItems.value.processes = result.results.processes?.length || 0
              scannedItems.value.hooks = result.results.hooks?.length || 0
              scannedItems.value.persistence = result.results.persistence?.length || 0
              scannedItems.value.network = result.results.network?.length || 0
              scannedItems.value.files = result.summary?.filesScanned || scannedItems.value.files

              // Get all threats — add reactive fields for removal actions
              threats.value = (result.results.threats || []).map(t => ({
                ...t,
                removed: null,
                removing: false
              }))

              // Get medium risk items
              result.results.processes?.filter(p => p.risk.level === 'medium').forEach(p => {
                mediumRiskItems.value.push({ type: 'Process', name: p.name, reason: p.risk.reason })
              })
              result.results.hooks?.filter(h => h.risk === 'medium').forEach(h => {
                mediumRiskItems.value.push({ type: 'Hook', name: h.process, reason: h.description })
              })
              result.results.persistence?.filter(i => i.risk.level === 'medium').forEach(i => {
                mediumRiskItems.value.push({ type: 'Startup', name: i.name, reason: i.risk.reason })
              })
            }
          }

          window.electronAPI.removeScanProgressListener()
        } catch (error) {
          console.error('Scan error:', error)
          currentAction.value = `Error: ${error.message}`
        }
      } else {
        // Demo mode for web
        const stages = ['processes', 'hooks', 'files', 'persistence', 'network', 'complete']
        const stageWeights = [15, 15, 40, 15, 13, 2]
        let cumulativeProgress = 0
        for (let i = 0; i < stages.length; i++) {
          currentStage.value = stages[i]
          updateCurrentAction(stages[i], { filesScanned: scannedItems.value.files })

          const steps = Math.max(stageWeights[i], 5)
          for (let j = 0; j < steps; j++) {
            await new Promise(resolve => setTimeout(resolve, stages[i] === 'files' ? 200 : 120))
            scanProgress.value = Math.min(cumulativeProgress + Math.round((j / steps) * stageWeights[i]), 99)
            if (stages[i] === 'files') {
              scannedItems.value.files += Math.floor(Math.random() * 300) + 100
              updateCurrentAction('files', { filesScanned: scannedItems.value.files })
            }
          }
          cumulativeProgress += stageWeights[i]

          // Simulate data
          if (stages[i] === 'processes') scannedItems.value.processes = Math.floor(Math.random() * 150) + 100
          if (stages[i] === 'hooks') scannedItems.value.hooks = Math.floor(Math.random() * 10) + 2
          if (stages[i] === 'persistence') scannedItems.value.persistence = Math.floor(Math.random() * 30) + 10
          if (stages[i] === 'network') scannedItems.value.network = Math.floor(Math.random() * 50) + 20
        }
        scanProgress.value = 100
      }

      // Stop timer and complete
      clearInterval(scanTimer)
      isScanning.value = false
      scanComplete.value = true
      emit('stop-scan')
    }

    const updateCurrentAction = (stage, data) => {
      const actions = props.language === 'en' ? {
        'processes': 'Scanning running processes...',
        'hooks': 'Checking keyboard hooks and accessibility permissions...',
        'files': `Scanning file system for keyloggers... ${data?.filesScanned ? '(' + data.filesScanned + ' files checked)' : ''}`,
        'persistence': 'Analyzing startup items and persistence mechanisms...',
        'network': 'Scanning network connections...',
        'complete': 'Finalizing scan results...'
      } : {
        'processes': 'Işleýän prosesleri skanirleýär...',
        'hooks': 'Klawiatura hooklaryny we rugsat berişleri barlaýar...',
        'files': `Faýl ulgamynda keyloggerleri gözleýär... ${data?.filesScanned ? '(' + data.filesScanned + ' faýl barlandy)' : ''}`,
        'persistence': 'Başlangyç elementlerini we durnuklylyk mehanizmlerini seljeriýär...',
        'network': 'Tor baglanyşyklaryny skanirleýär...',
        'complete': 'Skan netijelerini tamamlaýar...'
      }
      currentAction.value = actions[stage] || ''
    }

    // Test keylogger files
    const createTestFiles = async () => {
      if (!isElectron.value) return
      creatingTests.value = true
      testMessage.value = ''
      try {
        const result = await window.electronAPI.createTestKeyloggers()
        if (result.success) {
          testMessage.value = props.language === 'en'
            ? `${result.count} test files created in ${result.directory}`
            : `${result.count} synag faýly döredildi: ${result.directory}`
          testMessageType.value = 'success'
        } else {
          testMessage.value = result.error
          testMessageType.value = 'error'
        }
      } catch (e) {
        testMessage.value = e.message
        testMessageType.value = 'error'
      }
      creatingTests.value = false
    }

    const removeTestFiles = async () => {
      if (!isElectron.value) return
      try {
        const result = await window.electronAPI.removeTestKeyloggers()
        if (result.success) {
          testMessage.value = props.language === 'en' ? 'Test files removed' : 'Synag faýllary pozuldy'
          testMessageType.value = 'success'
        }
      } catch (e) {
        testMessage.value = e.message
        testMessageType.value = 'error'
      }
    }

    // Threat removal — update by index to ensure Vue reactivity
    const findThreatIndex = (threat) => {
      return threats.value.findIndex(t => t.path === threat.path && t.name === threat.name)
    }

    const quarantineThreat = async (threat) => {
      if (!isElectron.value || !threat.path) return
      const idx = findThreatIndex(threat)
      if (idx === -1) return
      threats.value[idx] = { ...threats.value[idx], removing: true }
      try {
        const result = await window.electronAPI.removeThreat(threat.path)
        if (result.success) {
          threats.value[idx] = { ...threats.value[idx], removed: 'quarantined', removing: false }
        } else {
          threats.value[idx] = { ...threats.value[idx], removing: false }
        }
      } catch (e) {
        console.error('Quarantine failed:', e)
        threats.value[idx] = { ...threats.value[idx], removing: false }
      }
    }

    const deleteThreat = async (threat) => {
      if (!isElectron.value || !threat.path) return
      const idx = findThreatIndex(threat)
      if (idx === -1) return
      threats.value[idx] = { ...threats.value[idx], removing: true }
      try {
        const result = await window.electronAPI.deleteThreat(threat.path)
        if (result.success) {
          threats.value[idx] = { ...threats.value[idx], removed: 'deleted', removing: false }
        } else {
          threats.value[idx] = { ...threats.value[idx], removing: false }
        }
      } catch (e) {
        console.error('Delete failed:', e)
        threats.value[idx] = { ...threats.value[idx], removing: false }
      }
    }

    const quarantineAll = async () => {
      for (let i = 0; i < threats.value.length; i++) {
        if (threats.value[i].path && !threats.value[i].removed) {
          await quarantineThreat(threats.value[i])
        }
      }
    }

    const deleteAll = async () => {
      for (let i = 0; i < threats.value.length; i++) {
        if (threats.value[i].path && !threats.value[i].removed) {
          await deleteThreat(threats.value[i])
        }
      }
    }

    const cancelScan = () => {
      clearInterval(scanTimer)
      isScanning.value = false
      emit('stop-scan')
      if (isElectron.value) {
        window.electronAPI.removeScanProgressListener()
      }
    }

    const resetScan = () => {
      scanComplete.value = false
      showDetails.value = false
      threats.value = []
      mediumRiskItems.value = []
      scanResults.value = {}
      scannedItems.value = { processes: 0, hooks: 0, persistence: 0, network: 0, files: 0 }
    }

    const getRiskSeverity = (risk) => {
      const severities = { 'high': 'danger', 'critical': 'danger', 'medium': 'warn', 'low': 'info', 'safe': 'success' }
      return severities[risk?.toLowerCase()] || 'secondary'
    }

    onMounted(async () => {
      if (isElectron.value) {
        try {
          systemInfo.value = await window.electronAPI.getSystemInfo()
        } catch (error) {
          console.error('Failed to get system info:', error)
        }
      }
    })

    onUnmounted(() => {
      if (scanTimer) clearInterval(scanTimer)
    })

    return {
      scanType, isScanning, scanComplete, scanProgress, currentAction, currentStage,
      threats, mediumRiskItems, scanAreas, systemInfo, scannedItems, isElectron,
      scanResults, showDetails, scanTime, creatingTests, testMessage, testMessageType,
      startScan, cancelScan, resetScan, getRiskSeverity, getAreaIcon,
      formatTime, formatBytes,
      createTestFiles, removeTestFiles, quarantineThreat, deleteThreat,
      quarantineAll, deleteAll
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

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

/* Scan Types */
.scan-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.scan-type {
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.scan-type:hover {
  border-color: var(--guard-primary);
  transform: translateY(-2px);
}

.scan-type.active {
  border-color: var(--guard-primary);
  background: rgba(239, 68, 68, 0.05);
}

.scan-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.scan-icon i {
  font-size: 1.5rem;
  color: white;
}

.scan-icon.quick { background: linear-gradient(135deg, #f59e0b, #d97706); }
.scan-icon.full { background: linear-gradient(135deg, #ef4444, #dc2626); }
.scan-icon.custom { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.scan-type h3 {
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.scan-type p {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* Scan Areas */
.scan-areas {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: 10px;
}

.scan-areas h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.area-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.area-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.area-item:hover {
  border-color: var(--guard-primary);
}

.area-item.active {
  border-color: var(--guard-primary);
  background: rgba(239, 68, 68, 0.05);
}

.area-item i:first-child {
  font-size: 1.1rem;
  color: var(--guard-primary);
}

.area-item span {
  flex: 1;
  font-size: 0.9rem;
}

.check-icon {
  color: var(--text-secondary);
}

.area-item.active .check-icon {
  color: var(--guard-success);
}

.start-btn, .cancel-btn {
  width: 100%;
  padding: 0.85rem !important;
  font-size: 1rem !important;
}

.start-btn {
  background: var(--guard-gradient) !important;
  border: none !important;
}

.cancel-btn {
  margin-top: 1rem;
}

/* Scan Progress */
.scan-progress {
  margin-bottom: 1.5rem;
}

.progress-visual {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.scanner-animation {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.scan-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: var(--guard-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.scanner-animation > i {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--guard-primary);
}

.progress-info {
  flex: 1;
}

.progress-info h3 {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.scan-timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--guard-primary);
}

.current-action {
  margin-top: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.current-stage {
  margin-top: 0.5rem;
}

.scan-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.scan-stat {
  text-align: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.scan-stat .stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--guard-primary);
}

.scan-stat.warning .stat-value {
  color: var(--guard-warning);
}

.scan-stat .stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Results */
.results-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.results-header.clean {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.results-header.infected {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.result-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-header.clean .result-icon {
  background: rgba(34, 197, 94, 0.2);
}

.results-header.infected .result-icon {
  background: rgba(239, 68, 68, 0.2);
}

.result-icon i {
  font-size: 1.75rem;
}

.results-header.clean .result-icon i { color: #22c55e; }
.results-header.infected .result-icon i { color: #ef4444; }

.result-info {
  flex: 1;
}

.result-info h2 {
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
}

.result-info p {
  color: var(--text-secondary);
}

.result-info small {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.result-stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.result-stats span {
  padding: 0.35rem 0.75rem;
  background: var(--bg-primary);
  border-radius: 15px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.result-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Medium Risk */
.medium-risk-list {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 10px;
}

.medium-risk-list h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #f59e0b;
  font-size: 1rem;
}

.item-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-name i {
  color: #f59e0b;
}

/* Threats List */
.threats-list {
  margin-bottom: 1.5rem;
}

.threats-list h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--guard-danger);
}

.threat-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.threat-name i {
  color: var(--guard-danger);
}

.location-code {
  display: block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-primary);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

.reason-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Clean Result */
.clean-result {
  text-align: center;
  padding: 3rem 2rem;
}

.clean-icon {
  width: 100px;
  height: 100px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.clean-icon i {
  font-size: 3rem;
  color: #22c55e;
}

.clean-result h3 {
  color: #22c55e;
  margin-bottom: 0.5rem;
}

.clean-result p {
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0 auto;
}

/* Detailed Results */
.detailed-results {
  margin-top: 1.5rem;
}

.detailed-results h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* System Info */
.system-info {
  margin-top: 1.5rem;
}

.system-info h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.system-info h3 i {
  color: var(--guard-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.info-item {
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.info-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .scan-types {
    grid-template-columns: 1fr;
  }

  .area-grid {
    grid-template-columns: 1fr;
  }

  .scan-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .progress-visual {
    flex-direction: column;
    text-align: center;
  }

  .results-header {
    flex-direction: column;
    text-align: center;
  }

  .result-stats {
    justify-content: center;
  }

  .result-actions {
    flex-direction: column;
  }

  .result-actions :deep(.p-button) {
    width: 100%;
  }

  .scan-type {
    padding: 1rem;
  }

  .scanner-animation {
    width: 60px;
    height: 60px;
  }

  .scanner-animation > i {
    font-size: 1.5rem;
  }

  .progress-info h3 {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;
  }

  .clean-result {
    padding: 2rem 1rem;
  }

  .clean-icon {
    width: 70px;
    height: 70px;
  }

  .clean-icon i {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .scan-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .scan-stat {
    padding: 0.75rem 0.5rem;
  }

  .scan-stat .stat-value {
    font-size: 1.25rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .result-icon {
    width: 50px;
    height: 50px;
  }

  .result-icon i {
    font-size: 1.5rem;
  }

  .result-info h2 {
    font-size: 1.1rem;
  }

  .results-header {
    padding: 1rem;
  }

  .location-code {
    max-width: 140px;
    font-size: 0.7rem;
  }
}

/* Test Section */
.test-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.test-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.test-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.test-message {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.test-message.success {
  color: var(--green-400);
}

.test-message.error {
  color: var(--red-400);
}

/* Threat Actions */
.threat-actions {
  display: flex;
  gap: 0.5rem;
}

.bulk-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.no-data {
  text-align: center;
  color: var(--text-secondary);
  padding: 1rem;
}
</style>
