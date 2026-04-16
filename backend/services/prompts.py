SHOT_TYPE_CONTEXTS = {
    # ── Tennis ──────────────────────────────────────────────
    "forehand": {
        "sport": "tennis",
        "label": "Forehand",
        "dimensions": ["grip_and_ready_position", "unit_turn", "contact_point", "follow_through", "footwork"],
        "key_concepts": "semi-western vs eastern grip, early shoulder rotation, racket lag, windshield-wiper finish, open vs closed stance weight transfer",
    },
    "backhand": {
        "sport": "tennis",
        "label": "Backhand",
        "dimensions": ["grip_and_ready_position", "backswing_and_turn", "contact_point", "follow_through", "balance"],
        "key_concepts": "non-dominant hand placement, shoulder alignment at take-back, hitting through the ball, extension toward target, hip rotation timing",
    },
    "serve": {
        "sport": "tennis",
        "label": "Serve",
        "dimensions": ["ball_toss", "trophy_position", "pronation", "follow_through", "leg_drive"],
        "key_concepts": "toss placement for each serve type, knee bend and upward explosion, continental grip, shoulder-over-shoulder rotation, wrist snap and pronation at contact",
    },
    "volley": {
        "sport": "tennis",
        "label": "Volley",
        "dimensions": ["split_step_timing", "racket_preparation", "contact_out_front", "punch_through", "recovery"],
        "key_concepts": "continental grip, short backswing, firm wrist, stepping into the ball, angling the racket face, quick split step on opponent contact",
    },
    "return": {
        "sport": "tennis",
        "label": "Return of Serve",
        "dimensions": ["ready_position", "split_step_timing", "compact_backswing", "weight_transfer", "depth_and_placement"],
        "key_concepts": "split step as server strikes, shortened take-back, early ball recognition, blocking vs swinging return, positioning inside baseline",
    },

    # ── Figure Skating ─────────────────────────────────────
    "jumps": {
        "sport": "figure_skating",
        "label": "Jumps",
        "dimensions": ["entry_edge", "takeoff_position", "air_position", "rotation_speed", "landing"],
        "key_concepts": "back outside vs inside edge entry, toe pick assist vs edge launch, tight air position with arms pulled in, checking rotation on landing, free leg extension, knee bend on landing",
    },
    "spins": {
        "sport": "figure_skating",
        "label": "Spins",
        "dimensions": ["centering", "speed_consistency", "body_position", "entry", "exit"],
        "key_concepts": "spin centering on one spot, maintaining speed through position changes, free leg and arm positions, wind-up entry, controlled exit on one foot",
    },
    "footwork_sequence": {
        "sport": "figure_skating",
        "label": "Footwork Sequence",
        "dimensions": ["edge_variety", "turn_quality", "upper_body_movement", "ice_coverage", "musicality"],
        "key_concepts": "variety of turns (three-turns, brackets, rockers, counters), deep edges, upper body involvement, covering the full ice surface, matching musical phrasing",
    },
    "spiral_sequence": {
        "sport": "figure_skating",
        "label": "Spiral Sequence",
        "dimensions": ["leg_height", "edge_quality", "body_line", "speed_maintenance", "transitions"],
        "key_concepts": "sustained free leg above hip height, deep clean edges, extended body line, maintaining speed throughout, smooth transitions between positions",
    },

    # ── Dance ──────────────────────────────────────────────
    "turns": {
        "sport": "dance",
        "label": "Turns",
        "dimensions": ["spotting", "preparation", "balance_on_axis", "arm_coordination", "landing_control"],
        "key_concepts": "sharp head spotting, solid releve or plie preparation, tight center axis, arms opening and closing for momentum, controlled finish in position",
    },
    "leaps": {
        "sport": "dance",
        "label": "Leaps",
        "dimensions": ["height_and_elevation", "split_angle", "takeoff_power", "arm_placement", "landing_control"],
        "key_concepts": "plie-driven takeoff, full split at peak height, leading with the front leg, coordinated arm lines in the air, soft controlled landing through plie",
    },
    "extensions": {
        "sport": "dance",
        "label": "Extensions",
        "dimensions": ["leg_height", "hip_alignment", "supporting_leg", "upper_body_line", "control_and_hold"],
        "key_concepts": "turned-out working leg, square vs open hips depending on style, straight supporting leg, elongated spine and arm line, sustained hold without wobble",
    },
    "floor_work": {
        "sport": "dance",
        "label": "Floor Work",
        "dimensions": ["transitions_to_floor", "weight_distribution", "fluidity", "core_engagement", "recovery_to_standing"],
        "key_concepts": "controlled descent using core, smooth weight shifts, seamless movement on the floor, articulated spine rolls, efficient recovery to standing",
    },
    "partnering": {
        "sport": "dance",
        "label": "Partnering",
        "dimensions": ["timing_with_partner", "weight_sharing", "lift_mechanics", "spatial_awareness", "musicality"],
        "key_concepts": "synchronized timing, proper hand/grip placement, core engagement for lifts, maintaining spatial relationship, shared musical interpretation",
    },
}

