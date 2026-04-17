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

## Deploy to Railway

Railway runs both services as Docker containers in a single project. You'll create two services that talk to each other via Railway's internal networking.

### Prerequisites

- A [Railway](https://railway.app) account (free tier works to start)
- The [Railway CLI](https://docs.railway.app/guides/cli) installed: `npm i -g @railway/cli`
- This repo pushed to GitHub

### Step 1: Create the project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **Deploy from GitHub repo**
3. Select `divyakarnani/sports-video-analysis`
4. Railway will detect the repo — **don't deploy yet**, cancel the auto-created service (we need two separate services with different root directories)

### Step 2: Create the backend service

1. In your Railway project, click **New** → **GitHub Repo** → select `sports-video-analysis`
2. Click the new service to open its settings
3. Go to **Settings**:
   - **Root Directory**: `backend`
   - **Builder**: Dockerfile (it will auto-detect `backend/Dockerfile`)
   - **Port**: `8000`
4. Go to **Variables** and add:
   ```
   OPENAI_API_KEY=sk-...
   ALLOWED_ORIGINS=https://<your-frontend-domain>.up.railway.app
   MAX_VIDEO_SIZE_MB=100
   ```
5. Go to **Settings** → **Networking** → **Generate Domain** to get a public URL (e.g. `formcheck-backend-production.up.railway.app`)

> **Note on reference videos:** The reference `.mp4` files are gitignored. You'll need to either:
> - Add them to the Docker image by removing the gitignore exclusion, or
> - Upload them to a cloud bucket (S3/R2) and update the reference route to fetch from there

> **Note on MediaPipe model:** Download `pose_landmarker_heavy.task` and place it in `backend/models/` before deploying. Either commit the model file or add a download step to the Dockerfile.

### Step 3: Create the frontend service

1. In the same project, click **New** → **GitHub Repo** → select `sports-video-analysis` again
2. Click the new service to open its settings
3. Go to **Settings**:
   - **Root Directory**: `frontend`
   - **Builder**: Dockerfile (it will auto-detect `frontend/Dockerfile`)
   - **Port**: `3000`
4. Go to **Variables** and add:
   ```
   NEXT_PUBLIC_API_URL=https://<your-backend-domain>.up.railway.app
   ```
   > `NEXT_PUBLIC_*` vars are baked in at build time. Railway passes them as Docker build args automatically.
5. Go to **Settings** → **Networking** → **Generate Domain** to get a public URL

### Step 4: Wire them together

1. Copy the **backend** service's public domain (from Step 2.5)
2. Paste it as the frontend's `NEXT_PUBLIC_API_URL` variable (from Step 3.4)
3. Copy the **frontend** service's public domain (from Step 3.5)
4. Paste it into the backend's `ALLOWED_ORIGINS` variable (from Step 2.4)
5. Both services will automatically redeploy when variables change

### Step 5: Verify

- Visit your frontend URL — the wizard should load
- Check the backend health endpoint: `https://<backend-domain>.up.railway.app/health`
- Upload a test video and confirm the SSE stream works end-to-end

### Redeployments

Railway auto-deploys on every push to `main`. You can also trigger manual deploys from the dashboard or CLI:

```bash
railway login
railway link    # link to your project
railway up      # deploy current directory
```

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Backend service | OpenAI API key for GPT analysis |
| `ALLOWED_ORIGINS` | Backend service | Comma-separated CORS origins (frontend URL) |
| `MAX_VIDEO_SIZE_MB` | Backend service | Max upload size in MB (default 100) |
| `NEXT_PUBLIC_API_URL` | Frontend service | Backend API base URL (baked in at build time) |
