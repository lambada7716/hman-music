import { Song, Playlist, Artist, RadioStation } from '../types/music';

export const ALL_SONGS: Song[] = [
  // International Hits 2016-2026
  {
    id: 'hit-1',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    artistId: 'art-the-weeknd',
    album: 'Starboy (Cosmic Edition)',
    duration: 230,
    year: 2016,
    genre: 'R&B / Synthwave',
    cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&q=80',
    coverGradient: 'from-purple-900 via-indigo-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&q=80',
    lyrics: [
      { time: 4, text: "I'm tryna put you in the worst mood, ah" },
      { time: 8, text: "P1 cleaner than your church shoes, ah" },
      { time: 13, text: "Milli point two just to hurt you, ah" },
      { time: 18, text: "All red Lamb' just to tease you, ah" },
      { time: 24, text: "None of these toys on lease too, ah" },
      { time: 29, text: "Made your whole year in a week too, yah" },
      { time: 35, text: "Look what you've done" },
      { time: 39, text: "I'm a motherfuckin' starboy" },
      { time: 44, text: "Look what you've done" },
      { time: 48, text: "I'm a motherfuckin' starboy" },
      { time: 55, text: "Every day a nigga try to test me, ah" },
      { time: 60, text: "Every day a nigga try to end me, ah" },
      { time: 66, text: "Pull off in that spaceship, drop the roof, let's fly" },
      { time: 74, text: "Starboy shining in the galaxy sky" }
    ],
    audioConfig: {
      bpm: 93,
      rootFreq: 130.81, // C3
      chords: [
        [130.81, 164.81, 196.00], // C
        [116.54, 146.83, 174.61], // Bb
        [103.83, 130.81, 155.56], // Ab
        [116.54, 146.83, 174.61], // Bb
      ],
      bassNotes: [65.41, 58.27, 51.91, 58.27],
      style: 'synthwave'
    }
  },
  {
    id: 'hit-2',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/c7/4f/44c74f0d-72dc-6143-d4d0-ba14d661ca0d/mzaf_9566898362556366703.plus.aac.p.m4a',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    artistId: 'art-ed-sheeran',
    album: '÷ (Divide)',
    duration: 233,
    year: 2017,
    genre: 'Pop',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    coverGradient: 'from-cyan-900 via-blue-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&q=80',
    lyrics: [
      { time: 3, text: "The club isn't the best place to find a lover" },
      { time: 6, text: "So the bar is where I go" },
      { time: 9, text: "Me and my friends at the table doing shots" },
      { time: 13, text: "Drinking fast and then we talk slow" },
      { time: 18, text: "Girl, you know I want your love" },
      { time: 22, text: "Your love was handmade for somebody like me" },
      { time: 27, text: "I'm in love with the shape of you" },
      { time: 32, text: "We push and pull like a magnet do" },
      { time: 37, text: "Although my heart is falling too" },
      { time: 42, text: "I'm in love with your body" }
    ],
    audioConfig: {
      bpm: 96,
      rootFreq: 146.83,
      chords: [
        [146.83, 174.61, 220.00],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81],
        [123.47, 146.83, 185.00]
      ],
      bassNotes: [73.42, 65.41, 55.00, 61.74],
      style: 'pop'
    }
  },
  {
    id: 'hit-3',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/67/10/16/67101606-3869-ca44-6c03-e13d6322cb51/mzaf_1135399237022217274.plus.aac.p.m4a',
    title: 'As It Was',
    artist: 'Harry Styles',
    artistId: 'art-harry-styles',
    album: "Harry's House",
    duration: 167,
    year: 2022,
    genre: 'Synth-Pop',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    coverGradient: 'from-amber-900 via-rose-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=300&q=80',
    lyrics: [
      { time: 3, text: "Hold on, ringin' the bell" },
      { time: 7, text: "Nobody's comin' to help" },
      { time: 12, text: "Your daddy lives by himself" },
      { time: 16, text: "He just wants to know that you're well" },
      { time: 21, text: "You know it's not the same as it was" },
      { time: 27, text: "In this world, it's just us" },
      { time: 33, text: "You know it's not the same as it was" },
      { time: 39, text: "As it was, as it was" }
    ],
    audioConfig: {
      bpm: 174,
      rootFreq: 174.61,
      chords: [
        [174.61, 220.00, 261.63],
        [146.83, 174.61, 220.00],
        [130.81, 164.81, 196.00],
        [116.54, 146.83, 174.61]
      ],
      bassNotes: [87.31, 73.42, 65.41, 58.27],
      style: 'synthwave'
    }
  },
  {
    id: 'hit-4',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a',
    title: 'Levitating',
    artist: 'Dua Lipa',
    artistId: 'art-dua-lipa',
    album: 'Future Nostalgia',
    duration: 203,
    year: 2020,
    genre: 'Nu-Disco / Dance Pop',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    coverGradient: 'from-pink-900 via-purple-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=300&q=80',
    lyrics: [
      { time: 3, text: "If you wanna run away with me, I know a galaxy" },
      { time: 7, text: "And I can take you for a ride" },
      { time: 11, text: "I had a premonition that we fell into a rhythm" },
      { time: 16, text: "Where the music don't stop for life" },
      { time: 21, text: "Glitter in the sky, glitter in my eyes" },
      { time: 26, text: "Shining just the way I like" },
      { time: 31, text: "You want me, I want you, baby" },
      { time: 36, text: "My sugarboo, I'm levitating" }
    ],
    audioConfig: {
      bpm: 103,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [164.81, 207.65, 246.94],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 82.41, 65.41, 55.00],
      style: 'synthwave'
    }
  },
  {
    id: 'hit-5',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/9e/f7/689ef7fe-14fe-a846-c87f-7d3b2d6344b1/mzaf_4167137058064023087.plus.aac.p.m4a',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    artistId: 'art-miley-cyrus',
    album: 'Endless Summer Vacation',
    duration: 200,
    year: 2023,
    genre: 'Disco Pop',
    cover: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=600&q=80',
    coverGradient: 'from-amber-800 via-orange-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    lyrics: [
      { time: 4, text: "We were good, we were gold" },
      { time: 8, text: "Kinda dream that can't be sold" },
      { time: 13, text: "We were right 'til we weren't" },
      { time: 18, text: "Built a home and watched it burn" },
      { time: 24, text: "I can buy myself flowers" },
      { time: 29, text: "Write my name in the sand" },
      { time: 35, text: "Talk to myself for hours" },
      { time: 40, text: "Say things you don't understand" },
      { time: 46, text: "I can love me better than you can" }
    ],
    audioConfig: {
      bpm: 118,
      rootFreq: 110.00,
      chords: [
        [110.00, 130.81, 164.81],
        [146.83, 174.61, 220.00],
        [130.81, 164.81, 196.00],
        [164.81, 196.00, 246.94]
      ],
      bassNotes: [55.00, 73.42, 65.41, 82.41],
      style: 'pop'
    }
  },
  {
    id: 'hit-6',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/6a/99/076a99ed-b946-431b-6f1f-54fa187ca5bd/mzaf_8102882277995122875.plus.aac.p.m4a',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    artistId: 'art-lady-gaga',
    album: 'Die With A Smile',
    duration: 251,
    year: 2024,
    genre: 'Soul Pop / Ballad',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    coverGradient: 'from-blue-900 via-rose-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    lyrics: [
      { time: 4, text: "I, I just woke up from a dream" },
      { time: 9, text: "Where you and I had to say goodbye" },
      { time: 15, text: "And I don't know what it all means" },
      { time: 22, text: "But since I survived, I realized" },
      { time: 30, text: "Wherever you go, that's where I'll follow" },
      { time: 38, text: "Nobody's promised tomorrow" },
      { time: 46, text: "So I'ma love you every night like it's the last night" },
      { time: 54, text: "If the world was ending, I'd wanna be next to you" },
      { time: 64, text: "If the party was over and our time on Earth was through" },
      { time: 74, text: "I'd wanna hold you just for a while and die with a smile" }
    ],
    audioConfig: {
      bpm: 79,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00], // C
        [164.81, 196.00, 246.94], // Em
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66]  // G
      ],
      bassNotes: [65.41, 82.41, 87.31, 98.00],
      style: 'acoustic'
    }
  },
  {
    id: 'hit-7',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/34/31/d3/3431d34e-847f-5d66-df83-0bce688d997e/mzaf_18106743962423782018.plus.aac.p.m4a',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    artistId: 'art-billie-eilish',
    album: 'HIT ME HARD AND SOFT',
    duration: 198,
    year: 2024,
    genre: 'Dream Pop / Alt-Pop',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    coverGradient: 'from-cyan-950 via-blue-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
    lyrics: [
      { time: 3, text: "I want you to stay" },
      { time: 6, text: "'Til I'm in the grave" },
      { time: 10, text: "'Til I rot away, dead and buried" },
      { time: 15, text: "'Til I'm in the casket you carry" },
      { time: 20, text: "If you go, I'm going too, uh" },
      { time: 26, text: "'Cause it was always you, alright" },
      { time: 32, text: "And if I'm turning blue, please don't save me" },
      { time: 39, text: "Birds of a feather, we should stick together, I know" },
      { time: 48, text: "I said I'd never think I wasn't better alone" },
      { time: 57, text: "Can't change the weather, might not be forever" }
    ],
    audioConfig: {
      bpm: 105,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [164.81, 196.00, 246.94],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 82.41, 65.41, 55.00],
      style: 'pop'
    }
  },
  {
    id: 'hit-8',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/4d/02/e94d0230-11ee-ef94-d2cf-a5d547bd73f4/mzaf_554140808559155562.plus.aac.p.m4a',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    artistId: 'art-sabrina-carpenter',
    album: 'Short n’ Sweet',
    duration: 175,
    year: 2024,
    genre: 'Nu-Disco / Dance Pop',
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80',
    coverGradient: 'from-amber-900 via-orange-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
    lyrics: [
      { time: 4, text: "Now he's thinkin' 'bout me every night, oh" },
      { time: 9, text: "Is it that sweet? I guess so" },
      { time: 14, text: "Say you can't sleep, baby, I know" },
      { time: 19, text: "That's that me, espresso" },
      { time: 24, text: "Move it up, down, left, right, oh" },
      { time: 29, text: "Switch it up like Nintendo" },
      { time: 34, text: "Say you can't sleep, baby, I know" },
      { time: 39, text: "That's that me, espresso" },
      { time: 45, text: "I can't relate to desperation" },
      { time: 51, text: "My give-a-fucks are on vacation" }
    ],
    audioConfig: {
      bpm: 104,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [116.54, 146.83, 174.61],
        [103.83, 130.81, 155.56],
        [116.54, 146.83, 174.61]
      ],
      bassNotes: [65.41, 58.27, 51.91, 58.27],
      style: 'synthwave'
    }
  },
  {
    id: 'hit-9',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7a/15/38/7a1538f3-f41a-a2eb-0f24-8eb6712ee043/mzaf_7740628412097685267.plus.aac.p.m4a',
    title: 'APT.',
    artist: 'ROSÉ & Bruno Mars',
    artistId: 'art-rose',
    album: 'rosie',
    duration: 169,
    year: 2024,
    genre: 'Pop Rock / New Wave',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    coverGradient: 'from-pink-900 via-purple-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    lyrics: [
      { time: 2, text: "Chaeyoung-i ga joh-ahaneun, raendeom geim!" },
      { time: 5, text: "Game start!" },
      { time: 7, text: "Apateu, apateu, apateu, apateu" },
      { time: 13, text: "Apateu, apateu, uh, uh-huh uh-huh" },
      { time: 18, text: "Kissy face, kissy face, sent to your phone but" },
      { time: 23, text: "I'm tryna kiss your lips for real" },
      { time: 29, text: "Don't you want me like I want you, baby?" },
      { time: 35, text: "Don't you need me like I need you now?" },
      { time: 42, text: "Sleep tomorrow, but tonight go crazy" },
      { time: 48, text: "Meet me at the apateu!" }
    ],
    audioConfig: {
      bpm: 145,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66],
        [146.83, 185.00, 220.00]
      ],
      bassNotes: [73.42, 87.31, 98.00, 73.42],
      style: 'pop'
    }
  },
  {
    id: 'hit-10',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4d/d5/00/4dd5006f-ee02-c3f1-94db-0ed4b8dd68f1/mzaf_14250561294796027079.plus.aac.p.m4a',
    title: 'Beautiful Things',
    artist: 'Benson Boone',
    artistId: 'art-benson-boone',
    album: 'Fireworks & Rollerblades',
    duration: 180,
    year: 2024,
    genre: 'Pop Rock / Alt-Pop',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    coverGradient: 'from-violet-950 via-indigo-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    lyrics: [
      { time: 3, text: "For a while there, it was rough" },
      { time: 8, text: "But lately, I've been doin' better" },
      { time: 14, text: "Than the last four cold Decembers I recall" },
      { time: 21, text: "And I see my family every month" },
      { time: 27, text: "I found a girl my parents love" },
      { time: 33, text: "Please stay, I want you, I need you, oh God" },
      { time: 42, text: "Don't take these beautiful things that I've got!" },
      { time: 51, text: "Please don't take these beautiful things that I've got" }
    ],
    audioConfig: {
      bpm: 105,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [164.81, 196.00, 246.94],
        [146.83, 174.61, 220.00],
        [174.61, 220.00, 261.63]
      ],
      bassNotes: [65.41, 82.41, 73.42, 87.31],
      style: 'acoustic'
    }
  },
  {
    id: 'hit-11',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a6/61/fc/a661fcaf-f8e5-03db-36f3-31f2e196b1a5/mzaf_18300083713037280538.plus.aac.p.m4a',
    title: 'Too Sweet',
    artist: 'Hozier',
    artistId: 'art-hozier',
    album: 'Unreal Unearth: Unaired',
    duration: 251,
    year: 2024,
    genre: 'Indie Soul / Blues Pop',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    coverGradient: 'from-stone-900 via-amber-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
    lyrics: [
      { time: 4, text: "It can't be said I'm an early bird" },
      { time: 9, text: "It's ten o'clock before I say a word" },
      { time: 15, text: "Baby, I was born sick, but I love it" },
      { time: 23, text: "I take my whiskey neat" },
      { time: 28, text: "My coffee black and my bed at three" },
      { time: 35, text: "You're too sweet for me" },
      { time: 42, text: "You're too sweet, baby" },
      { time: 49, text: "I aim low, I aim true, and the ground expands" }
    ],
    audioConfig: {
      bpm: 117,
      rootFreq: 110.00,
      chords: [
        [110.00, 130.81, 164.81],
        [146.83, 174.61, 220.00],
        [130.81, 164.81, 196.00],
        [164.81, 196.00, 246.94]
      ],
      bassNotes: [55.00, 73.42, 65.41, 82.41],
      style: 'pop'
    }
  },
  {
    id: 'hit-12',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c3/6d/4f/c36d4f23-b87f-046d-7a0e-e3e05d180b2a/mzaf_17235999651335214399.plus.aac.p.m4a',
    title: 'Good Luck, Babe!',
    artist: 'Chappell Roan',
    artistId: 'art-chappell-roan',
    album: 'Good Luck, Babe!',
    duration: 218,
    year: 2024,
    genre: 'Synth-Pop',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    coverGradient: 'from-fuchsia-950 via-red-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
    lyrics: [
      { time: 3, text: "It's fine, it's cool" },
      { time: 8, text: "You can say that we are nothing, but you know the truth" },
      { time: 16, text: "And guess what? You'd have to kill me" },
      { time: 24, text: "To stop the memory of our summer" },
      { time: 32, text: "You'd have to stop the world just to stop the feeling" },
      { time: 41, text: "Good luck, babe, well, good luck!" },
      { time: 49, text: "You'd have to stop the world just to stop the feeling" }
    ],
    audioConfig: {
      bpm: 118,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [146.83, 174.61, 220.00],
        [164.81, 196.00, 246.94],
        [174.61, 220.00, 261.63]
      ],
      bassNotes: [65.41, 73.42, 82.41, 87.31],
      style: 'synthwave'
    }
  },

  // Pop Indo Pilihan
  {
    id: 'indo-1',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/93/60/ce9360d0-14e3-ec93-0da4-ba88d94a7212/mzaf_16150840965482830516.plus.aac.p.m4a',
    title: 'Sial',
    artist: 'Mahalini',
    artistId: 'art-mahalini',
    album: 'FÁBULA',
    duration: 243,
    year: 2023,
    genre: 'Pop Indo / Ballad',
    cover: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=600&q=80',
    coverGradient: 'from-fuchsia-950 via-rose-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=300&q=80',
    lyrics: [
      { time: 3, text: "Sampai saat ini tak terpikir olehku" },
      { time: 8, text: "Aku pernah beri rasa pada orang sepertimu" },
      { time: 15, text: "Seandainya saat itu tidak bertemu denganmu" },
      { time: 23, text: "Pasti semuanya takkan begini" },
      { time: 31, text: "Sial-sialnya ku bertemu dengan cinta semu" },
      { time: 39, text: "Tertipu tutur dan tatapmu" },
      { time: 46, text: "Seolah kau pensil warna yang melengkapi lukisanku" },
      { time: 54, text: "Ternyata kau hanya abu-abu" }
    ],
    audioConfig: {
      bpm: 76,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [146.83, 174.61, 220.00],
        [164.81, 196.00, 246.94],
        [174.61, 220.00, 261.63]
      ],
      bassNotes: [65.41, 73.42, 82.41, 87.31],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-2',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bb/50/cd/bb50cd11-dbbc-f84e-1244-f1b786af7ab4/mzaf_15441108959417505948.plus.aac.p.m4a',
    title: 'Hati-Hati di Jalan',
    artist: 'Tulus',
    artistId: 'art-tulus',
    album: 'Manusia',
    duration: 242,
    year: 2022,
    genre: 'Indonesian Pop / Soul',
    cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=600&q=80',
    coverGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80',
    lyrics: [
      { time: 4, text: "Perjalanan membawamu bertemu denganku" },
      { time: 10, text: "Ku bertemu kamu" },
      { time: 16, text: "Sepertinya yang kukira kau adalah jawaban" },
      { time: 23, text: "Segala pertanyaan" },
      { time: 30, text: "Kukira kita akan bersama" },
      { time: 38, text: "Begitu banyak yang sama, latarmu dan latarku" },
      { time: 47, text: "Kukira takkan ada kendala" },
      { time: 54, text: "Hati-hati di jalan..." }
    ],
    audioConfig: {
      bpm: 82,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [130.81, 164.81, 196.00],
        [116.54, 146.83, 174.61],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 65.41, 58.27, 55.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-3',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/4a/dc/194adc61-e44c-c609-5e47-480e6e9fde44/mzaf_7249735545085540214.plus.aac.p.m4a',
    title: 'Sisa Rasa',
    artist: 'Mahalini',
    artistId: 'art-mahalini',
    album: 'FÁBULA',
    duration: 254,
    year: 2021,
    genre: 'Pop Indo / Ballad',
    cover: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=600&q=80',
    coverGradient: 'from-violet-950 via-purple-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=300&q=80',
    lyrics: [
      { time: 4, text: "Melihatmu bahagia, satu hal yang terindah" },
      { time: 11, text: "Anugerah cinta yang pernah kupunya" },
      { time: 19, text: "Kau buat ku percaya ketulusan cinta" },
      { time: 27, text: "Seolah kau tercipta hanya untukku" },
      { time: 36, text: "Masih ada sisa rasa di dada" },
      { time: 44, text: "Di saat kau telah melangkah pergi" },
      { time: 52, text: "Mungkinkah kita bisa kembali seperti dulu?" }
    ],
    audioConfig: {
      bpm: 72,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [110.00, 130.81, 164.81],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66]
      ],
      bassNotes: [65.41, 55.00, 87.31, 98.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-4',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/49/a4/63/49a4632e-ed7d-a68f-811b-aaad7b6f8249/mzaf_14945182221016939725.plus.aac.p.m4a',
    title: 'Komang',
    artist: 'Raim Laode',
    artistId: 'art-raim-laode',
    album: 'Komang',
    duration: 221,
    year: 2022,
    genre: 'Indie Folk / Pop',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    coverGradient: 'from-yellow-950 via-amber-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1520627747805-4081c7e2bd78?w=300&q=80',
    lyrics: [
      { time: 3, text: "Dari kejauhan tergambar cerita tentang kita" },
      { time: 8, text: "Terpisah jarak dan waktu" },
      { time: 14, text: "Ingin ku ungkapkan semua rasa rinduku" },
      { time: 21, text: "Sebab kau terlalu indah sekedar tuk diingat" },
      { time: 29, text: "Kau terlalu nyata untuk kuabaikan" },
      { time: 37, text: "Dan apabila kau hadir di hidupku" },
      { time: 44, text: "Sederhana senyummu cukup bagiku" }
    ],
    audioConfig: {
      bpm: 88,
      rootFreq: 164.81,
      chords: [
        [164.81, 207.65, 246.94],
        [146.83, 185.00, 220.00],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [82.41, 73.42, 65.41, 55.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-5',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/da/1f/93/da1f93b4-b2ca-5624-8cba-da0f1f123eed/mzaf_1374587696112479353.plus.aac.p.m4a',
    title: 'Tak Segampang Itu',
    artist: 'Anggi Marito',
    artistId: 'art-anggi-marito',
    album: 'Tak Segampang Itu',
    duration: 231,
    year: 2023,
    genre: 'Pop Indo / Ballad',
    cover: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80',
    coverGradient: 'from-pink-950 via-rose-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    lyrics: [
      { time: 3, text: "Waktu demi waktu telah kulewati" },
      { time: 8, text: "Mencari cinta sejati yang tak kunjung kudapati" },
      { time: 16, text: "Hingga suatu hari kau datang kembali" },
      { time: 24, text: "Namun tak segampang itu ku memaafkanmu" },
      { time: 32, text: "Tak segampang itu ku melupakan luka yang kau beri" },
      { time: 41, text: "Kini ku terbiasa hidup tanpamu" }
    ],
    audioConfig: {
      bpm: 78,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [146.83, 174.61, 220.00],
        [110.00, 130.81, 164.81],
        [174.61, 220.00, 261.63]
      ],
      bassNotes: [65.41, 73.42, 55.00, 87.31],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-6',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e4/6e/2d/e46e2d19-527b-8b0c-f0f6-652e9dc410d9/mzaf_11777851144159489769.plus.aac.p.m4a',
    title: 'Rayuan Perempuan Gila',
    artist: 'Nadin Amizah',
    artistId: 'art-nadin-amizah',
    album: 'Untuk Dunia, Cinta, dan Kotornya',
    duration: 216,
    year: 2023,
    genre: 'Indie Pop / Bossa Folk',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    coverGradient: 'from-amber-950 via-emerald-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
    lyrics: [
      { time: 3, text: "Menurutmu apa yang bisa kulakukan" },
      { time: 9, text: "Jika semua yang kuupayakan selalu salah" },
      { time: 16, text: "Memang sekarang kau belum membenciku" },
      { time: 24, text: "Tapi nanti jangan tanya mengapa aku takut" },
      { time: 32, text: "Jangan jatuh cinta padaku, aku ini gila" },
      { time: 40, text: "Cintaku rumit dan banyak lukanya" }
    ],
    audioConfig: {
      bpm: 110,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [130.81, 164.81, 196.00],
        [116.54, 146.83, 174.61],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 65.41, 58.27, 55.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-7',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/29/c3/9e29c3bc-5ee6-12ac-5ca8-19995fe61cc3/mzaf_8668688022169892006.plus.aac.p.m4a',
    title: 'Jiwa Yang Bersedih',
    artist: 'Ghea Indrawari',
    artistId: 'art-ghea-indrawari',
    album: 'Berdamai',
    duration: 278,
    year: 2023,
    genre: 'Pop Akustik / Healing',
    cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80',
    coverGradient: 'from-teal-950 via-cyan-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
    lyrics: [
      { time: 4, text: "Kemarilah, singgah dulu sebentar" },
      { time: 10, text: "Luapkan seluruh lelahmu di pundakku" },
      { time: 18, text: "Jangan menangis sendirian di sudut sepi" },
      { time: 26, text: "Sampaikan pada jiwa yang bersedih" },
      { time: 34, text: "Bahwa kau telah berjuang begitu hebat hari ini" },
      { time: 44, text: "Tak apa jika kini kau merasa lelah" }
    ],
    audioConfig: {
      bpm: 74,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [110.00, 130.81, 164.81],
        [146.83, 174.61, 220.00],
        [174.61, 220.00, 261.63]
      ],
      bassNotes: [65.41, 55.00, 73.42, 87.31],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-8',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f0/7b/00/f07b00d4-cea0-79f0-3062-7e2b2d2d274a/mzaf_7698224852945153762.plus.aac.p.m4a',
    title: 'Monokrom',
    artist: 'Tulus',
    artistId: 'art-tulus',
    album: 'Monokrom',
    duration: 215,
    year: 2016,
    genre: 'Indonesian Pop / Soul',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80',
    coverGradient: 'from-stone-900 via-zinc-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80',
    lyrics: [
      { time: 4, text: "Lembaran foto hitam putih" },
      { time: 9, text: "Aku coba ingat lagi warna bajumu kala itu" },
      { time: 17, text: "Telah lama kita tak berjumpa" },
      { time: 24, text: "Kini kau telah beranjak dewasa" },
      { time: 32, text: "Di manapun kalian berada, kuhaturkan terima kasih" },
      { time: 42, text: "Kalian ada dalam memori monokromku" }
    ],
    audioConfig: {
      bpm: 86,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [164.81, 196.00, 246.94],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 82.41, 65.41, 55.00],
      style: 'nostalgic'
    }
  },
  {
    id: 'indo-9',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/12/9a/78/129a78bb-9c6f-75dc-fc5d-877a19e8c0bf/mzaf_8421330473577576783.plus.aac.p.m4a',
    title: 'Satu Bulan',
    artist: 'Bernadya',
    artistId: 'art-bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    duration: 194,
    year: 2024,
    genre: 'Indie Pop / Sadcore',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    coverGradient: 'from-violet-950 via-slate-950 to-neutral-950',
    artistImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    lyrics: [
      { time: 3, text: "Belum genap satu bulan kita berpisah" },
      { time: 9, text: "Kudengar kau sudah ada yang punya" },
      { time: 16, text: "Hebat sekali caramu melupakan" },
      { time: 23, text: "Sementara di sini aku masih terjebak kenangan" },
      { time: 31, text: "Apakah cinta bagimu secepat itu berganti?" },
      { time: 40, text: "Sedangkan lukaku masih basah menganga" }
    ],
    audioConfig: {
      bpm: 82,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [116.54, 146.83, 174.61],
        [110.00, 130.81, 164.81],
        [146.83, 174.61, 220.00]
      ],
      bassNotes: [65.41, 58.27, 55.00, 73.42],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-10',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bb/aa/1a/bbaa1a7f-d395-7002-90f1-fbc235e4b184/mzaf_10156119175195441756.plus.aac.p.m4a',
    title: 'Gala Bunga Matahari',
    artist: 'Sal Priadi',
    artistId: 'art-sal-priadi',
    album: 'MARKERS AND SUCH PENS FLASHDISKS',
    duration: 234,
    year: 2024,
    genre: 'Pop Puisi / Ethereal Ballad',
    cover: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&q=80',
    coverGradient: 'from-yellow-950 via-amber-950 to-neutral-950',
    artistImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    lyrics: [
      { time: 4, text: "Mungkinkah kau ada di sana, di taman bunga abadi?" },
      { time: 12, text: "Terbebas dari segala perih yang pernah menimpa" },
      { time: 21, text: "Bila kau rindu, datanglah sebagai kupu-kupu" },
      { time: 30, text: "Atau merekah di kebun sebagai bunga matahari" },
      { time: 41, text: "Agar ku tahu kau bahagia di pelukan semesta" },
      { time: 52, text: "Tenanglah di sana, jiwa yang suci" }
    ],
    audioConfig: {
      bpm: 72,
      rootFreq: 164.81,
      chords: [
        [164.81, 207.65, 246.94],
        [130.81, 164.81, 196.00],
        [146.83, 185.00, 220.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [82.41, 65.41, 73.42, 55.00],
      style: 'nostalgic'
    }
  },
  {
    id: 'indo-11',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/80/0c/4e/800c4e7b-d1a3-01e8-c5f8-410d7f26eee8/mzaf_16173782299315690453.plus.aac.p.m4a',
    title: 'Dunia Tipu-Tipu',
    artist: 'Yura Yunita',
    artistId: 'art-yura-yunita',
    album: 'Tutur Batin',
    duration: 219,
    year: 2022,
    genre: 'Soul Pop / Warmth',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    coverGradient: 'from-orange-950 via-rose-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    lyrics: [
      { time: 3, text: "Di dunia tipu-tipu, kamu tempat aku pulang" },
      { time: 9, text: "Tanpa topeng dan tanpa tuntutan" },
      { time: 16, text: "Hanya denganmu aku bisa menjadi diriku yang sejati" },
      { time: 24, text: "Peluk erat saat dingin menghampiri" },
      { time: 32, text: "Terima kasih untuk selalu ada di setiap jatuh bangun" },
      { time: 41, text: "Menemani langkah kecilku di dunia ini" }
    ],
    audioConfig: {
      bpm: 84,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [164.81, 196.00, 246.94],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 82.41, 65.41, 55.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-12',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e5/39/1c/e5391c7b-b92c-7ce0-5fe8-b3115fa6933a/mzaf_5635026938220547257.plus.aac.p.m4a',
    title: 'Pesan Terakhir',
    artist: 'Lyodra',
    artistId: 'art-lyodra',
    album: 'Lyodra',
    duration: 260,
    year: 2021,
    genre: 'Pop Indo / Dramatic Ballad',
    cover: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=600&q=80',
    coverGradient: 'from-purple-950 via-red-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
    lyrics: [
      { time: 4, text: "Telah kucoba bertahan sekuat hatiku" },
      { time: 11, text: "Meski kutahu hatimu bukan untukku" },
      { time: 20, text: "Kini ku pasrah melepaskan genggaman" },
      { time: 29, text: "Ini pesan terakhir dariku sebelum ku melangkah" },
      { time: 39, text: "Berbahagialah dengan pilihan hatimu" },
      { time: 49, text: "Meski bukan aku yang mendampingimu" }
    ],
    audioConfig: {
      bpm: 76,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [110.00, 130.81, 164.81],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66]
      ],
      bassNotes: [65.41, 55.00, 87.31, 98.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-13',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/aa/eb/54/aaeb5424-fb96-4566-669c-36fb99a9e425/mzaf_14244361241051490751.plus.aac.p.m4a',
    title: 'Cuek',
    artist: 'Rizky Febian',
    artistId: 'art-rizky-febian',
    album: 'Garis Cinta',
    duration: 217,
    year: 2020,
    genre: 'R&B / Pop Indo',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    coverGradient: 'from-cyan-950 via-indigo-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
    lyrics: [
      { time: 3, text: "Kadang ku kesal dengan sikapmu" },
      { time: 8, text: "Yang selalu saja terlihat cuek padaku" },
      { time: 15, text: "Tapi ku tahu jauh di dalam lubuk hatimu" },
      { time: 22, text: "Kau mencintaiku lebih dari apapun" },
      { time: 30, text: "Mana ada aku cuek, mana ada aku tak peduli" },
      { time: 39, text: "Hanya saja caraku mencintaimu berbeda" }
    ],
    audioConfig: {
      bpm: 96,
      rootFreq: 146.83,
      chords: [
        [146.83, 174.61, 220.00],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81],
        [164.81, 196.00, 246.94]
      ],
      bassNotes: [73.42, 65.41, 55.00, 82.41],
      style: 'pop'
    }
  },
  {
    id: 'indo-14',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6a/22/96/6a2296f7-bc42-bc3b-d97c-a13ccddd43fe/mzaf_9168965868181094161.plus.aac.p.m4a',
    title: 'Bohongi Hati',
    artist: 'Mahalini',
    artistId: 'art-mahalini',
    album: 'FÁBULA',
    duration: 251,
    year: 2023,
    genre: 'Pop Indo / Ballad',
    cover: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=600&q=80',
    coverGradient: 'from-rose-950 via-purple-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=300&q=80',
    lyrics: [
      { time: 4, text: "Jika kau memang tak lagi mencintaiku" },
      { time: 11, text: "Katakanlah sejujurnya tanpa keraguan" },
      { time: 20, text: "Jangan bohongi hatimu hanya demi menjagaku" },
      { time: 29, text: "Sebab perih ini lebih menyiksa daripada perpisahan" },
      { time: 39, text: "Ku ikhlas bila memang takdir harus berbeda" }
    ],
    audioConfig: {
      bpm: 74,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [146.83, 174.61, 220.00],
        [164.81, 196.00, 246.94],
        [110.00, 130.81, 164.81]
      ],
      bassNotes: [65.41, 73.42, 82.41, 55.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-15',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/49/ff/48/49ff48c0-c632-7fdd-2e15-2879a6a9e51e/mzaf_815192612749261657.plus.aac.p.m4a',
    title: 'Untungnya, Hidup Harus Tetap Berjalan',
    artist: 'Bernadya',
    artistId: 'art-bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    duration: 188,
    year: 2024,
    genre: 'Indie Pop / Healing',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    coverGradient: 'from-stone-900 via-neutral-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    lyrics: [
      { time: 3, text: "Untung ada yang mendukungku" },
      { time: 8, text: "Untung ada yang menguatkan" },
      { time: 14, text: "Untung masih ada kopi hangat di pagi hari" },
      { time: 22, text: "Untung aku belum menyerah pada hari esok" },
      { time: 30, text: "Bila ku ingat-ingat lagi, berat juga ya yang kemarin" },
      { time: 40, text: "Tapi untungnya, hidup harus tetap berjalan" },
      { time: 50, text: "Melangkah perlahan, menemukan bahagia baru" }
    ],
    audioConfig: {
      bpm: 78,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [146.83, 174.61, 220.00],
        [164.81, 196.00, 246.94],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [65.41, 73.42, 82.41, 55.00],
      style: 'acoustic'
    }
  },
  {
    id: 'indo-16',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/10/10/03/101003d2-860d-97ff-7345-14a1269ff707/mzaf_17105680075846294425.plus.aac.p.m4a',
    title: 'Kita Bikin Romantis',
    artist: "MALIQ & D'Essentials",
    artistId: 'art-maliq',
    album: 'Can Machines Fall In Love?',
    duration: 215,
    year: 2024,
    genre: 'Pop Soul / Nu-Jazz',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    coverGradient: 'from-amber-900 via-pink-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
    lyrics: [
      { time: 3, text: "Kita bikin romantis, bikin paling romantis" },
      { time: 9, text: "Sambil bermain mata, turun ke hati" },
      { time: 15, text: "Hatinya jadi manis" },
      { time: 21, text: "Biar dunia tahu, kita bahagia" },
      { time: 28, text: "Katakan pada dunia hari ini kita yang punya" },
      { time: 37, text: "Jatuh cinta setiap detik bersamamu" }
    ],
    audioConfig: {
      bpm: 98,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [164.81, 196.00, 246.94],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 82.41, 65.41, 55.00],
      style: 'pop'
    }
  },
  {
    id: 'indo-17',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/62/af/c6/62afc64f-ce89-0a93-c1b8-f38b49f3f0a9/mzaf_12443430597556788952.plus.aac.p.m4a',
    title: 'Bunga Hati',
    artist: 'Salma Salsabil',
    artistId: 'art-salma-salsabil',
    album: 'Bunga Hati',
    duration: 204,
    year: 2023,
    genre: 'Groovy Pop / Jazz',
    cover: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&q=80',
    coverGradient: 'from-rose-900 via-purple-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    lyrics: [
      { time: 3, text: "Sekian lama kita tak berjumpa" },
      { time: 8, text: "Namun rasa itu masih sama seperti dulu" },
      { time: 15, text: "Mekar kembali bunga di hatiku" },
      { time: 22, text: "Saat kau menyapa dengan senyum manismu" },
      { time: 30, text: "Apakah kau rasakan getaran yang sama?" },
      { time: 39, text: "Bunga hatiku bersemi lagi untukmu" }
    ],
    audioConfig: {
      bpm: 112,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [146.83, 174.61, 220.00],
        [164.81, 196.00, 246.94],
        [174.61, 220.00, 261.63]
      ],
      bassNotes: [65.41, 73.42, 82.41, 87.31],
      style: 'synthwave'
    }
  },
  {
    id: 'indo-18',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c5/09/c3/c509c366-7c80-f048-6ea7-4743e407c2e1/mzaf_5472379509832203644.plus.aac.p.m4a',
    title: 'Boleh Juga',
    artist: 'Sal Priadi',
    artistId: 'art-sal-priadi',
    album: 'MARKERS AND SUCH PENS FLASHDISKS',
    duration: 196,
    year: 2024,
    genre: 'Pop Akustik / Whimsical',
    cover: 'https://images.unsplash.com/photo-1520627747805-4081c7e2bd78?w=600&q=80',
    coverGradient: 'from-amber-950 via-teal-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    lyrics: [
      { time: 3, text: "Boleh juga kamu tersenyum begitu" },
      { time: 8, text: "Bikin hari yang mendung jadi terang kembali" },
      { time: 15, text: "Boleh juga kalau kita jalan berdua sore ini" },
      { time: 23, text: "Menikmati kota sambil bercerita hal-hal lucu" },
      { time: 32, text: "Semesta seolah merestui langkah kita" },
      { time: 41, text: "Boleh juga, boleh banget malahan" }
    ],
    audioConfig: {
      bpm: 88,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [164.81, 196.00, 246.94],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 82.41, 65.41, 55.00],
      style: 'acoustic'
    }
  },

  // Lawas (Indonesian Oldies)
  {
    id: 'lawas-1',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0e/dc/bb/0edcbbc3-c7ed-5595-301a-ad3a957d6e20/mzaf_17441730939769254529.plus.aac.p.m4a',
    title: 'Kemesraan',
    artist: 'Iwan Fals',
    artistId: 'art-iwan-fals',
    album: 'Kemesraan Antologi',
    duration: 312,
    year: 1988,
    genre: 'Classic Indonesian Folk',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    coverGradient: 'from-orange-950 via-red-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?w=300&q=80',
    lyrics: [
      { time: 5, text: "Suatu hari dikala kita duduk ditepi pantai" },
      { time: 13, text: "Dan memandang ombak dilautan yang kian menepi" },
      { time: 22, text: "Burung camar terbang bermain diderunya air" },
      { time: 31, text: "Suara alam ini hangatkan jiwa kita" },
      { time: 42, text: "Kemesraan ini janganlah cepat berlalu" },
      { time: 52, text: "Kemesraan ini ingin kukenang selalu" },
      { time: 62, text: "Hatiku damai, jiwaku tenang disampingmu" }
    ],
    audioConfig: {
      bpm: 78,
      rootFreq: 130.81,
      chords: [
        [130.81, 164.81, 196.00],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66],
        [130.81, 164.81, 196.00]
      ],
      bassNotes: [65.41, 87.31, 98.00, 65.41],
      style: 'nostalgic'
    }
  },
  {
    id: 'lawas-2',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6c/91/6c/6c916c71-90a0-5116-7cde-975da0aff103/mzaf_6875430651679363864.plus.aac.p.m4a',
    title: 'Kisah Kasih di Sekolah',
    artist: 'Chrisye',
    artistId: 'art-chrisye',
    album: 'Dekade',
    duration: 280,
    year: 2002,
    genre: 'Indonesian Nostalgia Pop',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80',
    coverGradient: 'from-blue-950 via-indigo-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=300&q=80',
    lyrics: [
      { time: 4, text: "Resah dan gelisah menunggu di sini" },
      { time: 10, text: "Di sudut sekolah tempat yang kau janjikan" },
      { time: 18, text: "Ingin jumpa denganmu walau sekejap saja" },
      { time: 25, text: "Tiada kisah paling indah, kisah-kasih di sekolah" },
      { time: 34, text: "Tiada cerita paling manis, cerita di masa sekolah" },
      { time: 44, text: "Sungguh aneh tapi nyata, kini kita bercinta" }
    ],
    audioConfig: {
      bpm: 85,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [164.81, 196.00, 246.94],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81]
      ],
      bassNotes: [73.42, 82.41, 65.41, 55.00],
      style: 'nostalgic'
    }
  },
  {
    id: 'lawas-3',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d7/70/23/d7702360-879f-7598-94d6-756873b86224/mzaf_12630421543322268449.plus.aac.p.m4a',
    title: 'Bintang Kehidupan',
    artist: 'Nike Ardilla',
    artistId: 'art-nike-ardilla',
    album: 'Bintang Kehidupan (Remastered)',
    duration: 275,
    year: 1990,
    genre: 'Slow Rock / Pop Legenda',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80',
    coverGradient: 'from-purple-950 via-indigo-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80',
    lyrics: [
      { time: 4, text: "Jenuh aku mendengar manisnya kata cinta" },
      { time: 12, text: "Lebih baik sendiri, bukanlah ku tak sudi" },
      { time: 20, text: "Malam-malam aku sendiri, tanpa cintamu lagi" },
      { time: 29, text: "Hanya satu keyakinanku, bintang kan bersinar" },
      { time: 38, text: "Menerangi jalan yang kutempuh di kegelapan ini" }
    ],
    audioConfig: {
      bpm: 74,
      rootFreq: 110.00,
      chords: [
        [110.00, 130.81, 164.81],
        [130.81, 164.81, 196.00],
        [146.83, 174.61, 220.00],
        [164.81, 196.00, 246.94]
      ],
      bassNotes: [55.00, 65.41, 73.42, 82.41],
      style: 'nostalgic'
    }
  },

  // Rock Legends
  {
    id: 'rock-1',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/17/fc/1e/17fc1eba-946d-84a9-710b-a0e88ea64209/mzaf_3049006317693088799.plus.aac.p.m4a',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    artistId: 'art-queen',
    album: 'A Night at the Opera',
    duration: 354,
    year: 1975,
    genre: 'Classic Rock / Operatic Rock',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80',
    coverGradient: 'from-stone-900 via-amber-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&q=80',
    lyrics: [
      { time: 2, text: "Is this the real life? Is this just fantasy?" },
      { time: 8, text: "Caught in a landslide, no escape from reality" },
      { time: 15, text: "Open your eyes, look up to the skies and see" },
      { time: 23, text: "I'm just a poor boy, I need no sympathy" },
      { time: 30, text: "Because I'm easy come, easy go, little high, little low" },
      { time: 38, text: "Any way the wind blows doesn't really matter to me" },
      { time: 48, text: "Mama, just killed a man" },
      { time: 55, text: "Put a gun against his head, pulled my trigger, now he's dead" }
    ],
    audioConfig: {
      bpm: 72,
      rootFreq: 116.54,
      chords: [
        [116.54, 146.83, 174.61],
        [130.81, 164.81, 196.00],
        [110.00, 138.59, 164.81],
        [98.00, 123.47, 146.83]
      ],
      bassNotes: [58.27, 65.41, 55.00, 49.00],
      style: 'rock'
    }
  },
  {
    id: 'rock-2',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/65/49/4e/65494e02-b6d3-26d8-6b0c-9bd98dcf4d5d/mzaf_7665413316386155700.plus.aac.p.m4a',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    artistId: 'art-nirvana',
    album: 'Nevermind',
    duration: 301,
    year: 1991,
    genre: 'Grunge / Alternative Rock',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80',
    coverGradient: 'from-cyan-950 via-sky-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1516280440502-8636b0439626?w=300&q=80',
    lyrics: [
      { time: 8, text: "Load up on guns, bring your friends" },
      { time: 14, text: "It's fun to lose and to pretend" },
      { time: 20, text: "She's over-bored and self-assured" },
      { time: 26, text: "Oh no, I know a dirty word" },
      { time: 32, text: "Hello, hello, hello, how low" },
      { time: 42, text: "With the lights out, it's less dangerous" },
      { time: 48, text: "Here we are now, entertain us" },
      { time: 55, text: "I feel stupid and contagious" },
      { time: 61, text: "Here we are now, entertain us" }
    ],
    audioConfig: {
      bpm: 117,
      rootFreq: 87.31,
      chords: [
        [87.31, 116.54, 130.81],
        [116.54, 155.56, 174.61],
        [103.83, 138.59, 155.56],
        [138.59, 185.00, 207.65]
      ],
      bassNotes: [43.65, 58.27, 51.91, 69.30],
      style: 'rock'
    }
  },
  {
    id: 'rock-3',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a5/82/2d/a5822d67-2e65-fe95-511e-1f785d23e5cc/mzaf_8619467974951398014.plus.aac.p.m4a',
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    artistId: 'art-guns-n-roses',
    album: 'Appetite for Destruction',
    duration: 356,
    year: 1987,
    genre: 'Hard Rock',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    coverGradient: 'from-amber-950 via-red-950 to-slate-950',
    artistImage: 'https://images.unsplash.com/photo-1543332143-4e8c27e3256f?w=300&q=80',
    lyrics: [
      { time: 15, text: "She's got a smile that it seems to me" },
      { time: 22, text: "Reminds me of childhood memories" },
      { time: 29, text: "Where everything was as fresh as the bright blue sky" },
      { time: 38, text: "Now and then when I see her face" },
      { time: 45, text: "She takes me away to that special place" },
      { time: 54, text: "Oh, oh, oh, sweet child o' mine" },
      { time: 64, text: "Oh, oh, oh, sweet love of mine" }
    ],
    audioConfig: {
      bpm: 125,
      rootFreq: 146.83,
      chords: [
        [146.83, 185.00, 220.00],
        [130.81, 164.81, 196.00],
        [98.00, 123.47, 146.83],
        [146.83, 185.00, 220.00]
      ],
      bassNotes: [73.42, 65.41, 49.00, 73.42],
      style: 'rock'
    }
  }
];

