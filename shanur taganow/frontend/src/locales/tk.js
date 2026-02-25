export default {
  nav: {
    home: 'Baş sahypa',
    capture: 'Tutmak',
    analyze: 'Seljermek',
    protocols: 'Protokollar',
    howItWorks: 'Nähili işleýär',
    about: 'Barada'
  },
  home: {
    title: 'WireGuard Monitor',
    subtitle: 'Professional Tor Trafigi Seljeriş Guraly',
    description: 'Tor paketlerini hakyky wagtda tutuň, seljeriň we gözegçilik ediň. Şübheli işjeňligi ýüze çykaryň, tor protokollaryna düşüniň we tor howpsuzlygyny üpjün ediň.',
    features: {
      capture: {
        title: 'Paket Tutmak',
        desc: 'Islendik interfeýsden hakyky wagtda tor paketlerini tutuň'
      },
      analyze: {
        title: 'Çuňňur Seljerme',
        desc: 'Paket mazmunyny, başlyklaryny we ýüklerini seljeriň'
      },
      protocols: {
        title: 'Protokol Dekodirlemesi',
        desc: 'Dürli tor protokollaryny dekodirläň we düşüniň'
      },
      security: {
        title: 'Howpsuzlyk Gözegçiligi',
        desc: 'Şübheli tor işjeňligini we howplary ýüze çykaryň'
      }
    },
    startCapture: 'Tutmaga Başla',
    viewProtocols: 'Protokollary Gör'
  },
  capture: {
    title: 'Tor Paket Tutma',
    subtitle: 'Tor trafikini hakyky wagtda tutuň we gözegçilik ediň',
    interface: 'Tor Interfeýsi',
    selectInterface: 'Interfeýs saýlaň',
    filter: 'Tutma Süzgüji',
    filterPlaceholder: 'mysal, tcp port 80, udp, host 192.168.1.1',
    startCapture: 'Tutmaga Başla',
    stopCapture: 'Tutmagy Sakla',
    clearPackets: 'Arassala',
    capturing: 'Tutulýar...',
    packets: 'Paketler',
    bytes: 'Baýtlar',
    table: {
      no: 'No',
      time: 'Wagt',
      source: 'Çeşme',
      destination: 'Maksat',
      protocol: 'Protokol',
      length: 'Uzynlyk',
      info: 'Maglumat'
    },
    interfaces: {
      eth0: 'Ethernet (eth0)',
      wlan0: 'Wi-Fi (wlan0)',
      lo: 'Loopback (lo)',
      any: 'Ähli Interfeýsler'
    },
    noPackets: 'Entek hiç hili paket tutulmady. Tor trafikini görmek üçin tutmaga başlaň.',
    packetDetails: 'Paket Jikme-jiklikleri',
    hexDump: 'Hex Dump',
    rawData: 'Çig Maglumat'
  },
  analyze: {
    title: 'Trafik Seljermesi',
    subtitle: 'Tutulan tor trafik nagyşlaryny seljeriň',
    uploadCapture: 'Tutma Faýlyny Ýükle',
    orPaste: 'Ýa-da paket maglumatyny goýuň:',
    analyze: 'Trafigi Seljer',
    analyzing: 'Seljerilýär...',
    results: 'Seljerme Netijeleri',
    summary: {
      title: 'Trafik Jemi',
      totalPackets: 'Jemi Paketler',
      uniqueIPs: 'Üýtgeşik IP-lar',
      protocols: 'Protokollar',
      duration: 'Dowamlylygy',
      avgSize: 'Ort. Paket Ölçegi',
      bandwidth: 'Tahmini Giňişlik'
    },
    protocols: {
      title: 'Protokol Paýlanyşy',
      tcp: 'TCP',
      udp: 'UDP',
      icmp: 'ICMP',
      http: 'HTTP',
      https: 'HTTPS',
      dns: 'DNS',
      other: 'Beýleki'
    },
    topTalkers: {
      title: 'Iň Köp Gepleşýänler',
      ip: 'IP Salgysy',
      packets: 'Paketler',
      bytes: 'Baýtlar'
    },
    anomalies: {
      title: 'Ýüze Çykarylan Anomaliýalar',
      none: 'Hiç hili anomaliýa tapylmady',
      portScan: 'Port Skany Mümkin',
      ddos: 'DDoS Nagşy Mümkin',
      dataExfil: 'Maglumat Çykarylmagy Şübheli',
      malware: 'Zyýanly Programma Aragatnaşyk Nagşy'
    }
  },
  protocols: {
    title: 'Tor Protokollary',
    subtitle: 'Ýaýgyn tor protokollary barada öwreniň',
    search: 'Protokollary gözle...',
    layer: 'Gatlak',
    categories: {
      application: 'Amaly Gatlak',
      transport: 'Transport Gatlagy',
      network: 'Tor Gatlagy',
      dataLink: 'Maglumat Baglanşyk Gatlagy'
    },
    list: {
      http: {
        name: 'HTTP',
        desc: 'HyperText Transfer Protocol - Web aragatnaşygy',
        port: '80',
        layer: 'Amaly'
      },
      https: {
        name: 'HTTPS',
        desc: 'HTTP Howpsuz - Şifrlenen web aragatnaşygy',
        port: '443',
        layer: 'Amaly'
      },
      dns: {
        name: 'DNS',
        desc: 'Domain At Ulgamy - Domen atlaryny IP-lara çözýär',
        port: '53',
        layer: 'Amaly'
      },
      ftp: {
        name: 'FTP',
        desc: 'Faýl Geçiriş Protokoly - Faýl geçirimler',
        port: '21',
        layer: 'Amaly'
      },
      ssh: {
        name: 'SSH',
        desc: 'Howpsuz Gabyk - Şifrlenen uzakdan giriş',
        port: '22',
        layer: 'Amaly'
      },
      smtp: {
        name: 'SMTP',
        desc: 'Ýönekeý Poçta Geçiriş Protokoly - E-poçta iberme',
        port: '25',
        layer: 'Amaly'
      },
      tcp: {
        name: 'TCP',
        desc: 'Geçiriş Dolandyryş Protokoly - Ygtybarly maglumat eltip berme',
        port: '-',
        layer: 'Transport'
      },
      udp: {
        name: 'UDP',
        desc: 'Ulanyjy Datagram Protokoly - Çalt, ygtybarsyz eltip berme',
        port: '-',
        layer: 'Transport'
      },
      ip: {
        name: 'IP',
        desc: 'Internet Protokoly - Paket salgylama we ugurlandyrma',
        port: '-',
        layer: 'Tor'
      },
      icmp: {
        name: 'ICMP',
        desc: 'Internet Dolandyryş Habar Protokoly - Tor diagnostikasy',
        port: '-',
        layer: 'Tor'
      },
      arp: {
        name: 'ARP',
        desc: 'Salgy Çözme Protokoly - MAC salgy çözmesi',
        port: '-',
        layer: 'Maglumat Baglanyşygy'
      },
      ethernet: {
        name: 'Ethernet',
        desc: 'Ethernet Çarçuwasy - Fiziki tor aragatnaşygy',
        port: '-',
        layer: 'Maglumat Baglanyşygy'
      }
    }
  },
  howItWorks: {
    title: 'Tor Seljermesi Nähili Işleýär',
    subtitle: 'Paket tutmak we seljerme düşünmek',
    steps: {
      step1: {
        title: 'Paket Tutmak',
        desc: 'Tor interfeýsi promiscuous režimini ulanyp geçýän ähli paketleri tutýar'
      },
      step2: {
        title: 'Dekapsulýasiýa',
        desc: 'Her paket öz protokol gatlaklaryna bölünýär'
      },
      step3: {
        title: 'Protokol Dekodirlemesi',
        desc: 'Başlyklar we ýükler protokol spesifikasiýalaryna görä düşündirilýär'
      },
      step4: {
        title: 'Süzme',
        desc: 'Paketler ulanyjy tarapyndan kesgitlenen kriteriýalara esaslanyp süzülýär'
      },
      step5: {
        title: 'Seljerme',
        desc: 'Statistik seljerme nagyşlary we anomaliýalary ýüze çykarýar'
      }
    },
    faq: {
      q1: {
        question: 'Wireshark näme?',
        answer: 'Wireshark tor näsazlyklaryny düzetmek, seljerme, programma we protokol işläp düzmek we bilim üçin ulanylýan mugt we açyk çeşmeli paket analizatorydyr. Paketleri hakyky wagtda tutýar we adam okalýan formatda görkezýär.'
      },
      q2: {
        question: 'Promiscuous režimi näme?',
        answer: 'Promiscuous režimi tor interfeýsine diňe özüne salgylananlary däl, tor segmentindäki ähli paketleri tutmaga mümkinçilik berýär. Bu tor gözegçiligi we seljermesi üçin zerurdyr.'
      },
      q3: {
        question: 'Paket süzme nähili işleýär?',
        answer: 'Paket süzgüçleri protokollar (tcp, udp), portlar (port 80), IP salgylary (host 192.168.1.1) ýa-da kombinasiýalar ýaly belli kriteriýalara gabat gelmek üçin ifadeleri ulanýar. Bu degişli trafige üns bermäge kömek edýär.'
      },
      q4: {
        question: 'Tor gözegçiligi näme üçin möhüm?',
        answer: 'Tor gözegçiligi howpsuzlyk howplaryny ýüze çykarmaga, baglanyşyk meselelerini düzetmäge, amaly öndürijiligini seljermäge we tor laýyklygyny üpjün etmäge kömek edýär. Kiberhowpsuzlyk hünärmenleri üçin zerurdyr.'
      }
    }
  },
  about: {
    subtitle: 'Professional Tor Trafigi Seljermesi',
    description: 'Bu diplom taslamasy Wireshark-a meňzeş tor paketi tutmak we seljerme usullaryny görkezýär. Tor protokollarynyň nähili işleýändigine we şübheli tor işjeňligini nähili ýüze çykarmalydygyna düşünmäge kömek edýär.',
    author: {
      title: 'Awtor',
      name: 'Şanur Taganow',
      project: 'Diplom Taslamasy',
      topic: 'Network Traffic Analysis and Monitoring with Wireshark',
      topicTk: 'Wireshark bilen tor trafikini seljermek we gözegçilik etmek'
    }
  },
  common: {
    loading: 'Ýüklenýär...',
    error: 'Ýalňyşlyk',
    success: 'Üstünlik',
    save: 'Ýatda sakla',
    cancel: 'Ýatyr',
    export: 'Eksport',
    back: 'Yza'
  }
}
