# TastyBite – Recipe Finder (Flutter Application)

A modern, responsive, and user-friendly Android Recipe Application developed using **Flutter 3.x** and **Dart** with null safety, utilizing **Provider** state management, **SharedPreferences** for persistent offline storage, and **TheMealDB REST API** for live global recipe fetching.

---

## 1. Project Overview & Features

TastyBite allows food enthusiasts to discover, organize, and cook their favorite dishes with an intuitive food-themed Material 3 design (Warm Orange & Cream palette).

### Key Features
1. **Browse Recipes**: Browse curated meals across categories (Breakfast, Lunch, Dinner, Dessert, Seafood, Vegan, Chicken, Beef).
2. **Real-Time Search**: Search through thousands of recipes by dish name or ingredient keyword.
3. **Comprehensive Recipe Details**:
   - High-resolution hero image
   - Estimated cooking time, origin (Cuisine), and serving sizes
   - Interactive ingredient checklist with measurements
   - Step-by-step cooking instructions with checkable completed steps
4. **Custom Recipe Creator (Add Recipe)**:
   - Form validation for recipe name, categories, time, servings, description, and dynamic ingredients
   - Client-side data integrity verification
   - Offline persistence via local storage
5. **Favorites Management**:
   - One-tap bookmarking from cards or recipe detail view
   - Instant persistence across app restarts
   - Category filtering and swipe/tap deletion
6. **Profile, Settings & College Group Project Showcase**:
   - Measurement unit toggle (Metric vs Imperial)
   - Cache control and storage stats
   - Team contributions and project architecture documentation

---

## 2. Technology Stack & Architecture

- **Framework**: Flutter 3.35+ (Dart with Sound Null Safety)
- **State Management**: `Provider` (`ChangeNotifierProvider`, `Consumer`, `context.watch`, `context.read`)
- **Network & API**: `http` package consuming [TheMealDB REST API](https://www.themealdb.com/api.php)
- **Local Storage**: `shared_preferences` with JSON serialization
- **Design System**: Material 3 with custom color tokens:
  - Primary Seed: `#EA580C` (Deep Orange)
  - Surface Background: `#FAF7F2` (Warm Kitchen Cream)
  - Dark Surface: `#12100E` (Ember Obsidian)

### Architecture Diagram
```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   HomeScreen | RecipeDetailScreen | AddRecipeScreen   │
│       FavouritesScreen | ProfileScreen | Widgets       │
└───────────────────────────▲────────────────────────────┘
                            │ (ChangeNotifier / Consumers)
┌───────────────────────────┴────────────────────────────┐
│                    State Providers                     │
│       RecipeProvider          FavouriteProvider        │
└─────────────▲─────────────────────────────▲────────────┘
              │                             │
┌─────────────┴─────────────┐ ┌─────────────┴────────────┐
│        ApiService         │ │      StorageService      │
│  (TheMealDB REST API)     │ │   (SharedPreferences)    │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 3. Project Directory Structure

```
lib/
├── main.dart                       # App entry point, MultiProvider & M3 themes
├── models/
│   └── recipe.dart                 # Recipe & RecipeIngredient models with JSON parsers
├── providers/
│   ├── recipe_provider.dart        # Recipes, categories, search state
│   └── favourite_provider.dart     # Bookmarked recipes & sync state
├── services/
│   ├── api_service.dart            # TheMealDB HTTP client & error handler
│   └── storage_service.dart        # SharedPreferences persistence layer
├── screens/
│   ├── home_screen.dart            # Feed, search, category chips, recipe grid
│   ├── recipe_detail_screen.dart   # Hero image, step-by-step checklist
│   ├── add_recipe_screen.dart      # Validated custom recipe creation form
│   ├── favourites_screen.dart      # Saved recipes & empty states
│   └── profile_screen.dart         # Preferences, project info & storage tools
└── widgets/
    ├── recipe_card.dart            # Card with image, cook time & fav button
    ├── search_bar.dart             # Debounced search bar with clear button
    ├── category_item.dart          # Category filter chip with M3 styling
    └── loading_widget.dart         # Themed circular loading indicator
test/
└── widget_test.dart                # Unit & Widget tests (Model parsing & card taps)
```

---

## 4. Setup and Installation Instructions

### Prerequisites
- Flutter SDK `>=3.3.0` installed ([Flutter Installation Guide](https://docs.flutter.dev/get-started/install))
- Android Studio or VS Code with Flutter and Dart extensions
- Android device or Android Emulator running API level 21 or newer

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tastybite-recipe-finder.git
   cd tastybite-recipe-finder
   ```

2. **Install Flutter dependencies**:
   ```bash
   flutter pub get
   ```

3. **Run Unit and Widget Tests**:
   ```bash
   flutter test
   ```

4. **Run Application on Emulator or Connected Device**:
   ```bash
   flutter run
   ```

5. **Build Release APK**:
   ```bash
   flutter build apk --release
   ```
   *The compiled APK will be located at:* `build/app/outputs/flutter-apk/app-release.apk`

---

## 5. API Documentation

TastyBite utilizes **TheMealDB** API:
- **Search Meals by Name**: `https://www.themealdb.com/api/json/v1/1/search.php?s={query}`
- **Filter by Category**: `https://www.themealdb.com/api/json/v1/1/filter.php?c={category}`
- **Lookup Full Meal Details**: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`
- **Category List**: `https://www.themealdb.com/api/json/v1/1/categories.php`
- **Random Meal**: `https://www.themealdb.com/api/json/v1/1/random.php`
