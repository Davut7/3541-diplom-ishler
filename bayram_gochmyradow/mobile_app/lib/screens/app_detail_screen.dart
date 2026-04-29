import 'package:flutter/material.dart';
import '../models/app_info.dart';
import '../services/app_scanner.dart';
import '../services/vulnerability_database.dart';

class AppDetailScreen extends StatelessWidget {
  final AppInfo app;
  final AppScanner scanner;

  const AppDetailScreen({super.key, required this.app, required this.scanner});

  Color _riskColor(String level) {
    switch (level) {
      case 'critical': return const Color(0xFFEF4444);
      case 'high': return const Color(0xFFF97316);
      case 'medium': return const Color(0xFFEAB308);
      case 'low': return const Color(0xFF22C55E);
      default: return const Color(0xFF6B7280);
    }
  }

  String _riskText(String level) {
    switch (level) {
      case 'critical': return 'HOWPLY';
      case 'high': return 'ÝOKARY';
      case 'medium': return 'ORTA';
      case 'low': return 'HOWPSUZ';
      default: return 'NÄBELLI';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(child: _header(context)),
            SliverToBoxAdapter(child: _riskCard()),
            SliverToBoxAdapter(child: _actions(context)),
            if (app.threats.isNotEmpty) SliverToBoxAdapter(child: _threatsSection()),
            SliverToBoxAdapter(child: _permissionsHeader()),
            SliverList(delegate: SliverChildBuilderDelegate(
              (_, i) => _permItem(app.analyzedPermissions[i]),
              childCount: app.analyzedPermissions.length,
            )),
            const SliverToBoxAdapter(child: SizedBox(height: 32)),
          ],
        ),
      ),
    );
  }

  Widget _header(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(8, 8, 8, 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [_riskColor(app.riskLevel).withOpacity(0.15), const Color(0xFF0F172A)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        children: [
          // Nav bar
          Row(
            children: [
              IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20)),
              const Expanded(child: Text('Programma Maglumaty', style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w700), textAlign: TextAlign.center)),
              const SizedBox(width: 48),
            ],
          ),
          const SizedBox(height: 16),
          // App icon
          Container(
            width: 80, height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF374151),
              borderRadius: BorderRadius.circular(22),
              boxShadow: [BoxShadow(color: _riskColor(app.riskLevel).withOpacity(0.3), blurRadius: 24, spreadRadius: 2)],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: app.iconBytes != null ? Image.memory(app.iconBytes!, fit: BoxFit.cover) : const Icon(Icons.android, color: Colors.grey, size: 40),
            ),
          ),
          const SizedBox(height: 14),
          Text(app.appName, style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
          const SizedBox(height: 4),
          Text(app.packageName, style: TextStyle(color: Colors.grey.shade500, fontSize: 12), textAlign: TextAlign.center),
          const SizedBox(height: 14),
          // Info chips
          Wrap(spacing: 8, runSpacing: 8, alignment: WrapAlignment.center, children: [
            _chip(Icons.tag, 'v${app.versionName}'),
            _chip(Icons.sd_storage, app.formattedSize),
            _chip(Icons.lock, '${app.permissions.length} rugsat'),
            if (app.isSystemApp) _chip(Icons.android, 'Ulgam', color: const Color(0xFF3B82F6)),
          ]),
        ],
      ),
    );
  }

  Widget _chip(IconData icon, String text, {Color color = const Color(0xFF6B7280)}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(20)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 13, color: color),
        const SizedBox(width: 5),
        Text(text, style: TextStyle(color: Colors.grey.shade300, fontSize: 12)),
      ]),
    );
  }

  Widget _riskCard() {
    if (!app.isScanned) return const SizedBox.shrink();
    final color = _riskColor(app.riskLevel);

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          // Score circle
          SizedBox(
            width: 90, height: 90,
            child: Stack(alignment: Alignment.center, children: [
              SizedBox(width: 90, height: 90, child: CircularProgressIndicator(
                value: app.riskScore / 100, strokeWidth: 7,
                backgroundColor: const Color(0xFF374151),
                valueColor: AlwaysStoppedAnimation(color),
                strokeCap: StrokeCap.round,
              )),
              Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Text('${app.riskScore}%', style: TextStyle(color: color, fontSize: 22, fontWeight: FontWeight.w800)),
                Text('Howp', style: TextStyle(color: Colors.grey.shade500, fontSize: 10)),
              ]),
            ]),
          ),
          const SizedBox(width: 20),
          // Details
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(20), border: Border.all(color: color.withOpacity(0.4))),
              child: Text(_riskText(app.riskLevel), style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 13)),
            ),
            const SizedBox(height: 14),
            _detailRow('Howply rugsatlar', '${app.dangerousPermCount}', app.dangerousPermCount > 0 ? const Color(0xFFEF4444) : const Color(0xFF22C55E)),
            const SizedBox(height: 6),
            _detailRow('Tapylan howplar', '${app.threats.length}', app.threats.isNotEmpty ? const Color(0xFFEF4444) : const Color(0xFF22C55E)),
            const SizedBox(height: 6),
            _detailRow('Jemi rugsatlar', '${app.permissions.length}', Colors.grey.shade400),
          ])),
        ],
      ),
    );
  }

  Widget _detailRow(String label, String value, Color valueColor) {
    return Row(children: [
      Text(label, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
      const Spacer(),
      Text(value, style: TextStyle(color: valueColor, fontWeight: FontWeight.w700, fontSize: 14)),
    ]);
  }

  Widget _actions(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(children: [
        Expanded(child: _actionBtn(Icons.delete_outline, 'Pozmak', const Color(0xFFEF4444), () => _confirmUninstall(context))),
        const SizedBox(width: 8),
        Expanded(child: _actionBtn(Icons.stop_circle_outlined, 'Durdurmak', const Color(0xFFF97316), () => scanner.forceStopApp(app.packageName))),
        const SizedBox(width: 8),
        Expanded(child: _actionBtn(Icons.lock_open, 'Rugsatlar', const Color(0xFF3B82F6), () => scanner.openPermissionSettings(app.packageName))),
        const SizedBox(width: 8),
        Expanded(child: _actionBtn(Icons.settings, 'Sazlamalar', const Color(0xFF6B7280), () => scanner.openAppSettings(app.packageName))),
      ]),
    );
  }

  Widget _actionBtn(IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(14), border: Border.all(color: color.withOpacity(0.25))),
        child: Column(children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600)),
        ]),
      ),
    );
  }

  void _confirmUninstall(BuildContext context) {
    showDialog(context: context, builder: (ctx) => AlertDialog(
      backgroundColor: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Text('Programmany pozmak', style: TextStyle(color: Colors.white)),
      content: Text('${app.appName} programmasyny pozmak isleýärsiňizmi?', style: TextStyle(color: Colors.grey.shade400)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Ýok', style: TextStyle(color: Colors.grey))),
        ElevatedButton(
          onPressed: () { Navigator.pop(ctx); scanner.uninstallApp(app.packageName); },
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
          child: const Text('Hawa, poz', style: TextStyle(color: Colors.white)),
        ),
      ],
    ));
  }

  // ============================================
  // THREATS SECTION (NEW)
  // ============================================

  Widget _threatsSection() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            const Icon(Icons.bug_report, color: Color(0xFFEF4444), size: 20),
            const SizedBox(width: 8),
            Text('Tapylan howplar (${app.threats.length})', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
          ]),
          const SizedBox(height: 10),
          ...app.threats.map((t) => _threatCard(t)),
        ],
      ),
    );
  }

  Widget _threatCard(ThreatFinding threat) {
    final color = _riskColor(threat.severity);
    IconData icon;
    switch (threat.category) {
      case 'malware': icon = Icons.gpp_bad; break;
      case 'permission_combo': icon = Icons.link; break;
      case 'cve': icon = Icons.security; break;
      case 'excessive_perms': icon = Icons.format_list_numbered; break;
      case 'dangerous_perm': icon = Icons.dangerous; break;
      default: icon = Icons.warning;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(threat.title, style: TextStyle(color: color, fontWeight: FontWeight.w700, fontSize: 13)),
            const SizedBox(height: 4),
            Text(threat.description, style: TextStyle(color: Colors.grey.shade400, fontSize: 12, height: 1.4)),
          ])),
        ],
      ),
    );
  }

  // ============================================
  // PERMISSIONS SECTION
  // ============================================

  Widget _permissionsHeader() {
    if (app.analyzedPermissions.isEmpty) {
      return Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),
        child: Column(children: [
          Icon(Icons.verified_user, color: Colors.green.shade400, size: 48),
          const SizedBox(height: 12),
          const Text('Rugsat tapylmady', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          Text('Bu programma hiç hili rugsat talap etmeýär', style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
        ]),
      );
    }

    // Group by category
    final categories = <String, int>{};
    for (final p in app.analyzedPermissions) {
      categories[p.category] = (categories[p.category] ?? 0) + 1;
    }

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Icon(Icons.lock, color: Color(0xFF10B981), size: 20),
          const SizedBox(width: 8),
          Text('Rugsatlar (${app.analyzedPermissions.length})', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
        ]),
        const SizedBox(height: 10),
        // Category tags
        Wrap(spacing: 6, runSpacing: 6, children: categories.entries.map((e) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(color: const Color(0xFF374151), borderRadius: BorderRadius.circular(12)),
          child: Text('${e.key}: ${e.value}', style: TextStyle(color: Colors.grey.shade400, fontSize: 11)),
        )).toList()),
      ]),
    );
  }

  Widget _permItem(PermissionInfo perm) {
    final color = _riskColor(perm.riskLevel);
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 3),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: color, width: 3)),
      ),
      child: Row(children: [
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
          child: Icon(_permIcon(perm.category), color: color, size: 18),
        ),
        const SizedBox(width: 10),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(perm.shortName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
          Text(perm.description, style: TextStyle(color: Colors.grey.shade500, fontSize: 11)),
        ])),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(10)),
          child: Text(perm.category, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w600)),
        ),
      ]),
    );
  }

  IconData _permIcon(String cat) {
    switch (cat) {
      case 'SMS': return Icons.sms;
      case 'Telefon': return Icons.phone;
      case 'Kamera': return Icons.camera_alt;
      case 'Mikrofon': return Icons.mic;
      case 'Ýerleşiş': return Icons.location_on;
      case 'Aragatnaşyklar': return Icons.contacts;
      case 'Ammar': return Icons.folder;
      case 'Tor': return Icons.wifi;
      case 'Ulgam': return Icons.settings;
      case 'Birikmeler': return Icons.bluetooth;
      case 'Bildirişler': return Icons.notifications;
      case 'Senenama': return Icons.calendar_today;
      case 'Howpsuzlyk': return Icons.security;
      case 'Enjam': return Icons.devices;
      default: return Icons.extension;
    }
  }
}
