<template>
  <div class="protocols-view">
    <div class="page-header">
      <h1>{{ t.protocols.title }}</h1>
      <p>{{ t.protocols.subtitle }}</p>
    </div>

    <Card class="search-card">
      <template #content>
        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="searchQuery" :placeholder="t.protocols.search" class="search-input" />
        </div>
      </template>
    </Card>

    <div class="protocols-grid">
      <Card v-for="(protocol, key) in filteredProtocols" :key="key" class="protocol-card">
        <template #content>
          <div class="protocol-header">
            <div class="protocol-icon" :class="getLayerClass(protocol.layer)">
              <i :class="getProtocolIcon(key)"></i>
            </div>
            <div class="protocol-info">
              <h3>{{ protocol.name }}</h3>
              <Tag :severity="getLayerSeverity(protocol.layer)" :value="protocol.layer" size="small" />
            </div>
          </div>
          <p class="protocol-desc">{{ protocol.desc }}</p>
          <div class="protocol-meta">
            <span v-if="protocol.port !== '-'"><strong>Port:</strong> {{ protocol.port }}</span>
            <span><strong>{{ t.protocols.layer }}:</strong> {{ protocol.layer }}</span>
          </div>
        </template>
      </Card>
    </div>

    <Card class="osi-model">
      <template #content>
        <h2><i class="pi pi-server"></i> OSI Model Layers</h2>
        <div class="osi-layers">
          <div v-for="(layer, i) in osiLayers" :key="i" class="osi-layer" :class="layer.class">
            <span class="layer-number">{{ 7 - i }}</span>
            <span class="layer-name">{{ layer.name }}</span>
            <span class="layer-protocols">{{ layer.protocols }}</span>
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
  setup(props) {
    const searchQuery = ref('')

    const filteredProtocols = computed(() => {
      const protocols = props.t.protocols.list
      if (!searchQuery.value) return protocols

      const query = searchQuery.value.toLowerCase()
      const filtered = {}
      for (const [key, protocol] of Object.entries(protocols)) {
        if (protocol.name.toLowerCase().includes(query) ||
            protocol.desc.toLowerCase().includes(query)) {
          filtered[key] = protocol
        }
      }
      return filtered
    })

    const osiLayers = [
      { name: 'Application', protocols: 'HTTP, HTTPS, FTP, SSH, DNS, SMTP', class: 'layer-app' },
      { name: 'Presentation', protocols: 'SSL/TLS, JPEG, GIF', class: 'layer-pres' },
      { name: 'Session', protocols: 'NetBIOS, RPC', class: 'layer-sess' },
      { name: 'Transport', protocols: 'TCP, UDP', class: 'layer-trans' },
      { name: 'Network', protocols: 'IP, ICMP, IGMP', class: 'layer-net' },
      { name: 'Data Link', protocols: 'Ethernet, ARP, PPP', class: 'layer-link' },
      { name: 'Physical', protocols: 'Cables, Hubs, Signals', class: 'layer-phys' }
    ]

    const getProtocolIcon = (key) => {
      const icons = {
        http: 'pi pi-globe',
        https: 'pi pi-lock',
        dns: 'pi pi-search',
        ftp: 'pi pi-folder',
        ssh: 'pi pi-key',
        smtp: 'pi pi-envelope',
        tcp: 'pi pi-arrows-h',
        udp: 'pi pi-bolt',
        ip: 'pi pi-sitemap',
        icmp: 'pi pi-bell',
        arp: 'pi pi-link',
        ethernet: 'pi pi-server'
      }
      return icons[key] || 'pi pi-circle'
    }

    const getLayerClass = (layer) => {
      const classes = {
        'Application': 'layer-app',
        'Amaly': 'layer-app',
        'Transport': 'layer-trans',
        'Network': 'layer-net',
        'Tor': 'layer-net',
        'Data Link': 'layer-link',
        'Maglumat Baglanyşygy': 'layer-link'
      }
      return classes[layer] || 'layer-app'
    }

    const getLayerSeverity = (layer) => {
      const severities = {
        'Application': 'success',
        'Amaly': 'success',
        'Transport': 'info',
        'Network': 'warn',
        'Tor': 'warn',
        'Data Link': 'secondary',
        'Maglumat Baglanyşygy': 'secondary'
      }
      return severities[layer] || 'info'
    }

    return {
      searchQuery,
      filteredProtocols,
      osiLayers,
      getProtocolIcon,
      getLayerClass,
      getLayerSeverity
    }
  }
}
</script>

<style scoped>
.protocols-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.search-card {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-box i {
  color: var(--text-secondary);
}

.search-input {
  flex: 1;
}

.protocols-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.protocol-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.protocol-card:hover {
  transform: translateY(-4px);
}

.protocol-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.protocol-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.protocol-icon i {
  font-size: 1.5rem;
  color: white;
}

.layer-app {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.layer-pres {
  background: linear-gradient(135deg, #84cc16, #65a30d);
}

.layer-sess {
  background: linear-gradient(135deg, #eab308, #ca8a04);
}

.layer-trans {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.layer-net {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.layer-link {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.layer-phys {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.protocol-info h3 {
  margin-bottom: 0.25rem;
}

.protocol-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.protocol-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.osi-model h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.osi-model h2 i {
  color: #3b82f6;
}

.osi-layers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.osi-layer {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  color: white;
}

.layer-number {
  width: 30px;
  font-weight: 700;
  font-size: 1.25rem;
}

.layer-name {
  width: 120px;
  font-weight: 600;
}

.layer-protocols {
  flex: 1;
  opacity: 0.9;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .protocols-grid {
    grid-template-columns: 1fr;
  }

  .osi-layer {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .layer-number,
  .layer-name {
    width: auto;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .protocol-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.25rem;
  }

  .osi-layer {
    padding: 0.75rem;
  }

  .layer-protocols {
    font-size: 0.8rem;
  }

  .protocol-header {
    gap: 0.75rem;
  }

  .protocol-icon {
    width: 42px;
    height: 42px;
  }

  .protocol-icon i {
    font-size: 1.2rem;
  }
}
</style>
