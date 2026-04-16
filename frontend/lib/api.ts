import { AnalysisResult, PoseFramePair } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeVideo(
  file: File,
  sport: string,
  shotType: string,
  proId: string,
  onProgress: (status: string, detail?: Record<string, unknown>) => void,
  onDone: (result: AnalysisResult) => void,
  onError: (error: string) => void,
  onPoseFrame?: (pair: PoseFramePair) => void,
  cameraAngle?: string,
  variant?: string,
) {
  const form = new FormData();
  form.append("video", file);
  form.append("sport", sport);
  form.append("shot_type", shotType);
  form.append("pro_id", proId);
  if (cameraAngle) form.append("camera_angle", cameraAngle);
  if (variant) form.append("variant", variant);

  try {
    const res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      onError(`Server error: ${res.status}`);
      return;
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = JSON.parse(line.slice(6));
        if (data.status === "done") {
          onDone(data.result);
        } else if (data.status === "pose_frame" && onPoseFrame) {
          onPoseFrame(data.pair as PoseFramePair);
        } else {
          onProgress(data.status, data);
        }
      }
    }
  } catch (err) {
    onError(err instanceof Error ? err.message : "Unknown error");
  }
}