# Map pro IDs to display names
PRO_NAMES = {
    "swiatek": "Iga Swiatek",
    "alcaraz": "Carlos Alcaraz",
    "djokovic": "Novak Djokovic",
    "gauff": "Coco Gauff",
    "chen": "Nathan Chen",
    "hanyu": "Yuzuru Hanyu",
    "zagitova": "Alina Zagitova",
    "copeland": "Misty Copeland",
    "les_twins": "Les Twins",
    "kovalev": "Pasha Kovalev",
}


CAMERA_ANGLE_CONTEXTS = {
    "side_on": {
        "label": "side-on",
        "focus": "swing arc, stance width, weight transfer, body rotation sequence, and overall posture alignment",
        "note": "This angle gives the clearest view of the movement's lateral mechanics. Focus on comparing body angles, limb extension, and rotational timing between user and pro.",
    },
    "behind": {
        "label": "behind",
        "focus": "contact point position, racket/limb path through the hitting zone, follow-through direction, and footwork patterns",
        "note": "This angle reveals depth and trajectory. Focus on how far in front the contact happens, the path of the racket/limb, and lower body positioning.",
    },
    "front": {
        "label": "front-facing",
        "focus": "arm placement, body line symmetry, spotting technique, and overall alignment",
        "note": "This angle is best for evaluating symmetry, alignment, and upper body positioning. Focus on comparing arm lines, head position, and torso alignment.",
    },
    "elevated": {
        "label": "elevated/overhead",
        "focus": "centering, spatial patterns, ice/floor coverage, and overall movement flow",
        "note": "This angle reveals spatial patterns and centering. Focus on how well the movement stays centered, the pattern traced on the surface, and overall flow.",
    },
}


