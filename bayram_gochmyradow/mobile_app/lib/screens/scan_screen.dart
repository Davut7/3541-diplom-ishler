import 'package:flutter/material.dart';
import '../models/app_info.dart';
import '../services/app_scanner.dart';
import 'app_detail_screen.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> with TickerProviderStateMixin {
  final AppScanner _scanner = AppScanner();
  List<AppInfo> _apps = [];
  List<AppInfo> _filteredApps = [];
  bool _isLoading = true;
  bool _isScanning = false;
  int _scannedCount = 0;
  bool _showSystemApps = false;
  String _searchQuery = '';
  String _filterRisk = 'all';
  String _sortBy = 'name'; // name, risk, size
  String _error = '';

  int _totalApps = 0;
  int _safeApps = 0;
  int _warningApps = 0;
  int _dangerApps = 0;
  int _totalThreats = 0;

  late AnimationController _scanAnimController;
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _scanAnimController = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
    _pulseController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500))..repeat(reverse: true);
    _loadApps();
  }

  @override
  void dispose() {
    _scanAnimController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _loadApps() async {
    setState(() { _isLoading = true; _error = ''; });
    try {
      final apps = await _scanner.getInstalledApps();
      setState(() { _apps = apps; _isLoading = false; _applyFilters(); });
    } catch (e) {
      setState(() { _error = 'Programmalary ýükläp bolmady: $e'; _isLoading = false; });
    }
  }

  void _applyFilters() {
    var filtered = _apps.where((app) {
      if (!_showSystemApps && app.isSystemApp) return false;
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        if (!app.appName.toLowerCase().contains(q) && !app.packageName.toLowerCase().contains(q)) return false;
      }
      if (_filterRisk != 'all' && app.isScanned && app.riskLevel != _filterRisk) return false;
      return true;
    }).toList();

    if (_sortBy == 'risk' && _apps.any((a) => a.isScanned)) {
      const order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3, 'unknown': 4};
      filtered.sort((a, b) => (order[a.riskLevel] ?? 4).compareTo(order[b.riskLevel] ?? 4));
    } else if (_sortBy == 'size') {
      filtered.sort((a, b) => b.appSize.compareTo(a.appSize));
    }

    setState(() { _filteredApps = filtered; });
  }

  Future<void> _scanAllApps() async {
    setState(() { _isScanning = true; _scannedCount = 0; _safeApps = 0; _warningApps = 0; _dangerApps = 0; _totalThreats = 0; });

    final appsToScan = _apps.where((app) => !_showSystemApps ? !app.isSystemApp : true).toList();
    _totalApps = appsToScan.length;

    for (int i = 0; i < appsToScan.length; i++) {
      await Future.delayed(const Duration(milliseconds: 100));
      _scanner.analyzeApp(appsToScan[i]);

      if (appsToScan[i].riskLevel == 'low') _safeApps++;
      else if (appsToScan[i].riskLevel == 'medium') _warningApps++;
      else if (appsToScan[i].riskLevel == 'high') _warningApps++;
      else if (appsToScan[i].riskLevel == 'critical') _dangerApps++;

      _totalThreats += appsToScan[i].threats.length;

      setState(() { _scannedCount = i + 1; });
    }

    setState(() { _isScanning = false; _sortBy = 'risk'; _applyFilters(); });
  }

  Color _getRiskColor(String level) {
    switch (level) {
      case 'critical': return const Color(0xFFEF4444);
      case 'high': return const Color(0xFFF97316);
      case 'medium': return const Color(0xFFEAB308);
      case 'low': return const Color(0xFF22C55E);
      default: return const Color(0xFF6B7280);
    }
  }

  String _getRiskText(String level) {
    switch (level) {
      case 'critical': return 'Howply';
      case 'high': return 'Ýokary';
      case 'medium': return 'Orta';
      case 'low': return 'Howpsuz';
      default: return 'Näbelli';
    }
  }

  IconData _getRiskIcon(String level) {
    switch (level) {
      case 'critical': return Icons.gpp_bad;
      case 'high': return Icons.warning_amber_rounded;
      case 'medium': return Icons.info_outline;
      case 'low': return Icons.verified_user;
      default: return Icons.help_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            if (_isScanning) _buildScanProgress(),
            if (!_isLoading && !_isScanning && _apps.any((a) => a.isScanned)) _buildStats(),
            _buildSearchAndFilter(),
            Expanded(child: _buildBody()),
          ],
        ),
      ),
      floatingActionButton: !_isLoading && !_isScanning
          ? FloatingActionButton.extended(
              onPressed: _scanAllApps,
              backgroundColor: const Color(0xFF10B981),
              icon: AnimatedBuilder(
                animation: _pulseController,
                builder: (_, child) => Transform.scale(
                  scale: _apps.any((a) => a.isScanned) ? 1.0 : 1.0 + _pulseController.value * 0.15,
                  child: child,
                ),
                child: const Icon(Icons.shield, color: Colors.white, size: 22),
              ),
              label: Text(
                _apps.any((a) => a.isScanned) ? 'Täzeden Skanla' : 'Skanla',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15),
              ),
            )
          : null,
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 12, 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [const Color(0xFF1E293B), const Color(0xFF0F172A).withOpacity(0.95)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF059669)]),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.3), blurRadius: 12)],
            ),
            child: const Icon(Icons.security, color: Colors.white, size: 26),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Howpsuzlyk Skaneri', style: TextStyle(color: Colors.white, fontSize: 21, fontWeight: FontWeight.w800, letterSpacing: -0.5)),
                const SizedBox(height: 2),
                Text(
                  _isLoading ? 'Programmalar ýüklenýär...'
                    : _isScanning ? 'Skanlanýar...'
                    : '${_filteredApps.length} programma',
                  style: TextStyle(color: Colors.grey.shade400, fontSize: 13),
                ),
              ],
            ),
          ),
          // Sort button
          if (_apps.any((a) => a.isScanned))
            PopupMenuButton<String>(
              icon: Icon(Icons.sort, color: Colors.grey.shade400),
              color: const Color(0xFF1E293B),
              onSelected: (v) { setState(() { _sortBy = v; _applyFilters(); }); },
              itemBuilder: (_) => [
                PopupMenuItem(value: 'risk', child: Text('Howp boýunça', style: TextStyle(color: _sortBy == 'risk' ? const Color(0xFF10B981) : Colors.white, fontSize: 14))),
                PopupMenuItem(value: 'name', child: Text('At boýunça', style: TextStyle(color: _sortBy == 'name' ? const Color(0xFF10B981) : Colors.white, fontSize: 14))),
                PopupMenuItem(value: 'size', child: Text('Ölçeg boýunça', style: TextStyle(color: _sortBy == 'size' ? const Color(0xFF10B981) : Colors.white, fontSize: 14))),
              ],
            ),
          IconButton(
            onPressed: () { setState(() { _showSystemApps = !_showSystemApps; _applyFilters(); }); },
            icon: Icon(_showSystemApps ? Icons.apps : Icons.app_shortcut, color: _showSystemApps ? const Color(0xFF10B981) : Colors.grey.shade500, size: 22),
            tooltip: _showSystemApps ? 'Ulgam gizle' : 'Ulgam görkez',
          ),
          IconButton(onPressed: _loadApps, icon: Icon(Icons.refresh, color: Colors.grey.shade500, size: 22)),
        ],
      ),
    );
  }

  Widget _buildScanProgress() {
    final progress = _totalApps > 0 ? _scannedCount / _totalApps : 0.0;
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [const Color(0xFF10B981).withOpacity(0.1), const Color(0xFF1E293B)]),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              RotationTransition(turns: _scanAnimController, child: const Icon(Icons.radar, color: Color(0xFF10B981), size: 22)),
              const SizedBox(width: 12),
              Expanded(child: Text('$_scannedCount / $_totalApps programma', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14))),
              Text('${(progress * 100).toInt()}%', style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.w800, fontSize: 16)),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(value: progress, backgroundColor: const Color(0xFF374151), valueColor: const AlwaysStoppedAnimation(Color(0xFF10B981)), minHeight: 6),
          ),
          if (_totalThreats > 0) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.warning_amber, color: Color(0xFFEF4444), size: 14),
                const SizedBox(width: 6),
                Text('$_totalThreats howp tapyldy', style: const TextStyle(color: Color(0xFFEF4444), fontSize: 12, fontWeight: FontWeight.w600)),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStats() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Row(
        children: [
          _statCard('Howpsuz', _safeApps, const Color(0xFF22C55E), Icons.verified_user),
          const SizedBox(width: 8),
          _statCard('Duýduryş', _warningApps, const Color(0xFFF97316), Icons.warning_amber_rounded),
          const SizedBox(width: 8),
          _statCard('Howply', _dangerApps, const Color(0xFFEF4444), Icons.gpp_bad),
          const SizedBox(width: 8),
          _statCard('Howplar', _totalThreats, const Color(0xFF8B5CF6), Icons.bug_report),
        ],
      ),
    );
  }

  Widget _statCard(String label, int count, Color color, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 4),
            Text('$count', style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.w800)),
            Text(label, style: TextStyle(color: color.withOpacity(0.8), fontSize: 10, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchAndFilter() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Column(
        children: [
          TextField(
            onChanged: (v) { _searchQuery = v; _applyFilters(); },
            style: const TextStyle(color: Colors.white, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Programma gözle...',
              hintStyle: TextStyle(color: Colors.grey.shade600, fontSize: 14),
              prefixIcon: Icon(Icons.search, color: Colors.grey.shade600, size: 20),
              filled: true,
              fillColor: const Color(0xFF1E293B),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
            ),
          ),
          if (_apps.any((a) => a.isScanned)) ...[
            const SizedBox(height: 8),
            SizedBox(
              height: 32,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _chip('Hemmesi', 'all', const Color(0xFF10B981)),
                  _chip('Howpsuz', 'low', const Color(0xFF22C55E)),
                  _chip('Orta', 'medium', const Color(0xFFEAB308)),
                  _chip('Ýokary', 'high', const Color(0xFFF97316)),
                  _chip('Howply', 'critical', const Color(0xFFEF4444)),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _chip(String label, String value, Color color) {
    final sel = _filterRisk == value;
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: GestureDetector(
        onTap: () { setState(() { _filterRisk = value; _applyFilters(); }); },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: sel ? color.withOpacity(0.2) : const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: sel ? color : Colors.transparent, width: 1.5),
          ),
          child: Text(label, style: TextStyle(color: sel ? color : Colors.grey.shade500, fontSize: 12, fontWeight: FontWeight.w600)),
        ),
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        CircularProgressIndicator(color: Color(0xFF10B981), strokeWidth: 3),
        SizedBox(height: 16),
        Text('Programmalar ýüklenýär...', style: TextStyle(color: Colors.grey)),
      ]));
    }
    if (_error.isNotEmpty) {
      return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Icon(Icons.error_outline, color: Colors.red, size: 48),
        const SizedBox(height: 16),
        Text(_error, style: const TextStyle(color: Colors.red), textAlign: TextAlign.center),
        const SizedBox(height: 16),
        ElevatedButton.icon(onPressed: _loadApps, icon: const Icon(Icons.refresh), label: const Text('Täzeden synanyş')),
      ]));
    }
    if (_filteredApps.isEmpty) {
      return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(Icons.search_off, color: Colors.grey.shade600, size: 48),
        const SizedBox(height: 12),
        Text('Programma tapylmady', style: TextStyle(color: Colors.grey.shade500)),
      ]));
    }

    return RefreshIndicator(
      onRefresh: _loadApps,
      color: const Color(0xFF10B981),
      backgroundColor: const Color(0xFF1E293B),
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 80),
        itemCount: _filteredApps.length,
        itemBuilder: (ctx, i) => _appCard(_filteredApps[i]),
      ),
    );
  }

  Widget _appCard(AppInfo app) {
    final hasThreats = app.isScanned && app.threats.isNotEmpty;
    return GestureDetector(
      onTap: () {
        if (!app.isScanned) { _scanner.analyzeApp(app); setState(() {}); }
        Navigator.push(context, MaterialPageRoute(builder: (_) => AppDetailScreen(app: app, scanner: _scanner))).then((_) => setState(() {}));
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: hasThreats && app.riskLevel == 'critical'
              ? Border.all(color: const Color(0xFFEF4444).withOpacity(0.4), width: 1.5)
              : null,
        ),
        child: Row(
          children: [
            // Icon
            Container(
              width: 50, height: 50,
              decoration: BoxDecoration(color: const Color(0xFF374151), borderRadius: BorderRadius.circular(14)),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: app.iconBytes != null
                    ? Image.memory(app.iconBytes!, fit: BoxFit.cover)
                    : const Icon(Icons.android, color: Colors.grey, size: 28),
              ),
            ),
            const SizedBox(width: 12),
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(app.appName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 2),
                  Text(app.packageName, style: TextStyle(color: Colors.grey.shade600, fontSize: 11), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      _infoBadge(Icons.lock_outline, '${app.permissions.length}'),
                      const SizedBox(width: 8),
                      _infoBadge(Icons.sd_storage_outlined, app.formattedSize),
                      if (hasThreats) ...[
                        const SizedBox(width: 8),
                        _infoBadge(Icons.bug_report, '${app.threats.length}', color: const Color(0xFFEF4444)),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            // Risk badge
            if (app.isScanned)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: _getRiskColor(app.riskLevel).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _getRiskColor(app.riskLevel).withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    Icon(_getRiskIcon(app.riskLevel), size: 18, color: _getRiskColor(app.riskLevel)),
                    const SizedBox(height: 2),
                    Text(_getRiskText(app.riskLevel), style: TextStyle(color: _getRiskColor(app.riskLevel), fontSize: 10, fontWeight: FontWeight.w700)),
                  ],
                ),
              )
            else
              Icon(Icons.chevron_right, color: Colors.grey.shade600),
          ],
        ),
      ),
    );
  }

  Widget _infoBadge(IconData icon, String text, {Color color = const Color(0xFF6B7280)}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 12, color: color),
        const SizedBox(width: 3),
        Text(text, style: TextStyle(color: color, fontSize: 11)),
      ],
    );
  }
}
