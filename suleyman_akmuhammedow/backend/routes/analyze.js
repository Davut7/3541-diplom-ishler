// OSINT Analyzer v3.0 — Cross-platform, secure
// SECURITY: All user input validated via sanitizeHost() which allows only [a-z0-9.-]
// before being used in any shell command. execSync calls use hardcoded command names
// with the sanitized target appended. This prevents command injection.

const express = require('express')
const router = express.Router()
const dns = require('dns').promises
const net = require('net')
const os = require('os')
const { execSync } = require('child_process') // eslint-disable-line security/detect-child-process

const isWin = os.platform() === 'win32'

function sanitizeHost(h) {
  if (!h || typeof h !== 'string') return null
  const clean = h.trim().toLowerCase()
  if (!/^[a-z0-9.\-]+$/.test(clean) || clean.length > 253) return null
  return clean
}

const portServices = {
  20:'FTP-Data', 21:'FTP', 22:'SSH', 23:'Telnet', 25:'SMTP', 53:'DNS', 67:'DHCP',
  80:'HTTP', 110:'POP3', 123:'NTP', 143:'IMAP', 443:'HTTPS', 445:'SMB',
  465:'SMTPS', 587:'SMTP-Sub', 993:'IMAPS', 995:'POP3S',
  1433:'MSSQL', 3306:'MySQL', 3389:'RDP', 5432:'PostgreSQL', 5900:'VNC',
  6379:'Redis', 8080:'HTTP-Alt', 8443:'HTTPS-Alt', 9200:'Elasticsearch',
  11211:'Memcached', 27017:'MongoDB',
}
const commonPorts = Object.keys(portServices).map(Number)

const calculateRisk = (open) => {
  let s = 0; const crit = [23,445,3389,6379,27017,11211,9200], high = [21,1433,3306,5432,5900]
  open.forEach(p => { if (crit.includes(p.port)) s += 20; else if (high.includes(p.port)) s += 10; else s += 5 })
  return Math.min(s, 100)
}
const getRiskLevel = (s) => s >= 70 ? 'CRITICAL' : s >= 50 ? 'HIGH' : s >= 30 ? 'MEDIUM' : 'LOW'

// DNS (safe — Node.js module)
async function dnsLookup(target) {
  try {
    const start = Date.now(); const addrs = await dns.resolve4(target)
    let mx = [], ns = []; try { mx = await dns.resolveMx(target) } catch (e) {} try { ns = await dns.resolveNs(target) } catch (e) {}
    return { success: true, ip: addrs[0], allIPs: addrs, mx: mx.map(m => m.exchange), ns, duration: `${Date.now()-start}ms` }
  } catch (e) {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target)) return { success: true, ip: target, allIPs: [target] }
    return { success: false, error: e.message }
  }
}

// Ping (sanitized)
function pingTarget(host) {
  const safe = sanitizeHost(host); if (!safe) return { success: false, error: 'Invalid' }
  try {
    // safe contains only [a-z0-9.-] — no injection possible
    const cmd = isWin ? 'ping -n 4 -w 5000 ' + safe : 'ping -c 4 -W 5 ' + safe
    const out = execSync(cmd, { encoding: 'utf8', timeout: 15000 }) // eslint-disable-line
    const lm = out.match(/time[=<](\d+\.?\d*)/g); const lats = lm ? lm.map(l => parseFloat(l.replace(/time[=<]/,''))) : []
    const ttlM = out.match(/ttl=(\d+)/i)
    return { success: true, latency: lats.length ? Math.round(lats.reduce((a,b)=>a+b)/lats.length) : null, minLatency: lats.length ? Math.min(...lats) : null, maxLatency: lats.length ? Math.max(...lats) : null, ttl: ttlM ? parseInt(ttlM[1]) : null, packetLoss: `${Math.round((1-lats.length/4)*100)}%` }
  } catch (e) { return { success: false, error: 'Unreachable' } }
}

// Port check (safe — Node.js net module)
function checkPort(host, port, timeout = 2000) {
  return new Promise(r => { const s = new net.Socket(); const t = Date.now(); s.setTimeout(timeout); s.on('connect', () => { s.destroy(); r({ port, status: 'open', service: portServices[port]||'unknown', duration: `${Date.now()-t}ms` }) }); s.on('timeout', () => { s.destroy(); r({ port, status: 'filtered' }) }); s.on('error', () => { s.destroy(); r({ port, status: 'closed' }) }); s.connect(port, host) })
}

async function portScan(ip) {
  const results = await Promise.all(commonPorts.map(p => checkPort(ip, p)))
  return { open: results.filter(r => r.status === 'open'), closed: results.filter(r => r.status === 'closed').length, filtered: results.filter(r => r.status === 'filtered').length, total: commonPorts.length }
}

