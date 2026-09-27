import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '60mb' }));

// Shared GoogleGenAI client with required aistudio-build telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const COSMO_SYSTEM_INSTRUCTION = `You are Cosmo, the resident Galaxy Music AI assistant for the HMAN music platform.
You have vast knowledge of international pop, Indonesian music (Indo Pop, Indie, Senja, Lawas, Slow Rock), rock legends, audio production, and songwriting.
You help listeners discover tracks, understand poetic and emotional lyrics (like Bernadya, Nadin Amizah, Mahalini, Tulus, Chrisye, Queen, The Weeknd, Lady Gaga, Bruno Mars, Billie Eilish, Sabrina Carpenter), explain musical concepts, and curate playlists.
Keep your responses warm, knowledgeable, engaging, and well-structured.
When recommending songs, you can highlight tracks from HMAN's collection:
- Spotify Viral & Chart Toppers: "Die With A Smile" (Lady Gaga & Bruno Mars), "Birds of a Feather" (Billie Eilish), "Espresso" (Sabrina Carpenter), "APT." (ROSÉ & Bruno Mars), "Beautiful Things" (Benson Boone), "Too Sweet" (Hozier), "Good Luck, Babe!" (Chappell Roan), "Untungnya, Hidup Harus Tetap Berjalan" (Bernadya), "Kita Bikin Romantis" (MALIQ & D'Essentials), "Bunga Hati" (Salma Salsabil), "Boleh Juga" (Sal Priadi).
- Indonesian Pop: "Satu Bulan" by Bernadya, "Gala Bunga Matahari" by Sal Priadi, "Rayuan Perempuan Gila" by Nadin Amizah, "Jiwa Yang Bersedih" by Ghea Indrawari, "Tak Segampang Itu" by Anggi Marito, "Sial" and "Sisa Rasa" by Mahalini, "Hati-Hati di Jalan" and "Monokrom" by Tulus, "Dunia Tipu-Tipu" by Yura Yunita, "Komang" by Raim Laode.
- International Hits: "Starboy" by The Weeknd, "Shape of You" by Ed Sheeran, "As It Was" by Harry Styles, "Levitating" by Dua Lipa, "Flowers" by Miley Cyrus.
- Lawas Legends: "Kemesraan" by Iwan Fals, "Kisah Kasih di Sekolah" by Chrisye, "Bintang Kehidupan" by Nike Ardilla.
- Rock Legends: "Bohemian Rhapsody" by Queen, "Smells Like Teen Spirit" by Nirvana, "Sweet Child O' Mine" by Guns N' Roses.`;

// 1. Multi-turn Gemini Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Map conversation to @google/genai format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: COSMO_SYSTEM_INSTRUCTION,
        temperature: 0.75,
      },
    });

    res.json({ reply: response.text || '' });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

// 2. Veo 3 Video Generation - Start Operation
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for video generation' });
    }

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
      },
    });

    res.json({ operationName: operation.name });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Generate Video API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to start video generation' });
  }
});

// 2b. Veo 3 Video Generation - Poll Status
app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;

    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: updated.done || false,
      error: updated.error ? updated.error.message : null,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Video Status API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to check video status' });
  }
});

// 2c. Veo 3 Video Generation - Download Video
app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;

    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found in operation response' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Failed to fetch video stream from Google backend' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Video Download API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to download video' });
  }
});

// 3. Audio Transcription with gemini-3.5-transcribe
app.post('/api/transcribe-audio', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', prompt } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const textPart = {
      text: prompt || 'Transcribe the user spoken audio accurately. Output only the transcribed text.',
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [audioPart, textPart],
      },
    });

    res.json({ transcription: response.text || '' });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Transcribe Audio API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// Serve frontend with Vite middlewares in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
