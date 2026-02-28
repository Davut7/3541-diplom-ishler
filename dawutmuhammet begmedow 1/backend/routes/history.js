const express = require('express')
const router = express.Router()
const db = require('../utils/database')

/**
 * GET /api/history
 * Get scan history
 */
router.get('/', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const history = db.getHistory(limit, offset)
        res.json(history)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * GET /api/history/stats
 * Get scan statistics
 */
router.get('/stats', (req, res) => {
    try {
        const stats = db.getStatistics()
        res.json(stats)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * GET /api/history/search
 * Search scans
 */
router.get('/search', (req, res) => {
    try {
        const query = req.query.q || ''
        const results = db.searchScans(query)
        res.json(results)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * GET /api/history/:id
 * Get scan by ID
 */
router.get('/:id', (req, res) => {
    try {
        const scan = db.getScanById(req.params.id)
        if (!scan) {
            return res.status(404).json({ error: 'Scan not found' })
        }
        res.json(scan)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * DELETE /api/history/:id
 * Delete a scan
 */
router.delete('/:id', (req, res) => {
    try {
        const result = db.deleteScan(req.params.id)
        res.json({ success: true, ...result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * DELETE /api/history
 * Clear all history
 */
router.delete('/', (req, res) => {
    try {
        const result = db.clearHistory()
        res.json({ success: true, ...result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
