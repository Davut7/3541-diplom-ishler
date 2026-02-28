const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const ApkAnalyzer = require('../utils/apkAnalyzer');
const db = require('../utils/database');

// Configure multer for APK uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only APK files
    if (file.mimetype === 'application/vnd.android.package-archive' ||
        file.originalname.toLowerCase().endsWith('.apk')) {
        cb(null, true);
    } else {
        cb(new Error('Only APK files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB max
    }
});

/**
 * POST /api/analyze/upload
 * Upload and analyze APK file
 */
router.post('/upload', upload.single('apk'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                message: {
                    en: 'Please upload an APK file',
                    tk: 'APK faýly ýükläň'
                }
            });
        }

        const apkPath = req.file.path;
        const analyzer = new ApkAnalyzer(apkPath);

        console.log(`Analyzing APK: ${req.file.originalname}`);

        const analysisResult = await analyzer.analyze();

        // Generate report ID
        const reportId = uuidv4();

        // Save report to file
        const reportPath = path.join(__dirname, '..', 'reports', `${reportId}.json`);
        fs.writeFileSync(reportPath, JSON.stringify({
            id: reportId,
            originalFileName: req.file.originalname,
            ...analysisResult
        }, null, 2));

        // Save to database
        try {
            db.saveAnalysis(reportId, analysisResult);
            console.log(`Analysis saved to database: ${reportId}`);
        } catch (dbError) {
            console.warn('Could not save to database:', dbError.message);
        }

        // Clean up uploaded file after analysis
        try {
            fs.unlinkSync(apkPath);
        } catch (e) {
            console.warn('Could not delete uploaded file:', e.message);
        }

        res.json({
            success: true,
            reportId: reportId,
            analysis: analysisResult
        });

    } catch (error) {
        console.error('Analysis error:', error);

        // Clean up file on error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {}
        }

        res.status(500).json({
            error: 'Analysis failed',
            message: {
                en: error.message,
                tk: 'Derňew şowsuz boldy: ' + error.message
            }
        });
    }
});

/**
 * GET /api/analyze/report/:id
 * Get analysis report by ID
 */
router.get('/report/:id', (req, res) => {
    try {
        const reportPath = path.join(__dirname, '..', 'reports', `${req.params.id}.json`);

        if (!fs.existsSync(reportPath)) {
            return res.status(404).json({
                error: 'Report not found',
                message: {
                    en: 'Analysis report not found',
                    tk: 'Derňew hasabaty tapylmady'
                }
            });
        }

        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        res.json(report);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve report',
            message: error.message
        });
    }
});

/**
 * GET /api/analyze/demo
 * Get demo analysis for testing
 */
