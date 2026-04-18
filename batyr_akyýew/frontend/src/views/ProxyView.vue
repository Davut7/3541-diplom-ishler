<template>
  <div class="proxy-view">
    <div class="page-header">
      <div class="header-content">
        <h1><i class="pi pi-sitemap"></i> {{ t.proxy?.title || 'Reverse Proxy Mode' }}</h1>
        <p>{{ t.proxy?.subtitle || 'Deploy WAF as a reverse proxy in front of your web application' }}</p>
      </div>
      <div class="status-badge" :class="{ active: isRunning }">
        <i :class="isRunning ? 'pi pi-check-circle' : 'pi pi-circle'"></i>
        {{ isRunning ? 'Running' : 'Stopped' }}
      </div>
    </div>

    <!-- How it works -->
    <Card class="info-card">
      <template #content>
        <div class="info-content">
          <div class="info-icon"><i class="pi pi-info-circle"></i></div>
          <div class="info-text">
            <h3>{{ t.proxy?.howItWorks || 'How Reverse Proxy Works' }}</h3>
            <p>{{ t.proxy?.howItWorksDesc || 'The WAF is deployed as a reverse proxy in front of your own web application. All incoming HTTP requests first pass through the WAF for threat analysis. Malicious requests are blocked, while safe requests are forwarded to your application server.' }}</p>
            <div class="flow-diagram">
              <div class="flow-item client"><i class="pi pi-user"></i> Client</div>
              <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>
              <div class="flow-item waf"><i class="pi pi-shield"></i> WAF Proxy</div>
              <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>
              <div class="flow-item server"><i class="pi pi-server"></i> Target Server</div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <div class="config-grid">
      <!-- Proxy Configuration -->
      <Card class="config-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-cog"></i>
            <span>{{ t.proxy?.configuration || 'Proxy Configuration' }}</span>
          </div>
        </template>
        <template #content>
          <div class="form-group">
            <label>{{ t.proxy?.targetUrl || 'Target Server URL' }}</label>
            <div class="input-with-button">
              <InputText v-model="config.target_url" placeholder="http://localhost:3000 or https://example.com" />
              <Button icon="pi pi-refresh" @click="testConnection" :loading="testing" v-tooltip="'Test connection'" outlined />
            </div>
            <small v-if="connectionStatus" :class="connectionStatus.reachable ? 'success-text' : 'error-text'">
              <i :class="connectionStatus.reachable ? 'pi pi-check' : 'pi pi-times'"></i>
              {{ connectionStatus.reachable ? `Connected (${connectionStatus.status})` : connectionStatus.error }}
            </small>
          </div>

          <div class="form-group">
            <label>{{ t.proxy?.targetName || 'Target Name' }}</label>
            <InputText v-model="config.target_name" placeholder="My Web Application" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t.proxy?.proxyPort || 'Proxy Port' }}</label>
              <InputText v-model="config.proxy_port" type="number" placeholder="8080" />
            </div>
          </div>

          <div class="form-group toggle-group">
            <label>{{ t.proxy?.logRequests || 'Log All Suspicious Requests' }}</label>
            <ToggleSwitch v-model="config.log_all_requests" />
          </div>

          <div class="form-group toggle-group">
            <label>{{ t.proxy?.blockThreats || 'Block Detected Threats' }}</label>
            <ToggleSwitch v-model="config.block_on_threat" />
          </div>

          <Button :label="t.proxy?.saveConfig || 'Save Configuration'" icon="pi pi-save" @click="saveConfig" :loading="saving" class="save-btn" />
        </template>
      </Card>

      <!-- Proxy Control -->
      <Card class="control-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-play-circle"></i>
            <span>{{ t.proxy?.control || 'Proxy Control' }}</span>
          </div>
        </template>
        <template #content>
          <div class="proxy-status">
            <div class="status-indicator" :class="{ running: isRunning }">
              <div class="pulse-ring" v-if="isRunning"></div>
              <i :class="isRunning ? 'pi pi-check-circle' : 'pi pi-stop-circle'"></i>
            </div>
            <div class="status-info">
              <h3>{{ isRunning ? (t.proxy?.running || 'Proxy Running') : (t.proxy?.stopped || 'Proxy Stopped') }}</h3>
              <p v-if="isRunning">
                <code>http://localhost:{{ config.proxy_port }}</code> → <code>{{ config.target_url }}</code>
              </p>
              <p v-else>{{ t.proxy?.stoppedDesc || 'Start the proxy to protect your target server' }}</p>
            </div>
          </div>

          <div class="control-buttons">
            <Button v-if="!isRunning"
                    :label="t.proxy?.start || 'Start Proxy'"
                    icon="pi pi-play"
                    @click="startProxy"
                    :loading="starting"
                    severity="success"
                    class="control-btn" />
            <Button v-else
                    :label="t.proxy?.stop || 'Stop Proxy'"
                    icon="pi pi-stop"
                    @click="stopProxy"
                    :loading="stopping"
                    severity="danger"
                    class="control-btn" />
          </div>

          <div class="access-info" v-if="isRunning">
            <h4><i class="pi pi-link"></i> {{ t.proxy?.accessVia || 'Access via' }}:</h4>
            <div class="url-box">
              <code>http://localhost:{{ config.proxy_port }}</code>
              <Button icon="pi pi-copy" text rounded @click="copyUrl" v-tooltip="'Copy URL'" />
            </div>
            <p class="hint">{{ t.proxy?.accessHint || 'All requests to this URL will be analyzed by WAF before forwarding to target server.' }}</p>
          </div>
        </template>
      </Card>
    </div>

    <!-- Integration Code -->
    <Card class="code-card">
      <template #title>
        <div class="card-title">
          <i class="pi pi-code"></i>
          <span>{{ t.proxy?.integrationCode || 'Integration Options' }}</span>
        </div>
      </template>
      <template #content>
        <div class="tabs">
          <div class="tab" :class="{ active: activeTab === 'nginx' }" @click="activeTab = 'nginx'">Nginx</div>
          <div class="tab" :class="{ active: activeTab === 'hosts' }" @click="activeTab = 'hosts'">Hosts File</div>
          <div class="tab" :class="{ active: activeTab === 'middleware' }" @click="activeTab = 'middleware'">Express Middleware</div>
        </div>

        <div class="code-block" v-if="activeTab === 'nginx'">
          <pre><code># Nginx configuration to use WAF as reverse proxy
