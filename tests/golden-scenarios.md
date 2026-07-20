# Golden scenarios — regression tests for skill changes

Any edit to `SKILL.md` or `references/` gets re-run against these three scenarios. Generate a shotlist for each, run the validator, then walk the manual checklist. A regression on a **blocking** criterion means the skill change is rejected.

```
node scripts/validate.mjs shotlist.html
```

The validator covers the mechanical half of the blocking criteria (marked `[auto]` below) — structure, escaping, namespacing, Bible integrity, per-prompt controls, ENDS ON / SFX presence, English-only prompts, @references. What it cannot judge — dramatic quality, semantic continuity, whether the handoff frames actually match — stays manual.

---

## Scenario G1 — smoke (single scene, minimal)

> Night, a 24-hour laundromat. An elderly man watches the drum spin. A soaked courier walks in, sits down next to him. They don’t know each other. The man silently holds out his thermos. The courier hesitates, then takes it.

**i18n variant:** re-run G1 with the same input in another language (e.g. Russian: «Ночь, круглосуточная прачечная. Пожилой мужчина смотрит, как крутится барабан. Заходит промокший курьер, садится рядом. Они не знакомы. Мужчина молча протягивает ему термос. Курьер колеблется, потом берёт.») — B4 still requires English-only prompts, and the non-English run must ship translation mirrors + stale notices (S9).

**Stresses:** minimal input (does the director invent blocking, light, micro-acting?), a dialogue-free two-person emotional beat, one prompt with full 15s of air, contre-jour trap (night interior — default backlight must be replaced with laundromat practicals... which are ARTIFICIAL: the "natural light only" line must be adapted, not copy-pasted).

**Expected shape:** 1 scene, 1–2 prompts, safe/tricky risk, wet-state asset for the courier (@courier_wet), thermos as hero prop with contact points.

## Scenario G2 — continuity marathon (8 scenes, state decay)

> An ad for the TrailPro backpack. The heroine hikes solo for 3 days: packing at home; a dawn start at the trailhead; a midday river ford (soaked to the waist); a storm stop (soaked through, pitches a tarp); morning of day 2 — drying by the fire, jacket on a branch; a mountain pass in fog; the summit at sunset — she pulls a dry hoodie from the pack’s dry compartment; final frame — the backpack by the tent under the stars.

**Stresses:** 8 scenes, character state machine (dry → waist-wet → soaked → drying → dry-in-new-layer), each state = @asset variant; product in every scene without drift; lighting design across dawn/noon/storm/fog/sunset/night (six different Lighting lines — any two identical = fail); handoff chain across 10+ prompts; layout map for the campsite scene.

**Expected shape:** 8 scenes, 10–14 prompts, at least 4 named state variants of the heroine, ENDS ON chain unbroken, campsite layout map in the Asset Checklist.

## Scenario G3 — dialogue and rhythm shift (drama)

> A short film. An auto repair shop, evening. The mechanic (a woman around 50, owner of the shop) is closing up. Her adult son arrives — for the first time in two years. A long awkward conversation: he asks for money, she refuses, he explodes, she stays calm and says: "I’m not your ATM. I’m your mother. Come back when you understand the difference." He leaves. She stands alone, then returns to the car she was working on.

**Stresses:** heavy dialogue (quoted lines with delivery direction, diegetic audio spec), rhythm shift inside one location (slow awkwardness → explosion → still aftermath — prompt splits must follow the DRAMA, not equal 15s arithmetic: the confrontation compressed, the aftermath given air), emotional carry between prompts, restraint rule (her calm > his shouting), single-location continuity (same tools, same car, same light decaying as evening deepens).

**Expected shape:** 1 location, 3–5 scenes/beats, the mother's key line gets its own prompt, aftermath prompt is a long held shot, tricky-dominant risk profile.

---

## Criteria checklist

Blocking (any FAIL rejects the change):

- [ ] B1. `[auto]` Every character/prop/location referenced with @names; `[manual]` state variants have own @names
- [ ] B2. `[auto]` Every prompt ends with ENDS ON + SFX; `[manual]` consecutive prompts chain (ENDS ON N's STATE continues in opening N+1) AND the opening reframes to a different shot size/angle — not an identical-framing jump cut (unless it is a deliberate first-frame-lock single take)
- [ ] B3. `[auto-warn]` No two scenes share one verbatim Lighting line; `[manual]` each line fits the scene's time-of-day/mood
- [ ] B4. `[auto]` Prompts are English regardless of input language — quoted dialogue lines may be in the film's target language; `[manual]` scene descriptions in the user's language
- [ ] B5. `[auto]` Copy-block is standalone (CORE + Lighting + Characters + Scene + CUTs + ENDS ON + SFX)
- [ ] B6. `[auto]` localStorage keys namespaced by slug; Project Bible JSON parses, has required keys, matches DOM ids
- [ ] B7. `[auto]` One checkbox per scene, status/keeper/notes controls per prompt id
- [ ] B8. `[manual]` No abstract emotion without physical action ("she is sad" → fail); no unmotivated camera
- [ ] B9. `[manual]` Dialogue lines quoted with delivery direction; audio spec permits diegetic dialogue; lines read as human speech, not AI cadence (no balanced X-not-Y antithesis, no rule-of-three list, no staccato one-word sentences)
- [ ] B10. `[manual]` G2 only: state machine correct in every prompt (wet where wet, dry where dry, no teleporting states)

Scored (grade 1–10, target ≥8 each):

- [ ] S1. `[manual]` Dramatic split — prompt boundaries follow beats, not arithmetic (G3 is the probe)
- [ ] S2. `[auto]` badge present per prompt · `[manual]` risk level plausible, reason given, high-risk-first advice present
- [ ] S3. `[auto]` runtime summary present · `[manual]` arithmetically consistent with prompt labels
- [ ] S4. `[manual]` Asset Checklist complete — nothing referenced in prompts is missing from it
- [ ] S5. `[manual]` Repair Guide present with symptom→fix mappings intact
- [ ] S6. `[manual]` Layout map described in the Asset Checklist where staging is complex (G2 campsite; G3 optional)
- [ ] S7. `[manual]` Match-cuts designed between scenes where the material allows
- [ ] S8. `[manual]` Center-safe composition noted in CUT framing (reframe-ready for 9:16/1:1)
- [ ] S9. `[auto]` Prompts are click-to-edit with Reset; non-English user gets a per-prompt mirror + stale notice; Export edits present
- [ ] S10. `[auto]` Every checklist asset ships a copy-ready English generation prompt (.asset-item with unique data-asset-id, editable with Reset, mirrored for non-English users, genPrompt in the bible); characters ship BOTH a sheet and an AI Cast variant (aiCastPrompt); `[manual]` prompts follow the patterns in references/asset-prompts.md (split-frame sheets, Soul cast cards ≤75 words, no-branding, ¾ locations, silhouette UI, diagram layout maps)

Revision probe (run after any golden, using its output):

> "Split scene X into two" — verify: scene numbers stable, slug unchanged, only the touched scene regenerated, handoff chain re-stitched, neighboring scenes byte-identical, validator still exits 0.
