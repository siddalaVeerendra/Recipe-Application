import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/recipe.dart';
import '../providers/recipe_provider.dart';

class AddRecipeScreen extends StatefulWidget {
  const AddRecipeScreen({super.key});

  @override
  State<AddRecipeScreen> createState() => _AddRecipeScreenState();
}

class _AddRecipeScreenState extends State<AddRecipeScreen> {
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _instructionsController = TextEditingController();
  final _cookingTimeController = TextEditingController(text: '30');
  final _servingsController = TextEditingController(text: '4');
  final _imageUrlController = TextEditingController();

  String _selectedCategory = 'Dinner';
  final List<String> _categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Vegetarian',
    'Seafood',
    'Snack',
  ];

  // Dynamic ingredients list
  final List<Map<String, String>> _ingredients = [
    {'name': '', 'measure': ''},
  ];

  bool _isSaving = false;

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _instructionsController.dispose();
    _cookingTimeController.dispose();
    _servingsController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  void _addIngredientRow() {
    setState(() {
      _ingredients.add({'name': '', 'measure': ''});
    });
  }

  void _removeIngredientRow(int index) {
    if (_ingredients.length > 1) {
      setState(() {
        _ingredients.removeAt(index);
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please correct the highlighted errors before saving.'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    // Validate that at least one ingredient has a valid name
    final validIngredients = _ingredients
        .where((i) => i['name'] != null && i['name']!.trim().isNotEmpty)
        .map((i) => RecipeIngredient(
              name: i['name']!.trim(),
              measure: (i['measure'] != null && i['measure']!.trim().isNotEmpty)
                  ? i['measure']!.trim()
                  : 'to taste',
            ))
        .toList();

    if (validIngredients.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please add at least one ingredient with a name.'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() {
      _isSaving = true;
    });

    try {
      final String fallbackImage =
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

      final newRecipe = Recipe(
        id: 'custom_${DateTime.now().millisecondsSinceEpoch}',
        name: _nameController.text.trim(),
        category: _selectedCategory,
        area: 'Home Kitchen',
        description: _descriptionController.text.trim(),
        instructions: _instructionsController.text.trim(),
        imageUrl: _imageUrlController.text.trim().isNotEmpty
            ? _imageUrlController.text.trim()
            : fallbackImage,
        cookingTime: int.tryParse(_cookingTimeController.text.trim()) ?? 30,
        servings: int.tryParse(_servingsController.text.trim()) ?? 4,
        ingredients: validIngredients,
        isCustom: true,
      );

      await context.read<RecipeProvider>().addCustomRecipe(newRecipe);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 8),
                Expanded(child: Text('Recipe "${newRecipe.name}" saved successfully!')),
              ],
            ),
            backgroundColor: Colors.green[700],
            behavior: SnackBarBehavior.floating,
          ),
        );

        // Reset form
        _nameController.clear();
        _descriptionController.clear();
        _instructionsController.clear();
        _imageUrlController.clear();
        setState(() {
          _ingredients.clear();
          _ingredients.add({'name': '', 'measure': ''});
          _isSaving = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to save recipe: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Recipe'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Share Your Secret Recipe',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : const Color(0xFF2B221B),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'All fields marked with an asterisk (*) are required.',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 20),

              // Recipe Name
              _buildSectionHeader('Recipe Name *'),
              TextFormField(
                controller: _nameController,
                decoration: _inputDecoration(
                  hintText: 'e.g. Grandma\'s Apple Pie',
                  icon: Icons.title,
                  isDark: isDark,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a recipe name';
                  }
                  if (value.trim().length < 3) {
                    return 'Name must be at least 3 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Category & Timing Row
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('Category *'),
                        DropdownButtonFormField<String>(
                          value: _selectedCategory,
                          decoration: _inputDecoration(
                            hintText: 'Category',
                            icon: Icons.category_outlined,
                            isDark: isDark,
                          ),
                          items: _categories.map((c) {
                            return DropdownMenuItem(value: c, child: Text(c));
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) {
                              setState(() => _selectedCategory = val);
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('Time (mins) *'),
                        TextFormField(
                          controller: _cookingTimeController,
                          keyboardType: TextInputType.number,
                          decoration: _inputDecoration(
                            hintText: '30',
                            icon: Icons.timer,
                            isDark: isDark,
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Required';
                            }
                            final n = int.tryParse(value.trim());
                            if (n == null || n <= 0) {
                              return 'Invalid';
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Servings & Image URL
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('Servings *'),
                        TextFormField(
                          controller: _servingsController,
                          keyboardType: TextInputType.number,
                          decoration: _inputDecoration(
                            hintText: '4',
                            icon: Icons.people_outline,
                            isDark: isDark,
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Required';
                            }
                            final n = int.tryParse(value.trim());
                            if (n == null || n <= 0) {
                              return 'Invalid';
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('Image URL (optional)'),
                        TextFormField(
                          controller: _imageUrlController,
                          keyboardType: TextInputType.url,
                          decoration: _inputDecoration(
                            hintText: 'https://...',
                            icon: Icons.image_outlined,
                            isDark: isDark,
                          ),
                          validator: (value) {
                            if (value != null && value.trim().isNotEmpty) {
                              final uri = Uri.tryParse(value.trim());
                              if (uri == null || !uri.hasScheme) {
                                return 'Invalid URL';
                              }
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Description
              _buildSectionHeader('Short Description *'),
              TextFormField(
                controller: _descriptionController,
                maxLines: 2,
                decoration: _inputDecoration(
                  hintText: 'Brief summary of what makes this recipe special...',
                  icon: Icons.description_outlined,
                  isDark: isDark,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a brief description';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Dynamic Ingredients
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildSectionHeader('Ingredients List *'),
                  TextButton.icon(
                    style: TextButton.styleFrom(foregroundColor: Colors.deepOrange),
                    onPressed: _addIngredientRow,
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Add Item'),
                  ),
                ],
              ),
              const SizedBox(height: 6),

              ..._ingredients.asMap().entries.map((entry) {
                final idx = entry.key;
                final ing = entry.value;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: TextFormField(
                          initialValue: ing['name'],
                          onChanged: (val) => ing['name'] = val,
                          decoration: _inputDecoration(
                            hintText: 'Ingredient (e.g. Flour)',
                            icon: Icons.check,
                            isDark: isDark,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        flex: 2,
                        child: TextFormField(
                          initialValue: ing['measure'],
                          onChanged: (val) => ing['measure'] = val,
                          decoration: _inputDecoration(
                            hintText: 'Qty (e.g. 2 cups)',
                            icon: Icons.scale,
                            isDark: isDark,
                          ),
                        ),
                      ),
                      if (_ingredients.length > 1)
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline, color: Colors.redAccent),
                          onPressed: () => _removeIngredientRow(idx),
                        ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 20),

              // Step-by-Step Cooking Instructions
              _buildSectionHeader('Cooking Instructions *'),
              TextFormField(
                controller: _instructionsController,
                maxLines: 5,
                decoration: _inputDecoration(
                  hintText: '1. Preheat oven to 375°F.\n2. Mix dry ingredients in a large bowl.\n3. Bake for 25 minutes until golden.',
                  icon: Icons.format_list_numbered,
                  isDark: isDark,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please provide cooking instructions';
                  }
                  if (value.trim().length < 15) {
                    return 'Instructions should be at least 15 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 28),

              // Save Recipe Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 2,
                  ),
                  onPressed: _isSaving ? null : _submitForm,
                  icon: _isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Icon(Icons.save_outlined),
                  label: Text(
                    _isSaving ? 'Saving Recipe...' : 'Save Recipe to TastyBite',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w700,
          color: Color(0xFF6B5E52),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration({
    required String hintText,
    required IconData icon,
    required bool isDark,
  }) {
    return InputDecoration(
      hintText: hintText,
      hintStyle: TextStyle(
        fontSize: 13,
        color: isDark ? Colors.grey[500] : const Color(0xFF9E9285),
      ),
      prefixIcon: Icon(icon, size: 18, color: Colors.deepOrange),
      filled: true,
      fillColor: isDark ? Colors.grey[900] : const Color(0xFFFAF7F2),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: isDark ? Colors.grey[800]! : const Color(0xFFEDE5DA),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: isDark ? Colors.grey[800]! : const Color(0xFFEDE5DA),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.deepOrange, width: 1.5),
      ),
    );
  }
}
