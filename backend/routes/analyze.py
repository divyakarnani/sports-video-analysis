import json
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from services.frame_extractor import extract_frames
from services.openai_client import run_analysis
from services.pose_estimator import process_all_pairs

router = APIRouter()

_BASE = Path(__file__).resolve().parent.parent
REFERENCE_DIR = _BASE / "reference_videos" if (_BASE / "reference_videos").is_dir() else _BASE / "backend" / "reference_videos"


def _find_video(directory: Path, name: str) -> bytes | None:
    """Try to find a video file with the given name in the directory."""
    for ext in (".mp4", ".mov", ".webm"):
        path = directory / f"{name}{ext}"
        if path.exists():
            return path.read_bytes()
    return None


def _load_reference_video(
    sport: str, shot_type: str, pro_id: str = "", camera_angle: str = "", variant: str = ""
) -> bytes:
    """Load reference video bytes. Tries multiple lookup strategies:
    1. Angle-aware pro path: {sport}/{shot_type}/{angle}/{pro_id}
    2. Angle-aware variant path: {sport}/{shot_type}/{angle}/{variant}
    3. Flat variant path: {sport}/{shot_type}/{variant}
    4. Flat pro path: {sport}/{shot_type}/{pro_id}
    5. Flat shot_type reference: {sport}/{shot_type}/reference
    6. Legacy flat: {pro_id}
    """
    nested_dir = REFERENCE_DIR / sport / shot_type

    # 1. Angle-aware pro path
    if pro_id and camera_angle:
        result = _find_video(nested_dir / camera_angle, pro_id)
        if result:
            return result

    # 2. Angle-aware variant path (for dance/skating with front angle)
    if variant and camera_angle:
        result = _find_video(nested_dir / camera_angle, variant)
        if result:
            return result

    # 3. Flat variant path: {sport}/{shot_type}/{variant}
    if variant:
        result = _find_video(nested_dir, variant)
        if result:
            return result

    # 4. Flat pro path: {sport}/{shot_type}/{pro_id}
    if pro_id:
        result = _find_video(nested_dir, pro_id)
        if result:
            return result

    # 5. Flat reference: {sport}/{shot_type}/reference
    result = _find_video(nested_dir, "reference")
    if result:
        return result

    # 6. Legacy flat: {pro_id}
    if pro_id:
        result = _find_video(REFERENCE_DIR, pro_id)
        if result:
            return result

    identifier = pro_id or variant or shot_type
    raise FileNotFoundError(
        f"No reference video found for '{identifier}' (sport={sport}, shot_type={shot_type}, "
        f"angle={camera_angle}, variant={variant}) in {REFERENCE_DIR}"
    )


def _build_angle_summary(all_pose_pairs: list[dict]) -> str:
    """Build a text summary of angle differences across all frame pairs for GPT."""
    if not all_pose_pairs:
        return ""

    lines = ["=== POSE ANGLE ANALYSIS ==="]
    for pair in all_pose_pairs:
        lines.append(f"\nFrame pair {pair['index'] + 1} (user @{pair['user_timestamp']}s / pro @{pair['pro_timestamp']}s):")
        for ja in pair["joint_angles"]:
            lines.append(
                f"  {ja['joint']}: user={ja['user_angle']}° pro={ja['pro_angle']}° "
                f"diff={ja['diff']}° [{ja['status'].upper()}]"
            )
    return "\n".join(lines)


@router.post("/analyze")
async def analyze(
    video: UploadFile = File(...),
    sport: str = Form(...),
    shot_type: str = Form(...),
    pro_id: str = Form(""),
    camera_angle: str = Form(""),
    variant: str = Form(""),
):
    # Read video bytes eagerly — the UploadFile gets closed before a lazy generator runs
    video_bytes = await video.read()

    # Load reference video
    try:
        ref_video_bytes = _load_reference_video(sport, shot_type, pro_id, camera_angle, variant)
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))

    async def event_stream():
        # 1. Extract user frames
        yield f"data: {json.dumps({'status': 'extracting_frames'})}\n\n"
        user_frames = extract_frames(video_bytes, fps=2.0, max_frames=15)
        yield f"data: {json.dumps({'status': 'user_frames_extracted', 'count': len(user_frames)})}\n\n"

        # 2. Extract reference frames
        yield f"data: {json.dumps({'status': 'extracting_pro_frames'})}\n\n"
        ref_frames = extract_frames(ref_video_bytes, fps=2.0, max_frames=10)
        yield f"data: {json.dumps({'status': 'pro_frames_extracted', 'count': len(ref_frames)})}\n\n"

        # 3. Estimate poses and stream annotated frame pairs
        yield f"data: {json.dumps({'status': 'estimating_poses'})}\n\n"

        all_pose_pairs = []
        for pair_data in process_all_pairs(user_frames, ref_frames):
            all_pose_pairs.append(pair_data)
            yield f"data: {json.dumps({'status': 'pose_frame', 'pair': pair_data})}\n\n"

        yield f"data: {json.dumps({'status': 'poses_complete', 'count': len(all_pose_pairs)})}\n\n"

        # 4. Run analysis
        angle_summary = _build_angle_summary(all_pose_pairs) if all_pose_pairs else ""
        yield f"data: {json.dumps({'status': 'analyzing', 'user_frames': len(user_frames), 'pro_frames': len(ref_frames)})}\n\n"
        result = await run_analysis(
            user_frames, ref_frames, sport, shot_type, pro_id,
            angle_summary=angle_summary, camera_angle=camera_angle,
        )

        # 5. Done
        yield f"data: {json.dumps({'status': 'done', 'result': result})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
