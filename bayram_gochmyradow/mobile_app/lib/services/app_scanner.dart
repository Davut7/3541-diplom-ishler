import 'package:flutter/services.dart';
import '../models/app_info.dart';
import 'permission_database.dart';
import 'vulnerability_database.dart';

class AppScanner {
  static const _channel = MethodChannel('com.bayram.app_security_scanner/apps');

  Future<List<AppInfo>> getInstalledApps() async {
    final List<dynamic> result = await _channel.invokeMethod('getInstalledApps');
    return result
        .map((app) => AppInfo.fromMap(app as Map<dynamic, dynamic>))
        .toList()
      ..sort((a, b) => a.appName.toLowerCase().compareTo(b.appName.toLowerCase()));
  }

  /// Deep analysis: permissions + malware check + combo detection + CVE + scoring
  void analyzeApp(AppInfo app) {
    final findings = <ThreatFinding>[];
    int totalScore = 0;
    int dangerousCount = 0;
    final analyzed = <PermissionInfo>[];

    // ── 1. MALWARE CHECK ──
    final malware = VulnerabilityDatabase.checkMalware(app.packageName);
    if (malware != null) {
      app.malwareMatch = malware;
      findings.add(ThreatFinding(
        title: 'Bilinen zyýanly programma: ${malware.name}',
        description: malware.description,
        severity: 'critical',
        category: 'malware',
        scoreImpact: 50,
      ));
      totalScore += 50;
    }

    // ── 2. PERMISSION ANALYSIS ──
    for (final perm in app.permissions) {
      final permInfo = PermissionDatabase.getPermissionOrDefault(perm);
      analyzed.add(permInfo);
      final weight = PermissionDatabase.getRiskWeight(permInfo.riskLevel);
      totalScore += weight;

      if (permInfo.riskLevel == 'critical' || permInfo.riskLevel == 'high') {
        dangerousCount++;
      }
    }

    // ── 3. SUSPICIOUS PERMISSION COMBINATIONS ──
    final combos = VulnerabilityDatabase.findSuspiciousCombos(app.permissions);
    app.matchedCombos = combos;
    for (final combo in combos) {
      findings.add(ThreatFinding(
        title: _comboTitle(combo.threatType),
        description: combo.description,
        severity: combo.severity,
        category: 'permission_combo',
        scoreImpact: combo.severity == 'critical' ? 20 : 10,
      ));
      totalScore += combo.severity == 'critical' ? 20 : 10;
    }

    // ── 4. EXCESSIVE PERMISSIONS ──
    final excessMsg = VulnerabilityDatabase.checkExcessivePermissions(app.permissions.length);
    if (excessMsg != null) {
      findings.add(ThreatFinding(
        title: 'Aşa köp rugsat',
        description: excessMsg,
        severity: app.permissions.length >= 40 ? 'high' : 'medium',
        category: 'excessive_perms',
        scoreImpact: app.permissions.length >= 40 ? 15 : 8,
      ));
      totalScore += app.permissions.length >= 40 ? 15 : 8;
    }

    // ── 5. SPECIFIC DANGEROUS PERMISSIONS ──
    if (app.permissions.contains('android.permission.BIND_DEVICE_ADMIN')) {
      findings.add(const ThreatFinding(
        title: 'Enjam dolandyryjysy rugsady',
        description: 'Bu programma enjamyňyzy doly dolandyryp biler. Ransomware üçin ulanylýar.',
        severity: 'critical',
        category: 'dangerous_perm',
        scoreImpact: 20,
      ));
      totalScore += 20;
    }
    if (app.permissions.contains('android.permission.BIND_ACCESSIBILITY_SERVICE')) {
      findings.add(const ThreatFinding(
        title: 'Elýeterlilik hyzmaty (Accessibility)',
        description: 'Ekrandaky ähli maglumatlary okap bilýär. Keylogger we banking troýanlar ulanýar.',
        severity: 'critical',
        category: 'dangerous_perm',
        scoreImpact: 20,
      ));
      totalScore += 20;
    }
    if (app.permissions.contains('android.permission.SYSTEM_ALERT_WINDOW')) {
      findings.add(const ThreatFinding(
        title: 'Beýleki programmalaryň üstünde görkezmek',
        description: 'Overlay hüjümleri (tapjacking) üçin ulanylýar.',
        severity: 'high',
        category: 'dangerous_perm',
        scoreImpact: 10,
      ));
      totalScore += 10;
    }

    // ── 6. NORMALIZE SCORE ──
    final maxPossible = (app.permissions.length * 25) + 50 + (combos.length * 20) + 40;
    final normalizedScore = maxPossible > 0
        ? (totalScore / maxPossible * 100).round().clamp(0, 100)
        : 0;

    // ── 7. ASSIGN RESULTS ──
    app.riskScore = normalizedScore;
    app.dangerousPermCount = dangerousCount;
    app.analyzedPermissions = analyzed;
    app.threats = findings;
    app.isScanned = true;

    if (malware != null || normalizedScore >= 70) {
      app.riskLevel = 'critical';
    } else if (normalizedScore >= 45) {
      app.riskLevel = 'high';
    } else if (normalizedScore >= 20) {
      app.riskLevel = 'medium';
    } else {
      app.riskLevel = 'low';
    }
  }

  String _comboTitle(String threatType) {
    switch (threatType) {
      case 'trojan': return 'Troýan şübhesi';
      case 'banking_trojan': return 'Bank troýan şübhesi';
      case 'spyware': return 'Gözegçilik programma şübhesi';
      case 'stalkerware': return 'Yzarlaýjy programma şübhesi';
      case 'spam_spreader': return 'Spam ýaýradyjy şübhesi';
      case 'overlay_attack': return 'Overlay hüjüm şübhesi';
      case 'dropper': return 'Zyýanly ýükleýji (Dropper) şübhesi';
      case 'data_exfiltration': return 'Maglumat ogurlygy şübhesi';
      case 'persistence': return 'Gizlin işleýän programma';
      case 'surveillance': return 'Gözegçilik enjamlary şübhesi';
      case 'info_stealer': return 'Maglumat ogurlaýjy şübhesi';
      case 'ransomware': return 'Ransomware şübhesi';
      default: return 'Şübheli rugsat kombinasiýasy';
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
    await _channel.invokeMethod('openPermissionSettings', {'packageName': packageName});
  }
}
