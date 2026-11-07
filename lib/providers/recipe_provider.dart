import 'package:flutter/foundation.dart';
import '../models/recipe.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class RecipeProvider extends ChangeNotifier {
  final ApiService _apiService;
  final StorageService _storageService;

  List<Recipe> _recipes = [];
  List<Recipe> _customRecipes = [];
  List<String> _categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Chicken',
    'Beef',
    'Vegetarian',
    'Seafood',
  ];

  String _selectedCategory = 'All';
  String _searchQuery = '';
  bool _isLoading = false;
  String? _errorMessage;

  RecipeProvider({
    ApiService? apiService,
    StorageService? storageService,
  })  : _apiService = apiService ?? ApiService(),
        _storageService = storageService ?? StorageService() {
    init();
  }

  // Getters
  List<Recipe> get recipes => List.unmodifiable(_recipes);
  List<Recipe> get customRecipes => List.unmodifiable(_customRecipes);
  List<String> get categories => List.unmodifiable(_categories);
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  /// Combined recipes (custom user recipes + fetched recipes)
  List<Recipe> get allDisplayRecipes {
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      final matchingCustom = _customRecipes.where((r) =>
          r.name.toLowerCase().contains(q) ||
          r.category.toLowerCase().contains(q) ||
          r.description.toLowerCase().contains(q)).toList();
      return [...matchingCustom, ..._recipes];
    }

    if (_selectedCategory == 'All') {
      return [..._customRecipes, ..._recipes];
    }

    final filteredCustom = _customRecipes
        .where((r) => r.category.toLowerCase() == _selectedCategory.toLowerCase())
        .toList();
    return [...filteredCustom, ..._recipes];
  }

  /// Initialize provider by loading custom recipes and initial meal data
  Future<void> init() async {
    await loadCustomRecipes();
    await fetchInitialRecipes();
  }

  /// Load user-created custom recipes from local SharedPreferences
  Future<void> loadCustomRecipes() async {
    try {
      _customRecipes = await _storageService.loadCustomRecipes();
      notifyListeners();
    } catch (e) {
      debugPrint('Failed to load custom recipes: $e');
    }
  }

  /// Fetch initial recipe list (e.g. popular meals)
  Future<void> fetchInitialRecipes() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Search for popular dishes like chicken or pasta to have a rich feed
      final results = await _apiService.searchRecipes('chicken');
      if (results.isEmpty) {
        final fallback = await _apiService.searchRecipes('cake');
        _recipes = fallback;
      } else {
        _recipes = results;
      }
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Select category filter
  Future<void> selectCategory(String category) async {
    if (_selectedCategory == category && _searchQuery.isEmpty) return;

    _selectedCategory = category;
    _searchQuery = '';
    _errorMessage = null;

    if (category == 'All') {
      await fetchInitialRecipes();
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      // Fetch category dishes
      final categoryMeals = await _apiService.fetchByCategory(category);
      _recipes = categoryMeals;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Search recipes by query
  Future<void> searchRecipes(String query) async {
    _searchQuery = query;
    _errorMessage = null;

    if (query.trim().isEmpty) {
      if (_selectedCategory == 'All') {
        await fetchInitialRecipes();
      } else {
        await selectCategory(_selectedCategory);
      }
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final results = await _apiService.searchRecipes(query.trim());
      _recipes = results;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Fetch full detailed recipe by ID
  Future<Recipe?> getRecipeDetails(String id) async {
    // Check if it's already in custom recipes
    try {
      final custom = _customRecipes.firstWhere((r) => r.id == id);
      return custom;
    } catch (_) {}

    // Check if we already have full details in memory
    final inMemory = _recipes.firstWhere((r) => r.id == id, orElse: () => _recipes.first);
    if (inMemory.ingredients.isNotEmpty && inMemory.instructions.isNotEmpty) {
      return inMemory;
    }

    // Fetch from API
    try {
      return await _apiService.fetchRecipeDetails(id);
    } catch (e) {
      return inMemory; // fallback
    }
  }

  /// Add user-created recipe and persist to local storage
  Future<void> addCustomRecipe(Recipe recipe) async {
    _customRecipes.insert(0, recipe);
    notifyListeners();
    await _storageService.saveCustomRecipes(_customRecipes);
  }

  /// Retry last failed operation
  Future<void> retry() async {
    if (_searchQuery.isNotEmpty) {
      await searchRecipes(_searchQuery);
    } else if (_selectedCategory != 'All') {
      await selectCategory(_selectedCategory);
    } else {
      await fetchInitialRecipes();
    }
  }
}
