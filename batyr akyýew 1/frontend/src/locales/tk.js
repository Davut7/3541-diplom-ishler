export default {
  nav: {
    home: 'Baş sahypa',
    rules: 'WAF Düzgünleri',
    analyzer: 'Derňewçi',
    behavioral: 'Özüni Alyp Baryş',
    logs: 'Ýazgylar',
    statistics: 'Statistika',
    blockedIPs: 'Bloklanan IP',
    proxy: 'Proksi',
    settings: 'Sazlamalar',
    howItWorks: 'Nähili işleýär',
    about: 'Barada'
  },
  home: {
    title: 'WAF Özüni Alyp Baryş Derňewi',
    subtitle: 'Akylly Ulanyjy Özüni Alyp Baryş Derňewi bilen Web Gorag Ulgamy',
    description: 'Adaty gol esasly ýüze çykaryş bilen AI güýçli özüni alyp baryş derňewini birleşdirýän ösen web programma firewall-y çylşyrymly hüjümleri kesgitlemek we bloklamak üçin.',
    features: {
      waf: {
        title: 'WAF Goragy',
        desc: 'SQL injection, XSS we beýleki web hüjümlerini blokirläň'
      },
      behavioral: {
        title: 'Özüni Alyp Baryş Derňewi',
        desc: 'Ulanyjy özüni alyp baryş nagyşlaryna esaslanyp anomaliýalary ýüze çykaryň'
      },
      realtime: {
        title: 'Hakyky Wagtda Ýüze Çykaryş',
        desc: 'Dessine howp ýüze çykaryş we jogap'
      },
      learning: {
        title: 'Uýgunlaşýan Öwreniş',
        desc: 'Adaty özüni alyp baryş nagyşlaryny yzygiderli öwrenýär'
      }
    },
    startAnalysis: 'Derňewi Başla',
    viewLogs: 'Ýazgylary Gör'
  },
  rules: {
    title: 'WAF Düzgünleri',
    subtitle: 'Web programma firewall düzgünlerini dolandyryň',
    addRule: 'Düzgün Goş',
    columns: {
      name: 'Düzgün Ady',
      pattern: 'Nagyş',
      action: 'Amal',
      severity: 'Agyrlyk',
      hits: 'Degmeler',
      status: 'Ýagdaý'
    },
    actions: {
      block: 'Blokla',
      allow: 'Rugsat ber',
      challenge: 'Synagla',
      limit: 'Çäklendir',
      alert: 'Diňe Duýduryş'
    }
  },
  analyzer: {
    title: 'Talap Derňewçisi',
    subtitle: 'Mümkin bolan howplar üçin talaplary synagdan geçiriň we derňäň',
    testAttack: 'Hüjüm Synag',
    attackTypes: {
      sql: 'SQL Injection',
      xss: 'XSS Hüjümi',
      path: 'Ýol Geçişi',
      cmd: 'Buýruk Injection',
      normal: 'Adaty Talap'
    },
    results: {
      title: 'Derňew Netijeleri',
      riskScore: 'Howp Baly',
      action: 'Maslahat Berilýän Amal',
      threats: 'Ýüze Çykarylan Howplar',
      behavior: 'Özüni Alyp Baryş Baly'
    }
  },
  behavioral: {
    title: 'Özüni Alyp Baryş Derňewi',
    subtitle: 'Ulanyjy sessiýasy özüni alyp baryş gözegçiligi we anomaliýa ýüze çykaryşy',
    sessions: 'Işjeň Sessiýalar',
    anomalies: 'Ýüze Çykarylan Anomaliýalar',
    bots: 'Bot Ýüze Çykaryş',
    columns: {
      session: 'Sessiýa ID',
      requests: 'Talaplar',
      riskScore: 'Howp Baly',
      isBot: 'Bot',
      lastSeen: 'Soňky Görüldi'
    },
    metrics: {
      typingSpeed: 'Ýazyş Tizligi',
      mouseMovement: 'Syçan Hereketi',
      scrollPattern: 'Aýlaw Nagyşy',
      pageViews: 'Sahypa Görüşleri'
    }
  },
  logs: {
    title: 'Hüjüm Ýazgylary',
    subtitle: 'Hakyky wagtda hüjüm ýüze çykaryş we bloklaýyş ýazgylary',
    columns: {
      time: 'Wagt',
      type: 'Hüjüm Görnüşi',
      source: 'Çeşme IP',
      target: 'Nyşana',
      action: 'Amal',
      riskScore: 'Howp Baly'
    },
    filters: {
      all: 'Hemmesi',
      blocked: 'Bloklanan',
      allowed: 'Rugsat Berilen',
      challenged: 'Synaglanan'
    }
  },
  statistics: {
    title: 'Howpsuzlyk Statistikasy',
    subtitle: 'WAF işleýşiniň doly syn',
    overview: {
      totalRequests: 'Jemi Talaplar',
      blockedRequests: 'Bloklanan',
      challengedRequests: 'Synaglanan',
      blockRate: 'Bloklaýyş Derejesi'
    },
    charts: {
      attackTypes: 'Görnüş Boýunça Hüjümler',
      timeline: '24 Sagatlyk Wagt Çyzgysy',
      behavioral: 'Özüni Alyp Baryş Görkezijileri'
    }
  },
  howItWorks: {
    title: 'WAF Özüni Alyp Baryş Derňewi Nähili Işleýär',
    subtitle: 'Akylly web goragyna düşünmek',
    steps: {
      step1: {
        title: 'Talap Tutmak',
        desc: 'Ähli HTTP talaplary tutulýar we derňelýär'
      },
      step2: {
        title: 'Gol Derňewi',
        desc: 'Belli hüjüm nagyşlaryna garşy barlag (SQL, XSS, ş.m.)'
      },
      step3: {
        title: 'Özüni Alyp Baryş Derňewi',
        desc: 'Anomaliýalar üçin ulanyjy özüni alyp barşyny derňeýär'
      },
      step4: {
        title: 'Karar Dwigatel',
        desc: 'Blok/rugsat karary bermek üçin signallary birleşdirýär'
      },
      step5: {
        title: 'Uýgunlaşýan Öwreniş',
        desc: 'Özüni alyp baryş profillerini yzygiderli täzeleýär'
      }
    }
  },
  about: {
    title: 'WAF Özüni Alyp Baryş Derňewi Barada',
    subtitle: 'Akylly Web Programma Goragy',
    description: 'Bu diplom taslamasy adaty gol esasly ýüze çykaryş bilen özüni alyp baryş derňewini birleşdirip, belli we näbelli hüjümlere garşy giňişleýin gorag üpjün edýän Web Programma Firewall-yny görkezýär.',
    author: {
      title: 'Awtor',
      name: 'Batyr Akyýew',
      project: 'Diplom Taslamasy',
      topic: 'Web Application Firewall with Behavioral Analysis',
      topicTk: 'Ulanyjynyň hereketine görä işleýän web gorag ulgamy'
    }
  },
  common: {
    loading: 'Ýüklenýär...',
    error: 'Ýalňyşlyk',
    success: 'Üstünlik',
    warning: 'Duýduryş'
  },
  footer: {
    diploma: 'Diplom Taslamasy',
    author: 'Awtor'
  },
  settings: {
    title: 'Sazlamalar',
    subtitle: 'WAF ulgam sazlamalaryny düzüň',
    emailAlerts: 'Email Duýduryşlary',
    exportReports: 'Hasabatlary Eksport Et',
    systemInfo: 'Ulgam Maglumatlary',
    dangerZone: 'Howply Zona'
  },
  blockedIPs: {
    title: 'Bloklanan IP Adresleri',
    subtitle: 'Bloklanan IP adreslerini dolandyryň we blok statistikasyny görüň',
    addIP: 'Täze IP Blokla',
    totalBlocked: 'Jemi Bloklanan',
    totalBlocks: 'Jemi Blok Wakalary',
    countries: 'Ýurtlar',
    ipAddress: 'IP Adresi',
    reason: 'Sebäp',
    blockCount: 'Blok Sany',
    blockedAt: 'Bloklanan Wagty',
    geolocation: 'Geolokasiya',
    actions: 'Amallar',
    noBlocked: 'Bloklanan IP adresi ýok',
    addNewIP: 'Täze IP Adresini Blokla',
    blockIP: 'IP Blokla'
  },
  proxy: {
    title: 'Ters Proksi Rejimi',
    subtitle: 'Daşarky web sahypalary WAF arkaly goraň',
    howItWorks: 'Ters Proksi Nähili Işleýär',
    howItWorksDesc: 'WAF müşderiler bilen nyşana serweriniň arasynda gorag gatlagy hökmünde hereket edýär. Ähli HTTP talaplary ilki WAF-dan geçýär, ol ýerde howplar üçin derňelýär we soňra hakyky serwere ugradylýar.',
    configuration: 'Proksi Sazlamalary',
    targetUrl: 'Nyşana Serwer URL',
    targetName: 'Nyşana Ady',
    proxyPort: 'Proksi Porty',
    logRequests: 'Şübheli Talaplary Ýazga Al',
    blockThreats: 'Ýüze Çykarylan Howplary Blokla',
    saveConfig: 'Sazlamalary Sakla',
    control: 'Proksi Dolandyryşy',
    running: 'Proksi Işleýär',
    stopped: 'Proksi Durdy',
    stoppedDesc: 'Nyşana serweriňizi goramak üçin proksini başlaň',
    start: 'Proksini Başla',
    stop: 'Proksini Sakla',
    accessVia: 'Girişi',
    accessHint: 'Bu URL-a gelýän ähli talaplar nyşana serwere ugradylmazdan öň WAF tarapyndan derňelýär.',
    integrationCode: 'Integrasiýa Opsiýalary'
  },
  login: {
    subtitle: 'WAF Dolandyryş Paneline giriň',
    registerSubtitle: 'Täze hasap dörediň',
    username: 'Ulanyjy ady',
    usernamePlaceholder: 'Ulanyjy adyny giriziň',
    email: 'Email',
    emailPlaceholder: 'Email adresini giriziň',
    password: 'Parol',
    passwordPlaceholder: 'Paroly giriziň',
    confirmPassword: 'Paroly tassyklaň',
    confirmPasswordPlaceholder: 'Paroly gaýtadan giriziň',
    loginButton: 'Giriş',
    registerButton: 'Hasap Döret',
    haveAccount: 'Hasabyňyz barmy?',
    noAccount: 'Hasabyňyz ýokmy?',
    loginLink: 'Giriş',
    registerLink: 'Agza bol',
    demoCredentials: 'Demo Maglumatlar',
    registerSuccess: 'Hasap üstünlikli döredildi! Giriň.',
    errors: {
      usernameRequired: 'Ulanyjy ady azyndan 3 simwol bolmaly',
      passwordRequired: 'Parol azyndan 6 simwol bolmaly',
      invalidEmail: 'Nädogry email formaty',
      passwordMismatch: 'Parollar gabat gelmeýär'
    }
  }
}
