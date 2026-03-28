# 🎬 Clipy — Smart Video Toolkit

> Clip any video from the web, extract audio, transcribe in 50+ languages, and get AI-powered summaries — all in one tool.

**Live Demo:** [clipper-mauve.vercel.app](https://clipper-mauve.vercel.app)

---

## ✨ Features

- 🌐 **Universal** — Works with YouTube, Twitter/X, Instagram, TikTok, Vimeo, and 1000+ sites
- ✂️ **Precise Clipping** — Clip any video to the exact timestamps you want
- 🎵 **Audio Extraction** — Export as MP3 for podcasts, music, or voice memos
- 🎙️ **AI Transcription** — Powered by AssemblyAI, supports 50+ languages with auto-detection
- 🤖 **AI Summary** — Get bullet-point summaries powered by Groq's LLaMA model
- 🗑️ **Auto Cleanup** — Files are automatically deleted from the server after 10 minutes

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Vercel** — Deployment

### Backend
- **Go** — High performance HTTP server
- **yt-dlp** — Universal video downloader
- **ffmpeg** — Video/audio processing
- **AssemblyAI** — AI transcription
- **Groq** — AI summarization (LLaMA 3.3)
- **Railway** — Deployment with Docker

---

## 🏗️ Architecture

```
User → Next.js Frontend (Vercel)
              ↓
       Go Backend (Railway)
              ↓
    ┌─────────────────────┐
    │  yt-dlp (download)  │
    │  ffmpeg (clip/audio)│
    │  AssemblyAI (STT)   │
    │  Groq LLaMA (summary│
    └─────────────────────┘
```

---

## 🚀 Running Locally

### Prerequisites
- Go 1.25+
- Node.js 18+
- `yt-dlp` installed
- `ffmpeg` installed

### Backend
```bash
cd backend
cp .env.example .env  # add your API keys
go run .
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend `.env`:**
```
ASSEMBLYAI_API_KEY=your_key
GROQ_KEY=your_key
BASE_URL=http://localhost:8000
PORT=8000
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
clipper/
├── backend/
│   ├── main.go          # Server setup, routes, CORS
│   ├── clip.go          # Core video processing logic
│   ├── transcribe.go    # AssemblyAI integration
│   ├── summarize.go     # Groq LLaMA integration
│   └── Dockerfile       # Docker config with ffmpeg + yt-dlp
└── frontend/
    ├── app/
    │   ├── page.tsx     # Landing page
    │   └── tool/
    │       └── page.tsx # Main tool page
    └── components/      # UI components
```

---

## 🎯 How It Works

1. User pastes any video URL
2. Backend downloads it using `yt-dlp`
3. `ffmpeg` clips it to the requested timestamps
4. If audio requested → `ffmpeg` extracts MP3
5. If transcript requested → file uploaded to AssemblyAI
6. If summary requested → transcript sent to Groq LLaMA
7. Files auto-deleted after 10 minutes
8. Results returned with download links

---



Built by **Suryansh Singh** — [GitHub](https://github.com/Suryansh-singh-137)
