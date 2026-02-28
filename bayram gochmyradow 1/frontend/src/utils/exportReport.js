/**
 * Export utilities for generating reports
 */

/**
 * Generate HTML report
 */
export function generateHtmlReport(analysis, locale = 'en') {
  const t = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return obj[locale] || obj.en || ''
  }

  const riskColors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#ca8a04',
    low: '#16a34a'
  }

  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Report - ${analysis.basicInfo.fileName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 2rem;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #10b981, #3b82f6);
      color: white;
      border-radius: 1rem;
      margin-bottom: 2rem;
    }
    .header h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.9; }
    .card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .card h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .risk-overview {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1.5rem;
      background: #f3f4f6;
      border-radius: 0.75rem;
    }
    .risk-score {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
      border: 8px solid ${riskColors[analysis.security.overallRisk]};
    }
    .risk-score .value { font-size: 2rem; font-weight: 700; }
    .risk-score .label { font-size: 0.75rem; color: #6b7280; }
    .risk-level {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      border-radius: 2rem;
      font-weight: 600;
      text-transform: uppercase;
      background: ${riskColors[analysis.security.overallRisk]}20;
      color: ${riskColors[analysis.security.overallRisk]};
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }
    .info-item .label { font-size: 0.75rem; color: #6b7280; }
    .info-item .value { font-weight: 600; }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th { font-size: 0.75rem; text-transform: uppercase; color: #6b7280; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-critical { background: #fef2f2; color: #dc2626; }
    .badge-high { background: #fff7ed; color: #ea580c; }
    .badge-medium { background: #fefce8; color: #ca8a04; }
    .badge-low { background: #f0fdf4; color: #16a34a; }
    .issue {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
      border-left: 4px solid;
    }
    .issue-critical { background: #fef2f2; border-color: #dc2626; }
    .issue-high { background: #fff7ed; border-color: #ea580c; }
    .issue-medium { background: #fefce8; border-color: #ca8a04; }
    .issue-low { background: #f0fdf4; border-color: #16a34a; }
    .issue h4 { margin-bottom: 0.25rem; }
    .issue p { font-size: 0.9rem; color: #6b7280; }
    .recommendation {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f0fdf4;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .recommendation::before { content: "✓"; color: #16a34a; font-weight: bold; }
    .footer {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    .perm-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .perm-stat {
      flex: 1;
      text-align: center;
      padding: 1rem;
      border-radius: 0.5rem;
    }
    .perm-stat.critical { background: #fef2f2; }
    .perm-stat.high { background: #fff7ed; }
    .perm-stat.medium { background: #fefce8; }
    .perm-stat.low { background: #f0fdf4; }
    .perm-stat .count { font-size: 1.5rem; font-weight: 700; }
    .perm-stat.critical .count { color: #dc2626; }
    .perm-stat.high .count { color: #ea580c; }
    .perm-stat.medium .count { color: #ca8a04; }
    .perm-stat.low .count { color: #16a34a; }
    .perm-stat .label { font-size: 0.75rem; color: #6b7280; }
    @media print {
      body { padding: 0; background: white; }
      .card { box-shadow: none; border: 1px solid #e5e7eb; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ Android Security Analysis Report</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>

    <div class="card">
      <h2>📊 Risk Overview</h2>
      <div class="risk-overview">
        <div class="risk-score">
          <span class="value">${analysis.security.riskScore}%</span>
          <span class="label">Risk Score</span>
        </div>
        <div>
          <p style="color: #6b7280; margin-bottom: 0.5rem;">Overall Risk Level</p>
          <span class="risk-level">${analysis.security.overallRisk.toUpperCase()}</span>
          <div style="margin-top: 1rem; display: flex; gap: 2rem;">
            <div><strong>${analysis.security.issues.length}</strong> Issues</div>
            <div><strong>${analysis.security.warnings.length}</strong> Warnings</div>
            <div><strong>${analysis.permissions.total}</strong> Permissions</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📱 Application Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">File Name</span>
          <span class="value">${analysis.basicInfo.fileName}</span>
        </div>
        <div class="info-item">
          <span class="label">Package Name</span>
          <span class="value">${analysis.manifest.packageName}</span>
        </div>
        <div class="info-item">
          <span class="label">Version</span>
          <span class="value">${analysis.manifest.versionName} (${analysis.manifest.versionCode})</span>
        </div>
        <div class="info-item">
          <span class="label">File Size</span>
          <span class="value">${analysis.basicInfo.fileSizeFormatted}</span>
        </div>
        <div class="info-item">
          <span class="label">Min SDK</span>
          <span class="value">API ${analysis.manifest.minSdkVersion || 'N/A'}</span>
        </div>
        <div class="info-item">
          <span class="label">Target SDK</span>
          <span class="value">API ${analysis.manifest.targetSdkVersion || 'N/A'}</span>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>🔒 Permissions Analysis</h2>
      <div class="perm-stats">
        <div class="perm-stat critical">
          <div class="count">${analysis.permissions.byRisk.critical.length}</div>
          <div class="label">Critical</div>
        </div>
        <div class="perm-stat high">
          <div class="count">${analysis.permissions.byRisk.high.length}</div>
          <div class="label">High Risk</div>
        </div>
        <div class="perm-stat medium">
          <div class="count">${analysis.permissions.byRisk.medium.length}</div>
          <div class="label">Medium</div>
        </div>
        <div class="perm-stat low">
          <div class="count">${analysis.permissions.byRisk.low.length}</div>
          <div class="label">Low Risk</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Permission</th>
            <th>Category</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          ${[...analysis.permissions.byRisk.critical, ...analysis.permissions.byRisk.high, ...analysis.permissions.byRisk.medium, ...analysis.permissions.byRisk.low].map(perm => `
          <tr>
            <td>${perm.name.replace('android.permission.', '')}</td>
            <td>${perm.category}</td>
            <td><span class="badge badge-${perm.risk}">${perm.risk.toUpperCase()}</span></td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${analysis.security.issues.length > 0 ? `
    <div class="card">
      <h2>⚠️ Security Issues</h2>
      ${analysis.security.issues.map(issue => `
      <div class="issue issue-${issue.severity}">
        <h4>${t(issue.title)}</h4>
        <p>${t(issue.description)}</p>
      </div>
      `).join('')}
    </div>
    ` : ''}

    ${analysis.security.warnings.length > 0 ? `
    <div class="card">
      <h2>ℹ️ Warnings</h2>
      ${analysis.security.warnings.map(warning => `
      <div class="issue issue-${warning.severity}">
        <h4>${t(warning.title)}</h4>
        <p>${t(warning.description)}</p>
      </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="card">
      <h2>💡 Recommendations</h2>
      ${analysis.security.recommendations.map(rec => `
      <div class="recommendation">${t(rec)}</div>
      `).join('')}
    </div>

    <div class="card">
      <h2>📋 Manifest Flags</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Debuggable</span>
          <span class="value" style="color: ${analysis.manifest.flags.debuggable ? '#dc2626' : '#16a34a'}">
            ${analysis.manifest.flags.debuggable ? '⚠️ Yes' : '✓ No'}
          </span>
        </div>
        <div class="info-item">
          <span class="label">Allow Backup</span>
          <span class="value" style="color: ${analysis.manifest.flags.allowBackup ? '#ca8a04' : '#16a34a'}">
            ${analysis.manifest.flags.allowBackup ? '⚠️ Yes' : '✓ No'}
          </span>
        </div>
        <div class="info-item">
          <span class="label">Exported Components</span>
          <span class="value">${analysis.manifest.flags.hasExportedComponents ? '⚠️ Yes' : '✓ No'}</span>
        </div>
        <div class="info-item">
          <span class="label">Activities</span>
          <span class="value">${analysis.manifest.activities.length}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Generated by <strong>Android Security Analyzer</strong></p>
      <p>Developed by Bayram Gochmyradow</p>
      <p style="margin-top: 0.5rem; font-size: 0.75rem;">This report is for educational and research purposes only.</p>
    </div>
  </div>
</body>
</html>
  `

  return html
}

/**
 * Download HTML report
 */
export function downloadHtmlReport(analysis, locale = 'en') {
  const html = generateHtmlReport(analysis, locale)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `security-report-${analysis.basicInfo.fileName.replace('.apk', '')}.html`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Download JSON report
 */
export function downloadJsonReport(analysis) {
  const report = JSON.stringify(analysis, null, 2)
  const blob = new Blob([report], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `security-report-${analysis.basicInfo.fileName.replace('.apk', '')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Print report
 */
export function printReport(analysis, locale = 'en') {
  const html = generateHtmlReport(analysis, locale)
  const printWindow = window.open('', '_blank')
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
  }, 250)
}
