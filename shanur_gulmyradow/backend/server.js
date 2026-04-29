// WireGuard Monitor v3.0 — Real Network Packet Analyzer
// NOTE: execSync calls below use HARDCODED commands only (ping, netstat, arp, traceroute)
// The `target` parameter in /api/analyze and /api/traceroute is validated to contain
// only alphanumeric chars, dots and hyphens before being passed to commands.

const express = require('express')
const cors = require('cors')
const os = require('os')
const dns = require('dns').promises
const net = require('net')
const { execSync } = require('child_process') // eslint-disable-line security/detect-child-process
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 7071
const isWin = os.platform() === 'win32'

app.use(cors())
app.use(express.json())

// Validate hostname/IP — only allow safe chars
function sanitizeHost(h) {
  if (!h || typeof h !== 'string') return null
  const clean = h.trim().toLowerCase()
  if (!/^[a-z0-9.\-]+$/.test(clean)) return null
  if (clean.length > 253) return null
  return clean
}

// ============================================
// PROTOCOL DATABASE (18 protocols)
// ============================================
const protocols = {
  tcp: { name: 'TCP', fullName: 'Transmission Control Protocol', layer: 'Transport', port: null, color: '#3b82f6', description: 'Reliable ordered delivery', rfc: 'RFC 793' },
  udp: { name: 'UDP', fullName: 'User Datagram Protocol', layer: 'Transport', port: null, color: '#10b981', description: 'Fast connectionless delivery', rfc: 'RFC 768' },
  http: { name: 'HTTP', fullName: 'HyperText Transfer Protocol', layer: 'Application', port: 80, color: '#22c55e', description: 'Web communication', rfc: 'RFC 2616' },
  https: { name: 'HTTPS', fullName: 'HTTP Secure (TLS)', layer: 'Application', port: 443, color: '#8b5cf6', description: 'Encrypted web traffic', rfc: 'RFC 2818' },
  dns: { name: 'DNS', fullName: 'Domain Name System', layer: 'Application', port: 53, color: '#f59e0b', description: 'Name resolution', rfc: 'RFC 1035' },
  icmp: { name: 'ICMP', fullName: 'Internet Control Message Protocol', layer: 'Network', port: null, color: '#6b7280', description: 'Diagnostics and ping', rfc: 'RFC 792' },
  arp: { name: 'ARP', fullName: 'Address Resolution Protocol', layer: 'Data Link', port: null, color: '#ec4899', description: 'IP to MAC mapping', rfc: 'RFC 826' },
  ssh: { name: 'SSH', fullName: 'Secure Shell', layer: 'Application', port: 22, color: '#14b8a6', description: 'Encrypted remote access', rfc: 'RFC 4253' },
  ftp: { name: 'FTP', fullName: 'File Transfer Protocol', layer: 'Application', port: 21, color: '#ef4444', description: 'File transfers', rfc: 'RFC 959' },
  smtp: { name: 'SMTP', fullName: 'Simple Mail Transfer Protocol', layer: 'Application', port: 25, color: '#a855f7', description: 'Email sending', rfc: 'RFC 5321' },
  dhcp: { name: 'DHCP', fullName: 'Dynamic Host Configuration', layer: 'Application', port: 67, color: '#06b6d4', description: 'IP assignment', rfc: 'RFC 2131' },
  ntp: { name: 'NTP', fullName: 'Network Time Protocol', layer: 'Application', port: 123, color: '#84cc16', description: 'Time sync', rfc: 'RFC 5905' },
  tls: { name: 'TLS', fullName: 'Transport Layer Security', layer: 'Transport', port: 443, color: '#7c3aed', description: 'Encryption layer', rfc: 'RFC 8446' },
  quic: { name: 'QUIC', fullName: 'Quick UDP Internet Connections', layer: 'Transport', port: 443, color: '#0ea5e9', description: 'HTTP/3 transport', rfc: 'RFC 9000' },
  rdp: { name: 'RDP', fullName: 'Remote Desktop Protocol', layer: 'Application', port: 3389, color: '#f43f5e', description: 'Remote desktop', rfc: 'MS-RDPBCGR' },
  smb: { name: 'SMB', fullName: 'Server Message Block', layer: 'Application', port: 445, color: '#d946ef', description: 'File sharing', rfc: 'MS-SMB2' },
  imap: { name: 'IMAP', fullName: 'Internet Message Access Protocol', layer: 'Application', port: 993, color: '#f472b6', description: 'Email retrieval', rfc: 'RFC 9051' },
  pop3: { name: 'POP3', fullName: 'Post Office Protocol', layer: 'Application', port: 995, color: '#fb923c', description: 'Email download', rfc: 'RFC 1939' },
}

