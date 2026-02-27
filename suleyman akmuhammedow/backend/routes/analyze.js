const express = require('express')
const router = express.Router()
const dns = require('dns').promises
const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)

// Port service mapping
const portServices = {
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  143: 'IMAP',
  443: 'HTTPS',
  445: 'SMB',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  6379: 'Redis',
  8080: 'HTTP-Alt',
  27017: 'MongoDB'
}

// Common ports to scan
const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 6379, 8080, 27017]

// Risk calculation based on open ports
const calculateRisk = (openPorts) => {
  let score = 0
  const criticalPorts = [23, 445, 3389, 6379, 27017] // Telnet, SMB, RDP, Redis, MongoDB
  const highRiskPorts = [21, 3306, 5432] // FTP, MySQL, PostgreSQL

  openPorts.forEach(port => {
    if (criticalPorts.includes(port.port)) {
      score += 20
    } else if (highRiskPorts.includes(port.port)) {
      score += 10
    } else {
      score += 5
    }
  })

  return Math.min(score, 100)
}

// Get risk level from score
const getRiskLevel = (score) => {
  if (score >= 70) return 'CRITICAL'
  if (score >= 50) return 'HIGH'
  if (score >= 30) return 'MEDIUM'
  return 'LOW'
}

// DNS lookup
const dnsLookup = async (target) => {
  try {
    const addresses = await dns.resolve4(target)
    return { success: true, ip: addresses[0], allIPs: addresses }
  } catch (error) {
    // If target is already an IP, return it
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target)) {
      return { success: true, ip: target, allIPs: [target] }
    }
    return { success: false, error: error.message }
  }
}

