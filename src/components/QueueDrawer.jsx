import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Play, Music, ListMusic } from 'lucide-react';

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function QueueDrawer({
  isOpen,
  onClose,
  queue,
  currentTrack,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-24 z-50 w-full sm:w-96 p-4 sm:p-6"
          >
            <div className="w-full h-full flex flex-col rounded-3xl glass-panel p-5 overflow-hidden shadow-2xl border border-white/25">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 text-white">
                    <ListMusic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Play Queue</h3>
                    <p className="text-xs text-white/50">{queue.length} tracks queued</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {queue.length > 0 && (
                    <button
                      onClick={onClearQueue}
                      className="p-2 rounded-xl text-white/40 hover:text-rose-300 hover:bg-white/10 transition-colors"
                      title="Clear queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Queue List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
                {queue.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
                    <Music className="w-10 h-10 mb-2 opacity-40" />
                    <p className="text-sm font-medium">Your queue is empty</p>
                    <p className="text-xs text-white/30 mt-1">
                      Add tracks using the "+" button on search cards.
                    </p>
                  </div>
                ) : (
                  queue.map((track, idx) => {
                    const isSelected = currentTrack?.id === track.id;
                    const cover =
                      track.album?.cover_medium ||
                      track.album?.cover_small ||
                      track.cover_medium ||
                      track.cover_small;

                    return (
                      <div
                        key={`${track.id}-${idx}`}
                        className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-white/20 border border-white/30'
                            : 'glass-card hover:bg-white/15'
                        }`}
                      >
                        <div
                          onClick={() => onPlayTrack(track)}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={cover}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4 text-white fill-current" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h5
                              className={`text-xs sm:text-sm font-semibold truncate ${
                                isSelected ? 'text-white' : 'text-white/90'
                              }`}
                            >
                              {track.title}
                            </h5>
                            <p className="text-[11px] text-white/50 truncate">
                              {track.artist?.name || track.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-2">
                          <span className="text-[11px] text-white/40 font-mono">
                            {formatDuration(track.duration)}
                          </span>
                          <button
                            onClick={() => onRemoveFromQueue(idx)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
