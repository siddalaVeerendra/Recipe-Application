import React, { useState } from 'react';
import { Heart, Search, Utensils, Trash2 } from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe } from '../types/recipe';

interface FavouritesScreenProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export const FavouritesScreen: React.FC<FavouritesScreenProps> = ({ onSelectRecipe }) => {
  const { favourites, setActiveTab, removeFavourite } = useRecipe();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive unique categories present in favourites
  const availableCategories = React.useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    favourites.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }, [favourites]);

  const filteredFavourites = React.useMemo(() => {
    return favourites.filter((r) => {
      const matchesSearch =
        !filterQuery.trim() ||
        r.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(filterQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [favourites, filterQuery, selectedCategory]);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-4xl mx-auto w-full">
      {/* Screen Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-3">
        <div>
          <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Favourite Recipes</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600">
              {favourites.length}
            </span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Quick access to all your saved dishes anytime offline.
          </p>
        </div>
      </div>

      {favourites.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200 dark:border-stone-800 my-4">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            No Favourite Recipes Yet
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs leading-relaxed">
            Tap the heart icon on any meal in your feed or detail screen to store it here for
            offline cooking.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="mt-5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Discover Recipes</span>
          </button>
        </div>
      ) : (
        <>
          {/* Quick Filter & Category Bar */}
          <div className="space-y-2.5 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter saved favourites..."
                className="w-full bg-white dark:bg-[#1E1B18] border border-stone-200 dark:border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {availableCategories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favourites Grid */}
          {filteredFavourites.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200 dark:border-stone-800">
              No favourites match "{filterQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 pb-8">
              {filteredFavourites.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard recipe={recipe} onSelect={onSelectRecipe} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavourite(recipe.id);
                    }}
                    title="Remove from Favourites"
                    className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-stone-900/80 text-white/90 hover:text-red-400 hover:bg-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
