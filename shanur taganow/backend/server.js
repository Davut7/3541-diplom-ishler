const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Simulated packet data
const generatePacket = (id) => {
  const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ICMP', 'ARP', 'SSH', 'FTP']
  const ips = ['192.168.1.1', '192.168.1.100', '10.0.0.1', '8.8.8.8', '1.1.1.1', '172.16.0.1']

  return {
    id,
    time: new Date().toISOString(),
    source: ips[Math.floor(Math.random() * ips.length)],
    destination: ips[Math.floor(Math.random() * ips.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    length: Math.floor(Math.random() * 1500) + 40,
    info: 'Simulated packet data'
  }
}

// Get live packets (simulated)
app.get('/api/packets', (req, res) => {
  const count = parseInt(req.query.count) || 10
  const packets = []

  for (let i = 0; i < count; i++) {
    packets.push(generatePacket(uuidv4()))
  }

  res.json({
    success: true,
    packets,
    timestamp: new Date().toISOString()
  })
})

// Analyze traffic
app.post('/api/analyze', (req, res) => {
  const { data } = req.body

  // Simulated analysis results
  const hasAnomalies = Math.random() > 0.6

  res.json({
    success: true,
    analysis: {
      id: uuidv4(),
      summary: {
        totalPackets: Math.floor(Math.random() * 10000) + 1000,
        uniqueIPs: Math.floor(Math.random() * 50) + 10,
        protocols: Math.floor(Math.random() * 8) + 3,
        duration: `${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}s`,
        avgSize: `${Math.floor(Math.random() * 500) + 100} bytes`,
        bandwidth: `${(Math.random() * 10 + 1).toFixed(2)} MB/s`
      },
      protocols: {
        TCP: Math.floor(Math.random() * 40) + 30,
        UDP: Math.floor(Math.random() * 20) + 10,
        HTTP: Math.floor(Math.random() * 15) + 5,
        HTTPS: Math.floor(Math.random() * 20) + 10,
        DNS: Math.floor(Math.random() * 10) + 2,
        Other: Math.floor(Math.random() * 5) + 1
      },
      anomalies: hasAnomalies ? [
        { type: 'Port Scan', severity: 'warning', description: 'Multiple connection attempts detected' },
        { type: 'Data Exfiltration', severity: 'danger', description: 'Large outbound data transfer' }
      ] : [],
      analyzedAt: new Date().toISOString()
    }
  })
})

// Get network interfaces (simulated)
app.get('/api/interfaces', (req, res) => {
  res.json({
    success: true,
    interfaces: [
      { name: 'eth0', description: 'Ethernet', status: 'up', speed: '1 Gbps' },
      { name: 'wlan0', description: 'Wi-Fi', status: 'up', speed: '867 Mbps' },
      { name: 'lo', description: 'Loopback', status: 'up', speed: '-' }
    ]
  })
})

// Get protocol information
app.get('/api/protocols', (req, res) => {
  res.json({
    success: true,
    protocols: [
      { name: 'HTTP', layer: 'Application', port: 80, description: 'Web communication' },
      { name: 'HTTPS', layer: 'Application', port: 443, description: 'Secure web communication' },
      { name: 'DNS', layer: 'Application', port: 53, description: 'Domain name resolution' },
      { name: 'FTP', layer: 'Application', port: 21, description: 'File transfer' },
      { name: 'SSH', layer: 'Application', port: 22, description: 'Secure shell' },
      { name: 'TCP', layer: 'Transport', port: null, description: 'Reliable delivery' },
      { name: 'UDP', layer: 'Transport', port: null, description: 'Fast delivery' },
      { name: 'IP', layer: 'Network', port: null, description: 'Packet routing' },
      { name: 'ICMP', layer: 'Network', port: null, description: 'Network diagnostics' },
      { name: 'ARP', layer: 'Data Link', port: null, description: 'Address resolution' }
    ]
  })
})

// Get network statistics
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      packetsPerSecond: Math.floor(Math.random() * 1000) + 500,
      bytesPerSecond: Math.floor(Math.random() * 10000000) + 1000000,
      activeConnections: Math.floor(Math.random() * 50) + 10,
      alerts: Math.floor(Math.random() * 5)
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'WireGuard Monitor API running',
    version: '1.0.0'
  })
})

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              WireGuard Monitor Backend Server                 ║
╚══════════════════════════════════════════════════════════════╝
Server running on http://localhost:${PORT}
  `)
})
