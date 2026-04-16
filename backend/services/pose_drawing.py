import base64

import cv2
import numpy as np


# MediaPipe Pose bone connections (pairs of landmark indices)
_BONES = [
    (11, 13), (13, 15),  # left arm
    (12, 14), (14, 16),  # right arm
    (11, 12),            # shoulders
    (11, 23), (12, 24),  # torso
    (23, 24),            # hips
    (23, 25), (25, 27),  # left leg
    (24, 26), (26, 28),  # right leg
]

# Map joint names to landmark indices for status coloring
_JOINT_STATUS_MAP = {
    "Left Elbow": 13,
    "Right Elbow": 14,
    "Left Shoulder": 11,
    "Right Shoulder": 12,
    "Left Hip": 23,
    "Right Hip": 24,
    "Left Knee": 25,
    "Right Knee": 26,
}

_STATUS_COLORS = {
    "good": (0, 200, 0),       # green
    "warning": (0, 220, 255),  # yellow (BGR)
    "poor": (0, 0, 255),       # red
}


def _landmark_to_pixel(landmark, h: int, w: int) -> tuple[int, int]:
    """Convert normalized landmark coordinates to pixel coords."""
    return int(landmark.x * w), int(landmark.y * h)


def draw_skeleton(
    frame_bgr: np.ndarray,
    landmarks,
    color: tuple = (255, 255, 0),
    thickness: int = 2,
    joint_statuses: list[dict] | None = None,
    dashed: bool = False,
):
    """Draw bones and joint circles on a frame. Optionally use dashed lines."""
    h, w = frame_bgr.shape[:2]

    # Build status map: landmark_idx -> status color
    status_color_map = {}
    if joint_statuses:
        for ja in joint_statuses:
            idx = _JOINT_STATUS_MAP.get(ja["joint"])
            if idx is not None:
                status_color_map[idx] = _STATUS_COLORS.get(ja["status"], color)

    # Draw bones
    for i, j in _BONES:
        if i >= len(landmarks) or j >= len(landmarks):
            continue
        pt1 = _landmark_to_pixel(landmarks[i], h, w)
        pt2 = _landmark_to_pixel(landmarks[j], h, w)

        if dashed:
            _draw_dashed_line(frame_bgr, pt1, pt2, color, thickness)
        else:
            cv2.line(frame_bgr, pt1, pt2, color, thickness, cv2.LINE_AA)

    # Draw joint circles
    joint_indices = {11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28}
    for idx in joint_indices:
        if idx >= len(landmarks):
            continue
        pt = _landmark_to_pixel(landmarks[idx], h, w)
        jc = status_color_map.get(idx, color)
        cv2.circle(frame_bgr, pt, 5, jc, -1, cv2.LINE_AA)
        cv2.circle(frame_bgr, pt, 5, (0, 0, 0), 1, cv2.LINE_AA)


def _draw_dashed_line(img, pt1, pt2, color, thickness, dash_length=10):
    """Draw a dashed line between two points."""
    x1, y1 = pt1
    x2, y2 = pt2
    dist = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
    if dist < 1:
        return

    n_dashes = max(1, int(dist / dash_length))
    for i in range(0, n_dashes, 2):
        t1 = i / n_dashes
        t2 = min((i + 1) / n_dashes, 1.0)
        start = (int(x1 + t1 * (x2 - x1)), int(y1 + t1 * (y2 - y1)))
        end = (int(x1 + t2 * (x2 - x1)), int(y1 + t2 * (y2 - y1)))
        cv2.line(img, start, end, color, thickness, cv2.LINE_AA)


def _recenter_landmarks(landmarks, src_hip_mid, dst_hip_mid, h, w):
    """Shift pro landmarks so their hip midpoint aligns with user's hip midpoint.
    Returns a list of simple objects with .x, .y, .z attributes."""
    src_x = src_hip_mid[0] / w
    src_y = src_hip_mid[1] / h
    dst_x = dst_hip_mid[0] / w
    dst_y = dst_hip_mid[1] / h
    dx = dst_x - src_x
    dy = dst_y - src_y

    class ShiftedLandmark:
        def __init__(self, x, y, z):
            self.x = x
            self.y = y
            self.z = z

    shifted = []
    for lm in landmarks:
        shifted.append(ShiftedLandmark(lm.x + dx, lm.y + dy, lm.z))
    return shifted


def create_ghost_overlay(
    user_frame_bgr: np.ndarray,
    user_landmarks,
    pro_landmarks,
    joint_angles: list[dict],
) -> np.ndarray:
    """Draw both skeletons on the user's frame: user in cyan (solid), pro in magenta (dashed).
    Pro is re-centered at the user's hip midpoint."""
    overlay = user_frame_bgr.copy()
    h, w = overlay.shape[:2]

    # Draw user skeleton in cyan
    if user_landmarks:
        draw_skeleton(overlay, user_landmarks, color=(255, 255, 0), thickness=2, joint_statuses=joint_angles)

    # Draw pro skeleton in magenta, re-centered to user's hip midpoint
    if pro_landmarks and user_landmarks:
        user_hip_mid = (
            int((user_landmarks[23].x + user_landmarks[24].x) / 2 * w),
            int((user_landmarks[23].y + user_landmarks[24].y) / 2 * h),
        )
        pro_hip_mid = (
            int((pro_landmarks[23].x + pro_landmarks[24].x) / 2 * w),
            int((pro_landmarks[23].y + pro_landmarks[24].y) / 2 * h),
        )
        shifted_pro = _recenter_landmarks(pro_landmarks, pro_hip_mid, user_hip_mid, h, w)
        draw_skeleton(overlay, shifted_pro, color=(255, 0, 255), thickness=2, joint_statuses=None, dashed=True)
    elif pro_landmarks:
        draw_skeleton(overlay, pro_landmarks, color=(255, 0, 255), thickness=2, joint_statuses=None, dashed=True)

    # Add legend
    cv2.putText(overlay, "You", (10, h - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1, cv2.LINE_AA)
    cv2.putText(overlay, "Pro", (10, h - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 255), 1, cv2.LINE_AA)

    return overlay


def create_side_by_side(user_annotated: np.ndarray, pro_annotated: np.ndarray) -> np.ndarray:
    """Concatenate two annotated frames horizontally with labels."""
    h1, w1 = user_annotated.shape[:2]
    h2, w2 = pro_annotated.shape[:2]

    # Resize to same height
    target_h = min(h1, h2)
    if h1 != target_h:
        user_annotated = cv2.resize(user_annotated, (int(w1 * target_h / h1), target_h))
    if h2 != target_h:
        pro_annotated = cv2.resize(pro_annotated, (int(w2 * target_h / h2), target_h))

    # Add labels
    cv2.putText(user_annotated, "YOU", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2, cv2.LINE_AA)
    cv2.putText(pro_annotated, "PRO", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 255), 2, cv2.LINE_AA)

    # Add 4px separator
    sep = np.zeros((target_h, 4, 3), dtype=np.uint8)
    return np.hstack([user_annotated, sep, pro_annotated])


def encode_frame_b64(frame_bgr: np.ndarray) -> str:
    """Encode a BGR frame to JPEG base64 string."""
    _, buf = cv2.imencode(".jpg", frame_bgr, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return base64.b64encode(buf).decode("utf-8")