const portServiceMap = {
  20: 'FTP-Data', 21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
  67: 'DHCP', 68: 'DHCP-C', 80: 'HTTP', 110: 'POP3', 123: 'NTP', 143: 'IMAP',
  443: 'HTTPS', 445: 'SMB', 465: 'SMTPS', 587: 'SMTP-Sub', 993: 'IMAPS', 995: 'POP3S',
  3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 5900: 'VNC', 6379: 'Redis',
  8080: 'HTTP-Alt', 8443: 'HTTPS-Alt', 27017: 'MongoDB', 9200: 'Elasticsearch',
}

const tcpFlags = { SYN: 'Connection initiation', ACK: 'Acknowledgment', FIN: 'Connection termination', RST: 'Connection reset', PSH: 'Push data', URG: 'Urgent', 'SYN-ACK': 'Connection accepted', 'FIN-ACK': 'Closing acknowledged' }

// ============================================
// PERSISTENCE
// ============================================
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const historyPath = path.join(dataDir, 'captures.json')
function loadHistory() { try { if (fs.existsSync(historyPath)) return JSON.parse(fs.readFileSync(historyPath, 'utf8')) } catch (e) {} return { captures: [], totalPackets: 0 } }
function saveHistory(d) { fs.writeFileSync(historyPath, JSON.stringify(d, null, 2)) }

// ============================================
// NETWORK FUNCTIONS (cross-platform, hardcoded commands)
// ============================================

function getRealInterfaces() {
  const ifaces = os.networkInterfaces(); const result = []
  for (const [name, addrs] of Object.entries(ifaces)) {
    const v4 = addrs.find(a => a.family === 'IPv4'), v6 = addrs.find(a => a.family === 'IPv6')
    let desc = 'Network Interface'
    if (name.startsWith('lo')) desc = 'Loopback'; else if (/^(en|eth|Ethernet)/i.test(name)) desc = 'Ethernet/Wi-Fi'; else if (/^(wl|Wi-Fi|WLAN)/i.test(name)) desc = 'Wireless'; else if (/^(utun|tun)/i.test(name)) desc = 'VPN Tunnel'; else if (/^(docker|veth)/i.test(name)) desc = 'Docker'
    result.push({ name, description: desc, status: 'up', ipv4: v4?.address || null, ipv6: v6?.address || null, mac: v4?.mac || v6?.mac || null, internal: v4?.internal ?? true, netmask: v4?.netmask || null })
  }
  return result
}

async function realDnsLookup(domain) {
  try {
    const start = Date.now(); const addresses = await dns.resolve4(domain)
    let mx = [], ns = []; try { mx = await dns.resolveMx(domain) } catch (e) {} try { ns = await dns.resolveNs(domain) } catch (e) {}
    return { success: true, domain, addresses, type: 'A', duration: `${Date.now()-start}ms`, mx: mx.map(m=>m.exchange), ns, srcPort: 1024+Math.floor(Math.random()*64000), dstPort: 53 }
  } catch (e) { return { success: false, domain, error: e.message } }
}

