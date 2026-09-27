export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface AudioToneConfig {
  bpm: number;
  rootFreq: number; // e.g. 220 for A3, 261.63 for C4
  chords: number[][]; // chord frequencies
  bassNotes: number[];
  style: 'synthwave' | 'acoustic' | 'nostalgic' | 'rock' | 'lofi' | 'pop';
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  duration: number; // in seconds
  year: number;
  genre: string;
  cover: string;
  coverGradient: string; // fallback cosmic gradient
  artistImage: string;
  lyrics: LyricLine[];
  audioConfig: AudioToneConfig;
  audioUrl?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  coverGradient: string;
  layout: 'list' | 'grid';
  category: 'hits' | 'indo' | 'lawas' | 'rock' | 'user';
  songIds: string[];
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  avatarGradient: string;
  bio: string;
  monthlyListeners: string;
  genre: string;
  topSongIds: string[];
}

export interface RadioStation {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverGradient: string;
  currentSongId: string;
  listeners: string;
}
