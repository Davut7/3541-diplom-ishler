<template>
  <div class="history-view">
    <div class="page-header">
      <h1>{{ t.history.title }}</h1>
      <p>{{ t.history.subtitle }}</p>
    </div>
    <Card>
      <template #content>
        <DataTable v-if="history.length" :value="history" stripedRows>
          <Column field="fileName" :header="t.history.columns.file"></Column>
          <Column field="status" :header="t.history.columns.status">
            <template #body="{ data }">
              <Tag :severity="getStatusSeverity(data.status)" :value="data.status" />
            </template>
          </Column>
          <Column field="date" :header="t.history.columns.date"></Column>
        </DataTable>
        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>{{ t.history.empty }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  props: { t: Object, language: String },
  setup() {
    const history = ref([
      { fileName: 'sample.exe', status: 'Malware', date: '2024-01-15' },
      { fileName: 'document.pdf', status: 'Clean', date: '2024-01-14' },
      { fileName: 'installer.msi', status: 'Suspicious', date: '2024-01-13' }
    ])
    const getStatusSeverity = (status) => ({ Clean: 'success', Suspicious: 'warn', Malware: 'danger' }[status] || 'info')
    return { history, getStatusSeverity }
  }
}
</script>

<style scoped>
.history-view { max-width: 1000px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; }
.empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
.empty-state i { font-size: 4rem; opacity: 0.5; margin-bottom: 1rem; }
</style>
