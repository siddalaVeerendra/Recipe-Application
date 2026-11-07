import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types/recipe';
import {
  searchMealsApi,
  fetchCategoryMealsApi,
  fetchMealDetailsApi,
  POPULAR_CATEGORIES,
} from '../services/mealDbApi';

const STORAGE_KEY_CUSTOM = 'tastybite_custom_recipes_v1';
const STORAGE_KEY_FAVS = 'tastybite_favourites_v1';
const STORAGE_KEY_THEME = 'tastybite_dark_theme';
const STORAGE_KEY_METRIC = 'tastybite_metric_units';

interface RecipeContextType {
  recipes: Recipe[];
  customRecipes: Recipe[];
  favourites: Recipe[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  activeRecipeId: string | null;
  activeTab: 'home' | 'favourites' | 'add' | 'profile' | 'code';
  isDarkMode: boolean;
  isMobileFrame: boolean;
  deviceOrientation: 'portrait' | 'landscape';
  useMetricUnits: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setActiveTab: (tab: 'home' | 'favourites' | 'add' | 'profile' | 'code') => void;
  setActiveRecipeId: (id: string | null) => void;
  toggleFavourite: (recipe: Recipe) => void;
  isFavourite: (id: string) => boolean;
  addCustomRecipe: (recipe: Recipe) => void;
  deleteCustomRecipe: (id: string) => void;
  removeFavourite: (id: string) => void;
  retry: () => void;
  toggleDarkMode: () => void;
  toggleMobileFrame: () => void;
  toggleOrientation: () => void;
  toggleMetricUnits: () => void;
  clearStorage: () => void;
  loadFullRecipeDetails: (id: string) => Promise<Recipe | null>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favourites, setFavourites] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories] = useState<string[]>(POPULAR_CATEGORIES);
  const [selectedCategory, setSelectedCategoryState] = useState<string>('All');
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'favourites' | 'add' | 'profile' | 'code'>('home');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_THEME) === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [useMetricUnits, setUseMetricUnits] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_METRIC) !== 'false';
    } catch {
      return true;
    }
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, String(isDarkMode));
  }, [isDarkMode]);

  // Persist custom recipes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customRecipes));
    } catch (e) {
      console.error('Storage write error for custom recipes', e);
    }
  }, [customRecipes]);

  // Persist favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favourites));
    } catch (e) {
      console.error('Storage write error for favourites', e);
    }
  }, [favourites]);

  // Fetch initial or category/search recipes
  const fetchRecipesData = useCallback(async (cat: string, search: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (search.trim()) {
        const results = await searchMealsApi(search.trim());
        setRecipes(results);
      } else if (cat === 'All') {
        // Fetch a vibrant initial feed
        const results = await searchMealsApi('chicken');
        if (results.length === 0) {
          const fallback = await searchMealsApi('');
          setRecipes(fallback);
        } else {
          setRecipes(results);
        }
      } else {
        const results = await fetchCategoryMealsApi(cat);
        setRecipes(results);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load recipes. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipesData(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, fetchRecipesData]);

  const setSelectedCategory = (category: string) => {
    setSelectedCategoryState(category);
    setSearchQueryState('');
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
  };

  const retry = () => {
    fetchRecipesData(selectedCategory, searchQuery);
  };

  const isFavourite = useCallback(
    (id: string) => favourites.some((r) => r.id === id),
    [favourites]
  );

  const toggleFavourite = useCallback((recipe: Recipe) => {
    setFavourites((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id);
      } else {
        return [recipe, ...prev];
      }
    });
  }, []);

  const removeFavourite = useCallback((id: string) => {
    setFavourites((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addCustomRecipe = useCallback((newRecipe: Recipe) => {
    setCustomRecipes((prev) => [newRecipe, ...prev]);
  }, []);

  const deleteCustomRecipe = useCallback((id: string) => {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleMobileFrame = () => setIsMobileFrame((prev) => !prev);
  const toggleOrientation = () =>
    setDeviceOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'));
  const toggleMetricUnits = () => {
    setUseMetricUnits((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_METRIC, String(next));
      return next;
    });
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY_CUSTOM);
    localStorage.removeItem(STORAGE_KEY_FAVS);
    setCustomRecipes([]);
    setFavourites([]);
  };

  const loadFullRecipeDetails = async (id: string): Promise<Recipe | null> => {
    // Check in custom recipes first
    const custom = customRecipes.find((r) => r.id === id);
    if (custom) return custom;

    // Check in existing recipes with full ingredients
    const existing = recipes.find((r) => r.id === id);
    if (existing && existing.ingredients && existing.ingredients.length > 0) {
      return existing;
    }

    // Fetch from MealDB
    return await fetchMealDetailsApi(id);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        customRecipes,
        favourites,
        categories,
        selectedCategory,
        searchQuery,
        isLoading,
        error,
        activeRecipeId,
        activeTab,
        isDarkMode,
        isMobileFrame,
        deviceOrientation,
        useMetricUnits,
        setSearchQuery,
        setSelectedCategory,
        setActiveTab,
        setActiveRecipeId,
        toggleFavourite,
        isFavourite,
        addCustomRecipe,
        deleteCustomRecipe,
        removeFavourite,
        retry,
        toggleDarkMode,
        toggleMobileFrame,
        toggleOrientation,
        toggleMetricUnits,
        clearStorage,
        loadFullRecipeDetails,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};
