import React from 'react';
import { Artist, Song } from '../types/music';
import { X, Play, Heart, Users } from 'lucide-react';
import { ArtistAvatar } from './ArtistAvatar';
import { ArtworkImage } from './ArtworkImage';

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
  songs: Song[];
  onPlaySong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const ArtistModal: React.FC<ArtistModalProps> = ({
  artist,
  onClose,
  songs,
  onPlaySong,
  currentSong,
  isPlaying,
  favorites,
  onToggleFavorite
}) => {
  if (!artist) return null;

  const artistSongs = songs.filter(s => s.artistId === artist.id || artist.topSongIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0c1e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Banner */}
        <div className={`relative h-56 sm:h-64 p-6 sm:p-8 flex items-end bg-gradient-to-t ${artist.avatarGradient}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1e] via-[#0c0c1e]/40 to-transparent" />
          
          <div className="relative z-10 flex items-end gap-5">
            <ArtistAvatar
              src={artist.avatar}
              name={artist.name}
              gradient={artist.avatarGradient}
              size="xl"
              className="border-2 border-white/30 shadow-2xl ring-4 ring-black/30"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-300 font-semibold mb-1">
                Verified Galaxy Artist
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {artist.name}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-slate-300">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{artist.monthlyListeners} monthly listeners</span>
                <span>·</span>
                <span>{artist.genre}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Bio */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Biography
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {artist.bio}
            </p>
          </div>

          {/* Top Songs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Popular Tracks
              </h3>
              {artistSongs.length > 0 && (
                <button
                  onClick={() => onPlaySong(artistSongs[0])}
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold transition"
                >
                  <Play className="w-3.5 h-3.5 fill-purple-400" /> Play All
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {artistSongs.map((song, i) => {
                const isCurrent = currentSong?.id === song.id;
                const isFav = favorites.includes(song.id);

                return (
                  <div
                    key={song.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition group ${
                      isCurrent ? 'bg-purple-600/15 border border-purple-500/30' : 'hover:bg-white/5'
                    }`}
                  >
                    <div
                      onClick={() => onPlaySong(song)}
                      className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="text-xs font-mono text-slate-500 w-4 text-center">
                        {i + 1}
                      </span>
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative">
                        <ArtworkImage
                          src={song.cover}
                          alt={song.title}
                          fallbackGradient={song.coverGradient}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-purple-300' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{song.album}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleFavorite(song.id)}
                        className={`transition ${isFav ? 'text-purple-400' : 'text-slate-500 hover:text-white'}`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-purple-400' : ''}`} />
                      </button>
                      <span className="text-xs text-slate-500 font-mono">
                        {Math.floor(song.duration / 60)}:
                        {(song.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
