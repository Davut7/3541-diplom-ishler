const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { exec, execSync } = require('child_process')
const os = require('os')
const fs = require('fs')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../frontend/public/icon.png'),
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0f',
    show: false
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:7050')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ========== REAL System Analysis Functions ==========

// Known keylogger signatures and suspicious patterns
const KEYLOGGER_SIGNATURES = {
  processNames: [
    'keylogger', 'keylog', 'klog', 'keystroke', 'keysniff', 'keyspy',
    'spykey', 'logkeys', 'lkl', 'pykeylogger', 'keylogger', 'klogger',
    'keyboard_monitor', 'keycapture', 'inputlogger', 'typinglog',
    'ardamax', 'spyrix', 'refog', 'realtime-spy', 'kidlogger',
    'hoverwatch', 'mspy', 'flexispy', 'cocospy', 'spyic',
    'actual-keylogger', 'best-keylogger', 'elite-keylogger',
    'perfect-keylogger', 'revealer-keylogger', 'shadow-keylogger',
    'wolfeye', 'pcpandora', 'spector', 'webwatcher'
  ],
  suspiciousKeywords: [
    'hook', 'capture', 'spy', 'monitor', 'record', 'sniff', 'stealth',
    'hidden', 'invisible', 'keypress', 'keystroke', 'keyboard',
    'getasynckeystate', 'setwindowshookex', 'rawinput'
  ],
  legitimateKeyboardApps: [
    'karabiner', 'bettertouchtool', 'keyboard maestro', 'alfred',
    'hammerspoon', 'skhd', 'autohotkey', 'autokey', 'xbindkeys',
    'input-remapper', 'keyd'
  ]
}

// Known malicious hashes (simplified - in real app would use a database)
const SUSPICIOUS_PATHS = [
  '/tmp/', '/var/tmp/', 'appdata/local/temp', 'appdata/roaming',
  'programdata', '/dev/shm/', '/run/user/'
]

// ========== Process Scanning ==========

ipcMain.handle('get-processes', async () => {
  const platform = os.platform()

  try {
    if (platform === 'darwin') {
      return await scanMacProcesses()
    } else if (platform === 'win32') {
      return await scanWindowsProcesses()
    } else {
      return await scanLinuxProcesses()
    }
  } catch (error) {
    return { success: false, error: error.message, processes: [] }
  }
})

async function scanMacProcesses() {
  return new Promise((resolve) => {
    // Get detailed process info on macOS
    const command = `ps -eo pid,ppid,user,%cpu,%mem,stat,started,time,comm,command`

    exec(command, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message, processes: [] })
        return
      }

      const lines = stdout.trim().split('\n').slice(1)
      const processes = []

      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts.length >= 10) {
          const pid = parseInt(parts[0]) || 0
          const ppid = parseInt(parts[1]) || 0
          const user = parts[2]
          const cpu = parseFloat(parts[3]) || 0
          const memory = parseFloat(parts[4]) || 0
          const stat = parts[5]
          const started = parts[6]
          const time = parts[7]
          const name = parts[8]
          const fullPath = parts.slice(9).join(' ')

          if (pid > 0) {
            const risk = analyzeProcessRisk(name, fullPath, user, ppid)
            processes.push({
              pid,
              ppid,
              user,
              name,
              cpu,
              memory,
              stat,
              started,
              time,
              path: fullPath,
              risk
            })
          }
        }
      }

      // Sort by risk level
      processes.sort((a, b) => {
        const riskOrder = { high: 0, medium: 1, low: 2, safe: 3 }
        return (riskOrder[a.risk.level] || 3) - (riskOrder[b.risk.level] || 3)
      })

      resolve({ success: true, processes })
    })
  })
}