# Add this to your nginx.conf or site configuration

upstream waf_proxy {
    server 127.0.0.1:{{ config.proxy_port }};
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://waf_proxy;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}</code></pre>
          <Button icon="pi pi-copy" label="Copy" text @click="copyCode('nginx')" />
        </div>

        <div class="code-block" v-if="activeTab === 'hosts'">
          <pre><code># For local testing, add to /etc/hosts (Mac/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
# This redirects traffic to WAF proxy

127.0.0.1    yourdomain.local

# Then access your site via: http://yourdomain.local:{{ config.proxy_port }}
# WAF will analyze and forward requests to: {{ config.target_url }}</code></pre>
          <Button icon="pi pi-copy" label="Copy" text @click="copyCode('hosts')" />
        </div>

        <div class="code-block" v-if="activeTab === 'middleware'">
          <pre><code>// Express.js middleware integration
// Add this to your Express application

const WAF_SERVER = 'http://localhost:4001';

const wafMiddleware = async (req, res, next) => {
  try {
    const response = await fetch(WAF_SERVER + '/api/waf/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        headers: req.headers,
        ip: req.ip
      })
    });

    const analysis = await response.json();

    if (analysis.blocked) {
      return res.status(403).json({ error: 'Blocked by WAF', reason: analysis.reason });
    }

    next();
  } catch (error) {
    console.warn('WAF unavailable:', error.message);
    next();
  }
};

// Usage:
// app.use(wafMiddleware);</code></pre>
          <Button icon="pi pi-copy" label="Copy" text @click="copyCode('middleware')" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ProxyView',
  props: ['t', 'language'],
  setup() {
    const config = ref({
      target_url: '',
      target_name: '',
      proxy_port: 8080,
      log_all_requests: true,
      block_on_threat: true
    })
    const isRunning = ref(false)
    const saving = ref(false)
    const starting = ref(false)
    const stopping = ref(false)
    const testing = ref(false)
    const connectionStatus = ref(null)
    const activeTab = ref('nginx')

    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/proxy/config')
        const data = await res.json()
        if (data.config) {
          config.value = {
            ...data.config,
            log_all_requests: Boolean(data.config.log_all_requests),
            block_on_threat: Boolean(data.config.block_on_threat)
          }
        }
      } catch (error) {
        console.error('Failed to fetch proxy config:', error)
      }
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/proxy/status')
        const data = await res.json()
        isRunning.value = data.running
      } catch (error) {
        console.error('Failed to fetch proxy status:', error)
      }
    }

    const saveConfig = async () => {
      saving.value = true
      try {
        const res = await fetch('/api/proxy/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config.value)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        alert('Configuration saved!')
      } catch (error) {
        alert(error.message || 'Failed to save configuration')
      }
      saving.value = false
    }

    const testConnection = async () => {
      if (!config.value.target_url) {
        alert('Please enter a target URL first')
        return
      }
      testing.value = true
      connectionStatus.value = null
      try {
        const res = await fetch('/api/proxy/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target_url: config.value.target_url })
        })
        const data = await res.json()
        connectionStatus.value = data
      } catch (error) {
        connectionStatus.value = { reachable: false, error: error.message }
      }
      testing.value = false
    }

    const startProxy = async () => {
      if (!config.value.target_url) {
        alert('Please configure target URL first')
        return
      }
      starting.value = true
      try {
        const res = await fetch('/api/proxy/start', { method: 'POST' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        isRunning.value = true
        alert(`Proxy started on port ${config.value.proxy_port}!`)
      } catch (error) {
        alert(error.message || 'Failed to start proxy')
      }
      starting.value = false
    }

    const stopProxy = async () => {
      stopping.value = true
      try {
        const res = await fetch('/api/proxy/stop', { method: 'POST' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        isRunning.value = false
        alert('Proxy stopped')
      } catch (error) {
        alert(error.message || 'Failed to stop proxy')
      }
      stopping.value = false
    }

    const copyUrl = () => {
      navigator.clipboard.writeText(`http://localhost:${config.value.proxy_port}`)
      alert('URL copied to clipboard!')
    }

    const copyCode = (type) => {
      const codeBlock = document.querySelector(`.code-block pre code`)
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent)
        alert('Code copied to clipboard!')
      }
    }

    onMounted(() => {
      fetchConfig()
      fetchStatus()
    })

    return {
      config,
      isRunning,
      saving,
      starting,
      stopping,
      testing,
      connectionStatus,
      activeTab,
      saveConfig,
      testConnection,
      startProxy,
      stopProxy,
      copyUrl,
      copyCode
    }
  }
}
</script>

