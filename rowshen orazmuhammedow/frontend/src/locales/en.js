export default {
  nav: {
    home: 'Home',
    scan: 'Scan',
    processes: 'Processes',
    protection: 'Protection',
    howItWorks: 'How It Works',
    about: 'About'
  },
  home: {
    title: 'KeyGuard',
    subtitle: 'Advanced Keylogger Detection for Windows',
    description: 'Protect your privacy by detecting and removing keyloggers from your Windows system. Our advanced scanning technology identifies hidden threats that monitor your keystrokes.',
    features: {
      scan: {
        title: 'Deep System Scan',
        desc: 'Scan processes, registry, and startup items for keyloggers'
      },
      realtime: {
        title: 'Real-time Monitoring',
        desc: 'Monitor keyboard hooks and suspicious API calls'
      },
      process: {
        title: 'Process Analysis',
        desc: 'Analyze running processes for keylogging behavior'
      },
      protect: {
        title: 'Active Protection',
        desc: 'Block unauthorized keyboard monitoring attempts'
      }
    },
    startScan: 'Start Scan',
    viewProcesses: 'View Processes'
  },
  scan: {
    title: 'System Scan',
    subtitle: 'Detect keyloggers and keyboard monitoring software',
    quickScan: 'Quick Scan',
    fullScan: 'Full Scan',
    customScan: 'Custom Scan',
    scanning: 'Scanning...',
    scanComplete: 'Scan Complete',
    threatsFound: 'Threats Found',
    noThreats: 'No Threats Found',
    scanAreas: {
      processes: 'Running Processes',
      registry: 'Registry Keys',
      startup: 'Startup Items',
      hooks: 'Keyboard Hooks',
      files: 'Suspicious Files',
      network: 'Network Connections'
    },
    results: {
      title: 'Scan Results',
      clean: 'Your system is clean!',
      infected: 'Potential threats detected!',
      name: 'Name',
      type: 'Type',
      location: 'Location',
      risk: 'Risk Level',
      action: 'Action',
      remove: 'Remove',
      quarantine: 'Quarantine',
      ignore: 'Ignore'
    }
  },
  processes: {
    title: 'Process Monitor',
    subtitle: 'Analyze running processes for keylogging behavior',
    refresh: 'Refresh',
    filter: 'Filter processes...',
    columns: {
      pid: 'PID',
      name: 'Process Name',
      cpu: 'CPU',
      memory: 'Memory',
      hooks: 'KB Hooks',
      risk: 'Risk',
      action: 'Action'
    },
    analyze: 'Analyze',
    terminate: 'Terminate',
    riskLevels: {
      safe: 'Safe',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical'
    },
    details: {
      title: 'Process Details',
      path: 'Path',
      publisher: 'Publisher',
      started: 'Started',
      threads: 'Threads',
      handles: 'Handles'
    }
  },
  protection: {
    title: 'Active Protection',
    subtitle: 'Configure real-time protection settings',
    settings: {
      hookMonitor: {
        name: 'Keyboard Hook Monitor',
        desc: 'Monitor for unauthorized keyboard hooks'
      },
      apiMonitor: {
        name: 'API Call Monitor',
        desc: 'Track suspicious API calls (GetAsyncKeyState, SetWindowsHookEx)'
      },
      processGuard: {
        name: 'Process Guard',
        desc: 'Alert when new processes attempt keyboard access'
      },
      clipboardGuard: {
        name: 'Clipboard Guard',
        desc: 'Protect clipboard from unauthorized access'
      },
      networkGuard: {
        name: 'Network Guard',
        desc: 'Block suspicious outbound connections'
      },
      autoScan: {
        name: 'Automatic Scanning',
        desc: 'Scan system on startup and periodically'
      }
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      protected: 'Protected',
      vulnerable: 'Vulnerable'
    }
  },
  howItWorks: {
    title: 'How Keylogger Detection Works',
    subtitle: 'Understanding keylogger threats and detection methods',
    steps: {
      step1: {
        title: 'Hook Detection',
        desc: 'Monitor Windows keyboard hooks (SetWindowsHookEx)'
      },
      step2: {
        title: 'API Analysis',
        desc: 'Track suspicious API calls like GetAsyncKeyState'
      },
      step3: {
        title: 'Process Scan',
        desc: 'Analyze process behavior and memory patterns'
      },
      step4: {
        title: 'Registry Check',
        desc: 'Scan registry for persistence mechanisms'
      },
      step5: {
        title: 'Threat Response',
        desc: 'Remove or quarantine detected threats'
      }
    },
    keyloggerTypes: {
      title: 'Types of Keyloggers',
      software: {
        name: 'Software Keyloggers',
        desc: 'Programs that run in the background and record keystrokes',
        examples: 'Hook-based, API-based, Form grabbers'
      },
      hardware: {
        name: 'Hardware Keyloggers',
        desc: 'Physical devices attached between keyboard and computer',
        examples: 'USB keyloggers, Wireless sniffers'
      },
      kernel: {
        name: 'Kernel Keyloggers',
        desc: 'Operate at kernel level, very difficult to detect',
        examples: 'Rootkit-based, Driver-based'
      }
    },
    faq: {
      q1: {
        question: 'What is a keylogger?',
        answer: 'A keylogger is malicious software or hardware that records keystrokes on a computer. It can capture passwords, credit card numbers, messages, and other sensitive information typed by the user.'
      },
      q2: {
        question: 'How do keyloggers work?',
        answer: 'Software keyloggers typically use Windows hooks (SetWindowsHookEx) or API monitoring to intercept keystrokes. They may also scan application memory or use kernel-level drivers.'
      },
      q3: {
        question: 'How can I protect myself?',
        answer: 'Use reputable antivirus software, keep your system updated, be careful with downloads, use virtual keyboards for sensitive input, and regularly scan for keyloggers.'
      },
      q4: {
        question: 'What are signs of a keylogger?',
        answer: 'Signs include slow computer performance, unusual network activity, unknown processes running, and browser or typing delays. However, sophisticated keyloggers may show no obvious signs.'
      }
    }
  },
  about: {
    subtitle: 'Advanced Keylogger Detection for Windows',
    description: 'This diploma project demonstrates techniques for detecting and removing keyloggers from Windows systems. It shows how keyloggers work and how to protect against them.',
    author: {
      title: 'Author',
      name: 'Rowshen Orazmuhammedow',
      project: 'Diploma Project',
      topic: 'Keylogger Detection in Windows Operating System',
      topicTk: 'Windows operasion ulgamynda keylogger-leri ýüze çykarmak'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning'
  }
}
