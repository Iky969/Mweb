import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Disc3, Volume2, ListPlus, Radio } from 'lucide-react';

export default function NowPlayingCenter({
  currentTrack,
  isPlaying,
  onTogglePlay,
  palette,
  onAddToQueue,
}) {
  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[360px]">
        <div className="w-48 h-48 rounded-3xl glass-panel flex items-center justify-center mb-6 shadow-2xl relative group">
          <Disc3 className="w-16 h-16 text-white/30 animate-spin-slow" />
        </div>
        <h3 className="text-xl font-medium text-white/80 mb-1">No Track Selected</h3>
        <p className="text-sm text-white/40 max-w-sm">
          Search for songs above or select any track to experience Aura's liquid sound & visuals.
        </p>
      </div>
    );
  }

  // Deezer returns multiple cover sizes: cover_xl > cover_big > cover_medium
  const coverUrl =
    currentTrack.album?.cover_xl ||
    currentTrack.album?.cover_big ||
    currentTrack.album?.cover_medium ||
    currentTrack.cover_xl ||
    currentTrack.cover_big ||
    currentTrack.cover_medium;

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 text-center select-none">
      {/* Big Album Cover Container with Liquid Glow Behind */}
      <div className="relative group mb-6">
        {/* Glowing Blurred Backdrop (Matches dominant color) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id + '-glow'}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: isPlaying ? 0.75 : 0.45, scale: isPlaying ? 1.08 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -inset-6 rounded-3xl filter blur-3xl transition-all duration-1000 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${palette?.glow || 'rgba(140, 120, 200, 0.5)'} 20%, ${palette?.primary || 'rgba(90, 80, 150, 0.3)'} 70%, transparent 95%)`,
            }}
          />
        </AnimatePresence>

        {/* Secondary subtle pulsing ring */}
        {isPlaying && (
          <div
            className="absolute -inset-2 rounded-3xl border border-white/20 animate-pulse-slow pointer-events-none"
            style={{
              boxShadow: `0 0 40px ${palette?.glow || 'rgba(255,255,255,0.1)'}`,
            }}
          />
        )}

        {/* The Main Cover Card */}
        <motion.div
          key={currentTrack.id}
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl group cursor-pointer"
          onClick={onTogglePlay}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <img
              src={coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                isPlaying ? 'scale-[1.02]' : 'scale-100'
              }`}
            />

            {/* Subtle Glass Sheen / Specular highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />

            {/* Center Play/Pause Overlay Indicator on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-full glass-button flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform">
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-white text-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white text-white translate-x-0.5" />
                )}
              </div>
            </div>

            {/* Live Playing Wave Pill */}
            {isPlaying && (
              <div className="absolute top-3 right-3 glass-pill px-2.5 py-1 flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-medium text-white/90">LIVE PREVIEW</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Track Details */}
      <motion.div
        key={currentTrack.id + '-meta'}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-md flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-semibold tracking-wider text-white/50">
            {currentTrack.album?.title || 'Single'}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-xs text-white/50">30s Preview</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight line-clamp-1 mb-1 drop-shadow-sm">
          {currentTrack.title}
        </h2>

        <p className="text-sm sm:text-base font-medium text-white/70 tracking-wide line-clamp-1 mb-3">
          {currentTrack.artist?.name || currentTrack.artist}
        </p>

        {/* Action Pills under Track */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => onAddToQueue(currentTrack)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs text-white/70 hover:text-white"
            title="Add to queue"
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Add to Queue</span>
          </button>

          {currentTrack.link && (
            <a
              href={currentTrack.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs text-white/60 hover:text-white"
              title="Open in Deezer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Deezer</span>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
