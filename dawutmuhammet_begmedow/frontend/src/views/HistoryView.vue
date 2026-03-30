<template>
  <div class="history-view">
    <div class="page-header">
      <h1><i class="pi pi-history"></i> {{ t.history.title }}</h1>
      <p>{{ t.history.subtitle }}</p>
    </div>

    <Card class="history-card">
      <template #content>
        <div class="history-toolbar" v-if="history.length">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <input v-model="searchQuery" :placeholder="language === 'en' ? 'Search scans...' : 'Gozleg...'" />
          </div>
          <Button :label="t.history.clearHistory" icon="pi pi-trash" severity="danger" outlined @click="clearHistory" />
        </div>

        <DataTable v-if="history.length" :value="filteredHistory" stripedRows :paginator="filteredHistory.length > 10" :rows="10" :loading="loading">
          <Column :header="t.history.columns.file" sortable sortField="fileName">
            <template #body="{ data }">
              <div class="file-info">
                <i :class="getFileIcon(data.fileType?.type)" class="file-icon"></i>
                <div>
                  <span class="file-name">{{ data.fileName }}</span>
                  <small>{{ data.fileSizeFormatted }}</small>
                </div>
              </div>
            </template>
          </Column>
          <Column field="status" :header="t.history.columns.status" sortable>
            <template #body="{ data }">
              <Tag :severity="getStatusSeverity(data.status)" :value="t.scan?.status?.[data.status] || data.status" />
            </template>
          </Column>
          <Column :header="t.history.columns.threat" sortable sortField="threatScore">
            <template #body="{ data }">
              <span :class="['threat-score', getScoreClass(data.threatScore)]">{{ data.threatScore }}%</span>
            </template>
          </Column>
          <Column :header="t.history.columns.date" sortable sortField="scannedAt">
            <template #body="{ data }">
              <span class="date">{{ formatDate(data.scannedAt) }}</span>
            </template>
          </Column>
          <Column :header="t.history.columns.actions">
            <template #body="{ data }">
              <div class="actions">
                <Button icon="pi pi-eye" v-tooltip="language === 'en' ? 'View Details' : 'Jikme-jiklik'" size="small" text @click="viewDetails(data)" />
                <Button icon="pi pi-copy" v-tooltip="language === 'en' ? 'Copy SHA256' : 'SHA256 kopyala'" size="small" text @click="copyHash(data.hashes?.sha256)" />
                <Button icon="pi pi-trash" v-tooltip="language === 'en' ? 'Delete' : 'Poz'" size="small" text severity="danger" @click="deleteScan(data.id)" />
              </div>
            </template>
          </Column>
        </DataTable>

        <div v-else-if="!loading" class="empty-state">
          <div class="empty-icon">☣</div>
          <p>{{ t.history.empty }}</p>
          <Button :label="language === 'en' ? 'Start Scanning' : 'Skanirlemage basla'" icon="pi pi-search" @click="$router.push('/scan')" />
        </div>
      </template>
    </Card>

    <!-- Details Dialog -->
    <Dialog v-model:visible="detailsVisible" :header="selectedScan?.fileName || 'Details'" modal :style="{ width: '700px' }">
      <div v-if="selectedScan" class="scan-details">
        <div class="detail-header">
          <Tag :severity="getStatusSeverity(selectedScan.status)" :value="t.scan?.status?.[selectedScan.status] || selectedScan.status" class="status-tag" />
          <span :class="['threat-badge', getScoreClass(selectedScan.threatScore)]">{{ selectedScan.threatScore }}%</span>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <label>{{ t.scan.results.fileName }}</label>
            <span>{{ selectedScan.fileName }}</span>
          </div>
          <div class="detail-item">
            <label>{{ t.scan.results.fileSize }}</label>
            <span>{{ selectedScan.fileSizeFormatted }}</span>
          </div>
          <div class="detail-item">
            <label>{{ t.scan.results.fileType }}</label>
            <span>{{ selectedScan.fileType?.type || 'Unknown' }}</span>
          </div>
          <div class="detail-item">
            <label>{{ t.scan.results.entropy }}</label>
            <span>{{ selectedScan.entropy?.entropy?.toFixed(2) }} - {{ selectedScan.entropy?.interpretation }}</span>
          </div>
        </div>

        <div class="hashes-section">
          <h4><i class="pi pi-key"></i> {{ t.scan.results.hashes }}</h4>
          <div class="hash-item" v-for="(hash, type) in selectedScan.hashes" :key="type">
            <label>{{ type.toUpperCase() }}</label>
            <code @click="copyHash(hash)">{{ hash }}</code>
          </div>
        </div>

        <div v-if="selectedScan.patterns?.length" class="patterns-section">
          <h4><i class="pi pi-exclamation-triangle"></i> {{ t.scan.results.suspiciousPatterns }}</h4>
          <div class="pattern-list">
            <div v-for="(pattern, i) in selectedScan.patterns" :key="i" class="pattern-tag">
              <Tag :severity="getSeverityColor(pattern.severity)" :value="pattern.severity" size="small" />
              <span>{{ pattern.name }}</span>
              <span class="count">({{ pattern.count }}x)</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const API_URL = '/api'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const toast = useToast()
    const history = ref([])
    const loading = ref(true)
    const searchQuery = ref('')
    const detailsVisible = ref(false)
    const selectedScan = ref(null)

    onMounted(async () => {
      await loadHistory()
    })

    const loadHistory = async () => {
      loading.value = true
      try {
        const response = await axios.get(`${API_URL}/history`)
        history.value = response.data
      } catch (error) {
        console.error('Error loading history:', error)
      }
      loading.value = false
    }

    const filteredHistory = computed(() => {
      if (!searchQuery.value) return history.value
      const query = searchQuery.value.toLowerCase()
      return history.value.filter(s =>
        s.fileName?.toLowerCase().includes(query) ||
        s.status?.toLowerCase().includes(query) ||
        s.fileType?.type?.toLowerCase().includes(query)
      )
    })

    const clearHistory = async () => {
      if (!confirm(props.language === 'en' ? 'Are you sure you want to clear all history?' : 'Ahli taryhy pozmak isleyanizmi?')) {
        return
      }
      try {
        await axios.delete(`${API_URL}/history`)
        history.value = []
        toast.add({ severity: 'success', summary: props.language === 'en' ? 'Cleared' : 'Arassalandy', detail: props.language === 'en' ? 'History cleared' : 'Taryh arassalandy', life: 3000 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to clear history', life: 3000 })
      }
    }

    const deleteScan = async (id) => {
      try {
        await axios.delete(`${API_URL}/history/${id}`)
        history.value = history.value.filter(s => s.id !== id)
        toast.add({ severity: 'success', summary: props.language === 'en' ? 'Deleted' : 'Pozuldy', life: 2000 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete scan', life: 3000 })
      }
    }

    const viewDetails = (scan) => {
      selectedScan.value = scan
      detailsVisible.value = true
    }

    const copyHash = (hash) => {
      if (hash) {
        navigator.clipboard.writeText(hash)
        toast.add({ severity: 'success', summary: props.language === 'en' ? 'Copied!' : 'Kopiyalandi!', life: 2000 })
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

    const getSeverityColor = (severity) => ({
      critical: 'danger',
      high: 'warn',
      medium: 'info',
      low: 'secondary'
    }[severity] || 'info')

    const getFileIcon = (fileType) => {
      const icons = {
        'PE Executable': 'pi pi-desktop',
        'DLL Library': 'pi pi-box',
        'ZIP Archive': 'pi pi-box',
        'PDF Document': 'pi pi-file-pdf',
        'MS Word': 'pi pi-file-word',
        'PNG Image': 'pi pi-image',
        'JPEG Image': 'pi pi-image',
        'PowerShell': 'pi pi-code'
      }
      return icons[fileType] || 'pi pi-file'
    }

    return {
      history, loading, searchQuery, filteredHistory, detailsVisible, selectedScan,
      loadHistory, clearHistory, deleteScan, viewDetails, copyHash,
      formatDate, getStatusSeverity, getScoreClass, getSeverityColor, getFileIcon
    }
  }
}
</script>

<style scoped>
.history-view { max-width: 1200px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; font-family: 'Orbitron', sans-serif; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.page-header h1 i { color: var(--primary-color); }
.page-header p { color: var(--text-secondary); }

.history-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
.search-box { display: flex; align-items: center; gap: 0.5rem; background: var(--bg-secondary); padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); flex: 1; max-width: 400px; }
.search-box i { color: var(--text-secondary); }
.search-box input { border: none; background: transparent; color: var(--text-primary); flex: 1; outline: none; font-size: 0.9rem; }

.file-info { display: flex; align-items: center; gap: 0.75rem; }
.file-icon { font-size: 1.5rem; color: var(--primary-color); }
.file-name { display: block; font-weight: 500; }
.file-info small { color: var(--text-secondary); font-size: 0.8rem; }

.threat-score { font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.9rem; }
.threat-score.success { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.threat-score.info { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
.threat-score.warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.threat-score.danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

.date { color: var(--text-secondary); font-size: 0.85rem; }
.actions { display: flex; gap: 0.25rem; }

.empty-state { text-align: center; padding: 4rem 2rem; }
.empty-icon { font-size: 5rem; color: var(--primary-color); margin-bottom: 1rem; animation: pulse 2s ease-in-out infinite; }
.empty-state p { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

/* Details Dialog */
.scan-details { padding: 1rem 0; }
.detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
.status-tag { font-size: 1rem; padding: 0.5rem 1rem; }
.threat-badge { font-size: 1.5rem; font-weight: 700; font-family: 'Orbitron', sans-serif; }
.threat-badge.success { color: #10b981; }
.threat-badge.info { color: #6366f1; }
.threat-badge.warning { color: #f59e0b; }
.threat-badge.danger { color: #ef4444; }

.detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.detail-item { background: var(--bg-secondary); padding: 1rem; border-radius: 8px; }
.detail-item label { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem; }

.hashes-section, .patterns-section { margin-bottom: 1.5rem; }
.hashes-section h4, .patterns-section h4 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.hashes-section h4 i { color: #6366f1; }
.patterns-section h4 i { color: #f59e0b; }

.hash-item { display: flex; align-items: center; gap: 0.75rem; background: var(--bg-secondary); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; }
.hash-item label { font-weight: 600; min-width: 60px; font-size: 0.85rem; }
.hash-item code { flex: 1; font-size: 0.7rem; word-break: break-all; cursor: pointer; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px; }
.hash-item code:hover { background: var(--primary-color); color: white; }

.pattern-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pattern-tag { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.75rem; background: var(--bg-secondary); border-radius: 6px; font-size: 0.85rem; }
.pattern-tag .count { color: var(--text-secondary); font-size: 0.75rem; }

@media (max-width: 768px) {
  .history-toolbar { flex-direction: column; align-items: stretch; }
  .search-box { max-width: none; }
  .detail-grid { grid-template-columns: 1fr; }
  .history-card :deep(.p-datatable) { overflow-x: auto; }
  .history-card :deep(.p-datatable-table) { min-width: 600px; }
  .page-header h1 { font-size: 1.3rem; }
  .hash-item { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .hash-item code { width: 100%; font-size: 0.65rem; }
}

@media (max-width: 480px) {
  .page-header h1 { font-size: 1.1rem; }
  .page-header p { font-size: 0.85rem; }
  .empty-icon { font-size: 3rem; }
  .empty-state { padding: 2rem 1rem; }
  .empty-state p { font-size: 0.95rem; }
}

:deep(.p-dialog) {
  max-width: 95vw !important;
}
</style>
