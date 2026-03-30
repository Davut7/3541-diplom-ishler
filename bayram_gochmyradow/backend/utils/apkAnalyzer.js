const AdmZip = require('adm-zip');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const { getPermissionInfo, calculateRiskScore } = require('./permissionDatabase');

/**
 * APK Analyzer - Analyzes Android APK files for security issues
 */
class ApkAnalyzer {
    constructor(apkPath) {
        this.apkPath = apkPath;
        this.zip = null;
        this.manifest = null;
        this.resources = null;
    }

    /**
     * Initialize analyzer by reading APK file
     */
    async initialize() {
        try {
            this.zip = new AdmZip(this.apkPath);
            return true;
        } catch (error) {
            throw new Error(`Failed to read APK file: ${error.message}`);
        }
    }

    /**
     * Get basic APK info
     */
    getBasicInfo() {
        const stats = fs.statSync(this.apkPath);
        const entries = this.zip.getEntries();

        let dexCount = 0;
        let nativeLibs = [];
        let hasAssets = false;
        let hasRes = false;

        entries.forEach(entry => {
            if (entry.entryName.endsWith('.dex')) {
                dexCount++;
            }
            if (entry.entryName.startsWith('lib/') && entry.entryName.endsWith('.so')) {
                const libName = path.basename(entry.entryName);
                if (!nativeLibs.includes(libName)) {
                    nativeLibs.push(libName);
                }
            }
            if (entry.entryName.startsWith('assets/')) {
                hasAssets = true;
            }
            if (entry.entryName.startsWith('res/')) {
                hasRes = true;
            }
        });

        return {
            fileName: path.basename(this.apkPath),
            fileSize: stats.size,
            fileSizeFormatted: this.formatFileSize(stats.size),
            totalFiles: entries.length,
            dexCount: dexCount,
            nativeLibraries: nativeLibs,
            hasAssets: hasAssets,
            hasResources: hasRes,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
        };
    }

    /**
     * Parse AndroidManifest.xml (binary XML)
     */
    async parseManifest() {
        try {
            const manifestEntry = this.zip.getEntry('AndroidManifest.xml');
            if (!manifestEntry) {
                throw new Error('AndroidManifest.xml not found in APK');
            }

            const manifestBuffer = manifestEntry.getData();

            // Parse binary Android XML
            const manifestData = this.parseBinaryXml(manifestBuffer);

            return manifestData;
        } catch (error) {
            throw new Error(`Failed to parse manifest: ${error.message}`);
        }
    }

    /**
     * Parse binary Android XML format
     * Note: This is a simplified parser for common manifest elements
     */
    parseBinaryXml(buffer) {
        // Binary XML magic number check
        const magic = buffer.readUInt16LE(0);

        // For demonstration, we'll extract text strings from the binary XML
        // In production, you'd use a proper binary XML parser like 'axml'

        const strings = this.extractStringsFromBinary(buffer);

        // Extract package name
        const packageName = this.findPattern(strings, /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i);

        // Extract permissions
        const permissions = strings.filter(s =>
            s.startsWith('android.permission.') ||
            s.match(/^[a-z]+\.[a-z]+\.permission\./i)
        );

        // Extract version info
        const versionCode = this.findVersionInStrings(strings, 'versionCode');
        const versionName = this.findVersionInStrings(strings, 'versionName') ||
                           strings.find(s => /^\d+\.\d+(\.\d+)?$/.test(s));

        // Extract SDK versions
        const minSdk = this.findNumberAfterPattern(strings, 'minSdkVersion');
        const targetSdk = this.findNumberAfterPattern(strings, 'targetSdkVersion');

        // Extract activities
        const activities = strings.filter(s =>
            s.includes('Activity') &&
            !s.startsWith('android.') &&
            s.includes('.')
        );

        // Extract services
        const services = strings.filter(s =>
            s.includes('Service') &&
            !s.startsWith('android.') &&
            s.includes('.') &&
            !s.includes('permission')
        );

        // Extract receivers
        const receivers = strings.filter(s =>
            s.includes('Receiver') &&
            !s.startsWith('android.') &&
            s.includes('.')
        );

        // Extract providers
        const providers = strings.filter(s =>
            s.includes('Provider') &&
            !s.startsWith('android.') &&
            s.includes('.') &&
            !s.includes('permission')
        );

        // Check for dangerous flags
        const exportedComponents = this.checkExportedComponents(strings);
        const debuggable = strings.includes('debuggable') ||
                          strings.some(s => s.includes('debug'));
        const allowBackup = strings.includes('allowBackup');

        return {
            packageName: packageName || 'Unknown',
            versionCode: versionCode || 'Unknown',
            versionName: versionName || 'Unknown',
            minSdkVersion: minSdk,
            targetSdkVersion: targetSdk,
            permissions: [...new Set(permissions)],
            activities: [...new Set(activities)].slice(0, 20),
            services: [...new Set(services)].slice(0, 10),
            receivers: [...new Set(receivers)].slice(0, 10),
            providers: [...new Set(providers)].slice(0, 10),
            flags: {
                debuggable: debuggable,
                allowBackup: allowBackup,
                hasExportedComponents: exportedComponents.length > 0
            },
            exportedComponents: exportedComponents
        };
    }

