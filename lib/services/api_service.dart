import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/recipe.dart';

class ApiService {
  static const String _baseUrl = 'https://www.themealdb.com/api/json/v1/1';
  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  /// Search recipes by query string
  Future<List<Recipe>> searchRecipes(String query) async {
    try {
      final uri = Uri.parse('$_baseUrl/search.php?s=${Uri.encodeComponent(query)}');
      final response = await _client.get(uri).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final List<dynamic>? meals = data['meals'];
        if (meals == null) return [];
        return meals.map((m) => Recipe.fromMealDbJson(m as Map<String, dynamic>)).toList();
      } else {
        throw Exception('Server returned status code: ${response.statusCode}');
      }
    } on SocketException {
      throw Exception('No internet connection. Please check your network.');
    } catch (e) {
      throw Exception('Failed to load recipes: $e');
    }
  }

  /// Fetch recipes filtered by category
  Future<List<Recipe>> fetchByCategory(String category) async {
    try {
      final uri = Uri.parse('$_baseUrl/filter.php?c=${Uri.encodeComponent(category)}');
      final response = await _client.get(uri).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final List<dynamic>? meals = data['meals'];
        if (meals == null) return [];

        return meals.map((m) {
          final id = m['idMeal'] as String? ?? '';
          final name = m['strMeal'] as String? ?? 'Recipe';
          final img = m['strMealThumb'] as String? ?? '';
          return Recipe(
            id: id,
            name: name,
            category: category,
            area: 'Popular',
            description: 'Delicious $category specialty prepared with fresh ingredients.',
            instructions: 'Tap to view full preparation guide and complete cooking steps.',
            imageUrl: img,
            cookingTime: 25 + (id.hashCode.abs() % 25),
            servings: 2 + (id.hashCode.abs() % 4),
            ingredients: [],
          );
        }).toList();
      } else {
        throw Exception('Failed to fetch recipes for category: $category');
      }
    } on SocketException {
      throw Exception('No internet connection. Please check your network.');
    } catch (e) {
      throw Exception('Category query error: $e');
    }
  }

  /// Fetch full detailed recipe by ID (including all ingredients and instructions)
  Future<Recipe> fetchRecipeDetails(String id) async {
    try {
      final uri = Uri.parse('$_baseUrl/lookup.php?i=${Uri.encodeComponent(id)}');
      final response = await _client.get(uri).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final List<dynamic>? meals = data['meals'];
        if (meals != null && meals.isNotEmpty) {
          return Recipe.fromMealDbJson(meals.first as Map<String, dynamic>);
        } else {
          throw Exception('Recipe not found');
        }
      } else {
        throw Exception('Server returned status: ${response.statusCode}');
      }
    } on SocketException {
      throw Exception('No internet connection. Please verify your connection.');
    } catch (e) {
      throw Exception('Failed to fetch recipe details: $e');
    }
  }

  /// Fetch category list
  Future<List<String>> fetchCategories() async {
    try {
      final uri = Uri.parse('$_baseUrl/categories.php');
      final response = await _client.get(uri).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final List<dynamic>? list = data['categories'];
        if (list == null) return _defaultCategories;
        return list.map((c) => c['strCategory'] as String).toList();
      }
      return _defaultCategories;
    } catch (_) {
      return _defaultCategories;
    }
  }

  static const List<String> _defaultCategories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Chicken',
    'Beef',
    'Vegetarian',
    'Seafood',
    'Pasta',
  ];
}