async function scanWindowsProcesses() {
  return new Promise((resolve) => {
    // PowerShell command for detailed process info
    const command = `powershell -Command "Get-Process | Select-Object Id,ProcessName,CPU,WorkingSet64,Path,StartTime,Company | ConvertTo-Json"`

    exec(command, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout) => {
      if (error) {
        // Fallback to wmic
        exec('wmic process get ProcessId,Name,ExecutablePath,CommandLine,WorkingSetSize /format:csv',
          { maxBuffer: 50 * 1024 * 1024 }, (error2, stdout2) => {
            if (error2) {
              resolve({ success: false, error: error2.message, processes: [] })
              return
            }

            const lines = stdout2.trim().split('\n').slice(1)
            const processes = []

            for (const line of lines) {
              const parts = line.split(',')
              if (parts.length >= 5) {
                const pid = parseInt(parts[1]) || 0
                const name = parts[2] || ''
                const path = parts[3] || ''
                const memory = parseInt(parts[5]) || 0

                if (pid > 0 && name) {
                  processes.push({
                    pid,
                    name,
                    path,
                    memory: Math.round(memory / 1024 / 1024),
                    cpu: 0,
                    risk: analyzeProcessRisk(name, path, '', 0)
                  })
                }
              }
            }

            resolve({ success: true, processes })
          })
        return
      }

      try {
        const data = JSON.parse(stdout)
        const processList = Array.isArray(data) ? data : [data]
        const processes = processList.map(p => ({
          pid: p.Id,
          name: p.ProcessName,
          cpu: Math.round((p.CPU || 0) * 100) / 100,
          memory: Math.round((p.WorkingSet64 || 0) / 1024 / 1024),
          path: p.Path || '',
          started: p.StartTime,
          company: p.Company || '',
          risk: analyzeProcessRisk(p.ProcessName, p.Path || '', '', 0)
        })).filter(p => p.pid > 0)

        resolve({ success: true, processes })
      } catch (e) {
        resolve({ success: false, error: e.message, processes: [] })
      }
    })
  })
}

async function scanLinuxProcesses() {
  return new Promise((resolve) => {
    const command = `ps -eo pid,ppid,user,%cpu,%mem,stat,start,time,comm,cmd --no-headers`

    exec(command, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message, processes: [] })
        return
      }

      const lines = stdout.trim().split('\n')
      const processes = []

      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts.length >= 10) {
          const pid = parseInt(parts[0]) || 0
          const ppid = parseInt(parts[1]) || 0
          const user = parts[2]
          const cpu = parseFloat(parts[3]) || 0
          const memory = parseFloat(parts[4]) || 0
          const stat = parts[5]
          const started = parts[6]
          const time = parts[7]
          const name = parts[8]
          const fullPath = parts.slice(9).join(' ')

          if (pid > 0) {
            processes.push({
              pid,
              ppid,
              user,
              name,
              cpu,
              memory,
              stat,
              started,
              time,
              path: fullPath,
              risk: analyzeProcessRisk(name, fullPath, user, ppid)
            })
          }
        }
      }

      resolve({ success: true, processes })
    })
  })
}

