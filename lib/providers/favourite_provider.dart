import 'package:flutter/foundation.dart';
import '../models/recipe.dart';
import '../services/storage_service.dart';

class FavouriteProvider extends ChangeNotifier {
  final StorageService _storageService;
  List<Recipe> _favourites = [];
  bool _isLoading = false;

  FavouriteProvider({StorageService? storageService})
      : _storageService = storageService ?? StorageService() {
    loadFavourites();
  }

  List<Recipe> get favourites => List.unmodifiable(_favourites);
  bool get isLoading => _isLoading;
  int get count => _favourites.length;

  /// Load favourites from persistent storage on startup
  Future<void> loadFavourites() async {
    _isLoading = true;
    notifyListeners();

    try {
      _favourites = await _storageService.loadFavourites();
    } catch (e) {
      debugPrint('Error loading favourites: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Check if a recipe is in the favourites list
  bool isFavourite(String recipeId) {
    return _favourites.any((r) => r.id == recipeId);
  }

  /// Toggle favourite status with persistent storage save
  Future<void> toggleFavourite(Recipe recipe) async {
    final existingIndex = _favourites.indexWhere((r) => r.id == recipe.id);
    if (existingIndex >= 0) {
      _favourites.removeAt(existingIndex);
    } else {
      _favourites.add(recipe);
    }
    notifyListeners();
    await _storageService.saveFavourites(_favourites);
  }

  /// Explicitly remove a recipe from favourites
  Future<void> removeFavourite(String recipeId) async {
    _favourites.removeWhere((r) => r.id == recipeId);
    notifyListeners();
    await _storageService.saveFavourites(_favourites);
  }
}
