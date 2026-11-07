import React from 'react';
import { Wifi, Battery, Smartphone, Monitor, RotateCw, Code2 } from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({ children }) => {
  const {
    isMobileFrame,
    toggleMobileFrame,
    deviceOrientation,
    toggleOrientation,
    activeTab,
    setActiveTab,
  } = useRecipe();

  // Current formatted time for Android status bar
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (!isMobileFrame) {
    // Desktop / Tablet Expanded Mode
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col">
        {/* Top Desktop Controls Toolbar */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
              TB
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                TastyBite – Flutter Recipe Finder
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  v1.0.0 · Dart 3.x / Provider
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'code'
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
              title="Inspect Flutter Dart files and submission kit"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Flutter Source & Submission Kit</span>
            </button>

            <button
              onClick={toggleMobileFrame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="Switch to Android Phone Simulator Frame"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              <span>Mobile Phone View</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden min-h-[calc(100vh-140px)] flex flex-col">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Android Mobile Simulator Frame View
  const isLandscape = deviceOrientation === 'landscape';

  return (
    <div className="min-h-screen bg-stone-200/90 dark:bg-stone-950 flex flex-col items-center justify-center p-2 sm:p-6 selection:bg-orange-200 selection:text-orange-900">
      {/* Top Simulator Control Bar */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Android Pixel Simulator (Material 3)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors font-semibold ${
              activeTab === 'code'
                ? 'bg-orange-600 text-white'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-orange-600 dark:text-orange-400'
            }`}
            title="Inspect Flutter Dart source code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Flutter Code</span>
          </button>

          <button
            onClick={toggleOrientation}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            title="Rotate Device (Portrait / Landscape)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleMobileFrame}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="Switch to Expanded Desktop Layout"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>
      </div>

      {/* Realistic Phone Bezel */}
      <div
        className={`relative transition-all duration-300 ease-out bg-stone-900 dark:bg-black rounded-[48px] p-3 shadow-2xl border-4 border-stone-800/80 dark:border-stone-700 ${
          isLandscape
            ? 'w-[780px] h-[420px] max-w-[95vw]'
            : 'w-[390px] h-[820px] max-w-[95vw] max-h-[92vh]'
        }`}
      >
        {/* Device Outer Glow & Volume/Power Buttons simulation */}
        <div className="absolute -left-1 top-24 w-1 h-12 bg-stone-700 rounded-l" />
        <div className="absolute -left-1 top-40 w-1 h-16 bg-stone-700 rounded-l" />
        <div className="absolute -right-1 top-28 w-1 h-16 bg-stone-700 rounded-r" />

        {/* Screen Glass Area */}
        <div className="relative w-full h-full bg-[#FAF7F2] dark:bg-[#12100E] rounded-[38px] overflow-hidden flex flex-col text-stone-900 dark:text-stone-100 shadow-inner">
          {/* Top Punch-hole & Camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-stone-950 border border-stone-800/60 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-800" />
            </div>
          </div>

          {/* Android Status Bar */}
          <div className="h-9 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300 z-40 select-none bg-transparent">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* App Body Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Navigation Gesture Pill */}
          <div className="h-5 flex items-center justify-center bg-transparent z-40 select-none">
            <div className="w-28 h-1 bg-stone-400/60 dark:bg-stone-600/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
