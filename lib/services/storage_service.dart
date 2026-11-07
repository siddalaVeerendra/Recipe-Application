import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/recipe.dart';

class StorageService {
  static const String _customRecipesKey = 'tasty_bite_custom_recipes';
  static const String _favouritesKey = 'tasty_bite_favourites';

  /// Save custom user-created recipes to local storage
  Future<bool> saveCustomRecipes(List<Recipe> recipes) async {
    final prefs = await SharedPreferences.getInstance();
    final String encoded = json.encode(recipes.map((r) => r.toJson()).toList());
    return await prefs.setString(_customRecipesKey, encoded);
  }

  /// Load custom user-created recipes from local storage
  Future<List<Recipe>> loadCustomRecipes() async {
    final prefs = await SharedPreferences.getInstance();
    final String? rawData = prefs.getString(_customRecipesKey);
    if (rawData == null || rawData.isEmpty) return [];

    try {
      final List<dynamic> decoded = json.decode(rawData);
      return decoded.map((item) => Recipe.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  /// Save list of favourite recipes to local storage
  Future<bool> saveFavourites(List<Recipe> favourites) async {
    final prefs = await SharedPreferences.getInstance();
    final String encoded = json.encode(favourites.map((r) => r.toJson()).toList());
    return await prefs.setString(_favouritesKey, encoded);
  }

  /// Load list of favourite recipes from local storage
  Future<List<Recipe>> loadFavourites() async {
    final prefs = await SharedPreferences.getInstance();
    final String? rawData = prefs.getString(_favouritesKey);
    if (rawData == null || rawData.isEmpty) return [];

    try {
      final List<dynamic> decoded = json.decode(rawData);
      return decoded.map((item) => Recipe.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }
}
