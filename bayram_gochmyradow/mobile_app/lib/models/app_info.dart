import 'dart:typed_data';

class AppInfo {
  final String appName;
  final String packageName;
  final String versionName;
  final bool isSystemApp;
  final List<String> permissions;
  final Uint8List? iconBytes;
  final int appSize;
  final int installTime;
  final int updateTime;

  // Scan results
  String riskLevel; // low, medium, high, critical
  int riskScore;
  int dangerousPermCount;
  List<PermissionInfo> analyzedPermissions;
  bool isScanned;

  AppInfo({
    required this.appName,
    required this.packageName,
    required this.versionName,
    required this.isSystemApp,
    required this.permissions,
    this.iconBytes,
    required this.appSize,
    required this.installTime,
    required this.updateTime,
    this.riskLevel = 'unknown',
    this.riskScore = 0,
    this.dangerousPermCount = 0,
    this.analyzedPermissions = const [],
    this.isScanned = false,
  });

  String get formattedSize {
    if (appSize < 1024) return '$appSize B';
    if (appSize < 1024 * 1024) return '${(appSize / 1024).toStringAsFixed(1)} KB';
    return '${(appSize / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  factory AppInfo.fromMap(Map<dynamic, dynamic> map) {
    return AppInfo(
      appName: map['appName'] as String? ?? 'Unknown',
      packageName: map['packageName'] as String? ?? '',
      versionName: map['versionName'] as String? ?? 'Unknown',
      isSystemApp: map['isSystemApp'] as bool? ?? false,
      permissions: (map['permissions'] as List<dynamic>?)?.cast<String>() ?? [],
      iconBytes: map['iconBytes'] as Uint8List?,
      appSize: (map['appSize'] as num?)?.toInt() ?? 0,
      installTime: (map['installTime'] as num?)?.toInt() ?? 0,
      updateTime: (map['updateTime'] as num?)?.toInt() ?? 0,
    );
  }
}

class PermissionInfo {
  final String name;
  final String shortName;
  final String category;
  final String riskLevel; // low, medium, high, critical
  final String description;

  const PermissionInfo({
    required this.name,
    required this.shortName,
    required this.category,
    required this.riskLevel,
    required this.description,
  });
}