// Ping target
const pingTarget = async (target) => {
  try {
    const { stdout } = await execAsync(`ping -c 4 -W 5 ${target}`, { timeout: 15000 })
    const latencyMatch = stdout.match(/time=(\d+\.?\d*)/g)
    const ttlMatch = stdout.match(/ttl=(\d+)/i)

    const latencies = latencyMatch ? latencyMatch.map(l => parseFloat(l.replace('time=', ''))) : []
    const avgLatency = latencies.length ? Math.round(latencies.reduce((a, b) => a + b) / latencies.length) : null

    return {
      success: true,
      latency: avgLatency,
      ttl: ttlMatch ? parseInt(ttlMatch[1]) : null,
      raw: stdout.substring(0, 500)
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Simple port check (TCP connect)
const checkPort = (host, port, timeout = 2000) => {
  return new Promise((resolve) => {
    const net = require('net')
    const socket = new net.Socket()

    socket.setTimeout(timeout)

    socket.on('connect', () => {
      socket.destroy()
      resolve({ port, status: 'open', service: portServices[port] || 'unknown' })
    })

    socket.on('timeout', () => {
      socket.destroy()
      resolve({ port, status: 'filtered' })
    })

    socket.on('error', () => {
      socket.destroy()
      resolve({ port, status: 'closed' })
    })

    socket.connect(port, host)
  })
}

// Port scan
const portScan = async (ip) => {
  const results = await Promise.all(commonPorts.map(port => checkPort(ip, port)))
  return results.filter(r => r.status === 'open')
}

// WHOIS lookup
const whoisLookup = async (target) => {
  try {
    const { stdout } = await execAsync(`whois ${target}`, { timeout: 15000 })

    const registrarMatch = stdout.match(/Registrar:\s*(.+)/i)
    const createdMatch = stdout.match(/Creation Date:\s*(.+)/i) || stdout.match(/Created:\s*(.+)/i)
    const expiresMatch = stdout.match(/Expir[yation]+ Date:\s*(.+)/i) || stdout.match(/Expires:\s*(.+)/i)
    const countryMatch = stdout.match(/Country:\s*(.+)/i)

    return {
      success: true,
      registrar: registrarMatch ? registrarMatch[1].trim() : null,
      created: createdMatch ? createdMatch[1].trim() : null,
      expires: expiresMatch ? expiresMatch[1].trim() : null,
      country: countryMatch ? countryMatch[1].trim() : null,
      raw: stdout.substring(0, 2000)
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// GeoIP lookup (using free API)
const geoLookup = async (ip) => {
  try {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()

    if (data.status === 'success') {
      return {
        success: true,
        city: data.city,
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        isp: data.isp,
        org: data.org,
        lat: data.lat,
        lon: data.lon
      }
    }
    return { success: false, error: 'GeoIP lookup failed' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Generate security assessment
const generateSecurityAssessment = (openPorts, riskScore, language = 'en') => {
  const issues = []
  const warnings = []
  const recommendations = []

  const messages = {
    en: {
      criticalPorts: 'Critical ports detected that may expose sensitive services',
      telnet: 'Telnet (port 23) is unencrypted and insecure',
      smb: 'SMB (port 445) can be vulnerable to ransomware attacks',
      rdp: 'RDP (port 3389) is frequently targeted by attackers',
      ftp: 'FTP (port 21) transmits data in plain text',
      database: 'Database port exposed to the internet',
      manyPorts: 'Multiple open ports increase attack surface',
      closePorts: 'Close unnecessary ports to reduce attack surface',
      useVpn: 'Consider using a VPN for remote access',
      updateServices: 'Keep all services updated to latest versions',
      useFirewall: 'Implement proper firewall rules',
      monitorLogs: 'Monitor access logs regularly'
    },
    tk: {
      criticalPorts: 'Möhüm hyzmatlar açylyp biler diýip howply portlar tapyldy',
      telnet: 'Telnet (port 23) şifrlenmän we howpsuz däl',
      smb: 'SMB (port 445) ransomware hüjümlerine sezewar bolup biler',
      rdp: 'RDP (port 3389) hüjümçiler tarapyndan yzygiderli nyşana alynýar',
      ftp: 'FTP (port 21) maglumatlary açyk tekst görnüşinde iberýär',
      database: 'Maglumat bazasy porty internete açyk',
      manyPorts: 'Köp açyk portlar hüjüm ýüzüni artdyrýar',
      closePorts: 'Hüjüm ýüzüni azaltmak üçin gereksiz portlary ýapyň',
      useVpn: 'Uzakdan girmek üçin VPN ulanmagy göz öňünde tutuň',
      updateServices: 'Ähli hyzmatlary iň soňky wersiýalara täzeläň',
      useFirewall: 'Dogry firewall düzgünlerini durmuşa geçiriň',
      monitorLogs: 'Giriş ýazgylaryny yzygiderli gözegçilikde saklaň'
    }
  }

  const m = messages[language] || messages.en

  // Check for critical ports
  const portNumbers = openPorts.map(p => p.port)

  if (portNumbers.includes(23)) {
    issues.push(m.telnet)
  }
  if (portNumbers.includes(445)) {
    issues.push(m.smb)
  }
  if (portNumbers.includes(3389)) {
    issues.push(m.rdp)
  }
  if (portNumbers.includes(21)) {
    warnings.push(m.ftp)
  }
  if (portNumbers.some(p => [3306, 5432, 27017, 6379].includes(p))) {
    issues.push(m.database)
  }
  if (openPorts.length > 5) {
    warnings.push(m.manyPorts)
  }

  // Add recommendations
  if (openPorts.length > 0) {
    recommendations.push(m.closePorts)
  }
  if (portNumbers.includes(3389) || portNumbers.includes(22)) {
    recommendations.push(m.useVpn)
  }
  recommendations.push(m.updateServices)
  recommendations.push(m.useFirewall)
  recommendations.push(m.monitorLogs)

  return { issues, warnings, recommendations }
}

// Main analyze endpoint
router.post('/analyze', async (req, res) => {
  const { target, language = 'en' } = req.body

  if (!target) {
    return res.status(400).json({ success: false, error: 'Target is required' })
  }

  const logs = []
  const addLog = (message, type = 'info') => {
    logs.push({ message, type, time: new Date().toISOString() })
  }

  try {
    addLog(language === 'en' ? `Starting analysis of ${target}...` : `${target} derňewi başlanýar...`, 'info')

    // DNS Resolution
    addLog(language === 'en' ? 'Resolving DNS...' : 'DNS çözülýär...', 'info')
    const dnsResult = await dnsLookup(target)

    if (!dnsResult.success) {
      addLog(language === 'en' ? 'DNS resolution failed' : 'DNS çözgüdi şowsuz', 'error')
      return res.json({ success: false, error: 'DNS resolution failed', logs })
    }

    const ip = dnsResult.ip
    addLog(language === 'en' ? `Resolved to ${ip}` : `${ip} salgysy tapyldy`, 'success')

    // Ping
    addLog(language === 'en' ? 'Pinging target...' : 'Nyşana ping edilýär...', 'info')
    const pingResult = await pingTarget(ip)
    if (pingResult.success) {
      addLog(language === 'en' ? `Ping: ${pingResult.latency}ms, TTL: ${pingResult.ttl}` : `Ping: ${pingResult.latency}ms, TTL: ${pingResult.ttl}`, 'success')
    }

    // GeoIP
    addLog(language === 'en' ? 'Looking up geolocation...' : 'Ýerleşiş gözlenýär...', 'info')
    const geoResult = await geoLookup(ip)
    if (geoResult.success) {
      addLog(language === 'en' ? `Location: ${geoResult.city}, ${geoResult.country}` : `Ýerleşiş: ${geoResult.city}, ${geoResult.country}`, 'success')
    }

    // Port Scan
    addLog(language === 'en' ? 'Scanning ports...' : 'Portlar skanirlenýär...', 'info')
    const openPorts = await portScan(ip)
    addLog(language === 'en' ? `Found ${openPorts.length} open ports` : `${openPorts.length} açyk port tapyldy`, openPorts.length > 0 ? 'warning' : 'success')

    // WHOIS (only for domains)
    let whoisResult = null
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target)) {
      addLog(language === 'en' ? 'Querying WHOIS...' : 'WHOIS soralýar...', 'info')
      whoisResult = await whoisLookup(target)
      if (whoisResult.success) {
        addLog(language === 'en' ? 'WHOIS data retrieved' : 'WHOIS maglumatlary alyndy', 'success')
      }
    }

    // Calculate risk
    const riskScore = calculateRisk(openPorts)
    const riskLevel = getRiskLevel(riskScore)
    addLog(language === 'en' ? `Risk Score: ${riskScore}% (${riskLevel})` : `Howp Baly: ${riskScore}% (${riskLevel})`, riskScore > 50 ? 'warning' : 'success')

    // Security assessment
    const security = generateSecurityAssessment(openPorts, riskScore, language)

    addLog(language === 'en' ? 'Analysis complete!' : 'Derňew tamamlandy!', 'success')

    res.json({
      success: true,
      target,
      ip,
      riskScore,
      riskLevel,
      ping: pingResult.success ? pingResult : null,
      geo: geoResult.success ? geoResult : null,
      openPorts,
      whois: whoisResult?.success ? whoisResult : null,
      issues: security.issues,
      warnings: security.warnings,
      recommendations: security.recommendations,
      logs,
      analyzedAt: new Date().toISOString()
    })

  } catch (error) {
    addLog(`Error: ${error.message}`, 'error')
    res.status(500).json({ success: false, error: error.message, logs })
  }
})

// Demo endpoint
router.get('/demo', (req, res) => {
  const demoData = {
    success: true,
    target: 'example.com',
    ip: '93.184.216.34',
    riskScore: 35,
    riskLevel: 'MEDIUM',
    ping: { latency: 42, ttl: 56 },
    geo: {
      city: 'Los Angeles',
      country: 'United States',
      countryCode: 'US',
      region: 'California',
      isp: 'Edgecast Inc.',
      org: 'Edgecast Inc.'
    },
    openPorts: [
      { port: 80, status: 'open', service: 'HTTP' },
      { port: 443, status: 'open', service: 'HTTPS' }
    ],
    whois: {
      registrar: 'RESERVED-Internet Assigned Numbers Authority',
      created: '1995-08-14',
      expires: '2026-08-13'
    },
    issues: [],
    warnings: ['Standard web ports are open'],
    recommendations: [
      'Keep web server software updated',
      'Implement proper firewall rules',
      'Use HTTPS for all connections'
    ],
    logs: [
      { message: 'Starting analysis of example.com...', type: 'info' },
      { message: 'Resolved to 93.184.216.34', type: 'success' },
      { message: 'Ping: 42ms, TTL: 56', type: 'success' },
      { message: 'Location: Los Angeles, United States', type: 'success' },
      { message: 'Found 2 open ports', type: 'success' },
      { message: 'WHOIS data retrieved', type: 'success' },
      { message: 'Risk Score: 35% (MEDIUM)', type: 'success' },
      { message: 'Analysis complete!', type: 'success' }
    ],
    analyzedAt: new Date().toISOString()
  }

  res.json(demoData)
})

module.exports = router
