import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Song, Playlist, Artist, RadioStation } from './types/music';
import { ALL_SONGS, PLAYLISTS, ARTISTS, RADIO_STATIONS } from './data/musicData';
import { audioEngine } from './services/audioEngine';
import { Sidebar, MainView } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerBar, RepeatMode } from './components/PlayerBar';
import { MobileNav } from './components/MobileNav';
import {
  ListenNowView,
  ExploreView,
  RadioView,
  FavoritesView,
  PlaylistsView,
  ArtistsView
} from './components/MainContentViews';
import { CosmicVisualizer } from './components/CosmicVisualizer';
import { LyricsView } from './components/LyricsView';
import { QueueDrawer } from './components/QueueDrawer';
import { ArtistModal } from './components/ArtistModal';
import { PlaylistModal } from './components/PlaylistModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { ShareModal } from './components/ShareModal';
import { AmbientBackground } from './components/AmbientBackground';
import { AiStudioHub } from './components/AiStudioHub';
import { Moon } from 'lucide-react';

const FAVORITES_KEY = 'hman_galaxy_favorites_v1';
const PLAYLISTS_KEY = 'hman_galaxy_playlists_v1';

export default function App() {
  const [songs] = useState<Song[]>(ALL_SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(PLAYLISTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...PLAYLISTS, ...parsed];
      }
    } catch {
      // fallback
    }
    return PLAYLISTS;
  });

  const [artists] = useState<Artist[]>(ARTISTS);
  const [radioStations] = useState<RadioStation[]>(RADIO_STATIONS);

  // Playback state
  const [currentSong, setCurrentSong] = useState<Song>(ALL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(ALL_SONGS[0].duration);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Song[]>(() => ALL_SONGS.slice(1, 6));

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['hit-1', 'indo-1', 'lawas-1'];
  });

  // Navigation and Filter state
  const [currentView, setCurrentView] = useState<MainView>('listen-now');
  const [activeGenreFilter, setActiveGenreFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // AI Studio Hub state (Chatbot, Veo 3 Video, Audio Transcribe)
  const [isAiStudioOpen, setIsAiStudioOpen] = useState<boolean>(false);
  const [aiStudioInitialTab, setAiStudioInitialTab] = useState<'chat' | 'video' | 'transcribe'>('chat');

  const handleOpenAiStudio = useCallback((tab: 'chat' | 'video' | 'transcribe' = 'chat') => {
    setAiStudioInitialTab(tab);
    setIsAiStudioOpen(true);
  }, []);

  // Crossfade state
  const [crossfadeDuration, setCrossfadeDuration] = useState<number>(() => {
    return audioEngine.getCrossfadeDuration();
  });
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);

  // Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareTargetSong, setShareTargetSong] = useState<Song | null>(null);

  // Sleep Timer state
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [selectedSleepTimerMinutes, setSelectedSleepTimerMinutes] = useState<number | null>(null);
  const [isSleepTimerEndOfTrack, setIsSleepTimerEndOfTrack] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const handleOpenShareModal = useCallback((song?: Song) => {
    setShareTargetSong(song || currentSong);
    setIsShareModalOpen(true);
  }, [currentSong]);

  const handleCrossfadeDurationChange = useCallback(
    (secs: number) => {
      setCrossfadeDuration(secs);
      audioEngine.setCrossfadeDuration(secs);
      if (secs === 0) {
        showToast('Crossfade turned off');
      } else {
        showToast(`Crossfade set to ${secs}s (Seamless overlap) ✨`);
      }
    },
    [showToast]
  );

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Sleep Timer countdown interval
  useEffect(() => {
    if (sleepTimerRemaining === null || sleepTimerRemaining <= 0) return;

    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          audioEngine.pause();
          setIsPlaying(false);
          setSelectedSleepTimerMinutes(null);
          setIsSleepTimerEndOfTrack(false);
          showToast('Sleep timer reached. Playback paused. Goodnight! 🌙');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerRemaining, showToast]);

  // End of track synchronization
  useEffect(() => {
    if (isSleepTimerEndOfTrack) {
      const remaining = Math.max(0, Math.floor(duration - playbackTime));
      setSleepTimerRemaining(remaining);
    }
  }, [isSleepTimerEndOfTrack, duration, playbackTime]);

  const handleSetTimerMinutes = useCallback((minutes: number) => {
    const totalSecs = minutes * 60;
    setSleepTimerRemaining(totalSecs);
    setSelectedSleepTimerMinutes(minutes);
    setIsSleepTimerEndOfTrack(false);
    showToast(`Sleep timer set for ${minutes} minutes 🌙`);
  }, [showToast]);

  const handleSetTimerEndOfTrack = useCallback(() => {
    setIsSleepTimerEndOfTrack(true);
    setSelectedSleepTimerMinutes(null);
    const remaining = Math.max(0, Math.floor(duration - playbackTime));
    setSleepTimerRemaining(remaining);
    showToast('Playback will stop at the end of this track 🌙');
  }, [duration, playbackTime, showToast]);

  const handleCancelSleepTimer = useCallback(() => {
    setSleepTimerRemaining(null);
    setSelectedSleepTimerMinutes(null);
    setIsSleepTimerEndOfTrack(false);
    showToast('Sleep timer turned off');
  }, [showToast]);

  // Deep link initial detection (?track={songId}&t={seconds})
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const trackId = params.get('track');
      const timeParam = params.get('t');

      if (trackId) {
        const target = ALL_SONGS.find((s) => s.id === trackId);
        if (target) {
          setCurrentSong(target);
          setDuration(target.duration);
          const parsedTime = timeParam ? parseInt(timeParam, 10) : 0;
          if (!isNaN(parsedTime) && parsedTime > 0 && parsedTime < target.duration) {
            setPlaybackTime(parsedTime);
            audioEngine.seek(parsedTime);
          }
          showToast(`Opened "${target.title}" by ${target.artist} from shared link 🎵`);
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, [showToast]);

  // Keep browser URL updated with current track ID for seamless address bar sharing
  useEffect(() => {
    if (!currentSong) return;
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('track') !== currentSong.id) {
        url.searchParams.set('track', currentSong.id);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // Ignore
    }
  }, [currentSong]);

  const playSong = useCallback((song: Song, forceCrossfade?: boolean) => {
    setCurrentSong(song);
    setDuration(song.duration);
    setPlaybackTime(0);
    setIsPlaying(true);
    audioEngine.playSong(song, 0, forceCrossfade);

    // Update queue with remaining songs if not already in queue
    setQueue((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      if (filtered.length === 0) {
        return ALL_SONGS.filter((s) => s.id !== song.id).slice(0, 5);
      }
      return filtered;
    });
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.resume();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleNext = useCallback(
    (isAutoCrossfade?: boolean) => {
      if (repeatMode === 'one' && currentSong) {
        playSong(currentSong, isAutoCrossfade ?? true);
        return;
      }

      if (queue.length > 0) {
        let nextIndex = 0;
        if (isShuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
        }
        const nextSong = queue[nextIndex];
        const remainingQueue = queue.filter((_, idx) => idx !== nextIndex);
        setQueue(remainingQueue);
        playSong(nextSong, isAutoCrossfade ?? true);
      } else {
        // Loop or pick next from all songs
        const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex], isAutoCrossfade ?? true);
      }
    },
    [queue, isShuffle, repeatMode, currentSong, songs, playSong]
  );

  const handlePrev = useCallback(() => {
    if (playbackTime > 3) {
      audioEngine.seek(0);
      setPlaybackTime(0);
    } else {
      const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
      playSong(songs[prevIndex]);
    }
  }, [playbackTime, songs, currentSong, playSong]);

  const handleSeek = useCallback((time: number) => {
    audioEngine.seek(time);
    setPlaybackTime(time);
  }, []);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(vol);
    setIsMuted(vol === 0);
    audioEngine.setVolume(vol);
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleToggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const handleToggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const handleSongEnded = useCallback(() => {
    if (isSleepTimerEndOfTrack) {
      audioEngine.pause();
      setIsPlaying(false);
      setSleepTimerRemaining(null);
      setIsSleepTimerEndOfTrack(false);
      setSelectedSleepTimerMinutes(null);
      showToast('Track ended. Sleep timer paused playback. 🌙');
      return;
    }

    if (repeatMode === 'one' && currentSong) {
      playSong(currentSong, true);
    } else {
      handleNext(true);
    }
  }, [isSleepTimerEndOfTrack, repeatMode, currentSong, playSong, handleNext, showToast]);

  // Audio Engine Subscriptions (Time update, End, Crossfade Trigger & Status)
  useEffect(() => {
    const unsubTime = audioEngine.subscribeTimeUpdate((time) => {
      setPlaybackTime(time);
    });

    const unsubEnded = audioEngine.subscribeEnded(() => {
      handleSongEnded();
    });

    const unsubCrossfadeTrigger = audioEngine.subscribeCrossfadeTrigger(() => {
      if (isSleepTimerEndOfTrack) return;
      handleNext(true);
    });

    const unsubCrossfadeState = audioEngine.subscribeCrossfadeState((isFading) => {
      setIsCrossfading(isFading);
    });

    return () => {
      unsubTime();
      unsubEnded();
      unsubCrossfadeTrigger();
      unsubCrossfadeState();
    };
  }, [handleSongEnded, handleNext, isSleepTimerEndOfTrack]);

  const handleToggleFavorite = useCallback((songId: string) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  }, []);

  const handleCreatePlaylist = useCallback((title: string, description: string, songIds: string[]) => {
    const newPlaylist: Playlist = {
      id: `user-pl-${Date.now()}`,
      title,
      description: description || 'Custom celestial mix created by listener.',
      cover: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&q=80',
      coverGradient: 'from-fuchsia-900 via-purple-950 to-slate-950',
      layout: 'grid',
      category: 'user',
      songIds: songIds.length > 0 ? songIds : ['hit-1', 'indo-1']
    };

    setPlaylists((prev) => {
      const updated = [...prev, newPlaylist];
      try {
        const userOnly = updated.filter((p) => p.category === 'user');
        localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(userOnly));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handlePlayRadio = useCallback((station: RadioStation) => {
    const stationSong = songs.find((s) => s.id === station.currentSongId) || songs[0];
    playSong(stationSong);
  }, [songs, playSong]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in search or input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, playbackTime - 5));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(duration, playbackTime + 5));
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key.toLowerCase() === 'l') {
        setIsLyricsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'v') {
        setIsVisualizerOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'q') {
        setIsQueueOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 't') {
        setIsSleepTimerOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'a') {
        handleOpenAiStudio('chat');
      } else if (e.key === 'Escape') {
        setIsLyricsOpen(false);
        setIsVisualizerOpen(false);
        setIsQueueOpen(false);
        setSelectedArtist(null);
        setIsCreatePlaylistOpen(false);
        setIsSleepTimerOpen(false);
        setIsAiStudioOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleSeek, handleToggleMute, playbackTime, duration, handleOpenAiStudio]);

  // Search & Filter computation
  const filteredSongs = useMemo(() => {
    let result = songs;

    if (activeGenreFilter !== 'all') {
      if (activeGenreFilter === 'spotify') {
        const spotifyIds = new Set([
          'hit-6', 'hit-7', 'hit-8', 'hit-9', 'hit-10', 'hit-11', 'hit-12',
          'indo-15', 'indo-16', 'indo-17', 'indo-18', 'indo-9', 'hit-1'
        ]);
        result = result.filter((s) => spotifyIds.has(s.id) || s.year >= 2024);
      } else if (activeGenreFilter === 'indo') {
        result = result.filter((s) => s.id.startsWith('indo-'));
      } else if (activeGenreFilter === 'hits') {
        result = result.filter((s) => s.id.startsWith('hit-'));
      } else if (activeGenreFilter === 'lawas') {
        result = result.filter((s) => s.id.startsWith('lawas-'));
      } else if (activeGenreFilter === 'rock') {
        result = result.filter((s) => s.id.startsWith('rock-'));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        return (
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q) ||
          s.lyrics.some((l) => l.text.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [songs, activeGenreFilter, searchQuery]);

  const currentArtist = useMemo(() => {
    return artists.find((a) => a.id === currentSong?.artistId) || null;
  }, [artists, currentSong]);

  return (
    <div className="flex h-[100dvh] w-full bg-[#050511] text-white overflow-hidden antialiased">
      {/* Sidebar Navigation (Desktop) */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setActiveGenreFilter('all');
          setSearchQuery('');
        }}
        favoritesCount={favorites.length}
        playlists={playlists}
        onSelectPlaylist={(pl) => {
          setCurrentView('playlists');
        }}
        onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        onOpenAiStudio={handleOpenAiStudio}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Dynamic Background Blur Effect Sampling Album Art Colors */}
        <AmbientBackground currentSong={currentSong} />

        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeGenreFilter={activeGenreFilter}
          onSelectGenreFilter={(filter) => {
            setActiveGenreFilter(filter);
            if (currentView !== 'listen-now' && currentView !== 'explore') {
              setCurrentView('explore');
            }
          }}
          onToggleVisualizer={() => setIsVisualizerOpen(true)}
          onToggleQueue={() => setIsQueueOpen((prev) => !prev)}
          queueCount={queue.length}
          onOpenAiStudio={handleOpenAiStudio}
        />

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 pb-44 md:pb-36 no-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* If user is actively searching, show search results view */}
            {searchQuery.trim() ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">
                    Search Results for &ldquo;{searchQuery}&rdquo;
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Found {filteredSongs.length} matching cosmic tracks
                  </p>
                </div>

                {filteredSongs.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <p className="text-base font-semibold">No tracks or lyrics found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try searching for &ldquo;Mahalini&rdquo;, &ldquo;Queen&rdquo;, &ldquo;Starboy&rdquo;, or &ldquo;Chrisye&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-3 divide-y divide-white/5">
                    {filteredSongs.map((song, i) => (
                      <div
                        key={song.id}
                        onClick={() => playSong(song)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-500 w-5 text-center">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                            <p className="text-xs text-slate-400 truncate">
                              {song.artist} · {song.album}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-purple-400 font-mono">
                          {Math.floor(song.duration / 60)}:
                          {(song.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {currentView === 'listen-now' && (
                  <ListenNowView
                    songs={filteredSongs}
                    playlists={playlists}
                    artists={artists}
                    radioStations={radioStations}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    favorites={favorites}
                    onPlaySong={playSong}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectArtist={setSelectedArtist}
                    onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
                    onPlayRadio={handlePlayRadio}
                    onOpenLyrics={() => setIsLyricsOpen(true)}
                    onShareSong={handleOpenShareModal}
                  />
                )}

                {currentView === 'explore' && (
                  <ExploreView
                    songs={filteredSongs}
                    playlists={playlists}
                    artists={artists}
                    radioStations={radioStations}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    favorites={favorites}
                    onPlaySong={playSong}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectArtist={setSelectedArtist}
                    onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
                    onPlayRadio={handlePlayRadio}
                    onOpenLyrics={() => setIsLyricsOpen(true)}
                  />
                )}

                {currentView === 'radio' && (
                  <RadioView
                    songs={songs}
                    playlists={playlists}
                    artists={artists}
                    radioStations={radioStations}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    favorites={favorites}
                    onPlaySong={playSong}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectArtist={setSelectedArtist}
                    onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
                    onPlayRadio={handlePlayRadio}
                    onOpenLyrics={() => setIsLyricsOpen(true)}
                  />
                )}

                {currentView === 'favorites' && (
                  <FavoritesView
                    songs={songs}
                    playlists={playlists}
                    artists={artists}
                    radioStations={radioStations}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    favorites={favorites}
                    onPlaySong={playSong}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectArtist={setSelectedArtist}
                    onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
                    onPlayRadio={handlePlayRadio}
                    onOpenLyrics={() => setIsLyricsOpen(true)}
                    onShareSong={handleOpenShareModal}
                  />
                )}

                {currentView === 'playlists' && (
                  <PlaylistsView
                    songs={songs}
                    playlists={playlists}
                    artists={artists}
                    radioStations={radioStations}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    favorites={favorites}
                    onPlaySong={playSong}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectArtist={setSelectedArtist}
                    onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
                    onPlayRadio={handlePlayRadio}
                    onOpenLyrics={() => setIsLyricsOpen(true)}
                  />
                )}

                {currentView === 'artists' && (
                  <ArtistsView
                    songs={songs}
                    playlists={playlists}
                    artists={artists}
                    radioStations={radioStations}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    favorites={favorites}
                    onPlaySong={playSong}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectArtist={setSelectedArtist}
                    onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
                    onPlayRadio={handlePlayRadio}
                    onOpenLyrics={() => setIsLyricsOpen(true)}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Floating Bottom Player Bar */}
      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        playbackTime={playbackTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        isFavorite={favorites.includes(currentSong.id)}
        artist={currentArtist}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
        onToggleFavorite={() => handleToggleFavorite(currentSong.id)}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onOpenVisualizer={() => setIsVisualizerOpen(true)}
        onToggleQueue={() => setIsQueueOpen((prev) => !prev)}
        onSelectArtist={setSelectedArtist}
        sleepTimerRemaining={sleepTimerRemaining}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
        crossfadeDuration={crossfadeDuration}
        onCrossfadeDurationChange={handleCrossfadeDurationChange}
        isCrossfading={isCrossfading}
        onShareSong={() => handleOpenShareModal(currentSong)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setSearchQuery('');
        }}
        onToggleQueue={() => setIsQueueOpen((prev) => !prev)}
      />

      {/* Sliding Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        currentSong={currentSong}
        queue={queue}
        isPlaying={isPlaying}
        onPlaySong={(song) => {
          playSong(song);
        }}
        onRemoveFromQueue={(idx) => {
          setQueue((prev) => prev.filter((_, i) => i !== idx));
        }}
        onClearQueue={() => setQueue([])}
      />

      {/* Synchronized Apple Music Style Lyrics View */}
      {isLyricsOpen && (
        <LyricsView
          song={currentSong}
          currentTime={playbackTime}
          onSeek={handleSeek}
          onClose={() => setIsLyricsOpen(false)}
          onShare={() => handleOpenShareModal(currentSong)}
        />
      )}

      {/* Galaxy Cosmic Visualizer Canvas */}
      {isVisualizerOpen && (
        <CosmicVisualizer
          song={currentSong}
          isPlaying={isPlaying}
          onClose={() => setIsVisualizerOpen(false)}
        />
      )}

      {/* Artist Profile Details Modal */}
      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          songs={songs}
          onClose={() => setSelectedArtist(null)}
          onPlaySong={playSong}
          currentSong={currentSong}
          isPlaying={isPlaying}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Playlist Creation Modal */}
      <PlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        songs={songs}
        onCreatePlaylist={handleCreatePlaylist}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        activeSecondsRemaining={sleepTimerRemaining}
        selectedOptionMinutes={selectedSleepTimerMinutes}
        isEndOfTrackActive={isSleepTimerEndOfTrack}
        onSetTimerMinutes={handleSetTimerMinutes}
        onSetTimerEndOfTrack={handleSetTimerEndOfTrack}
        onCancelTimer={handleCancelSleepTimer}
      />

      {/* Song Deep Link Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        song={shareTargetSong || currentSong}
        playbackTime={shareTargetSong?.id === currentSong?.id ? playbackTime : 0}
        showToast={showToast}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl glass-panel border border-purple-500/40 shadow-2xl flex items-center gap-2.5 text-xs font-semibold text-white animate-in fade-in slide-in-from-top-2 duration-200">
          <Moon className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Studio Hub (Gemini Chatbot, Veo 3 Video, Audio Transcribe) */}
      <AiStudioHub
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        songs={songs}
        onPlaySong={playSong}
        onSearchQuery={(q) => {
          setSearchQuery(q);
          if (currentView !== 'listen-now' && currentView !== 'explore') {
            setCurrentView('explore');
          }
        }}
        initialTab={aiStudioInitialTab}
      />
    </div>
  );
}

