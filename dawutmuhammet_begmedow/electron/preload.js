const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFile: (filePath) => ipcRenderer.invoke('scan-file', filePath),
  scanFolder: (folderPath) => ipcRenderer.invoke('scan-folder', folderPath),
  openFileLocation: (filePath) => ipcRenderer.invoke('open-file-location', filePath),

  // Progress listeners
  onScanProgress: (callback) => {
    ipcRenderer.on('scan-progress', (event, data) => callback(data))
  },
  onFolderScanProgress: (callback) => {
    ipcRenderer.on('folder-scan-progress', (event, data) => callback(data))
  },

  // System Scan
  systemScan: (scanType) => ipcRenderer.invoke('system-scan', scanType),
  cancelSystemScan: () => ipcRenderer.invoke('cancel-system-scan'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  onSystemScanProgress: (callback) => {
    ipcRenderer.on('system-scan-progress', (event, data) => callback(data))
  },
  onSystemScanThreat: (callback) => {
    ipcRenderer.on('system-scan-threat', (event, data) => callback(data))
  },

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setVirusTotalKey: (key) => ipcRenderer.invoke('set-virustotal-key', key),

  // History
  getHistory: () => ipcRenderer.invoke('get-history'),
  saveToHistory: (scan) => ipcRenderer.invoke('save-to-history', scan),
  clearHistory: () => ipcRenderer.invoke('clear-history'),

  // Platform info
  platform: process.platform,
  isElectron: true
})