// Advanced process risk analysis
function analyzeProcessRisk(name, path, user, ppid) {
  const nameLower = (name || '').toLowerCase()
  const pathLower = (path || '').toLowerCase()
  const combined = nameLower + ' ' + pathLower

  // Check for known keylogger names
  for (const sig of KEYLOGGER_SIGNATURES.processNames) {
    if (combined.includes(sig)) {
      return {
        level: 'high',
        reason: `Known keylogger signature: ${sig}`,
        details: 'This process matches known keylogger software patterns'
      }
    }
  }

  // Check for suspicious keywords
  let suspiciousCount = 0
  const foundKeywords = []
  for (const keyword of KEYLOGGER_SIGNATURES.suspiciousKeywords) {
    if (combined.includes(keyword)) {
      suspiciousCount++
      foundKeywords.push(keyword)
    }
  }

  if (suspiciousCount >= 2) {
    return {
      level: 'high',
      reason: `Multiple suspicious keywords: ${foundKeywords.join(', ')}`,
      details: 'Process contains multiple indicators of keyboard monitoring'
    }
  } else if (suspiciousCount === 1) {
    // Check if it's a legitimate keyboard app
    for (const legit of KEYLOGGER_SIGNATURES.legitimateKeyboardApps) {
      if (combined.includes(legit)) {
        return {
          level: 'low',
          reason: `Legitimate keyboard utility: ${legit}`,
          details: 'Known keyboard customization software'
        }
      }
    }
    return {
      level: 'medium',
      reason: `Suspicious keyword: ${foundKeywords[0]}`,
      details: 'Process may have keyboard access capabilities'
    }
  }

  // Check for suspicious paths
  for (const suspPath of SUSPICIOUS_PATHS) {
    if (pathLower.includes(suspPath)) {
      return {
        level: 'medium',
        reason: `Unusual location: ${suspPath}`,
        details: 'Process running from temporary or hidden location'
      }
    }
  }

  // Check for scripting runtimes that could run keyloggers
  const runtimes = ['python', 'ruby', 'perl', 'node', 'java', 'powershell', 'pwsh', 'bash', 'sh', 'cmd']
  for (const runtime of runtimes) {
    if (nameLower === runtime || nameLower.startsWith(runtime)) {
      return {
        level: 'low',
        reason: `Scripting runtime: ${runtime}`,
        details: 'Interpreter that could potentially run keylogging scripts'
      }
    }
  }

  // System processes
  const systemProcesses = [
    'kernel', 'launchd', 'init', 'systemd', 'system', 'csrss', 'smss',
    'services', 'lsass', 'svchost', 'explorer', 'finder', 'windowserver',
    'loginwindow', 'dock', 'spotlight', 'mdworker', 'mds', 'coreaudio'
  ]
  for (const sys of systemProcesses) {
    if (nameLower.includes(sys)) {
      return { level: 'safe', reason: 'System process', details: 'Core operating system component' }
    }
  }

  return { level: 'safe', reason: 'Standard process', details: 'No suspicious indicators found' }
}

// ========== Keyboard Hook Detection ==========

ipcMain.handle('scan-hooks', async () => {
  const platform = os.platform()

  try {
    if (platform === 'darwin') {
      return await scanMacKeyboardAccess()
    } else if (platform === 'win32') {
      return await scanWindowsHooks()
    } else {
      return await scanLinuxKeyboardAccess()
    }
  } catch (error) {
    return { success: false, error: error.message, hooks: [] }
  }
})

async function scanMacKeyboardAccess() {
  return new Promise((resolve) => {
    const hooks = []
    let completed = 0
    const total = 3

    // Check apps with accessibility permissions (can monitor keyboard)
    exec(`sqlite3 "/Library/Application Support/com.apple.TCC/TCC.db" "SELECT client FROM access WHERE service='kTCCServiceAccessibility' AND allowed=1" 2>/dev/null || echo ""`,
      (error, stdout) => {
        if (stdout.trim()) {
          const apps = stdout.trim().split('\n')
          for (const app of apps) {
            if (app) {
              hooks.push({
                type: 'Accessibility Permission',
                process: app,
                risk: analyzeHookRisk(app),
                description: 'Has accessibility access (can monitor keyboard)',
                detected: new Date().toISOString()
              })
            }
          }
        }
        checkComplete()
      })

    // Check for input monitoring permissions
    exec(`sqlite3 "/Library/Application Support/com.apple.TCC/TCC.db" "SELECT client FROM access WHERE service='kTCCServiceListenEvent' AND allowed=1" 2>/dev/null || echo ""`,
      (error, stdout) => {
        if (stdout.trim()) {
          const apps = stdout.trim().split('\n')
          for (const app of apps) {
            if (app) {
              hooks.push({
                type: 'Input Monitoring',
                process: app,
                risk: analyzeHookRisk(app),
                description: 'Has input monitoring permission',
                detected: new Date().toISOString()
              })
            }
          }
        }
        checkComplete()
      })

    // Check running processes that commonly hook keyboard
    exec(`ps aux | grep -iE "(hook|keyboard|input|event)" | grep -v grep`,
      (error, stdout) => {
        if (stdout.trim()) {
          const lines = stdout.trim().split('\n')
          for (const line of lines) {
            const parts = line.split(/\s+/)
            if (parts.length > 10) {
              const processName = parts.slice(10).join(' ')
              hooks.push({
                type: 'Keyboard-related Process',
                process: processName,
                risk: analyzeHookRisk(processName),
                description: 'Process with keyboard-related activity',
                detected: new Date().toISOString()
              })
            }
          }
        }
        checkComplete()
      })

    function checkComplete() {
      completed++
      if (completed === total) {
        // Remove duplicates
        const unique = hooks.filter((hook, index, self) =>
          index === self.findIndex(h => h.process === hook.process && h.type === hook.type)
        )
        resolve({ success: true, hooks: unique, scannedAt: new Date().toISOString() })
      }
    }
  })
}

