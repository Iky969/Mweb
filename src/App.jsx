import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import LiquidBackground from './components/LiquidBackground.jsx';
import NowPlayingCenter from './components/NowPlayingCenter.jsx';
import SearchResults from './components/SearchResults.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import QueueDrawer from './components/QueueDrawer.jsx';
import { extractPastelPalette } from './utils/colorExtractor.js';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('Coldplay');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Dynamic Pastel Mesh Color Palette
  const [palette, setPalette] = useState({
    primary: 'rgb(88, 80, 141)',
    secondary: 'rgb(120, 105, 168)',
    tertiary: 'rgb(62, 85, 120)',
    glow: 'rgba(120, 105, 168, 0.45)',
    rawHex: '#58508d',
  });

  const audioRef = useRef(null);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 30);
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = (e) => {
      console.warn('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Perform search query via backend proxy
  const executeSearch = async (query) => {
    if (!query) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSearchQuery(query);

    try {
      // Backend Express endpoint
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      const data = await response.json();
      const tracks = data.data || [];
      setSearchResults(tracks);

      // If no track is currently playing, set the first result as currentTrack (paused)
      if (!currentTrack && tracks.length > 0) {
        selectTrack(tracks[0], false);
      }
    } catch (err) {
      console.error('Search error:', err);
      setErrorMessage('Could not fetch music from Deezer proxy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load: search "Coldplay"
  useEffect(() => {
    executeSearch('Coldplay');
  }, []);

  // When track changes: extract colors and set audio src
  const selectTrack = async (track, shouldPlay = true) => {
    if (!track) return;
    setCurrentTrack(track);
    setCurrentTime(0);

    const coverUrl =
      track.album?.cover_xl ||
      track.album?.cover_big ||
      track.album?.cover_medium ||
      track.cover_xl ||
      track.cover_medium;

    // Asynchronously extract dominant color to pastel mesh gradient
    extractPastelPalette(coverUrl).then((newPalette) => {
      setPalette(newPalette);
    });

    if (audioRef.current) {
      audioRef.current.pause();
      if (track.preview) {
        audioRef.current.src = track.preview;
        audioRef.current.load();
        if (shouldPlay) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('Playback prevented by browser policy:', err);
              setIsPlaying(false);
            });
        } else {
          setIsPlaying(false);
        }
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTrackEnd = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
      return;
    }

    if (queue.length > 0) {
      const nextFromQueue = queue[0];
      setQueue((prev) => prev.slice(1));
      selectTrack(nextFromQueue, true);
      return;
    }

    // Otherwise play next in search results
    playNextTrack();
  };

  const playNextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      selectTrack(next, true);
      return;
    }

    if (!searchResults.length || !currentTrack) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * searchResults.length);
      selectTrack(searchResults[randomIndex], true);
      return;
    }

    const currentIndex = searchResults.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % searchResults.length;
    selectTrack(searchResults[nextIndex], true);
  };

  const playPrevTrack = () => {
    if (!searchResults.length || !currentTrack) return;

    // If played more than 3 seconds, restart current track
    if (currentTime > 3) {
      handleSeek(0);
      return;
    }

    const currentIndex = searchResults.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
    selectTrack(searchResults[prevIndex], true);
  };

  const addToQueue = (track) => {
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-white/20 selection:text-white pb-32">
      {/* 1. Dynamic Liquid Mesh & Blob Background */}
      <LiquidBackground palette={palette} />

      {/* 2. Top Header & Glass Search Bar */}
      <Header
        onSearch={executeSearch}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />

      {/* Error notification banner */}
      {errorMessage && (
        <div className="max-w-md mx-auto my-2 px-4 py-2.5 rounded-2xl glass-panel bg-rose-500/10 border-rose-400/30 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {/* 3. Center Big Album Art with Blur Behind */}
        <NowPlayingCenter
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          palette={palette}
          onAddToQueue={addToQueue}
        />

        {/* 4. Glass Cards Search Results with Stagger Animations */}
        <SearchResults
          results={searchResults}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onSelectTrack={(track) => selectTrack(track, true)}
          onAddToQueue={addToQueue}
          queue={queue}
        />
      </main>

      {/* 5. Fixed Liquid Glass Bottom Player Bar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        queueCount={queue.length}
        isQueueOpen={isQueueOpen}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onVolumeChange={setVolume}
        onToggleMute={() => setIsMuted(!isMuted)}
        onNext={playNextTrack}
        onPrev={playPrevTrack}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
        palette={palette}
      />

      {/* 6. Slide-over Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        currentTrack={currentTrack}
        onPlayTrack={(track) => selectTrack(track, true)}
        onRemoveFromQueue={removeFromQueue}
        onClearQueue={clearQueue}
      />
    </div>
  );
}
