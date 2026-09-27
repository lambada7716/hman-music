import React from 'react';
import { Song, Playlist, Artist, RadioStation } from '../types/music';
import {
  Play,
  Heart,
  Plus,
  Radio,
  Sparkles,
  Users,
  Compass,
  Disc3,
  Clock,
  Mic2,
  Flame,
  Share2
} from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';
import { ArtistAvatar } from './ArtistAvatar';

interface ViewProps {
  songs: Song[];
  playlists: Playlist[];
  artists: Artist[];
  radioStations: RadioStation[];
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onSelectArtist: (artist: Artist) => void;
  onOpenCreatePlaylist: () => void;
  onPlayRadio: (station: RadioStation) => void;
  onOpenLyrics: () => void;
  onShareSong?: (song: Song) => void;
}

// 1. LISTEN NOW VIEW
export const ListenNowView: React.FC<ViewProps> = ({
  songs,
  playlists,
  artists: _artists,
  radioStations: _radioStations,
  currentSong,
  isPlaying,
  favorites,
  onPlaySong,
  onToggleFavorite,
  onSelectArtist,
  onOpenCreatePlaylist: _onOpenCreatePlaylist,
  onPlayRadio: _onPlayRadio,
  onOpenLyrics: _onOpenLyrics,
  onShareSong
}) => {
  const featuredSong = songs[0];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <div
          onClick={() => featuredSong && onPlaySong(featuredSong)}
          className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-[0_20px_50px_rgba(76,29,149,0.35)] transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#050511] via-[#1a0b36] to-[#4c1d95] opacity-90" />
          <ArtworkImage
            src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1400"
            alt="Galaxy Atmosphere"
            fallbackGradient="from-purple-950 via-indigo-950 to-slate-950"
            className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-1000"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-[#050511]/60 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full z-10 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 drop-shadow">
                Exclusive Premiere
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-300">Cosmic Audio Experience</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md font-display mb-3">
              Galaxy Vibes
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl line-clamp-2 leading-relaxed mb-1">
              Embark on an interstellar sonic journey across genres. Featuring hits from The Weeknd,
              Mahalini, Chrisye, Queen, Dua Lipa, and timeless legends.
            </p>
          </div>

          {/* Floating Play Action */}
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-110 active:scale-95 transition-all duration-300 z-10">
            <Play className="w-6 h-6 fill-black ml-1" />
          </div>
        </div>
      </section>

      {/* Playlist Sections */}
      {playlists.map((playlist) => {
        const playlistSongs = playlist.songIds
          .map((id) => songs.find((s) => s.id === id))
          .filter((s): s is Song => Boolean(s));

        return (
          <section key={playlist.id} className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                  {playlist.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {playlist.description}
                </p>
              </div>

              {playlistSongs.length > 0 && (
                <button
                  onClick={() => onPlaySong(playlistSongs[0])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-purple-400" /> Play All
                </button>
              )}
            </div>

            {playlist.layout === 'list' ? (
              /* Apple Music Tracklist Style */
              <div className="glass-card rounded-2xl p-2 sm:p-3 divide-y divide-white/5">
                {playlistSongs.map((song, idx) => {
                  const isCurrent = currentSong?.id === song.id;
                  const isFav = favorites.includes(song.id);

                  return (
                    <div
                      key={song.id}
                      className={`flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl transition group ${
                        isCurrent ? 'bg-purple-600/15' : 'hover:bg-white/5'
                      }`}
                    >
                      <div
                        onClick={() => onPlaySong(song)}
                        className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                      >
                        <span className="hidden sm:inline text-xs font-mono text-slate-400 w-5 text-center">
                          {idx + 1}
                        </span>

                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 relative">
                          <ArtworkImage
                            src={song.cover}
                            alt={song.title}
                            fallbackGradient={song.coverGradient}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isCurrent ? 'text-purple-300' : 'text-white'
                            }`}
                          >
                            {song.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <ArtistAvatar
                              src={song.artistImage}
                              name={song.artist}
                              size="xs"
                            />
                            <span className="text-xs text-slate-400 truncate">
                              {song.artist}
                            </span>
                            <span className="text-slate-400 text-xs hidden md:inline">·</span>
                            <span className="text-xs text-slate-400 hidden md:inline truncate">
                              {song.album}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pl-3">
                        {onShareSong && (
                          <button
                            onClick={() => onShareSong(song)}
                            className="p-1.5 transition text-slate-500 hover:text-white hover:scale-110"
                            title="Share song"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onToggleFavorite(song.id)}
                          className={`p-1.5 transition ${
                            isFav ? 'text-rose-500' : 'text-slate-500 hover:text-white'
                          }`}
                          title={isFav ? 'Favorited' : 'Favorite'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>

                        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                          {Math.floor(song.duration / 60)}:
                          {(song.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Grid / Card Carousel */
              <div className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-5 pb-2 pt-1 -mx-1 px-1">
                {playlistSongs.map((song) => {
                  const isCurrent = currentSong?.id === song.id;

                  return (
                    <div
                      key={song.id}
                      className="snap-start min-w-[160px] sm:min-w-[190px] max-w-[190px] group cursor-pointer"
                      onClick={() => onPlaySong(song)}
                    >
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg border border-white/10 bg-slate-900">
                        <ArtworkImage
                          src={song.cover}
                          alt={song.title}
                          fallbackGradient={song.coverGradient}
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                            <Play className="w-4 h-4 fill-black ml-0.5" />
                          </div>
                        </div>

                        {isCurrent && isPlaying && (
                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                            Playing
                          </div>
                        )}
                      </div>

                      <h4
                        className={`font-semibold text-sm truncate ${
                          isCurrent ? 'text-purple-400' : 'text-white'
                        }`}
                      >
                        {song.title}
                      </h4>

                      <div className="flex items-center gap-1.5 mt-1">
                        <ArtistAvatar
                          src={song.artistImage}
                          name={song.artist}
                          size="xs"
                        />
                        <p className="text-xs text-slate-400 truncate hover:text-white transition">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

// 2. EXPLORE VIEW
export const ExploreView: React.FC<ViewProps> = ({
  songs,
  onPlaySong,
  currentSong,
  favorites,
  onToggleFavorite,
  onSelectArtist,
  artists
}) => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Explore the Cosmos</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Journey through eras, musical styles, and timeless vocalists
        </p>
      </div>

      {/* Galaxy Categories Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div
          onClick={() => {
            const spotifySong = songs.find((s) => s.id === 'hit-6') || songs[0];
            onPlaySong(spotifySong);
          }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-green-950 to-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 cursor-pointer transition group shadow-lg shadow-emerald-950/40"
        >
          <Flame className="w-7 h-7 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base font-bold text-white mb-1">Spotify Top Viral</h3>
          <p className="text-xs text-slate-400">Die With A Smile, APT., Espresso, Birds of a Feather, Bernadya</p>
        </div>

        <div
          onClick={() => {
            const hitSong = songs.find((s) => s.id.startsWith('hit-')) || songs[0];
            onPlaySong(hitSong);
          }}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/60 to-slate-900 border border-purple-500/20 hover:border-purple-500/50 cursor-pointer transition group"
        >
          <Sparkles className="w-7 h-7 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base font-bold text-white mb-1">Global 2016-2026 Hits</h3>
          <p className="text-xs text-slate-400">Electronic, Synthwave & Pop anthems that conquered earth</p>
        </div>

        <div
          onClick={() => {
            const indoSong = songs.find((s) => s.id.startsWith('indo-')) || songs[0];
            onPlaySong(indoSong);
          }}
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-900/60 to-slate-900 border border-rose-500/20 hover:border-rose-500/50 cursor-pointer transition group"
        >
          <Mic2 className="w-7 h-7 text-rose-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base font-bold text-white mb-1">Nusantara Pop Soul</h3>
          <p className="text-xs text-slate-400">Mahalini, Tulus, Bernadya, Sal Priadi, and acoustic ballads</p>
        </div>

        <div
          onClick={() => {
            const lawasSong = songs.find((s) => s.id.startsWith('lawas-')) || songs[0];
            onPlaySong(lawasSong);
          }}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/60 to-slate-900 border border-amber-500/20 hover:border-amber-500/50 cursor-pointer transition group"
        >
          <Disc3 className="w-7 h-7 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base font-bold text-white mb-1">Oldies & Golden Classics</h3>
          <p className="text-xs text-slate-400">Chrisye, Iwan Fals, Nike Ardilla timeless 80s-90s tape sound</p>
        </div>

        <div
          onClick={() => {
            const rockSong = songs.find((s) => s.id.startsWith('rock-')) || songs[0];
            onPlaySong(rockSong);
          }}
          className="p-5 rounded-2xl bg-gradient-to-br from-red-900/60 to-slate-900 border border-red-500/20 hover:border-red-500/50 cursor-pointer transition group"
        >
          <Play className="w-7 h-7 text-red-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base font-bold text-white mb-1">Rock Titans</h3>
          <p className="text-xs text-slate-400">Queen, Nirvana, Guns N’ Roses overdrive energy</p>
        </div>
      </div>

      {/* Featured Artists Showcase */}
      <div>
        <h2 className="text-xl font-bold text-white font-display mb-4">Cosmic Creators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist)}
              className="flex flex-col items-center text-center p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition group"
            >
              <ArtistAvatar
                src={artist.avatar}
                name={artist.name}
                gradient={artist.avatarGradient}
                size="lg"
                className="mb-2 group-hover:scale-105 transition-transform"
              />
              <p className="text-xs font-bold text-white truncate w-full">{artist.name}</p>
              <p className="text-[10px] text-slate-400 truncate w-full">{artist.genre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* All Available Tracks */}
      <div>
        <h2 className="text-xl font-bold text-white font-display mb-4">Complete Catalog</h2>
        <div className="glass-card rounded-2xl p-3 divide-y divide-white/5">
          {songs.map((song, i) => {
            const isCurrent = currentSong?.id === song.id;
            const isFav = favorites.includes(song.id);

            return (
              <div
                key={song.id}
                className={`flex items-center justify-between p-3 rounded-xl transition ${
                  isCurrent ? 'bg-purple-600/15' : 'hover:bg-white/5'
                }`}
              >
                <div
                  onClick={() => onPlaySong(song)}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <span className="text-xs font-mono text-slate-500 w-5 text-center">{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <ArtworkImage
                      src={song.cover}
                      alt={song.title}
                      fallbackGradient={song.coverGradient}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-purple-300' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{song.artist} · {song.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 hidden sm:inline">{song.genre}</span>
                  <button
                    onClick={() => onToggleFavorite(song.id)}
                    className={`transition ${isFav ? 'text-rose-500' : 'text-slate-500 hover:text-white'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 3. RADIO VIEW
export const RadioView: React.FC<ViewProps> = ({ radioStations, onPlayRadio, songs }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Galaxy Radio Stations</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Broadcast transmissions curating seamless cosmic waves 24/7
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {radioStations.map((station) => {
          const sampleSong = songs.find((s) => s.id === station.currentSongId);

          return (
            <div
              key={station.id}
              onClick={() => onPlayRadio(station)}
              className="relative p-6 sm:p-8 rounded-3xl bg-[#0e0e24] border border-white/10 hover:border-purple-500/40 cursor-pointer overflow-hidden transition-all duration-300 group shadow-xl"
            >
              <div
                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${station.coverGradient} opacity-20 filter blur-3xl group-hover:opacity-40 transition-opacity`}
              />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                      Live Broadcast
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">{station.listeners}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-white font-display mb-1">
                    {station.name}
                  </h3>
                  <p className="text-xs font-semibold text-purple-300 mb-2">{station.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{station.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="text-xs text-slate-400 truncate max-w-[200px]">
                    <span className="text-slate-500">Playing: </span>
                    <span className="text-white font-medium">{sampleSong?.title || 'Galaxy Stream'}</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 active:scale-95 transition shadow-lg shadow-purple-600/30">
                    <Radio className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. FAVORITES VIEW
export const FavoritesView: React.FC<ViewProps> = ({
  songs,
  favorites,
  onPlaySong,
  currentSong,
  onToggleFavorite,
  onShareSong
}) => {
  const favoriteSongs = songs.filter((s) => favorites.includes(s.id));
  const totalSeconds = favoriteSongs.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Library Collection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Favorite Tracks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {favoriteSongs.length} tracks · {Math.floor(totalSeconds / 60)} minutes total duration
          </p>
        </div>

        {favoriteSongs.length > 0 && (
          <button
            onClick={() => onPlaySong(favoriteSongs[0])}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold hover:opacity-90 active:scale-95 transition shadow-lg shadow-purple-600/30"
          >
            <Play className="w-4 h-4 fill-white" /> Play Favorites
          </button>
        )}
      </div>

      {favoriteSongs.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <Heart className="w-12 h-12 mx-auto text-slate-700" />
          <h3 className="text-lg font-bold text-white">No Favorite Songs Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the heart icon on any track to save it to your personal galaxy constellation.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-3 divide-y divide-white/5">
          {favoriteSongs.map((song, i) => {
            const isCurrent = currentSong?.id === song.id;

            return (
              <div
                key={song.id}
                className={`flex items-center justify-between p-3 rounded-xl transition ${
                  isCurrent ? 'bg-purple-600/15' : 'hover:bg-white/5'
                }`}
              >
                <div
                  onClick={() => onPlaySong(song)}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <span className="text-xs font-mono text-slate-500 w-5 text-center">{i + 1}</span>
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0">
                    <ArtworkImage
                      src={song.cover}
                      alt={song.title}
                      fallbackGradient={song.coverGradient}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-purple-300' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {onShareSong && (
                    <button
                      onClick={() => onShareSong(song)}
                      className="p-1.5 text-slate-500 hover:text-white hover:scale-110 transition"
                      title="Share song"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onToggleFavorite(song.id)}
                    className="p-1.5 text-rose-500 hover:scale-110 transition"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 5. PLAYLISTS VIEW
export const PlaylistsView: React.FC<ViewProps> = ({
  playlists,
  songs,
  onPlaySong,
  onOpenCreatePlaylist
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Playlists</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated galaxy sets and your personalized collections
          </p>
        </div>

        <button
          onClick={onOpenCreatePlaylist}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition active:scale-95 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> New Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => {
          const playlistSongs = playlist.songIds
            .map((id) => songs.find((s) => s.id === id))
            .filter((s): s is Song => Boolean(s));

          return (
            <div
              key={playlist.id}
              className="glass-card rounded-3xl p-5 hover:border-purple-500/40 transition group cursor-pointer flex flex-col justify-between"
              onClick={() => playlistSongs[0] && onPlaySong(playlistSongs[0])}
            >
              <div>
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10">
                  <ArtworkImage
                    src={playlist.cover}
                    alt={playlist.title}
                    fallbackGradient={playlist.coverGradient}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-1">{playlist.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-slate-500 font-mono">
                <span>{playlist.songIds.length} tracks</span>
                <span className="text-purple-400 font-sans font-semibold">Play Collection →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 6. ARTISTS VIEW
export const ArtistsView: React.FC<ViewProps> = ({ artists, onSelectArtist }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Featured Artists</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore iconic discographies and master vocalists
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onSelectArtist(artist)}
            className="glass-card rounded-2xl p-5 hover:border-purple-500/40 transition group cursor-pointer flex flex-col items-center text-center"
          >
            <ArtistAvatar
              src={artist.avatar}
              name={artist.name}
              gradient={artist.avatarGradient}
              size="xl"
              className="mb-4 group-hover:scale-105 transition-transform"
            />
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
              {artist.name}
            </h3>
            <p className="text-xs text-purple-400 font-medium mt-0.5">{artist.genre}</p>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{artist.bio}</p>
            <div className="mt-4 pt-3 border-t border-white/5 w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>{artist.monthlyListeners}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
