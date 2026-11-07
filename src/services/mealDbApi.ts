import { Recipe, RecipeIngredient } from '../types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Fallback recipes in case the client has offline network or network issues
const FALLBACK_RECIPES: Recipe[] = [
  {
    id: '52772',
    name: 'Teriyaki Chicken Casserole',
    category: 'Chicken',
    area: 'Japanese',
    description: 'Savory sweet teriyaki baked chicken with crisp vegetables and tender rice.',
    instructions:
      '1. Preheat oven to 350°F (175°C).\n2. In a saucepan, mix soy sauce, water, brown sugar, ginger, and garlic; simmer until thickened.\n3. Arrange chicken breasts in a baking dish and pour half of the sauce over them.\n4. Bake for 30 minutes until chicken is tender and cooked through.\n5. Serve over steamed jasmine rice garnished with sesame seeds and green onions.',
    imageUrl: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    cookingTime: 40,
    servings: 4,
    ingredients: [
      { name: 'Soy Sauce', measure: '3/4 cup' },
      { name: 'Water', measure: '1/2 cup' },
      { name: 'Brown Sugar', measure: '1/4 cup' },
      { name: 'Ground Ginger', measure: '1/2 tsp' },
      { name: 'Garlic Powder', measure: '1/2 tsp' },
      { name: 'Chicken Breasts', measure: '4 boneless' },
      { name: 'Sesame Seeds', measure: '1 tbsp' },
    ],
    tags: ['Meat', 'Casserole'],
  },
  {
    id: '52893',
    name: 'Apple & Blackberry Crumble',
    category: 'Dessert',
    area: 'British',
    description: 'Golden spiced oats and butter topping over warm stewed bramley apples and blackberries.',
    instructions:
      '1. Heat oven to 190°C/170°C fan/gas 5.\n2. Tip the flour and sugar into a bowl with a pinch of salt.\n3. Add the butter pieces, rubbing gently with your fingertips until crumbly.\n4. Toss sliced apples and blackberries with sugar and arrange in an ovenproof dish.\n5. Scatter crumble topping evenly over the fruit and bake for 35-40 minutes until golden and bubbling.',
    imageUrl: 'https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg',
    cookingTime: 45,
    servings: 6,
    ingredients: [
      { name: 'Bramley Apples', measure: '1 kg' },
      { name: 'Blackberries', measure: '250g' },
      { name: 'Flour', measure: '200g' },
      { name: 'Butter', measure: '120g' },
      { name: 'Caster Sugar', measure: '100g' },
    ],
    tags: ['Pudding', 'Fruit', 'Dessert'],
  },
  {
    id: '53065',
    name: 'Mediterranean Shakshuka',
    category: 'Breakfast',
    area: 'Tunisian',
    description: 'Gently poached eggs in a rich, spiced tomato, red pepper, and cumin sauce.',
    instructions:
      '1. Heat olive oil in a large skillet over medium heat. Add chopped onions and bell peppers, sauté for 5 minutes.\n2. Add garlic, cumin, smoked paprika, and chili powder; cook for 1 minute until fragrant.\n3. Pour in crushed tomatoes and simmer gently for 10-15 minutes until sauce thickens.\n4. Use a wooden spoon to make small wells in the sauce and crack eggs gently into each well.\n5. Cover with lid and cook for 5 to 8 minutes until whites are set and yolks remain runny.\n6. Garnish with chopped fresh parsley and crumbled feta. Serve with warm crusty bread.',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    cookingTime: 25,
    servings: 3,
    ingredients: [
      { name: 'Eggs', measure: '4 large' },
      { name: 'Olive Oil', measure: '2 tbsp' },
      { name: 'Red Bell Pepper', measure: '1 diced' },
      { name: 'Crushed Tomatoes', measure: '1 can (400g)' },
      { name: 'Garlic', measure: '3 cloves minced' },
      { name: 'Cumin', measure: '1 tsp' },
      { name: 'Paprika', measure: '1 tsp' },
      { name: 'Feta Cheese', measure: '50g crumbled' },
    ],
    tags: ['Egg', 'Spicy', 'Brunch'],
  },
  {
    id: '52959',
    name: 'Classic Baked Lasagna',
    category: 'Dinner',
    area: 'Italian',
    description: 'Layered rich bolognese meat ragù, tender pasta sheets, and creamy parmesan béchamel.',
    instructions:
      '1. Brown minced beef and onions in a skillet. Add garlic, tomato paste, and crushed tomatoes; simmer for 30 mins.\n2. In a saucepan, melt butter, whisk in flour, and slowly pour milk to form a velvety white béchamel sauce.\n3. In a 9x13 inch dish, layer meat sauce, lasagna pasta sheets, and béchamel sauce.\n4. Repeat layers 3 times, finishing with a generous layer of mozzarella and parmesan.\n5. Bake at 375°F (190°C) for 35 minutes until browned and bubbly.',
    imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    cookingTime: 65,
    servings: 8,
    ingredients: [
      { name: 'Lasagna Noodles', measure: '12 sheets' },
      { name: 'Minced Beef', measure: '500g' },
      { name: 'Tomato Sauce', measure: '800g' },
      { name: 'Mozzarella', measure: '300g shredded' },
      { name: 'Parmesan', measure: '50g grated' },
      { name: 'Milk', measure: '500ml' },
      { name: 'Butter', measure: '40g' },
    ],
    tags: ['Pasta', 'Cheesy', 'ComfortFood'],
  },
];

