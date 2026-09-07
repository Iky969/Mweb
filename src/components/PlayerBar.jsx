import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Shuffle,
  Repeat,
  Heart,
} from 'lucide-react';

function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  queueCount,
  isQueueOpen,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onNext,
  onPrev,
  onToggleShuffle,
  onToggleRepeat,
  onToggleQueue,
  palette,
}) {
  const [isLiked, setIsLiked] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const cover =
    currentTrack.album?.cover_medium ||
    currentTrack.album?.cover_small ||
    currentTrack.cover_medium ||
    currentTrack.cover_small;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 pb-3 pt-1">
      <div className="max-w-7xl mx-auto rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_-8px_35px_rgba(0,0,0,0.35)] p-3 sm:p-4 text-white">
        <div className="flex flex-col gap-2">
          {/* Top Row: Track info, Main Controls, and Volume / Queue */}
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Left: Current Track Info */}
            <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-white/15">
                <img
                  src={cover}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              <div className="min-w-0 pr-2">
                <h4 className="text-xs sm:text-sm font-semibold truncate tracking-tight text-white drop-shadow-sm">
                  {currentTrack.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-white/60 truncate">
                  {currentTrack.artist?.name || currentTrack.artist}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`hidden md:flex p-1.5 rounded-full transition-colors ${
                  isLiked ? 'text-rose-400' : 'text-white/40 hover:text-white/80'
                }`}
                aria-label="Favorite track"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
              </button>
            </div>

            {/* Center: Playback Buttons */}
            <div className="flex items-center justify-center gap-1 sm:gap-3">
              <button
                type="button"
                onClick={onToggleShuffle}
                className={`p-2 rounded-xl transition-all hidden sm:block ${
                  isShuffle ? 'text-white bg-white/20' : 'text-white/40 hover:text-white/80'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onPrev}
                className="p-2 sm:p-2.5 rounded-2xl glass-button text-white/80 hover:text-white"
                title="Previous track"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Main Play / Pause Button with Glow */}
              <button
                type="button"
                onClick={onTogglePlay}
                className="relative p-3.5 sm:p-4 rounded-2xl bg-white text-slate-900 shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all duration-200"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={onNext}
                className="p-2 sm:p-2.5 rounded-2xl glass-button text-white/80 hover:text-white"
                title="Next track"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              <button
                type="button"
                onClick={onToggleRepeat}
                className={`p-2 rounded-xl transition-all hidden sm:block ${
                  isRepeat ? 'text-white bg-white/20' : 'text-white/40 hover:text-white/80'
                }`}
                title="Repeat"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Volume & Queue controls */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 w-1/4 sm:w-1/3">
              {/* Volume Slider (desktop) */}
              <div className="hidden lg:flex items-center gap-2 group">
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="p-1.5 text-white/60 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-300" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-white/20 accent-white rounded-lg cursor-pointer"
                  title="Volume"
                />
              </div>

              {/* Queue Drawer Trigger */}
              <button
                type="button"
                onClick={onToggleQueue}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium transition-all ${
                  isQueueOpen
                    ? 'bg-white/25 text-white border border-white/40 shadow-sm'
                    : 'glass-button text-white/70 hover:text-white'
                }`}
                title="Toggle queue"
              >
                <ListMusic className="w-4 h-4" />
                <span className="hidden sm:inline">Queue</span>
                {queueCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-bold text-white">
                    {queueCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Row: Seek Bar & Timers */}
          <div className="flex items-center gap-3 w-full px-1">
            <span className="text-[11px] font-mono text-white/50 w-8 text-right select-none">
              {formatTime(currentTime)}
            </span>

            {/* Glass Seek Slider */}
            <div className="relative flex-1 flex items-center group py-1">
              <div className="absolute left-0 right-0 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white/70 to-white transition-all duration-100 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 30}
                step="0.1"
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="w-full h-1.5 opacity-0 group-hover:opacity-100 cursor-pointer z-10"
              />
            </div>

            <span className="text-[11px] font-mono text-white/50 w-8 select-none">
              {formatTime(duration || 30)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
