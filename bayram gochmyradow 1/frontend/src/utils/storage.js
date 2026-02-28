/**
 * Local Storage utilities for analysis history
 */

const HISTORY_KEY = 'apk_analysis_history'
const MAX_HISTORY = 20

// Demo history data for initial display
const DEMO_HISTORY = [
  {
    id: 'demo-1',
    fileName: 'Calculator_Pro_v2.1.apk',
    packageName: 'com.calculator.pro',
    riskLevel: 'low',
    riskScore: 15,
    permissionCount: 3,
    analyzedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    summary: { critical: 0, high: 0, medium: 1, low: 2, issues: 0, warnings: 1 }
  },
  {
    id: 'demo-2',
    fileName: 'Social_Media_App_v5.4.apk',
    packageName: 'com.social.media.app',
    riskLevel: 'medium',
    riskScore: 45,
    permissionCount: 12,
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    summary: { critical: 0, high: 2, medium: 4, low: 6, issues: 2, warnings: 4 }
  },
  {
    id: 'demo-3',
    fileName: 'Free_VPN_Pro_v1.8.apk',
    packageName: 'com.free.vpn.unlimited',
    riskLevel: 'high',
    riskScore: 72,
    permissionCount: 18,
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    summary: { critical: 2, high: 5, medium: 6, low: 5, issues: 5, warnings: 8 }
  },
  {
    id: 'demo-4',
    fileName: 'FlashLight_Plus_v3.0.apk',
    packageName: 'com.flashlight.malware',
    riskLevel: 'critical',
    riskScore: 92,
    permissionCount: 24,
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    summary: { critical: 8, high: 6, medium: 5, low: 5, issues: 12, warnings: 6 }
  },
  {
    id: 'demo-5',
    fileName: 'Weather_Widget_v4.2.apk',
    packageName: 'com.weather.widget.clean',
    riskLevel: 'low',
    riskScore: 18,
    permissionCount: 5,
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    summary: { critical: 0, high: 0, medium: 2, low: 3, issues: 0, warnings: 2 }
  }
]

/**
 * Get analysis history from localStorage
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    const history = data ? JSON.parse(data) : []

    // If history is empty, return demo data
    if (history.length === 0) {
      return DEMO_HISTORY
    }

    return history
  } catch {
    return DEMO_HISTORY
  }
}

/**
 * Add analysis to history
 */
export function addToHistory(analysis) {
  const history = getHistory()

  const entry = {
    id: Date.now().toString(),
    fileName: analysis.basicInfo?.fileName || 'Unknown',
    packageName: analysis.manifest?.packageName || 'Unknown',
    riskLevel: analysis.security?.overallRisk || 'unknown',
    riskScore: analysis.security?.riskScore || 0,
    permissionCount: analysis.permissions?.total || 0,
    analyzedAt: new Date().toISOString(),
    summary: {
      critical: analysis.permissions?.byRisk?.critical?.length || 0,
      high: analysis.permissions?.byRisk?.high?.length || 0,
      medium: analysis.permissions?.byRisk?.medium?.length || 0,
      low: analysis.permissions?.byRisk?.low?.length || 0,
      issues: analysis.security?.issues?.length || 0,
      warnings: analysis.security?.warnings?.length || 0
    }
  }

  // Add to beginning
  history.unshift(entry)

  // Keep only last MAX_HISTORY entries
  if (history.length > MAX_HISTORY) {
    history.pop()
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return entry
}

/**
 * Clear history
 */
export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

/**
 * Remove single entry from history
 */
export function removeFromHistory(id) {
  const history = getHistory()
  const filtered = history.filter(item => item.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
}

/**
 * Get statistics from history
 */
export function getStatistics() {
  const history = getHistory()

  if (history.length === 0) {
    return null
  }

  const stats = {
    totalAnalyses: history.length,
    averageRiskScore: 0,
    riskDistribution: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    mostCommonPermissions: {},
    totalIssuesFound: 0,
    totalWarningsFound: 0
  }

  let totalScore = 0

  history.forEach(entry => {
    totalScore += entry.riskScore
    stats.riskDistribution[entry.riskLevel]++
    stats.totalIssuesFound += entry.summary.issues
    stats.totalWarningsFound += entry.summary.warnings
  })

  stats.averageRiskScore = Math.round(totalScore / history.length)

  return stats
}