// WHOIS (sanitized)
function whoisLookup(target) {
  const safe = sanitizeHost(target); if (!safe) return { success: false, error: 'Invalid' }
  try {
    let out
    if (isWin) {
      try { out = execSync('whois ' + safe, { encoding: 'utf8', timeout: 15000 }) } // eslint-disable-line
      catch (e) { out = execSync('nslookup ' + safe, { encoding: 'utf8', timeout: 10000 }); return { success: true, raw: out.substring(0, 2000), note: 'WHOIS unavailable, showing nslookup' } } // eslint-disable-line
    } else {
      out = execSync('whois ' + safe, { encoding: 'utf8', timeout: 15000 }) // eslint-disable-line
    }
    const reg = out.match(/Registrar:\s*(.+)/i), cre = out.match(/Creation Date:\s*(.+)/i) || out.match(/Created:\s*(.+)/i), exp = out.match(/Expir[yation]+ Date:\s*(.+)/i), country = out.match(/Country:\s*(.+)/i), ns = out.match(/Name Server:\s*(.+)/i)
    return { success: true, registrar: reg?.[1]?.trim()||null, created: cre?.[1]?.trim()||null, expires: exp?.[1]?.trim()||null, country: country?.[1]?.trim()||null, nameServer: ns?.[1]?.trim()||null, raw: out.substring(0, 2000) }
  } catch (e) { return { success: false, error: e.message } }
}

// GeoIP
async function geoLookup(ip) {
  try {
    const fetch = (await import('node-fetch')).default
    const r = await fetch(`http://ip-api.com/json/${ip}`, { timeout: 5000 }); const d = await r.json()
    if (d.status === 'success') return { success: true, city: d.city, country: d.country, countryCode: d.countryCode, region: d.regionName, isp: d.isp, org: d.org, as: d.as, lat: d.lat, lon: d.lon, timezone: d.timezone }
    return { success: false, error: 'GeoIP failed' }
  } catch (e) { return { success: false, error: 'Offline', offline: true } }
}

// Reverse DNS
async function reverseDns(ip) { try { return { success: true, hostnames: await dns.reverse(ip) } } catch (e) { return { success: false } } }

// Traceroute (sanitized)
function traceroute(host) {
  const safe = sanitizeHost(host); if (!safe) return { success: false, error: 'Invalid' }
  try {
    // safe contains only [a-z0-9.-]
    const cmd = isWin ? 'tracert -d -h 15 ' + safe : 'traceroute -n -m 15 -w 2 ' + safe + ' 2>/dev/null'
    const out = execSync(cmd, { encoding: 'utf8', timeout: 30000 }) // eslint-disable-line
    const hops = []; for (const line of out.split('\n')) { const m = isWin ? line.match(/\s+(\d+)\s+(\d+)\s+ms\s+(\d+)\s+ms\s+(\d+)\s+ms\s+([\d.]+)/) : line.match(/\s*(\d+)\s+([\d.]+|\*)\s+([\d.]+|\*)\s+ms/); if (m) hops.push({ hop: parseInt(m[1]), ip: isWin ? m[5] : m[2], rtt: isWin ? parseInt(m[2]) : parseFloat(m[3])||null }) }
    return { success: true, hops }
  } catch (e) { return { success: false, error: e.message } }
}

// Security assessment
function generateSecurityAssessment(open, score, lang = 'en') {
  const issues = [], warnings = [], recommendations = [], ports = open.map(p => p.port)
  const tk = lang === 'tk'
  if (ports.includes(23)) issues.push(tk ? 'Telnet (23) howpsuz däl' : 'Telnet (23) is insecure')
  if (ports.includes(445)) issues.push(tk ? 'SMB (445) ransomware howpy' : 'SMB (445) ransomware risk')
  if (ports.includes(3389)) issues.push(tk ? 'RDP (3389) brute force nyşany' : 'RDP (3389) brute force target')
  if (ports.includes(6379)) issues.push(tk ? 'Redis (6379) autentifikasiýasyz' : 'Redis (6379) no auth')
  if (ports.includes(27017)) issues.push(tk ? 'MongoDB (27017) açyk' : 'MongoDB (27017) exposed')
  if (ports.includes(21)) warnings.push(tk ? 'FTP (21) açyk tekst' : 'FTP (21) plaintext')
  if (ports.includes(5900)) warnings.push(tk ? 'VNC (5900) açyk' : 'VNC (5900) exposed')
  if (ports.some(p => [3306,5432,1433].includes(p))) issues.push(tk ? 'DB porty açyk' : 'Database port exposed')
  if (open.length > 5) warnings.push(tk ? 'Köp açyk port' : 'Many open ports')
  recommendations.push(tk ? 'Gereksiz portlary ýapyň' : 'Close unnecessary ports')
  if (ports.includes(3389) || ports.includes(22)) recommendations.push(tk ? 'VPN ulanyň' : 'Use VPN')
  recommendations.push(tk ? 'Hyzmatlary täzeläň' : 'Update services', tk ? 'Firewall guruň' : 'Use firewall', tk ? 'Ýazgylary gözegçilik ediň' : 'Monitor logs')
  return { issues, warnings, recommendations }
}

