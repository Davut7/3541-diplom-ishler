export function exportToJson(data) {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `osint-report-${data.target}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToHtml(data, t) {
  const getRiskColor = (score) => {
    if (score >= 70) return '#dc2626'
    if (score >= 50) return '#ea580c'
    if (score >= 30) return '#ca8a04'
    return '#16a34a'
  }

  const getRiskLevel = (score) => {
    if (score >= 70) return 'CRITICAL'
    if (score >= 50) return 'HIGH'
    if (score >= 30) return 'MEDIUM'
    return 'LOW'
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OSINT Report - ${data.target}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .header { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px solid #e2e8f0; }
    .logo { font-size: 2rem; font-weight: 700; color: #00d4aa; }
    .logo span { color: #1e293b; }
    .title { font-size: 1.5rem; margin-top: 1rem; }
    .date { color: #64748b; font-size: 0.9rem; margin-top: 0.5rem; }
    .section { margin-bottom: 2rem; }
    .section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; }
    .overview { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 1.5rem; border-radius: 8px; }
    .target-info h2 { font-size: 1.5rem; }
    .target-info p { color: #64748b; font-family: monospace; }
    .risk-score { text-align: center; }
    .score-circle {
      width: 100px; height: 100px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 4px solid ${getRiskColor(data.riskScore)};
      color: ${getRiskColor(data.riskScore)};
      font-size: 2rem; font-weight: 700;
    }
    .risk-level { font-weight: 600; margin-top: 0.5rem; color: ${getRiskColor(data.riskScore)}; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .info-item { background: #f8fafc; padding: 1rem; border-radius: 8px; }
    .info-item label { display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem; }
    .info-item span { font-weight: 500; }
    .port-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .port-tag { background: #00d4aa; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-family: monospace; }
    .issue { padding: 0.75rem 1rem; margin-bottom: 0.5rem; border-radius: 8px; border-left: 3px solid; }
    .issue.danger { background: rgba(220,38,38,0.1); border-color: #dc2626; }
    .issue.warning { background: rgba(234,88,12,0.1); border-color: #ea580c; }
    .issue.info { background: rgba(0,212,170,0.1); border-color: #00d4aa; }
    .footer { text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #e2e8f0; color: #64748b; }
    @media print { body { padding: 1rem; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"><span>OSINT</span>.AI</div>
    <div class="title">Intelligence Report</div>
    <div class="date">Generated: ${new Date().toLocaleString()}</div>
  </div>

  <div class="section">
    <div class="overview">
      <div class="target-info">
        <h2>${data.target}</h2>
        <p>${data.ip}</p>
      </div>
      <div class="risk-score">
        <div class="score-circle">${data.riskScore}%</div>
        <div class="risk-level">${getRiskLevel(data.riskScore)}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Basic Information</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Location</label>
        <span>${data.geo?.city || 'N/A'}, ${data.geo?.country || 'N/A'}</span>
      </div>
      <div class="info-item">
        <label>ISP</label>
        <span>${data.geo?.isp || 'N/A'}</span>
      </div>
      <div class="info-item">
        <label>Ping</label>
        <span>${data.ping?.latency || 'N/A'} ms</span>
      </div>
      <div class="info-item">
        <label>TTL</label>
        <span>${data.ping?.ttl || 'N/A'}</span>
      </div>
      <div class="info-item">
        <label>Open Ports</label>
        <span>${data.openPorts?.length || 0}</span>
      </div>
      <div class="info-item">
        <label>Organization</label>
        <span>${data.geo?.org || 'N/A'}</span>
      </div>
    </div>
  </div>

  ${data.openPorts?.length ? `
  <div class="section">
    <div class="section-title">Open Ports</div>
    <div class="port-list">
      ${data.openPorts.map(p => `<span class="port-tag">${p.port}/${p.service}</span>`).join('')}
    </div>
  </div>
  ` : ''}

  ${data.whois ? `
  <div class="section">
    <div class="section-title">WHOIS Information</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Registrar</label>
        <span>${data.whois.registrar || 'N/A'}</span>
      </div>
      <div class="info-item">
        <label>Created</label>
        <span>${data.whois.created || 'N/A'}</span>
      </div>
      <div class="info-item">
        <label>Expires</label>
        <span>${data.whois.expires || 'N/A'}</span>
      </div>
    </div>
  </div>
  ` : ''}

  ${data.issues?.length ? `
  <div class="section">
    <div class="section-title">Security Issues</div>
    ${data.issues.map(i => `<div class="issue danger">${i}</div>`).join('')}
  </div>
  ` : ''}

  ${data.warnings?.length ? `
  <div class="section">
    <div class="section-title">Warnings</div>
    ${data.warnings.map(w => `<div class="issue warning">${w}</div>`).join('')}
  </div>
  ` : ''}

  ${data.recommendations?.length ? `
  <div class="section">
    <div class="section-title">Recommendations</div>
    ${data.recommendations.map(r => `<div class="issue info">${r}</div>`).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p>OSINT.AI - AI-Assisted Open Source Intelligence Tools</p>
    <p>This report is for educational and authorized security testing purposes only.</p>
  </div>
</body>
</html>
`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `osint-report-${data.target}-${Date.now()}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export function printReport(data, t) {
  const getRiskColor = (score) => {
    if (score >= 70) return '#dc2626'
    if (score >= 50) return '#ea580c'
    if (score >= 30) return '#ca8a04'
    return '#16a34a'
  }

  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OSINT Report - ${data.target}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #00d4aa; }
        .info { margin: 10px 0; }
        .risk { font-size: 24px; font-weight: bold; color: ${getRiskColor(data.riskScore)}; }
      </style>
    </head>
    <body>
      <h1>OSINT.AI Report</h1>
      <div class="info"><strong>Target:</strong> ${data.target}</div>
      <div class="info"><strong>IP:</strong> ${data.ip}</div>
      <div class="info"><strong>Risk Score:</strong> <span class="risk">${data.riskScore}%</span></div>
      <div class="info"><strong>Location:</strong> ${data.geo?.city}, ${data.geo?.country}</div>
      <div class="info"><strong>ISP:</strong> ${data.geo?.isp || 'N/A'}</div>
      <div class="info"><strong>Open Ports:</strong> ${data.openPorts?.map(p => p.port + '/' + p.service).join(', ') || 'None'}</div>
      <hr>
      <p><small>Generated: ${new Date().toLocaleString()}</small></p>
    </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}
