const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Get running processes (real system data)
  getProcesses: () => ipcRenderer.invoke('get-processes'),

  // Scan for keyboard hooks (real detection)
  scanHooks: () => ipcRenderer.invoke('scan-hooks'),

  // Scan for persistence mechanisms (real system scan)
  scanPersistence: () => ipcRenderer.invoke('scan-persistence'),

  // Scan network connections
  scanNetwork: () => ipcRenderer.invoke('scan-network'),

  // Get system information (real data)
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // Run full system scan (comprehensive real scan)
  runFullScan: () => ipcRenderer.invoke('run-full-scan'),

  // Open external URL
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Listen for scan progress updates
  onScanProgress: (callback) => {
    ipcRenderer.on('scan-progress', (event, data) => callback(data))
  },

  // Remove scan progress listener
  removeScanProgressListener: () => {
    ipcRenderer.removeAllListeners('scan-progress')
  },

  // Check if running in Electron
  isElectron: true,

  // Get platform info
  getPlatform: () => process.platform,

  // Get OS type
  getOSType: () => {
    const platform = process.platform
    if (platform === 'darwin') return 'macOS'
    if (platform === 'win32') return 'Windows'
    return 'Linux'
  }
})

// Notify renderer that preload is ready
window.addEventListener('DOMContentLoaded', () => {
  console.log('KeyGuard Electron Preload Ready')
})
