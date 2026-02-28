const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const db = require('./utils/database')
const historyRoutes = require('./routes/history')

const app = express()
const PORT = 7041

app.use(cors())
app.use(express.json())

// Initialize database
db.initDb()

// History routes
app.use('/api/history', historyRoutes)

// Simulated malware signatures database
const malwareSignatures = {
    executable: ['4d5a90', 'MZ', 'PE'],
    suspicious: ['cmd.exe', 'powershell', 'base64', 'eval(', 'CreateRemoteThread', 'VirtualAlloc', 'WriteProcessMemory'],
    scripts: ['WScript.Shell', 'ActiveXObject', 'document.write', 'fromCharCode'],
    network: ['http://', 'https://', 'socket', 'connect', 'download'],
    registry: ['HKEY_', 'RegWrite', 'RegDelete', 'CurrentVersion\\Run']
}

// File type detection
const fileTypes = {
    'exe': { type: 'PE Executable', risk: 'high' },
    'dll': { type: 'DLL Library', risk: 'high' },
    'js': { type: 'JavaScript', risk: 'medium' },
    'vbs': { type: 'VBScript', risk: 'high' },
    'bat': { type: 'Batch Script', risk: 'medium' },
    'ps1': { type: 'PowerShell', risk: 'high' },
    'pdf': { type: 'PDF Document', risk: 'medium' },
    'doc': { type: 'MS Word', risk: 'medium' },
    'docx': { type: 'MS Word', risk: 'low' },
    'xls': { type: 'MS Excel', risk: 'medium' },
    'xlsx': { type: 'MS Excel', risk: 'low' },
    'zip': { type: 'ZIP Archive', risk: 'medium' },
    'rar': { type: 'RAR Archive', risk: 'medium' },
    'png': { type: 'PNG Image', risk: 'low' },
    'jpg': { type: 'JPEG Image', risk: 'low' },
    'gif': { type: 'GIF Image', risk: 'low' },
    'txt': { type: 'Text File', risk: 'low' },
    'apk': { type: 'Android Package', risk: 'high' }
}

// Generate realistic scan result
function generateScanResult(fileName, fileSize) {
    const ext = fileName.split('.').pop().toLowerCase()
    const fileType = fileTypes[ext] || { type: 'Unknown', risk: 'low' }

    // Generate hashes
    const hash = crypto.createHash('sha256').update(fileName + Date.now()).digest('hex')
    const md5 = crypto.createHash('md5').update(fileName + Date.now()).digest('hex')
    const sha1 = crypto.createHash('sha1').update(fileName + Date.now()).digest('hex')

    // Calculate entropy (simulated)
    let entropy = 3.5 + Math.random() * 4.5
    let entropyInterpretation = 'Normal'
    if (entropy > 7.5) entropyInterpretation = 'Highly Packed/Encrypted'
    else if (entropy > 6.5) entropyInterpretation = 'Possibly Packed'
    else if (entropy > 5) entropyInterpretation = 'Some Compression'

    // Base threat score on file type risk
    let baseThreat = 0
    if (fileType.risk === 'high') baseThreat = 30 + Math.random() * 40
    else if (fileType.risk === 'medium') baseThreat = 10 + Math.random() * 30
    else baseThreat = Math.random() * 15

    // Add entropy factor
    if (entropy > 7) baseThreat += 20
    else if (entropy > 6) baseThreat += 10

    // Generate patterns
    const patterns = []
    const allPatterns = [
        { name: 'Suspicious API Call', severity: 'high', chance: 0.3 },
        { name: 'Network Communication', severity: 'medium', chance: 0.4 },
        { name: 'Registry Access', severity: 'medium', chance: 0.25 },
        { name: 'File System Access', severity: 'low', chance: 0.5 },
        { name: 'Encrypted Strings', severity: 'high', chance: 0.2 },
        { name: 'Obfuscated Code', severity: 'high', chance: 0.15 },
        { name: 'Process Injection', severity: 'critical', chance: 0.1 },
        { name: 'Anti-Debug Check', severity: 'high', chance: 0.1 },
        { name: 'Persistence Mechanism', severity: 'critical', chance: 0.1 },
        { name: 'Keylogger Pattern', severity: 'critical', chance: 0.05 }
    ]

    allPatterns.forEach(p => {
        if (Math.random() < p.chance * (fileType.risk === 'high' ? 1.5 : fileType.risk === 'medium' ? 1 : 0.3)) {
            const count = Math.floor(Math.random() * 5) + 1
            patterns.push({ name: p.name, severity: p.severity, count })

            // Add threat based on pattern severity
            if (p.severity === 'critical') baseThreat += 15
            else if (p.severity === 'high') baseThreat += 10
            else if (p.severity === 'medium') baseThreat += 5
        }
    })

    // Cap threat score at 100
    const threatScore = Math.min(Math.round(baseThreat), 100)

    // Determine status
    let status = 'clean'
    if (threatScore >= 70) status = 'malware'
    else if (threatScore >= 40) status = 'suspicious'
    else if (threatScore >= 20) status = 'potentially_unwanted'

    // Simulate VirusTotal result
    const virusTotal = {
        available: true,
        found: threatScore > 30,
        stats: {
            malicious: threatScore > 60 ? Math.floor(Math.random() * 30) + 10 : threatScore > 30 ? Math.floor(Math.random() * 10) : 0,
            suspicious: threatScore > 40 ? Math.floor(Math.random() * 5) : 0,
            harmless: Math.floor(Math.random() * 40) + 30,
            undetected: Math.floor(Math.random() * 20) + 10
        },
        message: threatScore > 30 ? 'File found in VirusTotal database' : 'File not found in VirusTotal database'
    }

    return {
        id: uuidv4(),
        fileName,
        fileSize: fileSize || Math.floor(Math.random() * 10000000),
        fileSizeFormatted: formatSize(fileSize || Math.floor(Math.random() * 10000000)),
        fileType,
        hashes: { sha256: hash, md5, sha1 },
        entropy: { entropy: parseFloat(entropy.toFixed(2)), interpretation: entropyInterpretation },
        status,
        threatScore,
        patterns,
        virusTotal,
        scannedAt: new Date().toISOString()
    }
}

