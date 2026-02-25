export default {
  app: {
    title: 'Android Security Analyzer',
    subtitle: 'Professional APK Security Analysis Tool',
    language: 'Language'
  },
  nav: {
    home: 'Home',
    analyze: 'Analyze',
    history: 'History',
    test: 'Test',
    about: 'About',
    comparison: 'Comparison'
  },
  home: {
    hero: {
      title: 'Analyze Android App Security',
      subtitle: 'Upload APK files to detect potential security vulnerabilities, dangerous permissions, and privacy risks',
      uploadBtn: 'Start Analysis',
      demoBtn: 'View Demo'
    },
    features: {
      title: 'Key Features',
      permission: {
        title: 'Permission Analysis',
        desc: 'Detailed analysis of all permissions requested by the app with risk level assessment'
      },
      manifest: {
        title: 'Manifest Inspection',
        desc: 'Deep inspection of AndroidManifest.xml for security flags and exported components'
      },
      security: {
        title: 'Security Assessment',
        desc: 'Comprehensive security evaluation with actionable recommendations'
      },
      report: {
        title: 'Detailed Reports',
        desc: 'Generate detailed security reports with all findings and recommendations'
      }
    },
    stats: {
      permissions: 'Permissions Analyzed',
      categories: 'Risk Categories',
      checks: 'Security Checks'
    }
  },
  analyze: {
    title: 'APK Security Analysis',
    upload: {
      title: 'Upload APK File',
      dropzone: 'Drag and drop APK file here or click to browse',
      hint: 'Supported format: .apk (max 500MB)',
      analyzing: 'Analyzing APK...',
      progress: 'Processing'
    },
    result: {
      title: 'Analysis Results',
      basicInfo: 'Basic Information',
      permissions: 'Permissions',
      security: 'Security Analysis',
      manifest: 'Manifest Details'
    },
    basicInfo: {
      fileName: 'File Name',
      packageName: 'Package Name',
      version: 'Version',
      size: 'File Size',
      minSdk: 'Min SDK',
      targetSdk: 'Target SDK',
      dexFiles: 'DEX Files',
      nativeLibs: 'Native Libraries'
    },
    permissions: {
      title: 'Permission Analysis',
      total: 'Total Permissions',
      critical: 'Critical',
      high: 'High Risk',
      medium: 'Medium Risk',
      low: 'Low Risk',
      riskScore: 'Risk Score',
      category: 'Category',
      permission: 'Permission',
      risk: 'Risk Level',
      description: 'Description'
    },
    security: {
      title: 'Security Assessment',
      overallRisk: 'Overall Risk Level',
      issues: 'Security Issues',
      warnings: 'Warnings',
      recommendations: 'Recommendations',
      noIssues: 'No critical issues found',
      noWarnings: 'No warnings',
      severity: {
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      }
    },
    manifest: {
      activities: 'Activities',
      services: 'Services',
      receivers: 'Broadcast Receivers',
      providers: 'Content Providers',
      flags: 'Security Flags',
      debuggable: 'Debuggable',
      allowBackup: 'Allow Backup',
      exportedComponents: 'Exported Components'
    },
    actions: {
      newAnalysis: 'New Analysis',
      downloadReport: 'Download Report',
      share: 'Share'
    }
  },
  about: {
    title: 'About Android Security Analyzer',
    description: 'Android Security Analyzer is a professional tool for analyzing the security of Android applications. It helps developers, security researchers, and users understand the potential risks associated with Android APK files.',
    howItWorks: {
      title: 'How It Works',
      step1: {
        title: 'Upload APK',
        desc: 'Upload the Android APK file you want to analyze'
      },
      step2: {
        title: 'Automatic Analysis',
        desc: 'Our system extracts and analyzes the AndroidManifest.xml and other components'
      },
      step3: {
        title: 'Permission Check',
        desc: 'All permissions are classified by risk level and category'
      },
      step4: {
        title: 'Security Report',
        desc: 'Receive a detailed report with findings and recommendations'
      }
    },
    whyUse: {
      title: 'Why Use This Tool?',
      benefits: [
        'Free and open-source solution',
        'No data stored on servers - privacy focused',
        'Comprehensive permission analysis',
        'Easy to understand risk levels',
        'Actionable security recommendations',
        'Support for multiple languages'
      ]
    },
    technology: {
      title: 'Technology Stack',
      frontend: 'Frontend',
      backend: 'Backend',
      features: 'Key Technologies'
    }
  },
  comparison: {
    title: 'Tool Comparison',
    subtitle: 'How Android Security Analyzer compares to other tools',
    features: {
      feature: 'Feature',
      ourTool: 'Our Tool',
      virusTotal: 'VirusTotal',
      mobSF: 'MobSF',
      exodus: 'Exodus Privacy'
    },
    criteria: {
      permissionAnalysis: 'Permission Analysis',
      riskAssessment: 'Risk Assessment',
      manifestInspection: 'Manifest Inspection',
      multilingual: 'Multi-language Support',
      freeToUse: 'Free to Use',
      noRegistration: 'No Registration Required',
      privacyFocused: 'Privacy Focused',
      localAnalysis: 'Local Analysis',
      detailedReports: 'Detailed Reports',
      easeOfUse: 'Ease of Use'
    },
    legend: {
      yes: 'Yes',
      no: 'No',
      partial: 'Partial',
      excellent: 'Excellent',
      good: 'Good',
      average: 'Average'
    },
    advantages: {
      title: 'Our Advantages',
      items: [
        {
          title: 'Privacy First',
          desc: 'All analysis is performed locally. Your APK files are not uploaded to any external servers.'
        },
        {
          title: 'Easy to Use',
          desc: 'Simple drag-and-drop interface. No technical knowledge required.'
        },
        {
          title: 'Comprehensive Analysis',
          desc: 'Analyzes permissions, manifest, and provides detailed security recommendations.'
        },
        {
          title: 'Multi-language',
          desc: 'Available in English and Turkmen languages.'
        }
      ]
    }
  },
  test: {
    title: 'Test APK Analysis',
    subtitle: 'Learn how APK analysis works and test with sample applications',
    howItWorks: 'How APK Analysis Works',
    technicalDetails: 'Technical Details',
    sampleApks: 'Sample APK Profiles',
    sampleApksDesc: 'Click on any sample to see a demonstration of the security analysis results',
    analyze: 'Analyze',
    flow: {
      step1: {
        title: '1. APK = ZIP Archive',
        desc: 'APK file is a standard ZIP archive with .apk extension'
      },
      step2: {
        title: '2. APK Structure',
        desc: 'Inside APK are resources, code and manifest'
      },
      step3: {
        title: '3. Binary XML Parsing',
        desc: 'AndroidManifest.xml is in binary format. We extract permission strings.'
      },
      step4: {
        title: '4. Risk Analysis',
        desc: 'We compare permissions with a database of known permissions'
      }
    },
    manifest: {
      title: 'AndroidManifest.xml',
      desc: 'Every Android app contains a manifest that declares:',
      items: ['Package name', 'Required permissions', 'Components (Activities, Services, Receivers)', 'Minimum Android version (SDK)']
    },
    binaryXml: {
      title: 'Binary XML Format',
      desc: 'In APK the manifest is stored in binary format to save space. Our analyzer:',
      items: ['Reads binary data', 'Extracts string values', 'Finds permission patterns', 'Parses package name and versions']
    },
    permissionDb: {
      title: 'Permission Database',
      desc: 'Database contains 70+ Android permissions with risk assessment:',
      critical: 'SMS, calls, camera',
      high: 'contacts, storage',
      medium: 'internet, bluetooth',
      low: 'vibration, notifications'
    }
  },
  footer: {
    description: 'Professional Android APK Security Analysis Tool',
    rights: 'All rights reserved',
    disclaimer: 'This tool is for educational and research purposes only.'
  },
  history: {
    title: 'Analysis History',
    subtitle: 'View your previous APK security analyses',
    stats: {
      totalAnalyses: 'Total Analyses',
      avgRisk: 'Average Risk',
      issuesFound: 'Issues Found',
      warnings: 'Warnings'
    },
    riskDistribution: 'Risk Level Distribution',
    riskBreakdown: 'Risk Breakdown',
    recentAnalyses: 'Recent Analyses',
    clearAll: 'Clear All',
    noHistory: 'No Analysis History',
    noHistoryDesc: 'Start analyzing APK files to see your history here',
    startAnalysis: 'Start Analysis'
  },
  export: {
    title: 'Export Report',
    json: 'Download JSON',
    html: 'Download HTML',
    print: 'Print Report'
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    search: 'Search',
    filter: 'Filter',
    all: 'All'
  }
}
