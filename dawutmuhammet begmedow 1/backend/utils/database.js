const path = require('path')
const fs = require('fs')

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'scans.json')

// Load database from file
function loadDb() {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8')
            return JSON.parse(data)
        }
    } catch (error) {
        console.error('Error loading database:', error.message)
    }
    return { scans: [] }
}

// Save database to file
function saveDb(db) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
    } catch (error) {
        console.error('Error saving database:', error.message)
    }
}

// Initialize database
function initDb() {
    const db = loadDb()
    console.log(`Database loaded with ${db.scans.length} scans`)
    return db
}

/**
 * Save scan result to database
 */
function saveScan(scan) {
    const db = loadDb()

    const entry = {
        id: scan.id,
        fileName: scan.fileName,
        filePath: scan.filePath || '',
        fileSize: scan.fileSize || 0,
        fileSizeFormatted: scan.fileSizeFormatted || formatSize(scan.fileSize || 0),
        fileType: scan.fileType || { type: 'Unknown', risk: 'low' },
        status: scan.status,
        threatScore: scan.threatScore || 0,
        entropy: scan.entropy || { entropy: 0, interpretation: 'Normal' },
        hashes: scan.hashes || {},
        patterns: scan.patterns || [],
        virusTotal: scan.virusTotal || { available: false },
        scannedAt: scan.scannedAt || new Date().toISOString()
    }

    // Add to beginning of array
    db.scans.unshift(entry)

    // Keep only last 100 scans
    if (db.scans.length > 100) {
        db.scans = db.scans.slice(0, 100)
    }

    saveDb(db)
    return entry
}

/**
 * Get all scans (history)
 */
function getHistory(limit = 50, offset = 0) {
    const db = loadDb()
    return db.scans.slice(offset, offset + limit)
}

/**
 * Get scan by ID
 */
function getScanById(id) {
    const db = loadDb()
    return db.scans.find(s => s.id === id) || null
}

/**
 * Delete scan by ID
 */
function deleteScan(id) {
    const db = loadDb()
    const initialLength = db.scans.length
    db.scans = db.scans.filter(s => s.id !== id)
    saveDb(db)
    return { changes: initialLength - db.scans.length }
}

/**
 * Clear all history
 */
function clearHistory() {
    const db = { scans: [] }
    saveDb(db)
    return { changes: 1 }
}

/**
 * Get statistics
 */
function getStatistics() {
    const db = loadDb()

    if (db.scans.length === 0) {
        return {
            totalScans: 0,
            cleanFiles: 0,
            suspicious: 0,
            malware: 0,
            averageThreatScore: 0,
            recentScans: []
        }
    }

    const total = db.scans.length
    const avgThreat = Math.round(
        db.scans.reduce((sum, s) => sum + (s.threatScore || 0), 0) / total
    )

    const statusCounts = {
        clean: db.scans.filter(s => s.status === 'clean').length,
        suspicious: db.scans.filter(s => s.status === 'suspicious').length,
        malware: db.scans.filter(s => s.status === 'malware').length,
        potentially_unwanted: db.scans.filter(s => s.status === 'potentially_unwanted').length
    }

    // File type statistics
    const fileTypes = {}
    db.scans.forEach(s => {
        const type = s.fileType?.type || 'Unknown'
        fileTypes[type] = (fileTypes[type] || 0) + 1
    })

    // Pattern statistics
    const patterns = {}
    db.scans.forEach(s => {
        if (s.patterns) {
            s.patterns.forEach(p => {
                if (!patterns[p.name]) {
                    patterns[p.name] = { name: p.name, severity: p.severity, count: 0 }
                }
                patterns[p.name].count += p.count || 1
            })
        }
    })

    const topPatterns = Object.values(patterns).sort((a, b) => b.count - a.count).slice(0, 8)

    // Recent scans (last 10)
    const recentScans = db.scans.slice(0, 10)

    // Scans by day (last 7 days)
    const scansByDay = {}
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        scansByDay[dateStr] = 0
    }

    db.scans.forEach(s => {
        const dateStr = s.scannedAt?.split('T')[0]
        if (dateStr && scansByDay.hasOwnProperty(dateStr)) {
            scansByDay[dateStr]++
        }
    })

    return {
        totalScans: total,
        cleanFiles: statusCounts.clean,
        suspicious: statusCounts.suspicious,
        malware: statusCounts.malware,
        potentiallyUnwanted: statusCounts.potentially_unwanted,
        averageThreatScore: avgThreat,
        fileTypes,
        topPatterns,
        recentScans,
        scansByDay
    }
}

/**
 * Search scans
 */
function searchScans(query) {
    const db = loadDb()
    const lowerQuery = query.toLowerCase()

    return db.scans.filter(s =>
        s.fileName?.toLowerCase().includes(lowerQuery) ||
        s.status?.toLowerCase().includes(lowerQuery) ||
        s.fileType?.type?.toLowerCase().includes(lowerQuery)
    ).slice(0, 50)
}

/**
 * Format file size
 */
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

module.exports = {
    initDb,
    saveScan,
    getHistory,
    getScanById,
    deleteScan,
    clearHistory,
    getStatistics,
    searchScans
}
