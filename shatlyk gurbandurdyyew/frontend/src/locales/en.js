export default {
  nav: {
    home: 'Home',
    rules: 'Rules',
    traffic: 'Traffic',
    ai: 'AI Engine',
    howItWorks: 'How It Works',
    about: 'About'
  },
  home: {
    title: 'AI Firewall',
    subtitle: 'Intelligent Network Protection with Machine Learning',
    description: 'Next-generation firewall that uses artificial intelligence to automatically detect threats, learn from traffic patterns, and optimize security rules in real-time.',
    features: {
      ai: {
        title: 'AI-Powered Detection',
        desc: 'Machine learning algorithms detect zero-day threats'
      },
      auto: {
        title: 'Auto Rule Generation',
        desc: 'Automatically create optimal firewall rules'
      },
      traffic: {
        title: 'Traffic Analysis',
        desc: 'Real-time network traffic monitoring and analysis'
      },
      adapt: {
        title: 'Adaptive Learning',
        desc: 'Continuously learns and adapts to new threats'
      }
    },
    viewRules: 'View Rules',
    aiEngine: 'AI Engine'
  },
  rules: {
    title: 'Firewall Rules',
    subtitle: 'Manage and configure firewall rules',
    addRule: 'Add Rule',
    aiSuggest: 'AI Suggestions',
    columns: {
      id: 'ID',
      name: 'Rule Name',
      source: 'Source',
      dest: 'Destination',
      port: 'Port',
      protocol: 'Protocol',
      action: 'Action',
      status: 'Status',
      aiScore: 'AI Score'
    },
    actions: {
      allow: 'Allow',
      deny: 'Deny',
      drop: 'Drop',
      log: 'Log'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive'
    },
    suggestions: {
      title: 'AI Rule Suggestions',
      desc: 'Based on traffic analysis, AI suggests the following rules:',
      apply: 'Apply',
      dismiss: 'Dismiss'
    }
  },
  traffic: {
    title: 'Traffic Monitor',
    subtitle: 'Real-time network traffic analysis',
    stats: {
      incoming: 'Incoming',
      outgoing: 'Outgoing',
      blocked: 'Blocked',
      allowed: 'Allowed'
    },
    protocols: 'Protocol Distribution',
    topSources: 'Top Source IPs',
    topDestinations: 'Top Destinations',
    recentConnections: 'Recent Connections',
    columns: {
      time: 'Time',
      source: 'Source',
      dest: 'Destination',
      protocol: 'Protocol',
      status: 'Status',
      aiDecision: 'AI Decision'
    }
  },
  ai: {
    title: 'AI Engine',
    subtitle: 'Machine learning powered threat detection',
    model: {
      title: 'AI Model Status',
      name: 'Neural Network Classifier',
      accuracy: 'Accuracy',
      trained: 'Last Trained',
      samples: 'Training Samples'
    },
    threats: {
      title: 'Detected Threats',
      none: 'No threats detected',
      type: 'Threat Type',
      confidence: 'Confidence',
      source: 'Source',
      action: 'Action Taken'
    },
    learning: {
      title: 'Learning Progress',
      patterns: 'Traffic Patterns Learned',
      rules: 'Rules Auto-Generated',
      threats: 'Threats Detected Today'
    },
    capabilities: {
      title: 'AI Capabilities',
      anomaly: 'Anomaly Detection',
      malware: 'Malware Traffic Detection',
      ddos: 'DDoS Attack Prevention',
      intrusion: 'Intrusion Detection',
      behavioral: 'Behavioral Analysis',
      zeroDay: 'Zero-Day Threat Detection'
    }
  },
  howItWorks: {
    title: 'How AI Firewall Works',
    subtitle: 'Understanding intelligent network protection',
    steps: {
      step1: {
        title: 'Traffic Capture',
        desc: 'Capture and analyze all network packets'
      },
      step2: {
        title: 'Feature Extraction',
        desc: 'Extract features from packets for ML analysis'
      },
      step3: {
        title: 'AI Classification',
        desc: 'Neural network classifies traffic as safe or threat'
      },
      step4: {
        title: 'Rule Generation',
        desc: 'Automatically generate or update firewall rules'
      },
      step5: {
        title: 'Continuous Learning',
        desc: 'Learn from new traffic patterns and improve'
      }
    },
    faq: {
      q1: {
        question: 'What is an AI Firewall?',
        answer: 'An AI firewall uses machine learning algorithms to analyze network traffic, detect threats, and automatically generate optimal security rules. Unlike traditional firewalls that rely on static rules, AI firewalls can adapt to new threats in real-time.'
      },
      q2: {
        question: 'How does AI detect threats?',
        answer: 'AI analyzes traffic patterns, packet characteristics, and behavioral anomalies using trained neural networks. It can identify known threats and detect previously unseen (zero-day) attacks by recognizing suspicious patterns.'
      },
      q3: {
        question: 'What are the advantages over traditional firewalls?',
        answer: 'AI firewalls offer: automatic rule optimization, zero-day threat detection, reduced false positives, adaptive learning, behavioral analysis, and reduced manual configuration overhead.'
      },
      q4: {
        question: 'How does automatic rule generation work?',
        answer: 'The AI analyzes traffic patterns and learns what constitutes normal behavior. When it detects anomalies or threats, it can automatically create, modify, or suggest firewall rules to block the threat while minimizing impact on legitimate traffic.'
      }
    }
  },
  about: {
    subtitle: 'Intelligent Network Protection with AI',
    description: 'This diploma project demonstrates how artificial intelligence can be used to automate firewall management, detect threats, and optimize network security rules in real-time.',
    author: {
      title: 'Author',
      name: 'Shatlyk Gurbandurdyyew',
      project: 'Diploma Project',
      topic: 'Firewall Automation with Artificial Intelligence',
      topicTk: 'Emeli intellekt bilen firewall awtomatizasiýasy'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning'
  }
}
