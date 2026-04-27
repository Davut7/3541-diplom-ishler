import 'package:flutter/material.dart';
import '../models/app_info.dart';
import '../services/app_scanner.dart';

class AppDetailScreen extends StatelessWidget {
  final AppInfo app;
  final AppScanner scanner;

  const AppDetailScreen({super.key, required this.app, required this.scanner});

  Color _getRiskColor(String riskLevel) {
    switch (riskLevel) {
      case 'critical':
        return Colors.red;
      case 'high':
        return Colors.orange;
      case 'medium':
        return Colors.amber.shade700;
      case 'low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _getRiskText(String riskLevel) {
    switch (riskLevel) {
      case 'critical':
        return 'HOWPLY';
      case 'high':
        return 'ÝOKARY';
      case 'medium':
        return 'ORTA';
      case 'low':
        return 'HOWPSUZ';
      default:
        return 'NÄBELLI';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // App header
            SliverToBoxAdapter(child: _buildAppHeader(context)),
            // Risk score
            SliverToBoxAdapter(child: _buildRiskScore()),
            // Actions
            SliverToBoxAdapter(child: _buildActions(context)),
            // Permissions list
            SliverToBoxAdapter(child: _buildPermissionsHeader()),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) =>
                    _buildPermissionItem(app.analyzedPermissions[index]),
                childCount: app.analyzedPermissions.length,
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],
        ),
      ),
    );
  }

  Widget _buildAppHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
              ),
              const Expanded(
                child: Text(
                  'Programma Maglumaty',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(width: 48),
            ],
          ),
          const SizedBox(height: 20),
          // App icon and name
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF374151),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: _getRiskColor(app.riskLevel).withOpacity(0.3),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: app.iconBytes != null
                  ? Image.memory(app.iconBytes!, fit: BoxFit.cover)
                  : const Icon(Icons.android, color: Colors.grey, size: 40),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            app.appName,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            app.packageName,
            style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          // Info chips
          Wrap(
            spacing: 8,
            runSpacing: 8,
            alignment: WrapAlignment.center,
            children: [
              _infoChip(Icons.info_outline, 'v${app.versionName}'),
              _infoChip(Icons.sd_storage, app.formattedSize),
              _infoChip(Icons.lock, '${app.permissions.length} rugsat'),
              if (app.isSystemApp) _infoChip(Icons.android, 'Ulgam'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF374151),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.grey.shade400),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(color: Colors.grey.shade300, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildRiskScore() {
    if (!app.isScanned) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _getRiskColor(app.riskLevel).withOpacity(0.3),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Risk circle
              SizedBox(
                width: 100,
                height: 100,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 100,
                      height: 100,
                      child: CircularProgressIndicator(
                        value: app.riskScore / 100,
                        strokeWidth: 8,
                        backgroundColor: const Color(0xFF374151),
                        valueColor: AlwaysStoppedAnimation(
                          _getRiskColor(app.riskLevel),
                        ),
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '${app.riskScore}%',
                          style: TextStyle(
                            color: _getRiskColor(app.riskLevel),
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Töwekgelçilik',
                          style: TextStyle(
                            color: Colors.grey.shade500,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              // Risk details
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: _getRiskColor(app.riskLevel).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: _getRiskColor(app.riskLevel).withOpacity(0.4),
                      ),
                    ),
                    child: Text(
                      _getRiskText(app.riskLevel),
                      style: TextStyle(
                        color: _getRiskColor(app.riskLevel),
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  _riskDetailRow(
                      'Howply rugsatlar', '${app.dangerousPermCount}',
                      app.dangerousPermCount > 0 ? Colors.red : Colors.green),
                  const SizedBox(height: 4),
                  _riskDetailRow(
                      'Jemi rugsatlar', '${app.permissions.length}',
                      Colors.grey.shade400),
                ],
              ),
            ],
          ),
          if (app.riskLevel == 'critical') ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.red.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning, color: Colors.red, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Bu programma howply rugsatlary bar. Aýyrmagy maslahat berýäris!',
                      style: TextStyle(
                        color: Colors.red.shade300,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _riskDetailRow(String label, String value, Color valueColor) {
    return Row(
      children: [
        Text(label, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
        const SizedBox(width: 8),
        Text(
          value,
          style: TextStyle(
            color: valueColor,
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  Widget _buildActions(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: _actionButton(
              icon: Icons.delete_outline,
              label: 'Pozmak',
              color: Colors.red,
              onTap: () => _confirmUninstall(context),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _actionButton(
              icon: Icons.stop_circle_outlined,
              label: 'Durdurmak',
              color: Colors.orange,
              onTap: () => scanner.forceStopApp(app.packageName),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _actionButton(
              icon: Icons.lock_open,
              label: 'Rugsatlar',
              color: const Color(0xFF3B82F6),
              onTap: () => scanner.openPermissionSettings(app.packageName),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _actionButton(
              icon: Icons.settings,
              label: 'Sazlamalar',
              color: Colors.grey,
              onTap: () => scanner.openAppSettings(app.packageName),
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmUninstall(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Programmany pozmak',
          style: TextStyle(color: Colors.white),
        ),
        content: Text(
          '${app.appName} programmasyny pozmak isleýärsiňizmi?',
          style: TextStyle(color: Colors.grey.shade400),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Ýok', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              scanner.uninstallApp(app.packageName);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Hawa, poz', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Widget _buildPermissionsHeader() {
    if (app.analyzedPermissions.isEmpty) {
      return Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(Icons.check_circle, color: Colors.green.shade400, size: 48),
            const SizedBox(height: 12),
            const Text(
              'Rugsat tapylmady',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
            Text(
              'Bu programma hiç hili rugsat talap etmeýär',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Row(
        children: [
          const Icon(Icons.lock, color: Color(0xFF10B981), size: 20),
          const SizedBox(width: 8),
          Text(
            'Rugsatlar (${app.analyzedPermissions.length})',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPermissionItem(PermissionInfo perm) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 3),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(10),
        border: Border(
          left: BorderSide(
            color: _getRiskColor(perm.riskLevel),
            width: 3,
          ),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: _getRiskColor(perm.riskLevel).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              _getPermIcon(perm.category),
              color: _getRiskColor(perm.riskLevel),
              size: 18,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  perm.shortName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
                Text(
                  perm.description,
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: _getRiskColor(perm.riskLevel).withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              perm.category,
              style: TextStyle(
                color: _getRiskColor(perm.riskLevel),
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getPermIcon(String category) {
    switch (category) {
      case 'SMS':
        return Icons.sms;
      case 'Telefon':
        return Icons.phone;
      case 'Kamera':
        return Icons.camera_alt;
      case 'Mikrofon':
        return Icons.mic;
      case 'Ýerleşiş':
        return Icons.location_on;
      case 'Aragatnaşyklar':
        return Icons.contacts;
      case 'Ammar':
        return Icons.folder;
      case 'Tor':
        return Icons.wifi;
      case 'Ulgam':
        return Icons.settings;
      case 'Birikmeler':
        return Icons.bluetooth;
      case 'Bildirişler':
        return Icons.notifications;
      case 'Senenama':
        return Icons.calendar_today;
      case 'Howpsuzlyk':
        return Icons.security;
      case 'Enjam':
        return Icons.devices;
      default:
        return Icons.extension;
    }
  }
}