async function scanWindowsHooks() {
  return new Promise((resolve) => {
    const hooks = []
    let completed = 0
    const total = 2

    // Check for keyboard hook DLLs loaded in processes
    exec(`powershell -Command "Get-Process | ForEach-Object { $_.Modules } | Where-Object { $_.ModuleName -match 'hook|keyboard|key|input' } | Select-Object ModuleName, FileName | ConvertTo-Json"`,
      { maxBuffer: 50 * 1024 * 1024 },
      (error, stdout) => {
        if (!error && stdout.trim()) {
          try {
            const modules = JSON.parse(stdout)
            const moduleList = Array.isArray(modules) ? modules : [modules]
            for (const mod of moduleList) {
              if (mod.ModuleName) {
                hooks.push({
                  type: 'Loaded Module',
                  process: mod.ModuleName,
                  path: mod.FileName || '',
                  risk: analyzeHookRisk(mod.ModuleName),
                  description: 'Module potentially used for keyboard hooking',
                  detected: new Date().toISOString()
                })
              }
            }
          } catch (e) {}
        }
        checkComplete()
      })

    // Check for processes using keyboard APIs
    exec(`powershell -Command "Get-WmiObject Win32_Process | Where-Object { $_.CommandLine -match 'keyboard|keylog|GetAsyncKeyState|SetWindowsHookEx' } | Select-Object ProcessId, Name, CommandLine | ConvertTo-Json"`,
      { maxBuffer: 50 * 1024 * 1024 },
      (error, stdout) => {
        if (!error && stdout.trim() && stdout.trim() !== '') {
          try {
            const procs = JSON.parse(stdout)
            const procList = Array.isArray(procs) ? procs : [procs]
            for (const proc of procList) {
              if (proc.Name) {
                hooks.push({
                  type: 'Keyboard API Usage',
                  process: proc.Name,
                  pid: proc.ProcessId,
                  risk: 'high',
                  description: 'Process using keyboard monitoring APIs',
                  detected: new Date().toISOString()
                })
              }
            }
          } catch (e) {}
        }
        checkComplete()
      })

    function checkComplete() {
      completed++
      if (completed === total) {
        resolve({ success: true, hooks, scannedAt: new Date().toISOString() })
      }
    }
  })
}

async function scanLinuxKeyboardAccess() {
  return new Promise((resolve) => {
    const hooks = []
    let completed = 0
    const total = 3

    // Check processes accessing /dev/input devices
    exec(`lsof /dev/input/* 2>/dev/null | tail -n +2`,
      (error, stdout) => {
        if (stdout.trim()) {
          const lines = stdout.trim().split('\n')
          for (const line of lines) {
            const parts = line.split(/\s+/)
            if (parts.length > 0) {
              hooks.push({
                type: 'Input Device Access',
                process: parts[0],
                pid: parts[1],
                risk: analyzeHookRisk(parts[0]),
                description: 'Process accessing input devices',
                detected: new Date().toISOString()
              })
            }
          }
        }
        checkComplete()
      })

    // Check for known Linux keyloggers
    exec(`ps aux | grep -iE "(logkeys|lkl|keylogger|xspy|xinput)" | grep -v grep`,
      (error, stdout) => {
        if (stdout.trim()) {
          const lines = stdout.trim().split('\n')
          for (const line of lines) {
            const parts = line.split(/\s+/)
            hooks.push({
              type: 'Known Keylogger',
              process: parts.slice(10).join(' '),
              risk: 'high',
              description: 'Known Linux keylogger detected',
              detected: new Date().toISOString()
            })
          }
        }
        checkComplete()
      })

    // Check X11 keyboard grabbing
    exec(`xinput list 2>/dev/null | grep -i keyboard`,
      (error, stdout) => {
        if (stdout.trim()) {
          const lines = stdout.trim().split('\n')
          for (const line of lines) {
            hooks.push({
              type: 'X11 Keyboard Device',
              process: line.trim(),
              risk: 'safe',
              description: 'X11 keyboard input device',
              detected: new Date().toISOString()
            })
          }
        }
        checkComplete()
      })

    function checkComplete() {
      completed++
      if (completed === total) {
        resolve({ success: true, hooks, scannedAt: new Date().toISOString() })
      }
    }
  })
}

