# Extras — aspect-ratio variants and music sync

Read this file only when triggered: the user asks for a vertical/square version (9:16, 1:1, Reels/Shorts/TikTok) or provides a music track / BPM ("cut it to 120 BPM", attaches audio, names a song).

## Aspect ratios and deliverables

The default board is **16:9**. Real ad campaigns also ship 9:16 (Reels/Shorts/TikTok) and 1:1 (feed). Handle it in two layers:

1. **Always, in every prompt** (this half is baked into the core skill): compose center-safe. Keep the key action and the product inside the central ~40% of frame width, avoid staging critical business at the extreme left/right edges, and never put must-read elements in the top/bottom 10% (platform UI overlays live there). This costs nothing and makes reframing possible.
2. **On request** ("make a vertical version", "I need 9:16"): re-render the board — or add a per-prompt variant block — with **recomposed framing**, not just a changed ratio word:
   - tighter shot sizes (medium → medium-close)
   - vertical blocking (stack characters in depth instead of side-by-side)
   - camera height adjusted so headroom works in 9:16
   - Add `9:16 vertical` / `1:1 square` to the Style line of each variant prompt
   - Label variants `1a-v` (vertical) / `1a-sq` (square). Same scene numbers, same checkboxes — statuses are tracked per variant id.

Keep the Style CORE stable across variants — center-safe is a composition instruction that lives inside the CUT lines where framing is described, not another CORE rule.

Record shipped variants in the Project Bible (`variants` key) so revisions know they exist.

## Music sync (track or BPM provided)

- Compute the beat grid: at **B BPM, one beat = 60/B seconds; one 4/4 bar = 240/B seconds**. At 120 BPM: beat 0.5s, bar 2s — a 15s prompt holds 7.5 bars.
- **Cut on the bar, move on the beat.** Design each CUT's length as a whole number of bars (2 bars / 4 bars), and write physical actions ON numbered beats: "BEAT 1 — heel plants; BEAT 2 — shoulder drop; BEATS 3–4 — the spin". This is how choreography, jump-cut montages, and product reveals lock to the track in the edit.
- Note the grid in the prompt label ("Prompt 2a · 15s · 120 BPM · cuts on bars") and put the beat plan inside the CUT lines, not as a separate block.
- The generation itself stays **without music** (Audio spec: diegetic only) — the track is added in post; the beat grid only shapes the TIMING of action so the edit lands on it. If Higgsfield's music-input feature is used instead, name the track as an asset (`@music_track`) in the Asset Checklist and say the choreography references it.
- Store `bpm` and the per-prompt bar plan in the Project Bible JSON so revisions keep the grid.
