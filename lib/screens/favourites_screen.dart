import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/favourite_provider.dart';
import '../widgets/recipe_card.dart';
import 'recipe_detail_screen.dart';

class FavouritesScreen extends StatelessWidget {
  final VoidCallback? onExploreTap;

  const FavouritesScreen({
    super.key,
    this.onExploreTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Favourites'),
        elevation: 0,
        actions: [
          Consumer<FavouriteProvider>(
            builder: (context, favProvider, child) {
              if (favProvider.count == 0) return const SizedBox.shrink();
              return Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: Center(
                  child: Text(
                    '${favProvider.count} recipes',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepOrange,
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Consumer<FavouriteProvider>(
        builder: (context, favProvider, child) {
          final favourites = favProvider.favourites;

          if (favourites.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.deepOrange.withOpacity(0.08),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.favorite_outline,
                        size: 64,
                        color: Colors.deepOrange,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'No Favourites Yet',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : const Color(0xFF2B221B),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Tap the heart icon on any recipe to save it here for quick access offline!',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepOrange,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      ),
                      onPressed: () {
                        if (onExploreTap != null) {
                          onExploreTap!();
                        } else {
                          Navigator.popUntil(context, (route) => route.isFirst);
                        }
                      },
                      icon: const Icon(Icons.search, size: 18),
                      label: const Text('Explore Recipes'),
                    ),
                  ],
                ),
              ),
            );
          }

          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.72,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
            ),
            itemCount: favourites.length,
            itemBuilder: (context, index) {
              final recipe = favourites[index];
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
          );
        },
      ),
    );
  }
}
