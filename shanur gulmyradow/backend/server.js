const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4007

app.use(cors())
app.use(express.json())

// ============================================
// WIRESHARK-LIKE PACKET DATA
// ============================================

const protocols = {
  tcp: { name: 'TCP', layer: 'Transport', port: null, color: '#3b82f6', description: 'Transmission Control Protocol - Reliable, ordered delivery' },
  udp: { name: 'UDP', layer: 'Transport', port: null, color: '#10b981', description: 'User Datagram Protocol - Fast, connectionless' },
  http: { name: 'HTTP', layer: 'Application', port: 80, color: '#22c55e', description: 'HyperText Transfer Protocol - Web communication' },
  https: { name: 'HTTPS', layer: 'Application', port: 443, color: '#8b5cf6', description: 'HTTP Secure - Encrypted web traffic' },
  dns: { name: 'DNS', layer: 'Application', port: 53, color: '#f59e0b', description: 'Domain Name System - Name resolution' },
  icmp: { name: 'ICMP', layer: 'Network', port: null, color: '#6b7280', description: 'Internet Control Message Protocol - Diagnostics' },
  arp: { name: 'ARP', layer: 'Data Link', port: null, color: '#ec4899', description: 'Address Resolution Protocol - MAC lookup' },
  ssh: { name: 'SSH', layer: 'Application', port: 22, color: '#14b8a6', description: 'Secure Shell - Encrypted remote access' },
  ftp: { name: 'FTP', layer: 'Application', port: 21, color: '#ef4444', description: 'File Transfer Protocol - File transfers' },
  smtp: { name: 'SMTP', layer: 'Application', port: 25, color: '#a855f7', description: 'Simple Mail Transfer Protocol - Email sending' },
  dhcp: { name: 'DHCP', layer: 'Application', port: 67, color: '#06b6d4', description: 'Dynamic Host Configuration Protocol - IP assignment' },
  ntp: { name: 'NTP', layer: 'Application', port: 123, color: '#84cc16', description: 'Network Time Protocol - Time synchronization' }
}