export const PLAYLISTS: Playlist[] = [
  {
    id: 'pl-spotify-hits',
    title: 'Spotify Top 50 Viral Hits (Global & Indo)',
    description: 'Daftar putar lagu paling viral dan merajai chart Spotify 2024-2026 di Indonesia dan seluruh dunia.',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    coverGradient: 'from-emerald-900 via-green-950 to-slate-950',
    layout: 'list',
    category: 'hits',
    songIds: [
      'hit-6',
      'hit-7',
      'hit-8',
      'hit-9',
      'indo-15',
      'indo-16',
      'hit-10',
      'indo-17',
      'hit-11',
      'indo-18',
      'hit-12',
      'indo-9',
      'hit-1'
    ]
  },
  {
    id: 'pl-international-hits',
    title: 'International Hits 2016-2026',
    description: 'The monumental anthems that defined the global airwaves and streaming eras.',
    cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&q=80',
    coverGradient: 'from-violet-900 via-indigo-950 to-slate-950',
    layout: 'list',
    category: 'hits',
    songIds: [
      'hit-6',
      'hit-7',
      'hit-8',
      'hit-9',
      'hit-10',
      'hit-11',
      'hit-12',
      'hit-1',
      'hit-2',
      'hit-3',
      'hit-4',
      'hit-5'
    ]
  },
  {
    id: 'pl-pop-indo',
    title: 'Pop Indo Pilihan',
    description: 'Koleksi suara emas Indonesia dengan penjiwaan mendalam dan melodi menyentuh kalbu.',
    cover: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=600&q=80',
    coverGradient: 'from-pink-900 via-purple-950 to-slate-950',
    layout: 'grid',
    category: 'indo',
    songIds: [
      'indo-15',
      'indo-16',
      'indo-17',
      'indo-18',
      'indo-1',
      'indo-2',
      'indo-3',
      'indo-4',
      'indo-5',
      'indo-6',
      'indo-7',
      'indo-8',
      'indo-9',
      'indo-10',
      'indo-11',
      'indo-12',
      'indo-13',
      'indo-14'
    ]
  },
  {
    id: 'pl-senja-indie',
    title: 'Indie & Pop Senja 2024-2026',
    description: 'Petikan akustik syahdu, lirik puitis, dan suara hati anak muda nusantara.',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    coverGradient: 'from-amber-900 via-rose-950 to-slate-950',
    layout: 'list',
    category: 'indo',
    songIds: ['indo-15', 'indo-18', 'indo-9', 'indo-10', 'indo-6', 'indo-7', 'indo-4', 'indo-11', 'indo-16']
  },
  {
    id: 'pl-lawas-oldies',
    title: 'Lawas (Indonesian Oldies)',
    description: 'Nostalgia abadi dari mahakarya para legenda musik tanah air era 80-90an.',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    coverGradient: 'from-amber-900 via-yellow-950 to-slate-950',
    layout: 'grid',
    category: 'lawas',
    songIds: ['lawas-1', 'lawas-2', 'lawas-3']
  },
  {
    id: 'pl-rock-legends',
    title: 'Rock Legends',
    description: 'Distorsi bertenaga, vokal menggelegar, dan solo gitar pembakar semangat selamanya.',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80',
    coverGradient: 'from-red-950 via-stone-900 to-slate-950',
    layout: 'grid',
    category: 'rock',
    songIds: ['rock-1', 'rock-2', 'rock-3']
  }
];