function analyzeHookRisk(name) {
  const nameLower = (name || '').toLowerCase()

  for (const sig of KEYLOGGER_SIGNATURES.processNames) {
    if (nameLower.includes(sig)) return 'high'
  }

  for (const legit of KEYLOGGER_SIGNATURES.legitimateKeyboardApps) {
    if (nameLower.includes(legit)) return 'safe'
  }

  const safeApps = ['system', 'apple', 'microsoft', 'google', 'terminal', 'iterm',
                    'code', 'vscode', 'chrome', 'firefox', 'safari', 'finder', 'dock']
  for (const safe of safeApps) {
    if (nameLower.includes(safe)) return 'safe'
  }

  if (KEYLOGGER_SIGNATURES.suspiciousKeywords.some(k => nameLower.includes(k))) {
    return 'medium'
  }

  return 'low'
}

// ========== Persistence Scanning ==========

ipcMain.handle('scan-persistence', async () => {
  const platform = os.platform()

  try {
    if (platform === 'darwin') {
      return await scanMacPersistence()
    } else if (platform === 'win32') {
      return await scanWindowsPersistence()
    } else {
      return await scanLinuxPersistence()
    }
  } catch (error) {
    return { success: false, error: error.message, items: [] }
  }
})

async function scanMacPersistence() {
  return new Promise((resolve) => {
    const items = []
    const launchPaths = [
      { path: path.join(os.homedir(), 'Library/LaunchAgents'), type: 'User LaunchAgent' },
      { path: '/Library/LaunchAgents', type: 'System LaunchAgent' },
      { path: '/Library/LaunchDaemons', type: 'LaunchDaemon' },
      { path: path.join(os.homedir(), 'Library/Application Support'), type: 'App Support' }
    ]

    let completed = 0

    for (const location of launchPaths) {
      exec(`ls -la "${location.path}" 2>/dev/null`, (error, stdout) => {
        if (stdout) {
          const lines = stdout.split('\n').filter(l => l.includes('.plist') || l.includes('.app'))
          for (const line of lines) {
            const parts = line.split(/\s+/)
            const filename = parts[parts.length - 1]
            if (filename && filename !== '.' && filename !== '..') {
              // Try to read plist content for analysis
              const fullPath = path.join(location.path, filename)
              let plistContent = ''
              try {
                plistContent = execSync(`plutil -p "${fullPath}" 2>/dev/null || cat "${fullPath}" 2>/dev/null`, { encoding: 'utf8', timeout: 5000 })
              } catch (e) {}

              items.push({
                location: location.type,
                path: fullPath,
                name: filename,
                content: plistContent.substring(0, 500),
                risk: analyzePersistenceRisk(filename, plistContent)
              })
            }
          }
        }
        completed++
        if (completed === launchPaths.length) {
          // Also check login items
          exec(`osascript -e 'tell application "System Events" to get the name of every login item' 2>/dev/null`, (err, loginItems) => {
            if (loginItems) {
              const logins = loginItems.trim().split(', ')
              for (const login of logins) {
                if (login) {
                  items.push({
                    location: 'Login Item',
                    name: login,
                    risk: analyzePersistenceRisk(login, '')
                  })
                }
              }
            }
            resolve({ success: true, items })
          })
        }
      })
    }
  })
}