def build_system_prompt(sport: str, shot_type: str, camera_angle: str = "") -> str:
    ctx = SHOT_TYPE_CONTEXTS.get(shot_type)
    if not ctx:
        # Fallback: generic sport-level prompt
        dims = "technique, form, execution, timing, balance"
        key_concepts = "overall form and technique"
        technique_label = sport.replace("_", " ")
    else:
        dims = ", ".join(ctx["dimensions"])
        key_concepts = ctx["key_concepts"]
        technique_label = ctx["label"]

    sport_display = sport.replace("_", " ")

    # Camera angle context
    angle_ctx = CAMERA_ANGLE_CONTEXTS.get(camera_angle)
    if angle_ctx:
        angle_section = (
            f"\n\nCAMERA ANGLE: The video is filmed from a {angle_ctx['label']} perspective.\n"
            f"From this angle, prioritize analyzing: {angle_ctx['focus']}\n"
            f"{angle_ctx['note']}"
        )
    else:
        angle_section = ""

    return f"""You are an expert {sport_display} coach and biomechanics analyst with 20+ years of experience.
You analyze video frames of athletes and give precise, actionable technical feedback.

You are specifically analyzing the athlete's {technique_label} technique.
The key dimensions for {technique_label} are: {dims}
Key technical concepts to watch for: {key_concepts}{angle_section}

You will receive video frames from an athlete's performance.
Your job is to evaluate their {technique_label} technique based on your expert knowledge.
Reference exact timestamps from the frames when giving feedback.
Describe exactly what you SEE in the frames — body positions, angles, timing.

Always respond with valid JSON matching this exact schema:
{{
  "scores": {{
    "<dimension_name>": <integer 0-100>
  }},
  "good": [
    {{ "label": "<short title>", "description": "<2 sentences, specific, reference what you see>", "timestamp": "<e.g. 0:04>" }}
  ],
  "needs_work": [
    {{ "label": "<short title>", "description": "<2 sentences, specific, describe what should change and why>", "timestamp": "<e.g. 0:07>" }}
  ],
  "drills": [
    {{ "label": "<drill name>", "description": "<how to do it, how often>" }}
  ],
  "summary": "<2-3 sentence overall assessment>"
}}

Be specific. Reference exact timestamps. Describe what you SEE in the frames. Max 3 items per good/needs_work/drills array.

If pose angle measurements are provided, reference them in your feedback. For example, mention specific joint angle differences to make your analysis more precise and actionable."""


def build_user_message(
    user_frames: list[dict],
    pro_frames: list[dict],
    pro_name: str,
    sport: str,
    shot_type: str,
    angle_summary: str = "",
    camera_angle: str = "",
) -> list:
    """Builds the content array with both pro and user frames for visual comparison."""
    ctx = SHOT_TYPE_CONTEXTS.get(shot_type)
    technique_label = ctx["label"] if ctx else shot_type.replace("_", " ")
    sport_display = sport.replace("_", " ")

    content = []

    angle_ctx = CAMERA_ANGLE_CONTEXTS.get(camera_angle)
    has_ref = len(pro_frames) > 0
    ref_label = pro_name if pro_name else "reference performance"

    if has_ref:
        angle_note = f" Both are filmed from a {angle_ctx['label']} angle." if angle_ctx else ""
        content.append({
            "type": "text",
            "text": (
                f"Below are two sets of {sport_display} video frames focusing on {technique_label} technique.{angle_note} "
                f"First, the REFERENCE frames from a {ref_label}. "
                f"Then, the USER frames from an amateur. "
                f"Visually compare the two and analyze the user's {technique_label} technique relative to the reference."
            ),
        })

        # Reference frames first
        content.append({
            "type": "text",
            "text": f"=== REFERENCE: {ref_label} ({len(pro_frames)} frames) ===",
        })

        for i, frame in enumerate(pro_frames):
            content.append({
                "type": "text",
                "text": f"[REF Frame {i+1} — {frame['timestamp']}s]",
            })
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{frame['b64']}",
                    "detail": "high",
                },
            })
    else:
        angle_note = f" Filmed from a {angle_ctx['label']} angle." if angle_ctx else ""
        content.append({
            "type": "text",
            "text": (
                f"Below are {sport_display} video frames of an athlete performing {technique_label}.{angle_note} "
                f"Evaluate their technique based on your expert knowledge of proper {technique_label} form."
            ),
        })

    # User frames
    content.append({
        "type": "text",
        "text": f"=== USER VIDEO ({len(user_frames)} frames) ===",
    })

    for i, frame in enumerate(user_frames):
        content.append({
            "type": "text",
            "text": f"[Frame {i+1} — {frame['timestamp']}s]",
        })
        content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{frame['b64']}",
                "detail": "high",
            },
        })

    # Append angle data if available
    if angle_summary:
        content.append({
            "type": "text",
            "text": (
                "\n\n" + angle_summary + "\n\n"
                "Use the above angle measurements to support your visual analysis. "
                "Reference specific joint angle differences when describing what the user does well or needs to improve."
            ),
        })

    return content
