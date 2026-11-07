import React, { useState } from 'react';
import {
  Search,
  X,
  RotateCw,
  UtensilsCrossed,
  ChefHat,
  Coffee,
  Sun,
  Moon,
  Sparkles,
  Flame,
  Fish,
  Leaf,
  Beef,
  Cake,
} from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe } from '../types/recipe';

interface HomeScreenProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectRecipe }) => {
  const {
    recipes,
    customRecipes,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    retry,
  } = useRecipe();

  const [inputVal, setInputVal] = useState(searchQuery);

  // Combine custom recipes with API recipes
  const allRecipes = React.useMemo(() => {
    let list = [...recipes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const customMatches = customRecipes.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
      return [...customMatches, ...list];
    }

    if (selectedCategory === 'All') {
      return [...customRecipes, ...list];
    }

    const customCategoryMatches = customRecipes.filter(
      (r) => r.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    return [...customCategoryMatches, ...list];
  }, [recipes, customRecipes, searchQuery, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal.trim());
  };

  const handleClear = () => {
    setInputVal('');
    setSearchQuery('');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'breakfast':
        return <Coffee className="w-4 h-4" />;
      case 'lunch':
        return <Sun className="w-4 h-4" />;
      case 'dinner':
        return <Moon className="w-4 h-4" />;
      case 'dessert':
        return <Cake className="w-4 h-4" />;
      case 'chicken':
        return <Flame className="w-4 h-4" />;
      case 'beef':
        return <Beef className="w-4 h-4" />;
      case 'vegetarian':
        return <Leaf className="w-4 h-4" />;
      case 'seafood':
        return <Fish className="w-4 h-4" />;
      default:
        return <ChefHat className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-4xl mx-auto w-full">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1">
              <span>Tasty</span>
              <span className="text-orange-600 dark:text-orange-500">Bite</span>
            </h1>
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
              Smart Recipe Finder
            </p>
          </div>
        </div>

        <button
          onClick={retry}
          className="p-2 rounded-xl text-stone-500 hover:text-orange-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="Refresh Feed"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-600' : ''}`} />
        </button>
      </div>

      {/* Hero Invitation Text */}
      <div className="mt-1 mb-3.5">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          What would you like to cook today?
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Discover handpicked recipes and home-made culinary secrets.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-orange-600 pointer-events-none" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search recipes, ingredients, pasta..."
            className="w-full bg-white dark:bg-[#1E1B18] border border-stone-200 dark:border-stone-800 rounded-xl pl-10 pr-20 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-xs transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {inputVal && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-orange-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Category Pills Scroller */}
      <div className="mb-4 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                  : 'bg-white dark:bg-[#1E1B18] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300 dark:hover:border-stone-700'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-orange-600'}>
                {getCategoryIcon(cat)}
              </span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Banner (Shown on initial 'All' view when not searching) */}
      {!searchQuery && selectedCategory === 'All' && !isLoading && allRecipes.length > 0 && (
        <div
          onClick={() => onSelectRecipe(allRecipes[0])}
          className="relative mb-5 rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-stone-200/80 dark:border-stone-800"
        >
          <div className="aspect-[21/9] w-full bg-stone-900 overflow-hidden relative">
            <img
              src={allRecipes[0].imageUrl}
              alt={allRecipes[0].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
              <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RECIPE OF THE DAY</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white line-clamp-1">
                {allRecipes[0].name}
              </h3>
              <p className="text-white/80 text-xs line-clamp-1 mt-0.5">
                {allRecipes[0].category} · {allRecipes[0].cookingTime} mins · {allRecipes[0].area}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* States: Loading, Error, Empty, or Recipe Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[#1E1B18] rounded-2xl p-3 border border-stone-200 dark:border-stone-800 animate-pulse space-y-3"
            >
              <div className="aspect-[16/11] bg-stone-200 dark:bg-stone-800 rounded-xl" />
              <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded-md w-3/4" />
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200 dark:border-stone-800 my-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Couldn't fetch recipes
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs">{error}</p>
          <button
            onClick={retry}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      ) : allRecipes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200 dark:border-stone-800 my-4">
          <ChefHat className="w-12 h-12 text-stone-300 dark:text-stone-700 mb-3" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">No recipes found</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs">
            {searchQuery
              ? `No matches for "${searchQuery}". Try searching for pasta, chicken, or salad.`
              : 'No recipes found in this category.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setInputVal('');
            }}
            className="mt-4 text-xs font-semibold text-orange-600 hover:underline"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 pb-6">
          {allRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
          ))}
        </div>
      )}
    </div>
  );
};
