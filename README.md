# FormCheck

AI-powered sports form analyzer that compares your technique against professional athletes using computer vision and LLM analysis.

## How It Works

1. **Select** your sport, shot type, and a pro athlete to compare against
2. **Upload** a video of yourself performing the movement
3. **Watch** real-time analysis as the system extracts frames, estimates poses, and aligns your motion to the pro's using Dynamic Time Warping
4. **Review** personalized scores, feedback, annotated pose frames, and drill recommendations

## Features

- **5-step wizard** — sport → shot type → variant → camera angle → pro athlete
- **3 sports supported** — tennis (forehand, backhand, serve, volley, return), figure skating (jumps, spins, footwork, spirals), and dance (turns, leaps, extensions, floor work, partnering)
- **Pose estimation** — MediaPipe landmark detection with DTW-based temporal alignment across user and pro frames
- **Joint angle analysis** — 8 joint angles compared with threshold-based status (good / warning / poor)
- **Ghost overlay visualization** — both skeletons rendered on a single frame, pro re-centered to user's hip midpoint
- **Side-by-side frame viewer** — synchronized annotated frames with color-coded joints
- **Streaming SSE progress** — real-time status updates and pose frames streamed as they're computed
- **GPT-powered feedback** — structured scores, strengths, areas for improvement, and recommended drills with optional timestamps
- **Sport-specific prompts** — tailored analysis dimensions and key concepts per shot type and camera angle

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, TypeScript |
| Backend | FastAPI, Uvicorn |
| AI / Vision | OpenAI GPT, MediaPipe Pose Landmarker, OpenCV |
| Alignment | Dynamic Time Warping on hip-centered, torso-normalized pose vectors |

## Project Structure

```
sports-video-analysis/
├── backend/
│   ├── main.py                 # FastAPI app + CORS setup
│   ├── models.py               # Pydantic data models
│   ├── routes/
│   │   ├── analyze.py          # POST /analyze (SSE streaming)
│   │   ├── health.py           # GET /health
│   │   └── reference.py        # GET /reference-video/{...}
│   ├── services/
│   │   ├── frame_extractor.py  # Video → base64 frames at 2 FPS
│   │   ├── openai_client.py    # GPT analysis with structured output
│   │   ├── pose_drawing.py     # Skeleton rendering + ghost overlay
│   │   ├── pose_estimator.py   # MediaPipe + DTW alignment
│   │   └── prompts.py          # Sport/shot-specific prompt contexts
│   ├── reference_videos/       # Pro athlete reference clips (gitignored)
│   └── models/                 # MediaPipe model files (gitignored)
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Wizard home page
│   │   └── analyze/page.tsx    # Upload → Confirm → Analyze → Results
│   ├── components/
│   │   ├── wizard/             # Sport, Category, Variant, Camera, Pro steps
│   │   ├── analyze/            # Upload, Confirm, Analyzing, Results phases
│   │   ├── AnalysisResults.tsx  # Scores, frame player, timeline, feedback
│   │   ├── FramePlayer.tsx     # Pose frame pair viewer
│   │   ├── SideBySidePlayer.tsx # Synced video player with speed controls
│   │   └── ...
│   └── lib/
│       ├── api.ts              # SSE streaming client
│       ├── types.ts            # TypeScript type definitions
│       ├── pros.ts             # Pro athlete data
│       ├── shotTypes.ts        # Shot type definitions + dimensions
│       └── cameraAngles.ts     # Camera angle metadata
└── .gitignore
```

## Local Development

### Prerequisites

- Python 3.10+
- Node.js 18+
- An OpenAI API key

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=http://localhost:3000
```

Download the [MediaPipe Pose Landmarker model](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker#models) (`pose_landmarker_heavy.task`) and place it in `backend/models/`.

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Backend service | OpenAI API key for GPT analysis |
| `ALLOWED_ORIGINS` | Backend service | Comma-separated CORS origins (frontend URL) |
| `MAX_VIDEO_SIZE_MB` | Backend service | Max upload size in MB (default 100) |
| `NEXT_PUBLIC_API_URL` | Frontend service | Backend API base URL (baked in at build time) |
