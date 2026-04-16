import base64
import math
from pathlib import Path

import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import (
    PoseLandmarker,
    PoseLandmarkerOptions,
    RunningMode,
)

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "pose_landmarker_heavy.task"

_landmarker: PoseLandmarker | None = None


def _get_landmarker() -> PoseLandmarker:
    """Lazy-init the MediaPipe PoseLandmarker (heavy model, IMAGE mode)."""
    global _landmarker
    if _landmarker is None:
        options = PoseLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=str(MODEL_PATH)),
            running_mode=RunningMode.IMAGE,
            num_poses=1,
        )
        _landmarker = PoseLandmarker.create_from_options(options)
    return _landmarker


def detect_landmarks(frame_b64: str):
    """Decode a base64 JPEG frame, run pose detection, return landmarks or None."""
    img_bytes = base64.b64decode(frame_b64)
    arr = np.frombuffer(img_bytes, dtype=np.uint8)
    bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if bgr is None:
        return None, None

    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    result = _get_landmarker().detect(mp_image)

    if not result.pose_landmarks or len(result.pose_landmarks) == 0:
        return None, bgr

    return result.pose_landmarks[0], bgr


def compute_angle(a, b, c) -> float:
    """Compute angle at vertex b (in degrees) given three landmarks with .x, .y, .z."""
    ba = np.array([a.x - b.x, a.y - b.y, a.z - b.z])
    bc = np.array([c.x - b.x, c.y - b.y, c.z - b.z])

    cos_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-8)
    cos_angle = np.clip(cos_angle, -1.0, 1.0)
    return math.degrees(math.acos(cos_angle))


# MediaPipe Pose landmark indices
_LANDMARK = {
    "left_shoulder": 11,
    "right_shoulder": 12,
    "left_elbow": 13,
    "right_elbow": 14,
    "left_wrist": 15,
    "right_wrist": 16,
    "left_hip": 23,
    "right_hip": 24,
    "left_knee": 25,
    "right_knee": 26,
    "left_ankle": 27,
    "right_ankle": 28,
}

# 8 joint angles: (joint_name, vertex_landmark, from_landmark, to_landmark)
_JOINT_ANGLES = [
    ("Left Elbow", "left_elbow", "left_shoulder", "left_wrist"),
    ("Right Elbow", "right_elbow", "right_shoulder", "right_wrist"),
    ("Left Shoulder", "left_shoulder", "left_hip", "left_elbow"),
    ("Right Shoulder", "right_shoulder", "right_hip", "right_elbow"),
    ("Left Hip", "left_hip", "left_shoulder", "left_knee"),
    ("Right Hip", "right_hip", "right_shoulder", "right_knee"),
    ("Left Knee", "left_knee", "left_hip", "left_ankle"),
    ("Right Knee", "right_knee", "right_hip", "right_ankle"),
]


def _pose_to_feature_vector(landmarks) -> np.ndarray:
    """Convert landmarks to a normalized feature vector for DTW comparison.

    Uses hip-centered, torso-normalized joint positions for the 12 key landmarks.
    This makes the vector invariant to the person's position/scale in the frame.
    """
    indices = list(_LANDMARK.values())  # 12 key joints

    # Hip midpoint as origin
    hip_mid = np.array([
        (landmarks[23].x + landmarks[24].x) / 2,
        (landmarks[23].y + landmarks[24].y) / 2,
        (landmarks[23].z + landmarks[24].z) / 2,
    ])

    # Torso length (hip mid to shoulder mid) for scale normalization
    shoulder_mid = np.array([
        (landmarks[11].x + landmarks[12].x) / 2,
        (landmarks[11].y + landmarks[12].y) / 2,
        (landmarks[11].z + landmarks[12].z) / 2,
    ])
    torso_len = np.linalg.norm(shoulder_mid - hip_mid)
    if torso_len < 1e-6:
        torso_len = 1.0

    coords = []
    for idx in indices:
        lm = landmarks[idx]
        pt = (np.array([lm.x, lm.y, lm.z]) - hip_mid) / torso_len
        coords.extend(pt.tolist())

    return np.array(coords, dtype=np.float32)


