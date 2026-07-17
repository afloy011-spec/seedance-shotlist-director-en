# Asset generation prompts — patterns

Read this at workflow step 2, when you extract assets and assign @names. Every asset in the Asset Checklist gets a **copy-ready English generation prompt** the user pastes into an image tool (Higgsfield Soul / GPT Image / similar) to build the reference BEFORE video generation. The board renders each one as a copyable block (markup in `board-spec.md`).

Source method: Higgsfield Cinema Studio workflow (higgsfield.ai/blog/cinematic_headphones) — assets first, locked as Elements with @names, then video prompts reference them.

## Rules that apply to every asset prompt

- **English, photorealistic, self-contained** — the prompt works standalone in an image generator.
- **No branding**: append to product/wardrobe/vehicle prompts — "STRICTLY no brand names, logos, wordmarks, or text" (exception: the client's own brand mark when the ad requires it).
- **Plain background for characters/props**: "plain solid grey background" — clean references pin identity better.
- **No people in location references** — locations must be empty stages.
- **No readable signage/text** in locations and UI props — text renders badly and pollutes the reference.
- Match the film's palette and time-of-day in location prompts (the reference teaches the model the look).

## Character sheet (the split-frame pattern)

One image, two panels — face for identity, full body for wardrobe and build:

```
Split-frame character sheet, plain solid grey background.
LEFT panel: facial close-up of [age, look, hair, face shape, eyes, one small distinguishing mark];
entire head fully inside the frame including all the hair, nothing cropped;
85mm portrait lens, shallow depth of field, soft cinematic key light.
RIGHT panel: full-body front and back views side by side of the same person,
[build, height], wearing [full wardrobe, item by item];
35mm lens, even full-length lighting. Photorealistic, no branding.
```

- **Anti-drift trick**: if the generator draws the face on the full-body panel too, follow up with: "Erase the face from the full-body panel" — duplicate faces in one reference cause identity drift in video.
- **Give the face one small verifiable mark** (a mole, a freckle pattern) — it becomes the continuity anchor across cuts.
- **Seated characters** (drivers, office workers): request the full-body panel "seated, as if at [the wheel / a desk]".

## Character — Higgsfield AI Cast variant (ship BOTH, user picks)

Higgsfield's AI Cast / Soul character creation wants the OPPOSITE of the sheet: a compact casting card, **50–75 words maximum** — longer prompts dilute the identity signal. Structure:

```
Soul: [age]yo [build] [ethnicity/look] [gender], [height if it matters].
[3–5 facial anchors: hair, face shape, eyes, one small verifiable mark].
[Resting expression / character in one clause].
[Wardrobe, item by item, compact].
[Lighting/mood matching the film, one clause]. Cinematic.
```

Example: "Soul: 28yo slim East European woman, 170 cm. Shoulder-length dark brown hair, oval face, expressive dark eyes, small mole on the left cheekbone. Calm, observant, guarded. Open camel wool coat over a black dress, crossbody bag worn in front, white earbuds. Cold night street lighting, cinematic."

Every character in the checklist ships **two copyable prompts**: variant A — the split-frame sheet (above), variant B — the AI Cast card. Same identity anchors in both (the same mole, the same wardrobe) so either path locks the same person. In the bible, variant B is stored as `aiCastPrompt` next to `genPrompt`.

## Character variants (state and wardrobe)

Variants are EDITS of the locked sheet, not new generations — identity must survive:

- Wardrobe: "Edit this character sheet: keep the face, hair, and identity exactly consistent across all panels. Dress [him/her] in [new outfit]."
- State: "Same character sheet, [post-run: sweat-sheened skin, sweat stains on the shirt / soaked by rain: hair plastered to the forehead, dripping coat / dirt, blood, exhaustion...]."
- Each variant gets its own @name (`@hero_wet`, `@hero_suit`) and its own checklist row.

## Product / hero prop sheet

```
Product prop sheet / orthographic turnaround: [the object — material, color, distinguishing details],
front and 3/4 perspective views [+ side/back if the film shows them],
clean studio light, neutral background, centered, product photography.
STRICTLY no brand names, logos, wordmarks, or text.
```

- If the user has a real product photo: "Make a product sheet with front and 3/4 perspective views of the [object] from @image_1."
- Small props the character handles (keys, mugs, phones) benefit from a **hands panel**: one panel showing the prop held/gripped the way the film uses it.

## Location reference

```
[Time of day] [interior/exterior], 3/4 angle with depth: [the space — architecture, surfaces,
light sources exactly as the scene's Lighting line designs them, palette].
Photorealistic, cinematic, no people, no readable signage.
```

- **3/4 angle with depth** is mandatory — a flat frontal reference kills camera movement.
- One location, one lighting state. If the film returns to a location at a different time of day, that's a second reference (`@kitchen_morning`, `@kitchen_night`).

## Phone / screen UI props

Screens are the highest text-risk asset. Generate them as separate stills, silhouette-only:

```
Product prop sheet: a modern smartphone [in a hand / on a surface], [app look, dark/light mode],
N separate stills: (1) [screen 1], (2) [screen 2], ...
All UI soft-focus and silhouette-legible only — shapes and colors read, no readable words.
[Ambient lighting matching the scene], screen glow on the hand.
```

Readable UI text is composited in post — never asked from the generator.

## Layout map (complex staging)

A diagram, not a photo — say so explicitly or the generator will render a scene:

```
Simple flat overhead diagram / schematic, not photorealistic: [the space] seen from above —
[element] marked [LABEL], [element] marked [LABEL], an arrow showing [the key movement or sightline].
Clean vector look, white background.
```

Reference it from the Scene block of the prompts instead of prose geometry.
