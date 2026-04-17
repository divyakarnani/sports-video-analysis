from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()

REFERENCE_DIR = Path(__file__).resolve().parent.parent / "reference_videos"

MIME_TYPES = {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
}


def _find_video(directory: Path, name: str) -> tuple[Path, str] | None:
    """Try to find a video file with the given name in the directory."""
    for ext, mime in MIME_TYPES.items():
        path = directory / f"{name}{ext}"
        if path.exists():
            return path, mime
    return None


@router.get("/reference-availability")
async def reference_availability():
    """Return a nested dict of all available reference videos."""
    tree: dict = {}
    for path in REFERENCE_DIR.rglob("*"):
        if path.suffix.lower() not in MIME_TYPES or not path.is_file():
            continue
        parts = path.relative_to(REFERENCE_DIR).parts  # (sport, shot_type, angle, file)
        if len(parts) != 4:
            continue
        sport, shot_type, angle, filename = parts
        video_id = path.stem
        tree.setdefault(sport, {}).setdefault(shot_type, {}).setdefault(angle, []).append(video_id)
    return tree


@router.get("/reference-video/{sport}/{shot_type}/{angle}/{video_id}")
async def get_reference_video(sport: str, shot_type: str, angle: str, video_id: str):
    """Serve a reference video file.

    For tennis: video_id is a pro_id (e.g. 'swiatek')
    For dance/skating: video_id is a variant (e.g. 'pirouette') or 'reference'
    """
    nested_dir = REFERENCE_DIR / sport / shot_type

    # 1. Angle-aware: {sport}/{shot_type}/{angle}/{video_id}
    result = _find_video(nested_dir / angle, video_id)
    if result:
        return FileResponse(result[0], media_type=result[1])

    # 2. Flat: {sport}/{shot_type}/{video_id}
    result = _find_video(nested_dir, video_id)
    if result:
        return FileResponse(result[0], media_type=result[1])

    # 3. Generic reference: {sport}/{shot_type}/reference
    result = _find_video(nested_dir, "reference")
    if result:
        return FileResponse(result[0], media_type=result[1])

    raise HTTPException(
        status_code=404,
        detail=f"No reference video found for '{video_id}' (sport={sport}, shot_type={shot_type}, angle={angle})",
    )