async function scanWindowsPersistence() {
  return new Promise((resolve) => {
    const items = []
    const regLocations = [
      'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
      'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce',
      'HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
      'HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce',
      'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run',
      'HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run'
    ]

    let completed = 0

    for (const location of regLocations) {
      exec(`reg query "${location}" 2>nul`, (error, stdout) => {
        if (!error && stdout) {
          const lines = stdout.split('\n').filter(l => l.includes('REG_'))
          for (const line of lines) {
            const match = line.trim().match(/^\s*(\S+)\s+REG_\w+\s+(.*)$/)
            if (match) {
              const name = match[1]
              const value = match[2]
              items.push({
                location: location.includes('CURRENT_USER') ? 'User Registry' : 'System Registry',
                registryKey: location,
                name,
                value,
                risk: analyzePersistenceRisk(name, value)
              })
            }
          }
        }
        completed++
        if (completed === regLocations.length) {
          // Also check startup folder
          const startupPaths = [
            path.join(os.homedir(), 'AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup'),
            'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup'
          ]

          for (const startupPath of startupPaths) {
            try {
              const files = fs.readdirSync(startupPath)
              for (const file of files) {
                items.push({
                  location: 'Startup Folder',
                  path: path.join(startupPath, file),
                  name: file,
                  risk: analyzePersistenceRisk(file, startupPath)
                })
              }
            } catch (e) {}
          }

          resolve({ success: true, items })
        }
      })
    }
  })
}

async function scanLinuxPersistence() {
  return new Promise((resolve) => {
    const items = []
    let completed = 0
    const total = 5

    // Check systemd user services
    exec(`systemctl --user list-unit-files --type=service 2>/dev/null | grep enabled`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.trim().split('\n')
        for (const line of lines) {
          const parts = line.split(/\s+/)
          if (parts[0]) {
            items.push({
              location: 'systemd user service',
              name: parts[0],
              risk: analyzePersistenceRisk(parts[0], '')
            })
          }
        }
      }
      checkComplete()
    })

    // Check crontab
    exec(`crontab -l 2>/dev/null`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.trim().split('\n').filter(l => !l.startsWith('#') && l.trim())
        for (const line of lines) {
          items.push({
            location: 'User Crontab',
            name: line.substring(0, 100),
            command: line,
            risk: analyzePersistenceRisk(line, line)
          })
        }
      }
      checkComplete()
    })

    // Check autostart
    const autostartPath = path.join(os.homedir(), '.config/autostart')
    exec(`ls -la "${autostartPath}" 2>/dev/null`, (error, stdout) => {
      if (stdout) {
        const files = stdout.split('\n').filter(l => l.includes('.desktop'))
        for (const file of files) {
          const parts = file.split(/\s+/)
          const filename = parts[parts.length - 1]
          items.push({
            location: 'Autostart',
            path: path.join(autostartPath, filename),
            name: filename,
            risk: analyzePersistenceRisk(filename, '')
          })
        }
      }
      checkComplete()
    })

    // Check .bashrc and .profile for suspicious entries
    const rcFiles = ['.bashrc', '.profile', '.bash_profile', '.zshrc']
    let rcCompleted = 0
    for (const rcFile of rcFiles) {
      const rcPath = path.join(os.homedir(), rcFile)
      exec(`grep -iE "(keylog|capture|hook|spy)" "${rcPath}" 2>/dev/null`, (error, stdout) => {
        if (stdout) {
          items.push({
            location: `Shell RC (${rcFile})`,
            name: rcFile,
            content: stdout.trim().substring(0, 200),
            risk: { level: 'high', reason: 'Suspicious shell configuration' }
          })
        }
        rcCompleted++
        if (rcCompleted === rcFiles.length) checkComplete()
      })
    }

    // Check /etc/rc.local
    exec(`cat /etc/rc.local 2>/dev/null | grep -v "^#" | grep -v "^$"`, (error, stdout) => {
      if (stdout) {
        items.push({
          location: 'rc.local',
          name: '/etc/rc.local',
          content: stdout.trim().substring(0, 200),
          risk: analyzePersistenceRisk(stdout, stdout)
        })
      }
      checkComplete()
    })

    function checkComplete() {
      completed++
      if (completed === total) {
        resolve({ success: true, items })
      }
    }
  })
}