    /**
     * Extract readable strings from binary buffer
     */
    extractStringsFromBinary(buffer) {
        const strings = [];
        let currentString = '';
        let consecutiveChars = 0;

        for (let i = 0; i < buffer.length; i++) {
            const byte = buffer[i];

            // Check if printable ASCII or common UTF-8
            if ((byte >= 32 && byte <= 126) || byte === 0) {
                if (byte === 0) {
                    if (currentString.length >= 3) {
                        strings.push(currentString);
                    }
                    currentString = '';
                    consecutiveChars = 0;
                } else {
                    currentString += String.fromCharCode(byte);
                    consecutiveChars++;
                }
            } else {
                if (currentString.length >= 3) {
                    strings.push(currentString);
                }
                currentString = '';
                consecutiveChars = 0;
            }
        }

        if (currentString.length >= 3) {
            strings.push(currentString);
        }

        return [...new Set(strings)];
    }

    /**
     * Find pattern in strings array
     */
    findPattern(strings, pattern) {
        for (const str of strings) {
            if (pattern.test(str) && str.length > 5 && str.length < 100) {
                return str;
            }
        }
        return null;
    }

    /**
     * Find version in strings
     */
    findVersionInStrings(strings, key) {
        const index = strings.indexOf(key);
        if (index !== -1 && index < strings.length - 1) {
            return strings[index + 1];
        }
        return null;
    }

    /**
     * Find number after pattern
     */
    findNumberAfterPattern(strings, pattern) {
        const index = strings.findIndex(s => s.includes(pattern));
        if (index !== -1) {
            for (let i = index; i < Math.min(index + 5, strings.length); i++) {
                const num = parseInt(strings[i]);
                if (!isNaN(num) && num > 0 && num < 100) {
                    return num;
                }
            }
        }
        return null;
    }

    /**
     * Check for exported components
     */
    checkExportedComponents(strings) {
        const exported = [];
        if (strings.includes('exported') || strings.includes('true')) {
            // Look for potentially exported components
            strings.forEach(s => {
                if ((s.includes('Activity') || s.includes('Service') ||
                     s.includes('Receiver') || s.includes('Provider')) &&
                    s.includes('.') && !s.startsWith('android.')) {
                    exported.push(s);
                }
            });
        }
        return exported.slice(0, 10);
    }

    /**
     * Analyze permissions
     */
    analyzePermissions(permissions) {
        const analyzed = permissions.map(perm => getPermissionInfo(perm));

        // Group by risk level
        const byRisk = {
            critical: analyzed.filter(p => p.risk === 'critical'),
            high: analyzed.filter(p => p.risk === 'high'),
            medium: analyzed.filter(p => p.risk === 'medium'),
            low: analyzed.filter(p => p.risk === 'low')
        };

        // Group by category
        const byCategory = {};
        analyzed.forEach(perm => {
            if (!byCategory[perm.category]) {
                byCategory[perm.category] = [];
            }
            byCategory[perm.category].push(perm);
        });

        const riskScore = calculateRiskScore(permissions);

        return {
            total: permissions.length,
            analyzed: analyzed,
            byRisk: byRisk,
            byCategory: byCategory,
            riskScore: riskScore
        };
    }

