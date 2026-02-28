const express = require('express');
const router = express.Router();
const db = require('../utils/database');

/**
 * GET /api/history
 * Get all analysis history
 */
router.get('/', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const history = db.getHistory(limit, offset);

        // Transform to frontend-friendly format
        const formattedHistory = history.map(item => ({
            id: item.id,
            fileName: item.file_name,
            packageName: item.package_name,
            versionName: item.version_name,
            riskLevel: item.risk_level,
            riskScore: item.risk_score,
            permissionCount: item.permission_count,
            analyzedAt: item.analyzed_at,
            summary: {
                critical: item.critical_count,
                high: item.high_count,
                medium: item.medium_count,
                low: item.low_count,
                issues: item.issues_count,
                warnings: item.warnings_count
            }
        }));

        res.json({
            success: true,
            data: formattedHistory,
            total: formattedHistory.length
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            error: 'Failed to fetch history',
            message: error.message
        });
    }
});

/**
 * GET /api/history/stats
 * Get statistics
 */
router.get('/stats', (req, res) => {
    try {
        const stats = db.getStatistics();

        if (!stats) {
            return res.json({
                success: true,
                data: null,
                message: 'No analysis history yet'
            });
        }

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            error: 'Failed to fetch statistics',
            message: error.message
        });
    }
});

/**
 * GET /api/history/search
 * Search analyses
 */
router.get('/search', (req, res) => {
    try {
        const query = req.query.q || '';

        if (!query.trim()) {
            return res.json({
                success: true,
                data: []
            });
        }

        const results = db.searchAnalyses(query);

        const formattedResults = results.map(item => ({
            id: item.id,
            fileName: item.file_name,
            packageName: item.package_name,
            versionName: item.version_name,
            riskLevel: item.risk_level,
            riskScore: item.risk_score,
            permissionCount: item.permission_count,
            analyzedAt: item.analyzed_at,
            summary: {
                issues: item.issues_count,
                warnings: item.warnings_count
            }
        }));

        res.json({
            success: true,
            data: formattedResults
        });
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({
            error: 'Search failed',
            message: error.message
        });
    }
});

/**
 * GET /api/history/filter/:riskLevel
 * Filter by risk level
 */
router.get('/filter/:riskLevel', (req, res) => {
    try {
        const { riskLevel } = req.params;
        const validLevels = ['critical', 'high', 'medium', 'low'];

        if (!validLevels.includes(riskLevel)) {
            return res.status(400).json({
                error: 'Invalid risk level',
                message: 'Valid levels: critical, high, medium, low'
            });
        }

        const results = db.getByRiskLevel(riskLevel);

        const formattedResults = results.map(item => ({
            id: item.id,
            fileName: item.file_name,
            packageName: item.package_name,
            riskLevel: item.risk_level,
            riskScore: item.risk_score,
            permissionCount: item.permission_count,
            analyzedAt: item.analyzed_at
        }));

        res.json({
            success: true,
            data: formattedResults
        });
    } catch (error) {
        console.error('Error filtering:', error);
        res.status(500).json({
            error: 'Filter failed',
            message: error.message
        });
    }
});

/**
 * GET /api/history/:id
 * Get single analysis details
 */
router.get('/:id', (req, res) => {
    try {
        const analysis = db.getAnalysisById(req.params.id);

        if (!analysis) {
            return res.status(404).json({
                error: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: analysis.id,
                fileName: analysis.file_name,
                packageName: analysis.package_name,
                riskLevel: analysis.risk_level,
                riskScore: analysis.risk_score,
                analyzedAt: analysis.analyzed_at,
                analysis: analysis.analysis
            }
        });
    } catch (error) {
        console.error('Error fetching analysis:', error);
        res.status(500).json({
            error: 'Failed to fetch analysis',
            message: error.message
        });
    }
});

/**
 * DELETE /api/history/:id
 * Delete single analysis
 */
router.delete('/:id', (req, res) => {
    try {
        const result = db.deleteAnalysis(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            message: 'Analysis deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting analysis:', error);
        res.status(500).json({
            error: 'Failed to delete analysis',
            message: error.message
        });
    }
});

/**
 * DELETE /api/history
 * Clear all history
 */
router.delete('/', (req, res) => {
    try {
        db.clearHistory();

        res.json({
            success: true,
            message: 'History cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({
            error: 'Failed to clear history',
            message: error.message
        });
    }
});

module.exports = router;
