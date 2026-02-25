/**
 * Android Permission Database
 * Contains risk levels and descriptions for Android permissions
 */

const permissionDatabase = {
    // Dangerous permissions (require explicit user approval)
    'android.permission.READ_CALENDAR': {
        risk: 'high',
        category: 'Calendar',
        description: {
            en: 'Read calendar events and details',
            tk: 'Senenama wakalarynyň we jikme-jiklikleri okamak'
        }
    },
    'android.permission.WRITE_CALENDAR': {
        risk: 'high',
        category: 'Calendar',
        description: {
            en: 'Add or modify calendar events',
            tk: 'Senenama wakalaryny goşmak ýa-da üýtgetmek'
        }
    },
    'android.permission.CAMERA': {
        risk: 'critical',
        category: 'Camera',
        description: {
            en: 'Take pictures and record video',
            tk: 'Surat almak we wideo ýazgy etmek'
        }
    },
    'android.permission.READ_CONTACTS': {
        risk: 'high',
        category: 'Contacts',
        description: {
            en: 'Read your contacts',
            tk: 'Aragatnaşyklaryňyzy okamak'
        }
    },
    'android.permission.WRITE_CONTACTS': {
        risk: 'high',
        category: 'Contacts',
        description: {
            en: 'Modify your contacts',
            tk: 'Aragatnaşyklaryňyzy üýtgetmek'
        }
    },
    'android.permission.GET_ACCOUNTS': {
        risk: 'medium',
        category: 'Contacts',
        description: {
            en: 'Find accounts on the device',
            tk: 'Enjamda hasaplary tapmak'
        }
    },
    'android.permission.ACCESS_FINE_LOCATION': {
        risk: 'critical',
        category: 'Location',
        description: {
            en: 'Access precise location (GPS)',
            tk: 'Takyk ýerleşişe girmek (GPS)'
        }
    },
    'android.permission.ACCESS_COARSE_LOCATION': {
        risk: 'high',
        category: 'Location',
        description: {
            en: 'Access approximate location',
            tk: 'Takmynan ýerleşişe girmek'
        }
    },
    'android.permission.ACCESS_BACKGROUND_LOCATION': {
        risk: 'critical',
        category: 'Location',
        description: {
            en: 'Access location in background',
            tk: 'Arka fonunda ýerleşişe girmek'
        }
    },
    'android.permission.RECORD_AUDIO': {
        risk: 'critical',
        category: 'Microphone',
        description: {
            en: 'Record audio',
            tk: 'Ses ýazgy etmek'
        }
    },
    'android.permission.READ_PHONE_STATE': {
        risk: 'high',
        category: 'Phone',
        description: {
            en: 'Read phone status and identity',
            tk: 'Telefonyň ýagdaýyny we şahsyýetini okamak'
        }
    },
    'android.permission.READ_PHONE_NUMBERS': {
        risk: 'high',
        category: 'Phone',
        description: {
            en: 'Read phone numbers',
            tk: 'Telefon belgilerini okamak'
        }
    },
    'android.permission.CALL_PHONE': {
        risk: 'critical',
        category: 'Phone',
        description: {
            en: 'Make phone calls directly',
            tk: 'Göni telefon jaňlaryny etmek'
        }
    },
    'android.permission.ANSWER_PHONE_CALLS': {
        risk: 'high',
        category: 'Phone',
        description: {
            en: 'Answer incoming calls',
            tk: 'Gelýän jaňlara jogap bermek'
        }
    },
    'android.permission.READ_CALL_LOG': {
        risk: 'critical',
        category: 'Phone',
        description: {
            en: 'Read call log',
            tk: 'Jaň ýazgylaryny okamak'
        }
    },
    'android.permission.WRITE_CALL_LOG': {
        risk: 'high',
        category: 'Phone',
        description: {
            en: 'Write call log',
            tk: 'Jaň ýazgylaryny ýazmak'
        }
    },
    'android.permission.ADD_VOICEMAIL': {
        risk: 'medium',
        category: 'Phone',
        description: {
            en: 'Add voicemails',
            tk: 'Ses hatlaryny goşmak'
        }
    },
    'android.permission.USE_SIP': {
        risk: 'medium',
        category: 'Phone',
        description: {
            en: 'Use SIP service',
            tk: 'SIP hyzmatyny ulanmak'
        }
    },
    'android.permission.PROCESS_OUTGOING_CALLS': {
        risk: 'critical',
        category: 'Phone',
        description: {
            en: 'Reroute outgoing calls',
            tk: 'Gidýän jaňlary täzeden ugratmak'
        }
    },
    'android.permission.BODY_SENSORS': {
        risk: 'high',
        category: 'Sensors',
        description: {
            en: 'Access body sensors (heart rate, etc.)',
            tk: 'Beden datçiklerine girmek (ýürek urgusy we ş.m.)'
        }
    },
    'android.permission.ACTIVITY_RECOGNITION': {
        risk: 'medium',
        category: 'Sensors',
        description: {
            en: 'Recognize physical activity',
            tk: 'Fiziki işjeňligi tanamak'
        }
    },
    'android.permission.SEND_SMS': {
        risk: 'critical',
        category: 'SMS',
        description: {
            en: 'Send SMS messages',
            tk: 'SMS habarlaryny ibermek'
        }
    },
    'android.permission.RECEIVE_SMS': {
        risk: 'critical',
        category: 'SMS',
        description: {
            en: 'Receive SMS messages',
            tk: 'SMS habarlaryny almak'
        }
    },
    'android.permission.READ_SMS': {
        risk: 'critical',
        category: 'SMS',
        description: {
            en: 'Read SMS messages',
            tk: 'SMS habarlaryny okamak'
        }
    },
    'android.permission.RECEIVE_WAP_PUSH': {
        risk: 'medium',
        category: 'SMS',
        description: {
            en: 'Receive WAP push messages',
            tk: 'WAP push habarlaryny almak'
        }
    },
    'android.permission.RECEIVE_MMS': {
        risk: 'high',
        category: 'SMS',
        description: {
            en: 'Receive MMS messages',
            tk: 'MMS habarlaryny almak'
        }
    },
    'android.permission.READ_EXTERNAL_STORAGE': {
        risk: 'high',
        category: 'Storage',
        description: {
            en: 'Read external storage',
            tk: 'Daşarky ýady okamak'
        }
    },
    'android.permission.WRITE_EXTERNAL_STORAGE': {
        risk: 'high',
        category: 'Storage',
        description: {
            en: 'Write to external storage',
            tk: 'Daşarky ýada ýazmak'
        }
    },
    'android.permission.READ_MEDIA_IMAGES': {
        risk: 'medium',
        category: 'Storage',
        description: {
            en: 'Read images from storage',
            tk: 'Ýatdan suratlary okamak'
        }
    },
    'android.permission.READ_MEDIA_VIDEO': {
        risk: 'medium',
        category: 'Storage',
        description: {
            en: 'Read videos from storage',
            tk: 'Ýatdan wideolary okamak'
        }
    },
    'android.permission.READ_MEDIA_AUDIO': {
        risk: 'medium',
        category: 'Storage',
        description: {
            en: 'Read audio files from storage',
            tk: 'Ýatdan ses faýllaryny okamak'
        }
    },

    // Network permissions
    'android.permission.INTERNET': {
        risk: 'medium',
        category: 'Network',
        description: {
            en: 'Full network access',
            tk: 'Doly tor girelgesi'
        }
    },
    'android.permission.ACCESS_NETWORK_STATE': {
        risk: 'low',
        category: 'Network',
        description: {
            en: 'View network connections',
            tk: 'Tor baglanyşyklaryny görmek'
        }
    },
    'android.permission.ACCESS_WIFI_STATE': {
        risk: 'low',
        category: 'Network',
        description: {
            en: 'View Wi-Fi connections',
            tk: 'Wi-Fi baglanyşyklaryny görmek'
        }
    },
    'android.permission.CHANGE_WIFI_STATE': {
        risk: 'medium',
        category: 'Network',
        description: {
            en: 'Connect and disconnect from Wi-Fi',
            tk: 'Wi-Fi-a birikdirmek we aýyrmak'
        }
    },
    'android.permission.BLUETOOTH': {
        risk: 'medium',
        category: 'Bluetooth',
        description: {
            en: 'Pair with Bluetooth devices',
            tk: 'Bluetooth enjamlary bilen jübütleşmek'
        }
    },
    'android.permission.BLUETOOTH_ADMIN': {
        risk: 'medium',
        category: 'Bluetooth',
        description: {
            en: 'Access Bluetooth settings',
            tk: 'Bluetooth sazlamalaryna girmek'
        }
    },
    'android.permission.BLUETOOTH_CONNECT': {
        risk: 'medium',
        category: 'Bluetooth',
        description: {
            en: 'Connect to paired Bluetooth devices',
            tk: 'Jübütleşdirilen Bluetooth enjamlaryna birikdirmek'
        }
    },
    'android.permission.BLUETOOTH_SCAN': {
        risk: 'medium',
        category: 'Bluetooth',
        description: {
            en: 'Discover and pair Bluetooth devices',
            tk: 'Bluetooth enjamlaryny tapmak we jübütleşdirmek'
        }
    },

    // System permissions
    'android.permission.RECEIVE_BOOT_COMPLETED': {
        risk: 'medium',
        category: 'System',
        description: {
            en: 'Run at startup',
            tk: 'Başlangyçda işletmek'
        }
    },
    'android.permission.VIBRATE': {
        risk: 'low',
        category: 'System',
        description: {
            en: 'Control vibration',
            tk: 'Titremeany dolandyrmak'
        }
    },
    'android.permission.WAKE_LOCK': {
        risk: 'low',
        category: 'System',
        description: {
            en: 'Prevent phone from sleeping',
            tk: 'Telefonyň ýatmagyny öňlemek'
        }
    },
    'android.permission.FOREGROUND_SERVICE': {
        risk: 'low',
        category: 'System',
        description: {
            en: 'Run foreground service',
            tk: 'Öň planda hyzmat işletmek'
        }
    },
    'android.permission.REQUEST_INSTALL_PACKAGES': {
        risk: 'critical',
        category: 'System',
        description: {
            en: 'Request install packages',
            tk: 'Paketleri gurnamagy haýyş etmek'
        }
    },
    'android.permission.REQUEST_DELETE_PACKAGES': {
        risk: 'high',
        category: 'System',
        description: {
            en: 'Delete other apps',
            tk: 'Beýleki programmalary pozmak'
        }
    },
    'android.permission.SYSTEM_ALERT_WINDOW': {
        risk: 'critical',
        category: 'System',
        description: {
            en: 'Display over other apps',
            tk: 'Beýleki programmalaryň üstünde görkezmek'
        }
    },
    'android.permission.WRITE_SETTINGS': {
        risk: 'high',
        category: 'System',
        description: {
            en: 'Modify system settings',
            tk: 'Ulgam sazlamalaryny üýtgetmek'
        }
    },
    'android.permission.BIND_ACCESSIBILITY_SERVICE': {
        risk: 'critical',
        category: 'System',
        description: {
            en: 'Accessibility service (can read screen)',
            tk: 'Elýeterlilik hyzmaty (ekrany okap bilýär)'
        }
    },
    'android.permission.BIND_DEVICE_ADMIN': {
        risk: 'critical',
        category: 'System',
        description: {
            en: 'Device administrator access',
            tk: 'Enjam dolandyryjysy girelgesi'
        }
    },
    'android.permission.QUERY_ALL_PACKAGES': {
        risk: 'medium',
        category: 'System',
        description: {
            en: 'Query all installed packages',
            tk: 'Gurlan ähli paketleri soramak'
        }
    },
    'android.permission.POST_NOTIFICATIONS': {
        risk: 'low',
        category: 'Notifications',
        description: {
            en: 'Post notifications',
            tk: 'Bildirişleri ibermek'
        }
    },
    'android.permission.SCHEDULE_EXACT_ALARM': {
        risk: 'medium',
        category: 'System',
        description: {
            en: 'Set exact alarms',
            tk: 'Takyk signallary bellemek'
        }
    },
    'android.permission.USE_BIOMETRIC': {
        risk: 'medium',
        category: 'Security',
        description: {
            en: 'Use biometric hardware',
            tk: 'Biometrik enjamlary ulanmak'
        }
    },
    'android.permission.USE_FINGERPRINT': {
        risk: 'medium',
        category: 'Security',
        description: {
            en: 'Use fingerprint hardware',
            tk: 'Barmak yzyny ulanmak'
        }
    }
};