    /**
     * Perform security analysis
     */
    async performSecurityAnalysis(manifestData, permissionAnalysis, signatureInfo = null) {
        const issues = [];
        const warnings = [];
        const recommendations = [];

        // Check for critical permissions
        if (permissionAnalysis.byRisk.critical.length > 0) {
            issues.push({
                severity: 'critical',
                title: {
                    en: 'Critical Permissions Detected',
                    tk: 'Möhüm rugsatlar tapyldy'
                },
                description: {
                    en: `This app requests ${permissionAnalysis.byRisk.critical.length} critical permission(s) that could pose significant security risks.`,
                    tk: `Bu programma möhüm howpsuzlyk töwekgelçiligine sebäp bolup biljek ${permissionAnalysis.byRisk.critical.length} sany möhüm rugsat soraýar.`
                },
                permissions: permissionAnalysis.byRisk.critical.map(p => p.name)
            });
        }

        // Check for debuggable flag
        if (manifestData.flags.debuggable) {
            issues.push({
                severity: 'high',
                title: {
                    en: 'Application is Debuggable',
                    tk: 'Programma düzedilip bilner'
                },
                description: {
                    en: 'The application has debug mode enabled, which could allow attackers to access sensitive data.',
                    tk: 'Programmada sazlama rejimi açyk, bu hüjümçilere gizlin maglumatlara girmäge mümkinçilik berip biler.'
                }
            });
        }

        // Check for backup flag
        if (manifestData.flags.allowBackup) {
            warnings.push({
                severity: 'medium',
                title: {
                    en: 'Backup Allowed',
                    tk: 'Ätiýaçlyk nusgasy rugsat berilýär'
                },
                description: {
                    en: 'Application data can be backed up via ADB, potentially exposing sensitive information.',
                    tk: 'Programma maglumatlary ADB arkaly ätiýaçlyk nusgasy edilip bilner, bu gizlin maglumatlary açyp biler.'
                }
            });
        }

        // Check for exported components
        if (manifestData.flags.hasExportedComponents) {
            warnings.push({
                severity: 'medium',
                title: {
                    en: 'Exported Components Found',
                    tk: 'Eksport edilen komponentler tapyldy'
                },
                description: {
                    en: `Found ${manifestData.exportedComponents.length} potentially exported component(s) that could be accessed by other apps.`,
                    tk: `Beýleki programmalar tarapyndan elýeterli bolup biljek ${manifestData.exportedComponents.length} sany eksport edilen komponent tapyldy.`
                },
                components: manifestData.exportedComponents
            });
        }

        // Check for low target SDK
        if (manifestData.targetSdkVersion && manifestData.targetSdkVersion < 30) {
            warnings.push({
                severity: 'medium',
                title: {
                    en: 'Low Target SDK Version',
                    tk: 'Pes nyşana SDK wersiýasy'
                },
                description: {
                    en: `Target SDK ${manifestData.targetSdkVersion} is below recommended level (30+). App may lack modern security features.`,
                    tk: `Nyşana SDK ${manifestData.targetSdkVersion} maslahat berilýän derejesinden pes (30+). Programma döwrebap howpsuzlyk aýratynlyklaryndan mahrum bolup biler.`
                }
            });
        }

        // Check for SMS/Call permissions (potential premium SMS malware)
        const smsCallPerms = permissionAnalysis.analyzed.filter(p =>
            p.category === 'SMS' || p.category === 'Phone'
        );
        if (smsCallPerms.length >= 3) {
            issues.push({
                severity: 'high',
                title: {
                    en: 'Excessive SMS/Phone Permissions',
                    tk: 'Artyk SMS/Telefon rugsatlary'
                },
                description: {
                    en: 'This app requests multiple SMS and phone permissions, which could indicate premium SMS or toll fraud malware.',
                    tk: 'Bu programma köp SMS we telefon rugsatlaryny soraýar, bu premium SMS ýa-da töleg galplygy bolup biler.'
                }
            });
        }

        // Check for location + internet (tracking potential)
        const hasLocation = permissionAnalysis.analyzed.some(p => p.category === 'Location');
        const hasInternet = permissionAnalysis.analyzed.some(p => p.category === 'Network');
        if (hasLocation && hasInternet) {
            warnings.push({
                severity: 'low',
                title: {
                    en: 'Location Tracking Capability',
                    tk: 'Ýerleşiş yzarlamasy mümkinçiligi'
                },
                description: {
                    en: 'App can access location and network, enabling potential user tracking.',
                    tk: 'Programma ýerleşiş we tor girelgesine eýe, bu ulanyjyny yzarlamaga mümkinçilik berýär.'
                }
            });
        }

        // Check signature-related issues
        if (signatureInfo) {
            if (!signatureInfo.isSigned) {
                issues.push({
                    severity: 'critical',
                    title: {
                        en: 'APK Not Signed',
                        tk: 'APK Gol Çekilmedik'
                    },
                    description: {
                        en: 'This APK is not digitally signed and will not install on Android devices.',
                        tk: 'Bu APK sanly gol çekilmedik we Android enjamlara gurulmaz.'
                    }
                });
            }

            if (signatureInfo.warnings && signatureInfo.warnings.length > 0) {
                signatureInfo.warnings.forEach(warning => {
                    warnings.push({
                        severity: 'low',
                        title: {
                            en: 'Signature Warning',
                            tk: 'Gol Duýduryşy'
                        },
                        description: warning
                    });
                });
            }
        }

        // Generate recommendations
        if (permissionAnalysis.byRisk.critical.length > 0) {
            recommendations.push({
                en: 'Review why the app needs critical permissions before installing.',
                tk: 'Gurmazdan ozal programmanyň näme üçin möhüm rugsatlary talap edýändigini gözden geçiriň.'
            });
        }

        if (permissionAnalysis.total > 10) {
            recommendations.push({
                en: 'This app requests many permissions. Consider if all are necessary for its function.',
                tk: 'Bu programma köp rugsat soraýar. Funksiýasy üçin hemmesiniň zerurdygyny göz öňünde tutuň.'
            });
        }

        recommendations.push({
            en: 'Always download apps from official stores like Google Play.',
            tk: 'Hemişe programmalary Google Play ýaly resmi dükanlardan ýükläň.'
        });

        recommendations.push({
            en: 'Keep your device and apps updated to receive security patches.',
            tk: 'Howpsuzlyk düzedişlerini almak üçin enjamyňyzy we programmalaryňyzy täzeläň.'
        });

        return {
            issues: issues,
            warnings: warnings,
            recommendations: recommendations,
            overallRisk: permissionAnalysis.riskScore.level,
            riskScore: permissionAnalysis.riskScore.percentage
        };
    }