function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Scan endpoint
app.post('/api/scan', (req, res) => {
    const { fileName, fileSize } = req.body

    if (!fileName) {
        return res.status(400).json({ error: 'fileName is required' })
    }

    const result = generateScanResult(fileName, fileSize)

    // Save to database
    db.saveScan(result)

    res.json({
        success: true,
        result
    })
})

// Demo scan endpoint - simulate scanning a file
app.post('/api/scan/demo', (req, res) => {
    const { fileName } = req.body

    if (!fileName) {
        return res.status(400).json({ error: 'fileName is required' })
    }

    // Simulate scanning delay
    const result = generateScanResult(fileName, Math.floor(Math.random() * 50000000))

    // Save to database
    db.saveScan(result)

    res.json({
        success: true,
        result
    })
})

// Get sample files for testing
app.get('/api/samples', (req, res) => {
    const samples = [
        {
            id: 'clean-doc',
            name: 'Report_2024.docx',
            type: 'document',
            description: { en: 'Clean Word document', tk: 'Arassa Word dokumenti' },
            riskLevel: 'low',
            icon: 'pi-file-word',
            size: 245760
        },
        {
            id: 'clean-image',
            name: 'vacation_photo.jpg',
            type: 'image',
            description: { en: 'Normal JPEG image', tk: 'Adaty JPEG surat' },
            riskLevel: 'low',
            icon: 'pi-image',
            size: 2457600
        },
        {
            id: 'suspicious-exe',
            name: 'free_software_setup.exe',
            type: 'executable',
            description: { en: 'Potentially unwanted program', tk: 'Potensial islenilmeyan programma' },
            riskLevel: 'medium',
            icon: 'pi-desktop',
            size: 15728640
        },
        {
            id: 'suspicious-script',
            name: 'update_script.ps1',
            type: 'script',
            description: { en: 'PowerShell script with network access', tk: 'Tor girelgeli PowerShell skripti' },
            riskLevel: 'high',
            icon: 'pi-code',
            size: 8192
        },
        {
            id: 'malware-trojan',
            name: 'invoice_details.exe',
            type: 'malware',
            description: { en: 'Trojan disguised as invoice', tk: 'Faktura hokmunde gizlenen Troyan' },
            riskLevel: 'critical',
            icon: 'pi-exclamation-triangle',
            size: 524288
        },
        {
            id: 'malware-ransomware',
            name: 'important_document.pdf.exe',
            type: 'malware',
            description: { en: 'Ransomware with double extension', tk: 'Gosh uzatmaly Ransomware' },
            riskLevel: 'critical',
            icon: 'pi-lock',
            size: 1048576
        }
    ]
    res.json(samples)
})

