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
  String _error = '';

  // Stats
  int _totalApps = 0;
  int _safeApps = 0;
  int _warningApps = 0;
  int _dangerApps = 0;

  late AnimationController _scanAnimController;

  @override
  void initState() {
    super.initState();
    _scanAnimController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
    _loadApps();
  }

  @override
  void dispose() {
    _scanAnimController.dispose();
    super.dispose();
  }

  Future<void> _loadApps() async {
    setState(() {
      _isLoading = true;
      _error = '';
    });

    try {
      final apps = await _scanner.getInstalledApps();
      setState(() {
        _apps = apps;
        _isLoading = false;
        _applyFilters();
      });
    } catch (e) {
      setState(() {
        _error = 'Programmalary ýükläp bolmady: $e';
        _isLoading = false;
      });
    }
  }

  void _applyFilters() {
    var filtered = _apps.where((app) {
      if (!_showSystemApps && app.isSystemApp) return false;
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        if (!app.appName.toLowerCase().contains(query) &&
            !app.packageName.toLowerCase().contains(query)) {
          return false;
        }
      }
      if (_filterRisk != 'all' && app.isScanned && app.riskLevel != _filterRisk) {
        return false;
      }
      return true;
    }).toList();

    setState(() {
      _filteredApps = filtered;
    });
  }

  Future<void> _scanAllApps() async {
    setState(() {
      _isScanning = true;
      _scannedCount = 0;
      _safeApps = 0;
      _warningApps = 0;
      _dangerApps = 0;
    });

    final appsToScan =
        _apps.where((app) => !_showSystemApps ? !app.isSystemApp : true).toList();
    _totalApps = appsToScan.length;

    for (int i = 0; i < appsToScan.length; i++) {
      await Future.delayed(const Duration(milliseconds: 150));
      _scanner.analyzeApp(appsToScan[i]);

      if (appsToScan[i].riskLevel == 'low') _safeApps++;
      if (appsToScan[i].riskLevel == 'medium' || appsToScan[i].riskLevel == 'high') {
        _warningApps++;
      }
      if (appsToScan[i].riskLevel == 'critical') _dangerApps++;

      setState(() {
        _scannedCount = i + 1;
      });
    }

    setState(() {
      _isScanning = false;
      _applyFilters();
    });
  }

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
        return 'Howply';
      case 'high':
        return 'Ýokary';
      case 'medium':
        return 'Orta';
      case 'low':
        return 'Howpsuz';
      default:
        return 'Barlanmadyk';
    }
  }

  IconData _getRiskIcon(String riskLevel) {
    switch (riskLevel) {
      case 'critical':
        return Icons.dangerous;
      case 'high':
        return Icons.warning_amber;
      case 'medium':
        return Icons.info_outline;
      case 'low':
        return Icons.check_circle;
      default:
        return Icons.help_outline;
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
            if (!_isLoading && !_isScanning && _apps.any((a) => a.isScanned))
              _buildStats(),
            _buildSearchAndFilter(),
            Expanded(child: _buildBody()),
          ],
        ),
      ),
      floatingActionButton: !_isLoading && !_isScanning
          ? FloatingActionButton.extended(
              onPressed: _scanAllApps,
              backgroundColor: const Color(0xFF10B981),
              icon: const Icon(Icons.security, color: Colors.white),
              label: Text(
                _apps.any((a) => a.isScanned) ? 'Täzeden Skanla' : 'Hemmesini Skanla',
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold),
              ),
            )
          : null,
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.shield, color: Color(0xFF10B981), size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Howpsuzlyk Skaneri',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  _isLoading
                      ? 'Programmalar ýüklenýär...'
                      : '${_filteredApps.length} programma tapyldy',
                  style: TextStyle(
                    color: Colors.grey.shade400,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {
              setState(() {
                _showSystemApps = !_showSystemApps;
                _applyFilters();
              });
            },
            icon: Icon(
              _showSystemApps ? Icons.apps : Icons.app_shortcut,
              color: _showSystemApps ? const Color(0xFF10B981) : Colors.grey,
            ),
            tooltip: _showSystemApps ? 'Ulgam programmalary gizle' : 'Ulgam programmalary görkez',
          ),
          IconButton(
            onPressed: _loadApps,
            icon: const Icon(Icons.refresh, color: Colors.grey),
            tooltip: 'Täzele',
          ),
        ],
      ),
    );
  }

  Widget _buildScanProgress() {
    final progress = _totalApps > 0 ? _scannedCount / _totalApps : 0.0;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              RotationTransition(
                turns: _scanAnimController,
                child: const Icon(Icons.radar, color: Color(0xFF10B981), size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Skanlanýar... $_scannedCount / $_totalApps',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Text(
                '${(progress * 100).toInt()}%',
                style: const TextStyle(
                  color: Color(0xFF10B981),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: const Color(0xFF374151),
              valueColor: const AlwaysStoppedAnimation(Color(0xFF10B981)),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStats() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          _buildStatCard('Howpsuz', _safeApps.toString(), Colors.green, Icons.check_circle),
          const SizedBox(width: 8),
          _buildStatCard('Duýduryş', _warningApps.toString(), Colors.orange, Icons.warning),
          const SizedBox(width: 8),
          _buildStatCard('Howply', _dangerApps.toString(), Colors.red, Icons.dangerous),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String count, Color color, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
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
              count,
              style: TextStyle(
                color: color,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                color: color.withOpacity(0.8),
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchAndFilter() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // Search bar
          TextField(
            onChanged: (value) {
              _searchQuery = value;
              _applyFilters();
            },
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Programma gözle...',
              hintStyle: TextStyle(color: Colors.grey.shade600),
              prefixIcon: Icon(Icons.search, color: Colors.grey.shade600),
              filled: true,
              fillColor: const Color(0xFF1E293B),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
          const SizedBox(height: 8),
          // Risk filter chips
          if (_apps.any((a) => a.isScanned))
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('Hemmesi', 'all'),
                  _buildFilterChip('Howpsuz', 'low'),
                  _buildFilterChip('Orta', 'medium'),
                  _buildFilterChip('Ýokary', 'high'),
                  _buildFilterChip('Howply', 'critical'),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _filterRisk == value;
    Color chipColor;
    switch (value) {
      case 'low':
        chipColor = Colors.green;
        break;
      case 'medium':
        chipColor = Colors.amber.shade700;
        break;
      case 'high':
        chipColor = Colors.orange;
        break;
      case 'critical':
        chipColor = Colors.red;
        break;
      default:
        chipColor = const Color(0xFF10B981);
    }

    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.grey.shade400,
            fontSize: 12,
          ),
        ),
        selected: isSelected,
        onSelected: (_) {
          setState(() {
            _filterRisk = value;
            _applyFilters();
          });
        },
        backgroundColor: const Color(0xFF1E293B),
        selectedColor: chipColor.withOpacity(0.3),
        side: BorderSide(
          color: isSelected ? chipColor : Colors.transparent,
        ),
        showCheckmark: false,
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: Color(0xFF10B981)),
            SizedBox(height: 16),
            Text(
              'Programmalar ýüklenýär...',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }

    if (_error.isNotEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 48),
            const SizedBox(height: 16),
            Text(_error, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadApps,
              child: const Text('Täzeden synanyş'),
            ),
          ],
        ),
      );
    }

    if (_filteredApps.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, color: Colors.grey.shade600, size: 48),
            const SizedBox(height: 16),
            Text(
              'Programma tapylmady',
              style: TextStyle(color: Colors.grey.shade500),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      itemCount: _filteredApps.length,
      itemBuilder: (context, index) => _buildAppCard(_filteredApps[index]),
    );
  }

  Widget _buildAppCard(AppInfo app) {
    return GestureDetector(
      onTap: () {
        if (!app.isScanned) {
          _scanner.analyzeApp(app);
          setState(() {});
        }
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AppDetailScreen(app: app, scanner: _scanner),
          ),
        ).then((_) => setState(() {}));
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(14),
          border: app.isScanned && app.riskLevel == 'critical'
              ? Border.all(color: Colors.red.withOpacity(0.4))
              : null,
        ),
        child: Row(
          children: [
            // App icon
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFF374151),
                borderRadius: BorderRadius.circular(12),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: app.iconBytes != null
                    ? Image.memory(app.iconBytes!, fit: BoxFit.cover)
                    : const Icon(Icons.android, color: Colors.grey, size: 28),
              ),
            ),
            const SizedBox(width: 12),
            // App info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    app.appName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    app.packageName,
                    style: TextStyle(
                      color: Colors.grey.shade500,
                      fontSize: 11,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.lock_outline,
                          size: 12, color: Colors.grey.shade600),
                      const SizedBox(width: 4),
                      Text(
                        '${app.permissions.length} rugsat',
                        style: TextStyle(
                          color: Colors.grey.shade500,
                          fontSize: 11,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Icon(Icons.sd_storage_outlined,
                          size: 12, color: Colors.grey.shade600),
                      const SizedBox(width: 4),
                      Text(
                        app.formattedSize,
                        style: TextStyle(
                          color: Colors.grey.shade500,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Risk badge
            if (app.isScanned)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _getRiskColor(app.riskLevel).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: _getRiskColor(app.riskLevel).withOpacity(0.4),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _getRiskIcon(app.riskLevel),
                      size: 14,
                      color: _getRiskColor(app.riskLevel),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _getRiskText(app.riskLevel),
                      style: TextStyle(
                        color: _getRiskColor(app.riskLevel),
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
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
}
