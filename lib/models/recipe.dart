/// Model class representing a Food Recipe in TastyBite
class RecipeIngredient {
  final String name;
  final String measure;

  const RecipeIngredient({
    required this.name,
    required this.measure,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'measure': measure,
    };
  }

  factory RecipeIngredient.fromJson(Map<String, dynamic> json) {
    return RecipeIngredient(
      name: json['name'] as String? ?? '',
      measure: json['measure'] as String? ?? '',
    );
  }
}

class Recipe {
  final String id;
  final String name;
  final String category;
  final String area;
  final String description;
  final String instructions;
  final String imageUrl;
  final int cookingTime; // in minutes
  final int servings;
  final List<RecipeIngredient> ingredients;
  final bool isCustom;
  final String? youtubeUrl;
  final List<String> tags;

  const Recipe({
    required this.id,
    required this.name,
    required this.category,
    this.area = 'International',
    required this.description,
    required this.instructions,
    required this.imageUrl,
    this.cookingTime = 30,
    this.servings = 4,
    required this.ingredients,
    this.isCustom = false,
    this.youtubeUrl,
    this.tags = const [],
  });

  /// Factory constructor to parse TheMealDB API meal JSON
  factory Recipe.fromMealDbJson(Map<String, dynamic> json) {
    final List<RecipeIngredient> ingredientsList = [];

    // TheMealDB provides up to 20 ingredients and measures
    for (int i = 1; i <= 20; i++) {
      final ingredient = json['strIngredient$i'];
      final measure = json['strMeasure$i'];

      if (ingredient != null &&
          ingredient.toString().trim().isNotEmpty &&
          ingredient.toString().toLowerCase() != 'null') {
        ingredientsList.add(
          RecipeIngredient(
            name: ingredient.toString().trim(),
            measure: (measure != null && measure.toString().trim().isNotEmpty)
                ? measure.toString().trim()
                : 'to taste',
          ),
        );
      }
    }

    final String rawInstructions = json['strInstructions'] as String? ?? '';
    final String category = json['strCategory'] as String? ?? 'General';
    final String area = json['strArea'] as String? ?? 'World';

    // Parse tags if available
    final String? rawTags = json['strTags'] as String?;
    final List<String> parsedTags = rawTags != null
        ? rawTags.split(',').map((t) => t.trim()).where((t) => t.isNotEmpty).toList()
        : [];

    // Calculate a realistic cooking time based on ingredient count and instruction length
    final int calculatedTime = 15 + (ingredientsList.length * 2) + ((rawInstructions.length / 100).clamp(5, 45).toInt());

    return Recipe(
      id: json['idMeal'] as String? ?? DateTime.now().millisecondsSinceEpoch.toString(),
      name: json['strMeal'] as String? ?? 'Untitled Recipe',
      category: category,
      area: area,
      description: 'A delicious $category dish inspired by $area cuisine.',
      instructions: rawInstructions,
      imageUrl: json['strMealThumb'] as String? ??
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
      cookingTime: calculatedTime,
      servings: 4,
      ingredients: ingredientsList,
      isCustom: false,
      youtubeUrl: json['strYoutube'] as String?,
      tags: parsedTags,
    );
  }

  /// Serialize to JSON for SharedPreferences local storage
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'area': area,
      'description': description,
      'instructions': instructions,
      'imageUrl': imageUrl,
      'cookingTime': cookingTime,
      'servings': servings,
      'ingredients': ingredients.map((i) => i.toJson()).toList(),
      'isCustom': isCustom,
      'youtubeUrl': youtubeUrl,
      'tags': tags,
    };
  }

  /// Deserialize from local storage JSON
  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String? ?? 'General',
      area: json['area'] as String? ?? 'Home Cooked',
      description: json['description'] as String? ?? '',
      instructions: json['instructions'] as String? ?? '',
      imageUrl: json['imageUrl'] as String? ?? '',
      cookingTime: json['cookingTime'] as int? ?? 30,
      servings: json['servings'] as int? ?? 2,
      ingredients: (json['ingredients'] as List<dynamic>? ?? [])
          .map((i) => RecipeIngredient.fromJson(i as Map<String, dynamic>))
          .toList(),
      isCustom: json['isCustom'] as bool? ?? true,
      youtubeUrl: json['youtubeUrl'] as String?,
      tags: (json['tags'] as List<dynamic>? ?? []).map((t) => t.toString()).toList(),
    );
  }

  /// Splits instructions into ordered step-by-step paragraphs or numbered points
  List<String> get instructionSteps {
    if (instructions.isEmpty) return [];

    // Split by newlines or carriage returns
    final lines = instructions
        .split(RegExp(r'\r\n|\r|\n'))
        .map((line) => line.trim())
        .where((line) => line.isNotEmpty)
        .toList();

    // If text was a single solid paragraph, attempt to split by sentences
    if (lines.length <= 1 && instructions.length > 100) {
      return instructions
          .split(RegExp(r'(?<=[.!?])\s+(?=[A-Z0-9])'))
          .map((s) => s.trim())
          .where((s) => s.isNotEmpty)
          .toList();
    }

    return lines;
  }
}