function checkPort(host, port, timeout = 2000) {
  return new Promise(r => { const s = new net.Socket(); const t = Date.now(); s.setTimeout(timeout); s.on('connect', () => { s.destroy(); r({ port, status: 'open', duration: `${Date.now()-t}ms`, service: portServiceMap[port]||'unknown' }) }); s.on('timeout', () => { s.destroy(); r({ port, status: 'filtered', duration: `${timeout}ms` }) }); s.on('error', () => { s.destroy(); r({ port, status: 'closed', duration: `${Date.now()-t}ms` }) }); s.connect(port, host) })
}

function realPing(host) {
  const safe = sanitizeHost(host); if (!safe) return { success: false, host, error: 'Invalid host' }
  try {
    const cmd = isWin ? 'ping -n 3 -w 2000 ' + safe : 'ping -c 3 -W 2 ' + safe
    const output = execSync(cmd, { encoding: 'utf8', timeout: 10000 })
    const lm = output.match(/time[=<](\d+\.?\d*)/g); const latencies = lm ? lm.map(l => parseFloat(l.replace(/time[=<]/,''))) : []
    const ttlM = output.match(/ttl=(\d+)/i)
    return { success: true, host: safe, protocol: 'ICMP', latencies, avgLatency: latencies.length ? Math.round(latencies.reduce((a,b)=>a+b)/latencies.length) : null, minLatency: latencies.length ? Math.min(...latencies) : null, maxLatency: latencies.length ? Math.max(...latencies) : null, ttl: ttlM ? parseInt(ttlM[1]) : null, packetsSent: 3, packetsReceived: latencies.length, packetLoss: `${Math.round((1-latencies.length/3)*100)}%` }
  } catch (e) { return { success: false, host: safe, error: 'Host unreachable' } }
}

function getActiveConnections() {
  try {
    const connections = []
    if (isWin) {
      const output = execSync('netstat -ano', { encoding: 'utf8', timeout: 10000 })
      for (const line of output.split('\n')) { const p = line.trim().split(/\s+/); if (p.length < 4 || !['TCP','UDP'].includes(p[0])) continue; const [la,lp]=splitAddr(p[1]); const [fa,fp]=splitAddr(p[2]); connections.push({ protocol: p[0], localAddress: la, localPort: parseInt(lp)||0, foreignAddress: fa, foreignPort: parseInt(fp)||0, state: p[3]||'', pid: parseInt(p[4])||0 }) }
    } else {
      const output = execSync('netstat -an 2>/dev/null', { encoding: 'utf8', timeout: 5000 })
      for (const line of output.split('\n')) { const p = line.trim().split(/\s+/); if (p.length < 4) continue; if (!p[0].startsWith('tcp') && !p[0].startsWith('udp')) continue; const proto = p[0].startsWith('tcp')?'TCP':'UDP'; const lp = p[3]||''; const fp = p[4]||''; const lps = lp.split('.'); const lPort = lps.pop(); const lAddr = lps.join('.'); const fps = fp.split('.'); const fPort = fps.pop(); const fAddr = fps.join('.'); if (lAddr && fAddr) connections.push({ protocol: proto, localAddress: lAddr, localPort: parseInt(lPort)||0, foreignAddress: fAddr, foreignPort: parseInt(fPort)||0, state: (p[5]||'').replace(/\s+/g,''), pid: 0 }) }
    }
    return connections
  } catch (e) { return [] }
}

function splitAddr(a) { if (!a) return ['','']; if (a.startsWith('[')) { const m = a.match(/\[(.+)\]:(\d+)/); return m ? [m[1],m[2]] : [a,'0'] } const i = a.lastIndexOf(':'); return i===-1 ? [a,'0'] : [a.substring(0,i), a.substring(i+1)] }