const networkHosts = [
  { ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:5E', hostname: 'gateway', type: 'router' },
  { ip: '192.168.1.100', mac: '00:1A:2B:3C:4D:01', hostname: 'workstation-01', type: 'desktop' },
  { ip: '192.168.1.50', mac: '00:1A:2B:3C:4D:02', hostname: 'server-main', type: 'server' },
  { ip: '192.168.1.25', mac: '00:1A:2B:3C:4D:03', hostname: 'laptop-user', type: 'laptop' },
  { ip: '192.168.1.200', mac: '00:1A:2B:3C:4D:04', hostname: 'printer-office', type: 'printer' },
  { ip: '8.8.8.8', mac: null, hostname: 'dns.google', type: 'external' },
  { ip: '1.1.1.1', mac: null, hostname: 'one.one.one.one', type: 'external' },
  { ip: '172.217.14.206', mac: null, hostname: 'google.com', type: 'external' },
  { ip: '13.107.42.14', mac: null, hostname: 'microsoft.com', type: 'external' },
  { ip: '31.13.72.36', mac: null, hostname: 'facebook.com', type: 'external' }
]

const tcpFlags = ['SYN', 'SYN,ACK', 'ACK', 'FIN', 'FIN,ACK', 'RST', 'PSH,ACK']

// Generate realistic packet
const generatePacket = (id) => {
  const protocolKeys = Object.keys(protocols)
  const protocolKey = protocolKeys[Math.floor(Math.random() * protocolKeys.length)]
  const protocol = protocols[protocolKey]

  const srcHost = networkHosts[Math.floor(Math.random() * networkHosts.length)]
  let dstHost = networkHosts[Math.floor(Math.random() * networkHosts.length)]
  while (dstHost.ip === srcHost.ip) {
    dstHost = networkHosts[Math.floor(Math.random() * networkHosts.length)]
  }

  const srcPort = Math.floor(Math.random() * 64000) + 1024
  const dstPort = protocol.port || Math.floor(Math.random() * 1000) + 1

  let info = ''
  switch (protocolKey) {
    case 'tcp':
      const flag = tcpFlags[Math.floor(Math.random() * tcpFlags.length)]
      const seq = Math.floor(Math.random() * 1000000)
      const ack = flag.includes('ACK') ? Math.floor(Math.random() * 1000000) : 0
      info = `${srcPort} → ${dstPort} [${flag}] Seq=${seq}${ack ? ` Ack=${ack}` : ''} Win=65535 Len=0`
      break
    case 'udp':
      info = `Source port: ${srcPort}  Destination port: ${dstPort}  Len=${Math.floor(Math.random() * 500) + 8}`
      break
    case 'http':
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD']
      const paths = ['/', '/api/data', '/images/logo.png', '/users', '/products', '/login']
      info = `${methods[Math.floor(Math.random() * methods.length)]} ${paths[Math.floor(Math.random() * paths.length)]} HTTP/1.1`
      break
    case 'https':
      const tlsRecords = ['Application Data', 'Client Hello', 'Server Hello', 'Certificate', 'Change Cipher Spec']
      info = `TLSv1.3 ${tlsRecords[Math.floor(Math.random() * tlsRecords.length)]}`
      break
    case 'dns':
      const domains = ['google.com', 'facebook.com', 'twitter.com', 'amazon.com', 'microsoft.com']
      const queryType = Math.random() > 0.3 ? 'Standard query' : 'Standard query response'
      info = `${queryType} 0x${Math.random().toString(16).slice(2, 6)} A ${domains[Math.floor(Math.random() * domains.length)]}`
      break
    case 'icmp':
      const icmpTypes = ['Echo (ping) request', 'Echo (ping) reply', 'Destination unreachable', 'Time exceeded']
      info = `${icmpTypes[Math.floor(Math.random() * icmpTypes.length)]} id=0x${Math.random().toString(16).slice(2, 6)}`
      break
    case 'arp':
      info = Math.random() > 0.5
        ? `Who has ${dstHost.ip}? Tell ${srcHost.ip}`
        : `${srcHost.ip} is at ${srcHost.mac || '00:00:00:00:00:00'}`
      break
    case 'ssh':
      const sshMsgs = ['Server: SSH-2.0-OpenSSH_8.9', 'Client: SSH-2.0-PuTTY', 'Key Exchange Init', 'Encrypted packet']
      info = sshMsgs[Math.floor(Math.random() * sshMsgs.length)]
      break
    case 'ftp':
      const ftpMsgs = ['Response: 220 Welcome to FTP', 'Request: USER anonymous', 'Response: 230 Login successful', 'Request: LIST']
      info = ftpMsgs[Math.floor(Math.random() * ftpMsgs.length)]
      break
    case 'smtp':
      const smtpMsgs = ['C: EHLO client.example.com', 'S: 250-mail.example.com', 'C: MAIL FROM:<user@example.com>', 'S: 250 OK']
      info = smtpMsgs[Math.floor(Math.random() * smtpMsgs.length)]
      break
    case 'dhcp':
      const dhcpMsgs = ['DHCP Discover', 'DHCP Offer', 'DHCP Request', 'DHCP ACK']
      info = `${dhcpMsgs[Math.floor(Math.random() * dhcpMsgs.length)]} - Transaction ID 0x${Math.random().toString(16).slice(2, 10)}`
      break
    case 'ntp':
      info = `NTP Version 4, ${Math.random() > 0.5 ? 'Client' : 'Server'} Mode`
      break
    default:
      info = 'Unknown protocol data'
  }

  return {
    id,
    no: id,
    time: new Date().toISOString(),
    timeRelative: (Math.random() * 60).toFixed(6),
    source: srcHost.ip,
    sourceMac: srcHost.mac,
    sourceHostname: srcHost.hostname,
    destination: dstHost.ip,
    destinationMac: dstHost.mac,
    destinationHostname: dstHost.hostname,
    protocol: protocol.name,
    protocolColor: protocol.color,
    length: Math.floor(Math.random() * 1500) + 40,
    info,
    srcPort,
    dstPort: protocol.port || dstPort,
    layer: protocol.layer
  }
}

// ============================================
// NETWORK STATISTICS
// ============================================

const generateStatistics = () => ({
  summary: {
    totalPackets: Math.floor(Math.random() * 100000) + 10000,
    totalBytes: Math.floor(Math.random() * 1000000000) + 100000000,
    captureTime: `${Math.floor(Math.random() * 60) + 1}m ${Math.floor(Math.random() * 60)}s`,
    avgPacketSize: Math.floor(Math.random() * 500) + 200,
    packetsPerSecond: Math.floor(Math.random() * 2000) + 500,
    bytesPerSecond: Math.floor(Math.random() * 10000000) + 1000000
  },
  protocols: {
    TCP: { packets: 42, bytes: 45, color: '#3b82f6' },
    UDP: { packets: 18, bytes: 15, color: '#10b981' },
    HTTP: { packets: 8, bytes: 12, color: '#22c55e' },
    HTTPS: { packets: 15, bytes: 18, color: '#8b5cf6' },
    DNS: { packets: 12, bytes: 5, color: '#f59e0b' },
    ICMP: { packets: 3, bytes: 2, color: '#6b7280' },
    Other: { packets: 2, bytes: 3, color: '#ec4899' }
  },
  topTalkers: networkHosts.slice(0, 5).map((host, i) => ({
    rank: i + 1,
    ip: host.ip,
    hostname: host.hostname,
    packetsIn: Math.floor(Math.random() * 20000) + 1000,
    packetsOut: Math.floor(Math.random() * 18000) + 800,
    bytesIn: Math.floor(Math.random() * 500000000) + 10000000,
    bytesOut: Math.floor(Math.random() * 400000000) + 8000000
  })),
  topPorts: [
    { port: 443, name: 'HTTPS', connections: Math.floor(Math.random() * 3000) + 1000 },
    { port: 80, name: 'HTTP', connections: Math.floor(Math.random() * 2000) + 500 },
    { port: 53, name: 'DNS', connections: Math.floor(Math.random() * 1500) + 300 },
    { port: 22, name: 'SSH', connections: Math.floor(Math.random() * 500) + 50 },
    { port: 3389, name: 'RDP', connections: Math.floor(Math.random() * 200) + 20 }
  ],
  packetSizes: {
    '0-64': Math.floor(Math.random() * 2000) + 500,
    '65-127': Math.floor(Math.random() * 1500) + 400,
    '128-255': Math.floor(Math.random() * 1200) + 300,
    '256-511': Math.floor(Math.random() * 800) + 200,
    '512-1023': Math.floor(Math.random() * 600) + 150,
    '1024-1518': Math.floor(Math.random() * 400) + 100,
    '>1518': Math.floor(Math.random() * 100) + 10
  }
})

// ============================================
// SECURITY ANALYSIS
// ============================================

const analyzeForThreats = (packets) => {
  const threats = []

  // Port scan detection (simulated)
  if (Math.random() > 0.7) {
    threats.push({
      type: 'Port Scan',
      severity: 'warning',
      description: 'Multiple connection attempts to different ports detected',
      source: networkHosts[Math.floor(Math.random() * 4)].ip,
      timestamp: new Date().toISOString(),
      details: 'Detected SYN packets to 15+ different ports within 10 seconds'
    })
  }

  // DDoS pattern (simulated)
  if (Math.random() > 0.85) {
    threats.push({
      type: 'DDoS Pattern',
      severity: 'danger',
      description: 'Unusual spike in traffic from multiple sources',
      source: 'Multiple IPs',
      timestamp: new Date().toISOString(),
      details: 'Traffic rate exceeded 10,000 packets/sec from 50+ unique IPs'
    })
  }

  // Data exfiltration (simulated)
  if (Math.random() > 0.8) {
    threats.push({
      type: 'Data Exfiltration',
      severity: 'danger',
      description: 'Large outbound data transfer to external IP',
      source: networkHosts[1].ip,
      destination: networkHosts[7].ip,
      timestamp: new Date().toISOString(),
      details: '500MB transferred to unknown external host in 5 minutes'
    })
  }

  // DNS tunneling (simulated)
  if (Math.random() > 0.9) {
    threats.push({
      type: 'DNS Tunneling',
      severity: 'warning',
      description: 'Suspicious DNS query patterns detected',
      source: networkHosts[2].ip,
      timestamp: new Date().toISOString(),
      details: 'Abnormally long DNS queries to non-standard domains'
    })
  }

  return threats
}

// ============================================
// API ROUTES
// ============================================

let packetCounter = 0

// Get packets (simulated capture)
app.get('/api/packets', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 20, 100)
  const packets = []

  for (let i = 0; i < count; i++) {
    packetCounter++
    packets.push(generatePacket(packetCounter))
  }

  res.json({
    success: true,
    count: packets.length,
    packets,
    timestamp: new Date().toISOString()
  })
})

