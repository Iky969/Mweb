import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Clock, Plus, Check, Music } from 'lucide-react';

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SearchResults({
  results,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onAddToQueue,
  queue,
}) {
  if (!results || results.length === 0) {
    return null;
  }

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const isInQueue = (trackId) => queue.some((item) => item.id === trackId);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-white/60 flex items-center gap-2">
          <Music className="w-4 h-4 text-white/50" />
          <span>Search Results ({results.length})</span>
        </h3>
        <span className="text-xs text-white/40">Select track to play preview</span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {results.map((track) => {
          const isSelected = currentTrack?.id === track.id;
          const isTrackPlaying = isSelected && isPlaying;
          const cover =
            track.album?.cover_medium ||
            track.album?.cover_small ||
            track.cover_medium ||
            track.cover_small;
          const inQueue = isInQueue(track.id);

          return (
            <motion.div
              key={track.id}
              variants={itemVariants}
              onClick={() => onSelectTrack(track)}
              className={`group relative flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer select-none transition-all duration-300 ${
                isSelected
                  ? 'bg-white/20 border border-white/40 shadow-[0_8px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/30'
                  : 'glass-card'
              }`}
            >
              {/* Cover Thumbnail with play button overlay */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                <img
                  src={cover}
                  alt={track.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Glass reflection gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                {/* Center Hover or Active Play Indicator */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                    isTrackPlaying
                      ? 'opacity-100 bg-black/40'
                      : 'opacity-0 group-hover:opacity-100 bg-black/35'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform active:scale-95">
                    {isTrackPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    )}
                  </div>
                </div>

                {/* Animated sound wave bars when currently playing */}
                {isTrackPlaying && (
                  <div className="absolute bottom-1.5 left-1.5 flex items-end gap-0.5">
                    <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-white rounded-full animate-pulse [animation-delay:150ms]" />
                    <span className="w-1 h-2 bg-white rounded-full animate-pulse [animation-delay:300ms]" />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0 pr-1">
                <h4
                  className={`text-sm font-semibold tracking-tight truncate mb-0.5 ${
                    isSelected ? 'text-white font-bold' : 'text-white/90 group-hover:text-white'
                  }`}
                >
                  {track.title}
                </h4>
                <p className="text-xs text-white/60 truncate group-hover:text-white/80">
                  {track.artist?.name || track.artist}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-white/45">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(track.duration)}
                  </span>
                  {track.explicit_lyrics && (
                    <span className="px-1 py-0.2 rounded bg-white/10 text-[9px] font-semibold text-white/60">
                      E
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Queue Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToQueue(track);
                }}
                className={`p-2 rounded-xl transition-all ${
                  inQueue
                    ? 'text-white/80 bg-white/15'
                    : 'text-white/40 hover:text-white hover:bg-white/10'
                }`}
                title={inQueue ? 'In Queue' : 'Add to Queue'}
                aria-label="Add to queue"
              >
                {inQueue ? (
                  <Check className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