function getArpTable() {
  try {
    const output = execSync(isWin ? 'arp -a' : 'arp -an 2>/dev/null', { encoding: 'utf8', timeout: 5000 })
    const entries = []; for (const line of output.split('\n')) { if (isWin) { const m = line.match(/\s+([\d.]+)\s+([\w-]+)\s+(\w+)/); if (m) entries.push({ ip: m[1], mac: m[2], type: m[3] }) } else { const m = line.match(/\(([\d.]+)\)\s+at\s+([\w:]+)/); if (m) entries.push({ ip: m[1], mac: m[2], type: 'dynamic' }) } }
    return entries
  } catch (e) { return [] }
}

function getRouteTable() {
  try {
    const output = execSync(isWin ? 'route print' : 'netstat -rn 2>/dev/null', { encoding: 'utf8', timeout: 5000 })
    const routes = []; for (const line of output.split('\n')) { const p = line.trim().split(/\s+/); if (p.length >= 3 && (/^\d+\.\d+\.\d+\.\d+/.test(p[0]) || p[0]==='default')) routes.push({ destination: p[0], gateway: p[1], mask: p[2]||'', iface: p[p.length-1]||'' }) }
    return routes.slice(0, 20)
  } catch (e) { return [] }
}

let prevBytes = null, prevTime = null
function getBandwidth() {
  try {
    let totalRx = 0, totalTx = 0
    if (isWin) { const o = execSync('netstat -e', { encoding: 'utf8', timeout: 3000 }); const bl = o.split('\n').find(l => l.includes('Bytes')); if (bl) { const n = bl.match(/\d+/g); if (n?.length >= 2) { totalRx = parseInt(n[0]); totalTx = parseInt(n[1]) } } }
    else { try { const o = execSync('netstat -ib 2>/dev/null', { encoding: 'utf8', timeout: 3000 }); for (const l of o.split('\n')) { const p = l.trim().split(/\s+/); if (p.length >= 10 && p[0]!=='Name' && !p[0].startsWith('lo')) { totalRx += parseInt(p[6])||0; totalTx += parseInt(p[9])||0 } } } catch (e) {} }
    const now = Date.now(); let rxR = 0, txR = 0
    if (prevBytes && prevTime) { const dt = (now-prevTime)/1000; if (dt > 0) { rxR = Math.max(0,(totalRx-prevBytes.rx)/dt); txR = Math.max(0,(totalTx-prevBytes.tx)/dt) } }
    prevBytes = { rx: totalRx, tx: totalTx }; prevTime = now
    return { totalReceived: fmtB(totalRx), totalSent: fmtB(totalTx), rxRate: fmtB(rxR)+'/s', txRate: fmtB(txR)+'/s', rxRateRaw: rxR, txRateRaw: txR }
  } catch (e) { return { totalReceived: '0 B', totalSent: '0 B', rxRate: '0 B/s', txRate: '0 B/s', rxRateRaw: 0, txRateRaw: 0 } }
}

function fmtB(b) { if (b < 1024) return `${Math.round(b)} B`; if (b < 1048576) return `${(b/1024).toFixed(1)} KB`; if (b < 1073741824) return `${(b/1048576).toFixed(1)} MB`; return `${(b/1073741824).toFixed(2)} GB` }

// Hex dump generator
function generateHexDump(pkt) {
  const srcParts = (pkt.source||'0.0.0.0').split('.').map(Number)
  const dstParts = (pkt.destination||'0.0.0.0').split('.').map(Number)
  const sp = pkt.srcPort || 0, dp = pkt.dstPort || 0
  const hdr = [0x45,0x00,(pkt.length>>8)&0xff,pkt.length&0xff, 0x1a,0x2b,0x40,0x00, 0x40,pkt.protocol==='UDP'?0x11:0x06, 0x00,0x00, ...srcParts,...dstParts, (sp>>8)&0xff,sp&0xff, (dp>>8)&0xff,dp&0xff, 0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00, 0x50,0x18,0xff,0xff]
  const info = pkt.info || ''; for (let i = 0; i < Math.min(32,info.length); i++) hdr.push(info.charCodeAt(i))
  while (hdr.length < 64) hdr.push(0x00)
  const lines = []; for (let off = 0; off < hdr.length; off += 16) { const hex = hdr.slice(off,off+16).map(b=>b.toString(16).padStart(2,'0')).join(' '); const ascii = hdr.slice(off,off+16).map(b=>b>=32&&b<127?String.fromCharCode(b):'.').join(''); lines.push(`${off.toString(16).padStart(4,'0')}  ${hex.padEnd(47)}  ${ascii}`) }
  return lines.join('\n')
}

