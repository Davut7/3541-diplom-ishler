import 'package:flutter/services.dart';
import '../models/app_info.dart';
import 'permission_database.dart';

class AppScanner {
  static const _channel = MethodChannel('com.bayram.app_security_scanner/apps');

  Future<List<AppInfo>> getInstalledApps() async {
    final List<dynamic> result = await _channel.invokeMethod('getInstalledApps');
    return result
        .map((app) => AppInfo.fromMap(app as Map<dynamic, dynamic>))
        .toList()
      ..sort((a, b) => a.appName.toLowerCase().compareTo(b.appName.toLowerCase()));
  }

  void analyzeApp(AppInfo app) {
    int totalScore = 0;
    int dangerousCount = 0;
    final analyzed = <PermissionInfo>[];

    for (final perm in app.permissions) {
      final permInfo = PermissionDatabase.getPermissionOrDefault(perm);
      analyzed.add(permInfo);
      totalScore += PermissionDatabase.getRiskWeight(permInfo.riskLevel);

      if (permInfo.riskLevel == 'critical' || permInfo.riskLevel == 'high') {
        dangerousCount++;
      }
    }

    // Normalize score to 0-100
    final maxPossibleScore = app.permissions.length * 25;
    final normalizedScore =
        maxPossibleScore > 0 ? (totalScore / maxPossibleScore * 100).round() : 0;

    app.riskScore = normalizedScore.clamp(0, 100);
    app.dangerousPermCount = dangerousCount;
    app.analyzedPermissions = analyzed;
    app.isScanned = true;

    // Determine risk level
    if (normalizedScore >= 70) {
      app.riskLevel = 'critical';
    } else if (normalizedScore >= 45) {
      app.riskLevel = 'high';
    } else if (normalizedScore >= 20) {
      app.riskLevel = 'medium';
    } else {
      app.riskLevel = 'low';
    }
  }

  Future<void> uninstallApp(String packageName) async {
    await _channel.invokeMethod('uninstallApp', {'packageName': packageName});
  }

  Future<void> forceStopApp(String packageName) async {
    await _channel.invokeMethod('forceStopApp', {'packageName': packageName});
  }

  Future<void> openAppSettings(String packageName) async {
    await _channel.invokeMethod('openAppSettings', {'packageName': packageName});
  }

  Future<void> openPermissionSettings(String packageName) async {
    await _channel
        .invokeMethod('openPermissionSettings', {'packageName': packageName});
  }
}
