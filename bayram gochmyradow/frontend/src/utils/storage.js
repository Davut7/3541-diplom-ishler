/**
 * Local Storage utilities for analysis history
 */

const HISTORY_KEY = 'apk_analysis_history'
const MAX_HISTORY = 20

/**
 * Get analysis history from localStorage
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
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
