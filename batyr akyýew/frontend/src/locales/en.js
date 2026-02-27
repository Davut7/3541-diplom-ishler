export default {
  nav: {
    home: 'Home',
    rules: 'WAF Rules',
    analyzer: 'Analyzer',
    behavioral: 'Behavioral',
    logs: 'Logs',
    statistics: 'Statistics',
    howItWorks: 'How It Works',
    about: 'About'
  },
  home: {
    title: 'WAF Behavioral Analysis',
    subtitle: 'Web Application Firewall with Intelligent User Behavior Analysis',
    description: 'Advanced web application firewall that combines traditional signature-based detection with AI-powered behavioral analysis to identify and block sophisticated attacks.',
    features: {
      waf: {
        title: 'WAF Protection',
        desc: 'Block SQL injection, XSS, and other web attacks'
      },
      behavioral: {
        title: 'Behavioral Analysis',
        desc: 'Detect anomalies based on user behavior patterns'
      },
      realtime: {
        title: 'Real-time Detection',
        desc: 'Instant threat detection and response'
      },
      learning: {
        title: 'Adaptive Learning',
        desc: 'Continuously learns normal behavior patterns'
      }
    },
    startAnalysis: 'Start Analysis',
    viewLogs: 'View Logs'
  },
  rules: {
    title: 'WAF Rules',
    subtitle: 'Manage web application firewall rules',
    addRule: 'Add Rule',
    columns: {
      name: 'Rule Name',
      pattern: 'Pattern',
      action: 'Action',
      severity: 'Severity',
      hits: 'Hits',
      status: 'Status'
    },
    actions: {
      block: 'Block',
      allow: 'Allow',
      challenge: 'Challenge',
      limit: 'Rate Limit',
      alert: 'Alert Only'
    }
  },
  analyzer: {
    title: 'Request Analyzer',
    subtitle: 'Test and analyze requests for potential threats',
    testAttack: 'Test Attack',
    attackTypes: {
      sql: 'SQL Injection',
      xss: 'XSS Attack',
      path: 'Path Traversal',
      cmd: 'Command Injection',
      normal: 'Normal Request'
    },
    results: {
      title: 'Analysis Results',
      riskScore: 'Risk Score',
      action: 'Recommended Action',
      threats: 'Detected Threats',
      behavior: 'Behavioral Score'
    }
  },
  behavioral: {
    title: 'Behavioral Analysis',
    subtitle: 'User session behavior monitoring and anomaly detection',
    sessions: 'Active Sessions',
    anomalies: 'Detected Anomalies',
    bots: 'Bot Detection',
    columns: {
      session: 'Session ID',
      requests: 'Requests',
      riskScore: 'Risk Score',
      isBot: 'Bot',
      lastSeen: 'Last Seen'
    },
    metrics: {
      typingSpeed: 'Typing Speed',
      mouseMovement: 'Mouse Movement',
      scrollPattern: 'Scroll Pattern',
      pageViews: 'Page Views'
    }
  },
  logs: {
    title: 'Attack Logs',
    subtitle: 'Real-time attack detection and blocking logs',
    columns: {
      time: 'Time',
      type: 'Attack Type',
      source: 'Source IP',
      target: 'Target',
      action: 'Action',
      riskScore: 'Risk Score'
    },
    filters: {
      all: 'All',
      blocked: 'Blocked',
      allowed: 'Allowed',
      challenged: 'Challenged'
    }
  },
  statistics: {
    title: 'Security Statistics',
    subtitle: 'Comprehensive overview of WAF performance',
    overview: {
      totalRequests: 'Total Requests',
      blockedRequests: 'Blocked',
      challengedRequests: 'Challenged',
      blockRate: 'Block Rate'
    },
    charts: {
      attackTypes: 'Attacks by Type',
      timeline: '24-Hour Timeline',
      behavioral: 'Behavioral Metrics'
    }
  },
  howItWorks: {
    title: 'How WAF Behavioral Analysis Works',
    subtitle: 'Understanding intelligent web protection',
    steps: {
      step1: {
        title: 'Request Interception',
        desc: 'All HTTP requests are intercepted and analyzed'
      },
      step2: {
        title: 'Signature Analysis',
        desc: 'Check against known attack patterns (SQL, XSS, etc.)'
      },
      step3: {
        title: 'Behavioral Analysis',
        desc: 'Analyze user behavior for anomalies'
      },
      step4: {
        title: 'Decision Engine',
        desc: 'Combine signals to make block/allow decision'
      },
      step5: {
        title: 'Adaptive Learning',
        desc: 'Update behavioral profiles continuously'
      }
    }
  },
  about: {
    title: 'About WAF Behavioral Analysis',
    subtitle: 'Intelligent Web Application Protection',
    description: 'This diploma project demonstrates a Web Application Firewall that combines traditional signature-based detection with behavioral analysis to provide comprehensive protection against both known and unknown attacks.',
    author: {
      title: 'Author',
      name: 'Batyr Akyýew',
      project: 'Diploma Project',
      topic: 'Web Application Firewall with Behavioral Analysis',
      topicTk: 'Ulanyjynyň hereketine görä işleýän web gorag ulgamy'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning'
  },
  footer: {
    diploma: 'Diploma Project',
    author: 'Author'
  }
}