function analyzePersistenceRisk(name, content) {
  const combined = ((name || '') + ' ' + (content || '')).toLowerCase()

  for (const sig of KEYLOGGER_SIGNATURES.processNames) {
    if (combined.includes(sig)) {
      return { level: 'high', reason: `Keylogger signature: ${sig}` }
    }
  }

  let suspiciousCount = 0
  const found = []
  for (const keyword of KEYLOGGER_SIGNATURES.suspiciousKeywords) {
    if (combined.includes(keyword)) {
      suspiciousCount++
      found.push(keyword)
    }
  }

  if (suspiciousCount >= 2) {
    return { level: 'high', reason: `Multiple suspicious keywords: ${found.join(', ')}` }
  } else if (suspiciousCount === 1) {
    return { level: 'medium', reason: `Suspicious keyword: ${found[0]}` }
  }

  // Check for hidden/unusual characteristics
  if (name && name.startsWith('.')) {
    return { level: 'low', reason: 'Hidden file/entry' }
  }

  return { level: 'safe', reason: 'Normal startup item' }
}

// ========== Network Connection Scanning ==========

ipcMain.handle('scan-network', async () => {
  const platform = os.platform()

  try {
    if (platform === 'darwin' || platform === 'linux') {
      return await scanUnixNetwork()
    } else {
      return await scanWindowsNetwork()
    }
  } catch (error) {
    return { success: false, error: error.message, connections: [] }
  }
})

async function scanUnixNetwork() {
  return new Promise((resolve) => {
    exec(`netstat -an 2>/dev/null || ss -tuln 2>/dev/null`, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message, connections: [] })
        return
      }

      const connections = []
      const lines = stdout.trim().split('\n')

      for (const line of lines) {
        if (line.includes('ESTABLISHED') || line.includes('LISTEN')) {
          const parts = line.trim().split(/\s+/)
          connections.push({
            protocol: parts[0],
            localAddress: parts[3] || parts[4],
            foreignAddress: parts[4] || parts[5],
            state: line.includes('ESTABLISHED') ? 'ESTABLISHED' : 'LISTEN',
            raw: line
          })
        }
      }

      resolve({ success: true, connections })
    })
  })
}

async function scanWindowsNetwork() {
  return new Promise((resolve) => {
    exec(`netstat -ano`, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message, connections: [] })
        return
      }

      const connections = []
      const lines = stdout.trim().split('\n')

      for (const line of lines) {
        if (line.includes('ESTABLISHED') || line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/)
          if (parts.length >= 5) {
            connections.push({
              protocol: parts[0],
              localAddress: parts[1],
              foreignAddress: parts[2],
              state: parts[3],
              pid: parts[4]
            })
          }
        }
      }

      resolve({ success: true, connections })
    })
  })
}

// ========== System Information ==========

ipcMain.handle('get-system-info', async () => {
  const platform = os.platform()
  let osVersion = ''

  try {
    if (platform === 'darwin') {
      osVersion = execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim()
    } else if (platform === 'win32') {
      osVersion = execSync('ver', { encoding: 'utf8' }).trim()
    } else {
      osVersion = execSync('uname -r', { encoding: 'utf8' }).trim()
    }
  } catch (e) {
    osVersion = os.release()
  }

  return {
    platform: platform,
    platformName: platform === 'darwin' ? 'macOS' : platform === 'win32' ? 'Windows' : 'Linux',
    osVersion,
    arch: os.arch(),
    hostname: os.hostname(),
    cpus: os.cpus().length,
    cpuModel: os.cpus()[0]?.model || 'Unknown',
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    usedMemory: os.totalmem() - os.freemem(),
    memoryUsagePercent: Math.round((1 - os.freemem() / os.totalmem()) * 100),
    uptime: os.uptime(),
    uptimeFormatted: formatUptime(os.uptime()),
    username: os.userInfo().username,
    homeDir: os.homedir(),
    tempDir: os.tmpdir()
  }
})

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

// ========== Full System Scan ==========

