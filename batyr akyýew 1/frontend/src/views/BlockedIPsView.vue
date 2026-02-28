<template>
  <div class="blocked-ips-view">
    <div class="page-header">
      <div class="header-content">
        <h1><i class="pi pi-ban"></i> {{ t.blockedIPs?.title || 'Blocked IP Addresses' }}</h1>
        <p>{{ t.blockedIPs?.subtitle || 'Manage blocked IP addresses and view block statistics' }}</p>
      </div>
      <Button :label="t.blockedIPs?.addIP || 'Block New IP'" icon="pi pi-plus" @click="showAddDialog = true" />
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-ban stat-icon blocked"></i>
            <div class="stat-info">
              <span class="stat-value">{{ blockedIPs.length }}</span>
              <span class="stat-label">{{ t.blockedIPs?.totalBlocked || 'Total Blocked' }}</span>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-shield stat-icon protected"></i>
            <div class="stat-info">
              <span class="stat-value">{{ totalBlockCount }}</span>
              <span class="stat-label">{{ t.blockedIPs?.totalBlocks || 'Total Block Events' }}</span>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-globe stat-icon geo"></i>
            <div class="stat-info">
              <span class="stat-value">{{ uniqueCountries }}</span>
              <span class="stat-label">{{ t.blockedIPs?.countries || 'Countries' }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Blocked IPs Table -->
    <Card class="table-card">
      <template #content>
        <DataTable :value="blockedIPs" paginator :rows="10" :loading="loading"
                   stripedRows responsiveLayout="scroll"
                   :globalFilterFields="['ip_address', 'reason']">
          <template #empty>
            <div class="empty-state">
              <i class="pi pi-check-circle"></i>
              <p>{{ t.blockedIPs?.noBlocked || 'No blocked IP addresses' }}</p>
            </div>
          </template>
          <Column field="ip_address" :header="t.blockedIPs?.ipAddress || 'IP Address'" sortable>
            <template #body="{ data }">
              <div class="ip-cell">
                <i class="pi pi-desktop"></i>
                <code>{{ data.ip_address }}</code>
              </div>
            </template>
          </Column>
          <Column field="reason" :header="t.blockedIPs?.reason || 'Reason'" sortable>
            <template #body="{ data }">
              <span class="reason-text">{{ data.reason || 'Manual block' }}</span>
            </template>
          </Column>
          <Column field="block_count" :header="t.blockedIPs?.blockCount || 'Block Count'" sortable>
            <template #body="{ data }">
              <Tag :value="data.block_count || 1" severity="danger" />
            </template>
          </Column>
          <Column field="blocked_at" :header="t.blockedIPs?.blockedAt || 'Blocked At'" sortable>
            <template #body="{ data }">
              <span class="date-text">{{ formatDate(data.blocked_at) }}</span>
            </template>
          </Column>
          <Column :header="t.blockedIPs?.geolocation || 'Geolocation'">
            <template #body="{ data }">
              <Button icon="pi pi-map-marker" text rounded @click="lookupGeo(data.ip_address)"
                      v-tooltip="'Lookup location'" />
              <span v-if="geoData[data.ip_address]" class="geo-info">
                {{ geoData[data.ip_address].country }} - {{ geoData[data.ip_address].city }}
              </span>
            </template>
          </Column>
          <Column :header="t.blockedIPs?.actions || 'Actions'">
            <template #body="{ data }">
              <Button icon="pi pi-trash" severity="danger" text rounded
                      @click="unblockIP(data.ip_address)" v-tooltip="'Unblock IP'" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Add IP Dialog -->
    <div v-if="showAddDialog" class="dialog-overlay" @click.self="showAddDialog = false">
      <Card class="add-dialog">
        <template #title>
          <div class="dialog-title">
            <i class="pi pi-plus-circle"></i>
            <span>{{ t.blockedIPs?.addNewIP || 'Block New IP Address' }}</span>
          </div>
        </template>
        <template #content>
          <div class="form-group">
            <label>{{ t.blockedIPs?.ipAddress || 'IP Address' }}</label>
            <InputText v-model="newIP.ip" placeholder="192.168.1.100" />
          </div>
          <div class="form-group">
            <label>{{ t.blockedIPs?.reason || 'Reason' }}</label>
            <InputText v-model="newIP.reason" placeholder="Malicious activity detected" />
          </div>
          <div class="dialog-actions">
            <Button label="Cancel" severity="secondary" outlined @click="showAddDialog = false" />
            <Button :label="t.blockedIPs?.blockIP || 'Block IP'" icon="pi pi-ban" @click="blockIP" :loading="blocking" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'BlockedIPsView',
  props: ['t', 'language'],
  setup() {
    const blockedIPs = ref([])
    const loading = ref(true)
    const showAddDialog = ref(false)
    const blocking = ref(false)
    const geoData = ref({})
    const newIP = ref({ ip: '', reason: '' })

    const totalBlockCount = computed(() => {
      return blockedIPs.value.reduce((sum, ip) => sum + (ip.block_count || 1), 0)
    })

    const uniqueCountries = computed(() => {
      const countries = new Set()
      Object.values(geoData.value).forEach(geo => {
        if (geo.country && geo.country !== 'Unknown') countries.add(geo.country)
      })
      return countries.size || '-'
    })

    const fetchBlockedIPs = async () => {
      loading.value = true
      try {
        const res = await fetch('/api/blocked-ips')
        const data = await res.json()
        blockedIPs.value = data.blockedIPs || []
      } catch (error) {
        console.error('Failed to fetch blocked IPs:', error)
      }
      loading.value = false
    }

    const blockIP = async () => {
      if (!newIP.value.ip) {
        alert('Please enter an IP address')
        return
      }
      blocking.value = true
      try {
        const res = await fetch('/api/blocked-ips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newIP.value)
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to block IP')
        }
        showAddDialog.value = false
        newIP.value = { ip: '', reason: '' }
        await fetchBlockedIPs()
      } catch (error) {
        alert(error.message || 'Failed to block IP')
      }
      blocking.value = false
    }

    const unblockIP = async (ip) => {
      if (confirm(`Are you sure you want to unblock ${ip}?`)) {
        try {
          await fetch(`/api/blocked-ips/${ip}`, { method: 'DELETE' })
          await fetchBlockedIPs()
        } catch (error) {
          alert('Failed to unblock IP')
        }
      }
    }

    const lookupGeo = async (ip) => {
      try {
        const res = await fetch(`/api/geolocation/${ip}`)
        const data = await res.json()
        geoData.value[ip] = data.geolocation
      } catch (error) {
        console.error('Geolocation lookup failed:', error)
      }
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      fetchBlockedIPs()
    })

    return {
      blockedIPs,
      loading,
      showAddDialog,
      blocking,
      newIP,
      geoData,
      totalBlockCount,
      uniqueCountries,
      fetchBlockedIPs,
      blockIP,
      unblockIP,
      lookupGeo,
      formatDate
    }
  }
}
</script>

<style scoped>
.blocked-ips-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.header-content h1 i {
  color: #ef4444;
}

.header-content p {
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  padding: 1rem;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-icon.blocked {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #ef4444;
}

.stat-icon.protected {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #22c55e;
}

.stat-icon.geo {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #3b82f6;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.table-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.ip-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ip-cell i {
  color: var(--text-secondary);
}

.ip-cell code {
  font-family: 'Monaco', 'Consolas', monospace;
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.reason-text {
  color: var(--text-secondary);
}

.date-text {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.geo-info {
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  color: #22c55e;
  margin-bottom: 1rem;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.add-dialog {
  width: 100%;
  max-width: 450px;
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dialog-title i {
  color: var(--accent);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group :deep(input) {
  width: 100%;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