    /**
     * Check APK signature and certificate information
     */
    checkSignature() {
        const entries = this.zip.getEntries();
        const signatureInfo = {
            isSigned: false,
            signatureVersion: null,
            certificates: [],
            signingSchemes: [],
            warnings: []
        };

        // Check for META-INF signature files
        const metaInfFiles = entries.filter(e => e.entryName.startsWith('META-INF/'));

        // Check for v1 signature (JAR signing)
        const manifestMf = metaInfFiles.find(e => e.entryName === 'META-INF/MANIFEST.MF');
        const certFiles = metaInfFiles.filter(e =>
            e.entryName.endsWith('.SF') ||
            e.entryName.endsWith('.RSA') ||
            e.entryName.endsWith('.DSA') ||
            e.entryName.endsWith('.EC')
        );

        if (certFiles.length > 0) {
            signatureInfo.isSigned = true;
            signatureInfo.signingSchemes.push('v1 (JAR Signature)');

            // Extract certificate info
            certFiles.forEach(certFile => {
                if (certFile.entryName.endsWith('.RSA') ||
                    certFile.entryName.endsWith('.DSA') ||
                    certFile.entryName.endsWith('.EC')) {
                    const certData = certFile.getData();
                    const certInfo = this.parseCertificateInfo(certData, certFile.entryName);
                    if (certInfo) {
                        signatureInfo.certificates.push(certInfo);
                    }
                }
            });
        }

        // Check for APK Signature Scheme v2 or v3
        // These are stored in the APK Signing Block before the ZIP Central Directory
        // For simplified analysis, we check for their presence indicators
        const apkSize = fs.statSync(this.apkPath).size;

        if (apkSize > 1024) {
            try {
                const fd = fs.openSync(this.apkPath, 'r');
                const buffer = Buffer.alloc(24);

                // Read near the end of file looking for APK Signing Block magic
                // The magic is "APK Sig Block 42" at offset -24 from end of signing block
                const positions = [apkSize - 1024, apkSize - 2048, apkSize - 4096];

                for (const pos of positions) {
                    if (pos > 0) {
                        fs.readSync(fd, buffer, 0, 24, pos);
                        const content = buffer.toString('utf8');

                        if (content.includes('APK Sig Block')) {
                            signatureInfo.signingSchemes.push('v2/v3 (APK Signature Scheme)');
                            break;
                        }
                    }
                }

                fs.closeSync(fd);
            } catch (e) {
                // Ignore signature block detection errors
            }
        }

        // Check for potential issues
        if (!signatureInfo.isSigned) {
            signatureInfo.warnings.push({
                en: 'APK is not signed - will not install on Android devices',
                tk: 'APK gol çekilmedi - Android enjamlara gurulmaz'
            });
        }

        if (signatureInfo.signingSchemes.length === 1 &&
            signatureInfo.signingSchemes[0].includes('v1')) {
            signatureInfo.warnings.push({
                en: 'Only v1 signature detected - consider adding v2/v3 signature for better security',
                tk: 'Diňe v1 gol tapyldy - has gowy howpsuzlyk üçin v2/v3 gol goşmagy göz öňünde tutuň'
            });
        }

        return signatureInfo;
    }