def _dtw_match(user_features: list[np.ndarray], pro_features: list[np.ndarray]) -> list[tuple[int, int]]:
    """Dynamic Time Warping to align two pose sequences.

    Returns a list of (user_idx, pro_idx) pairs representing the optimal alignment.
    Then selects a subset of evenly-spaced pairs from the warping path to avoid
    returning too many near-duplicate comparisons.
    """
    n = len(user_features)
    m = len(pro_features)

    # Cost matrix: Euclidean distance between feature vectors
    cost = np.full((n, m), np.inf, dtype=np.float64)
    for i in range(n):
        for j in range(m):
            cost[i, j] = np.linalg.norm(user_features[i] - pro_features[j])

    # Accumulated cost matrix with DTW constraints
    acc = np.full((n, m), np.inf, dtype=np.float64)
    acc[0, 0] = cost[0, 0]

    for i in range(1, n):
        acc[i, 0] = acc[i - 1, 0] + cost[i, 0]
    for j in range(1, m):
        acc[0, j] = acc[0, j - 1] + cost[0, j]

    for i in range(1, n):
        for j in range(1, m):
            acc[i, j] = cost[i, j] + min(acc[i - 1, j], acc[i, j - 1], acc[i - 1, j - 1])

    # Traceback to find the optimal warping path
    path = []
    i, j = n - 1, m - 1
    path.append((i, j))
    while i > 0 or j > 0:
        if i == 0:
            j -= 1
        elif j == 0:
            i -= 1
        else:
            candidates = [
                (acc[i - 1, j - 1], i - 1, j - 1),
                (acc[i - 1, j], i - 1, j),
                (acc[i, j - 1], i, j - 1),
            ]
            _, i, j = min(candidates, key=lambda x: x[0])
        path.append((i, j))
    path.reverse()

    # Select evenly-spaced pairs from the path (target: ~min(n, m) pairs)
    target_pairs = min(n, m)
    if len(path) <= target_pairs:
        return path

    step = len(path) / target_pairs
    selected = []
    seen_user = set()
    seen_pro = set()
    for k in range(target_pairs):
        idx = int(k * step)
        u, p = path[idx]
        # Skip if we've already used this user or pro frame
        if u in seen_user or p in seen_pro:
            continue
        seen_user.add(u)
        seen_pro.add(p)
        selected.append((u, p))

    return selected if selected else [path[0], path[-1]]


def match_frames(
    user_frames: list[dict],
    pro_frames: list[dict],
    user_all_landmarks: list,
    pro_all_landmarks: list,
) -> list[tuple[int, int]]:
    """Match frames using DTW on pose similarity, with proportional fallback.

    Returns list of (user_idx, pro_idx) index pairs.
    """
    # Build feature vectors only for frames where we got a pose
    user_with_pose = [(i, _pose_to_feature_vector(lm)) for i, lm in enumerate(user_all_landmarks) if lm is not None]
    pro_with_pose = [(i, _pose_to_feature_vector(lm)) for i, lm in enumerate(pro_all_landmarks) if lm is not None]

    # Need at least 2 posed frames in each to run DTW meaningfully
    if len(user_with_pose) >= 2 and len(pro_with_pose) >= 2:
        user_indices, user_feats = zip(*user_with_pose)
        pro_indices, pro_feats = zip(*pro_with_pose)

        dtw_pairs = _dtw_match(list(user_feats), list(pro_feats))

        # Map DTW indices back to original frame indices
        return [(user_indices[u], pro_indices[p]) for u, p in dtw_pairs]

    # Fallback: proportional matching (no pose data available)
    n_pairs = min(len(user_frames), len(pro_frames))
    return [
        (int(i * len(user_frames) / n_pairs), int(i * len(pro_frames) / n_pairs))
        for i in range(n_pairs)
    ]


