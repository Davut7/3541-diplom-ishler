import '../models/app_info.dart';

class PermissionDatabase {
  static const Map<String, PermissionInfo> _permissions = {
    // CRITICAL
    'android.permission.SEND_SMS': PermissionInfo(
      name: 'android.permission.SEND_SMS',
      shortName: 'SEND_SMS',
      category: 'SMS',
      riskLevel: 'critical',
      description: 'SMS ibermek (pul çykdajy edip biler)',
    ),
    'android.permission.RECEIVE_SMS': PermissionInfo(
      name: 'android.permission.RECEIVE_SMS',
      shortName: 'RECEIVE_SMS',
      category: 'SMS',
      riskLevel: 'critical',
      description: 'SMS kabul etmek',
    ),
    'android.permission.READ_SMS': PermissionInfo(
      name: 'android.permission.READ_SMS',
      shortName: 'READ_SMS',
      category: 'SMS',
      riskLevel: 'critical',
      description: 'SMS habarlary okamak',
    ),
    'android.permission.CALL_PHONE': PermissionInfo(
      name: 'android.permission.CALL_PHONE',
      shortName: 'CALL_PHONE',
      category: 'Telefon',
      riskLevel: 'critical',
      description: 'Göni jaň etmek',
    ),
    'android.permission.READ_CALL_LOG': PermissionInfo(
      name: 'android.permission.READ_CALL_LOG',
      shortName: 'READ_CALL_LOG',
      category: 'Telefon',
      riskLevel: 'critical',
      description: 'Jaň ýazgylaryny okamak',
    ),
    'android.permission.PROCESS_OUTGOING_CALLS': PermissionInfo(
      name: 'android.permission.PROCESS_OUTGOING_CALLS',
      shortName: 'PROCESS_OUTGOING_CALLS',
      category: 'Telefon',
      riskLevel: 'critical',
      description: 'Gidýän jaňlary gaýtadan ugratmak',
    ),
    'android.permission.CAMERA': PermissionInfo(
      name: 'android.permission.CAMERA',
      shortName: 'CAMERA',
      category: 'Kamera',
      riskLevel: 'critical',
      description: 'Surat almak we wideo ýazgy etmek',
    ),
    'android.permission.RECORD_AUDIO': PermissionInfo(
      name: 'android.permission.RECORD_AUDIO',
      shortName: 'RECORD_AUDIO',
      category: 'Mikrofon',
      riskLevel: 'critical',
      description: 'Ses ýazgy etmek',
    ),
    'android.permission.ACCESS_FINE_LOCATION': PermissionInfo(
      name: 'android.permission.ACCESS_FINE_LOCATION',
      shortName: 'FINE_LOCATION',
      category: 'Ýerleşiş',
      riskLevel: 'critical',
      description: 'Takyk ýerleşişe girmek (GPS)',
    ),
    'android.permission.ACCESS_BACKGROUND_LOCATION': PermissionInfo(
      name: 'android.permission.ACCESS_BACKGROUND_LOCATION',
      shortName: 'BACKGROUND_LOCATION',
      category: 'Ýerleşiş',
      riskLevel: 'critical',
      description: 'Arka fonunda ýerleşişi yzarlamak',
    ),
    'android.permission.SYSTEM_ALERT_WINDOW': PermissionInfo(
      name: 'android.permission.SYSTEM_ALERT_WINDOW',
      shortName: 'SYSTEM_ALERT_WINDOW',
      category: 'Ulgam',
      riskLevel: 'critical',
      description: 'Beýleki programmalaryň üstünde görkezmek',
    ),
    'android.permission.REQUEST_INSTALL_PACKAGES': PermissionInfo(
      name: 'android.permission.REQUEST_INSTALL_PACKAGES',
      shortName: 'INSTALL_PACKAGES',
      category: 'Ulgam',
      riskLevel: 'critical',
      description: 'Programmalary gurnamak',
    ),
    'android.permission.BIND_ACCESSIBILITY_SERVICE': PermissionInfo(
      name: 'android.permission.BIND_ACCESSIBILITY_SERVICE',
      shortName: 'ACCESSIBILITY',
      category: 'Ulgam',
      riskLevel: 'critical',
      description: 'Ekrany okamak (elýeterlilik)',
    ),
    'android.permission.BIND_DEVICE_ADMIN': PermissionInfo(
      name: 'android.permission.BIND_DEVICE_ADMIN',
      shortName: 'DEVICE_ADMIN',
      category: 'Ulgam',
      riskLevel: 'critical',
      description: 'Enjam dolandyryjysy (doly gözegçilik)',
    ),

    // HIGH
    'android.permission.READ_CONTACTS': PermissionInfo(
      name: 'android.permission.READ_CONTACTS',
      shortName: 'READ_CONTACTS',
      category: 'Aragatnaşyklar',
      riskLevel: 'high',
      description: 'Aragatnaşyklary okamak',
    ),
    'android.permission.WRITE_CONTACTS': PermissionInfo(
      name: 'android.permission.WRITE_CONTACTS',
      shortName: 'WRITE_CONTACTS',
      category: 'Aragatnaşyklar',
      riskLevel: 'high',
      description: 'Aragatnaşyklary üýtgetmek',
    ),
    'android.permission.READ_EXTERNAL_STORAGE': PermissionInfo(
      name: 'android.permission.READ_EXTERNAL_STORAGE',
      shortName: 'READ_STORAGE',
      category: 'Ammar',
      riskLevel: 'high',
      description: 'Ähli faýllary okamak',
    ),
    'android.permission.WRITE_EXTERNAL_STORAGE': PermissionInfo(
      name: 'android.permission.WRITE_EXTERNAL_STORAGE',
      shortName: 'WRITE_STORAGE',
      category: 'Ammar',
      riskLevel: 'high',
      description: 'Faýllary üýtgetmek/pozmak',
    ),
    'android.permission.READ_PHONE_STATE': PermissionInfo(
      name: 'android.permission.READ_PHONE_STATE',
      shortName: 'READ_PHONE_STATE',
      category: 'Telefon',
      riskLevel: 'high',
      description: 'Telefon ýagdaýyny okamak',
    ),
    'android.permission.READ_PHONE_NUMBERS': PermissionInfo(
      name: 'android.permission.READ_PHONE_NUMBERS',
      shortName: 'READ_PHONE_NUMBERS',
      category: 'Telefon',
      riskLevel: 'high',
      description: 'Telefon belgilerini okamak',
    ),
    'android.permission.ACCESS_COARSE_LOCATION': PermissionInfo(
      name: 'android.permission.ACCESS_COARSE_LOCATION',
      shortName: 'COARSE_LOCATION',
      category: 'Ýerleşiş',
      riskLevel: 'high',
      description: 'Takmynan ýerleşişe girmek',
    ),
    'android.permission.READ_CALENDAR': PermissionInfo(
      name: 'android.permission.READ_CALENDAR',
      shortName: 'READ_CALENDAR',
      category: 'Senenama',
      riskLevel: 'high',
      description: 'Senenamany okamak',
    ),
    'android.permission.WRITE_CALENDAR': PermissionInfo(
      name: 'android.permission.WRITE_CALENDAR',
      shortName: 'WRITE_CALENDAR',
      category: 'Senenama',
      riskLevel: 'high',
      description: 'Senenamany üýtgetmek',
    ),

    // MEDIUM
    'android.permission.INTERNET': PermissionInfo(
      name: 'android.permission.INTERNET',
      shortName: 'INTERNET',
      category: 'Tor',
      riskLevel: 'medium',
      description: 'Doly tor girelgesi',
    ),
    'android.permission.RECEIVE_BOOT_COMPLETED': PermissionInfo(
      name: 'android.permission.RECEIVE_BOOT_COMPLETED',
      shortName: 'BOOT_COMPLETED',
      category: 'Ulgam',
      riskLevel: 'medium',
      description: 'Başlangyçda işletmek',
    ),
    'android.permission.CHANGE_NETWORK_STATE': PermissionInfo(
      name: 'android.permission.CHANGE_NETWORK_STATE',
      shortName: 'CHANGE_NETWORK',
      category: 'Tor',
      riskLevel: 'medium',
      description: 'Tor baglanyşygyny üýtgetmek',
    ),
    'android.permission.QUERY_ALL_PACKAGES': PermissionInfo(
      name: 'android.permission.QUERY_ALL_PACKAGES',
      shortName: 'QUERY_PACKAGES',
      category: 'Ulgam',
      riskLevel: 'medium',
      description: 'Ähli gurlan programmalary görmek',
    ),
    'android.permission.BLUETOOTH': PermissionInfo(
      name: 'android.permission.BLUETOOTH',
      shortName: 'BLUETOOTH',
      category: 'Birikmeler',
      riskLevel: 'medium',
      description: 'Bluetooth baglanyşygy',
    ),
    'android.permission.BLUETOOTH_CONNECT': PermissionInfo(
      name: 'android.permission.BLUETOOTH_CONNECT',
      shortName: 'BLUETOOTH_CONNECT',
      category: 'Birikmeler',
      riskLevel: 'medium',
      description: 'Bluetooth enjamlara birikdirmek',
    ),
    'android.permission.NFC': PermissionInfo(
      name: 'android.permission.NFC',
      shortName: 'NFC',
      category: 'Birikmeler',
      riskLevel: 'medium',
      description: 'NFC ulanmak',
    ),
    'android.permission.USE_BIOMETRIC': PermissionInfo(
      name: 'android.permission.USE_BIOMETRIC',
      shortName: 'BIOMETRIC',
      category: 'Howpsuzlyk',
      riskLevel: 'medium',
      description: 'Biometrik barlagy ulanmak',
    ),

    // LOW
    'android.permission.ACCESS_NETWORK_STATE': PermissionInfo(
      name: 'android.permission.ACCESS_NETWORK_STATE',
      shortName: 'NETWORK_STATE',
      category: 'Tor',
      riskLevel: 'low',
      description: 'Tor baglanyşyklaryny görmek',
    ),
    'android.permission.ACCESS_WIFI_STATE': PermissionInfo(
      name: 'android.permission.ACCESS_WIFI_STATE',
      shortName: 'WIFI_STATE',
      category: 'Tor',
      riskLevel: 'low',
      description: 'Wi-Fi baglanyşyklaryny görmek',
    ),
    'android.permission.VIBRATE': PermissionInfo(
      name: 'android.permission.VIBRATE',
      shortName: 'VIBRATE',
      category: 'Ulgam',
      riskLevel: 'low',
      description: 'Titremeany dolandyrmak',
    ),
    'android.permission.WAKE_LOCK': PermissionInfo(
      name: 'android.permission.WAKE_LOCK',
      shortName: 'WAKE_LOCK',
      category: 'Ulgam',
      riskLevel: 'low',
      description: 'Telefonyň ýatmagyny öňlemek',
    ),
    'android.permission.POST_NOTIFICATIONS': PermissionInfo(
      name: 'android.permission.POST_NOTIFICATIONS',
      shortName: 'NOTIFICATIONS',
      category: 'Bildirişler',
      riskLevel: 'low',
      description: 'Bildirişleri ibermek',
    ),
    'android.permission.FOREGROUND_SERVICE': PermissionInfo(
      name: 'android.permission.FOREGROUND_SERVICE',
      shortName: 'FOREGROUND_SERVICE',
      category: 'Ulgam',
      riskLevel: 'low',
      description: 'Öň planda hyzmat işletmek',
    ),
    'android.permission.SET_ALARM': PermissionInfo(
      name: 'android.permission.SET_ALARM',
      shortName: 'SET_ALARM',
      category: 'Ulgam',
      riskLevel: 'low',
      description: 'Duýduryş gurmak',
    ),
    'android.permission.FLASHLIGHT': PermissionInfo(
      name: 'android.permission.FLASHLIGHT',
      shortName: 'FLASHLIGHT',
      category: 'Enjam',
      riskLevel: 'low',
      description: 'Çyrany dolandyrmak',
    ),
  };

  static PermissionInfo? getPermission(String name) => _permissions[name];

  static PermissionInfo getPermissionOrDefault(String name) {
    return _permissions[name] ??
        PermissionInfo(
          name: name,
          shortName: name.split('.').last,
          category: 'Beýleki',
          riskLevel: 'low',
          description: name.split('.').last.replaceAll('_', ' '),
        );
  }

  static int getRiskWeight(String riskLevel) {
    switch (riskLevel) {
      case 'critical':
        return 25;
      case 'high':
        return 15;
      case 'medium':
        return 5;
      case 'low':
        return 1;
      default:
        return 0;
    }
  }
}
