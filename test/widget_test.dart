import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tasty_bite/models/recipe.dart';
import 'package:tasty_bite/providers/favourite_provider.dart';
import 'package:tasty_bite/providers/recipe_provider.dart';
import 'package:tasty_bite/widgets/category_item.dart';
import 'package:tasty_bite/widgets/recipe_card.dart';

void main() {
  group('TastyBite Unit & Widget Tests', () {
    test('Recipe Model creates correctly from MealDB JSON', () {
      final mockJson = {
        'idMeal': '52772',
        'strMeal': 'Teriyaki Chicken Casserole',
        'strCategory': 'Chicken',
        'strArea': 'Japanese',
        'strInstructions': 'Preheat oven to 350 F. Bake casserole for 30 minutes.',
        'strMealThumb': 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
        'strIngredient1': 'soy sauce',
        'strMeasure1': '3/4 cup',
        'strIngredient2': 'water',
        'strMeasure2': '1/2 cup',
      };

      final recipe = Recipe.fromMealDbJson(mockJson);

      expect(recipe.id, '52772');
      expect(recipe.name, 'Teriyaki Chicken Casserole');
      expect(recipe.category, 'Chicken');
      expect(recipe.area, 'Japanese');
      expect(recipe.ingredients.length, 2);
      expect(recipe.ingredients[0].name, 'soy sauce');
      expect(recipe.ingredients[0].measure, '3/4 cup');
    });

    testWidgets('CategoryItem renders label and reacts to tap', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CategoryItem(
              categoryName: 'Dessert',
              isSelected: true,
              onTap: () {
                tapped = true;
              },
            ),
          ),
        ),
      );

      // Verify category text is visible
      expect(find.text('Dessert'), findsOneWidget);

      // Tap widget
      await tester.tap(find.text('Dessert'));
      await tester.pumpAndSettle();

      expect(tapped, isTrue);
    });

    testWidgets('RecipeCard displays recipe name and triggers onTap', (WidgetTester tester) async {
      bool cardTapped = false;

      final testRecipe = Recipe(
        id: 'test_123',
        name: 'Crispy Garlic Bread',
        category: 'Appetizer',
        area: 'Italian',
        description: 'Toasty golden garlic bread with herbs.',
        instructions: '1. Slice baguette.\n2. Spread garlic butter.\n3. Toast until golden.',
        imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400&q=80',
        cookingTime: 15,
        servings: 4,
        ingredients: [
          const RecipeIngredient(name: 'Baguette', measure: '1 loaf'),
          const RecipeIngredient(name: 'Butter', measure: '50g'),
          const RecipeIngredient(name: 'Garlic', measure: '4 cloves'),
        ],
      );

      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => FavouriteProvider()),
            ChangeNotifierProvider(create: (_) => RecipeProvider()),
          ],
          child: MaterialApp(
            home: Scaffold(
              body: RecipeCard(
                recipe: testRecipe,
                onTap: () {
                  cardTapped = true;
                },
              ),
            ),
          ),
        ),
      );

      expect(find.text('Crispy Garlic Bread'), findsOneWidget);
      expect(find.text('15 mins'), findsOneWidget);

      await tester.tap(find.text('Crispy Garlic Bread'));
      await tester.pump();

      expect(cardTapped, isTrue);
    });
  });
}
