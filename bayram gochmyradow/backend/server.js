const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const reportsDir = path.join(__dirname, 'reports');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Routes
app.use('/api/analyze', analyzeRoutes);

// Reports route
app.use('/api/reports', express.static(reportsDir));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Android Security Analyzer API is running',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║     Android Security Analyzer - Backend Server        ║
    ║                                                       ║
    ║     Server running on: http://localhost:${PORT}          ║
    ║     API Health: http://localhost:${PORT}/api/health      ║
    ╚═══════════════════════════════════════════════════════╝
    `);
});
