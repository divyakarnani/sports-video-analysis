import cv2
import base64
import tempfile
from pathlib import Path


def extract_frames(video_bytes: bytes, fps: float = 2.0, max_frames: int = 25) -> list[dict]:
    """
    Returns list of { "timestamp": float, "b64": str } dicts.
    Writes video bytes to a temp file because cv2.VideoCapture needs a path.
    """
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
        f.write(video_bytes)
        tmp_path = f.name

    cap = cv2.VideoCapture(tmp_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    if video_fps <= 0:
        cap.release()
        Path(tmp_path).unlink(missing_ok=True)
        raise ValueError("Could not read video FPS. Is this a valid video file?")

    frame_interval = max(1, int(video_fps / fps))

    frames = []
    frame_idx = 0

    while cap.isOpened() and len(frames) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % frame_interval == 0:
            # Resize to 512x512 (pad to square, don't stretch)
            h, w = frame.shape[:2]
            size = max(h, w)
            padded = cv2.copyMakeBorder(
                frame,
                (size - h) // 2, (size - h + 1) // 2,
                (size - w) // 2, (size - w + 1) // 2,
                cv2.BORDER_CONSTANT, value=[0, 0, 0],
            )
            resized = cv2.resize(padded, (512, 512))
            _, buf = cv2.imencode(".jpg", resized, [cv2.IMWRITE_JPEG_QUALITY, 85])
            b64 = base64.b64encode(buf).decode("utf-8")
            timestamp = frame_idx / video_fps
            frames.append({"timestamp": round(timestamp, 2), "b64": b64})
        frame_idx += 1

    cap.release()
    Path(tmp_path).unlink(missing_ok=True)
    return frames
