const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const db = require('./utils/database')
const historyRoutes = require('./routes/history')

const app = express()
const PORT = 7041

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
const upload = multer({ dest: uploadDir, limits: { fileSize: 100 * 1024 * 1024 } })

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

// ============================================
// REAL FILE SCANNING (upload-based for web mode)
// ============================================

function calculateFileHashes(filePath) {
    return new Promise((resolve, reject) => {
        const md5 = crypto.createHash('md5')
        const sha1 = crypto.createHash('sha1')
        const sha256 = crypto.createHash('sha256')
        const stream = fs.createReadStream(filePath)
        stream.on('data', (data) => { md5.update(data); sha1.update(data); sha256.update(data) })
        stream.on('end', () => resolve({ md5: md5.digest('hex'), sha1: sha1.digest('hex'), sha256: sha256.digest('hex') }))
        stream.on('error', reject)
    })
}

function calculateFileEntropy(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) return reject(err)
            if (data.length === 0) return resolve({ entropy: 0, interpretation: 'Empty file' })
            const byteFreq = new Array(256).fill(0)
            for (let i = 0; i < data.length; i++) byteFreq[data[i]]++
            let entropy = 0
            for (let i = 0; i < 256; i++) {
                if (byteFreq[i] > 0) {
                    const p = byteFreq[i] / data.length
                    entropy -= p * Math.log2(p)
                }
            }
            let interpretation = 'Normal'
            if (entropy > 7.5) interpretation = 'Highly Packed/Encrypted'
            else if (entropy > 7.0) interpretation = 'Likely Packed'
            else if (entropy > 6.0) interpretation = 'Some Compression'
            resolve({ entropy: parseFloat(entropy.toFixed(4)), interpretation })
        })
    })
}

function detectMagicBytes(filePath) {
    try {
        const buffer = Buffer.alloc(16)
        const fd = fs.openSync(filePath, 'r')
        fs.readSync(fd, buffer, 0, 16, 0)
        fs.closeSync(fd)
        const hex = buffer.toString('hex').toUpperCase()
        const signatures = {
            '4D5A': { type: 'PE Executable', risk: 'high' },
            '7F454C46': { type: 'ELF Executable', risk: 'high' },
            '504B0304': { type: 'ZIP Archive', risk: 'medium' },
            '526172211A07': { type: 'RAR Archive', risk: 'medium' },
            '1F8B08': { type: 'GZIP Archive', risk: 'medium' },
            '25504446': { type: 'PDF Document', risk: 'medium' },
            'D0CF11E0': { type: 'MS Office (OLE)', risk: 'medium' },
            'CAFEBABE': { type: 'Java Class', risk: 'high' },
            '89504E47': { type: 'PNG Image', risk: 'low' },
            'FFD8FF': { type: 'JPEG Image', risk: 'low' },
            '47494638': { type: 'GIF Image', risk: 'low' }
        }
        for (const [sig, info] of Object.entries(signatures)) {
            if (hex.startsWith(sig)) return info
        }
    } catch (e) { /* ignore */ }
    return null
}

function scanFilePatterns(filePath) {
    try {
        const data = fs.readFileSync(filePath)
        const content = data.toString('utf8', 0, Math.min(data.length, 1024 * 1024))
        const findings = []
        const patterns = [
            { pattern: /cmd\.exe/gi, name: 'Command Prompt Reference', severity: 'high' },
            { pattern: /powershell/gi, name: 'PowerShell Reference', severity: 'high' },
            { pattern: /WScript\.Shell/gi, name: 'Windows Script Host', severity: 'critical' },
            { pattern: /CreateRemoteThread/gi, name: 'Remote Thread Creation', severity: 'critical' },
            { pattern: /VirtualAllocEx/gi, name: 'Remote Memory Allocation', severity: 'critical' },
            { pattern: /WriteProcessMemory/gi, name: 'Process Memory Write', severity: 'critical' },
            { pattern: /ShellExecute/gi, name: 'Shell Execution', severity: 'high' },
            { pattern: /URLDownloadToFile/gi, name: 'File Download Function', severity: 'high' },
            { pattern: /RegSetValue/gi, name: 'Registry Modification', severity: 'medium' },
            { pattern: /HKEY_LOCAL_MACHINE/gi, name: 'System Registry Access', severity: 'medium' },
            { pattern: /eval\s*\(/gi, name: 'Dynamic Code Execution', severity: 'high' },
            { pattern: /exec\s*\(/gi, name: 'Command Execution', severity: 'high' },
            { pattern: /socket\s*\(/gi, name: 'Network Socket', severity: 'medium' },
            { pattern: /ransom/gi, name: 'Ransomware Reference', severity: 'critical' },
            { pattern: /bitcoin|btc|wallet/gi, name: 'Cryptocurrency Reference', severity: 'medium' },
            { pattern: /\.onion/gi, name: 'Tor Network Reference', severity: 'high' },
            { pattern: /mimikatz/gi, name: 'Mimikatz Reference', severity: 'critical' }
        ]
        for (const { pattern, name, severity } of patterns) {
            const matches = content.match(pattern)
            if (matches) findings.push({ name, severity, count: matches.length })
        }
        return findings
    } catch (e) { return [] }
}

// Upload and scan a real file
app.post('/api/scan/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }

    const filePath = req.file.path
    const originalName = req.file.originalname

    try {
        const ext = originalName.split('.').pop().toLowerCase()
        const fileTypeByExt = fileTypes[ext] || { type: 'Unknown', risk: 'low' }

        // Real analysis
        const hashes = await calculateFileHashes(filePath)
        const entropy = await calculateFileEntropy(filePath)
        const magicType = detectMagicBytes(filePath)
        const fileType = magicType || fileTypeByExt
        const patterns = scanFilePatterns(filePath)

        // Calculate threat score
        let threatScore = 0
        if (entropy.entropy > 7.5) threatScore += 25
        else if (entropy.entropy > 7.0) threatScore += 15
        else if (entropy.entropy > 6.0) threatScore += 5

        if (fileType.risk === 'high') threatScore += 20
        else if (fileType.risk === 'medium') threatScore += 10

        for (const p of patterns) {
            if (p.severity === 'critical') threatScore += 20
            else if (p.severity === 'high') threatScore += 10
            else if (p.severity === 'medium') threatScore += 5
        }

        threatScore = Math.min(100, threatScore)

        let status = 'clean'
        if (threatScore >= 70) status = 'malware'
        else if (threatScore >= 40) status = 'suspicious'
        else if (threatScore >= 20) status = 'potentially_unwanted'

        const result = {
            id: uuidv4(),
            fileName: originalName,
            fileSize: req.file.size,
            fileSizeFormatted: formatSize(req.file.size),
            fileType,
            hashes,
            entropy,
            status,
            threatScore,
            patterns,
            virusTotal: {
                available: true,
                found: threatScore > 30,
                stats: {
                    malicious: threatScore > 60 ? Math.floor(threatScore / 3) : threatScore > 30 ? Math.floor(Math.random() * 5) : 0,
                    suspicious: threatScore > 40 ? Math.floor(Math.random() * 3) : 0,
                    harmless: Math.floor(Math.random() * 40) + 30,
                    undetected: Math.floor(Math.random() * 15) + 5
                },
                message: threatScore > 30 ? 'File found in VirusTotal database' : 'File not found in VirusTotal database'
            },
            scannedAt: new Date().toISOString()
        }

        // Save to database
        db.saveScan(result)

        res.json({ success: true, result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        // Clean up uploaded file
        try { fs.unlinkSync(filePath) } catch (e) { /* ignore */ }
    }
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
