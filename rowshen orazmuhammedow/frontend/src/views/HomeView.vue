<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-icon">
        <i class="pi pi-key"></i>
      </div>
      <h1>{{ t.home.title }}</h1>
      <p class="subtitle">{{ t.home.subtitle }}</p>
      <p class="description">{{ t.home.description }}</p>
      <div class="hero-actions">
        <router-link to="/scan">
          <Button :label="t.home.startScan" icon="pi pi-search" />
        </router-link>
        <router-link to="/processes">
          <Button :label="t.home.viewProcesses" icon="pi pi-list" severity="secondary" outlined />
        </router-link>
      </div>
    </section>

    <section class="features">
      <Card v-for="(feature, key) in t.home.features" :key="key" class="feature-card">
        <template #content>
          <div class="feature-icon" :class="getFeatureClass(key)">
            <i :class="getFeatureIcon(key)"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </template>
      </Card>
    </section>

    <section class="stats-section">
      <Card>
        <template #content>
          <h2><i class="pi pi-shield"></i> System Status</h2>
          <div class="stats-grid">
            <div class="stat-item safe">
              <i class="pi pi-check-circle"></i>
              <span class="stat-value">Protected</span>
              <span class="stat-label">System Status</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.processes }}</span>
              <span class="stat-label">Active Processes</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.hooks }}</span>
              <span class="stat-label">Keyboard Hooks</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.lastScan }}</span>
              <span class="stat-label">Last Scan</span>
            </div>
          </div>
        </template>
      </Card>
    </section>

    <section class="threat-info">
      <Card>
        <template #content>
          <h2><i class="pi pi-exclamation-triangle"></i> Common Keylogger Threats</h2>
          <div class="threats-grid">
            <div class="threat-item">
              <Tag severity="danger" value="High Risk" />
              <h4>SetWindowsHookEx</h4>
              <p>Most common hook-based keylogger technique</p>
            </div>
            <div class="threat-item">
              <Tag severity="warn" value="Medium Risk" />
              <h4>GetAsyncKeyState</h4>
              <p>API-based keystroke monitoring</p>
            </div>
            <div class="threat-item">
              <Tag severity="info" value="Low Risk" />
              <h4>Raw Input</h4>
              <p>Direct keyboard input capture</p>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const stats = ref({
      processes: 142,
      hooks: 3,
      lastScan: '2 hours ago'
    })

    const getFeatureIcon = (key) => {
      const icons = {
        scan: 'pi pi-search',
        realtime: 'pi pi-eye',
        process: 'pi pi-cog',
        protect: 'pi pi-shield'
      }
      return icons[key] || 'pi pi-star'
    }

    const getFeatureClass = (key) => {
      const classes = {
        scan: 'scan-icon',
        realtime: 'realtime-icon',
        process: 'process-icon',
        protect: 'protect-icon'
      }
      return classes[key] || ''
    }

    return { stats, getFeatureIcon, getFeatureClass }
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
}

.hero-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.hero-icon i {
  font-size: 3rem;
  color: white;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #8b5cf6;
  margin-bottom: 1rem;
}

.description {
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  text-align: center;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.scan-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.realtime-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
.process-icon { background: linear-gradient(135deg, #f97316, #ea580c); }
.protect-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.feature-card h3 {
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stats-section,
.threat-info {
  margin-bottom: 2rem;
}

.stats-section h2,
.threat-info h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stats-section h2 i { color: #22c55e; }
.threat-info h2 i { color: #f97316; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
}

.stat-item.safe {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
}

.stat-item.safe i {
  font-size: 2rem;
  color: #22c55e;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #8b5cf6;
}

.stat-item.safe .stat-value {
  color: #22c55e;
  font-size: 1.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.threats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.threat-item {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
}

.threat-item h4 {
  margin: 0.75rem 0 0.5rem;
}

.threat-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .threats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