export function parseMealDbMeal(raw: Record<string, any>): Recipe {
  const ingredients: RecipeIngredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ing = raw[`strIngredient${i}`];
    const measure = raw[`strMeasure${i}`];
    if (ing && typeof ing === 'string' && ing.trim() && ing.trim().toLowerCase() !== 'null') {
      ingredients.push({
        name: ing.trim(),
        measure: measure && typeof measure === 'string' && measure.trim() ? measure.trim() : 'to taste',
      });
    }
  }

  const rawInstructions = raw.strInstructions || '';
  const category = raw.strCategory || 'General';
  const area = raw.strArea || 'International';
  const tags = raw.strTags
    ? raw.strTags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];

  const calculatedTime = Math.max(
    15,
    Math.min(75, 15 + ingredients.length * 2 + Math.floor(rawInstructions.length / 80))
  );

  return {
    id: raw.idMeal || String(Date.now()),
    name: raw.strMeal || 'Untitled Recipe',
    category,
    area,
    description: `A classic ${area} specialty from the ${category} collection prepared with fragrant seasonings.`,
    instructions: rawInstructions || 'Refer to ingredients and simmer according to preferred taste.',
    imageUrl:
      raw.strMealThumb ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    cookingTime: calculatedTime,
    servings: 4,
    ingredients,
    youtubeUrl: raw.strYoutube || null,
    tags,
  };
}

export async function searchMealsApi(query: string): Promise<Recipe[]> {
  try {
    const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query.trim())}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.meals) return [];
    return data.meals.map(parseMealDbMeal);
  } catch (err) {
    console.warn('API query failed, filtering fallback dataset', err);
    const q = query.toLowerCase();
    return FALLBACK_RECIPES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }
}

export async function fetchCategoryMealsApi(category: string): Promise<Recipe[]> {
  if (category === 'All') {
    return searchMealsApi('');
  }

  // Handle mapped MealDB categories (e.g. Lunch/Dinner might map to Chicken/Beef/Pasta)
  let apiCategory = category;
  if (category === 'Lunch') apiCategory = 'Chicken';
  if (category === 'Dinner') apiCategory = 'Beef';

  try {
    const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(apiCategory)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.meals) {
      // Fallback to search
      return searchMealsApi(category);
    }

    return data.meals.slice(0, 16).map((m: any) => ({
      id: m.idMeal,
      name: m.strMeal,
      category,
      area: 'Popular',
      description: `Delicious ${category} specialty crafted with authentic ingredients.`,
      instructions: 'Click to load detailed recipe steps and full ingredient measurements.',
      imageUrl: m.strMealThumb,
      cookingTime: 25 + (Math.abs(Number(m.idMeal) || 0) % 30),
      servings: 2 + (Math.abs(Number(m.idMeal) || 0) % 4),
      ingredients: [],
    }));
  } catch (err) {
    console.warn('Category fetch error, using fallback:', err);
    return FALLBACK_RECIPES.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export async function fetchMealDetailsApi(id: string): Promise<Recipe | null> {
  // Check fallback first
  const fallback = FALLBACK_RECIPES.find((r) => r.id === id);
  if (fallback) return fallback;

  try {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.meals || data.meals.length === 0) return null;
    return parseMealDbMeal(data.meals[0]);
  } catch (err) {
    console.error('Fetch details failed:', err);
    return fallback || null;
  }
}

export async function fetchRandomMealApi(): Promise<Recipe | null> {
  try {
    const res = await fetch(`${BASE_URL}/random.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.meals || data.meals.length === 0) return FALLBACK_RECIPES[0];
    return parseMealDbMeal(data.meals[0]);
  } catch {
    return FALLBACK_RECIPES[0];
  }
}

export const POPULAR_CATEGORIES = [
  'All',
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
