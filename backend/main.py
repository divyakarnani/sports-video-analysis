import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analyze import router as analyze_router
from routes.health import router as health_router
from routes.reference import router as reference_router

load_dotenv()

app = FastAPI(title="FormCheck API", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(reference_router)


@app.get("/debug/videos")
def debug_videos():
    from pathlib import Path
    base = Path(__file__).resolve().parent
    ref_dir = base / "reference_videos"
    files = []
    for root, dirs, filenames in os.walk(base):
        for f in filenames:
            files.append(os.path.relpath(os.path.join(root, f), base))
    return {
        "cwd": os.getcwd(),
        "base": str(base),
        "ref_dir": str(ref_dir),
        "ref_dir_exists": ref_dir.is_dir(),
        "all_files": sorted(files),
    }