// ============================================
// ENDPOINTS
// ============================================

router.post('/analyze', async (req, res) => {
  const { target, language = 'en' } = req.body
  if (!target) return res.status(400).json({ success: false, error: 'Target required' })
  const safe = sanitizeHost(target)
  if (!safe) return res.status(400).json({ success: false, error: 'Invalid target' })

  const logs = [], log = (msg, type = 'info') => logs.push({ message: msg, type, time: new Date().toISOString() })
  const tk = language === 'tk'

  try {
    log(tk ? `${safe} derňewi başlanýar...` : `Starting analysis of ${safe}...`)

    log(tk ? 'DNS çözülýär...' : 'Resolving DNS...')
    const dnsR = await dnsLookup(safe)
    if (!dnsR.success) { log('DNS failed', 'error'); return res.json({ success: false, error: 'DNS failed', logs }) }
    const ip = dnsR.ip
    log(`IP: ${ip}`, 'success')

    const rdns = await reverseDns(ip)
    if (rdns.success) log(`rDNS: ${rdns.hostnames.join(', ')}`, 'success')

    log(tk ? 'Ping...' : 'Pinging...')
    const pingR = pingTarget(ip)
    if (pingR.success) log(`Ping: ${pingR.latency}ms TTL:${pingR.ttl} Loss:${pingR.packetLoss}`, 'success')

    log(tk ? 'GeoIP...' : 'GeoIP lookup...')
    const geoR = await geoLookup(ip)
    if (geoR.success) log(`${geoR.city}, ${geoR.country} (${geoR.isp})`, 'success')
    else if (geoR.offline) log(tk ? 'GeoIP oflaýn' : 'GeoIP offline', 'warning')

    log(tk ? `${commonPorts.length} port skanirlenýär...` : `Scanning ${commonPorts.length} ports...`)
    const portR = await portScan(ip)
    log(`${tk ? 'Açyk' : 'Open'}: ${portR.open.length}/${portR.total}`, portR.open.length > 0 ? 'warning' : 'success')

    let whoisR = null
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(safe)) {
      log('WHOIS...'); whoisR = whoisLookup(safe)
      if (whoisR.success) log(tk ? 'WHOIS alyndy' : 'WHOIS OK', 'success')
    }

    const riskScore = calculateRisk(portR.open), riskLevel = getRiskLevel(riskScore)
    log(`${tk ? 'Howp' : 'Risk'}: ${riskScore}% (${riskLevel})`, riskScore > 50 ? 'warning' : 'success')
    const sec = generateSecurityAssessment(portR.open, riskScore, language)
    log(tk ? 'Tamamlandy!' : 'Complete!', 'success')

    const result = { success: true, target: safe, ip, riskScore, riskLevel, dns: dnsR, reverseDns: rdns.success ? rdns : null, ping: pingR.success ? pingR : null, geo: geoR.success ? geoR : null, portScan: portR, openPorts: portR.open, whois: whoisR?.success ? whoisR : null, issues: sec.issues, warnings: sec.warnings, recommendations: sec.recommendations, logs, analyzedAt: new Date().toISOString() }

    try { const save = req.app.locals.saveInvestigation; if (save) save(result) } catch (e) {}
    res.json(result)
  } catch (e) { log(`Error: ${e.message}`, 'error'); res.status(500).json({ success: false, error: e.message, logs }) }
})

router.post('/traceroute', (req, res) => {
  const safe = sanitizeHost(req.body.target)
  if (!safe) return res.status(400).json({ success: false, error: 'Invalid target' })
  res.json({ success: true, target: safe, ...traceroute(safe) })
})

router.get('/demo', (req, res) => {
  res.json({ success: true, target: 'example.com', ip: '93.184.216.34', riskScore: 35, riskLevel: 'MEDIUM', ping: { latency: 42, ttl: 56, packetLoss: '0%' }, geo: { city: 'Los Angeles', country: 'United States', countryCode: 'US', region: 'California', isp: 'Edgecast' }, portScan: { open: [{ port: 80, status: 'open', service: 'HTTP' }, { port: 443, status: 'open', service: 'HTTPS' }], closed: 26, filtered: 0, total: 28 }, openPorts: [{ port: 80, service: 'HTTP' }, { port: 443, service: 'HTTPS' }], whois: { registrar: 'RESERVED-IANA', created: '1995-08-14', expires: '2026-08-13' }, issues: [], warnings: [], recommendations: ['Keep updated', 'Use firewall'], logs: [{ message: 'Demo analysis', type: 'success' }], analyzedAt: new Date().toISOString() })
})

module.exports = router
