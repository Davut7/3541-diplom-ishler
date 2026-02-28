export default {
  nav: {
    home: 'Baş sahypa',
    scan: 'Skanirle',
    processes: 'Prosesler',
    protection: 'Gorag',
    statistics: 'Statistika',
    howItWorks: 'Nähili işleýär',
    about: 'Barada'
  },
  home: {
    title: 'KeyGuard',
    subtitle: 'Windows üçin Ösen Keylogger Ýüze Çykaryş',
    description: 'Windows ulgamyňyzdan keylogger-leri ýüze çykaryp we aýyryp, şahsy durmuşyňyzy goraň. Biziň ösen skanirleýiş tehnologiýamyz klawiatura basmalaryny gözegçilik edýän gizlin howplary kesgitleýär.',
    features: {
      scan: {
        title: 'Çuňňur Ulgam Skany',
        desc: 'Keylogger-ler üçin prosesleri, reýestri we başlangyç elementleri skaner ediň'
      },
      realtime: {
        title: 'Hakyky Wagtda Gözegçilik',
        desc: 'Klawiatura hook-laryny we şübheli API çagyryşlaryny gözegçilik ediň'
      },
      process: {
        title: 'Proses Seljermesi',
        desc: 'Işleýän prosesleri keylogging özüni alyp barşy üçin seljeriň'
      },
      protect: {
        title: 'Işjeň Gorag',
        desc: 'Rugsat berilmedik klawiatura gözegçilik synanyşyklaryny blokirläň'
      }
    },
    startScan: 'Skana Başla',
    viewProcesses: 'Prosesleri Gör'
  },
  scan: {
    title: 'Ulgam Skany',
    subtitle: 'Keylogger-leri we klawiatura gözegçilik programmasyny ýüze çykaryň',
    quickScan: 'Çalt Skan',
    fullScan: 'Doly Skan',
    customScan: 'Özbaşdak Skan',
    scanning: 'Skanirlenýär...',
    scanComplete: 'Skan Tamamlandy',
    threatsFound: 'Howplar Tapyldy',
    noThreats: 'Hiç Hili Howp Tapylmady',
    scanAreas: {
      processes: 'Işleýän Prosesler',
      registry: 'Reýestr Açarlary',
      startup: 'Başlangyç Elementleri',
      hooks: 'Klawiatura Hook-lary',
      files: 'Şübheli Faýllar',
      network: 'Tor Baglanyşyklary'
    },
    results: {
      title: 'Skan Netijeleri',
      clean: 'Ulgamyňyz arassa!',
      infected: 'Potensial howplar ýüze çykaryldy!',
      name: 'Ady',
      type: 'Görnüşi',
      location: 'Ýerleşýän Ýeri',
      risk: 'Howp Derejesi',
      action: 'Amal',
      remove: 'Aýyr',
      quarantine: 'Karantina',
      ignore: 'Äsgermezlik Et'
    }
  },
  processes: {
    title: 'Proses Gözegçiligi',
    subtitle: 'Işleýän prosesleri keylogging özüni alyp barşy üçin seljeriň',
    refresh: 'Täzele',
    filter: 'Prosesleri süz...',
    columns: {
      pid: 'PID',
      name: 'Proses Ady',
      cpu: 'CPU',
      memory: 'Ýat',
      hooks: 'KB Hook-lar',
      risk: 'Howp',
      action: 'Amal'
    },
    analyze: 'Seljer',
    terminate: 'Tamamla',
    riskLevels: {
      safe: 'Howpsuz',
      low: 'Pes',
      medium: 'Orta',
      high: 'Ýokary',
      critical: 'Kritiki'
    },
    details: {
      title: 'Proses Jikme-jiklikleri',
      path: 'Ýol',
      publisher: 'Neşirçi',
      started: 'Başlandy',
      threads: 'Sapaklar',
      handles: 'Handle-ler'
    }
  },
  protection: {
    title: 'Işjeň Gorag',
    subtitle: 'Hakyky wagtda gorag sazlamalaryny düzüň',
    settings: {
      hookMonitor: {
        name: 'Klawiatura Hook Gözegçiligi',
        desc: 'Rugsat berilmedik klawiatura hook-laryny gözegçilik ediň'
      },
      apiMonitor: {
        name: 'API Çagyryş Gözegçiligi',
        desc: 'Şübheli API çagyryşlaryny yzarlaň (GetAsyncKeyState, SetWindowsHookEx)'
      },
      processGuard: {
        name: 'Proses Goragy',
        desc: 'Täze prosesler klawiatura girişine synanyşanda habar beriň'
      },
      clipboardGuard: {
        name: 'Almaşyk Goragy',
        desc: 'Almaşygy rugsat berilmedik girişden goraň'
      },
      networkGuard: {
        name: 'Tor Goragy',
        desc: 'Şübheli çykyş baglanyşyklaryny blokirläň'
      },
      autoScan: {
        name: 'Awtomatiki Skanirleýiş',
        desc: 'Başlangyçda we wagtlaýyn ulgamy skaner ediň'
      }
    },
    status: {
      active: 'Işjeň',
      inactive: 'Işjeň däl',
      protected: 'Goragly',
      vulnerable: 'Ejiz'
    }
  },
  howItWorks: {
    title: 'Keylogger Ýüze Çykaryş Nähili Işleýär',
    subtitle: 'Keylogger howplaryna we ýüze çykaryş usullaryna düşünmek',
    steps: {
      step1: {
        title: 'Hook Ýüze Çykaryş',
        desc: 'Windows klawiatura hook-laryny gözegçilik ediň (SetWindowsHookEx)'
      },
      step2: {
        title: 'API Seljermesi',
        desc: 'GetAsyncKeyState ýaly şübheli API çagyryşlaryny yzarlaň'
      },
      step3: {
        title: 'Proses Skany',
        desc: 'Proses özüni alyp barşyny we ýat nagyşlaryny seljeriň'
      },
      step4: {
        title: 'Reýestr Barlagy',
        desc: 'Durnuklylyk mehanizmleri üçin reýestri skaner ediň'
      },
      step5: {
        title: 'Howp Jogaby',
        desc: 'Ýüze çykarylan howplary aýyryň ýa-da karantina alyň'
      }
    },
    keyloggerTypes: {
      title: 'Keylogger Görnüşleri',
      software: {
        name: 'Programma Keylogger-leri',
        desc: 'Arka planda işleýän we klawiatura basmalaryny ýazga alýan programmalar',
        examples: 'Hook esasly, API esasly, Forma tutujylar'
      },
      hardware: {
        name: 'Apparat Keylogger-leri',
        desc: 'Klawiatura bilen kompýuteriň arasynda birikdirilen fiziki enjamlar',
        examples: 'USB keylogger-ler, Simsiz snifferler'
      },
      kernel: {
        name: 'Kernel Keylogger-leri',
        desc: 'Kernel derejesinde işleýär, ýüze çykarmak örän kyn',
        examples: 'Rootkit esasly, Sürüji esasly'
      }
    },
    faq: {
      q1: {
        question: 'Keylogger näme?',
        answer: 'Keylogger kompýuterde klawiatura basmalaryny ýazga alýan zyýanly programma ýa-da enjamdyr. Ol ulanyjy tarapyndan ýazylan parollary, kredit karta belgilerini, habarlary we beýleki duýgur maglumatlary tutup bilýär.'
      },
      q2: {
        question: 'Keylogger-ler nähili işleýär?',
        answer: 'Programma keylogger-leri adatça klawiatura basmalaryny tutmak üçin Windows hook-laryny (SetWindowsHookEx) ýa-da API gözegçiligini ulanýarlar. Olar amaly ýadyny hem skanirläp ýa-da kernel derejeli sürüjileri ulanyp bilerler.'
      },
      q3: {
        question: 'Özümi nähili gorap bilerin?',
        answer: 'Ygtybarly antiwirus programmasyny ulanyň, ulgamyňyzy täze saklaň, ýüklemelere seresap boluň, duýgur giriş üçin wirtual klawiaturalary ulanyň we yzygiderli keylogger-ler üçin skaner ediň.'
      },
      q4: {
        question: 'Keylogger-iň alamatlary näme?',
        answer: 'Alamatlara haýal kompýuter öndürijiligi, adaty bolmadyk tor işjeňligi, näbelli prosesleriň işlemegi we brauzer ýa-da ýazuw gijikmeleri girýär. Şeýle-de bolsa, kämil keylogger-ler hiç hili aýdyň alamat görkezmezligi mümkin.'
      }
    }
  },
  statistics: {
    title: 'Howpsuzlyk Statistikasy',
    subtitle: 'Skan taryhy we howp derňewi',
    cards: {
      totalScans: 'Jemi Skanlar',
      threats: 'Tapylan Howplar',
      removed: 'Aýrylan Howplar',
      daysProtected: 'Gorag Günleri'
    },
    charts: {
      threatTypes: 'Howp Görnüşleri',
      riskLevels: 'Howp Derejeleri',
      scanHistory: 'Skan Işjeňligi (Soňky 7 Gün)'
    },
    recentDetections: {
      title: 'Soňky Tapylanlar',
      noDetections: 'Soňky wagtda howp tapylmady'
    },
    protectionStatus: {
      title: 'Gorag Ýagdaýy',
      hookMonitor: 'Hook Gözegçisi',
      apiMonitor: 'API Gözegçisi',
      processGuard: 'Proses Goragy',
      networkGuard: 'Tor Goragy'
    }
  },
  about: {
    subtitle: 'Windows üçin Ösen Keylogger Ýüze Çykaryş',
    description: 'Bu diplom taslamasy Windows ulgamlaryndan keylogger-leri ýüze çykarmak we aýyrmak usullaryny görkezýär. Keylogger-leriň nähili işleýändigini we olardan nähili goranmalydygyny görkezýär.',
    features: [
      'Hakyky wagtda klawiatura hook gözegçiligi',
      'Windows API çagyryş seljermesi',
      'Proses özüni alyp barşy seljermesi',
      'Reýestr durnuklylygy ýüze çykaryş',
      'Tor traffigi gözegçiligi',
      'Awtomatiki howp aýyrma'
    ],
    author: {
      title: 'Awtor',
      name: 'Rowşen Orazmyhammedow',
      project: 'Diplom Taslamasy',
      topic: 'Keylogger Detection in Windows Operating System',
      topicTk: 'Windows operasion ulgamynda keylogger-leri ýüze çykarmak'
    }
  },
  common: {
    loading: 'Ýüklenýär...',
    error: 'Ýalňyşlyk',
    success: 'Üstünlik',
    warning: 'Duýduryş'
  }
}