router.get('/demo', (req, res) => {
    const demoAnalysis = {
        success: true,
        reportId: 'demo-report',
        analysis: {
            basicInfo: {
                fileName: 'demo-app.apk',
                fileSize: 15728640,
                fileSizeFormatted: '15.00 MB',
                totalFiles: 1247,
                dexCount: 2,
                nativeLibraries: ['libapp.so', 'libreact.so'],
                hasAssets: true,
                hasResources: true
            },
            manifest: {
                packageName: 'com.example.demoapp',
                versionCode: '15',
                versionName: '2.1.0',
                minSdkVersion: 21,
                targetSdkVersion: 33,
                permissions: [
                    'android.permission.INTERNET',
                    'android.permission.ACCESS_NETWORK_STATE',
                    'android.permission.CAMERA',
                    'android.permission.RECORD_AUDIO',
                    'android.permission.ACCESS_FINE_LOCATION',
                    'android.permission.READ_CONTACTS',
                    'android.permission.WRITE_EXTERNAL_STORAGE',
                    'android.permission.READ_PHONE_STATE',
                    'android.permission.VIBRATE',
                    'android.permission.WAKE_LOCK',
                    'android.permission.RECEIVE_BOOT_COMPLETED',
                    'android.permission.POST_NOTIFICATIONS'
                ],
                activities: [
                    'com.example.demoapp.MainActivity',
                    'com.example.demoapp.LoginActivity',
                    'com.example.demoapp.SettingsActivity'
                ],
                services: [
                    'com.example.demoapp.MyFirebaseService'
                ],
                receivers: [
                    'com.example.demoapp.BootReceiver'
                ],
                providers: [],
                flags: {
                    debuggable: false,
                    allowBackup: true,
                    hasExportedComponents: true
                },
                exportedComponents: ['com.example.demoapp.MainActivity']
            },
            permissions: {
                total: 12,
                byRisk: {
                    critical: [
                        {
                            name: 'android.permission.CAMERA',
                            risk: 'critical',
                            category: 'Camera',
                            description: {
                                en: 'Take pictures and record video',
                                tk: 'Surat almak we wideo ýazgy etmek'
                            }
                        },
                        {
                            name: 'android.permission.RECORD_AUDIO',
                            risk: 'critical',
                            category: 'Microphone',
                            description: {
                                en: 'Record audio',
                                tk: 'Ses ýazgy etmek'
                            }
                        },
                        {
                            name: 'android.permission.ACCESS_FINE_LOCATION',
                            risk: 'critical',
                            category: 'Location',
                            description: {
                                en: 'Access precise location (GPS)',
                                tk: 'Takyk ýerleşişe girmek (GPS)'
                            }
                        }
                    ],
                    high: [
                        {
                            name: 'android.permission.READ_CONTACTS',
                            risk: 'high',
                            category: 'Contacts',
                            description: {
                                en: 'Read your contacts',
                                tk: 'Aragatnaşyklaryňyzy okamak'
                            }
                        },
                        {
                            name: 'android.permission.WRITE_EXTERNAL_STORAGE',
                            risk: 'high',
                            category: 'Storage',
                            description: {
                                en: 'Write to external storage',
                                tk: 'Daşarky ýada ýazmak'
                            }
                        },
                        {
                            name: 'android.permission.READ_PHONE_STATE',
                            risk: 'high',
                            category: 'Phone',
                            description: {
                                en: 'Read phone status and identity',
                                tk: 'Telefonyň ýagdaýyny we şahsyýetini okamak'
                            }
                        }
                    ],
                    medium: [
                        {
                            name: 'android.permission.INTERNET',
                            risk: 'medium',
                            category: 'Network',
                            description: {
                                en: 'Full network access',
                                tk: 'Doly tor girelgesi'
                            }
                        },
                        {
                            name: 'android.permission.RECEIVE_BOOT_COMPLETED',
                            risk: 'medium',
                            category: 'System',
                            description: {
                                en: 'Run at startup',
                                tk: 'Başlangyçda işletmek'
                            }
                        }
                    ],
                    low: [
                        {
                            name: 'android.permission.ACCESS_NETWORK_STATE',
                            risk: 'low',
                            category: 'Network',
                            description: {
                                en: 'View network connections',
                                tk: 'Tor baglanyşyklaryny görmek'
                            }
                        },
                        {
                            name: 'android.permission.VIBRATE',
                            risk: 'low',
                            category: 'System',
                            description: {
                                en: 'Control vibration',
                                tk: 'Titremeany dolandyrmak'
                            }
                        },
                        {
                            name: 'android.permission.WAKE_LOCK',
                            risk: 'low',
                            category: 'System',
                            description: {
                                en: 'Prevent phone from sleeping',
                                tk: 'Telefonyň ýatmagyny öňlemek'
                            }
                        },
                        {
                            name: 'android.permission.POST_NOTIFICATIONS',
                            risk: 'low',
                            category: 'Notifications',
                            description: {
                                en: 'Post notifications',
                                tk: 'Bildirişleri ibermek'
                            }
                        }
                    ]
                },
                riskScore: {
                    score: 125,
                    percentage: 52,
                    level: 'high'
                }
            },
            security: {
                issues: [
                    {
                        severity: 'critical',
                        title: {
                            en: 'Critical Permissions Detected',
                            tk: 'Möhüm rugsatlar tapyldy'
                        },
                        description: {
                            en: 'This app requests 3 critical permission(s) that could pose significant security risks.',
                            tk: 'Bu programma möhüm howpsuzlyk töwekgelçiligine sebäp bolup biljek 3 sany möhüm rugsat soraýar.'
                        },
                        permissions: [
                            'android.permission.CAMERA',
                            'android.permission.RECORD_AUDIO',
                            'android.permission.ACCESS_FINE_LOCATION'
                        ]
                    }
                ],
                warnings: [
                    {
                        severity: 'medium',
                        title: {
                            en: 'Backup Allowed',
                            tk: 'Ätiýaçlyk nusgasy rugsat berilýär'
                        },
                        description: {
                            en: 'Application data can be backed up via ADB, potentially exposing sensitive information.',
                            tk: 'Programma maglumatlary ADB arkaly ätiýaçlyk nusgasy edilip bilner, bu gizlin maglumatlary açyp biler.'
                        }
                    },
                    {
                        severity: 'medium',
                        title: {
                            en: 'Exported Components Found',
                            tk: 'Eksport edilen komponentler tapyldy'
                        },
                        description: {
                            en: 'Found 1 potentially exported component(s) that could be accessed by other apps.',
                            tk: 'Beýleki programmalar tarapyndan elýeterli bolup biljek 1 sany eksport edilen komponent tapyldy.'
                        }
                    },
                    {
                        severity: 'low',
                        title: {
                            en: 'Location Tracking Capability',
                            tk: 'Ýerleşiş yzarlamasy mümkinçiligi'
                        },
                        description: {
                            en: 'App can access location and network, enabling potential user tracking.',
                            tk: 'Programma ýerleşiş we tor girelgesine eýe, bu ulanyjyny yzarlamaga mümkinçilik berýär.'
                        }
                    }
                ],
                recommendations: [
                    {
                        en: 'Review why the app needs critical permissions before installing.',
                        tk: 'Gurmazdan ozal programmanyň näme üçin möhüm rugsatlary talap edýändigini gözden geçiriň.'
                    },
                    {
                        en: 'This app requests many permissions. Consider if all are necessary for its function.',
                        tk: 'Bu programma köp rugsat soraýar. Funksiýasy üçin hemmesiniň zerurdygyny göz öňünde tutuň.'
                    },
                    {
                        en: 'Always download apps from official stores like Google Play.',
                        tk: 'Hemişe programmalary Google Play ýaly resmi dükanlardan ýükläň.'
                    },
                    {
                        en: 'Keep your device and apps updated to receive security patches.',
                        tk: 'Howpsuzlyk düzedişlerini almak üçin enjamyňyzy we programmalaryňyzy täzeläň.'
                    }
                ],
                overallRisk: 'high',
                riskScore: 52
            },
            analyzedAt: new Date().toISOString()
        }
    };

    res.json(demoAnalysis);
});

