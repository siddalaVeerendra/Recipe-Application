import React from 'react';
import { Home, Heart, PlusCircle, User, Code } from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, favourites, setActiveRecipeId } = useRecipe();

  const handleTabClick = (tab: 'home' | 'favourites' | 'add' | 'profile' | 'code') => {
    setActiveRecipeId(null); // Clear recipe detail to show main tab
    setActiveTab(tab);
  };

  return (
    <nav className="shrink-0 bg-white/95 dark:bg-[#1E1B18]/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800/80 px-2 py-1.5 z-30 select-none">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home */}
        <button
          onClick={() => handleTabClick('home')}
          className={`group flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[64px] min-h-[48px] ${
            activeTab === 'home' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-orange-100 dark:bg-orange-950/60 scale-105'
                : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800/60'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">Home</span>
        </button>

        {/* Favourites */}
        <button
          onClick={() => handleTabClick('favourites')}
          className={`group flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[64px] min-h-[48px] relative ${
            activeTab === 'favourites' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-all duration-200 relative ${
              activeTab === 'favourites'
                ? 'bg-orange-100 dark:bg-orange-950/60 scale-105'
                : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800/60'
            }`}
          >
            <Heart className="w-5 h-5 stroke-[2.2]" />
            {favourites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favourites.length > 9 ? '9+' : favourites.length}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">Favourites</span>
        </button>

        {/* Add Recipe */}
        <button
          onClick={() => handleTabClick('add')}
          className={`group flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[64px] min-h-[48px] ${
            activeTab === 'add' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-all duration-200 ${
              activeTab === 'add'
                ? 'bg-orange-100 dark:bg-orange-950/60 scale-105'
                : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800/60'
            }`}
          >
            <PlusCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">Add Recipe</span>
        </button>

        {/* Profile / About */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`group flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[64px] min-h-[48px] ${
            activeTab === 'profile' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-orange-100 dark:bg-orange-950/60 scale-105'
                : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800/60'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">Profile</span>
        </button>

        {/* Flutter Source Code & Submission Kit */}
        <button
          onClick={() => handleTabClick('code')}
          className={`group flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[64px] min-h-[48px] ${
            activeTab === 'code' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-all duration-200 ${
              activeTab === 'code'
                ? 'bg-orange-100 dark:bg-orange-950/60 scale-105'
                : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800/60'
            }`}
          >
            <Code className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">Flutter Code</span>
        </button>
      </div>
    </nav>
  );
};
