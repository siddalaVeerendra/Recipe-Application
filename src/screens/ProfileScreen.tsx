import React, { useState } from 'react';
import {
  Soup,
  Moon,
  Sun,
  Scale,
  Trash2,
  Code2,
  Users,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';

export const ProfileScreen: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    useMetricUnits,
    toggleMetricUnits,
    clearStorage,
    favourites,
    customRecipes,
    categories,
    setActiveTab,
  } = useRecipe();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedToast, setClearedToast] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<'defect' | 'team' | null>(null);

  const handleClear = () => {
    clearStorage();
    setShowClearConfirm(false);
    setClearedToast(true);
    setTimeout(() => setClearedToast(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-2xl mx-auto w-full space-y-4">
      {/* App Identity Banner */}
      <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-950/30 dark:via-stone-900 border border-orange-200/70 dark:border-orange-900/40 rounded-3xl p-5 text-center relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-600/30 mb-3">
          <Soup className="w-8 h-8 stroke-[2]" />
        </div>
        <h1 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          TastyBite – Recipe Finder
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Flutter 3.x · Dart Sound Null Safety · Material 3
        </p>
        <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[11px] font-bold">
          Version 1.0.0 (Release APK Ready)
        </div>

        {/* Quick App Stats */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-stone-200/60 dark:border-stone-800">
          <div className="text-center">
            <div className="text-base font-extrabold text-orange-600">{favourites.length}</div>
            <div className="text-[11px] text-stone-500 font-medium">Favourites</div>
          </div>
          <div className="text-center border-x border-stone-200/60 dark:border-stone-800">
            <div className="text-base font-extrabold text-orange-600">{customRecipes.length}</div>
            <div className="text-[11px] text-stone-500 font-medium">My Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-base font-extrabold text-orange-600">{categories.length}</div>
            <div className="text-[11px] text-stone-500 font-medium">Categories</div>
          </div>
        </div>
      </div>

      {clearedToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Local storage cleared successfully!</span>
        </div>
      )}

      {/* App Preferences */}
      <div>
        <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase mb-2 ml-1">
          App Preferences
        </h2>
        <div className="bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800/80 overflow-hidden shadow-xs">
          {/* Theme Mode Toggle */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Dark Mode
                </div>
                <div className="text-[11px] text-stone-500">
                  {isDarkMode ? 'Dark theme enabled' : 'Light cream theme active'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                isDarkMode ? 'bg-orange-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Metric Units Toggle */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Measurement Units
                </div>
                <div className="text-[11px] text-stone-500">
                  {useMetricUnits ? 'Metric (grams, ml)' : 'Imperial (oz, lbs, cups)'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleMetricUnits}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-orange-900"
            >
              Switch to {useMetricUnits ? 'Imperial' : 'Metric'}
            </button>
          </div>
        </div>
      </div>

      {/* College Project Submission Tools */}
      <div>
        <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase mb-2 ml-1">
          College Project Documentation
        </h2>
        <div className="bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800/80 overflow-hidden shadow-xs">
          {/* Flutter Source & Submission Kit */}
          <button
            onClick={() => setActiveTab('code')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Inspect Flutter Source & pubspec.yaml
                </div>
                <div className="text-[11px] text-stone-500">
                  Browse, copy, or export full Dart project code
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </button>

          {/* Team Member Contributions */}
          <button
            onClick={() => setActiveInfoModal('team')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Team Member Contributions
                </div>
                <div className="text-[11px] text-stone-500">
                  Project roles, tasks & architectural responsibility
                </div>
              </div>
            </div>
            <Info className="w-4 h-4 text-stone-400" />
          </button>

          {/* Defect Log */}
          <button
            onClick={() => setActiveInfoModal('defect')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  QA & Defect Log (5 Bugs Fixed)
                </div>
                <div className="text-[11px] text-stone-500">
                  Edge cases, null safety fixes & error resilience
                </div>
              </div>
            </div>
            <Info className="w-4 h-4 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Storage Maintenance */}
      <div>
        <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase mb-2 ml-1">
          Storage Maintenance
        </h2>
        <div className="bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 shadow-xs">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 w-full"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset & Clear Local Storage</span>
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                Are you sure? This will remove all your custom recipes and favourites from this device.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Team Contributions Modal */}
      {activeInfoModal === 'team' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span>Team Contributions (College Group Project)</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              TastyBite Mobile Application Project - Khit Guntur
            </p>

            <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="font-bold text-stone-900 dark:text-stone-100">
                  Lead Developer / Architect
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Designed Provider state pattern (`RecipeProvider`, `FavouriteProvider`), MultiProvider architecture in `lib/main.dart`, and null safety models.
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="font-bold text-stone-900 dark:text-stone-100">
                  API & Storage Specialist
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Implemented `ApiService` with TheMealDB REST endpoints, JSON parsers, network error retries, and `StorageService` using `SharedPreferences`.
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="font-bold text-stone-900 dark:text-stone-100">
                  UI/UX & Mobile Engineer
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Built Material 3 food theme (Deep Orange & Warm Cream), `HomeScreen` grid, `RecipeDetailScreen` step checklists, and `CategoryItem` components.
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="font-bold text-stone-900 dark:text-stone-100">
                  QA, Testing & Form Validator
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Created `AddRecipeScreen` form validations, wrote `widget_test.dart` suite, compiled APK build guidelines, and managed the defect tracking log.
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveInfoModal(null)}
              className="mt-5 w-full py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Defect Log Modal */}
      {activeInfoModal === 'defect' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span>TastyBite QA Defect & Bug Tracking Log</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Documented software defects and their engineering resolutions
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>BUG-001: Null Instructions Crash</span>
                  <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                    Resolved
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  TheMealDB occasionally returns `null` for missing instructions. Added null fallback in `Recipe.fromMealDbJson`.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>BUG-002: Double-Tap Duplicate Favorites</span>
                  <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                    Resolved
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Rapid button tapping could register duplicate favorites. Guarded with ID check in `toggleFavourite`.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>BUG-003: Custom Recipe Loss on Restart</span>
                  <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                    Resolved
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Provider initialized before `loadCustomRecipes` completed. Added eager init lifecycle call during provider creation.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>BUG-004: Excessive API Search Calls</span>
                  <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                    Resolved
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Keyup triggered immediate network calls. Added submit handler and debounced inputs.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveInfoModal(null)}
              className="mt-5 w-full py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