/**
 * GET /api/analyze/samples
 * Get list of sample APKs for testing
 */
router.get('/samples', (req, res) => {
    const samples = [
        {
            id: 'safe-app',
            name: 'Calculator Pro',
            type: 'safe',
            description: {
                en: 'A simple calculator app with minimal permissions',
                tk: 'Minimal rugsatly ýönekeý kalkulýator programmasy'
            },
            riskLevel: 'low',
            icon: 'pi-calculator'
        },
        {
            id: 'medium-app',
            name: 'Social Media App',
            type: 'medium',
            description: {
                en: 'Social app with camera and location access',
                tk: 'Kamera we ýerleşiş girelgeli sosial programma'
            },
            riskLevel: 'medium',
            icon: 'pi-users'
        },
        {
            id: 'suspicious-app',
            name: 'Free VPN Unlimited',
            type: 'suspicious',
            description: {
                en: 'VPN app requesting excessive permissions',
                tk: 'Artyk rugsatlar talap edýän VPN programmasy'
            },
            riskLevel: 'high',
            icon: 'pi-shield'
        },
        {
            id: 'malware-app',
            name: 'FlashLight_FREE.apk',
            type: 'malware',
            description: {
                en: 'Fake flashlight app - potential malware with SMS/call access',
                tk: 'Galp çyra programmasy - SMS/jaň girelgeli mümkin zyýanly programma'
            },
            riskLevel: 'critical',
            icon: 'pi-bolt'
        }
    ];
    res.json(samples);
});

/**
 * GET /api/analyze/sample/:id
 * Get sample analysis by ID
 */
