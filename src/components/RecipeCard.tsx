import React, { useState } from 'react';
import { Heart, Clock, Users, Sparkles, ChefHat } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipe } from '../context/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { isFavourite, toggleFavourite } = useRecipe();
  const [imageError, setImageError] = useState(false);
  const fav = isFavourite(recipe.id);

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite(recipe);
  };

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group relative bg-white dark:bg-[#1E1B18] rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col active:scale-[0.985]"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        {!imageError ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-950/30 text-orange-600">
            <ChefHat className="w-8 h-8 stroke-[1.5]" />
            <span className="text-[11px] font-semibold mt-1">Tasty Recipe</span>
          </div>
        )}

        {/* Gradient Scrim for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Custom Recipe Badge */}
        {recipe.isCustom && (
          <div className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>My Recipe</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute bottom-2.5 left-2.5 text-white text-[11px] font-medium tracking-tight bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
          {recipe.category}
        </div>

        {/* Favourite Button */}
        <button
          onClick={handleFavClick}
          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            fav
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-200 backdrop-blur-xs hover:bg-white dark:hover:bg-stone-800 shadow-sm'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${fav ? 'fill-current' : 'stroke-[2.2]'}`}
          />
        </button>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {recipe.name}
          </h3>
          <p className="text-[12px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
            {recipe.description || `${recipe.area} classic dish`}
          </p>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-[11px] text-stone-600 dark:text-stone-400 font-medium pt-2 mt-2 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>{recipe.cookingTime}m</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
