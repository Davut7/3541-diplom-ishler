const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'analyses.json');

// Load database from file
function loadDb() {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading database:', error.message);
    }
    return { analyses: [] };
}

// Save database to file
function saveDb(db) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } catch (error) {
        console.error('Error saving database:', error.message);
    }
}

// Initialize database (for compatibility)
async function initDb() {
    const db = loadDb();
    console.log(`Database loaded with ${db.analyses.length} analyses`);
    return db;
}

/**
 * Save analysis result to database
 */
function saveAnalysis(reportId, analysis) {
    const db = loadDb();

    const basicInfo = analysis.basicInfo || {};
    const manifest = analysis.manifest || {};
    const permissions = analysis.permissions || {};
    const security = analysis.security || {};
    const byRisk = permissions.byRisk || {};

    const entry = {
        id: reportId,
        file_name: basicInfo.fileName || 'Unknown',
        package_name: manifest.packageName || 'Unknown',
        version_name: manifest.versionName || '0',
        version_code: manifest.versionCode || '0',
        file_size: basicInfo.fileSize || 0,
        risk_level: security.overallRisk || 'unknown',
        risk_score: security.riskScore || 0,
        permission_count: permissions.total || 0,
        critical_count: byRisk.critical?.length || 0,
        high_count: byRisk.high?.length || 0,
        medium_count: byRisk.medium?.length || 0,
        low_count: byRisk.low?.length || 0,
        issues_count: security.issues?.length || 0,
        warnings_count: security.warnings?.length || 0,
        min_sdk: manifest.minSdkVersion || 0,
        target_sdk: manifest.targetSdkVersion || 0,
        is_debuggable: manifest.flags?.debuggable ? 1 : 0,
        allow_backup: manifest.flags?.allowBackup ? 1 : 0,
        full_report: analysis,
        analyzed_at: analysis.analyzedAt || new Date().toISOString()
    };

    // Add to beginning of array
    db.analyses.unshift(entry);

    // Keep only last 100 analyses
    if (db.analyses.length > 100) {
        db.analyses = db.analyses.slice(0, 100);
    }

    saveDb(db);
    return reportId;
}

/**
 * Get all analyses (history)
 */
function getHistory(limit = 50, offset = 0) {
    const db = loadDb();
    return db.analyses.slice(offset, offset + limit);
}

/**
 * Get analysis by ID
 */
function getAnalysisById(id) {
    const db = loadDb();
    const entry = db.analyses.find(a => a.id === id);

    if (entry) {
        return {
            ...entry,
            analysis: entry.full_report
        };
    }
    return null;
}

/**
 * Delete analysis by ID
 */
function deleteAnalysis(id) {
    const db = loadDb();
    const initialLength = db.analyses.length;
    db.analyses = db.analyses.filter(a => a.id !== id);
    saveDb(db);
    return { changes: initialLength - db.analyses.length };
}

/**
 * Clear all history
 */
function clearHistory() {
    const db = { analyses: [] };
    saveDb(db);
    return { changes: 1 };
}

/**
 * Get statistics
 */
function getStatistics() {
    const db = loadDb();

    if (db.analyses.length === 0) {
        return null;
    }

    const total = db.analyses.length;
    const avgRisk = Math.round(
        db.analyses.reduce((sum, a) => sum + (a.risk_score || 0), 0) / total
    );

    const riskDistribution = {
        critical: db.analyses.filter(a => a.risk_level === 'critical').length,
        high: db.analyses.filter(a => a.risk_level === 'high').length,
        medium: db.analyses.filter(a => a.risk_level === 'medium').length,
        low: db.analyses.filter(a => a.risk_level === 'low').length
    };

    const totalIssuesFound = db.analyses.reduce((sum, a) => sum + (a.issues_count || 0), 0);
    const totalWarningsFound = db.analyses.reduce((sum, a) => sum + (a.warnings_count || 0), 0);

    const recentAnalyses = db.analyses.slice(0, 5).map(a => ({
        id: a.id,
        file_name: a.file_name,
        package_name: a.package_name,
        risk_level: a.risk_level,
        risk_score: a.risk_score,
        analyzed_at: a.analyzed_at
    }));

    return {
        totalAnalyses: total,
        averageRiskScore: avgRisk,
        riskDistribution,
        totalIssuesFound,
        totalWarningsFound,
        recentAnalyses
    };
}

/**
 * Search analyses
 */
function searchAnalyses(query) {
    const db = loadDb();
    const lowerQuery = query.toLowerCase();

    return db.analyses.filter(a =>
        a.file_name?.toLowerCase().includes(lowerQuery) ||
        a.package_name?.toLowerCase().includes(lowerQuery)
    ).slice(0, 50);
}

/**
 * Get analyses by risk level
 */
function getByRiskLevel(riskLevel) {
    const db = loadDb();
    return db.analyses.filter(a => a.risk_level === riskLevel);
}

module.exports = {
    initDb,
    saveAnalysis,
    getHistory,
    getAnalysisById,
    deleteAnalysis,
    clearHistory,
    getStatistics,
    searchAnalyses,
    getByRiskLevel
};