export const ARTISTS: Artist[] = [
  {
    id: 'art-the-weeknd',
    name: 'The Weeknd',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&q=80',
    avatarGradient: 'from-purple-600 to-indigo-900',
    bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer-songwriter known for his cinematic dark R&B, synth-pop mastery, and falsetto register.',
    monthlyListeners: '108,450,210',
    genre: 'R&B / Synthwave / Pop',
    topSongIds: ['hit-1']
  },
  {
    id: 'art-ed-sheeran',
    name: 'Ed Sheeran',
    avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&q=80',
    avatarGradient: 'from-blue-600 to-cyan-900',
    bio: 'English singer-songwriter recognized globally for heartfelt acoustic storytelling, record-breaking stadium tours, and chart-dominating pop hooks.',
    monthlyListeners: '84,120,500',
    genre: 'Pop / Acoustic',
    topSongIds: ['hit-2']
  },
  {
    id: 'art-harry-styles',
    name: 'Harry Styles',
    avatar: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=300&q=80',
    avatarGradient: 'from-rose-500 to-purple-900',
    bio: 'Grammy award-winning English artist known for blending 80s indie pop, classic rock aesthetics, and soaring melodic charm.',
    monthlyListeners: '62,930,000',
    genre: 'Pop Rock / Synth-Pop',
    topSongIds: ['hit-3']
  },
  {
    id: 'art-dua-lipa',
    name: 'Dua Lipa',
    avatar: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=300&q=80',
    avatarGradient: 'from-fuchsia-600 to-pink-900',
    bio: 'British pop icon who revitalized the modern dance-pop and nu-disco scene with infectious cosmic basslines and vocal brilliance.',
    monthlyListeners: '74,800,000',
    genre: 'Dance-Pop / Nu-Disco',
    topSongIds: ['hit-4']
  },
  {
    id: 'art-miley-cyrus',
    name: 'Miley Cyrus',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    avatarGradient: 'from-amber-500 to-red-900',
    bio: 'Versatile American singer, songwriter, and powerhouse vocalist bridging country, pop, rock, and modern disco.',
    monthlyListeners: '69,400,000',
    genre: 'Pop / Rock',
    topSongIds: ['hit-5']
  },
  {
    id: 'art-lady-gaga',
    name: 'Lady Gaga & Bruno Mars',
    avatar: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80',
    avatarGradient: 'from-blue-600 to-rose-900',
    bio: 'Kolaborasi bersejarah antara dua raksasa musik dunia yang memecahkan rekor streaming tercepat 1 miliar pendengar di Spotify Global.',
    monthlyListeners: '115,200,000',
    genre: 'Soul Pop / Soft Rock',
    topSongIds: ['hit-6']
  },
  {
    id: 'art-billie-eilish',
    name: 'Billie Eilish',
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
    avatarGradient: 'from-cyan-600 to-blue-950',
    bio: 'Penyanyi dan komposer peraih Oscar & Grammy yang merajai Spotify Chart nomor 1 di seluruh dunia lewat album HIT ME HARD AND SOFT.',
    monthlyListeners: '106,800,000',
    genre: 'Dream Pop / Alt-Pop',
    topSongIds: ['hit-7']
  },
  {
    id: 'art-sabrina-carpenter',
    name: 'Sabrina Carpenter',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
    avatarGradient: 'from-amber-500 to-orange-900',
    bio: 'Ikon pop global abad ini dengan lagu musim panas paling viral di Spotify "Espresso" dan album smash "Short n’ Sweet".',
    monthlyListeners: '92,400,000',
    genre: 'Nu-Disco / Pop',
    topSongIds: ['hit-8']
  },
  {
    id: 'art-rose',
    name: 'ROSÉ & Bruno Mars',
    avatar: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80',
    avatarGradient: 'from-pink-600 to-purple-950',
    bio: 'Duo sensasional yang meledakkan tangga lagu global dengan hit adiktif "APT." yang viral di seluruh media sosial dan playlist Spotify.',
    monthlyListeners: '89,500,000',
    genre: 'Pop Rock / New Wave',
    topSongIds: ['hit-9']
  },
  {
    id: 'art-benson-boone',
    name: 'Benson Boone',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    avatarGradient: 'from-indigo-600 to-violet-950',
    bio: 'Bintang pop rock muda asal Amerika dengan vokal bertenaga tinggi yang menduduki Top 5 Spotify Global lewat lagu emosional "Beautiful Things".',
    monthlyListeners: '61,300,000',
    genre: 'Pop Rock / Alt-Pop',
    topSongIds: ['hit-10']
  },
  {
    id: 'art-hozier',
    name: 'Hozier',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
    avatarGradient: 'from-stone-600 to-amber-950',
    bio: 'Musisi asal Irlandia dengan kedalaman vokal blues dan lirik puitis yang merebut puncak Billboard & Spotify Global dengan single "Too Sweet".',
    monthlyListeners: '57,200,000',
    genre: 'Indie Soul / Blues',
    topSongIds: ['hit-11']
  },
  {
    id: 'art-chappell-roan',
    name: 'Chappell Roan',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80',
    avatarGradient: 'from-fuchsia-600 to-red-950',
    bio: 'Fenomena musik pop theatrical baru dengan vokal spektakuler dan melodi synth-pop 80s yang viral di seluruh festival dunia.',
    monthlyListeners: '48,900,000',
    genre: 'Synth-Pop',
    topSongIds: ['hit-12']
  },
  {
    id: 'art-maliq',
    name: "MALIQ & D'Essentials",
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
    avatarGradient: 'from-amber-600 to-pink-900',
    bio: 'Grup musik soul pop legendaris Indonesia yang kembali meledak merajai Top Spotify Indonesia lewat anthem romantis "Kita Bikin Romantis".',
    monthlyListeners: '8,400,000',
    genre: 'Soul Pop / Nu-Jazz',
    topSongIds: ['indo-16']
  },
  {
    id: 'art-salma-salsabil',
    name: 'Salma Salsabil',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    avatarGradient: 'from-rose-600 to-purple-950',
    bio: 'Juara Indonesian Idol yang mencetak rekor viral Spotify Indonesia dengan karakter vokal groovy jazz pop khas pada lagu "Bunga Hati".',
    monthlyListeners: '6,500,000',
    genre: 'Groovy Pop / Jazz',
    topSongIds: ['indo-17']
  },
  {
    id: 'art-mahalini',
    name: 'Mahalini',
    avatar: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=300&q=80',
    avatarGradient: 'from-rose-600 to-purple-900',
    bio: 'Penyanyi dan penulis lagu asal Bali dengan kekuatan vokal emosional yang telah mendominasi tangga lagu pop Indonesia dengan lagu-lagu patah hati legendaris.',
    monthlyListeners: '11,200,000',
    genre: 'Pop Indo / Ballad',
    topSongIds: ['indo-1', 'indo-3']
  },
  {
    id: 'art-tulus',
    name: 'Tulus',
    avatar: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80',
    avatarGradient: 'from-emerald-600 to-teal-900',
    bio: 'Solois pria legendaris Indonesia dengan lirik puitis berbahasa Indonesia yang mendalam, aransemen berkelas, dan kehangatan suara khas.',
    monthlyListeners: '9,800,000',
    genre: 'Pop / Soul / Jazz',
    topSongIds: ['indo-2']
  },
  {
    id: 'art-raim-laode',
    name: 'Raim Laode',
    avatar: 'https://images.unsplash.com/photo-1520627747805-4081c7e2bd78?w=300&q=80',
    avatarGradient: 'from-yellow-600 to-amber-900',
    bio: 'Komika dan musisi asal Wakatobi yang menyentuh hati jutaan pendengar melalui nada akustik tulus dan lirik penuh cinta sederhana.',
    monthlyListeners: '4,500,000',
    genre: 'Indie Folk / Pop',
    topSongIds: ['indo-4']
  },
  {
    id: 'art-bernadya',
    name: 'Bernadya',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    avatarGradient: 'from-violet-600 to-indigo-900',
    bio: 'Penyanyi dan penulis lagu generasi baru yang memikat jutaan pendengar dengan lirik jujur, melankolia personal, dan aransemen minimalis yang mendalam.',
    monthlyListeners: '14,800,000',
    genre: 'Indie Pop / Sadcore',
    topSongIds: ['indo-9']
  },
  {
    id: 'art-sal-priadi',
    name: 'Sal Priadi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    avatarGradient: 'from-amber-600 to-orange-950',
    bio: 'Seniman musik dan aktor dengan gaya tutur puitis teatrikal yang membawakan lagu-lagu penuh kehangatan, kerinduan, dan keindahan cinta manusia.',
    monthlyListeners: '8,900,000',
    genre: 'Pop Puisi / Ballad',
    topSongIds: ['indo-10']
  },
  {
    id: 'art-nadin-amizah',
    name: 'Nadin Amizah',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
    avatarGradient: 'from-emerald-600 to-teal-950',
    bio: 'Penyanyi folk-pop indie dengan vokal unik dan diksi puitis Indonesia yang khas, menghidupkan kisah kerapuhan manusia dengan elok.',
    monthlyListeners: '7,400,000',
    genre: 'Indie Folk / Pop',
    topSongIds: ['indo-6']
  },
  {
    id: 'art-ghea-indrawari',
    name: 'Ghea Indrawari',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
    avatarGradient: 'from-teal-600 to-cyan-950',
    bio: 'Solois dengan suara bening menenangkan yang merilis lagu-lagu penyembuh luka batin dan penyemangat kehidupan.',
    monthlyListeners: '6,200,000',
    genre: 'Pop Akustik / Healing',
    topSongIds: ['indo-7']
  },
  {
    id: 'art-anggi-marito',
    name: 'Anggi Marito',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    avatarGradient: 'from-rose-600 to-pink-900',
    bio: 'Vokalis bertalenta besar jebolan ajang pencarian bakat dengan jangkauan vokal spektakuler dan penghayatan balada mendalam.',
    monthlyListeners: '5,800,000',
    genre: 'Pop Indo / Ballad',
    topSongIds: ['indo-5']
  },
  {
    id: 'art-yura-yunita',
    name: 'Yura Yunita',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    avatarGradient: 'from-orange-600 to-red-900',
    bio: 'Diva pop soul kontemporer Indonesia yang menginspirasi pendengar dengan pesan penerimaan diri dan energi panggung magis.',
    monthlyListeners: '6,700,000',
    genre: 'Soul Pop / Jazz',
    topSongIds: ['indo-11']
  },
  {
    id: 'art-lyodra',
    name: 'Lyodra',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
    avatarGradient: 'from-purple-600 to-rose-950',
    bio: 'Pemenang Indonesian Idol termuda dengan teknik vokal whistle register dan kekuatan dinamika megah yang diakui secara global.',
    monthlyListeners: '8,100,000',
    genre: 'Pop / Ballad',
    topSongIds: ['indo-12']
  },
  {
    id: 'art-rizky-febian',
    name: 'Rizky Febian',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
    avatarGradient: 'from-cyan-600 to-blue-900',
    bio: 'Penyanyi dan komposer muda dengan sentuhan groove R&B dan melodi romantis yang konsisten menduduki peringkat teratas tangga lagu.',
    monthlyListeners: '7,900,000',
    genre: 'R&B / Pop',
    topSongIds: ['indo-13']
  },
  {
    id: 'art-iwan-fals',
    name: 'Iwan Fals',
    avatar: 'https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?w=300&q=80',
    avatarGradient: 'from-orange-700 to-red-950',
    bio: 'Pahlawan musik rakyat Indonesia, komposer balada legendaris yang menyuarakan realitas sosial, perdamaian, dan cinta sejati sepanjang masa.',
    monthlyListeners: '2,900,000',
    genre: 'Classic Folk / Rock',
    topSongIds: ['lawas-1']
  },
  {
    id: 'art-chrisye',
    name: 'Chrisye',
    avatar: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=300&q=80',
    avatarGradient: 'from-indigo-600 to-blue-950',
    bio: 'Sang legenda musik pop Indonesia abadi dengan karakter vokal halus sutra nan magis yang mendefinisikan musik tanah air selama empat dekade.',
    monthlyListeners: '3,800,000',
    genre: 'Nostalgia Pop / Progressive Pop',
    topSongIds: ['lawas-2']
  },
  {
    id: 'art-nike-ardilla',
    name: 'Nike Ardilla',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80',
    avatarGradient: 'from-purple-600 to-rose-950',
    bio: 'Lady Rocker legendaris Indonesia yang abadi dalam kenangan dengan puluhan lagu hits fenomenal dan pengaruh budaya tak tergantikan.',
    monthlyListeners: '2,100,000',
    genre: 'Slow Rock / Pop',
    topSongIds: ['lawas-3']
  },
  {
    id: 'art-queen',
    name: 'Queen',
    avatar: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&q=80',
    avatarGradient: 'from-amber-600 to-red-950',
    bio: 'Iconic British rock band fronted by Freddie Mercury, celebrated for operatic scale, stadium harmonies, and genre-defying rock masterworks.',
    monthlyListeners: '51,400,000',
    genre: 'Classic Rock / Glam Rock',
    topSongIds: ['rock-1']
  },
  {
    id: 'art-nirvana',
    name: 'Nirvana',
    avatar: 'https://images.unsplash.com/photo-1516280440502-8636b0439626?w=300&q=80',
    avatarGradient: 'from-cyan-700 to-slate-900',
    bio: 'The defining voice of 90s grunge, Kurt Cobain and Nirvana altered the trajectory of modern rock music with raw emotion and distorted power.',
    monthlyListeners: '32,100,000',
    genre: 'Grunge / Alternative',
    topSongIds: ['rock-2']
  },
  {
    id: 'art-guns-n-roses',
    name: "Guns N' Roses",
    avatar: 'https://images.unsplash.com/photo-1543332143-4e8c27e3256f?w=300&q=80',
    avatarGradient: 'from-red-600 to-orange-950',
    bio: 'Hard rock titans from Los Angeles renowned for Slash’s searing guitar solos and Axl Rose’s unmatched vocal velocity.',
    monthlyListeners: '28,900,000',
    genre: 'Hard Rock',
    topSongIds: ['rock-3']
  }
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'rad-nebula',
    name: 'Nebula Top 40',
    tagline: 'Global Cosmic Hits',
    description: 'Non-stop chart toppers and electro-pop anthems from around the universe.',
    coverGradient: 'from-purple-600 via-indigo-700 to-blue-900',
    currentSongId: 'hit-1',
    listeners: '42.8k listening'
  },
  {
    id: 'rad-senja',
    name: 'Indo Senja Akustik',
    tagline: 'Ketenangan Melodi Nusantara',
    description: 'Petikan senar lembut dan vokal syahdu menemani langit senja temaram.',
    coverGradient: 'from-rose-600 via-amber-600 to-purple-900',
    currentSongId: 'indo-2',
    listeners: '31.2k listening'
  },
  {
    id: 'rad-nostalgia',
    name: 'Nusantara 80-90s',
    tagline: 'Kenangan Abadi Mengudara',
    description: 'Lagu-lagu legendaris Chrisye, Iwan Fals, dan Nike Ardilla setiap saat.',
    coverGradient: 'from-amber-600 via-orange-800 to-red-950',
    currentSongId: 'lawas-1',
    listeners: '19.5k listening'
  },
  {
    id: 'rad-rock',
    name: 'Stardust Rock Radio',
    tagline: 'High Voltage Cosmic Energy',
    description: 'Stadium riffs and power chords echoing across constellations.',
    coverGradient: 'from-red-600 via-stone-800 to-slate-950',
    currentSongId: 'rock-1',
    listeners: '25.7k listening'
  }
];