// Get network interfaces
app.get('/api/interfaces', (req, res) => {
  res.json({
    success: true,
    interfaces: [
      { name: 'eth0', description: 'Ethernet Adapter', status: 'up', speed: '1 Gbps', ipv4: '192.168.1.100', mac: '00:1A:2B:3C:4D:01' },
      { name: 'wlan0', description: 'Wireless Adapter', status: 'up', speed: '867 Mbps', ipv4: '192.168.1.101', mac: '00:1A:2B:3C:4D:02' },
      { name: 'lo', description: 'Loopback Interface', status: 'up', speed: '-', ipv4: '127.0.0.1', mac: '00:00:00:00:00:00' },
      { name: 'docker0', description: 'Docker Bridge', status: 'down', speed: '-', ipv4: '172.17.0.1', mac: '02:42:xx:xx:xx:xx' }
    ]
  })
})

// Get protocols info
app.get('/api/protocols', (req, res) => {
  res.json({
    success: true,
    protocols: Object.entries(protocols).map(([key, proto]) => ({
      id: key,
      ...proto
    }))
  })
})

// Analyze traffic
app.post('/api/analyze', (req, res) => {
  const stats = generateStatistics()
  const threats = analyzeForThreats([])

  res.json({
    success: true,
    analysis: {
      id: `analysis-${Date.now()}`,
      ...stats,
      anomalies: threats,
      analyzedAt: new Date().toISOString()
    }
  })
})

// Get statistics
app.get('/api/statistics', (req, res) => {
  const stats = generateStatistics()
  res.json({
    success: true,
    statistics: stats
  })
})

// Get network hosts
app.get('/api/hosts', (req, res) => {
  res.json({
    success: true,
    hosts: networkHosts
  })
})

// Reset packet counter
app.post('/api/reset', (req, res) => {
  packetCounter = 0
  res.json({ success: true, message: 'Packet counter reset' })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Wireshark Monitor API running',
    version: '2.0.0',
    endpoints: {
      packets: '/api/packets',
      interfaces: '/api/interfaces',
      protocols: '/api/protocols',
      analyze: '/api/analyze',
      statistics: '/api/statistics',
      hosts: '/api/hosts'
    }
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           Wireshark Monitor - Backend Server                  ║
║                      Version 2.0.0                            ║
╠══════════════════════════════════════════════════════════════╣
║  Protocols: ${Object.keys(protocols).length} types                                        ║
║  Network Hosts: ${networkHosts.length} simulated                                  ║
║  Features: Packet capture, Analysis, Statistics               ║
╚══════════════════════════════════════════════════════════════╝

Server running on http://localhost:${PORT}
  `)
})