/**
 * Get permission info
 */
function getPermissionInfo(permission) {
    const normalizedPermission = permission.trim();

    if (permissionDatabase[normalizedPermission]) {
        return {
            name: normalizedPermission,
            ...permissionDatabase[normalizedPermission]
        };
    }

    // For unknown permissions, try to determine risk based on name
    let risk = 'low';
    let category = 'Other';

    if (normalizedPermission.includes('SMS') ||
        normalizedPermission.includes('CALL') ||
        normalizedPermission.includes('PHONE')) {
        risk = 'critical';
        category = 'Phone';
    } else if (normalizedPermission.includes('LOCATION') ||
               normalizedPermission.includes('GPS')) {
        risk = 'critical';
        category = 'Location';
    } else if (normalizedPermission.includes('CAMERA') ||
               normalizedPermission.includes('RECORD')) {
        risk = 'critical';
        category = 'Camera';
    } else if (normalizedPermission.includes('CONTACT') ||
               normalizedPermission.includes('CALENDAR')) {
        risk = 'high';
        category = 'Personal Data';
    } else if (normalizedPermission.includes('STORAGE') ||
               normalizedPermission.includes('FILE')) {
        risk = 'high';
        category = 'Storage';
    } else if (normalizedPermission.includes('ADMIN') ||
               normalizedPermission.includes('ROOT') ||
               normalizedPermission.includes('SYSTEM')) {
        risk = 'critical';
        category = 'System';
    } else if (normalizedPermission.includes('INTERNET') ||
               normalizedPermission.includes('NETWORK')) {
        risk = 'medium';
        category = 'Network';
    }

    return {
        name: normalizedPermission,
        risk: risk,
        category: category,
        description: {
            en: `Unknown permission: ${normalizedPermission.split('.').pop()}`,
            tk: `Näbelli rugsat: ${normalizedPermission.split('.').pop()}`
        }
    };
}

/**
 * Get all permissions
 */
function getAllPermissions() {
    return permissionDatabase;
}

/**
 * Calculate risk score
 */
function calculateRiskScore(permissions) {
    const riskWeights = {
        critical: 30,
        high: 15,
        medium: 5,
        low: 1
    };

    let totalScore = 0;
    let maxPossibleScore = permissions.length * 30;

    permissions.forEach(permission => {
        const info = getPermissionInfo(permission);
        totalScore += riskWeights[info.risk] || 0;
    });

    // Calculate percentage (0-100)
    const riskPercentage = maxPossibleScore > 0
        ? Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))
        : 0;

    // Determine risk level
    let riskLevel;
    if (riskPercentage >= 70) {
        riskLevel = 'critical';
    } else if (riskPercentage >= 50) {
        riskLevel = 'high';
    } else if (riskPercentage >= 25) {
        riskLevel = 'medium';
    } else {
        riskLevel = 'low';
    }

    return {
        score: totalScore,
        percentage: riskPercentage,
        level: riskLevel
    };
}

module.exports = {
    getPermissionInfo,
    getAllPermissions,
    calculateRiskScore
};