def compute_joint_angles(user_landmarks, pro_landmarks) -> list[dict]:
    """Compute 8 joint angles for both user and pro, with status based on difference."""
    angles = []
    for joint_name, vertex, from_lm, to_lm in _JOINT_ANGLES:
        v_idx = _LANDMARK[vertex]
        f_idx = _LANDMARK[from_lm]
        t_idx = _LANDMARK[to_lm]

        user_angle = compute_angle(user_landmarks[f_idx], user_landmarks[v_idx], user_landmarks[t_idx])
        pro_angle = compute_angle(pro_landmarks[f_idx], pro_landmarks[v_idx], pro_landmarks[t_idx])
        diff = abs(user_angle - pro_angle)

        if diff < 15:
            status = "good"
        elif diff < 30:
            status = "warning"
        else:
            status = "poor"

        angles.append({
            "joint": joint_name,
            "user_angle": round(user_angle, 1),
            "pro_angle": round(pro_angle, 1),
            "diff": round(diff, 1),
            "status": status,
        })

    return angles


def process_all_pairs(user_frames: list[dict], pro_frames: list[dict]):
    """Generator yielding PoseFramePair-like dicts for each DTW-aligned frame pair.

    Flow:
    1. Detect landmarks on ALL frames (both user and pro)
    2. Run DTW alignment on pose feature vectors
    3. Yield annotated pairs for the aligned frames
    """
    from services.pose_drawing import draw_skeleton, create_ghost_overlay, create_side_by_side, encode_frame_b64

    if not user_frames or not pro_frames:
        return

    # Phase 1: Detect landmarks on all frames
    user_all_landmarks = []
    user_all_bgr = []
    for frame in user_frames:
        lm, bgr = detect_landmarks(frame["b64"])
        user_all_landmarks.append(lm)
        user_all_bgr.append(bgr)

    pro_all_landmarks = []
    pro_all_bgr = []
    for frame in pro_frames:
        lm, bgr = detect_landmarks(frame["b64"])
        pro_all_landmarks.append(lm)
        pro_all_bgr.append(bgr)

    # Phase 2: DTW alignment
    aligned_pairs = match_frames(user_frames, pro_frames, user_all_landmarks, pro_all_landmarks)

    # Phase 3: Generate annotated frame pairs
    for idx, (u_idx, p_idx) in enumerate(aligned_pairs):
        user_bgr = user_all_bgr[u_idx]
        pro_bgr = pro_all_bgr[p_idx]
        user_landmarks = user_all_landmarks[u_idx]
        pro_landmarks = pro_all_landmarks[p_idx]

        if user_bgr is None or pro_bgr is None:
            continue

        # Compute joint angles (only if both have pose detections)
        joint_angles = []
        if user_landmarks and pro_landmarks:
            joint_angles = compute_joint_angles(user_landmarks, pro_landmarks)

        # Draw skeletons on copies
        user_annotated = user_bgr.copy()
        pro_annotated = pro_bgr.copy()

        if user_landmarks:
            draw_skeleton(user_annotated, user_landmarks, color=(255, 255, 0), thickness=2, joint_statuses=None)
        if pro_landmarks:
            draw_skeleton(pro_annotated, pro_landmarks, color=(255, 0, 255), thickness=2, joint_statuses=None)

        # Side-by-side
        side_by_side = create_side_by_side(user_annotated, pro_annotated)
        side_by_side_b64 = encode_frame_b64(side_by_side)

        # Ghost overlay
        ghost = create_ghost_overlay(user_bgr, user_landmarks, pro_landmarks, joint_angles)
        ghost_b64 = encode_frame_b64(ghost)

        yield {
            "index": idx,
            "user_timestamp": user_frames[u_idx]["timestamp"],
            "pro_timestamp": pro_frames[p_idx]["timestamp"],
            "side_by_side_b64": side_by_side_b64,
            "ghost_overlay_b64": ghost_b64,
            "joint_angles": joint_angles,
        }
