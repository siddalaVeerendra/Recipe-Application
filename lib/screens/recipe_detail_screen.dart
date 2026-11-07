import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/recipe.dart';
import '../providers/favourite_provider.dart';
import '../providers/recipe_provider.dart';
import '../widgets/loading_widget.dart';

class RecipeDetailScreen extends StatefulWidget {
  final String recipeId;

  const RecipeDetailScreen({
    super.key,
    required this.recipeId,
  });

  @override
  State<RecipeDetailScreen> createState() => _RecipeDetailScreenState();
}

class _RecipeDetailScreenState extends State<RecipeDetailScreen> {
  Recipe? _recipe;
  bool _isLoading = true;
  String? _error;
  final Set<int> _completedSteps = {};
  final Set<String> _checkedIngredients = {};

  @override
  void initState() {
    super.initState();
    _loadRecipe();
  }

  Future<void> _loadRecipe() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final recipeProvider = context.read<RecipeProvider>();
      final recipe = await recipeProvider.getRecipeDetails(widget.recipeId);
      if (mounted) {
        setState(() {
          _recipe = recipe;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceAll('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Recipe Details')),
        body: const LoadingWidget(message: 'Fetching secret ingredients...'),
      );
    }

    if (_error != null || _recipe == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Recipe Details')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 56, color: Colors.deepOrange),
                const SizedBox(height: 16),
                Text(
                  _error ?? 'Recipe not found',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: _loadRecipe,
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final recipe = _recipe!;
    final steps = recipe.instructionSteps;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Collapsible Hero Image App Bar
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            leading: Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircleAvatar(
                backgroundColor: Colors.black.withOpacity(0.5),
                child: IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ),
            actions: [
              Consumer<FavouriteProvider>(
                builder: (context, favProvider, child) {
                  final isFav = favProvider.isFavourite(recipe.id);
                  return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircleAvatar(
                      backgroundColor: Colors.black.withOpacity(0.5),
                      child: IconButton(
                        icon: Icon(
                          isFav ? Icons.favorite : Icons.favorite_border,
                          color: isFav ? Colors.redAccent : Colors.white,
                          size: 22,
                        ),
                        onPressed: () {
                          favProvider.toggleFavourite(recipe);
                          ScaffoldMessenger.of(context).hideCurrentSnackBar();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                isFav
                                    ? 'Removed from favourites'
                                    : 'Added to favourites!',
                              ),
                              duration: const Duration(seconds: 1),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                      ),
                    ),
                  );
                },
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Hero(
                    tag: 'recipe_image_${recipe.id}',
                    child: Image.network(
                      recipe.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: Colors.orange[100],
                        child: const Icon(Icons.restaurant, size: 60, color: Colors.deepOrange),
                      ),
                    ),
                  ),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.4),
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Details Body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title & Origin
                  Text(
                    recipe.name,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Text(
                        recipe.category,
                        style: const TextStyle(
                          color: Colors.deepOrange,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text('·', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 8),
                      Text(
                        recipe.area,
                        style: TextStyle(
                          color: isDark ? Colors.grey[400] : Colors.grey[600],
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  // Info Cards (Cooking Time, Servings, Total Ingredients)
                  Row(
                    children: [
                      _buildMetricTile(
                        icon: Icons.timer_outlined,
                        label: 'Cook Time',
                        value: '${recipe.cookingTime} mins',
                        isDark: isDark,
                      ),
                      const SizedBox(width: 12),
                      _buildMetricTile(
                        icon: Icons.people_outline,
                        label: 'Servings',
                        value: '${recipe.servings} people',
                        isDark: isDark,
                      ),
                      const SizedBox(width: 12),
                      _buildMetricTile(
                        icon: Icons.kitchen_outlined,
                        label: 'Ingredients',
                        value: '${recipe.ingredients.length} items',
                        isDark: isDark,
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Ingredients Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Ingredients',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${_checkedIngredients.length}/${recipe.ingredients.length} ready',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.grey[400] : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  if (recipe.ingredients.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 8.0),
                      child: Text('Check instructions for required items.'),
                    )
                  else
                    ...recipe.ingredients.map((ing) {
                      final isChecked = _checkedIngredients.contains(ing.name);
                      return InkWell(
                        onTap: () {
                          setState(() {
                            if (isChecked) {
                              _checkedIngredients.remove(ing.name);
                            } else {
                              _checkedIngredients.add(ing.name);
                            }
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: isChecked
                                ? (isDark ? Colors.grey[850] : const Color(0xFFF0FDF4))
                                : (isDark ? Colors.grey[900] : const Color(0xFFFAF7F2)),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isChecked
                                  ? Colors.green.withOpacity(0.3)
                                  : (isDark ? Colors.grey[800]! : const Color(0xFFEDE5DA)),
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                isChecked ? Icons.check_circle : Icons.circle_outlined,
                                color: isChecked ? Colors.green : Colors.grey,
                                size: 20,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  ing.name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    decoration: isChecked ? TextDecoration.lineThrough : null,
                                    color: isChecked
                                        ? Colors.grey
                                        : (isDark ? Colors.white : Colors.black87),
                                  ),
                                ),
                              ),
                              Text(
                                ing.measure,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: Colors.deepOrange,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),

                  const SizedBox(height: 24),

                  // Step-by-Step Cooking Instructions
                  const Text(
                    'Step-by-Step Instructions',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),

                  if (steps.isEmpty)
                    Text(
                      recipe.instructions.isNotEmpty
                          ? recipe.instructions
                          : 'No instructions provided.',
                      style: const TextStyle(fontSize: 14, height: 1.6),
                    )
                  else
                    ...steps.asMap().entries.map((entry) {
                      final idx = entry.key;
                      final stepText = entry.value;
                      final isDone = _completedSteps.contains(idx);

                      return InkWell(
                        onTap: () {
                          setState(() {
                            if (isDone) {
                              _completedSteps.remove(idx);
                            } else {
                              _completedSteps.add(idx);
                            }
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: isDark ? Colors.grey[900] : Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isDone
                                  ? Colors.deepOrange.withOpacity(0.4)
                                  : (isDark ? Colors.grey[800]! : const Color(0xFFEFE8E0)),
                            ),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 26,
                                height: 26,
                                decoration: BoxDecoration(
                                  color: isDone ? Colors.deepOrange : Colors.orange[100],
                                  shape: BoxShape.circle,
                                ),
                                child: Center(
                                  child: isDone
                                      ? const Icon(Icons.check, size: 16, color: Colors.white)
                                      : Text(
                                          '${idx + 1}',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.deepOrange,
                                          ),
                                        ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  stepText,
                                  style: TextStyle(
                                    fontSize: 14,
                                    height: 1.5,
                                    color: isDone
                                        ? Colors.grey
                                        : (isDark ? Colors.grey[200] : const Color(0xFF332A23)),
                                    decoration: isDone ? TextDecoration.lineThrough : null,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile({
    required IconData icon,
    required String label,
    required String value,
    required bool isDark,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: isDark ? Colors.grey[900] : const Color(0xFFFAF7F2),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isDark ? Colors.grey[800]! : const Color(0xFFEDE5DA),
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.deepOrange, size: 20),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                color: isDark ? Colors.grey[400] : Colors.grey[600],
              ),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