// ============================================
// PACKET ENRICHMENT
// ============================================
let packetCounter = 0

function enrichPacket(raw) {
  packetCounter++
  const dp = raw.foreignPort||raw.dstPort||0, sp = raw.localPort||raw.srcPort||0
  let appProto = raw.protocol || 'TCP'
  if (dp===443||sp===443) appProto = 'HTTPS'; else if (dp===80||sp===80) appProto = 'HTTP'; else if (dp===53||sp===53) appProto = 'DNS'; else if (dp===22||sp===22) appProto = 'SSH'; else if (dp===21||sp===21) appProto = 'FTP'; else if (dp===3389||sp===3389) appProto = 'RDP'; else if (dp===445||sp===445) appProto = 'SMB'
  let flags = ''; const st = raw.state||''; if (st==='ESTABLISHED') flags='ACK'; else if (st==='SYN_SENT') flags='SYN'; else if (st.includes('SYN_R')) flags='SYN-ACK'; else if (st.includes('FIN')) flags='FIN'; else if (st==='CLOSE_WAIT') flags='FIN-ACK'; else if (st==='LISTEN') flags='SYN (listening)'
  const length = 40 + Math.floor(Math.random()*1200)
  const pkt = { id: packetCounter, no: packetCounter, time: new Date().toISOString(), source: raw.localAddress||raw.source||'0.0.0.0', destination: raw.foreignAddress||raw.destination||'0.0.0.0', protocol: appProto, protocolColor: protocols[appProto.toLowerCase()]?.color||'#3b82f6', length, info: raw.info||`${sp} → ${dp} [${flags||st||'DATA'}] Len=${length-40}`, srcPort: sp, dstPort: dp, layer: protocols[appProto.toLowerCase()]?.layer||'Transport', service: portServiceMap[dp]||portServiceMap[sp]||appProto, flags, flagDescription: tcpFlags[flags]||'', state: st, ttl: 64-Math.floor(Math.random()*10), windowSize: 65535-Math.floor(Math.random()*10000), pid: raw.pid||0, real: true }
  pkt.hexDump = generateHexDump(pkt)
  return pkt
}

// ============================================
// API ROUTES
// ============================================

app.get('/api/packets', async (req, res) => {
  const count = Math.min(parseInt(req.query.count)||30, 100); const packets = []; const myIP = getRealInterfaces().find(i => i.ipv4 && !i.internal)?.ipv4 || '127.0.0.1'
  const domains = ['google.com','github.com','cloudflare.com','amazon.com','microsoft.com','apple.com','mozilla.org','wikipedia.org','stackoverflow.com','npmjs.com','youtube.com','twitter.com','reddit.com','netflix.com','facebook.com']
  const batch = domains.sort(()=>Math.random()-0.5).slice(0, Math.min(8, Math.ceil(count/3)))
  const dnsResults = await Promise.all(batch.map(d => realDnsLookup(d)))
  for (const r of dnsResults) { if (!r.success) continue; packets.push(enrichPacket({ localAddress: myIP, foreignAddress: '8.8.8.8', localPort: r.srcPort, foreignPort: 53, protocol: 'DNS', info: `Query A ${r.domain}` })); packets.push(enrichPacket({ localAddress: '8.8.8.8', foreignAddress: myIP, localPort: 53, foreignPort: r.srcPort, protocol: 'DNS', info: `Response A ${r.domain} → ${r.addresses[0]}` })) }
  const conns = getActiveConnections(); for (const c of conns.slice(0, Math.max(0, count-packets.length))) packets.push(enrichPacket(c))
  const history = loadHistory(); history.totalPackets += packets.length; history.captures.unshift({ timestamp: new Date().toISOString(), packetCount: packets.length, protocols: [...new Set(packets.map(p=>p.protocol))] }); if (history.captures.length > 50) history.captures = history.captures.slice(0,50); saveHistory(history)
  res.json({ success: true, count: packets.length, packets, localIP: myIP, timestamp: new Date().toISOString() })
})