router.get('/sample/:id', (req, res) => {
    const sampleId = req.params.id;

    const samples = {
        'safe-app': {
            success: true,
            reportId: 'sample-safe',
            analysis: {
                basicInfo: {
                    fileName: 'calculator-pro.apk',
                    fileSize: 2097152,
                    fileSizeFormatted: '2.00 MB',
                    totalFiles: 156,
                    dexCount: 1,
                    nativeLibraries: [],
                    hasAssets: true,
                    hasResources: true
                },
                manifest: {
                    packageName: 'com.safe.calculator',
                    versionCode: '10',
                    versionName: '1.2.0',
                    minSdkVersion: 21,
                    targetSdkVersion: 34,
                    permissions: [
                        'android.permission.VIBRATE'
                    ],
                    activities: ['com.safe.calculator.MainActivity'],
                    services: [],
                    receivers: [],
                    providers: [],
                    flags: {
                        debuggable: false,
                        allowBackup: false,
                        hasExportedComponents: false
                    },
                    exportedComponents: []
                },
                permissions: {
                    total: 1,
                    byRisk: {
                        critical: [],
                        high: [],
                        medium: [],
                        low: [{
                            name: 'android.permission.VIBRATE',
                            risk: 'low',
                            category: 'System',
                            description: { en: 'Control vibration', tk: 'Titremeany dolandyrmak' }
                        }]
                    },
                    riskScore: { score: 1, percentage: 3, level: 'low' }
                },
                security: {
                    issues: [],
                    warnings: [],
                    recommendations: [
                        { en: 'This app appears safe with minimal permissions.', tk: 'Bu programma minimal rugsatlar bilen howpsuz görünýär.' },
                        { en: 'Always download apps from official stores.', tk: 'Hemişe programmalary resmi dükanlardan ýükläň.' }
                    ],
                    overallRisk: 'low',
                    riskScore: 3
                },
                analyzedAt: new Date().toISOString()
            }
        },
        'medium-app': {
            success: true,
            reportId: 'sample-medium',
            analysis: {
                basicInfo: {
                    fileName: 'social-media.apk',
                    fileSize: 52428800,
                    fileSizeFormatted: '50.00 MB',
                    totalFiles: 2847,
                    dexCount: 3,
                    nativeLibraries: ['libsocial.so'],
                    hasAssets: true,
                    hasResources: true
                },
                manifest: {
                    packageName: 'com.social.media.app',
                    versionCode: '245',
                    versionName: '5.2.1',
                    minSdkVersion: 23,
                    targetSdkVersion: 34,
                    permissions: [
                        'android.permission.INTERNET',
                        'android.permission.ACCESS_NETWORK_STATE',
                        'android.permission.CAMERA',
                        'android.permission.RECORD_AUDIO',
                        'android.permission.READ_EXTERNAL_STORAGE',
                        'android.permission.WRITE_EXTERNAL_STORAGE',
                        'android.permission.ACCESS_FINE_LOCATION',
                        'android.permission.POST_NOTIFICATIONS',
                        'android.permission.VIBRATE'
                    ],
                    activities: ['com.social.MainActivity', 'com.social.CameraActivity', 'com.social.ChatActivity'],
                    services: ['com.social.MessagingService'],
                    receivers: ['com.social.NotificationReceiver'],
                    providers: [],
                    flags: {
                        debuggable: false,
                        allowBackup: true,
                        hasExportedComponents: true
                    },
                    exportedComponents: ['com.social.ShareActivity']
                },
                permissions: {
                    total: 9,
                    byRisk: {
                        critical: [
                            { name: 'android.permission.CAMERA', risk: 'critical', category: 'Camera', description: { en: 'Take pictures and record video', tk: 'Surat almak we wideo ýazgy etmek' } },
                            { name: 'android.permission.RECORD_AUDIO', risk: 'critical', category: 'Microphone', description: { en: 'Record audio', tk: 'Ses ýazgy etmek' } },
                            { name: 'android.permission.ACCESS_FINE_LOCATION', risk: 'critical', category: 'Location', description: { en: 'Access precise location (GPS)', tk: 'Takyk ýerleşişe girmek (GPS)' } }
                        ],
                        high: [
                            { name: 'android.permission.READ_EXTERNAL_STORAGE', risk: 'high', category: 'Storage', description: { en: 'Read external storage', tk: 'Daşarky ýady okamak' } },
                            { name: 'android.permission.WRITE_EXTERNAL_STORAGE', risk: 'high', category: 'Storage', description: { en: 'Write to external storage', tk: 'Daşarky ýada ýazmak' } }
                        ],
                        medium: [
                            { name: 'android.permission.INTERNET', risk: 'medium', category: 'Network', description: { en: 'Full network access', tk: 'Doly tor girelgesi' } }
                        ],
                        low: [
                            { name: 'android.permission.ACCESS_NETWORK_STATE', risk: 'low', category: 'Network', description: { en: 'View network connections', tk: 'Tor baglanyşyklaryny görmek' } },
                            { name: 'android.permission.POST_NOTIFICATIONS', risk: 'low', category: 'Notifications', description: { en: 'Post notifications', tk: 'Bildirişleri ibermek' } },
                            { name: 'android.permission.VIBRATE', risk: 'low', category: 'System', description: { en: 'Control vibration', tk: 'Titremeany dolandyrmak' } }
                        ]
                    },
                    riskScore: { score: 126, percentage: 47, level: 'medium' }
                },
                security: {
                    issues: [],
                    warnings: [
                        { severity: 'medium', title: { en: 'Backup Allowed', tk: 'Ätiýaçlyk nusgasy rugsat berilýär' }, description: { en: 'Application data can be backed up via ADB.', tk: 'Programma maglumatlary ADB arkaly ätiýaçlyk nusgasy edilip bilner.' } },
                        { severity: 'low', title: { en: 'Location Tracking Capability', tk: 'Ýerleşiş yzarlamasy mümkinçiligi' }, description: { en: 'App can access location and network.', tk: 'Programma ýerleşiş we tor girelgesine eýe.' } }
                    ],
                    recommendations: [
                        { en: 'Camera and microphone access is typical for social media apps.', tk: 'Kamera we mikrofon girelgesi sosial programmalara mahsus.' },
                        { en: 'Review location permissions if not needed for app functionality.', tk: 'Programma funksiýasy üçin zerur bolmasa ýerleşiş rugsatlaryny gözden geçiriň.' }
                    ],
                    overallRisk: 'medium',
                    riskScore: 47
                },
                analyzedAt: new Date().toISOString()
            }
        },
        'suspicious-app': {
            success: true,
            reportId: 'sample-suspicious',
            analysis: {
                basicInfo: {
                    fileName: 'free-vpn-unlimited.apk',
                    fileSize: 8388608,
                    fileSizeFormatted: '8.00 MB',
                    totalFiles: 534,
                    dexCount: 2,
                    nativeLibraries: ['libvpn.so', 'libcrypto.so'],
                    hasAssets: true,
                    hasResources: true
                },
                manifest: {
                    packageName: 'com.free.vpn.unlimited.proxy',
                    versionCode: '89',
                    versionName: '3.4.5',
                    minSdkVersion: 21,
                    targetSdkVersion: 28,
                    permissions: [
                        'android.permission.INTERNET',
                        'android.permission.ACCESS_NETWORK_STATE',
                        'android.permission.ACCESS_WIFI_STATE',
                        'android.permission.CHANGE_NETWORK_STATE',
                        'android.permission.READ_PHONE_STATE',
                        'android.permission.ACCESS_FINE_LOCATION',
                        'android.permission.ACCESS_COARSE_LOCATION',
                        'android.permission.READ_CONTACTS',
                        'android.permission.RECEIVE_BOOT_COMPLETED',
                        'android.permission.FOREGROUND_SERVICE',
                        'android.permission.REQUEST_INSTALL_PACKAGES',
                        'android.permission.QUERY_ALL_PACKAGES'
                    ],
                    activities: ['com.free.vpn.MainActivity', 'com.free.vpn.AdsActivity'],
                    services: ['com.free.vpn.VpnService', 'com.free.vpn.BackgroundService'],
                    receivers: ['com.free.vpn.BootReceiver', 'com.free.vpn.PackageReceiver'],
                    providers: [],
                    flags: {
                        debuggable: false,
                        allowBackup: true,
                        hasExportedComponents: true
                    },
                    exportedComponents: ['com.free.vpn.DeepLinkActivity']
                },
                permissions: {
                    total: 12,
                    byRisk: {
                        critical: [
                            { name: 'android.permission.ACCESS_FINE_LOCATION', risk: 'critical', category: 'Location', description: { en: 'Access precise location (GPS)', tk: 'Takyk ýerleşişe girmek (GPS)' } },
                            { name: 'android.permission.REQUEST_INSTALL_PACKAGES', risk: 'critical', category: 'System', description: { en: 'Request install packages', tk: 'Paketleri gurnamagy haýyş etmek' } }
                        ],
                        high: [
                            { name: 'android.permission.READ_PHONE_STATE', risk: 'high', category: 'Phone', description: { en: 'Read phone status and identity', tk: 'Telefonyň ýagdaýyny we şahsyýetini okamak' } },
                            { name: 'android.permission.ACCESS_COARSE_LOCATION', risk: 'high', category: 'Location', description: { en: 'Access approximate location', tk: 'Takmynan ýerleşişe girmek' } },
                            { name: 'android.permission.READ_CONTACTS', risk: 'high', category: 'Contacts', description: { en: 'Read your contacts', tk: 'Aragatnaşyklaryňyzy okamak' } }
                        ],
                        medium: [
                            { name: 'android.permission.INTERNET', risk: 'medium', category: 'Network', description: { en: 'Full network access', tk: 'Doly tor girelgesi' } },
                            { name: 'android.permission.CHANGE_NETWORK_STATE', risk: 'medium', category: 'Network', description: { en: 'Change network connectivity', tk: 'Tor baglanyşygyny üýtgetmek' } },
                            { name: 'android.permission.RECEIVE_BOOT_COMPLETED', risk: 'medium', category: 'System', description: { en: 'Run at startup', tk: 'Başlangyçda işletmek' } },
                            { name: 'android.permission.QUERY_ALL_PACKAGES', risk: 'medium', category: 'System', description: { en: 'Query all installed packages', tk: 'Gurlan ähli paketleri soramak' } }
                        ],
                        low: [
                            { name: 'android.permission.ACCESS_NETWORK_STATE', risk: 'low', category: 'Network', description: { en: 'View network connections', tk: 'Tor baglanyşyklaryny görmek' } },
                            { name: 'android.permission.ACCESS_WIFI_STATE', risk: 'low', category: 'Network', description: { en: 'View Wi-Fi connections', tk: 'Wi-Fi baglanyşyklaryny görmek' } },
                            { name: 'android.permission.FOREGROUND_SERVICE', risk: 'low', category: 'System', description: { en: 'Run foreground service', tk: 'Öň planda hyzmat işletmek' } }
                        ]
                    },
                    riskScore: { score: 155, percentage: 68, level: 'high' }
                },
                security: {
                    issues: [
                        { severity: 'high', title: { en: 'Suspicious Permission Combination', tk: 'Şübheli rugsat kombinasiýasy' }, description: { en: 'VPN app requests contacts and location - unusual for VPN functionality.', tk: 'VPN programmasy aragatnaşyklary we ýerleşişi soraýar - VPN funksiýasy üçin adaty däl.' } },
                        { severity: 'high', title: { en: 'Can Install Other Apps', tk: 'Beýleki programmalary gurnap bilýär' }, description: { en: 'App can request to install other packages - potential for malware distribution.', tk: 'Programma beýleki paketleri gurnamagy haýyş edip biler - zyýanly programma ýaýratmak mümkinçiligi.' } }
                    ],
                    warnings: [
                        { severity: 'medium', title: { en: 'Low Target SDK', tk: 'Pes nyşana SDK' }, description: { en: 'Target SDK 28 is outdated. App may lack modern security features.', tk: 'Nyşana SDK 28 köneldi. Programma döwrebap howpsuzlyk aýratynlyklaryndan mahrum bolup biler.' } },
                        { severity: 'medium', title: { en: 'Runs at Boot', tk: 'Başlangyçda işleýär' }, description: { en: 'App starts automatically when device boots.', tk: 'Enjam açylanda programma awtomatik başlaýar.' } },
                        { severity: 'medium', title: { en: 'Queries All Packages', tk: 'Ähli paketleri soraýar' }, description: { en: 'App can see all installed apps on device.', tk: 'Programma enjamda gurlan ähli programmalary görüp bilýär.' } }
                    ],
                    recommendations: [
                        { en: 'WARNING: This app requests permissions unusual for a VPN.', tk: 'DUÝDURYŞ: Bu programma VPN üçin adaty däl rugsatlar soraýar.' },
                        { en: 'Do NOT install this app - high risk of data theft.', tk: 'Bu programmany gurmaň - maglumat ogurlygy töwekgelçiligi ýokary.' },
                        { en: 'Use trusted VPN services from reputable companies.', tk: 'Abraýly kompaniýalardan ygtybarly VPN hyzmatlaryny ulanyň.' }
                    ],
                    overallRisk: 'high',
                    riskScore: 68
                },
                analyzedAt: new Date().toISOString()
            }
        },
        'malware-app': {
            success: true,
            reportId: 'sample-malware',
            analysis: {
                basicInfo: {
                    fileName: 'FlashLight_FREE_v2.3.apk',
                    fileSize: 3145728,
                    fileSizeFormatted: '3.00 MB',
                    totalFiles: 289,
                    dexCount: 2,
                    nativeLibraries: ['libhook.so'],
                    hasAssets: true,
                    hasResources: true
                },
                manifest: {
                    packageName: 'com.flashlight.free.bright.torch',
                    versionCode: '23',
                    versionName: '2.3.0',
                    minSdkVersion: 16,
                    targetSdkVersion: 22,
                    permissions: [
                        'android.permission.CAMERA',
                        'android.permission.FLASHLIGHT',
                        'android.permission.INTERNET',
                        'android.permission.ACCESS_NETWORK_STATE',
                        'android.permission.SEND_SMS',
                        'android.permission.RECEIVE_SMS',
                        'android.permission.READ_SMS',
                        'android.permission.CALL_PHONE',
                        'android.permission.READ_CALL_LOG',
                        'android.permission.PROCESS_OUTGOING_CALLS',
                        'android.permission.READ_CONTACTS',
                        'android.permission.WRITE_CONTACTS',
                        'android.permission.READ_PHONE_STATE',
                        'android.permission.READ_PHONE_NUMBERS',
                        'android.permission.ACCESS_FINE_LOCATION',
                        'android.permission.ACCESS_BACKGROUND_LOCATION',
                        'android.permission.RECORD_AUDIO',
                        'android.permission.READ_EXTERNAL_STORAGE',
                        'android.permission.WRITE_EXTERNAL_STORAGE',
                        'android.permission.RECEIVE_BOOT_COMPLETED',
                        'android.permission.SYSTEM_ALERT_WINDOW',
                        'android.permission.REQUEST_INSTALL_PACKAGES',
                        'android.permission.BIND_ACCESSIBILITY_SERVICE',
                        'android.permission.BIND_DEVICE_ADMIN'
                    ],
                    activities: ['com.flashlight.MainActivity', 'com.flashlight.HiddenActivity'],
                    services: ['com.flashlight.SmsService', 'com.flashlight.CallService', 'com.flashlight.TrackingService'],
                    receivers: ['com.flashlight.SmsReceiver', 'com.flashlight.CallReceiver', 'com.flashlight.BootReceiver', 'com.flashlight.AdminReceiver'],
                    providers: ['com.flashlight.DataProvider'],
                    flags: {
                        debuggable: true,
                        allowBackup: true,
                        hasExportedComponents: true
                    },
                    exportedComponents: ['com.flashlight.SmsReceiver', 'com.flashlight.CallReceiver']
                },
                permissions: {
                    total: 24,
                    byRisk: {
                        critical: [
                            { name: 'android.permission.SEND_SMS', risk: 'critical', category: 'SMS', description: { en: 'Send SMS messages (can cost money)', tk: 'SMS habarlaryny ibermek (pul çykdajy edip biler)' } },
                            { name: 'android.permission.RECEIVE_SMS', risk: 'critical', category: 'SMS', description: { en: 'Receive SMS messages', tk: 'SMS habarlaryny almak' } },
                            { name: 'android.permission.READ_SMS', risk: 'critical', category: 'SMS', description: { en: 'Read SMS messages', tk: 'SMS habarlaryny okamak' } },
                            { name: 'android.permission.CALL_PHONE', risk: 'critical', category: 'Phone', description: { en: 'Make phone calls directly', tk: 'Göni telefon jaňlaryny etmek' } },
                            { name: 'android.permission.READ_CALL_LOG', risk: 'critical', category: 'Phone', description: { en: 'Read call log', tk: 'Jaň ýazgylaryny okamak' } },
                            { name: 'android.permission.PROCESS_OUTGOING_CALLS', risk: 'critical', category: 'Phone', description: { en: 'Reroute outgoing calls', tk: 'Gidýän jaňlary täzeden ugratmak' } },
                            { name: 'android.permission.ACCESS_FINE_LOCATION', risk: 'critical', category: 'Location', description: { en: 'Access precise location (GPS)', tk: 'Takyk ýerleşişe girmek (GPS)' } },
                            { name: 'android.permission.ACCESS_BACKGROUND_LOCATION', risk: 'critical', category: 'Location', description: { en: 'Access location in background', tk: 'Arka fonunda ýerleşişe girmek' } },
                            { name: 'android.permission.RECORD_AUDIO', risk: 'critical', category: 'Microphone', description: { en: 'Record audio (can spy on conversations)', tk: 'Ses ýazgy etmek (gürrüňleri diňläp biler)' } },
                            { name: 'android.permission.CAMERA', risk: 'critical', category: 'Camera', description: { en: 'Take pictures and record video', tk: 'Surat almak we wideo ýazgy etmek' } },
                            { name: 'android.permission.SYSTEM_ALERT_WINDOW', risk: 'critical', category: 'System', description: { en: 'Display over other apps (overlay attacks)', tk: 'Beýleki programmalaryň üstünde görkezmek' } },
                            { name: 'android.permission.REQUEST_INSTALL_PACKAGES', risk: 'critical', category: 'System', description: { en: 'Request install packages', tk: 'Paketleri gurnamagy haýyş etmek' } },
                            { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', risk: 'critical', category: 'System', description: { en: 'Accessibility service (can read screen)', tk: 'Elýeterlilik hyzmaty (ekrany okap bilýär)' } },
                            { name: 'android.permission.BIND_DEVICE_ADMIN', risk: 'critical', category: 'System', description: { en: 'Device administrator (full control)', tk: 'Enjam dolandyryjysy (doly gözegçilik)' } }
                        ],
                        high: [
                            { name: 'android.permission.READ_CONTACTS', risk: 'high', category: 'Contacts', description: { en: 'Read your contacts', tk: 'Aragatnaşyklaryňyzy okamak' } },
                            { name: 'android.permission.WRITE_CONTACTS', risk: 'high', category: 'Contacts', description: { en: 'Modify your contacts', tk: 'Aragatnaşyklaryňyzy üýtgetmek' } },
                            { name: 'android.permission.READ_PHONE_STATE', risk: 'high', category: 'Phone', description: { en: 'Read phone status and identity', tk: 'Telefonyň ýagdaýyny we şahsyýetini okamak' } },
                            { name: 'android.permission.READ_PHONE_NUMBERS', risk: 'high', category: 'Phone', description: { en: 'Read phone numbers', tk: 'Telefon belgilerini okamak' } },
                            { name: 'android.permission.READ_EXTERNAL_STORAGE', risk: 'high', category: 'Storage', description: { en: 'Read all your files', tk: 'Ähli faýllaryňyzy okamak' } },
                            { name: 'android.permission.WRITE_EXTERNAL_STORAGE', risk: 'high', category: 'Storage', description: { en: 'Modify/delete your files', tk: 'Faýllaryňyzy üýtgetmek/pozmak' } }
                        ],
                        medium: [
                            { name: 'android.permission.INTERNET', risk: 'medium', category: 'Network', description: { en: 'Full network access', tk: 'Doly tor girelgesi' } },
                            { name: 'android.permission.RECEIVE_BOOT_COMPLETED', risk: 'medium', category: 'System', description: { en: 'Run at startup', tk: 'Başlangyçda işletmek' } }
                        ],
                        low: [
                            { name: 'android.permission.ACCESS_NETWORK_STATE', risk: 'low', category: 'Network', description: { en: 'View network connections', tk: 'Tor baglanyşyklaryny görmek' } },
                            { name: 'android.permission.FLASHLIGHT', risk: 'low', category: 'Hardware', description: { en: 'Control flashlight', tk: 'Çyrany dolandyrmak' } }
                        ]
                    },
                    riskScore: { score: 520, percentage: 96, level: 'critical' }
                },
                security: {
                    issues: [
                        { severity: 'critical', title: { en: '🚨 MALWARE DETECTED: SMS Trojan', tk: '🚨 ZYÝANLY PROGRAMMA TAPYLDY: SMS Troýan' }, description: { en: 'This app can send, receive, and read SMS - typical behavior of premium SMS malware that charges money.', tk: 'Bu programma SMS iberip, alyp we okap bilýär - pul alýan premium SMS zyýanly programmasynyň adaty aýratynlygy.' } },
                        { severity: 'critical', title: { en: '🚨 SPYWARE CAPABILITIES', tk: '🚨 IÇALY PROGRAMMA MÜMKINÇILIKLERI' }, description: { en: 'App can record audio, access camera, track location in background, and read all your messages and calls.', tk: 'Programma ses ýazyp, kamera girip, arka fonunda ýerleşişi yzarlap we ähli habarlaryňyzy we jaňlaryňyzy okap bilýär.' } },
                        { severity: 'critical', title: { en: '🚨 DEVICE ADMIN REQUEST', tk: '🚨 ENJAM DOLANDYRYJYSY SORAGY' }, description: { en: 'App requests device administrator rights - can lock your phone and wipe data.', tk: 'Programma enjam dolandyryjysy hukuklaryny soraýar - telefonyňyzy gulplap we maglumatlary pozup biler.' } },
                        { severity: 'critical', title: { en: '🚨 ACCESSIBILITY ABUSE', tk: '🚨 ELÝETERLILIK HYZMATY HYÝANATÇYLYGY' }, description: { en: 'Accessibility service can read everything on screen including passwords.', tk: 'Elýeterlilik hyzmaty parollar bilen birlikde ekrandaky ähli zady okap bilýär.' } },
                        { severity: 'high', title: { en: 'Application is Debuggable', tk: 'Programma düzedilip bilner' }, description: { en: 'Debug mode enabled - sign of malicious or poorly developed app.', tk: 'Sazlama rejimi açyk - zyýanly ýa-da pes hilli programmanyň alamaty.' } }
                    ],
                    warnings: [
                        { severity: 'high', title: { en: 'Extremely Low Target SDK', tk: 'Örän pes nyşana SDK' }, description: { en: 'Target SDK 22 bypasses Android security features. Very suspicious.', tk: 'Nyşana SDK 22 Android howpsuzlyk aýratynlyklaryny aýlanyp geçýär. Örän şübheli.' } },
                        { severity: 'high', title: { en: 'Excessive Permissions for Flashlight', tk: 'Çyra üçin artyk rugsatlar' }, description: { en: 'A flashlight app should only need camera permission, not SMS, calls, contacts, etc.', tk: 'Çyra programmasy diňe kamera rugsadyna mätäç, SMS, jaňlar, aragatnaşyklar däl.' } }
                    ],
                    recommendations: [
                        { en: '⛔ DO NOT INSTALL - This is MALWARE!', tk: '⛔ GURMAŇ - Bu ZYÝANLY PROGRAMMADYR!' },
                        { en: '⛔ If installed, REMOVE IMMEDIATELY and change all passwords.', tk: '⛔ Eger gurlan bolsa, DERREW AÝYRYŇ we ähli parollary üýtgediň.' },
                        { en: '⛔ Check your phone bill for unauthorized premium SMS charges.', tk: '⛔ Telefon hasabyňyzy rugsat berilmedik premium SMS tölegleri üçin barlaň.' },
                        { en: '⛔ Run antivirus scan on your device.', tk: '⛔ Enjamyňyzda antiwirus barlagyny geçiriň.' },
                        { en: '⛔ Report this app to Google Play if found there.', tk: '⛔ Bu programmany Google Play-de tapylsa habar beriň.' }
                    ],
                    overallRisk: 'critical',
                    riskScore: 96
                },
                analyzedAt: new Date().toISOString()
            }
        }
    };

    if (samples[sampleId]) {
        res.json(samples[sampleId]);
    } else {
        res.status(404).json({ error: 'Sample not found' });
    }
});

/**
 * GET /api/analyze/permissions
 * Get list of all known permissions
 */
router.get('/permissions', (req, res) => {
    const { getAllPermissions } = require('../utils/permissionDatabase');
    res.json(getAllPermissions());
});

/**
 * DELETE /api/analyze/report/:id
 * Delete a report
 */
router.delete('/report/:id', (req, res) => {
    try {
        const reportPath = path.join(__dirname, '..', 'reports', `${req.params.id}.json`);

        if (!fs.existsSync(reportPath)) {
            return res.status(404).json({
                error: 'Report not found'
            });
        }

        fs.unlinkSync(reportPath);
        res.json({ success: true, message: 'Report deleted' });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete report',
            message: error.message
        });
    }
});

// Error handler for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: {
                    en: 'File size exceeds 500MB limit',
                    tk: 'Faýlyň ölçegi 500MB çäkden geçýär'
                }
            });
        }
    }
    next(error);
});

module.exports = router;