ipcMain.handle('run-full-scan', async (event) => {
  const results = {
    processes: [],
    hooks: [],
    persistence: [],
    network: [],
    threats: [],
    scannedAt: new Date().toISOString()
  }

  try {
    // Scan processes (20%)
    event.sender.send('scan-progress', { stage: 'processes', progress: 5 })
    const processResult = await scanProcessesInternal()
    if (processResult.success) {
      results.processes = processResult.processes
      const highRiskProcesses = processResult.processes.filter(p => p.risk.level === 'high')
      results.threats.push(...highRiskProcesses.map(p => ({
        type: 'Suspicious Process',
        name: p.name,
        pid: p.pid,
        path: p.path,
        reason: p.risk.reason,
        details: p.risk.details,
        severity: 'high'
      })))
    }
    event.sender.send('scan-progress', { stage: 'processes', progress: 25 })

    // Scan hooks (40%)
    event.sender.send('scan-progress', { stage: 'hooks', progress: 30 })
    const hookResult = await scanHooksInternal()
    if (hookResult.success) {
      results.hooks = hookResult.hooks
      const highRiskHooks = hookResult.hooks.filter(h => h.risk === 'high')
      results.threats.push(...highRiskHooks.map(h => ({
        type: 'Keyboard Hook',
        name: h.process,
        hookType: h.type,
        reason: h.description,
        severity: 'high'
      })))
    }
    event.sender.send('scan-progress', { stage: 'hooks', progress: 50 })

    // Scan persistence (60%)
    event.sender.send('scan-progress', { stage: 'persistence', progress: 55 })
    const persistResult = await scanPersistenceInternal()
    if (persistResult.success) {
      results.persistence = persistResult.items
      const highRiskPersist = persistResult.items.filter(i => i.risk.level === 'high')
      results.threats.push(...highRiskPersist.map(i => ({
        type: 'Persistence Mechanism',
        name: i.name,
        location: i.location,
        reason: i.risk.reason,
        severity: 'high'
      })))
    }
    event.sender.send('scan-progress', { stage: 'persistence', progress: 75 })

    // Scan network (80%)
    event.sender.send('scan-progress', { stage: 'network', progress: 80 })
    const networkResult = await scanNetworkInternal()
    if (networkResult.success) {
      results.network = networkResult.connections
    }
    event.sender.send('scan-progress', { stage: 'network', progress: 95 })

    event.sender.send('scan-progress', { stage: 'complete', progress: 100 })

    return {
      success: true,
      results,
      summary: {
        totalProcesses: results.processes.length,
        totalHooks: results.hooks.length,
        totalPersistence: results.persistence.length,
        totalConnections: results.network.length,
        threatsFound: results.threats.length,
        highRiskCount: results.threats.filter(t => t.severity === 'high').length,
        mediumRiskCount: results.processes.filter(p => p.risk.level === 'medium').length +
                        results.hooks.filter(h => h.risk === 'medium').length +
                        results.persistence.filter(i => i.risk.level === 'medium').length,
        riskLevel: results.threats.length > 0 ? 'high' : 'safe'
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Internal helper functions for full scan
async function scanProcessesInternal() {
  const platform = os.platform()
  if (platform === 'darwin') return await scanMacProcesses()
  if (platform === 'win32') return await scanWindowsProcesses()
  return await scanLinuxProcesses()
}

async function scanHooksInternal() {
  const platform = os.platform()
  if (platform === 'darwin') return await scanMacKeyboardAccess()
  if (platform === 'win32') return await scanWindowsHooks()
  return await scanLinuxKeyboardAccess()
}

async function scanPersistenceInternal() {
  const platform = os.platform()
  if (platform === 'darwin') return await scanMacPersistence()
  if (platform === 'win32') return await scanWindowsPersistence()
  return await scanLinuxPersistence()
}

async function scanNetworkInternal() {
  const platform = os.platform()
  if (platform === 'win32') return await scanWindowsNetwork()
  return await scanUnixNetwork()
}

// ========== External Links ==========

ipcMain.handle('open-external', async (event, url) => {
  shell.openExternal(url)
})
