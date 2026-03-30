<template>
  <div class="dev-navbar" :class="{ collapsed: isCollapsed }">
    <button class="dev-toggle" @click="isCollapsed = !isCollapsed">
      <span v-if="isCollapsed">☰ Projects</span>
      <span v-else>✕</span>
    </button>
    <div v-if="!isCollapsed" class="dev-links">
      <a
        v-for="p in projects"
        :key="p.port"
        :href="'http://' + host + ':' + p.port"
        :class="{ active: currentPort === p.port }"
        class="dev-link"
      >
        <span class="dev-icon">{{ p.icon }}</span>
        <span class="dev-name">{{ p.name }}</span>
        <span class="dev-port">:{{ p.port }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevNavbar',
  data() {
    return {
      isCollapsed: true,
      currentPort: window.location.port,
      host: window.location.hostname,
      projects: [
        { name: 'Batyr - WAF', port: '7010', icon: '🛡️' },
        { name: 'Bayram - Android', port: '7020', icon: '📱' },
        { name: 'Daniyar - XSS', port: '7030', icon: '🔓' },
        { name: 'Dawut - Virus', port: '7040', icon: '🦠' },
        { name: 'Rowshen - Key', port: '7050', icon: '🔑' },
        { name: 'Selbi - GAN', port: '7060', icon: '🧠' },
        { name: 'Shanur - Wire', port: '7070', icon: '📡' },
        { name: 'Shatlyk - Fire', port: '7080', icon: '🔥' },
        { name: 'Suleyman - OSINT', port: '7090', icon: '🕵️' },
      ]
    }
  }
}
</script>

<style scoped>
.dev-navbar {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.dev-toggle {
  display: block;
  margin: 0 auto 6px;
  padding: 6px 16px;
  background: rgba(30, 30, 30, 0.9);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  backdrop-filter: blur(12px);
  transition: all 0.2s;
}

.dev-toggle:hover {
  background: rgba(50, 50, 50, 0.95);
  border-color: rgba(255, 255, 255, 0.3);
}

.dev-links {
  display: flex;
  gap: 4px;
  padding: 6px;
  background: rgba(20, 20, 20, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow-x: auto;
  max-width: 95vw;
  scrollbar-width: none;
}

.dev-links::-webkit-scrollbar {
  display: none;
}

.dev-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  color: #aaa;
  text-decoration: none;
  border-radius: 10px;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.2s;
}

.dev-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.dev-link.active {
  background: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.dev-icon {
  font-size: 14px;
}

.dev-name {
  font-weight: 500;
}

.dev-port {
  color: #666;
  font-size: 10px;
  font-family: monospace;
}

@media (max-width: 768px) {
  .dev-link .dev-name {
    display: none;
  }
  .dev-link {
    padding: 6px 8px;
  }
  .dev-icon {
    font-size: 18px;
  }
  .dev-port {
    font-size: 9px;
  }
}
</style>