    /**
     * Parse certificate information from binary certificate data
     */
    parseCertificateInfo(certData, fileName) {
        try {
            // Extract basic info from certificate name and data
            const certName = path.basename(fileName, path.extname(fileName));

            // Try to find certificate details in the binary data
            const strings = this.extractStringsFromBinary(certData);

            // Look for common certificate fields
            const issuer = strings.find(s => s.includes('CN=') || s.includes('O=') || s.includes('OU='));
            const serial = strings.find(s => /^[0-9a-f]{16,}$/i.test(s));

            // Determine signature algorithm
            let algorithm = 'Unknown';
            if (fileName.endsWith('.RSA')) {
                algorithm = 'RSA';
            } else if (fileName.endsWith('.DSA')) {
                algorithm = 'DSA';
            } else if (fileName.endsWith('.EC')) {
                algorithm = 'ECDSA';
            }

            // Calculate a simplified fingerprint (SHA-256 hash of cert data)
            const crypto = require('crypto');
            const fingerprint = crypto.createHash('sha256').update(certData).digest('hex');
            const formattedFingerprint = fingerprint.toUpperCase().match(/.{2}/g).join(':');

            return {
                name: certName,
                algorithm: algorithm,
                fingerprint: formattedFingerprint.substring(0, 59) + '...',
                issuer: issuer || 'Unknown',
                serialNumber: serial || 'Unknown',
                size: certData.length
            };
        } catch (e) {
            return null;
        }
    }

    /**
     * Full analysis
     */
    async analyze() {
        await this.initialize();

        const basicInfo = this.getBasicInfo();
        const manifestData = await this.parseManifest();
        const permissionAnalysis = this.analyzePermissions(manifestData.permissions);
        const signatureInfo = this.checkSignature();
        const securityAnalysis = await this.performSecurityAnalysis(manifestData, permissionAnalysis, signatureInfo);

        return {
            basicInfo: basicInfo,
            manifest: manifestData,
            permissions: permissionAnalysis,
            signature: signatureInfo,
            security: securityAnalysis,
            analyzedAt: new Date().toISOString()
        };
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let unitIndex = 0;
        let size = bytes;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
}

module.exports = ApkAnalyzer;
