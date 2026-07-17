# Cinematography kit — FOV, cuts, measurable language, first-frame lock

Read this before writing the first prompt of a session (together with `worked-examples.md`). These rules govern the video prompts only — asset generation prompts for image tools keep their own conventions (`asset-prompts.md`).

## Optics: shot size + FOV in degrees, not millimeters

Seedance holds a field of view stated in **degrees** more reliably than lens millimeters. Every CUT header states: shot size + approved FOV + movement. When a segment must hold its optics, add `no drift mid-segment`.

Shot sizes:

| Code | Frame content |
|---|---|
| ECU | one detail — eye, hand, button, headlight |
| CU | full face or one large element |
| MCU | head and shoulders |
| MS | approximately waist-up |
| WS | full figure and surroundings |
| EWS | location and scale |

Approved FOV values (use these, not arbitrary numbers):

| FOV | Optical role | Typical use |
|---|---|---|
| 180° | fisheye distortion | POV, dream-state |
| 107° | architectural ultra-wide | giant interiors, epic establish |
| 84° | wide | establish, group blocking |
| 63° | observational wide | reportage, immersive action |
| 47° | neutral human perspective | universal establish, medium shot |
| 29° | portrait compression | isolated medium, dialogue bust |
| 18° | natural close portrait | identity-preserving close-up |
| 12° | tele-detail | hands, objects, detail-on-wide |
| 8° | extreme compression | distant observation, broadcast |

Rough translation from lens habit: 24mm ≈ 84°, 35mm ≈ 63°, 50mm ≈ 47°, 85mm ≈ 29°, 135mm ≈ 18°.

Useful combinations:

- **Observation / hidden-camera**: 8°–12° distant vantage + 20–30% out-of-focus foreground occlusion + atmospheric haze between camera and subject. Change the occlusion type between beats while keeping one vantage.
- **Sports broadcast**: 8° super-tele + handheld 1–2 cm tremor + operator anchored at distance, finding the action.
- **Detail-on-wide**: 84° low-angle camera almost touching a small foreground object so the background recedes deeply.
- **Intimate wide**: 63°–84° close to a face while keeping the surroundings readable.
- **Tele air column**: at 8°–12°, describe suspended dust or heat shimmer compressed through the long distance.

### Extreme-FOV protocol (8° or 107° sequences)

Extreme optics drift hardest. For a prompt built on 8° or 107°, use all four mechanisms:

1. One prompt-wide identity and location lock (the Characters/Scene blocks already do this — keep them tight).
2. A `LENS LOCK` opener with the exact FOV at the start of every CUT.
3. A `LENS CHECK` confirming the same FOV at the end of every CUT.
4. Color described through material + light + compositional role, never a flat color word.

### Camera placement

Put the camera on the **shadow side** of the subject and state the operator axis ("camera on the shadow side, operating from camera-left of the table"). Motivate every move — the camera is a character with a reason to be where it is.

## Cut vocabulary and timing

Available transitions between CUTs: `HARD CUT`, `SMASH CUT`, `MATCH CUT`, `INSERT CUT`, `REVERSE CUT`, `WHIP CUT`. Use fades or crossfades only when the user explicitly asks. Default is HARD CUT — you don't need to name it; name a transition only when it's not a plain hard cut.

- **Whip-pan needs time to read.** Shorter than ~0.8s it renders as a hard cut. Give it the full arc: `0.3s — subject A settled. 0.8s — WHIP motion-blur transition. 1.4s — subject B settled.`
- **One speed per segment.** Mixing real-time and slow motion inside one CUT breaks physics. Cut hard between speed modes and state each segment's speed.
- **Pressure cracks** (breaking caused by pressure, not impact): the force presses rather than strikes, fracture begins at edge stress rather than a center impact point, and the crack travels sequentially from edge toward center — not radiating from one point.

## Measurable language

Replace vague intensifiers with numbers and physical references:

- **Speed** in km/h, not "fast"/"slow": "the van passes at 60 km/h".
- **Fog / haze** as a percentage plus depth in meters; build atmosphere in steps across shots when needed: 20% → 40% → 60%.
- **White balance** in Kelvin per location/time state — commonly 3200K (tungsten interior), 4000K (mixed/fluorescent), 5600K (daylight), 8500K (blue hour) — and keep it fixed within one location/time state. Put it in the scene's Lighting line.
- **Giant scale** by comparison with stacked human heights, not "huge": "the machine stands four human heights tall".
- **Left/right** are always camera-left and camera-right.
- **Color bound to material + light + role**: "crimson silk catching the cold corridor spill", never a flat color list.
- **Environmental contact** stated physically: snow melts on skin, rain tracks through hair, wind loads the fabric of the coat.

## Locks are positive

Constraints hold better as affirmative statements of what stays stable and what occurs than as lists of "no X". Prefer:

- "The listed cuts are the complete edit; the camera holds each segment continuously between them" over "no extra cuts".
- "Character identity, face, proportions, wardrobe, and carried props remain identical across all cuts" over "no identity drift" alone.
- "The subject continues camera-left with uninterrupted momentum after the cut" over "don't reverse direction".
- "Each segment holds its stated FOV with no drift mid-segment."

Keep the handful of hard negatives that earn their place (no subtitles, no music, no added objects) — but the spine of the constraint language is positive.

## First-frame image lock (image-to-video)

When the user supplies an image that must be the **exact first frame** of a prompt — a generated start frame, a keeper frame from a previous clip, a photo — open the prompt with a lock block ABOVE the Style CORE, then continue the normal structure:

```
@image1 — use this exact uploaded image as the first frame, exact composition reference, exact framing reference, and exact style reference. The video begins from this exact shot. Preserve the exact scale, crop, camera angle, lighting, color, texture, atmosphere, and all existing objects. Do not add new objects.
```

Rules for the locked prompt:

- The central objective is to **animate the supplied frame, not rebuild a similar scene**.
- Trim the Scene block to what the image doesn't already define (what happens next, off-screen space, sounds) — don't re-describe composition the image locks.
- The image controls identity and appearance; the text controls action. Restate in words only action-critical details: small text, logos, damage, prop states.
- If the whole prompt is one uninterrupted take from the locked frame, say so and forbid reframing: "One continuous shot; the camera holds one uninterrupted take. Keep the same framing and angle throughout."
- Time the action in beats that fit the clip: trigger → development → main event → held final state. ENDS ON is still written — the handoff rule doesn't care where the first frame came from.
- **Continuation chains**: feeding the previous clip's final frame back as `@image1` for the next prompt is the strongest possible handoff — offer it in the board's How-to-use when a seam between prompts is high-risk. The asset gets a checklist row like any other (`@s3_start_frame`).