// Scan sample file
app.get('/api/samples/:id', (req, res) => {
    const sampleId = req.params.id

    const sampleConfigs = {
        'clean-doc': {
            fileName: 'Report_2024.docx',
            threatOverride: 5,
            statusOverride: 'clean',
            patternsOverride: []
        },
        'clean-image': {
            fileName: 'vacation_photo.jpg',
            threatOverride: 2,
            statusOverride: 'clean',
            patternsOverride: []
        },
        'suspicious-exe': {
            fileName: 'free_software_setup.exe',
            threatOverride: 45,
            statusOverride: 'suspicious',
            patternsOverride: [
                { name: 'Network Communication', severity: 'medium', count: 3 },
                { name: 'Registry Access', severity: 'medium', count: 2 },
                { name: 'File System Access', severity: 'low', count: 5 }
            ]
        },
        'suspicious-script': {
            fileName: 'update_script.ps1',
            threatOverride: 58,
            statusOverride: 'suspicious',
            patternsOverride: [
                { name: 'Obfuscated Code', severity: 'high', count: 2 },
                { name: 'Network Communication', severity: 'medium', count: 4 },
                { name: 'Encrypted Strings', severity: 'high', count: 1 }
            ]
        },
        'malware-trojan': {
            fileName: 'invoice_details.exe',
            threatOverride: 85,
            statusOverride: 'malware',
            patternsOverride: [
                { name: 'Process Injection', severity: 'critical', count: 2 },
                { name: 'Keylogger Pattern', severity: 'critical', count: 1 },
                { name: 'Persistence Mechanism', severity: 'critical', count: 1 },
                { name: 'Encrypted Strings', severity: 'high', count: 4 },
                { name: 'Anti-Debug Check', severity: 'high', count: 2 }
            ]
        },
        'malware-ransomware': {
            fileName: 'important_document.pdf.exe',
            threatOverride: 96,
            statusOverride: 'malware',
            patternsOverride: [
                { name: 'Encryption Routine', severity: 'critical', count: 5 },
                { name: 'File System Access', severity: 'low', count: 15 },
                { name: 'Network Communication', severity: 'medium', count: 3 },
                { name: 'Process Injection', severity: 'critical', count: 1 },
                { name: 'Persistence Mechanism', severity: 'critical', count: 2 },
                { name: 'Anti-Debug Check', severity: 'high', count: 3 }
            ]
        }
    }

    const config = sampleConfigs[sampleId]
    if (!config) {
        return res.status(404).json({ error: 'Sample not found' })
    }

    const result = generateScanResult(config.fileName, Math.floor(Math.random() * 10000000))

    // Override with sample-specific values
    result.threatScore = config.threatOverride
    result.status = config.statusOverride
    result.patterns = config.patternsOverride

    // Update VirusTotal based on threat
    if (config.threatOverride > 60) {
        result.virusTotal.found = true
        result.virusTotal.stats.malicious = Math.floor(config.threatOverride / 3)
        result.virusTotal.stats.suspicious = Math.floor(Math.random() * 5)
    } else if (config.threatOverride > 30) {
        result.virusTotal.found = true
        result.virusTotal.stats.malicious = Math.floor(Math.random() * 5)
        result.virusTotal.stats.suspicious = Math.floor(Math.random() * 3)
    } else {
        result.virusTotal.found = false
        result.virusTotal.stats.malicious = 0
        result.virusTotal.stats.suspicious = 0
    }

    // Save to database
    db.saveScan(result)

    res.json({
        success: true,
        result
    })
})

// Evasion techniques info
app.get('/api/techniques', (req, res) => {
    res.json({
        success: true,
        techniques: [
            { id: 'polymorphic', name: 'Polymorphic Code', risk: 'high', detectMethod: 'Behavioral analysis', description: 'Malware that changes its code each time it replicates' },
            { id: 'metamorphic', name: 'Metamorphic Code', risk: 'critical', detectMethod: 'AI pattern recognition', description: 'Complete code rewriting with each iteration' },
            { id: 'packing', name: 'Packing/Encryption', risk: 'medium', detectMethod: 'Entropy analysis', description: 'Compressing or encrypting malicious payload' },
            { id: 'fileless', name: 'Fileless Malware', risk: 'high', detectMethod: 'Memory scanning', description: 'Operates entirely in memory without files' },
            { id: 'rootkit', name: 'Rootkits', risk: 'critical', detectMethod: 'Low-level scanning', description: 'Hides presence from the operating system' },
            { id: 'sandbox', name: 'Sandbox Evasion', risk: 'high', detectMethod: 'Multi-environment simulation', description: 'Detects analysis environments and delays execution' },
            { id: 'code-injection', name: 'Code Injection', risk: 'critical', detectMethod: 'Process monitoring', description: 'Injects malicious code into legitimate processes' },
            { id: 'living-off-land', name: 'Living Off The Land', risk: 'high', detectMethod: 'Behavior analysis', description: 'Uses legitimate system tools for malicious purposes' }
        ]
    })
})

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'VirusDetect Pro API running', version: '1.0.0' })
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║              VirusDetect Pro Backend Server                   ║
    ║              ☣  Malware Detection API  ☣                     ║
    ╚══════════════════════════════════════════════════════════════╝
    Server running on http://localhost:${PORT}
    `)
})
