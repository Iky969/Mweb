import React, { useState } from 'react';
import { Search, Sparkles, X, Music2, Disc3 } from 'lucide-react';

export default function Header({ onSearch, isLoading, searchQuery }) {
  const [inputVal, setInputVal] = useState(searchQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleTagClick = (tag) => {
    setInputVal(tag);
    onSearch(tag);
  };

  const clearInput = () => {
    setInputVal('');
  };

  const presetTags = ['Coldplay', 'Radiohead', 'Billie Eilish', 'Daft Punk', 'Lofi Beats'];

  return (
    <header className="w-full pt-6 pb-4 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Top Brand Bar */}
      <div className="w-full flex items-center justify-between mb-5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl glass-button">
            <div className="absolute inset-0 rounded-2xl bg-white/10 blur-sm group-hover:bg-white/20 transition-all" />
            <Disc3 className="w-6 h-6 text-white/90 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Aura
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full glass-pill text-white/70">
                Liquid Glass
              </span>
            </div>
            <p className="text-xs text-white/50 tracking-wide">Sound & Light in Motion</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-white/60 glass-pill px-3 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-white/80" />
          <span>Deezer Stream Proxy</span>
        </div>
      </div>

      {/* Glass Search Bar */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative mb-3">
        <div className="relative flex items-center rounded-2xl glass-panel p-1.5 transition-all focus-within:border-white/40 focus-within:shadow-[0_0_25px_rgba(255,255,255,0.12)]">
          <div className="pl-4 pr-2 text-white/40 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-white/60" />
            )}
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search tracks, artists, albums (e.g. Coldplay)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/40 px-2 py-2.5 focus:outline-none tracking-wide"
          />

          {inputVal && (
            <button
              type="button"
              onClick={clearInput}
              className="p-1.5 text-white/40 hover:text-white/80 transition-colors mr-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl glass-button text-sm font-medium text-white/90 hover:text-white whitespace-nowrap active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Preset Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-white/40 text-[11px] mr-1">Trending:</span>
        {presetTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-xs font-normal transition-all ${
              searchQuery?.toLowerCase() === tag.toLowerCase()
                ? 'bg-white/25 text-white border border-white/40 shadow-sm'
                : 'glass-pill text-white/70 hover:text-white hover:bg-white/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </header>
  );
}
