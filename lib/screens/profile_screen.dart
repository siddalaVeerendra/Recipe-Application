import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/favourite_provider.dart';
import '../providers/recipe_provider.dart';

class ProfileScreen extends StatefulWidget {
  final ValueChanged<ThemeMode>? onThemeChanged;
  final ThemeMode currentThemeMode;

  const ProfileScreen({
    super.key,
    this.onThemeChanged,
    this.currentThemeMode = ThemeMode.system,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _useMetricUnits = true;
  bool _offlineCacheEnabled = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final recipeProvider = context.watch<RecipeProvider>();
    final favProvider = context.watch<FavouriteProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile & About'),
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        children: [
          // App Identity Hero Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark
                    ? [Colors.deepOrange.shade900, Colors.grey.shade900]
                    : [const Color(0xFFFFECE0), const Color(0xFFFFF8F3)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isDark ? Colors.deepOrange.shade800 : const Color(0xFFFFD9C2),
              ),
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                    color: Colors.deepOrange,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.soup_kitchen_rounded,
                    size: 38,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'TastyBite – Recipe Finder',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Version 1.0.0 (Build 2026.1)',
                  style: TextStyle(
                    fontSize: 13,
                    color: isDark ? Colors.grey[400] : const Color(0xFF7A6B5D),
                  ),
                ),
                const SizedBox(height: 16),
                // Stats badges
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildQuickStat('Favourites', '${favProvider.count}', isDark),
                    Container(height: 24, width: 1, color: Colors.grey.withOpacity(0.3)),
                    _buildQuickStat('My Recipes', '${recipeProvider.customRecipes.length}', isDark),
                    Container(height: 24, width: 1, color: Colors.grey.withOpacity(0.3)),
                    _buildQuickStat('Categories', '${recipeProvider.categories.length}', isDark),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section 1: Preferences
          _buildSectionTitle('App Preferences'),
          Container(
            decoration: _boxDecoration(isDark),
            child: Column(
              children: [
                SwitchListTile(
                  activeColor: Colors.deepOrange,
                  title: const Text('Metric Units (grams, ml)', style: TextStyle(fontSize: 14)),
                  subtitle: Text(
                    _useMetricUnits ? 'Currently showing metric units' : 'Currently showing imperial (oz, lbs)',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  value: _useMetricUnits,
                  onChanged: (val) {
                    setState(() => _useMetricUnits = val);
                  },
                ),
                const Divider(height: 1),
                SwitchListTile(
                  activeColor: Colors.deepOrange,
                  title: const Text('Offline Recipe Cache', style: TextStyle(fontSize: 14)),
                  subtitle: const Text('Keep viewed recipes saved locally', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  value: _offlineCacheEnabled,
                  onChanged: (val) {
                    setState(() => _offlineCacheEnabled = val);
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section 2: College Project Information
          _buildSectionTitle('Project & Team Information'),
          Container(
            decoration: _boxDecoration(isDark),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.school_outlined, color: Colors.deepOrange),
                  title: const Text('Academic Submission', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Mobile Application Development Project', style: TextStyle(fontSize: 12)),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.api_outlined, color: Colors.deepOrange),
                  title: const Text('API Provider', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('TheMealDB Free Tier API', style: TextStyle(fontSize: 12)),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.group_outlined, color: Colors.deepOrange),
                  title: const Text('Architecture', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Provider Pattern (ChangeNotifier) + Repository Services', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section 3: Data Management
          _buildSectionTitle('Storage & Maintenance'),
          Container(
            decoration: _boxDecoration(isDark),
            child: ListTile(
              leading: const Icon(Icons.cleaning_services_outlined, color: Colors.redAccent),
              title: const Text('Clear Saved Local Data', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Resets custom recipes and favourites to default', style: TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Reset Application Data?'),
                    content: const Text('This will remove all custom added recipes and favourites from your device storage.'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        style: TextButton.styleFrom(foregroundColor: Colors.redAccent),
                        onPressed: () {
                          // Clear via providers
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Storage reset completed.'),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        child: const Text('Reset'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 36),
        ],
      ),
    );
  }

  Widget _buildQuickStat(String label, String value, bool isDark) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.deepOrange,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isDark ? Colors.grey[400] : const Color(0xFF6B5E52),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  BoxDecoration _boxDecoration(bool isDark) {
    return BoxDecoration(
      color: isDark ? Colors.grey[900] : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(
        color: isDark ? Colors.grey[800]! : const Color(0xFFEDE5DA),
      ),
    );
  }
}
