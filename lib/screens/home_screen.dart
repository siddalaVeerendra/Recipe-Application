import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/recipe_provider.dart';
import '../widgets/category_item.dart';
import '../widgets/loading_widget.dart';
import '../widgets/recipe_card.dart';
import '../widgets/search_bar.dart';
import 'recipe_detail_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: isDark ? Colors.grey[900] : const Color(0xFFFAF7F2),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(7),
              decoration: BoxDecoration(
                color: Colors.deepOrange,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.restaurant,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 10),
            RichText(
              text: TextSpan(
                style: TextStyle(
                  fontFamily: theme.textTheme.bodyMedium?.fontFamily,
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : const Color(0xFF2B221B),
                ),
                children: const [
                  TextSpan(text: 'Tasty'),
                  TextSpan(
                    text: 'Bite',
                    style: TextStyle(color: Colors.deepOrange),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Refresh Recipes',
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<RecipeProvider>().retry();
            },
          ),
        ],
      ),
      body: Consumer<RecipeProvider>(
        builder: (context, provider, child) {
          final displayRecipes = provider.allDisplayRecipes;

          return RefreshIndicator(
            color: Colors.deepOrange,
            onRefresh: () async {
              await provider.retry();
            },
            child: CustomScrollView(
              slivers: [
                // Header Banner & Search
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'What would you like to cook today?',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                            color: isDark ? Colors.grey[100] : const Color(0xFF2B221B),
                          ),
                        ),
                        const SizedBox(height: 14),
                        CustomSearchBar(
                          initialValue: provider.searchQuery,
                          onSearch: (query) {
                            provider.searchRecipes(query);
                          },
                          onClear: () {
                            provider.searchRecipes('');
                          },
                        ),
                        const SizedBox(height: 18),
                        // Category Horizontal Bar
                        SizedBox(
                          height: 38,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: provider.categories.length,
                            itemBuilder: (context, index) {
                              final cat = provider.categories[index];
                              return CategoryItem(
                                categoryName: cat,
                                isSelected: provider.selectedCategory == cat,
                                onTap: () => provider.selectCategory(cat),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ),

                // Main Content State Handling
                if (provider.isLoading)
                  const SliverFillRemaining(
                    child: LoadingWidget(message: 'Searching tasty recipes...'),
                  )
                else if (provider.errorMessage != null)
                  SliverFillRemaining(
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.wifi_off_rounded,
                              size: 56,
                              color: Colors.deepOrange,
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Unable to load recipes',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              provider.errorMessage!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 14, color: Colors.grey),
                            ),
                            const SizedBox(height: 20),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.deepOrange,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              ),
                              onPressed: () => provider.retry(),
                              icon: const Icon(Icons.refresh),
                              label: const Text('Try Again'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                else if (displayRecipes.isEmpty)
                  SliverFillRemaining(
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.search_off_rounded,
                              size: 56,
                              color: Colors.grey,
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'No recipes found',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              provider.searchQuery.isNotEmpty
                                  ? 'No matches for "${provider.searchQuery}". Try different keywords.'
                                  : 'No recipes available in this category.',
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 14, color: Colors.grey),
                            ),
                            const SizedBox(height: 16),
                            TextButton(
                              onPressed: () {
                                provider.selectCategory('All');
                              },
                              child: const Text('Reset filters', style: TextStyle(color: Colors.deepOrange)),
                            )
                          ],
                        ),
                      ),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.72,
                        crossAxisSpacing: 14,
                        mainAxisSpacing: 14,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final recipe = displayRecipes[index];
                          return RecipeCard(
                            recipe: recipe,
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => RecipeDetailScreen(recipeId: recipe.id),
                                ),
                              );
                            },
                          );
                        },
                        childCount: displayRecipes.length,
                      ),
                    ),
                  ),

                const SliverToBoxAdapter(
                  child: SizedBox(height: 24),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
