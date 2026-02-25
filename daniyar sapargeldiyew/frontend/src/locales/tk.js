export default {
  nav: {
    home: 'Baş sahypa',
    attackLab: 'Hüjüm Laboratoriýasy',
    defense: 'Goranyş',
    scanner: 'Skanirleýji',
    howItWorks: 'Nähili işleýär',
    about: 'Barada'
  },
  home: {
    title: 'XSS Shield',
    subtitle: 'Cross-Site Scripting Hüjüm & Goranyş Laboratoriýasy',
    description: 'XSS hüjümleriniň nähili işleýändigini öwreniň, howpsuz gurşawda türgenleşiň we dogry goranyş usullaryny ulanyň. Bu bilim platformasy hüjüm wektorlaryny we gorag usullaryny görkezýär.',
    features: {
      attack: {
        title: 'Hüjüm Simulýasiýasy',
        desc: 'Howpsuz, gözegçilik astyndaky gurşawda XSS hüjümlerini türgenleşiň'
      },
      defense: {
        title: 'Goranyş Usullary',
        desc: 'Giriş barlagy, çykyş kodlaşdyrma we CSP-ni öwreniň'
      },
      scanner: {
        title: 'Ejizlik Skanirleýjisi',
        desc: 'Kody potensial XSS ejizlikleri üçin skaner ediň'
      },
      learn: {
        title: 'Bilim Mazmuny',
        desc: 'XSS görnüşlerine we öňüni alyş usullaryna düşüniň'
      }
    },
    tryAttackLab: 'Hüjüm Laboratoriýasyny Synap Gör',
    learnDefense: 'Goranyşy Öwren'
  },
  attackLab: {
    title: 'XSS Hüjüm Laboratoriýasy',
    subtitle: 'Howpsuz gurşawda XSS hüjümlerini türgenleşiň',
    warning: 'Diňe bilim maksatly! Bu usullary rugsat bolmazdan hakyky web sahypalarynda hiç wagt ulanmaň.',
    selectAttack: 'Hüjüm Görnüşini Saýlaň',
    attackTypes: {
      reflected: {
        name: 'Şöhlelendirilen XSS',
        desc: 'Zyýanly skript web serwerinden şöhlelenýär'
      },
      stored: {
        name: 'Saklanýan XSS',
        desc: 'Zyýanly skript nyşana serwerde hemişelik saklanýar'
      },
      dom: {
        name: 'DOM-esasly XSS',
        desc: 'Hüjüm ýüki DOM-y üýtgetmek arkaly ýerine ýetirilýär'
      }
    },
    payload: 'Hüjüm Ýüki',
    payloadPlaceholder: 'XSS ýükini giriziň...',
    targetInput: 'Ejiz Giriş Meýdany',
    targetPlaceholder: 'Bu ýere bir zat ýazyň...',
    executeAttack: 'Hüjümi Ýerine Ýetir',
    result: 'Netije',
    resultPreview: 'Görkeziş (Sandboxed)',
    examples: {
      title: 'Mysal Ýükler',
      basic: 'Ýönekeý Alert',
      cookie: 'Cookie Ogurlamak',
      redirect: 'Sahypa Ugratmak',
      keylogger: 'Keylogger'
    },
    success: 'XSS Hüjümi Üstünlikli!',
    blocked: 'Hüjüm Goranyş tarapyndan Blokirlendi'
  },
  defense: {
    title: 'XSS Goranyş Usullary',
    subtitle: 'XSS hüjümlerinden nähili goranmalydygyny öwreniň',
    techniques: {
      inputValidation: {
        name: 'Giriş Barlagy',
        desc: 'Ähli ulanyjy girişlerini barlaň we arassalaň',
        example: 'Rugsat berlen simwollaryň ak sanawyny ulanyň, şübheli nagyşlary ret ediň'
      },
      outputEncoding: {
        name: 'Çykyş Kodlaşdyrma',
        desc: 'Görkezmezden öň ýörite simwollary kodlaň',
        example: '< &lt; bolýar > &gt; bolýar'
      },
      csp: {
        name: 'Content Security Policy',
        desc: 'Çeşme ýüklemesini dolandyrýan HTTP başlygy',
        example: "Content-Security-Policy: script-src 'self'"
      },
      httpOnly: {
        name: 'HttpOnly Cookie-ler',
        desc: 'JavaScript-iň cookie-lere girmeginiň öňüni alyň',
        example: 'Set-Cookie: session=abc; HttpOnly'
      },
      sanitization: {
        name: 'HTML Arassalama',
        desc: 'Howply HTML teglerini we atributlary aýyryň',
        example: 'DOMPurify.sanitize(userInput)'
      },
      escaping: {
        name: 'Kontekste Bagly Gaçma',
        desc: 'Çykyş kontekstine görä gaçyň (HTML, JS, URL)',
        example: 'HTML we JavaScript üçin dürli gaçyş'
      }
    },
    tryDefense: 'Goranyşy Synap Gör',
    inputLabel: 'Zyýanly Giriş',
    outputLabel: 'Arassalanan Çykyş',
    defenseEnabled: 'Goranyş Açyk',
    testDefense: 'Goranyşy Syna'
  },
  scanner: {
    title: 'XSS Ejizlik Skanirleýjisi',
    subtitle: 'Koduňyzy potensial XSS ejizlikleri üçin skaner ediň',
    pasteCode: 'Koduňyzy Goýuň',
    codePlaceholder: 'HTML, JavaScript ýa-da serwer tarapy kodyny bu ýere goýuň...',
    selectLanguage: 'Dil Saýlaň',
    scan: 'Ejizlikleri Skanirle',
    scanning: 'Skanirlenýär...',
    results: 'Skaner Netijeleri',
    noVulnerabilities: 'Hiç hili ejizlik tapylmady!',
    vulnerabilitiesFound: 'Tapylan Ejizlikler',
    line: 'Setir',
    severity: 'Agramy',
    description: 'Düşündiriş',
    recommendation: 'Maslahat',
    severities: {
      critical: 'Kritiki',
      high: 'Ýokary',
      medium: 'Orta',
      low: 'Pes'
    }
  },
  howItWorks: {
    title: 'XSS Hüjümleri Nähili Işleýär',
    subtitle: 'Cross-Site Scripting düşünmek',
    steps: {
      step1: {
        title: 'Sanjym',
        desc: 'Hüjümçi ulanyjy girişi arkaly zyýanly skript sanjýar'
      },
      step2: {
        title: 'Saklama/Şöhlelendirme',
        desc: 'Skript serwerde saklanýar ýa-da jogapda şöhlelenýär'
      },
      step3: {
        title: 'Eltip Berme',
        desc: 'Pidakär zyýanly skripti öz içine alýan sahypa girýär'
      },
      step4: {
        title: 'Ýerine Ýetirme',
        desc: 'Brauzer pidakäriň kontekstinde skripti ýerine ýetirýär'
      },
      step5: {
        title: 'Ulanma',
        desc: 'Hüjümçi maglumatlary ogurlaýar, sessiýalary ele geçirýär ýa-da sahypany bozýar'
      }
    },
    faq: {
      q1: {
        question: 'XSS näme?',
        answer: 'Cross-Site Scripting (XSS) hüjümçilere beýleki ulanyjylar tarapyndan görülýän web sahypalaryna zyýanly skriptleri sanjmaga mümkinçilik berýän howpsuzlyk ejizligidir. Amaly dogry barlag ýa-da gaçyş bolmazdan ynanylmaýan maglumatlary web sahypasyna goşanda bolýar.'
      },
      q2: {
        question: 'XSS-iň görnüşleri nähili?',
        answer: 'Üç esasy görnüş bar: Şöhlelendirilen XSS (skript serwerden şöhlelenýär), Saklanýan XSS (skript serwerde saklanýar) we DOM-esasly XSS (skript DOM-y göni manipulirleýär). Her biri dürli öňüni alyş strategiýalaryny talap edýär.'
      },
      q3: {
        question: 'XSS näderejede howply?',
        answer: 'XSS sessiýa ogurlamaga, şahsyýet ogurlamaga, web sahypa bozmagyna, zyýanly programma paýlamagyna we keylogging-e sebäp bolup biler. Ol hemişe OWASP Top 10 web ejizlikleriniň arasynda.'
      },
      q4: {
        question: 'XSS-iň öňüni nähili almaly?',
        answer: 'Öňüni alyş öz içine alýar: giriş barlagy, çykyş kodlaşdyrma, Content Security Policy (CSP), HttpOnly cookie-ler, DOMPurify ýaly howpsuzlyk kitaphanalaryny ulanmak we çarçuwalary täzeläp durmak.'
      }
    },
    xssTypes: {
      title: 'XSS Görnüşleriniň Deňeşdirmesi',
      reflected: {
        name: 'Şöhlelendirilen XSS',
        vector: 'URL parametrleri, forma girişleri',
        persistence: 'Hemişelik däl',
        example: 'Gözleg netijeleri sahypasy'
      },
      stored: {
        name: 'Saklanýan XSS',
        vector: 'Maglumatlar bazasy, teswirler, profiller',
        persistence: 'Hemişelik',
        example: 'Forum teswirler, ulanyjy profilleri'
      },
      dom: {
        name: 'DOM XSS',
        vector: 'Klient tarapy JavaScript',
        persistence: 'Hemişelik däl',
        example: 'URL fragment dolandyryş'
      }
    }
  },
  about: {
    subtitle: 'XSS Hüjüm & Goranyş Bilim Platformasy',
    description: 'Bu diplom taslamasy Cross-Site Scripting ejizliklerine düşünmek üçin giňişleýin öwreniş gurşawyny üpjün edýär. Hüjümleriň nähili işleýändigini we olardan nähili goranmalydygyny görkezýär.',
    author: {
      title: 'Awtor',
      name: 'Daniýar Sapargeldiyew',
      project: 'Diplom Taslamasy',
      topic: 'XSS Attack and Defense Techniques',
      topicTk: 'XSS hüjümi we goranyş usullary'
    }
  },
  common: {
    loading: 'Ýüklenýär...',
    error: 'Ýalňyşlyk',
    success: 'Üstünlik',
    warning: 'Duýduryş',
    info: 'Maglumat',
    copy: 'Kopiýala',
    copied: 'Kopiýalandy!'
  }
}
