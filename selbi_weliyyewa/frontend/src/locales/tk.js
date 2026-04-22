export default {
  nav: {
    home: 'Baş sahypa',
    attacks: 'Hüjümler',
    defense: 'Gorag',
    simulator: 'Simulýator',
    statistics: 'Statistika',
    howItWorks: 'Nähili işleýär',
    aiTest: 'AI Synag',
    about: 'Hakynda'
  },
  footer: {
    diploma: 'Diplom taslamasy',
    author: 'Awtor'
  },
  home: {
    title: 'GAN Howpsuzlyk Derňewçisi',
    subtitle: 'Generatiw Garşydaş Torlara (GAN) Hüjümler we Gorag Mehanizmlerini Öwrenmek',
    description: 'GAN-lara garşy dürli hüjüm usullaryny öwreniň we AI ulgamlaryny goramak üçin gorag strategiýalaryny öwreniň.',
    exploreAttacks: 'Hüjümleri öwren',
    learnDefense: 'Goragy öwren',
    features: {
      title: 'Esasy aýratynlyklar',
      attacks: {
        title: 'Hüjüm Derňewi',
        desc: 'Garşydaş mysallar, model tersleşdirme we agzalyk netijesi ýaly dürli hüjüm görnüşlerini öwreniň.'
      },
      defense: {
        title: 'Gorag Mehanizmleri',
        desc: 'Garşydaş türgenleşik, giriş öňünden işlemek we model berkitmek ýaly gorag usullaryny öwreniň.'
      },
      simulator: {
        title: 'Hüjüm Simulýatory',
        desc: 'Hüjümleriň GAN çykyşlaryna we model özüni alyp barşyna nähili täsir edýändiginiň interaktiw görkezilişi.'
      },
      visualize: {
        title: 'Wizualizasiýa',
        desc: 'Hüjümleriň we olaryň döredilen suratlara täsiriniň wizual görkezilişi.'
      }
    },
    stats: {
      attackTypes: 'Hüjüm görnüşleri',
      defenseStrategies: 'Gorag strategiýalary',
      vulnerabilities: 'Belli gowşaklyklar',
      mitigations: 'Ýeňilleşdirmeler'
    }
  },
  attacks: {
    title: 'GAN Hüjüm Görnüşleri',
    subtitle: 'Generatiw Garşydaş Torlara garşy dürli hüjüm wektorlaryna düşünmek',
    categories: {
      adversarial: {
        title: 'Garşydaş Mysallar',
        desc: 'Nädogry klassifikasiýa sebäp bolýan kiçi üýtgeşmeler',
        details: 'Garşydaş mysallar, maşyn öwreniş modelleriniň ýalňyşlyk etmegine sebäp bolmak üçin hüjümçi tarapyndan bilkastlaýyn döredilen girişlerdir. Bu üýtgeşmeler adamlara görünmez, emma model netijelerini düýpgöter üýtgedip biler.',
        methods: ['FGSM (Çalt Gradient Belgisi Usuly)', 'PGD (Proýeksiýalanan Gradient Düşüşi)', 'C&W Hüjümi', 'DeepFool']
      },
      inversion: {
        title: 'Model Tersleşdirme',
        desc: 'Model çykyşlaryndan türgenleşik maglumatlaryny dikeltmek',
        details: 'Model tersleşdirme hüjümleri modeliň çykyşlaryny ulanyp duýgur türgenleşik maglumatlaryny dikeltmäge synanyşýar. Bu GAN-lar hususy ýa-da duýgur maglumatlarda türgenleşdirilende aýratyn howply.',
        methods: ['Gradient esasly Tersleşdirme', 'Optimizasiýa Hüjümi', 'GAN esasly Dikeltme']
      },
      membership: {
        title: 'Agzalyk Netijesi',
        desc: 'Nusganyň türgenleşik maglumatlarynda bolandygyny kesgitlemek',
        details: 'Agzalyk netije hüjümleri belli bir maglumat nusgasynyň modeli türgenleşdirmek üçin ulanylandygyny ýa-da ýokdugyny kesgitlemäge synanyşýar. Bu türgenleşik maglumat toplumy barada duýgur maglumatlary açyp biler.',
        methods: ['Kölegeli Model Hüjümi', 'Bosaga Esasly Hüjüm', 'Diňe Bellikli Hüjüm']
      },
      poisoning: {
        title: 'Maglumat Zäherleme',
        desc: 'Model özüni alyp barşyny dolandyrmak üçin türgenleşik maglumatlaryny zaýalamak',
        details: 'Maglumat zäherleme hüjümleri modeliň özüni alyp barşyna täsir etmek üçin türgenleşik toplumyna zyýanly maglumatlar goşýar. Bu GAN-yň manipulýasiýa edilen ýa-da zyýanly çykyşlar döretmegine sebäp bolup biler.',
        methods: ['Arka Gapy Hüjümi', 'Arassa Bellikli Hüjüm', 'Gradient Esasly Zäherleme']
      },
      modeCollapse: {
        title: 'Rejimi Çöküşi Ulanmak',
        desc: 'GAN-yň çäklendirilen dürlülik döretmek meýlini ulanmak',
        details: 'Rejimi çöküşi GAN-yň çäklendirilen dürlülikde çykyşlar döredýän ýygy-ýygydan şowsuzlyk rejimidir. Hüjümçiler muny modeliň özüni alyp barşyny çaklamak we manipulýasiýa etmek üçin ulanyp bilerler.',
        methods: ['Dürlülik Ulanmak', 'Nagyş Tanamak Hüjümi']
      },
      stealing: {
        title: 'Model Ogurlamak',
        desc: 'Soraglar arkaly model parametrlerini çykarmak',
        details: 'Model ogurlamak hüjümleri nyşana modeli sorap we çykyşlaryndan öwrenip, modeliň göçürmesini döretmäge synanyşýar. Bu hususy arhitekturalary we türgenleşik maglumatlaryny açyp biler.',
        methods: ['Sorag Esasly Çykarmak', 'Distilýasiýa Hüjümi', 'API Gözleg']
      }
    },
    riskLevel: 'Howp derejesi',
    impact: 'Täsir',
    difficulty: 'Kynçylyk'
  },
  defense: {
    title: 'Gorag Mehanizmleri',
    subtitle: 'GAN-lary dürli hüjümlerden goramak strategiýalary',
    categories: {
      adversarialTraining: {
        title: 'Garşydaş Türgenleşik',
        desc: 'Berkitligi gowulandyrmak üçin garşydaş mysallar bilen türgenleşik',
        details: 'Modeli üýtgeşme hüjümlerine garşy has berk etmek üçin türgenleşik prosesine garşydaş mysallary goşuň.',
        effectiveness: 85
      },
      inputPreprocessing: {
        title: 'Giriş Öňünden Işlemek',
        desc: 'Modele bermezden ozal girişleri arassalamak',
        details: 'Garşydaş üýtgeşmeleri aýyrmak üçin JPEG gysmak, bit çuňlugyny azaltmak ýa-da giňişlik tekizlemek ýaly öwrülişikler ulanyň.',
        effectiveness: 70
      },
      gradientMasking: {
        title: 'Gradient Maskalamak',
        desc: 'Hüjümçilerden gradient maglumatlaryny gizlemek',
        details: 'Gradient esasly hüjümleriň netijeli bolmazlygy üçin gradientleri gizlemek ýa-da üýtgetmek.',
        effectiveness: 60
      },
      differentialPrivacy: {
        title: 'Diferensial Gizlinlik',
        desc: 'Türgenleşik maglumat gizlinligini goramak üçin ses goşmak',
        details: 'Maglumat gizlinligi barada matematiki kepillik bermek üçin türgenleşik wagtynda kalibrlenmiş ses goşuň.',
        effectiveness: 90
      },
      ensembleMethods: {
        title: 'Ansambly Usullar',
        desc: 'Berkitligi gowulandyrmak üçin birnäçe modeli ulanmak',
        details: 'Islendik bir modeliň hüjümleriniň täsirini azaltmak üçin birnäçe modeliň çaklamalaryny birleşdiriň.',
        effectiveness: 75
      },
      detectionMethods: {
        title: 'Hüjüm Kesgitlemek',
        desc: 'Garşydaş girişleri kesgitlemek we ret etmek',
        details: 'Garşydaş girişleri işlemezden ozal kesgitlemek we ret etmek üçin statistik usullary ýa-da ikinji modelleri ulanyň.',
        effectiveness: 80
      }
    },
    effectiveness: 'Netijelelik',
    implementation: 'Durmuşa geçirmegiň kynçylygy'
  },
  simulator: {
    title: 'Hüjüm Simulýatory',
    subtitle: 'GAN hüjümleriniň interaktiw görkezilişi',
    selectAttack: 'Hüjüm görnüşini saýlaň',
    attackStrength: 'Hüjüm güýji',
    runSimulation: 'Simulýasiýa başla',
    reset: 'Täzeden başla',
    original: 'Asyl surat',
    attacked: 'Hüjüm edilen surat',
    difference: 'Tapawut',
    results: {
      title: 'Simulýasiýa Netijeleri',
      perturbation: 'Üýtgeşme ölçegi',
      confidence: 'Model ynamy',
      success: 'Hüjüm üstünligi',
      detected: 'Gorag tapdy'
    }
  },
  statistics: {
    title: 'GAN Howpsuzlyk Statistikasy',
    subtitle: 'Hüjümleriň, goraglaryň we olaryň netijeliliginiň wizual derňewi',
    attackEffectiveness: 'Hüjüm Üstünlik Derejesi',
    defenseEffectiveness: 'Gorag Netijeliligi',
    riskDistribution: 'Howp Paýlanyşy',
    timeline: 'GAN Howpsuzlyk Senenamalary (2019-2026)',
    comparisonTable: 'Hüjüm we Gorag Deňeşdirmesi',
    keyInsights: 'Möhüm Netijeler',
    totalAttacks: 'Hüjüm Görnüşleri',
    totalDefenses: 'Gorag Usullary',
    avgEffectiveness: 'Ort. Netijelilik',
    criticalRisks: 'Howply Ýagdaýlar',
    attack: 'Hüjüm',
    riskLevel: 'Howp Derejesi',
    bestDefense: 'Iň Gowy Gorag',
    effectiveness: 'Netijelilik'
  },
  howItWorks: {
    title: 'GAN-lar we Hüjümler Nähili Işleýär',
    subtitle: 'Esaslara düşünmek',
    ganBasics: {
      title: 'GAN Esaslary',
      content: 'Generatiw Garşydaş Torlar iki nerw torundan durýar: galp maglumatlar döredýän Generator we hakyky bilen galpy tapawutlandyrmaga synanyşýan Diskriminator. Olar minimax oýunda bäsleşip, biri-birini gowulandyrýarlar.',
      generator: 'Generator galp nusgalar döredýär',
      discriminator: 'Diskriminator hakykyny galp bilen tapawutlandyrýar',
      training: 'Ikisi hem garşydaş türgenleşik arkaly gowulanýar'
    },
    attackProcess: {
      title: 'Hüjüm Prosesi',
      step1: { title: 'Nyşana Derňewi', desc: 'Hüjümçi modeliň arhitekturasyny we özüni alyp barşyny derňeýär' },
      step2: { title: 'Gowşaklygy Kesgitlemek', desc: 'Modelda ýa-da türgenleşik prosesinde gowşaklyklary tapmak' },
      step3: { title: 'Hüjüm Döretmek', desc: 'Hüjüm girişlerini ýa-da zäherli maglumatlary döretmek' },
      step4: { title: 'Ýerine ýetiriş', desc: 'Nyşana modeline garşy hüjümi ýerleşdirmek' },
      step5: { title: 'Ulanmak', desc: 'Zyýanly maksatlar üçin bozulan modeli ulanmak' }
    },
    defenseProcess: {
      title: 'Gorag Prosesi',
      step1: { title: 'Howp Modelleme', desc: 'Mümkin bolan hüjüm wektorlaryny kesgitlemek' },
      step2: { title: 'Gorag Saýlamak', desc: 'Degişli gorag mehanizmlerini saýlamak' },
      step3: { title: 'Durmuşa Geçirmek', desc: 'Goraglary ulgama birleşdirmek' },
      step4: { title: 'Synag', desc: 'Gorag netijeliligini bahalandyrmak' },
      step5: { title: 'Gözegçilik', desc: 'Täze hüjümler üçin yzygiderli gözegçilik' }
    },
    faq: {
      title: 'Köp Soralýan Soraglar',
      q1: { question: 'GAN näme?', answer: 'Generatiw Garşydaş Tor hakyky sintetik maglumatlar döretmek üçin biri-biri bilen bäsleşýän iki nerw torundan durýan maşyn öwreniş modelidir.' },
      q2: { question: 'GAN-lar näme üçin hüjümlere sezewar?', answer: 'GAN-lar gradient esasly optimizasiýa daýanýandygy, türgenleşik maglumatlaryny ýatda saklap bilýändigi we olaryň goşa-tor arhitekturasynyň üýtgeşik hüjüm ýüzlerini döredýändigi sebäpli sezewar.' },
      q3: { question: 'GAN-lar doly howpsuzlandyrylyp bilermi?', answer: 'Hiç bir ulgam 100% howpsuz bolup bilmese-de, birnäçe gorag mehanizmlerini birleşdirmek üstünlikli hüjümleriň howpuny ep-esli azaldyp biler.' },
      q4: { question: 'Iň howply hüjüm haýsy?', answer: 'Maglumat zäherleme hüjümleri aýratyn howply, sebäbi olar türgenleşik wagtynda modeli bozup, ähli geljekki çykyşlara täsir edip biler.' }
    }
  },
  about: {
    title: 'GAN Howpsuzlyk Hakynda',
    subtitle: 'Generatiw Garşydaş Torlara Garşy Hüjümler we Howpsuzlyk Çäreleri Barada Gözleg',
    description: 'Bu taslama Generatiw Garşydaş Torlaryň howpsuzlyk gowşaklyklaryny öwrenýär we gorag strategiýalary bilen birlikde dürli hüjüm usullaryny görkezýär.',
    whatIsGan: {
      title: 'GAN näme?',
      content: 'Generatiw Garşydaş Torlar (GAN-lar) iki nerw torunyň oýunda bäsleşýän maşyn öwreniş çarçuwasydyr. Generator galp maglumatlar döredýär, Diskriminator bolsa onuň hakykylygyna baha berýär. Bu garşydaş proses örän hakyky sintetik maglumat döretmäge getirýär.'
    },
    purpose: {
      title: 'Taslamanyň Maksady',
      content: 'Bu diplom taslamasy GAN-laryň howpsuzlyk taraplaryny, dürli hüjüm wektorlaryny we gorag mehanizmlerini öwrenmek we görkezmek üçin işlenip düzüldi. Bu gowşaklyklara düşünmek AI ulgamlaryny howpsuz ýerleşdirmek üçin möhümdir.'
    },
    author: {
      title: 'Awtor',
      name: 'Selbi Weliýewa',
      project: 'Diplom Taslamasy',
      topic: 'Attacks to GANs and Security',
      topicTk: 'GAN (Generative Adversarial Networks) garşy hüjümler we howpsuzlyk'
    }
  },
  common: {
    loading: 'Ýüklenýär...',
    error: 'Ýalňyşlyk',
    success: 'Üstünlik',
    high: 'Ýokary',
    medium: 'Orta',
    low: 'Pes',
    critical: 'Howply'
  }
}
