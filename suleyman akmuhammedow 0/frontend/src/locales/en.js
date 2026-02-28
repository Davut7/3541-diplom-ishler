export default {
  nav: {
    home: 'Home',
    analyze: 'Analyze',
    history: 'History',
    howItWorks: 'How It Works',
    comparison: 'Comparison',
    about: 'About'
  },
  footer: {
    diploma: 'Diploma Project',
    author: 'Author'
  },
  home: {
    title: 'OSINT Intelligence Analyzer',
    subtitle: 'AI-Assisted Open Source Intelligence Tools for Ethical Cybersecurity Research',
    description: 'Powerful reconnaissance and intelligence gathering tool that helps security professionals analyze targets using publicly available information.',
    startAnalysis: 'Start Analysis',
    viewHistory: 'View History',
    features: {
      title: 'Key Features',
      dns: {
        title: 'DNS Reconnaissance',
        desc: 'Resolve domain names, find DNS records, and discover related infrastructure.'
      },
      whois: {
        title: 'WHOIS Intelligence',
        desc: 'Gather domain registration information, ownership details, and expiration dates.'
      },
      geo: {
        title: 'IP Geolocation',
        desc: 'Determine geographic location, ISP, and organization details from IP addresses.'
      },
      ports: {
        title: 'Port Scanning',
        desc: 'Identify open ports and running services to assess potential attack surface.'
      },
      risk: {
        title: 'Risk Assessment',
        desc: 'AI-powered analysis to calculate threat scores based on discovered vulnerabilities.'
      },
      reports: {
        title: 'Report Generation',
        desc: 'Generate detailed intelligence reports in multiple formats for documentation.'
      }
    },
    stats: {
      scansPerformed: 'Scans Performed',
      targetsAnalyzed: 'Targets Analyzed',
      risksIdentified: 'Risks Identified',
      reportsGenerated: 'Reports Generated'
    }
  },
  analyze: {
    title: 'Target Analysis',
    subtitle: 'Enter an IP address or domain name to analyze',
    placeholder: 'Enter target (e.g., example.com or 8.8.8.8)',
    startScan: 'Start Scan',
    scanning: 'Scanning...',
    demo: 'Try Demo',
    results: {
      title: 'Analysis Results',
      target: 'Target',
      ip: 'IP Address',
      riskScore: 'Risk Score',
      riskLevel: 'Risk Level',
      location: 'Location',
      isp: 'ISP Provider',
      organization: 'Organization',
      dns: 'DNS Records',
      whois: 'WHOIS Data',
      ports: 'Open Ports',
      registrar: 'Registrar',
      created: 'Created',
      expires: 'Expires',
      ping: 'Ping',
      ttl: 'TTL'
    },
    risks: {
      critical: 'CRITICAL',
      high: 'HIGH',
      medium: 'MEDIUM',
      low: 'LOW'
    },
    tabs: {
      overview: 'Overview',
      dns: 'DNS',
      whois: 'WHOIS',
      ports: 'Ports',
      security: 'Security'
    },
    security: {
      issues: 'Security Issues',
      warnings: 'Warnings',
      recommendations: 'Recommendations'
    }
  },
  history: {
    title: 'Analysis History',
    subtitle: 'View your previous scans and analysis results',
    empty: 'No analysis history yet. Start your first scan!',
    columns: {
      target: 'Target',
      ip: 'IP Address',
      risk: 'Risk Score',
      date: 'Date',
      actions: 'Actions'
    },
    actions: {
      view: 'View',
      export: 'Export',
      delete: 'Delete'
    },
    stats: {
      title: 'Statistics',
      totalScans: 'Total Scans',
      avgRisk: 'Average Risk Score',
      highRisk: 'High Risk Targets',
      lastScan: 'Last Scan'
    },
    clear: 'Clear History',
    confirmClear: 'Are you sure you want to clear all history?'
  },
  howItWorks: {
    title: 'How OSINT Analysis Works',
    subtitle: 'Understanding the intelligence gathering process',
    intro: 'OSINT (Open Source Intelligence) is the collection and analysis of information from publicly available sources. Our tool automates this process to help security professionals assess potential risks.',
    steps: {
      title: 'Analysis Process',
      step1: {
        title: '1. Target Input',
        desc: 'Enter a domain name or IP address. The system validates the input and prepares for analysis.'
      },
      step2: {
        title: '2. DNS Resolution',
        desc: 'The tool resolves domain names to IP addresses and discovers related DNS records (A, AAAA, MX, TXT, NS).'
      },
      step3: {
        title: '3. WHOIS Lookup',
        desc: 'Queries WHOIS databases to retrieve registration information, ownership details, and important dates.'
      },
      step4: {
        title: '4. Geolocation',
        desc: 'Determines the physical location of the IP address, including country, city, ISP, and organization.'
      },
      step5: {
        title: '5. Port Scanning',
        desc: 'Scans common ports to identify running services and potential entry points.'
      },
      step6: {
        title: '6. Risk Assessment',
        desc: 'AI analyzes all gathered data to calculate a risk score based on exposed services and configurations.'
      }
    },
    faq: {
      title: 'Frequently Asked Questions',
      q1: {
        question: 'What is OSINT?',
        answer: 'OSINT (Open Source Intelligence) refers to the collection and analysis of data gathered from open sources such as public websites, DNS records, WHOIS databases, and other publicly accessible information.'
      },
      q2: {
        question: 'Is this tool legal to use?',
        answer: 'Yes, OSINT analysis using publicly available information is legal. However, always ensure you have proper authorization before scanning any targets. This tool is designed for educational and authorized security testing purposes only.'
      },
      q3: {
        question: 'How is the risk score calculated?',
        answer: 'The risk score is calculated based on multiple factors: number and type of open ports, exposed services, DNS configuration, and known vulnerability patterns. Critical services like SSH, RDP, and databases increase the risk score.'
      },
      q4: {
        question: 'What technologies are used?',
        answer: 'The frontend is built with Vue.js and PrimeVue for the UI. The backend uses Node.js with Express for API handling. We use native Node.js modules for DNS resolution and network operations.'
      },
      q5: {
        question: 'Can I export the results?',
        answer: 'Yes, you can export analysis results in multiple formats including JSON and HTML. Reports include all gathered intelligence and can be used for documentation or further analysis.'
      }
    },
    techStack: {
      title: 'Technology Stack',
      frontend: 'Frontend',
      backend: 'Backend',
      features: 'Features'
    }
  },
  comparison: {
    title: 'Tool Comparison',
    subtitle: 'How OSINT.AI compares to other tools',
    features: {
      dnsLookup: 'DNS Lookup',
      whoisQuery: 'WHOIS Query',
      geoLocation: 'IP Geolocation',
      portScanning: 'Port Scanning',
      riskAssessment: 'Risk Assessment',
      reportGeneration: 'Report Generation',
      multilingual: 'Multilingual (EN/TM)',
      freeToUse: 'Free to Use',
      noApiKey: 'No API Key Required',
      localExecution: 'Local Execution',
      openSource: 'Open Source',
      privacyFocused: 'Privacy Focused'
    },
    tools: {
      osint: 'OSINT.AI',
      shodan: 'Shodan',
      censys: 'Censys',
      nmap: 'Nmap'
    },
    legend: {
      yes: 'Yes',
      no: 'No',
      partial: 'Partial',
      paid: 'Paid'
    },
    advantages: {
      title: 'Our Advantages',
      free: {
        title: 'Completely Free',
        desc: 'No subscription fees or API costs. Use all features without any payment.'
      },
      privacy: {
        title: 'Privacy First',
        desc: 'All analysis is performed locally. Your data never leaves your machine.'
      },
      bilingual: {
        title: 'Bilingual Interface',
        desc: 'Full support for English and Turkmen languages.'
      },
      simple: {
        title: 'Easy to Use',
        desc: 'Clean interface designed for both beginners and professionals.'
      }
    }
  },
  about: {
    title: 'About OSINT.AI',
    subtitle: 'AI-Assisted Open Source Intelligence Tools for Ethical Cybersecurity Research',
    description: 'OSINT.AI is a diploma project developed to demonstrate modern approaches to open source intelligence gathering and analysis. The tool combines various reconnaissance techniques with AI-powered risk assessment to help security professionals identify potential vulnerabilities.',
    whatIsOsint: {
      title: 'What is OSINT?',
      content: 'Open Source Intelligence (OSINT) refers to the collection, analysis, and use of information gathered from publicly available sources. This includes websites, social media, public records, DNS records, WHOIS databases, and other open data sources. OSINT is widely used in cybersecurity for reconnaissance, threat intelligence, and vulnerability assessment.'
    },
    purpose: {
      title: 'Project Purpose',
      content: 'This project was developed as a diploma thesis to demonstrate practical implementation of OSINT techniques in a modern web application. It showcases skills in full-stack development, network programming, and cybersecurity concepts.'
    },
    ethical: {
      title: 'Ethical Use',
      content: 'This tool is designed for educational and authorized security testing purposes only. Always obtain proper authorization before scanning any network or system. Unauthorized scanning may be illegal in your jurisdiction.'
    },
    features: {
      title: 'Key Features',
      list: [
        'DNS reconnaissance and record discovery',
        'WHOIS information gathering',
        'IP geolocation services',
        'Port scanning and service detection',
        'AI-powered risk assessment',
        'Multi-format report generation',
        'Bilingual interface (EN/TM)',
        'Dark/Light theme support'
      ]
    },
    tech: {
      title: 'Technologies Used',
      frontend: {
        title: 'Frontend',
        items: ['Vue.js 3', 'PrimeVue UI', 'Vue Router', 'Chart.js', 'Axios']
      },
      backend: {
        title: 'Backend',
        items: ['Node.js', 'Express.js', 'DNS Module', 'Child Process']
      }
    },
    author: {
      title: 'Author',
      name: 'Süleýman Akmuhammedow',
      project: 'Diploma Project',
      topic: 'AI-Assisted OSINT Tools for Ethical Cybersecurity Research',
      topicTk: 'Emeli aň kömegi bilen OSINT guralary'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    export: 'Export',
    exportJson: 'Export JSON',
    exportHtml: 'Export HTML',
    print: 'Print',
    noData: 'No data available',
    back: 'Back',
    next: 'Next',
    search: 'Search'
  }
}
