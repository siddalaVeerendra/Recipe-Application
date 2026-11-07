import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Clock,
  Users,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Globe,
  Sparkles,
  Timer as TimerIcon,
} from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipe } from '../context/RecipeContext';

interface RecipeDetailScreenProps {
  recipeId: string;
  onBack: () => void;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ recipeId, onBack }) => {
  const { loadFullRecipeDetails, isFavourite, toggleFavourite } = useRecipe();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Built-in cooking timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'timer'>('instructions');

  useEffect(() => {
    let mounted = true;
    const fetchRecipe = async () => {
      setLoading(true);
      const res = await loadFullRecipeDetails(recipeId);
      if (mounted) {
        setRecipe(res);
        if (res) {
          setTimerSeconds(res.cookingTime * 60);
        }
        setLoading(false);
      }
    };
    fetchRecipe();

    return () => {
      mounted = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [recipeId, loadFullRecipeDetails]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF7F2] dark:bg-[#12100E]">
        <div className="w-12 h-12 rounded-full border-3 border-orange-500 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
          Unfolding secret ingredients & cooking steps...
        </p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF7F2] dark:bg-[#12100E] text-center">
        <p className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">Recipe not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Recipes
        </button>
      </div>
    );
  }

  const fav = isFavourite(recipe.id);

  // Parse instruction steps into numbered array
  const steps = recipe.instructions
    ? recipe.instructions
        .split(/\r\n|\r|\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Text-to-speech for hands-free cooking
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${recipe.name}. Ingredients: ${recipe.ingredients
      .map((i) => `${i.measure} of ${i.name}`)
      .join(', ')}. Instructions: ${steps.join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this recipe for ${recipe.name} on TastyBite!\nCooking time: ${recipe.cookingTime} mins\nIngredients: ${recipe.ingredients.length} items.`
      );
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  // Format timer seconds to MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2] dark:bg-[#12100E] overflow-y-auto">
      {/* Top Floating Action Bar */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        {/* Back and Action Buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors"
              title="Share Recipe"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleFavourite(recipe)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                fav ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Recipe Title & Meta on Hero */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-orange-400 mb-1">
            <span className="uppercase">{recipe.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-stone-300">
              <Globe className="w-3 h-3" />
              {recipe.area}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black leading-tight tracking-tight drop-shadow-md">
            {recipe.name}
          </h1>
        </div>
      </div>

      {/* Share Toast Notification */}
      {copiedNotification && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 text-center animate-fade-in">
          Recipe summary copied to clipboard!
        </div>
      )}

      {/* Core Recipe Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white dark:bg-[#1E1B18] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-center shadow-xs">
            <Clock className="w-4 h-4 mx-auto text-orange-600 mb-1" />
            <div className="text-[10px] text-stone-500 font-medium">Cook Time</div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {recipe.cookingTime} mins
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1B18] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-center shadow-xs">
            <Users className="w-4 h-4 mx-auto text-orange-600 mb-1" />
            <div className="text-[10px] text-stone-500 font-medium">Servings</div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {recipe.servings} people
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1B18] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-center shadow-xs">
            <Sparkles className="w-4 h-4 mx-auto text-orange-600 mb-1" />
            <div className="text-[10px] text-stone-500 font-medium">Ingredients</div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {recipe.ingredients.length} items
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs (Ingredients, Steps, Cooking Timer) */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 dark:bg-stone-850 rounded-xl">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'instructions'
                ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Instructions ({completedSteps.size}/{steps.length || 1})
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'ingredients'
                ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Ingredients ({checkedIngredients.size}/{recipe.ingredients.length})
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'timer'
                ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <TimerIcon className="w-3.5 h-3.5" />
            <span>Timer</span>
          </button>
        </div>

        {/* Tab 1: Step-by-Step Instructions */}
        {activeTab === 'instructions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Step-by-Step Preparation
              </h2>
              {'speechSynthesis' in window && (
                <button
                  onClick={handleReadAloud}
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                    isSpeaking
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white dark:bg-[#1E1B18] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                  title="Hands-free cooking assistant"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                      <span>Stop Reading</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {steps.length === 0 ? (
              <p className="text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-[#1E1B18] p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 leading-relaxed">
                {recipe.instructions}
              </p>
            ) : (
              <div className="space-y-2">
                {steps.map((step, idx) => {
                  const isDone = completedSteps.has(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isDone
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-80'
                          : 'bg-white dark:bg-[#1E1B18] border-stone-200 dark:border-stone-800 hover:border-orange-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-xs leading-relaxed ${
                            isDone
                              ? 'line-through text-stone-400 dark:text-stone-500'
                              : 'text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Ingredients Checklist */}
        {activeTab === 'ingredients' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span>Tap an ingredient as you measure & prepare</span>
              <button
                onClick={() => setCheckedIngredients(new Set())}
                className="text-orange-600 hover:underline"
              >
                Reset
              </button>
            </div>

            {recipe.ingredients.length === 0 ? (
              <p className="text-xs text-stone-500 p-4 text-center">
                Refer to instructions for exact ingredient measurements.
              </p>
            ) : (
              <div className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => {
                  const isChecked = checkedIngredients.has(ing.name);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleIngredient(ing.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-stone-100/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 opacity-60'
                          : 'bg-white dark:bg-[#1E1B18] border-stone-200 dark:border-stone-800 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-400" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            isChecked
                              ? 'line-through text-stone-400 dark:text-stone-500'
                              : 'text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {ing.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                        {ing.measure}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Interactive Kitchen Timer */}
        {activeTab === 'timer' && (
          <div className="bg-white dark:bg-[#1E1B18] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col items-center text-center space-y-4">
            <div className="text-xs font-bold text-stone-500 tracking-wider uppercase">
              Cooking Countdown Timer
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-black text-orange-600 tracking-wider">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning((prev) => !prev)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{timerSeconds === 0 ? 'Start' : 'Resume'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(recipe.cookingTime * 60);
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 w-full justify-center">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(mins * 60);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-orange-600"
                >
                  +{mins}m
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
