import json
import os

from openai import AsyncOpenAI

from services.prompts import PRO_NAMES, build_system_prompt, build_user_message

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "").strip())
    return _client


async def run_analysis(
    user_frames: list[dict],
    pro_frames: list[dict],
    sport: str,
    shot_type: str,
    pro_id: str,
    angle_summary: str = "",
    camera_angle: str = "",
) -> dict:
    pro_name = PRO_NAMES.get(pro_id, pro_id) if pro_id else ""
    system_prompt = build_system_prompt(sport, shot_type, camera_angle=camera_angle)
    user_content = build_user_message(user_frames, pro_frames, pro_name, sport, shot_type, angle_summary=angle_summary, camera_angle=camera_angle)

    response = await _get_client().chat.completions.create(
        model="gpt-5.4",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        max_completion_tokens=1500,
    )

    raw = response.choices[0].message.content
    result = json.loads(raw)

    # Snap timestamps to nearest actual user frame timestamp
    frame_timestamps = [f["timestamp"] for f in user_frames]
    for section in ("good", "needs_work"):
        for item in result.get(section, []):
            if "timestamp" in item and item["timestamp"]:
                item["timestamp"] = _snap_timestamp(item["timestamp"], frame_timestamps)

    return result


def _snap_timestamp(ts_str: str, frame_timestamps: list[float]) -> str:
    """Convert a timestamp string like '0:04' to the nearest actual frame timestamp."""
    try:
        parts = ts_str.replace("s", "").split(":")
        if len(parts) == 2:
            seconds = int(parts[0]) * 60 + float(parts[1])
        else:
            seconds = float(parts[0])
    except (ValueError, IndexError):
        return ts_str

    nearest = min(frame_timestamps, key=lambda t: abs(t - seconds))
    mins = int(nearest) // 60
    secs = nearest % 60
    if mins > 0:
        return f"{mins}:{secs:04.1f}"
    return f"0:{secs:04.1f}"
