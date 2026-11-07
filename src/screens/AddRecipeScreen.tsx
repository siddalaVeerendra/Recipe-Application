import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRecipe } from '../context/RecipeContext';
import { Recipe, RecipeIngredient } from '../types/recipe';

const SAMPLE_IMAGE_PRESETS = [
  {
    label: 'Pasta & Noodles',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Warm Soup / Stew',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Bakery & Dessert',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Salad & Veggie Bowl',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
];

export const AddRecipeScreen: React.FC = () => {
  const { addCustomRecipe, setActiveTab } = useRecipe();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [cookingTime, setCookingTime] = useState('30');
  const [servings, setServings] = useState('4');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  // Dynamic ingredient rows
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: '', measure: '' },
    { name: '', measure: '' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const addIngredientRow = () => {
    setIngredients((prev) => [...prev, { name: '', measure: '' }]);
  };

  const removeIngredientRow = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: 'name' | 'measure', value: string) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Recipe name is required.';
    else if (name.trim().length < 3) errs.name = 'Recipe name must be at least 3 characters.';

    if (!description.trim()) errs.description = 'A short description is required.';

    if (!instructions.trim()) errs.instructions = 'Cooking instructions are required.';
    else if (instructions.trim().length < 15)
      errs.instructions = 'Instructions should have at least 15 characters.';

    const timeNum = Number(cookingTime);
    if (!cookingTime || isNaN(timeNum) || timeNum <= 0) {
      errs.cookingTime = 'Enter a valid cooking time in minutes (e.g. 25).';
    }

    const servingsNum = Number(servings);
    if (!servings || isNaN(servingsNum) || servingsNum <= 0) {
      errs.servings = 'Enter a valid number of servings (e.g. 4).';
    }

    // Validate ingredients
    const validIngredients = ingredients.filter((i) => i.name.trim().length > 0);
    if (validIngredients.length === 0) {
      errs.ingredients = 'Add at least one ingredient with a name.';
    }

    if (imageUrl.trim()) {
      try {
        new URL(imageUrl.trim());
      } catch {
        errs.imageUrl = 'Please enter a valid URL (starting with http:// or https://).';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fallbackImg =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

    const validIngredients = ingredients
      .filter((i) => i.name.trim().length > 0)
      .map((i) => ({
        name: i.name.trim(),
        measure: i.measure.trim() || 'to taste',
      }));

    const newRecipe: Recipe = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      category,
      area: 'Home Kitchen',
      description: description.trim(),
      instructions: instructions.trim(),
      imageUrl: fallbackImg,
      cookingTime: Number(cookingTime) || 30,
      servings: Number(servings) || 4,
      ingredients: validIngredients,
      isCustom: true,
      createdAt: Date.now(),
      tags: ['HomeCooked', category],
    };

    addCustomRecipe(newRecipe);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setIsSuccess(true);
  };

  const handleResetForm = () => {
    setName('');
    setDescription('');
    setInstructions('');
    setImageUrl('');
    setCookingTime('30');
    setServings('4');
    setIngredients([
      { name: '', measure: '' },
      { name: '', measure: '' },
    ]);
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Recipe Saved Successfully!
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 mb-6 leading-relaxed">
          Your recipe <span className="font-bold text-orange-600">"{name}"</span> has been saved to
          your device's local storage and is now ready in your recipes feed.
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setActiveTab('home')}
            className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm"
          >
            View in Feed
          </button>
          <button
            onClick={handleResetForm}
            className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-2xl mx-auto w-full">
      <div className="pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
        <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
          <span>Add Custom Recipe</span>
          <Sparkles className="w-4 h-4 text-orange-600" />
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Write down your kitchen creations with full ingredients and step instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-12">
        {/* Recipe Name */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Recipe Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grandma's Golden Cinnamon Apple Pie"
            className={`w-full bg-white dark:bg-[#1E1B18] border rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs ${
              errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 dark:border-stone-800 focus:border-orange-500'
            }`}
          />
          {errors.name && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name}</p>}
        </div>

        {/* Category & Time & Servings Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-[#1E1B18] border border-stone-200 dark:border-stone-800 rounded-xl px-2.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-xs"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Seafood">Seafood</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Time (mins) *
            </label>
            <input
              type="number"
              min="1"
              max="600"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className={`w-full bg-white dark:bg-[#1E1B18] border rounded-xl px-3 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs ${
                errors.cookingTime
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-200 dark:border-stone-800 focus:border-orange-500'
              }`}
            />
            {errors.cookingTime && (
              <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.cookingTime}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Servings *
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className={`w-full bg-white dark:bg-[#1E1B18] border rounded-xl px-3 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs ${
                errors.servings
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-200 dark:border-stone-800 focus:border-orange-500'
              }`}
            />
            {errors.servings && (
              <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.servings}</p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Short Description *
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the flavors, textures, and origins of this dish..."
            className={`w-full bg-white dark:bg-[#1E1B18] border rounded-xl p-3 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs ${
              errors.description
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 dark:border-stone-800 focus:border-orange-500'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Image URL & Quick Sample Presets */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Recipe Image URL (optional)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or choose preset below"
              className={`w-full bg-white dark:bg-[#1E1B18] border rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs ${
                errors.imageUrl
                  ? 'border-red-500'
                  : 'border-stone-200 dark:border-stone-800 focus:border-orange-500'
              }`}
            />
          </div>
          {errors.imageUrl && (
            <p className="text-[11px] text-red-500 mb-2 font-medium">{errors.imageUrl}</p>
          )}

          {/* Quick Preset Selector */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Quick Presets:
            </span>
            {SAMPLE_IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                  imageUrl === preset.url
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-orange-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Dynamic Rows */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Ingredients * ({ingredients.length})
            </label>
            <button
              type="button"
              onClick={addIngredientRow}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ingredient</span>
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  placeholder="Ingredient (e.g. Flour)"
                  className="flex-2 bg-white dark:bg-[#1E1B18] border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                />
                <input
                  type="text"
                  value={ing.measure}
                  onChange={(e) => updateIngredient(idx, 'measure', e.target.value)}
                  placeholder="Measure (e.g. 2 cups)"
                  className="flex-1 bg-white dark:bg-[#1E1B18] border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(idx)}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.ingredients && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.ingredients}</p>
          )}
        </div>

        {/* Step-by-Step Cooking Instructions */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Step-by-Step Instructions *
          </label>
          <textarea
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="1. Preheat the oven to 375°F (190°C).&#10;2. Mix dry ingredients in a large glass bowl.&#10;3. Fold in butter and gently knead until smooth."
            className={`w-full bg-white dark:bg-[#1E1B18] border rounded-xl p-3 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs ${
              errors.instructions
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 dark:border-stone-800 focus:border-orange-500'
            }`}
          />
          {errors.instructions && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.instructions}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Save Recipe to Device Storage</span>
          </button>
        </div>
      </form>
    </div>
  );
};
