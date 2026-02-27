<template>
  <div class="history-view">
    <div class="page-header">
      <h1>{{ t.history.title }}</h1>
      <p>{{ t.history.subtitle }}</p>
    </div>

    <Card>
      <template #content>
        <div class="history-actions" v-if="history.length">
          <Button :label="t.history.clearHistory" icon="pi pi-trash" severity="danger" outlined @click="clearHistory" />
        </div>

        <DataTable v-if="history.length" :value="history" stripedRows :paginator="history.length > 10" :rows="10">
          <Column :header="t.history.columns.file" sortable sortField="fileName">
            <template #body="{ data }">
              <div class="file-info">
                <i :class="getFileIcon(data.fileType?.type)"></i>
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
                <Button icon="pi pi-folder" v-tooltip="'Open location'" size="small" text @click="openLocation(data.filePath)" />
                <Button icon="pi pi-copy" v-tooltip="'Copy hash'" size="small" text @click="copyHash(data.hashes?.sha256)" />
              </div>
            </template>
          </Column>
        </DataTable>

        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>{{ t.history.empty }}</p>
          <Button label="Start Scanning" icon="pi pi-search" @click="$router.push('/scan')" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

export default {
  props: { t: Object, language: String },
  setup(props) {
    const toast = useToast()
    const history = ref([])
    const isElectron = window.electronAPI !== undefined

    onMounted(async () => {
      if (isElectron) {
        history.value = await window.electronAPI.getHistory()
      }
    })

    const clearHistory = async () => {
      if (isElectron) {
        await window.electronAPI.clearHistory()
        history.value = []
        toast.add({ severity: 'success', summary: props.language === 'en' ? 'Cleared' : 'Arassalandy', detail: props.language === 'en' ? 'History cleared' : 'Taryh arassalandy', life: 3000 })
      }
    }

    const openLocation = (filePath) => {
      if (isElectron && filePath) {
        window.electronAPI.openFileLocation(filePath)
      }
    }

    const copyHash = (hash) => {
      if (hash) {
        navigator.clipboard.writeText(hash)
        toast.add({ severity: 'success', summary: 'Copied!', life: 2000 })
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

    const getFileIcon = (fileType) => {
      const icons = {
        'PE Executable': 'pi pi-desktop',
        'ZIP Archive': 'pi pi-box',
        'PDF Document': 'pi pi-file-pdf',
        'MS Office': 'pi pi-file',
        'PNG Image': 'pi pi-image',
        'JPEG Image': 'pi pi-image'
      }
      return icons[fileType] || 'pi pi-file'
    }

    return {
      history, clearHistory, openLocation, copyHash, formatDate,
      getStatusSeverity, getScoreClass, getFileIcon
    }
  }
}
</script>

<style scoped>
.history-view { max-width: 1200px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.history-actions { display: flex; justify-content: flex-end; margin-bottom: 1rem; }

.file-info { display: flex; align-items: center; gap: 0.75rem; }
.file-info i { font-size: 1.5rem; color: var(--text-secondary); }
.file-name { display: block; font-weight: 500; }
.file-info small { color: var(--text-secondary); font-size: 0.8rem; }

.threat-score { font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 20px; }
.threat-score.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.threat-score.info { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.threat-score.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.threat-score.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.date { color: var(--text-secondary); font-size: 0.9rem; }

.actions { display: flex; gap: 0.25rem; }

.empty-state { text-align: center; padding: 4rem 2rem; }
.empty-state i { font-size: 5rem; color: var(--text-secondary); opacity: 0.3; margin-bottom: 1rem; }
.empty-state p { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; }
</style>
