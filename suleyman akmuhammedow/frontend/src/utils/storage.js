const STORAGE_KEY = 'osint-history'
const MAX_ITEMS = 50

export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveAnalysis(analysis) {
  try {
    const history = getHistory()
    const newItem = {
      id: Date.now(),
      target: analysis.target,
      ip: analysis.ip,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      location: analysis.geo ? `${analysis.geo.city}, ${analysis.geo.country}` : 'Unknown',
      openPorts: analysis.openPorts?.length || 0,
      date: new Date().toISOString(),
      fullData: analysis
    }

    history.unshift(newItem)

    // Keep only last MAX_ITEMS
    if (history.length > MAX_ITEMS) {
      history.splice(MAX_ITEMS)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return newItem
  } catch (error) {
    console.error('Error saving analysis:', error)
    return null
  }
}

export function deleteAnalysis(id) {
  try {
    const history = getHistory()
    const filtered = history.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch {
    return false
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export function getAnalysisById(id) {
  const history = getHistory()
  return history.find(item => item.id === id)
}