<style scoped>
.proxy-view {
  max-width: 1200px;
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
  color: #8b5cf6;
}

.header-content p {
  color: var(--text-secondary);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: #fee2e2;
  color: #dc2626;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.info-card {
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.3);
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

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

.info-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 1.5rem;
  color: white;
}

.info-text h3 {
  margin-bottom: 0.5rem;
  color: #8b5cf6;
}

.info-text p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.flow-diagram {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.flow-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  color: white;
}

.flow-item.client {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.flow-item.waf {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.flow-item.server {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.flow-arrow {
  color: var(--text-secondary);
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.config-card, .control-card {
  animation: fadeInUp 0.5s ease-out both;
}

.config-card { animation-delay: 0.2s; }
.control-card { animation-delay: 0.3s; }

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title i {
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button :deep(input) {
  flex: 1;
}

.success-text {
  color: #16a34a;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.error-text {
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.save-btn {
  margin-top: 1rem;
  width: 100%;
}

.proxy-status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.status-indicator {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.status-indicator.running {
  background: #dcfce7;
}

.status-indicator i {
  font-size: 2rem;
  color: #dc2626;
}

.status-indicator.running i {
  color: #16a34a;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.status-info h3 {
  margin-bottom: 0.25rem;
}

.status-info p {
  color: var(--text-secondary);
}

.status-info code {
  background: var(--bg-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.control-buttons {
  margin-bottom: 1.5rem;
}

.control-btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  font-size: 1rem;
}

.access-info {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 10px;
  border: 1px dashed var(--border-color);
}

.access-info h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.url-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.url-box code {
  flex: 1;
  font-size: 1rem;
  color: var(--accent);
}

.hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.code-card {
  animation: fadeInUp 0.5s ease-out 0.4s both;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab:hover {
  background: var(--accent-light);
}

.tab.active {
  background: var(--accent);
  color: white;
}

.code-block {
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
}

.code-block pre {
  margin: 0;
  padding: 1.5rem;
  overflow-x: auto;
}

.code-block code {
  color: #d4d4d4;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: pre;
}

.code-block :deep(.p-button) {
  margin: 0.5rem;
}

@media (max-width: 900px) {
  .config-grid {
    grid-template-columns: 1fr;
  }

  .info-content {
    flex-direction: column;
  }

  .flow-diagram {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-content h1 {
    font-size: 1.4rem;
  }

  .flow-diagram {
    flex-direction: column;
    align-items: center;
  }

  .flow-arrow i {
    transform: rotate(90deg);
  }

  .tabs {
    flex-wrap: wrap;
  }

  .tab {
    flex: 1;
    text-align: center;
    font-size: 0.85rem;
    padding: 0.4rem 0.75rem;
  }

  .code-block pre {
    padding: 1rem;
    font-size: 0.75rem;
  }

  .proxy-status {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
  }

  .status-indicator {
    width: 55px;
    height: 55px;
  }

  .status-indicator i {
    font-size: 1.5rem;
  }

  .input-with-button {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1.2rem;
  }

  .flow-item {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
  }

  .code-block code {
    font-size: 0.7rem;
  }

  .url-box {
    flex-direction: column;
    text-align: center;
  }

  .url-box code {
    font-size: 0.85rem;
  }
}
</style>
