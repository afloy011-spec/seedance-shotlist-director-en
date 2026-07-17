# Worked examples — what good looks like

Read this before writing your first prompt of a session (generation), and before applying a revision (the second example).

## A worked prompt

User script: *"Anna comes home soaking wet from the rain. Marco is sitting on the couch, looks up from his book, doesn't say anything. She walks past him to the bedroom."*

This is a single scene — call it Scene 1. Assets: `@anna_wet` (soaked state — she's introduced wet, so the wet variant IS her base asset here), `@marco`, `@apartment`. Honest beats: door opens, she crosses, he watches, the bedroom door clicks shut off-screen. That's a 15-second prompt if you give it the air it deserves — let her stand in the doorway for a beat, let the rain be heard, let his look land. One prompt is enough. Risk: safe — two characters, slow blocking, no fine choreography. Final cut: ~8s of these 15 will survive — this moment IS the film.

```
Style: 8K IMAX. Photorealistic — no 3D render, no game engine.
[...full style CORE verbatim...]
Lighting: Natural light only — rain-blue evening spill through the window stage-right, 8500K blue-hour white balance held for the whole scene, contre-jour on the doorway, camera on the shadow side, 20% atmospheric haze. Key from window and street light only. No artificial lighting.

Characters:
ANNA (@anna_wet) — late 20s, dark hair plastered to her forehead from the rain, soaked navy coat dripping onto the hardwood, mascara slightly smudged under her right eye, lips slightly parted from cold.
MARCO (@marco) — early 30s, faded grey t-shirt, three-day stubble, paperback book open in his left hand, reading glasses low on his nose.

Scene:
A small Brooklyn apartment (@apartment), evening. Living room opens directly into a narrow hallway leading to the bedroom. Rain audible against the window stage-right. Marco sits on the left end of a worn leather couch, facing camera-right. The front door is camera-left. Anna enters from the front door, water streaming off her coat. The space between them is roughly twelve feet, and it stays twelve feet.

CUT 1 — WS static, 63° FOV, eye-level, locked off, no drift mid-segment:
The front door swings open. Anna stands silhouetted in the doorway against the rain-blue street light, contre-jour, water visibly dripping from her coat hem. She doesn't look at Marco. She closes the door slowly with her back, eyes on the floor. Beat. Marco looks up from his book — a small head-tilt, no other movement.

CUT 2 — MS two-shot, 47° FOV, slow push-in from couch height:
Anna walks across the frame, left to right, toward the hallway. Her steps leave wet prints on the hardwood. As she passes the couch, she does not turn her head. Marco's eyes track her — only his eyes, his head stays still. The book stays open on his lap.

CUT 3 — CU on Marco, 18° FOV, static, contre-jour from window behind him:
Marco watches her go. A single slow blink. His jaw shifts once. He looks back down at the book but doesn't read — his eyes stay on the same spot. Off-screen, the bedroom door clicks shut.

ENDS ON: Marco alone in frame, close-up, eyes locked on one unread line of the book, jaw set — the couch and rain-lit window behind him. (Scene 2 opens on this exact frame or on a match-cut from the bedroom door.)

SFX: rain against glass from frame one → the door's hinge, her wet footfalls on hardwood → the distant click of the bedroom door, then just the rain.
```

Notice: the script gave you 28 words. The prompt is detailed because the **directing** is detailed — blocking, eye-line, what each character is doing with their body, what the camera sees and when, what the light is doing, and an exact handoff frame for whatever comes next. That's the job.

## A worked revision (the most common real request)

The user comes back: *"Split scene 1 into two — I want to hold her in the doorway longer."*

What you do — and don't do:

1. Read the Project Bible from the existing HTML (characters, slug, style, statuses survive).
2. Scene 1 becomes prompts `1a` + `1b`. **The scene number does not change**, the checkbox does not change, `data-scene="1"` stays — her saved progress is untouched.
3. `1a` = the doorway alone, given full air: the door, the silhouette, the drip, his head-tilt — 15 seconds of standing still that now has room to work. It gets a **new ENDS ON**: "Anna mid-first-step from the door, eyes still down; Marco's eyes just lifting."
4. `1b` opens from exactly that frame and carries the cross + his close-up. Its ENDS ON is the OLD 1a's ENDS ON — the handoff to scene 2 is preserved, so scene 2 needs no regeneration.
5. Statuses: `1a` keeps the old prompt's saved status only if the user says the doorway keeper survives; otherwise both start "not started". Say which in chat, one line.
6. Re-render the same file, same slug, and present it. Total diff: one scene touched, zero renumbering, zero collateral regeneration.

The instinct to resist: rewriting neighboring scenes "while you're at it". A revision touches what the user asked and the minimum around it — regeneration costs the user money.
