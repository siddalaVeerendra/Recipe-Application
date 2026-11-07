/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RecipeProvider, useRecipe } from './context/RecipeContext';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './screens/HomeScreen';
import { RecipeDetailScreen } from './screens/RecipeDetailScreen';
import { AddRecipeScreen } from './screens/AddRecipeScreen';
import { FavouritesScreen } from './screens/FavouritesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { Recipe } from './types/recipe';

const MainAppContent: React.FC = () => {
  const { activeTab, activeRecipeId, setActiveRecipeId } = useRecipe();

  const handleSelectRecipe = (recipe: Recipe) => {
    setActiveRecipeId(recipe.id);
  };

  const handleBackToFeed = () => {
    setActiveRecipeId(null);
  };

  return (
    <AndroidPhoneFrame>
      <div className="flex-1 flex flex-col min-h-full">
        {/* Active View Router */}
        <div className="flex-1 flex flex-col">
          {activeRecipeId ? (
            <RecipeDetailScreen recipeId={activeRecipeId} onBack={handleBackToFeed} />
          ) : (
            <>
              {activeTab === 'home' && <HomeScreen onSelectRecipe={handleSelectRecipe} />}
              {activeTab === 'favourites' && (
                <FavouritesScreen onSelectRecipe={handleSelectRecipe} />
              )}
              {activeTab === 'add' && <AddRecipeScreen />}
              {activeTab === 'profile' && <ProfileScreen />}
              {activeTab === 'code' && <FlutterCodeViewer />}
            </>
          )}
        </div>

        {/* Material 3 Bottom Navigation Bar */}
        <BottomNavBar />
      </div>
    </AndroidPhoneFrame>
  );
};

export default function App() {
  return (
    <RecipeProvider>
      <MainAppContent />
    </RecipeProvider>
  );
}
