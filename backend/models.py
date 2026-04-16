from pydantic import BaseModel


class FeedbackItem(BaseModel):
    label: str
    description: str
    timestamp: str | None = None


class AnalysisResult(BaseModel):
    scores: dict[str, int]
    good: list[FeedbackItem]
    needs_work: list[FeedbackItem]
    drills: list[FeedbackItem]
    summary: str


class JointAngle(BaseModel):
    joint: str
    user_angle: float
    pro_angle: float
    diff: float
    status: str  # "good" | "warning" | "poor"


class PoseFramePair(BaseModel):
    index: int
    user_timestamp: float
    pro_timestamp: float
    side_by_side_b64: str
    ghost_overlay_b64: str
    joint_angles: list[JointAngle]
