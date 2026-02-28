export default {
  nav: {
    home: 'Home',
    capture: 'Capture',
    analyze: 'Analyze',
    protocols: 'Protocols',
    statistics: 'Statistics',
    howItWorks: 'How It Works',
    about: 'About'
  },
  statistics: {
    title: 'Network Statistics',
    subtitle: 'Real-time network traffic analysis and visualization'
  },
  home: {
    title: 'WireGuard Monitor',
    subtitle: 'Professional Network Traffic Analysis Tool',
    description: 'Capture, analyze, and monitor network packets in real-time. Detect suspicious activity, understand network protocols, and ensure network security.',
    features: {
      capture: {
        title: 'Packet Capture',
        desc: 'Capture network packets in real-time from any interface'
      },
      analyze: {
        title: 'Deep Analysis',
        desc: 'Analyze packet contents, headers, and payloads'
      },
      protocols: {
        title: 'Protocol Decoding',
        desc: 'Decode and understand various network protocols'
      },
      security: {
        title: 'Security Monitoring',
        desc: 'Detect suspicious network activity and threats'
      }
    },
    startCapture: 'Start Capture',
    viewProtocols: 'View Protocols'
  },
  capture: {
    title: 'Network Packet Capture',
    subtitle: 'Capture and monitor network traffic in real-time',
    interface: 'Network Interface',
    selectInterface: 'Select interface',
    filter: 'Capture Filter',
    filterPlaceholder: 'e.g., tcp port 80, udp, host 192.168.1.1',
    startCapture: 'Start Capture',
    stopCapture: 'Stop Capture',
    clearPackets: 'Clear',
    capturing: 'Capturing...',
    packets: 'Packets',
    bytes: 'Bytes',
    table: {
      no: 'No',
      time: 'Time',
      source: 'Source',
      destination: 'Destination',
      protocol: 'Protocol',
      length: 'Length',
      info: 'Info'
    },
    interfaces: {
      eth0: 'Ethernet (eth0)',
      wlan0: 'Wi-Fi (wlan0)',
      lo: 'Loopback (lo)',
      any: 'Any Interface'
    },
    noPackets: 'No packets captured yet. Start capture to see network traffic.',
    packetDetails: 'Packet Details',
    hexDump: 'Hex Dump',
    rawData: 'Raw Data'
  },
  analyze: {
    title: 'Traffic Analysis',
    subtitle: 'Analyze captured network traffic patterns',
    uploadCapture: 'Upload Capture File',
    orPaste: 'Or paste packet data:',
    analyze: 'Analyze Traffic',
    analyzing: 'Analyzing...',
    results: 'Analysis Results',
    summary: {
      title: 'Traffic Summary',
      totalPackets: 'Total Packets',
      uniqueIPs: 'Unique IPs',
      protocols: 'Protocols',
      duration: 'Duration',
      avgSize: 'Avg Packet Size',
      bandwidth: 'Est. Bandwidth'
    },
    protocols: {
      title: 'Protocol Distribution',
      tcp: 'TCP',
      udp: 'UDP',
      icmp: 'ICMP',
      http: 'HTTP',
      https: 'HTTPS',
      dns: 'DNS',
      other: 'Other'
    },
    topTalkers: {
      title: 'Top Talkers',
      ip: 'IP Address',
      packets: 'Packets',
      bytes: 'Bytes'
    },
    anomalies: {
      title: 'Detected Anomalies',
      none: 'No anomalies detected',
      portScan: 'Potential Port Scan',
      ddos: 'Possible DDoS Pattern',
      dataExfil: 'Data Exfiltration Suspected',
      malware: 'Malware Communication Pattern'
    }
  },
  protocols: {
    title: 'Network Protocols',
    subtitle: 'Learn about common network protocols',
    search: 'Search protocols...',
    layer: 'Layer',
    categories: {
      application: 'Application Layer',
      transport: 'Transport Layer',
      network: 'Network Layer',
      dataLink: 'Data Link Layer'
    },
    list: {
      http: {
        name: 'HTTP',
        desc: 'HyperText Transfer Protocol - Web communication',
        port: '80',
        layer: 'Application'
      },
      https: {
        name: 'HTTPS',
        desc: 'HTTP Secure - Encrypted web communication',
        port: '443',
        layer: 'Application'
      },
      dns: {
        name: 'DNS',
        desc: 'Domain Name System - Resolves domain names to IPs',
        port: '53',
        layer: 'Application'
      },
      ftp: {
        name: 'FTP',
        desc: 'File Transfer Protocol - File transfers',
        port: '21',
        layer: 'Application'
      },
      ssh: {
        name: 'SSH',
        desc: 'Secure Shell - Encrypted remote access',
        port: '22',
        layer: 'Application'
      },
      smtp: {
        name: 'SMTP',
        desc: 'Simple Mail Transfer Protocol - Email sending',
        port: '25',
        layer: 'Application'
      },
      tcp: {
        name: 'TCP',
        desc: 'Transmission Control Protocol - Reliable data delivery',
        port: '-',
        layer: 'Transport'
      },
      udp: {
        name: 'UDP',
        desc: 'User Datagram Protocol - Fast, unreliable delivery',
        port: '-',
        layer: 'Transport'
      },
      ip: {
        name: 'IP',
        desc: 'Internet Protocol - Packet addressing and routing',
        port: '-',
        layer: 'Network'
      },
      icmp: {
        name: 'ICMP',
        desc: 'Internet Control Message Protocol - Network diagnostics',
        port: '-',
        layer: 'Network'
      },
      arp: {
        name: 'ARP',
        desc: 'Address Resolution Protocol - MAC address resolution',
        port: '-',
        layer: 'Data Link'
      },
      ethernet: {
        name: 'Ethernet',
        desc: 'Ethernet Frame - Physical network communication',
        port: '-',
        layer: 'Data Link'
      }
    }
  },
  howItWorks: {
    title: 'How Network Analysis Works',
    subtitle: 'Understanding packet capture and analysis',
    steps: {
      step1: {
        title: 'Packet Capture',
        desc: 'Network interface captures all passing packets using promiscuous mode'
      },
      step2: {
        title: 'Decapsulation',
        desc: 'Each packet is broken down into its protocol layers'
      },
      step3: {
        title: 'Protocol Decoding',
        desc: 'Headers and payloads are interpreted according to protocol specifications'
      },
      step4: {
        title: 'Filtering',
        desc: 'Packets are filtered based on user-defined criteria'
      },
      step5: {
        title: 'Analysis',
        desc: 'Statistical analysis reveals patterns and anomalies'
      }
    },
    faq: {
      q1: {
        question: 'What is Wireshark?',
        answer: 'Wireshark is a free and open-source packet analyzer used for network troubleshooting, analysis, software and protocol development, and education. It captures packets in real-time and displays them in human-readable format.'
      },
      q2: {
        question: 'What is promiscuous mode?',
        answer: 'Promiscuous mode allows a network interface to capture all packets on a network segment, not just those addressed to it. This is essential for network monitoring and analysis.'
      },
      q3: {
        question: 'How does packet filtering work?',
        answer: 'Packet filters use expressions to match specific criteria like protocols (tcp, udp), ports (port 80), IP addresses (host 192.168.1.1), or combinations. This helps focus on relevant traffic.'
      },
      q4: {
        question: 'Why is network monitoring important?',
        answer: 'Network monitoring helps detect security threats, troubleshoot connectivity issues, analyze application performance, and ensure network compliance. It is essential for cybersecurity professionals.'
      }
    }
  },
  about: {
    subtitle: 'Professional Network Traffic Analysis',
    description: 'This diploma project demonstrates network packet capture and analysis techniques similar to Wireshark. It helps understand how network protocols work and how to detect suspicious network activity.',
    features: [
      'Real-time packet capture simulation',
      'Protocol analysis and decoding',
      'Traffic statistics and visualization',
      'Anomaly detection algorithms',
      'Packet filtering capabilities',
      'Hex dump viewer',
      'OSI model reference',
      'Bilingual interface (EN/TM)'
    ],
    author: {
      title: 'Author',
      name: 'Shanur Gulmyradow',
      project: 'Diploma Project',
      topic: 'Network Traffic Analysis and Monitoring with Wireshark',
      topicTk: 'Wireshark bilen tor trafikini seljermek we gözegçilik etmek'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    export: 'Export',
    back: 'Back'
  }
}
