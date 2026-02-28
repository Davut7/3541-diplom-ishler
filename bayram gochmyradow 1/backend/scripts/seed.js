/**
 * Seed script to populate database with demo analysis data
 * Run with: node scripts/seed.js
 */

const { initDb, clearHistory, saveAnalysis, getStatistics } = require('../utils/database');

const demoAnalyses = [
    {
        id: 'demo-calculator-001',
        analysis: {
            basicInfo: {
                fileName: 'Calculator_Pro_v2.1.apk',
                fileSize: 2097152,
                fileSizeFormatted: '2.00 MB',
                totalFiles: 156,
                dexCount: 1,
                nativeLibraries: [],
                hasAssets: true,
                hasResources: true
            },
            manifest: {
                packageName: 'com.calculator.pro',
                versionCode: '10',
                versionName: '2.1.0',
                minSdkVersion: 21,
                targetSdkVersion: 34,
                permissions: ['android.permission.VIBRATE'],
                activities: ['com.calculator.MainActivity'],
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
                    { en: 'This app appears safe with minimal permissions.', tk: 'Bu programma minimal rugsatlar bilen howpsuz görünýär.' }
                ],
                overallRisk: 'low',
                riskScore: 3
            },
            analyzedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        }
    },
    {
        id: 'demo-social-002',
        analysis: {
            basicInfo: {
                fileName: 'Social_Media_v5.4.apk',
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
                versionName: '5.4.0',
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
                activities: ['com.social.MainActivity', 'com.social.CameraActivity'],
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
                    { severity: 'medium', title: { en: 'Backup Allowed', tk: 'Ätiýaçlyk nusgasy rugsat berilýär' }, description: { en: 'Application data can be backed up via ADB.', tk: 'Programma maglumatlary ADB arkaly ätiýaçlyk nusgasy edilip bilner.' } }
                ],
                recommendations: [
                    { en: 'Camera and microphone access is typical for social media apps.', tk: 'Kamera we mikrofon girelgesi sosial programmalara mahsus.' }
                ],
                overallRisk: 'medium',
                riskScore: 47
            },
            analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        }
    },
    {
        id: 'demo-vpn-003',
        analysis: {
            basicInfo: {
                fileName: 'Free_VPN_Pro_v1.8.apk',
                fileSize: 8388608,
                fileSizeFormatted: '8.00 MB',
                totalFiles: 534,
                dexCount: 2,
                nativeLibraries: ['libvpn.so'],
                hasAssets: true,
                hasResources: true
            },
            manifest: {
                packageName: 'com.free.vpn.unlimited',
                versionCode: '89',
                versionName: '1.8.0',
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
                    'android.permission.REQUEST_INSTALL_PACKAGES'
                ],
                activities: ['com.free.vpn.MainActivity', 'com.free.vpn.AdsActivity'],
                services: ['com.free.vpn.VpnService', 'com.free.vpn.BackgroundService'],
                receivers: ['com.free.vpn.BootReceiver'],
                providers: [],
                flags: {
                    debuggable: false,
                    allowBackup: true,
                    hasExportedComponents: true
                },
                exportedComponents: ['com.free.vpn.DeepLinkActivity']
            },
            permissions: {
                total: 10,
                byRisk: {
                    critical: [
                        { name: 'android.permission.ACCESS_FINE_LOCATION', risk: 'critical', category: 'Location', description: { en: 'Access precise location (GPS)', tk: 'Takyk ýerleşişe girmek (GPS)' } },
                        { name: 'android.permission.REQUEST_INSTALL_PACKAGES', risk: 'critical', category: 'System', description: { en: 'Request install packages', tk: 'Paketleri gurnamagy haýyş etmek' } }
                    ],
                    high: [
                        { name: 'android.permission.READ_PHONE_STATE', risk: 'high', category: 'Phone', description: { en: 'Read phone status and identity', tk: 'Telefonyň ýagdaýyny we şahsyýetini okamak' } },
                        { name: 'android.permission.READ_CONTACTS', risk: 'high', category: 'Contacts', description: { en: 'Read your contacts', tk: 'Aragatnaşyklaryňyzy okamak' } }
                    ],
                    medium: [
                        { name: 'android.permission.INTERNET', risk: 'medium', category: 'Network', description: { en: 'Full network access', tk: 'Doly tor girelgesi' } },
                        { name: 'android.permission.CHANGE_NETWORK_STATE', risk: 'medium', category: 'Network', description: { en: 'Change network connectivity', tk: 'Tor baglanyşygyny üýtgetmek' } },
                        { name: 'android.permission.RECEIVE_BOOT_COMPLETED', risk: 'medium', category: 'System', description: { en: 'Run at startup', tk: 'Başlangyçda işletmek' } }
                    ],
                    low: [
                        { name: 'android.permission.ACCESS_NETWORK_STATE', risk: 'low', category: 'Network', description: { en: 'View network connections', tk: 'Tor baglanyşyklaryny görmek' } },
                        { name: 'android.permission.ACCESS_WIFI_STATE', risk: 'low', category: 'Network', description: { en: 'View Wi-Fi connections', tk: 'Wi-Fi baglanyşyklaryny görmek' } }
                    ]
                },
                riskScore: { score: 155, percentage: 68, level: 'high' }
            },
            security: {
                issues: [
                    { severity: 'high', title: { en: 'Suspicious Permission Combination', tk: 'Şübheli rugsat kombinasiýasy' }, description: { en: 'VPN app requests contacts and location - unusual for VPN functionality.', tk: 'VPN programmasy aragatnaşyklary we ýerleşişi soraýar - VPN funksiýasy üçin adaty däl.' } },
                    { severity: 'high', title: { en: 'Can Install Other Apps', tk: 'Beýleki programmalary gurnap bilýär' }, description: { en: 'App can request to install other packages.', tk: 'Programma beýleki paketleri gurnamagy haýyş edip biler.' } }
                ],
                warnings: [
                    { severity: 'medium', title: { en: 'Low Target SDK', tk: 'Pes nyşana SDK' }, description: { en: 'Target SDK 28 is outdated.', tk: 'Nyşana SDK 28 köneldi.' } }
                ],
                recommendations: [
                    { en: 'WARNING: This app requests permissions unusual for a VPN.', tk: 'DUÝDURYŞ: Bu programma VPN üçin adaty däl rugsatlar soraýar.' },
                    { en: 'Do NOT install this app - high risk of data theft.', tk: 'Bu programmany gurmaň - maglumat ogurlygy töwekgelçiligi ýokary.' }
                ],
                overallRisk: 'high',
                riskScore: 68
            },
            analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
        }
    },
    {
        id: 'demo-flashlight-004',
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
                packageName: 'com.flashlight.malware',
                versionCode: '23',
                versionName: '2.3.0',
                minSdkVersion: 16,
                targetSdkVersion: 22,
                permissions: [
                    'android.permission.CAMERA',
                    'android.permission.FLASHLIGHT',
                    'android.permission.INTERNET',
                    'android.permission.SEND_SMS',
                    'android.permission.RECEIVE_SMS',
                    'android.permission.READ_SMS',
                    'android.permission.CALL_PHONE',
                    'android.permission.READ_CALL_LOG',
                    'android.permission.READ_CONTACTS',
                    'android.permission.READ_PHONE_STATE',
                    'android.permission.ACCESS_FINE_LOCATION',
                    'android.permission.RECORD_AUDIO',
                    'android.permission.READ_EXTERNAL_STORAGE',
                    'android.permission.SYSTEM_ALERT_WINDOW',
                    'android.permission.BIND_ACCESSIBILITY_SERVICE'
                ],
                activities: ['com.flashlight.MainActivity'],
                services: ['com.flashlight.SmsService', 'com.flashlight.CallService'],
                receivers: ['com.flashlight.SmsReceiver', 'com.flashlight.CallReceiver'],
                providers: ['com.flashlight.DataProvider'],
                flags: {
                    debuggable: true,
                    allowBackup: true,
                    hasExportedComponents: true
                },
                exportedComponents: ['com.flashlight.SmsReceiver', 'com.flashlight.CallReceiver']
            },
            permissions: {
                total: 15,
                byRisk: {
                    critical: [
                        { name: 'android.permission.SEND_SMS', risk: 'critical', category: 'SMS', description: { en: 'Send SMS messages (can cost money)', tk: 'SMS habarlaryny ibermek (pul çykdajy edip biler)' } },
                        { name: 'android.permission.RECEIVE_SMS', risk: 'critical', category: 'SMS', description: { en: 'Receive SMS messages', tk: 'SMS habarlaryny almak' } },
                        { name: 'android.permission.READ_SMS', risk: 'critical', category: 'SMS', description: { en: 'Read SMS messages', tk: 'SMS habarlaryny okamak' } },
                        { name: 'android.permission.CALL_PHONE', risk: 'critical', category: 'Phone', description: { en: 'Make phone calls directly', tk: 'Göni telefon jaňlaryny etmek' } },
                        { name: 'android.permission.READ_CALL_LOG', risk: 'critical', category: 'Phone', description: { en: 'Read call log', tk: 'Jaň ýazgylaryny okamak' } },
                        { name: 'android.permission.ACCESS_FINE_LOCATION', risk: 'critical', category: 'Location', description: { en: 'Access precise location (GPS)', tk: 'Takyk ýerleşişe girmek (GPS)' } },
                        { name: 'android.permission.RECORD_AUDIO', risk: 'critical', category: 'Microphone', description: { en: 'Record audio', tk: 'Ses ýazgy etmek' } },
                        { name: 'android.permission.CAMERA', risk: 'critical', category: 'Camera', description: { en: 'Take pictures and record video', tk: 'Surat almak we wideo ýazgy etmek' } }
                    ],
                    high: [
                        { name: 'android.permission.READ_CONTACTS', risk: 'high', category: 'Contacts', description: { en: 'Read your contacts', tk: 'Aragatnaşyklaryňyzy okamak' } },
                        { name: 'android.permission.READ_PHONE_STATE', risk: 'high', category: 'Phone', description: { en: 'Read phone status and identity', tk: 'Telefonyň ýagdaýyny we şahsyýetini okamak' } },
                        { name: 'android.permission.READ_EXTERNAL_STORAGE', risk: 'high', category: 'Storage', description: { en: 'Read all your files', tk: 'Ähli faýllaryňyzy okamak' } }
                    ],
                    medium: [
                        { name: 'android.permission.INTERNET', risk: 'medium', category: 'Network', description: { en: 'Full network access', tk: 'Doly tor girelgesi' } }
                    ],
                    low: [
                        { name: 'android.permission.FLASHLIGHT', risk: 'low', category: 'Hardware', description: { en: 'Control flashlight', tk: 'Çyrany dolandyrmak' } }
                    ]
                },
                riskScore: { score: 520, percentage: 96, level: 'critical' }
            },
            security: {
                issues: [
                    { severity: 'critical', title: { en: 'MALWARE DETECTED: SMS Trojan', tk: 'ZYÝANLY PROGRAMMA TAPYLDY: SMS Troýan' }, description: { en: 'This app can send, receive, and read SMS - typical behavior of premium SMS malware.', tk: 'Bu programma SMS iberip, alyp we okap bilýär - premium SMS zyýanly programmasynyň adaty aýratynlygy.' } },
                    { severity: 'critical', title: { en: 'SPYWARE CAPABILITIES', tk: 'IÇALY PROGRAMMA MÜMKINÇILIKLERI' }, description: { en: 'App can record audio, access camera, track location.', tk: 'Programma ses ýazyp, kamera girip, ýerleşişi yzarlap bilýär.' } },
                    { severity: 'high', title: { en: 'Application is Debuggable', tk: 'Programma düzedilip bilner' }, description: { en: 'Debug mode enabled - sign of malicious app.', tk: 'Sazlama rejimi açyk - zyýanly programmanyň alamaty.' } }
                ],
                warnings: [
                    { severity: 'high', title: { en: 'Extremely Low Target SDK', tk: 'Örän pes nyşana SDK' }, description: { en: 'Target SDK 22 bypasses Android security features.', tk: 'Nyşana SDK 22 Android howpsuzlyk aýratynlyklaryny aýlanyp geçýär.' } },
                    { severity: 'high', title: { en: 'Excessive Permissions for Flashlight', tk: 'Çyra üçin artyk rugsatlar' }, description: { en: 'A flashlight app should only need camera permission.', tk: 'Çyra programmasy diňe kamera rugsadyna mätäç.' } }
                ],
                recommendations: [
                    { en: 'DO NOT INSTALL - This is MALWARE!', tk: 'GURMAŇ - Bu ZYÝANLY PROGRAMMADYR!' },
                    { en: 'If installed, REMOVE IMMEDIATELY and change all passwords.', tk: 'Eger gurlan bolsa, DERREW AÝYRYŇ we ähli parollary üýtgediň.' }
                ],
                overallRisk: 'critical',
                riskScore: 96
            },
            analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
        }
    },
    {
        id: 'demo-weather-005',
        analysis: {
            basicInfo: {
                fileName: 'Weather_Widget_v4.2.apk',
                fileSize: 5242880,
                fileSizeFormatted: '5.00 MB',
                totalFiles: 312,
                dexCount: 1,
                nativeLibraries: [],
                hasAssets: true,
                hasResources: true
            },
            manifest: {
                packageName: 'com.weather.widget.clean',
                versionCode: '42',
                versionName: '4.2.0',
                minSdkVersion: 24,
                targetSdkVersion: 34,
                permissions: [
                    'android.permission.INTERNET',
                    'android.permission.ACCESS_NETWORK_STATE',
                    'android.permission.ACCESS_COARSE_LOCATION',
                    'android.permission.POST_NOTIFICATIONS'
                ],
                activities: ['com.weather.MainActivity', 'com.weather.SettingsActivity'],
                services: ['com.weather.UpdateService'],
                receivers: ['com.weather.WidgetReceiver'],
                providers: [],
                flags: {
                    debuggable: false,
                    allowBackup: false,
                    hasExportedComponents: false
                },
                exportedComponents: []
            },
            permissions: {
                total: 4,
                byRisk: {
                    critical: [],
                    high: [
                        { name: 'android.permission.ACCESS_COARSE_LOCATION', risk: 'high', category: 'Location', description: { en: 'Access approximate location', tk: 'Takmynan ýerleşişe girmek' } }
                    ],
                    medium: [
                        { name: 'android.permission.INTERNET', risk: 'medium', category: 'Network', description: { en: 'Full network access', tk: 'Doly tor girelgesi' } }
                    ],
                    low: [
                        { name: 'android.permission.ACCESS_NETWORK_STATE', risk: 'low', category: 'Network', description: { en: 'View network connections', tk: 'Tor baglanyşyklaryny görmek' } },
                        { name: 'android.permission.POST_NOTIFICATIONS', risk: 'low', category: 'Notifications', description: { en: 'Post notifications', tk: 'Bildirişleri ibermek' } }
                    ]
                },
                riskScore: { score: 35, percentage: 18, level: 'low' }
            },
            security: {
                issues: [],
                warnings: [
                    { severity: 'low', title: { en: 'Location Access', tk: 'Ýerleşiş Girelgesi' }, description: { en: 'App requests location for weather data - reasonable for this type of app.', tk: 'Programma howa maglumatlary üçin ýerleşiş soraýar - bu görnüşli programma üçin esasly.' } }
                ],
                recommendations: [
                    { en: 'This app has appropriate permissions for a weather app.', tk: 'Bu programmanyň howa programmasy üçin laýyk rugsatlary bar.' }
                ],
                overallRisk: 'low',
                riskScore: 18
            },
            analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        }
    }
];

// Clear existing data and insert demo data
async function seed() {
    console.log('Seeding database with demo data...');

    try {
        // Initialize database first
        await initDb();
        console.log('Database initialized');

        clearHistory();
        console.log('Cleared existing history');

        for (const demo of demoAnalyses) {
            saveAnalysis(demo.id, demo.analysis);
            console.log(`Added: ${demo.analysis.basicInfo.fileName}`);
        }

        console.log('\nSeeding completed!');
        console.log(`Added ${demoAnalyses.length} demo analyses to the database.`);

        // Show statistics
        const stats = getStatistics();
        console.log('\nDatabase Statistics:');
        console.log(`- Total analyses: ${stats.totalAnalyses}`);
        console.log(`- Average risk score: ${stats.averageRiskScore}%`);
        console.log(`- Risk distribution:`, stats.riskDistribution);

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