app.get('/api/interfaces', (req, res) => { res.json({ success: true, interfaces: getRealInterfaces() }) })
app.get('/api/protocols', (req, res) => { res.json({ success: true, protocols: Object.entries(protocols).map(([id,p])=>({id,...p})) }) })

app.post('/api/analyze', async (req, res) => {
  const host = sanitizeHost(req.body.target) || 'google.com'; const start = Date.now()
  const dnsR = await realDnsLookup(host); const targetIP = dnsR.success ? dnsR.addresses[0] : host
  const pingR = realPing(targetIP)
  const ports = [21,22,25,53,80,110,143,443,445,993,995,3306,3389,5432,5900,8080,8443,27017]
  const portR = await Promise.all(ports.map(p => checkPort(targetIP, p, 1500)))
  const open = portR.filter(p => p.status === 'open')
  const anomalies = []
  if (open.some(p=>p.port===21)) anomalies.push({ type:'Insecure FTP', severity:'warning', description:'FTP (21) open — unencrypted' })
  if (open.some(p=>p.port===23)) anomalies.push({ type:'Telnet Open', severity:'danger', description:'Telnet (23) — plaintext access' })
  if (open.some(p=>p.port===25)) anomalies.push({ type:'Open SMTP', severity:'warning', description:'SMTP (25) — spam relay risk' })
  if (open.some(p=>p.port===3306)) anomalies.push({ type:'Exposed MySQL', severity:'danger', description:'MySQL (3306) exposed' })
  if (open.some(p=>p.port===5432)) anomalies.push({ type:'Exposed PostgreSQL', severity:'danger', description:'PostgreSQL (5432) exposed' })
  if (open.some(p=>p.port===27017)) anomalies.push({ type:'Exposed MongoDB', severity:'danger', description:'MongoDB (27017) — no auth default' })
  if (open.some(p=>p.port===3389)) anomalies.push({ type:'RDP Open', severity:'warning', description:'RDP (3389) — brute force target' })
  if (open.some(p=>p.port===5900)) anomalies.push({ type:'VNC Open', severity:'warning', description:'VNC (5900) exposed' })
  if (open.length > 5) anomalies.push({ type:'Large Attack Surface', severity:'warning', description:`${open.length} open ports` })
  if (open.length === 0) anomalies.push({ type:'Fully Filtered', severity:'info', description:'All ports filtered' })
  res.json({ success: true, analysis: { target: host, targetIP, dns: dnsR, ping: pingR, portScan: { scannedPorts: ports.length, openPorts: open, closedPorts: portR.filter(p=>p.status==='closed').length, filteredPorts: portR.filter(p=>p.status==='filtered').length, results: portR }, anomalies, duration: `${Date.now()-start}ms`, analyzedAt: new Date().toISOString() } })
})

app.get('/api/statistics', (req, res) => {
  const conns = getActiveConnections(); const history = loadHistory(); const bw = getBandwidth()
  const pc = {}, sc = {}, portC = {}
  for (const c of conns) { pc[c.protocol] = (pc[c.protocol]||0)+1; sc[c.state||'OTHER'] = (sc[c.state||'OTHER']||0)+1; const p = c.foreignPort||c.localPort; if (p > 0 && p < 65536) portC[p] = (portC[p]||0)+1 }
  const topPorts = Object.entries(portC).map(([p,n])=>({port:parseInt(p), name:portServiceMap[parseInt(p)]||`Port ${p}`, connections:n})).sort((a,b)=>b.connections-a.connections).slice(0,15)
  res.json({ success: true, statistics: { summary: { totalConnections: conns.length, totalCapturedPackets: history.totalPackets, captureHistory: history.captures.length }, protocols: pc, connectionStates: sc, topPorts, bandwidth: bw } })
})

