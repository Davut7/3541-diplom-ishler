<template>
  <div class="protection-view">
    <div class="page-header">
      <h1>{{ t.protection.title }}</h1>
      <p>{{ t.protection.subtitle }}</p>
    </div>

    <Card class="status-card">
      <template #content>
        <div class="status-header">
          <div class="status-indicator" :class="{ active: isProtected }">
            <i :class="isProtected ? 'pi pi-shield' : 'pi pi-exclamation-triangle'"></i>
          </div>
          <div class="status-info">
            <h2>{{ isProtected ? t.protection.status.protected : t.protection.status.vulnerable }}</h2>
            <p>{{ isProtected ? 'All protection features are active' : 'Some protection features are disabled' }}</p>
          </div>
          <Button :label="isProtected ? 'Disable All' : 'Enable All'" :severity="isProtected ? 'danger' : 'success'" @click="toggleAll" />
        </div>
      </template>
    </Card>

    <div class="settings-grid">
      <Card v-for="(setting, key) in t.protection.settings" :key="key" class="setting-card">
        <template #content>
          <div class="setting-header">
            <div class="setting-icon" :class="getSettingClass(key)">
              <i :class="getSettingIcon(key)"></i>
            </div>
            <div class="setting-info">
              <h3>{{ setting.name }}</h3>
              <p>{{ setting.desc }}</p>
            </div>
            <ToggleSwitch v-model="settings[key]" />
          </div>
          <div class="setting-status">
            <Tag :severity="settings[key] ? 'success' : 'secondary'" :value="settings[key] ? t.protection.status.active : t.protection.status.inactive" />
          </div>
        </template>
      </Card>
    </div>

    <Card class="activity-card">
      <template #content>
        <h2><i class="pi pi-history"></i> Recent Activity</h2>
        <div class="activity-list">
          <div v-for="(activity, i) in recentActivity" :key="i" class="activity-item">
            <i :class="activity.icon" :style="{ color: activity.color }"></i>
            <div class="activity-info">
              <span class="activity-message">{{ activity.message }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const settings = ref({
      hookMonitor: true,
      apiMonitor: true,
      processGuard: true,
      clipboardGuard: false,
      networkGuard: true,
      autoScan: false
    })

    const recentActivity = ref([
      { icon: 'pi pi-shield', color: '#22c55e', message: 'Keyboard hook blocked from unknown process', time: '2 minutes ago' },
      { icon: 'pi pi-check-circle', color: '#22c55e', message: 'System scan completed - no threats found', time: '1 hour ago' },
      { icon: 'pi pi-exclamation-triangle', color: '#f97316', message: 'Suspicious API call detected: GetAsyncKeyState', time: '3 hours ago' },
      { icon: 'pi pi-shield', color: '#22c55e', message: 'Protection enabled on system startup', time: '5 hours ago' },
      { icon: 'pi pi-info-circle', color: '#3b82f6', message: 'Process guard blocked clipboard access', time: '1 day ago' }
    ])

    const isProtected = computed(() => {
      return Object.values(settings.value).filter(v => v).length >= 4
    })

    const toggleAll = () => {
      const newValue = !isProtected.value
      Object.keys(settings.value).forEach(key => {
        settings.value[key] = newValue
      })
    }

    const getSettingIcon = (key) => {
      const icons = {
        hookMonitor: 'pi pi-key',
        apiMonitor: 'pi pi-code',
        processGuard: 'pi pi-cog',
        clipboardGuard: 'pi pi-copy',
        networkGuard: 'pi pi-wifi',
        autoScan: 'pi pi-clock'
      }
      return icons[key] || 'pi pi-shield'
    }

    const getSettingClass = (key) => {
      const classes = {
        hookMonitor: 'icon-purple',
        apiMonitor: 'icon-blue',
        processGuard: 'icon-orange',
        clipboardGuard: 'icon-green',
        networkGuard: 'icon-cyan',
        autoScan: 'icon-yellow'
      }
      return classes[key] || 'icon-purple'
    }

    return {
      settings,
      recentActivity,
      isProtected,
      toggleAll,
      getSettingIcon,
      getSettingClass
    }
  }
}
</script>

<style scoped>
.protection-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.status-card {
  margin-bottom: 2rem;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-indicator {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border: 3px solid #ef4444;
}

.status-indicator.active {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
}

.status-indicator i {
  font-size: 2rem;
  color: #ef4444;
}

.status-indicator.active i {
  color: #22c55e;
}

.status-info {
  flex: 1;
}

.status-info h2 {
  margin-bottom: 0.25rem;
}

.status-info p {
  color: var(--text-secondary);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.setting-card {
  transition: transform 0.2s;
}

.setting-card:hover {
  transform: translateY(-2px);
}

.setting-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.setting-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.setting-icon i {
  font-size: 1.25rem;
  color: white;
}

.icon-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.icon-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.icon-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.icon-green { background: linear-gradient(135deg, #22c55e, #16a34a); }
.icon-cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.icon-yellow { background: linear-gradient(135deg, #eab308, #ca8a04); }

.setting-info {
  flex: 1;
}

.setting-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.setting-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.activity-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.activity-card h2 i {
  color: #8b5cf6;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.activity-item i {
  font-size: 1.25rem;
}

.activity-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-time {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .status-header {
    flex-direction: column;
    text-align: center;
  }

  .status-header :deep(.p-button) {
    width: 100%;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .activity-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .setting-header {
    flex-wrap: wrap;
  }

  .status-indicator {
    width: 60px;
    height: 60px;
  }

  .status-indicator i {
    font-size: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .setting-info h3 {
    font-size: 0.9rem;
  }

  .setting-info p {
    font-size: 0.8rem;
  }

  .setting-icon {
    width: 38px;
    height: 38px;
  }

  .activity-item {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .activity-message {
    font-size: 0.85rem;
  }

  .activity-time {
    font-size: 0.75rem;
  }

  .page-header {
    margin-bottom: 1.5rem;
  }
}
</style>
