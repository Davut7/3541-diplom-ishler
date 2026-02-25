export default {
  nav: {
    home: 'Baş sahypa',
    analyze: 'Derňew',
    history: 'Taryh',
    howItWorks: 'Nähili işleýär',
    comparison: 'Deňeşdirme',
    about: 'Hakynda'
  },
  footer: {
    diploma: 'Diplom taslamasy',
    author: 'Awtor'
  },
  home: {
    title: 'OSINT Aňtaw Derňewçisi',
    subtitle: 'Etiki Kiberhowpsuzlyk Gözlegleri üçin AI Kömekli Açyk Çeşme Aňtaw Gurallary',
    description: 'Howpsuzlyk hünärmenlerine nyşanalary köpçülige açyk maglumatlar arkaly derňemäge kömek edýän güýçli gözleg we aňtaw ýygnamak guraly.',
    startAnalysis: 'Derňewi başla',
    viewHistory: 'Taryhy gör',
    features: {
      title: 'Esasy aýratynlyklar',
      dns: {
        title: 'DNS Gözlegi',
        desc: 'Domen atlaryny çözmek, DNS ýazgylaryny tapmak we degişli infrastrukturany tapmak.'
      },
      whois: {
        title: 'WHOIS Aňtaw',
        desc: 'Domen hasaba alyş maglumatlary, eýeçilik maglumatlary we möhletiniň gutarýan seneleri ýygnamak.'
      },
      geo: {
        title: 'IP Ýerleşiş',
        desc: 'IP salgylaryndan geografiki ýerleşişi, ISP we gurama maglumatlaryny kesgitlemek.'
      },
      ports: {
        title: 'Port Skanirleme',
        desc: 'Açyk portlary we işleýän hyzmatlary kesgitläp, mümkin bolan hüjüm ýüzüni bahalandyrmak.'
      },
      risk: {
        title: 'Howp Bahasy',
        desc: 'Tapylan gowşaklyklara esaslanyp howp ballaryny hasaplamak üçin AI güýçli derňew.'
      },
      reports: {
        title: 'Hasabat Döretmek',
        desc: 'Resmileşdirmek üçin dürli formatlarda jikme-jik aňtaw hasabatlaryny döretmek.'
      }
    },
    stats: {
      scansPerformed: 'Geçirilen skanlar',
      targetsAnalyzed: 'Derňelen nyşanalar',
      risksIdentified: 'Kesgitlenen howplar',
      reportsGenerated: 'Döredilen hasabatlar'
    }
  },
  analyze: {
    title: 'Nyşana Derňewi',
    subtitle: 'Derňemek üçin IP salgy ýa-da domen ady giriziň',
    placeholder: 'Nyşana giriziň (meselem, example.com ýa-da 8.8.8.8)',
    startScan: 'Skany başla',
    scanning: 'Skanirlenýär...',
    demo: 'Demo synanyş',
    results: {
      title: 'Derňew Netijeleri',
      target: 'Nyşana',
      ip: 'IP Salgy',
      riskScore: 'Howp Baly',
      riskLevel: 'Howp Derejesi',
      location: 'Ýerleşiş',
      isp: 'ISP Üpjün ediji',
      organization: 'Gurama',
      dns: 'DNS Ýazgylary',
      whois: 'WHOIS Maglumatlary',
      ports: 'Açyk Portlar',
      registrar: 'Hasaba alyjy',
      created: 'Döredilen',
      expires: 'Möhleti',
      ping: 'Ping',
      ttl: 'TTL'
    },
    risks: {
      critical: 'HOWPLY',
      high: 'ÝOKARY',
      medium: 'ORTA',
      low: 'PES'
    },
    tabs: {
      overview: 'Syn',
      dns: 'DNS',
      whois: 'WHOIS',
      ports: 'Portlar',
      security: 'Howpsuzlyk'
    },
    security: {
      issues: 'Howpsuzlyk Meseleleri',
      warnings: 'Duýduryşlar',
      recommendations: 'Maslahatlar'
    }
  },
  history: {
    title: 'Derňew Taryhy',
    subtitle: 'Öňki skanlaryňyzy we derňew netijelerini görüň',
    empty: 'Entek derňew taryhy ýok. Ilkinji skanyňyzy başladyň!',
    columns: {
      target: 'Nyşana',
      ip: 'IP Salgy',
      risk: 'Howp Baly',
      date: 'Sene',
      actions: 'Hereketler'
    },
    actions: {
      view: 'Görmek',
      export: 'Eksport',
      delete: 'Pozmak'
    },
    stats: {
      title: 'Statistika',
      totalScans: 'Jemi Skanlar',
      avgRisk: 'Ortaça Howp Baly',
      highRisk: 'Ýokary Howply Nyşanalar',
      lastScan: 'Soňky Skan'
    },
    clear: 'Taryhy arassala',
    confirmClear: 'Ähli taryhy arassalamak isleýärsiňizmi?'
  },
  howItWorks: {
    title: 'OSINT Derňewi Nähili Işleýär',
    subtitle: 'Aňtaw ýygnamak prosesine düşünmek',
    intro: 'OSINT (Açyk Çeşme Aňtaw) köpçülige elýeterli çeşmelerden maglumatlary ýygnamak we derňemekdir. Biziň guralymyz bu prosesi awtomatlaşdyryp, howpsuzlyk hünärmenlerine mümkin bolan howplary bahalandyrmaga kömek edýär.',
    steps: {
      title: 'Derňew Prosesi',
      step1: {
        title: '1. Nyşana Girişi',
        desc: 'Domen ady ýa-da IP salgy giriziň. Ulgam girişi barlaýar we derňew üçin taýýarlaýar.'
      },
      step2: {
        title: '2. DNS Çözgüdi',
        desc: 'Gural domen atlaryny IP salgylaryna öwürýär we degişli DNS ýazgylaryny (A, AAAA, MX, TXT, NS) tapýar.'
      },
      step3: {
        title: '3. WHOIS Gözleg',
        desc: 'WHOIS maglumat bazalaryndan hasaba alyş maglumatlary, eýeçilik maglumatlary we möhüm seneleri alýar.'
      },
      step4: {
        title: '4. Ýerleşiş',
        desc: 'IP salgysyň fiziki ýerleşişini, şol sanda ýurdy, şäheri, ISP we guramany kesgitleýär.'
      },
      step5: {
        title: '5. Port Skanirleme',
        desc: 'Işleýän hyzmatlary we mümkin bolan giriş nokatlaryny kesgitlemek üçin adaty portlary skanirleýär.'
      },
      step6: {
        title: '6. Howp Bahasy',
        desc: 'AI açylan hyzmatlara we konfigurasiýalara esaslanyp howp balyny hasaplamak üçin ähli ýygnalan maglumatlary derňeýär.'
      }
    },
    faq: {
      title: 'Köp Soralýan Soraglar',
      q1: {
        question: 'OSINT näme?',
        answer: 'OSINT (Açyk Çeşme Aňtaw) köpçülik web sahypalary, DNS ýazgylary, WHOIS maglumat bazalary we beýleki açyk maglumat çeşmeleri ýaly açyk çeşmelerden ýygnalan maglumatlary ýygnamak we derňemek diýmekdir.'
      },
      q2: {
        question: 'Bu guraly ulanmak kanunmy?',
        answer: 'Hawa, köpçülige elýeterli maglumatlary ulanyp OSINT derňewi kanuny. Şeýle-de bolsa, islendik nyşanalary skanirlemezden ozal hemişe degişli ygtyýarnamanyň bardygyna göz ýetiriň. Bu gural diňe bilim we ygtyýarly howpsuzlyk synag maksatlary üçin döredildi.'
      },
      q3: {
        question: 'Howp baly nähili hasaplanýar?',
        answer: 'Howp baly birnäçe faktora esaslanýar: açyk portlaryň sany we görnüşi, açylan hyzmatlar, DNS konfigurasiýasy we belli gowşaklyk nagyşlary. SSH, RDP we maglumat bazalary ýaly möhüm hyzmatlar howp balyny ýokarlandyrýar.'
      },
      q4: {
        question: 'Haýsy tehnologiýalar ulanylýar?',
        answer: 'Frontend Vue.js we PrimeVue bilen guruldy. Backend API işlemek üçin Express bilen Node.js ulanýar. DNS çözgüdi we tor amallary üçin asyl Node.js modullaryny ulanýarys.'
      },
      q5: {
        question: 'Netijeleri eksport edip bilerinmi?',
        answer: 'Hawa, derňew netijelerini JSON we HTML goşmak bilen birnäçe formatda eksport edip bilersiňiz. Hasabatlar ähli ýygnalan aňtaw maglumatlaryny öz içine alýar we resmileşdirmek ýa-da goşmaça derňew üçin ulanylyp bilner.'
      }
    },
    techStack: {
      title: 'Tehnologiýa Toplumy',
      frontend: 'Frontend',
      backend: 'Backend',
      features: 'Aýratynlyklar'
    }
  },
  comparison: {
    title: 'Gural Deňeşdirmesi',
    subtitle: 'OSINT.AI beýleki gurallar bilen nähili deňeşdirilýär',
    features: {
      dnsLookup: 'DNS Gözleg',
      whoisQuery: 'WHOIS Soragy',
      geoLocation: 'IP Ýerleşiş',
      portScanning: 'Port Skanirleme',
      riskAssessment: 'Howp Bahasy',
      reportGeneration: 'Hasabat Döretmek',
      multilingual: 'Köp dilli (EN/TM)',
      freeToUse: 'Mugt Ulanmak',
      noApiKey: 'API Açar Gerek Däl',
      localExecution: 'Ýerli Ýerine ýetiriş',
      openSource: 'Açyk Çeşme',
      privacyFocused: 'Gizlinlige Gönükdirilen'
    },
    tools: {
      osint: 'OSINT.AI',
      shodan: 'Shodan',
      censys: 'Censys',
      nmap: 'Nmap'
    },
    legend: {
      yes: 'Hawa',
      no: 'Ýok',
      partial: 'Bölekleýin',
      paid: 'Tölegli'
    },
    advantages: {
      title: 'Biziň Artykmaçlyklarymyz',
      free: {
        title: 'Doly Mugt',
        desc: 'Abuna tölegleri ýa-da API çykdajylary ýok. Ähli aýratynlyklary tölegsiz ulanyň.'
      },
      privacy: {
        title: 'Ilki Gizlinlik',
        desc: 'Ähli derňew ýerli ýerine ýetirilýär. Maglumatlaryňyz kompýuteriňizi terk etmeýär.'
      },
      bilingual: {
        title: 'Iki Dilli Interfeýs',
        desc: 'Iňlis we Türkmen dilleri üçin doly goldaw.'
      },
      simple: {
        title: 'Ulanmak Aňsat',
        desc: 'Başlaýjylar we hünärmenler üçin döredilen arassa interfeýs.'
      }
    }
  },
  about: {
    title: 'OSINT.AI Hakynda',
    subtitle: 'Etiki Kiberhowpsuzlyk Gözlegleri üçin AI Kömekli Açyk Çeşme Aňtaw Gurallary',
    description: 'OSINT.AI açyk çeşme aňtaw ýygnamak we derňemegiň döwrebap usullaryny görkezmek üçin işlenip düzülen diplom taslamasydyr. Gural dürli gözleg usullaryny AI güýçli howp bahasy bilen birleşdirip, howpsuzlyk hünärmenlerine mümkin bolan gowşaklyklary kesgitlemäge kömek edýär.',
    whatIsOsint: {
      title: 'OSINT näme?',
      content: 'Açyk Çeşme Aňtaw (OSINT) köpçülige elýeterli çeşmelerden ýygnalan maglumatlary ýygnamak, derňemek we ulanmak diýmekdir. Bular web sahypalaryny, sosial mediýany, köpçülik ýazgylaryny, DNS ýazgylaryny, WHOIS maglumat bazalaryny we beýleki açyk maglumat çeşmelerini öz içine alýar. OSINT kiberhowpsuzlykda gözleg, howp aňtaw we gowşaklyk bahasy üçin giňden ulanylýar.'
    },
    purpose: {
      title: 'Taslamanyň Maksady',
      content: 'Bu taslama döwrebap web programmasynda OSINT usullarynyň amaly durmuşa geçirilişini görkezmek üçin diplom işi hökmünde işlenip düzüldi. Ol doly stak programmirleme, tor programmalaşdyrmasy we kiberhowpsuzlyk düşünjelerindäki başarnyklary görkezýär.'
    },
    ethical: {
      title: 'Etiki Ulanyş',
      content: 'Bu gural diňe bilim we ygtyýarly howpsuzlyk synag maksatlary üçin döredildi. Islendik tory ýa-da ulgamy skanirlemezden ozal hemişe degişli ygtyýarnamany alyň. Ygtyýarnama alynmadyk skanirleme siziň ýurişdiksiýaňyzda bikanun bolup biler.'
    },
    features: {
      title: 'Esasy Aýratynlyklar',
      list: [
        'DNS gözlegi we ýazgy tapmak',
        'WHOIS maglumat ýygnamak',
        'IP ýerleşiş hyzmatlary',
        'Port skanirleme we hyzmat kesgitlemek',
        'AI güýçli howp bahasy',
        'Köp formatly hasabat döretmek',
        'Iki dilli interfeýs (EN/TM)',
        'Garaňky/Ýagty tema goldawy'
      ]
    },
    tech: {
      title: 'Ulanylan Tehnologiýalar',
      frontend: {
        title: 'Frontend',
        items: ['Vue.js 3', 'PrimeVue UI', 'Vue Router', 'Chart.js', 'Axios']
      },
      backend: {
        title: 'Backend',
        items: ['Node.js', 'Express.js', 'DNS Moduly', 'Child Process']
      }
    },
    author: {
      title: 'Awtor',
      name: 'Süleýman Akmuhammedow',
      project: 'Diplom Taslamasy',
      topic: 'AI-Assisted OSINT Tools for Ethical Cybersecurity Research',
      topicTk: 'Emeli aň kömegi bilen OSINT guralary'
    }
  },
  common: {
    loading: 'Ýüklenýär...',
    error: 'Ýalňyşlyk',
    success: 'Üstünlik',
    cancel: 'Ýatyr',
    confirm: 'Tassykla',
    save: 'Ýatda sakla',
    delete: 'Poz',
    export: 'Eksport',
    exportJson: 'JSON Eksport',
    exportHtml: 'HTML Eksport',
    print: 'Çap et',
    noData: 'Maglumat ýok',
    back: 'Yza',
    next: 'Öňe',
    search: 'Gözle'
  }
}