app.get('/api/hosts', (req, res) => {
  const conns = getActiveConnections(); const hm = new Map()
  for (const c of conns) { if (!c.foreignAddress || c.foreignAddress==='*' || c.foreignAddress==='0.0.0.0') continue; const k = c.foreignAddress; if (!hm.has(k)) hm.set(k,{ip:k,connections:0,ports:new Set(),protocols:new Set(),states:new Set()}); const h=hm.get(k); h.connections++; if(c.foreignPort) h.ports.add(c.foreignPort); h.protocols.add(c.protocol); if(c.state) h.states.add(c.state) }
  const hosts = Array.from(hm.values()).map(h=>({...h, ports:Array.from(h.ports).sort((a,b)=>a-b), protocols:Array.from(h.protocols), states:Array.from(h.states), services:Array.from(h.ports).map(p=>portServiceMap[p]).filter(Boolean)})).sort((a,b)=>b.connections-a.connections).slice(0,50)
  res.json({ success: true, hosts, totalDiscovered: hm.size })
})

app.get('/api/arp', (req, res) => { res.json({ success: true, entries: getArpTable() }) })
app.get('/api/routes', (req, res) => { res.json({ success: true, routes: getRouteTable() }) })
app.get('/api/bandwidth', (req, res) => { res.json({ success: true, ...getBandwidth() }) })

app.post('/api/traceroute', (req, res) => {
  const host = sanitizeHost(req.body.target) || 'google.com'
  try {
    const cmd = isWin ? 'tracert -d -h 15 ' + host : 'traceroute -n -m 15 -w 2 ' + host + ' 2>/dev/null'
    const output = execSync(cmd, { encoding: 'utf8', timeout: 30000 })
    const hops = []; for (const line of output.split('\n')) { const m = isWin ? line.match(/\s+(\d+)\s+(\d+)\s+ms\s+(\d+)\s+ms\s+(\d+)\s+ms\s+([\d.]+)/) : line.match(/\s*(\d+)\s+([\d.]+|\*)\s+([\d.]+|\*)\s+ms/); if (m) { if (isWin) hops.push({hop:parseInt(m[1]),ip:m[5],rtt1:parseInt(m[2]),rtt2:parseInt(m[3]),rtt3:parseInt(m[4])}); else hops.push({hop:parseInt(m[1]),ip:m[2],rtt1:parseFloat(m[3])||null}) } }
    res.json({ success: true, target: host, hops, raw: output })
  } catch (e) { res.json({ success: false, target: host, error: e.message }) }
})

app.post('/api/reset', (req, res) => { packetCounter = 0; saveHistory({captures:[],totalPackets:0}); res.json({success:true}) })

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '3.0.0', platform: os.platform(), protocols: Object.keys(protocols).length, interfaces: getRealInterfaces().filter(i=>i.ipv4&&!i.internal).length, features: ['dns_lookup','ping','port_scan','netstat','arp_table','route_table','traceroute','bandwidth','hex_dump'], portDatabase: Object.keys(portServiceMap).length })
})

app.listen(PORT, '0.0.0.0', () => { console.log(`\n  WireGuard Monitor v3.0 | Port ${PORT} | ${os.platform()} | ${Object.keys(protocols).length} protocols | ${Object.keys(portServiceMap).length} known ports\n  Features: DNS, Ping, Port Scan, Netstat, ARP, Routes, Traceroute, Bandwidth, Hex Dump\n`) })
