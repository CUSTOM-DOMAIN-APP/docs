# Review log

Every check is made from the rendered MP4s (`python3 scripts/review.py <round>`) plus the per-beat contact sheets
(`node scripts/render.mjs --sheet`). Nothing is judged from the page. Critic prompt: the skill's `reference/CRITIQUE.md`.

Scores 1 to 10. Ship only when EVERY score is ≥ 8, after at least 3 rounds.

---

## Round 1: <what was rendered, when>

| Criterion | Score | Evidence (timestamps, frames, metrics) |
|---|---|---|
| Hook (first 2 s) | | |
| Readability at phone size | | |
| Motion quality | | |
| Variety / pacing | | |
| Brand accuracy | | |
| Sound sync | | |
| Composition (every format) | | |
| Polish | | |

**3 worst problems**
1.
2.
3.

**Fixes for round 2**
1.
2.
3.

---

## Round 1: drafts renders/draft_16x9.mp4 + renders/draft_9x16.mp4 (30 fps, no blur), review/r1/*, per-beat sheets, extra stills pulled with ffmpeg

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 7 | f0 (0.000 s) already shows the eyebrow plus "Your customers" on night, and it reads at 360 px in both formats. "fail" pops at 0.49 s, "at *the finish line.*" at 1.0 s (+67 ms). The progress bar crawls to 94 % by 2.5 s and the "Setup abandoned at DNS" chip lands at 3.0 s. The promise is clear by 1.5 s. Against it: the type takes up about 30 % of the width, top-left, on an otherwise empty night field. In 9:16 everything below y≈650 at f0 is empty (about 65 % of the frame). The only motion in the first 2 s is word rises. Clean, but it would not stop a scroll. |
| Readability at phone size | 5 | CAP 6: the 16:9 end card at 360 px (41.5 s) has a "Start free trial" label about 5 px tall and a customdomain.ai URL about 6 px tall. The headline is roughly 4× more legible than the CTA. In 16:9 the "real flow" step text (24 to 32 s: "Looking up your DNS", "Writing records…") and the registrar flags (8.5 to 12.5 s) are 3 to 4 px in phone_16x9.jpg and do not read. In 9:16 the CTA is about 9 px (readable) but is not the most legible thing. safe_9x16.jpg: the homework card's copy buttons (6 to 7.5 s), the registrar's TTL/86400 column (8 to 12.5 s) and the provider-tile column (36.5 to 38 s) all cross into the right UI zone. All serif captions read well. |
| Motion quality | 5 | CAP 6, because opacity is used as an exit or enter: the chip and "94 %" dim to grey at 3.63 to 3.73 s; the tree mark fades to grey at 22.8 s; the whole Authorize card fades at 27.93 to 28.0 s; the CTA button enters at about 40 % opacity at 39.47 s and the URL fades in at 39.6 s. Whip (strip_fast2, f229 to f240): the outgoing "homework" card never moves. It stays parked at x≈1270 to 1460 behind the incoming registrar panel for 8 frames and then vanishes on f240. The panel jumps about 370 px in one frame with no blur. Good: words rise through masks, the card morph at 6.0 s is clean, and the circle wipe (strip_fast, f601 to f605) expands in a clean arc from the junction. |
| Variety / pacing | 6 | No cap: max_gap_between_visual_events is 2.53 s (from 39.47 s) and longest_static is 1.5 s (from 24.27 s). From 23.0 to 34.0 s, though, it is one locked-off composition for 11 s: a serif caption at left in the same size and position, the widget card at right at the same 40 % width, no camera move. Five captions, one shot. Shot size changes only at 20 s (tree) and 34 s (giant "0"). The ending slows down instead of building: 34 to 42 s is three slow type cards ("0" → provider wall → end card), and nothing escalates into the logo. |
| Brand accuracy | 7 | Night samples (11,9,7) ≈ #0c0a09 and paper (250,250,247). Display type is Instrument Serif with italic emphasis, records are Geist Mono, UI is Inter. The tree matches assets/brand/tree-mark.svg. Errors are inverted chips with no red. The claims 150+ / 40+ / 0 match the brief. Against it: the MP4 is YUV-encoded with the BT.601 matrix but tagged BT.709. Decoded per its tag, the green check at 32.5 s is (9,142,71) = #098e47, not #16a34a (stills/16x9/t32.500.png has exactly 22,163,74). So the brand's one accent is wrong in every player that honours the tag. The flood also includes invented narrative chips ("Customer churned", "Ticket #4812"). |
| Sound sync | 6 | CAP 6: the canopy pop at 20.25 s is −167 ms (> 80 ms). Only 25 of 48 non-tick cues are within ±45 ms. 22 of the 23 misses are ±67 ms. Eighteen are −67 ms (picture 2 frames ahead of the sound) on the clicks and checks: 5.5, 6.0, 6.75, 7.0, 15.5, 16.0, 20.5, 21.0, 23.75, 24.5, 25.25, 26.5, 28.5, 29.0, 29.5, 30.5, the 32.0 "live" thump and the 40.51 CTA press. Four are +67 ms (1.0 "the finish line.", 13.75 "dies.", 20.75, 27.75 Allow). A systematic 2-frame offset. Loudness is −14.1 LUFS ✓, true peak −1.3 dBTP ✓, LRA 4.5 LU. |
| Composition (every format) | 4 | CAP 7 (9:16): for most of the film the bottom 35 to 55 % of the frame is empty. 0 to 3.7 s: nothing below y≈1000. 8 to 12.5 s: the registrar ends at y≈940 and the chips at about 1130. 13 to 15 s: slab type only in the upper half. 23 to 34 s: the widget ends at y≈1250. 38 to 42 s: the end card ends at y≈1150. 16:9: the UI cards are 25 to 40 % of the frame width, parked right, and the camera never moves. The thesis diagram (15 to 20 s) is three cards of about 230 px along the bottom third with an empty centre. The film's key moment, the human being yanked out, is the smallest thing on screen. Depth only shows as the paper cards' soft shadow and a brief registrar tilt at the whip. |
| Polish | 4 | CAP 7: blank frames mid-film. near_blank_frames: 3.77 to 4.03 s, 8 black frames (only the background type between hook and B); 22.8 to 23.03 s, 7 empty paper frames after the tree fades; 35.87 to 36.0 s, 4 empty paper frames; 37.97 to 38.03 s, 2 frames; 15.03 s, 4 frames. loop_seam_jump is 227.4: a hard cut from the white end card to the black hook (failure mode 3). Double exposure at the whip, 7.73 to 7.97 s. Orphaned caption: "They approve *once.*" exits about 4 frames before the Authorize card at 27.9 s. Glyph slivers at 15.1 s (two descender ticks from the incoming headline), at 7.8 s (dash sliver under the exiting headline), and on the 9:16 sheets at b72/b76 (dots of the second line's glyph tops). The cursor sits parked at the right frame edge from 23.3 to 25.6 s (16:9). |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **No spectacle in the blocking, so the film reads as a slideshow of small cards (0 to 42 s, worst 15 to 20 s and 23 to 34 s; 9:16 throughout).** Cause: every UI element is built at native size, parked on one side and filmed with a locked-off camera. The 9:16 cut stacks everything into the top 50 to 65 % instead of re-blocking for the tall frame. The solution act repeats one layout five times, and the three-actor diagram (the thesis) is played at thumbnail scale. Against the "HIGHLY SPECTACULAR" bar this is the biggest gap. The two genuine spectacle moments, the error flood at 12.6 to 13.0 s and the circle wipe at 20.0 to 20.2 s, are the only times the frame is used fully.
2. **Act and scene handoffs empty the frame and use fades (3.63 to 4.03, 7.73 to 8.0, 22.8 to 23.03, 27.9 to 28.0, 35.87 to 36.0, 37.97 to 38.03 s).** Cause: scene windows do not overlap. The outgoing scene exits completely, often by opacity, before the incoming element has size. The whip does not carry the outgoing card. The result is 25 near-blank frames, a double exposure and an orphaned caption, and momentum drops at every boundary, including the two biggest ones (hook→B and turn→flow).
3. **The payoff is the weakest frame: a tiny CTA, an empty end card and a broken loop (38 to 42 s).** Cause: the end card is a left-aligned type stack with the CTA and URL at UI size (label about 5 px at 360 px in 16:9). Nothing new happens after the 40.5 s press, the bottom 40 % of 9:16 is empty, and the last frame is paper cut against a night f0 (seam jump 227).

**Fixes for round 2** (concrete, testable, one per problem: what changes, where, and how to verify it)
1. Give the camera a job, and re-block 9:16 as its own layout.
   - (a) Solution act, 23 to 34 s: push in on the widget at each step, so the active row fills 60 % of the frame width (scale about 2.6→3.2) and the camera pans row to row. Alternate the caption's side and size per step: e.g. "They approve *once.*" crosses the frame as a 196 px line while the card passes under it. On "live" at 32 s, push through the URL bar so "https://everjust.co" is full width.
   - (b) Diagram, 15 to 20 s: build the three nodes at 2× size across the full width (9:16: a full-height column with nodes at y≈450/950/1450). The human node's shake and yank should fill at least 1/3 of the frame.
   - (c) 9:16: every UI shot sits centred in y 700 to 1536 with the caption at y 300 to 650, and nothing key at x>950.
   - Verify: in phone_9x16.jpg no frame between 0.5 and 41 s has an empty horizontal band taller than 1/3 of the frame. The 23 to 34 s contact rows show at least 4 distinct framings. safe_9x16.jpg shows no key text in the pink zones.
2. Overlap every handoff by at least 4 frames and ban opacity transitions.
   - The incoming element must be at 50 % or more of its final size on the first frame the outgoing element leaves.
   - Hook→B (3.6 to 4.0 s): the bar's 94 % chip drops while "You ship" rises at the same time.
   - Turn→flow (22.6 to 23.0 s): the lockup slides up and out while the widget rises into the same frame. The tree scales down into the widget's "Powered by" mark instead of fading.
   - The Authorize card (27.9 s) morphs into the "Setting up" card inside the one container, as the style guide demands. The caption leaves together with its card.
   - Whip (7.7 to 8.0 s): translate the homework card and its headline left with the camera at the same velocity as the incoming panel.
   - The CTA and URL enter by scale-pop and mask.
   - Verify: metrics.near_blank_frames is empty; strip_fast2 shows the homework card leaving frame-left by f236; no extracted frame shows any element at intermediate opacity.
3. Rebuild the end card as the hero frame and close the loop.
   - CTA at 1080p: 16:9 button height ≥ 110 px with a label ≥ 44 px; URL ≥ 48 px Geist Mono. In 9:16 the CTA stack is centred around y≈1200, so the lockup, CTA and URL span y 350 to 1500.
   - Add one new event in 40.5 to 41.5 s, e.g. the underline sweep re-runs, or the tree's canopy circles land one by one.
   - In the last 6 frames, reverse the circle wipe to night into the tree, landing on the f0 layout so the loop is continuous.
   - Verify: at 360 px in phone_16x9.jpg the CTA label is ≥ 12 px tall and is the most legible element after the headline; loop_seam_jump < 40; no static run > 1.0 s after 39 s.

**Verdict:** ANOTHER ROUND

---

## Round 2: drafts renders/draft_16x9.mp4 + renders/draft_9x16.mp4 (30 fps, no blur), review/r2/*, current per-beat sheets, sync cues stepped frame by frame in both formats

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 7 | 9:16 improved: a 190 px counter now anchors the lower frame (0 % → 94 %, y≈1380), so the f0 frame is no longer two-thirds empty. 16:9 is unchanged from round 1: f0 "Your customers" reads at 0.0 s and the promise lands at 1.0 s. It is still a mid-size serif line top-left plus a hairline bar on night, and nothing moves in seconds 1 to 3 except the crawl (longest_static 1.53 s from 1.43 s). The round 1 "would not stop a scroll" problem is still visible, so the score is held at 7. |
| Readability at phone size | 5 | Fixed: the CTA is now legible. 16:9 button about 110 px with a label of about 8 px at 360 px wide; URL about 10 px. 9:16 button 128 px with a label of about 10 px at 360. Still visible from round 1, so held at 5: safe_9x16.jpg shows the registrar's right column (TTL/86400 flag) in the right UI zone at 8 to 12.5 s, plus the "Live" pill at 33 s and a provider tile at 36 s. New: in 16:9 at 4.3 to 6.0 s the camera push slides the card over the shot's key line. "Connect your *domain.*" loses "n." under the card's left edge at x≈960 (full frame at 4.7 s). |
| Motion quality | 6 | Fixed, all checked: no opacity transitions remain. The CTA snaps by scale at 39.50 s and the URL at 39.53 s; the tree no longer fades; the 94 % chip leaves with the vertical pan at 3.6 to 4.0 s. The whip carries the homework card and its headline left on one curve, and the card is out of frame by f238 (strip_fast f230 to f238). The widget swaps in one container as a carousel (27.97 to 28.2 s), and the provider wall flies in while the "0" leaves (35.6 to 36.2 s). Against it: CAP 7 for a jump in a strip. In strip_fast2 the human card disappears between f593 (19.767 s) and f594 (19.800 s), and the camera snaps from the push-in to the wide on the same frame. The film's central action, the person being removed, happens between two frames. The iris (41.90 to 41.97 s) runs only 3 frames and covers about 35 % of the frame before the cut. At 26.0 to 26.1 s the card sweeps over the rising "They approve" while changing sides. |
| Variety / pacing | 7 | Fixed: the 23 to 34 s act now has at least 5 distinct framings: a push on the provider row (24.5 s), card left / caption right (26 s), the carousel (28 s), caption right (30 s), and the push through the URL to full width (33.0 to 34.0 s). Shot sizes vary: wide diagram → push into the human (18.5 to 19.7 s) → ECU URL → giant "0". max_gap_between_visual_events is 2.83 s (from 1.07 s) and longest_static is 1.53 s, so no cap. Still: the strongest image comes at 33 s, and the last 4 s (38 to 42 s) are a left-aligned type stack. The film still slows down into the logo. |
| Brand accuracy | 8 | Fixed: the green now decodes as (20,162,73) ≈ #16a34a in both formats under BT.709. Paper is (250,250,247) and night (11,9,7). The lockup matches the live site's header (assets/cap/home_top.png: tree plus serif "CustomDomain™"). The Authorize card matches the site's live widget (dash.cloudflare.com bar, "Authorizing…" spinner, "Powered by CustomDomain™"). "150+ DNS providers · 40+ set up automatically" and the end line "Your customers should never *touch DNS.*" are the site's own copy. Errors are inverted chips with no red. The invented chips are gone, and "Support: my domain is not working" sits in the background type. Green appears only on finished checks and the live state. |
| Sound sync | 7 | Judged by stepping frames, as asked; the metric's −67 ms readings are detector lead. On the hit frame: the "Host vs. full domain" chip at n=255 (8.50 s); the "Looking up your DNS" check at n=735 (24.5 s); the first canopy circle at n=608 (20.25 s, so the metric's −167 ms is an artifact); the A and CNAME checks at n=855 (28.5 s) and n=870 (29.0 s). The Allow press swaps to "Authorizing…" at n=833, +21 ms from the 27.746 s cue. Misses: the "live" thump at 32.0 s falls on a carousel swap. The check first shows at n=961 (+33 ms) and the card reads at n=962 (+67 ms). The "Start free trial" click at 40.51 s has no visible press: frames 1213 to 1217 show the cursor arriving but the button never depresses. Loudness is −14.1 LUFS ✓ and true peak −1.1 dBTP ✓ (just inside the limit). |
| Composition (every format) | 4 | Much improved: the 16:9 camera now pushes and alternates sides; the 9:16 diagram is a full-height column with nodes at y≈450 to 1500; the 9:16 slab is 4 lines; the 9:16 live push fills the top 70 %. But the round 1 9:16 problem is still visible, so the score is held at 4. More than a third of the frame is empty for over 1 s at: 4.2 to 7.5 s (the card ends at y≈1230); 8.0 to 9.6 s (the registrar ends at y≈1080, so 44 % is empty); 38.0 to 39.4 s (the headline alone, about 60 % empty); and 39.5 to 42 s (the end card ends at y≈1350). 16:9 end card: a text stack top-left over about 45 % of the width, with the lower-right 40 % empty. 16:9 at 4.3 to 6.0 s: the card overlaps the headline (see Readability). |
| Polish | 4 | Fixed: blank handoffs went from 25 to 5 low-detail frames (16:9: 15.03, 35.93 to 35.97, 37.97 to 38.0; 9:16: 15.03, 35.97, 38.0). near_blank_frames shows 1. The whip double exposure is gone. The caption/card orphan at 27.9 s is down to about 2 frames. Still visible from round 1, so held at 4: glyph slivers. "• ·" dots under "Every provider" (b72, 36.1 s, both formats); "' ''" under "Your customers" (9:16 b76, 38.1 s); "- - - -" left by the exiting "Their domain, *live.*" (32.73 s). Loop seam: loop_seam_jump is 123.9 (target < 40), because the iris never closes. New: "Powered by CustomDomain™" is half-cropped at the bottom frame edge throughout the URL push (33.0 to 34.0 s, glyph tops at y≈1060 to 1080). The "150+ DNS providers" stats line is left alone on paper at 37.9 to 38.0 s. The carousel shows the outgoing footer "Deny · Powered by CustomDomain™" over the incoming "Setting up" title at 28.1 s (b56, both formats). |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **9:16 is still not re-blocked in the problem act or the ending (4.2 to 9.6 s, 38.0 to 42.0 s).** Cause: in the B card, registrar and end-card layouts, 9:16 reuses the 16:9 element sizes and anchors them at the top. The registrar sits at y≈420 to 1080 with 44 % of the frame empty below it. The end card's lockup, CTA and URL stack stops at y≈1350, and 38.0 to 39.4 s is the headline alone over an empty 60 %. The registrar's right column and the 33 s "Live" pill sit in the right UI zone. The feed format is the one most viewers will see, and it is the weaker cut.
2. **The thesis payoff can't be seen, and key lines are covered by the camera (19.77→19.80 s, 4.3 to 6.0 s, 26.0 to 26.1 s).** Cause: the yank is a one-frame translate, and the camera snaps from push to wide on the same frame. So the human node is visible at f593 and gone at f594: no anticipation, no travel, and only a white sliver at the bottom-left. The new push-ins move the card into the caption column: "Connect your *domain.*" loses "n." for about 1.7 s, and the card sweeps over "They approve".
3. **The ending is the weakest moment and the loop still jumps (37.9 to 42.0 s).** Cause: after the URL push-through at 33 to 34 s, the film steps down to a top-left type stack. The 40.51 s click has no press on screen, and the iris starts at 41.90 s, so it covers only 3 frames and about 35 % of the frame before the cut to the night f0 (seam 123.9). The stats line is left alone at 37.9 to 38.0 s. The film's own closing line is the site's H1, and on the site it is set larger and with more presence than in the film's last frame.

**Fixes for round 3** (concrete, testable, one per problem: what changes, where, and how to verify it)
1. Re-block 9:16 at 4 to 12.5 s and 38 to 42 s.
   - B card: scale to about ×2.6 and centre it in y 650 to 1450.
   - Registrar: camera ×1.35 on the panel, so the panel spans x 60 to 940 and y 420 to 1250, with the chip list stacked beneath to y≈1536. Crop the TTL column to stay left of x 950, or move the 86400 flag under its row.
   - 38.0 to 39.4 s: the headline enters at 150 px centred around y≈800, with the tree mark rising beneath it in the same beat.
   - End card: centre the stack in y 420 to 1500 (headline about 150 px, lockup about 90 px, CTA 128 px, URL 62 px).
   - Live push at 33 s: keep the "Live" pill inside x ≤ 950.
   - Verify: phone_9x16.jpg has no frame with an empty band taller than 1/3 of the frame between 0.5 s and 41.5 s; safe_9x16.jpg shows no text in the pink zones at 8 to 13 s, 33 s or 36 s.
2. Make the yank and the key lines readable.
   - The human node's yank runs over at least 6 frames (19.55 to 19.75 s): 2 frames of anticipation (lift and squash), then the exit down-left on a fast spring, with the camera holding the push.
   - Cut to the wide on 19.75 s (b39.5, the stop-time) as a deliberate hard cut.
   - In every frame from 4.0 to 8.0 s and 23 to 32 s, keep the caption's bounding box at least 48 px clear of the card's bounds. Clamp the camera pan or move the caption.
   - Verify: a 19.4 to 19.9 s strip shows the human card on at least 5 consecutive frames of the exit; stills at 4.7, 5.3 and 26.05 s show no caption glyph under a card.
3. Make the end card the hero and finish the loop.
   - On n=1215 (40.51 s), the CTA scales to 0.96 and darkens by about 8 %, with a 6-frame spring back.
   - The iris starts at 41.50 s centred on the tree mark, is fully closed by f1258 on night, and f1259 matches f0 (the eyebrow plus "Your customers" in the same place).
   - The stats line exits with the tiles, by 37.8 s.
   - 16:9: raise the end headline to at least 140 px and centre the whole stack vertically, so it holds the frame the way the site's hero does.
   - Verify: loop_seam_jump < 40; no low-detail frame at 37.9 to 38.0 s; the press is visible at frames 1215 to 1217.

**Verdict:** ANOTHER ROUND

---

## Round 3: drafts renders/draft_16x9.mp4 + renders/draft_9x16.mp4 (30 fps, no blur), review/r3/*, current per-beat sheets, cues stepped frame by frame, true peak re-measured (ebur128)

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 7 | Better: a slow push, an 8 px bar, and stage checks ticking off in paper, not green (Build at 0.8 s, Publish at 1.5 s). f0 reads "Your customers" plus the bar, and the promise lands at 1.0 s. New fault: the fill is misregistered against the track. It starts about 110 px right of the Sign up tick (x≈280 vs 172) and runs about 110 px ahead of every stage: at 1.2 s it is past the Publish tick while Publish is unchecked. At the 94 % stall (3.0 to 3.7 s) it runs past the "Connect domain" tick (x≈1752) to the end of the track (x≈1905). The picture shows a finished bar while the line says the customer fails at the finish. Same in 9:16. Held at 7. |
| Readability at phone size | 5 | Fixed: the 16:9 end card is now the most legible frame. Headline 150 px, CTA about 116 px tall with a 44 px label, URL 54 px; at 360 px everything reads (phone_16x9 40 to 41 s). 9:16 CTA 128 px, URL 62 px. The B caption is clear of the card (4 to 6 s). Still visible from rounds 1 and 2, so held at 5: in safe_9x16.jpg the registrar still crosses x 950. At 8.3 s, at 1.32×, the VALUE column is cut at the right frame edge; at 10 to 12.5 s the highlighted "86400" TTL box sits at x≈960 to 1035 in the right UI zone. |
| Motion quality | 7 | Hook→B pan (strip_fast2 f112 to f123): the two shots travel together and the card leads, with no gap. The whip still carries the card (strip_fast f230 to f238). The yank now has anticipation: a lift at 19.53 s and a swell at 19.57 s. It falls tilted at 19.60 and 19.63 s and is gone at 19.67 s (3 frames of travel at 30 fps). The iris closes cleanly on the tree from 41.45 to 41.93 s. No opacity transitions found. CAP 7: the stop-time pull-back is still a one-frame scale jump. 19.767 s is at about 1.6× with node labels about 60 px; 19.800 s is at about 0.9× with the nodes on the bottom third. The spring only moves the nodes together afterwards. |
| Variety / pacing | 8 | max_gap_between_visual_events is 2.83 s (from 1.07 s); longest_static is 1.17 s (from 28.63 s). Transition types: vertical pan (3.7 s, 22.9 s), whip (7.7 s), slab (13.0 s), hard cut (15.0 s), push and stop-time (19.75 s), circle wipe (20.0 s), carousel (24 to 32 s), push through the URL (32.7 to 34 s), tiles flying in over the exiting "0" (35.7 s), iris (41.45 s). Shot sizes run from wide diagram to extreme close-up on the URL to giant numeral. The ending now builds: the headline at 38.0 s, the live card at 38.5 s, the lockup at 39.0 s, the CTA at 39.5 s, the press at 40.5 s, two underline sweeps, then the iris into the hook. Nothing static for more than 1.2 s. |
| Brand accuracy | 8 | Green is #16a34a, used only on finished checks and the live state. The hook's stage checks are paper on night (sampled: no chroma anywhere in the 1.2 s and 2.8 s frames). Paper (250,250,247), night (11,9,7). The lockup and widget match assets/cap/home_top.png. The end card pairs the site's own H1 with the real live card. Claims are 150+ / 40+ / 0 only. Errors are inverted. |
| Sound sync | 6 | CAP 6: loudness is off target. True peak is −0.5 dBTP (ebur128 peak=true, both formats; limit −1.0). The sample peaks are −0.97 dBFS at 12.0 s (error 5 shutter) and −1.12 dBFS at 10.5 s, so the limiter is missing or sits after the encode. Integrated is −14.1 LUFS ✓. Picture sync, stepped frame by frame: the Allow press changes at n=833 (+21 ms; the metric's +100 is wrong); the live card reads on n=960 (on the hit); the CTA press darkens and shrinks at n=1216 (+33 ms), deepest at n=1218, and settles by n=1220; the canopy and chips are on the hit, as in round 2. The Build check pops at n=24 (0.80 s, +50 ms), one frame late. |
| Composition (every format) | 4 | Much improved, and 16:9 is now strong. The end card fills the frame: the 3-line headline at left, the live card at right with depth and shadow. The flow pushes alternate sides, and the live URL fills the width. 9:16: the B card is centred (y≈790 to 1305); the registrar push fills y 430 to 1370; the end stack runs y 450 to 1460. Still visible from rounds 1 and 2, so held at 4: in 9:16 from 38.0 to 39.5 s more than a third of the frame is empty. At 38.3 s the headline fills y 500 to 770 and the lower 60 % is empty; at 38.8 s it ends at y≈960; at 39.3 s the lockup ends at y≈1100 (43 % empty). Also at 10.3 to 11.5 s, after the pull-back to 0.82×, the panel and chips end at y≈1230, leaving about 36 % empty. |
| Polish | 4 | Fixed: loop_seam_jump went from 123.9 to 2.6, because the iris lands on a repainted f0. The live push no longer crops the footer. The proof stats line collapses with the tiles. Low-detail frames: 15.03 s (the bar cut), 35.93 to 35.97 s, 38.0 s (acknowledged). Still visible from round 2, so held at 4: the exit sliver at 32.73 s, where a row of descender dots from "*live.*" stays on screen for 1 frame after the line has gone (16:9, x≈140 to 315, y≈470 to 520). Also new: at f0 there is a clipped half check-circle reading as "(" left of "Sign up" (both formats), and the cursor parks over "free" in the CTA label from 40.53 to 41.9 s (in 9:16 too). |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **The hook's picture contradicts its line (0.0 to 3.7 s, both formats).** Cause: the progress fill is offset and scaled against the track and stage ticks. It starts about 110 px right of Sign up and reaches each tick before its check fires. At the 94 % stall it has passed "Connect domain" and touched the end of the track. "Your customers fail at the finish line" is shown over a bar that has crossed the finish line. This is the film's first idea, and the eye reads the bar before the chip.
2. **The master breaks the loudness spec (true peak −0.5 dBTP; peaks at 10.5 s and 12.0 s).** Cause: the error shutters at 10.5 and 12.0 s, plus the thumps at 19.7, 21.0, 24.5 and 38.0 s, reach −1.0 to −1.4 dBFS as samples. With no true-peak limiter on the final mix, the inter-sample peaks reach −0.5 dBTP. Platform transcodes will clip or turn the whole film down, and it caps Sync at 6 although the picture is now on the beat.
3. **Three small carry-overs still hold three criteria down (9:16 38.0 to 39.5 s and 8.3 to 12.5 s; 16:9 32.73 s).** Cause:
   - The 9:16 end headline builds at the top of an empty frame for 1.5 s before the lockup and CTA arrive.
   - The registrar push lets the panel's VALUE and TTL columns cross x 950.
   - The "*live.*" mask exit leaves one frame of descender dots.
   
   Each one is cheap to fix, but each is still visible after being flagged, so Readability, Composition and Polish cannot rise until all three are gone.

**Fixes for round 4** (concrete, testable, one per problem: what changes, where, and how to verify it)
1. Register the bar fill to the track. The fill's x0 equals the track's x0 (the Sign up tick), and its width is percentage × track width.
   - Put the "Connect domain" tick at 100 % of the track. Alternatively, keep the ticks and map the progress so the 94 % stall lands about 40 px before the Connect domain tick.
   - Each stage check fires on the frame the fill's end crosses its tick.
   - Verify: crops at 0.8, 1.5 and 3.3 s show the fill end within ±6 px of the Build and Publish ticks on their check frames. At 3.3 s the fill end is left of the Connect domain tick in both formats.
2. Put a true-peak limiter last on the mix, at a ceiling of −1.5 dBTP with 4× oversampling, then re-normalise to −14 LUFS before muxing.
   - Verify: `ffmpeg -i draft.mp4 -af ebur128=peak=true` reports a true peak ≤ −1.0 dBTP and I −14.0 ±0.5 LUFS for both formats.
3. Clear the carry-overs.
   - (a) 9:16 at 38.0 to 39.5 s: build the end stack bottom-up or centred, so the headline lands centred around y≈760 at 38.0 s and the lockup and CTA fill in under it. Or bring the live card in under the headline at 38.5 s, as 16:9 does. Verify: no frame from 38.0 to 41.5 s has an empty band taller than 640 px.
   - (b) 9:16 registrar: clamp the camera so the panel's right edge is ≤ 950 at every frame from 8 to 12.5 s, for example by hiding the VALUE column's tail. Verify: safe_9x16.jpg at 8 to 12 s has no text in the pink zone.
   - (c) The "*live.*" exit hides the line on the frame before 32.73 s. Verify: the 32.70 to 32.77 s frames show no glyph pixels at x 140 to 315, y 460 to 530.

**Verdict:** ANOTHER ROUND

---

## Round 4: drafts renders/draft_16x9.mp4 + renders/draft_9x16.mp4 (30 fps, no blur), review/r4/*, current sheets, frames stepped at every round 3 fix, true peak re-measured (ebur128)

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | Fixed. The fill now starts at the Sign up tick (f0). Fill end sits on the Build tick at 0.8 s and on the Publish tick at 1.5 s, and each check wipes on as the fill arrives: Build at n=22 to 24, Publish at n=45 to 47. The stall at 91 % is about 45 px left of the Connect domain tick (3.3 s), so the picture now says "almost, then stuck". f0 reads "Your customers" plus the bar with Sign up checked, and the stray "(" is gone. The slow push and the 9:16 190 px counter give the first 2 s motion and weight. The promise lands at 1.0 s and the chip at 3.0 s. |
| Readability at phone size | 8 | Fixed: in 9:16 every registrar glyph is left of x 950. The TTL column ends at x≈870 at 11.5 s and 12.4 s, and only the blank panel body crosses (crops checked against an x=950 marker). At 360 px: the 9:16 chips read ("Host vs. full domain", cap height about 8 px); the CTA (128 px button, 50 px label) and the URL (62 px) are the most legible elements on the end card; the 16:9 end card reads (44 px label, 54 px URL). Every serif caption reads in both phone sheets. Short of 9: the 16:9 registrar chips are about 3 px tall at 360 px and do not read (8.5 to 12.5 s). The slab carries the scene's message, but the six failure classes only read in 9:16. |
| Motion quality | 8 | Fixed: the stop-time pull-back is no longer a jump. Frames n=592 to 597 (19.73 to 19.90 s) show the nodes converging at a steady scale, and the camera settles on a spring. No opacity transitions anywhere. The hook→B pan (strip_fast2 f112 to f123) and the B→C whip (strip_fast f230 to f238) move both shots on one curve with clean arcs. The carousel, the URL push and the iris (41.45 to 41.93 s) are clean. Still short of 9: the yank travels only 3 frames (19.600, 19.633, 19.667 s; gone by 19.70 s in 16:9; n=590 to 592 in 9:16), not the 6+ claimed. It reads as a flick, not a throw, at 30 fps. 60 fps doubles it. |
| Variety / pacing | 8 | max_gap_between_visual_events is 2.23 s (from 39.47 s); longest_static is 1.17 s (from 28.63 s). The same varied transition set as round 3: pan, whip, slab, hard cut, push/stop-time, circle wipe, carousel, URL push, tile fly-in, iris. The end builds in 9:16 too: the headline at 38.0 s, the live card under it at 38.25 s, the card pushed out and the lockup in at 38.9 s, the CTA at 39.5 s, the press at 40.5 s, then the iris. |
| Brand accuracy | 8 | Unchanged and correct. Green (20,162,73) ≈ #16a34a appears only on finished checks and the live state; the hook's checks are paper. Paper (250,250,247), night (11,9,7). The widget and lockup match assets/cap/home_top.png. The end line is the site's H1. Claims are 150+ / 40+ / 0. Errors are inverted with no red. |
| Sound sync | 8 | Fixed: I −14.0 LUFS and true peak −1.3 dBTP in both formats (ebur128 peak=true), both within spec. Picture hits, stepped: Build check first visible at n=22 and full at n=24 (cue 0.75 s); Publish at n=45 to 47 (cue 1.49 s); Allow at n=833 (+21 ms); the live card on n=960; the CTA press at n=1216; chips and canopy on the hit. Clicks and checks read within 0 to 2 frames of their sounds. The −67 ms metric entries are detector lead (verified in rounds 2 to 4). |
| Composition (every format) | 4 | Held. A round 3 problem is still visible, and it got worse at the start of the shot. In 9:16, removing the registrar push-in shrank the panel. Content now ends at y≈1000 at 7.9 to 8.3 s, y≈1084 at 8.5 to 9.3 s, y≈1160 at 9.5 to 10.3 s and y≈1236 at 10.5 to 11.1 s. Below that is only the faint background type: 36 to 48 % of the frame for about 3 s, against 36 % at 10.3 to 11.5 s in round 3 (cap 7 condition). Otherwise strong: the 16:9 end card is a full-frame hero; the 9:16 end stack spans y 448 to 1478 with the live card bridging 38.25 to 38.9 s; the diagram column, live push and flow pushes are re-blocked per format. The 9:16 gap at 38.9 to 39.5 s (stack ending at y≈1143) is under 1 s. |
| Polish | 4 | Held. A round 3 problem is still visible: the "*live.*" exit leaves a row of glyph-bottom dots on n=982 (32.733 s) in both formats (16:9 x≈140 to 315, y≈470 to 500; 9:16 the same frame). The 62 % hide rule is not reaching this line. Also: the near-blank paper frame at 38.0 s is still in these drafts (near_blank_frames 1; stated fixed after render, not verifiable), and at 35.93 s there are " to   to   to " stubs of "should" under "*ever see.*" in the proof exit (both formats). Clean elsewhere: loop_seam_jump 2.6, no double exposures, the cursor parks clear of the CTA label, and no orphaned captions. |

**3 worst problems** (ranked by damage to the film, each with timestamp + cause)
1. **9:16 registrar under-fills the frame, 7.9 to 11.1 s.** Cause: to keep glyphs left of x 950, the push-in was dropped and the panel shrank to about 0.8×. The panel and chips now occupy y≈305 to 1000 at the start and grow only one chip per second. The lower 36 to 48 % holds just the background type for about 3 s, in the most chaotic beat of the problem act.
2. **Exit sliver on "*live.*", n=982 (32.733 s), both formats; stubs in the "should *ever see.*" exit at 35.93 s.** Cause: these lines leave by a camera or scene move, or a different exit path, not the caption exit that applies the 62 %-of-lift hide. A row of glyph bottoms survives one frame. Flagged in rounds 2 and 3, so it holds Polish at 4 alone.
3. **The yank, the thesis payoff, is a 3-frame flick (19.60 to 19.67 s).** Cause: the exit spring still clears the frame in about 100 ms, so on the lift-and-throw the card spends 3 frames in transit. The film's central idea, the person removed from the middle, gets less screen time than a check pop.

**Fixes for round 5** (concrete, testable, one per problem: what changes, where, and how to verify it)
1. Re-block the 9:16 registrar vertically, without widening.
   - Keep the panel at x 60 to 950, but make it taller: about 1.15× row height plus an extra empty row, so the panel spans y≈380 to 1180.
   - Give the bottom band a job from 8.0 s: the propagation clock as a large Geist Mono counter (about 120 px, "47:12:09" racing) at y≈1260 to 1400, with the chips stacking above it under the panel. Alternatively, pre-place the chip column from y 1200 down to 1500, so it fills toward the counter.
   - Verify: for every frame from 8.0 to 12.5 s, the 9:16 content extent (non-background pixels) reaches y ≥ 1350, and no glyph sits at x > 950.
2. Apply the hide rule to every exiting line, whatever drives it.
   - Hide a line on the first frame its visible glyph height is under 40 %. That covers the "Their domain, *live.*" exit at 32.7 s and the proof copy at 35.9 s.
   - Verify: n=982 has no glyph pixels at x 100 to 600, y 440 to 520 (16:9) or the 9:16 equivalent; the 35.90 to 35.97 s frames show no stubs under "*ever see.*"; near_blank_frames is empty.
3. Give the yank at least 6 frames of travel at 30 fps.
   - Slow the exit spring, or add a hold: lift at 19.50, throw from 19.55 to 19.75 s, reaching the frame edge on b39.5 (19.75 s) with the stop-time sound.
   - Verify: the card is visible and moving on at least 6 consecutive frames between n=586 and n=593, in both formats.

**Verdict:** ANOTHER ROUND (Composition 4 and Polish 4 are held by carry-overs. Each fix above is small; with them, both criteria have the evidence for 8.)

---

## Round 5: drafts renders/draft_16x9.mp4 + renders/draft_9x16.mp4 (30 fps, no blur), review/r5/*, current sheets, each round 4 fix stepped frame by frame, 9:16 empty-band scan at 2 fps over the whole film, true peak re-measured

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | Holds from round 4. f0 reads "Your customers" plus the registered bar, with Sign up checked. Checks scale-pop in place: Build is a dot at n=19 and readable at n=20 (cue 0.641 s); Publish is a dot at n=42 and readable at n=43 (cue 1.375 s). The stall at 91 % sits left of the Connect domain tick, and the chip lands at 3.0 s. The 9:16 190 px counter anchors the lower frame (empty-band scan ≤ 480 px at 0 to 3.5 s). |
| Readability at phone size | 8 | 9:16: every glyph is left of x 950. The new clock band spans x 88 to 825, and the TTL column ends at x≈870 (12.4 s). At 360 px the chips, the 112 px clock and all captions read; the CTA (128 px, 50 px label) and the URL (62 px) are the most legible elements on the end card. 16:9 end card: 44 px label, 54 px URL. Short of 9, unchanged: the 16:9 registrar chips are about 3 px tall at 360 px (8.5 to 12.5 s). |
| Motion quality | 8 | Yank: anticipation and lift at n=584 to 587 (19.47 to 19.57 s). In 9:16 the throw travels n=586 to 591, accelerating to the right edge: 6 frames ✓. In 16:9 it travels n=587 to 590 (19.57 to 19.67 s), down and out: 4 frames. The pull-back is a spring (n=592 to 597); no jumps. strip_fast (whip, f230 to f238) and strip_fast2 (hook→B pan, f112 to f123): both shots move on one curve. No opacity transitions; the iris runs 41.45 to 41.93 s. |
| Variety / pacing | 8 | max_gap_between_visual_events is 2.23 s (from 39.47 s); longest_static is 1.17 s (from 28.63 s). In 9:16 the racing clock (00:11:16 → 47:55:06 over 8.15 to 12.5 s) adds a new event to the registrar beat. Transition vocabulary and the build into the end card are unchanged from round 4. |
| Brand accuracy | 8 | Unchanged and correct: green #16a34a only on finished checks and the live state; paper (250,250,247); night (11,9,7). The widget and lockup match assets/cap/home_top.png. Claims are 150+ / 40+ / 0. Errors are inverted with no red. The clock and "STILL PENDING" are in Geist Mono, paper on night. |
| Sound sync | 8 | I −14.0 LUFS and true peak −1.1 dBTP in both formats (ebur128 peak=true), within spec but with only 0.1 dB of margin. Stage checks: Build is readable at +26 ms; Publish shows a dot at +25 ms and is readable at +58 ms. Allow is +21 ms, the live card lands on n=960 and the CTA press on n=1216. Clicks and checks read within 0 to 2 frames of their sounds. The −67 ms metric rows are detector lead (verified rounds 2 to 5). |
| Composition (every format) | 7 | Fixed: the 9:16 registrar now fills y 308 to 1488 at every sample from 8.1 to 12.5 s, with a largest empty band of 432 px (panel, chips, then the racing clock). CAP 7 (9:16 with a third of the frame empty for over 1 s), at the turn lockup. From 21.0 to 22.9 s the lockup occupies y≈672 to 1112; the largest empty band is 800 to 960 px (42 to 50 % of the frame) and the wordmark sits on an empty paper field. The tree has shrunk from a roughly 300 px hero (20.8 s) to a roughly 100 px icon. In round 3 I called this "acceptable as a logo moment"; under the cap's letter it is not, and it is the film's turn. Also borderline at 15.0 to 15.9 s: the diagram headline sits alone at y 280 to 504 with a band of 1120 to 1416 px empty below it, until the nodes arrive at about 15.9 s. Everything else in 9:16 has a largest band ≤ 640 px for any stretch over 1 s. |
| Polish | 8 | Fixed: n=982 (32.733 s) is clean in both formats, with no glyph bottoms from "*live.*". The proof exit at 35.90 to 35.97 s leaves no stubs under "*ever see.*". near_blank_frames is empty, and the 37.9 to 38.1 s handoff carries tiles straight into the end headline. loop_seam_jump is 2.6. No double exposures, orphaned captions, carets or leaked type found. Minor: in 9:16 at 37.93 s (n=1138) the flying tiles cross "they *already use.*" during its exit; and at 8.4 s two background Geist Mono lines are printed over each other at y≈1070. |

**3 worst problems** (ranked by damage to the film, each with timestamp + cause)
1. **The 9:16 turn lockup is small and floats on an empty field, 21.0 to 22.9 s.** Cause: the 9:16 lockup reuses the 16:9 lockup scale. The grown tree shrinks into a small icon beside the wordmark, so the frame holds about 440 px of content and 42 to 50 % of it is empty for about 2 s, right at the film's turn. That is the cap 7 condition and the "type centred on an empty field" look.
2. **The 16:9 yank throw is 4 frames; 9:16 has 6 (19.57 to 19.67 s).** Cause: the 16:9 throw falls downward, a shorter path to the frame edge than the 9:16 sideways throw, on the same timing. The thesis payoff is still quicker in the main format than in the vertical.
3. **9:16 diagram start, 15.0 to 15.9 s: the headline sits alone at the top with about 60 to 70 % of the frame empty below it until the nodes arrive.** Cause: the nodes (cues 15.5 s and 16.0 s) build in after a long empty lead-in. In 9:16 the column frame has nothing in it for about 1 s.

**Fixes for round 6** (concrete, testable, one per problem: what changes, where, and how to verify it)
1. Re-block the 9:16 lockup as a vertical hero.
   - The tree keeps its grown size: about 400 px tall, centred at x 540, y 420 to 820.
   - The wordmark sets at full measure underneath (x 60 to 1020, about 150 px cap) at y≈900 to 1080, with "*closes the gap.*" at about 90 px at y≈1140 to 1240.
   - The camera eases the whole lockup up about 40 px over the hold, so it is not static.
   - Verify: the 9:16 largest empty band is ≤ 640 px at every sample from 20.5 to 23.0 s; phone_9x16 at 21 to 22 s shows the lockup spanning at least 45 % of the frame height.
2. Match the 16:9 yank to the 9:16 timing.
   - Throw down and to the left with the camera holding the push, so the card's centre crosses the frame edge on about n=592, not n=590.
   - Alternatively, start the throw 2 frames earlier (n=585).
   - Verify: in 16:9 the human card is visible and moving on at least 6 consecutive frames between n=584 and n=592.
3. Fill the 9:16 diagram opening.
   - Pre-place the three empty node frames (outlined slots at y≈560 to 1500) on the cut at 15.0 s, so the column reads at once and the nodes then pop into their slots on 15.5, 16.0 and 17.0 s.
   - Verify: the largest empty band is ≤ 640 px at every 9:16 sample from 15.0 to 16.0 s.

**Verdict:** ANOTHER ROUND (seven criteria at 8; Composition is capped at 7 by the 9:16 lockup hold. Fix 1 alone clears the cap.)

---

## Round 6: drafts renders/draft_16x9.mp4 + renders/draft_9x16.mp4 (30 fps, no blur), review/r6/*, current sheets, each round 5 fix stepped frame by frame, 9:16 empty-band and x-extent scans at 4 fps over the changed beats, true peak re-measured

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | Holds. f0 reads "Your customers" plus the registered bar. Build pops at n=16 and reads at n=17 (cue 0.541 s, +26 ms); Publish behaves the same way against its 1.314 s cue. The stall at 91 % is left of the Connect domain tick, and the chip lands at 3.0 s. |
| Readability at phone size | 7 | CAP 7: key text in a 9:16 UI zone, a regression from the round 5 lockup fix. At 21.0 to 22.7 s the 172 px wordmark spans x 91 to 970, and the ™ reaches x 996, so "CustomDomain™" crosses the x 950 right UI zone. You can see it in safe_9x16.jpg at 21 s and 22 s, where the "n™" sits in the pink zone. Everything else still passes: the registrar, clock and flow glyphs are all ≤ 950; at 360 px the CTA (128 px, 50 px label) and the URL (62 px) are the most legible things on the end card. |
| Motion quality | 8 | 16:9 yank: the lift is at n=585 (19.50 s), and the throw travels down-left on n=586 to 590 (19.53 to 19.67 s) with growing displacement. It is gone at n=591: 5 frames of visible travel, up from 4. In 9:16 it travels 6 frames. In both formats the pull-back is a spring, with no jumps. The whip and the hook→B pan (strip_fast f230 to f238, strip_fast2 f112 to f123) are clean, with no opacity transitions. |
| Variety / pacing | 8 | max_gap_between_visual_events is 2.23 s (from 39.47 s); longest_static is 1.17 s (from 28.63 s). The pre-placed dashed node slots give the 9:16 diagram opening (15.0 to 15.9 s) a structure on the cut, and the nodes then pop into them. |
| Brand accuracy | 8 | Unchanged and correct: green #16a34a only on finished checks and the live state; paper and night exact; the real widget and lockup; claims 150+ / 40+ / 0; errors inverted, no red. |
| Sound sync | 8 | I −14.0 LUFS and true peak −2.2 dBTP in both formats (ebur128 peak=true), with a safe margin now. Stage checks are on the hit (+26 ms). Allow is +21 ms, the live card lands on n=960 and the CTA press on n=1216. |
| Composition (every format) | 7 | Held at 7: the round 5 cap condition is still visible. The 9:16 lockup is now a vertical stack (tree 290×320 px at y 398 to 719, wordmark at y 824 to 951, tagline at y 1020 to 1123), but it is anchored high. From 21.0 to 22.7 s everything below y≈1123 is empty paper: the largest band is 784 to 800 px (41 to 42 % of the frame) for about 1.7 s. The fix asked for ≤ 640 px. Fixed: the 9:16 diagram opening now shows the three dashed slots from the 15.0 s cut, so the column reads at once. Every other 9:16 beat keeps its largest band ≤ 640 px for any stretch over 1 s. |
| Polish | 8 | near_blank_frames is empty; loop_seam_jump is 2.6. The exits at 32.73 s and 35.9 s are clean. The provider tiles exit downward and no longer cross the exiting type. The background drift rows no longer overprint (8.4 s checked). Minor: the hook fill still rests on each tick for about 3 frames before its check pops (Build n=13 to 16, Publish about n=36 to 39). |

**3 worst problems** (ranked by damage to the film, each with timestamp + cause)
1. **The 9:16 wordmark crosses into the right UI zone, 20.9 to 22.9 s.** Cause: the wordmark was set at 172 px "full measure" with no allowance for the ™ and the safe edge. Its glyphs run to x≈970 and the ™ to x 996, so platform buttons (like, share) will sit on the brand name at the film's turn.
2. **The 9:16 lockup is top-anchored, and the bottom 41 % is empty for about 1.7 s (21.0 to 22.7 s).** Cause: the block was enlarged but kept its top at y≈400, so it ends at y 1123 and the space below is unused. The stack is the right idea, but it is not centred in the safe area.
3. **The hook fill rests on each tick before the check (0.43 to 0.53 s and about 1.20 to 1.30 s).** Cause: the fill reaches the tick about 3 frames before the stage's pop. For a tenth of a second each stage reads as "reached, not passed". It is minor at 30 fps and will halve at 60 fps.

**Fixes for round 7** (concrete, testable, one per problem: what changes, where, and how to verify it)
1. Fit the 9:16 wordmark inside the safe width: set it at about 160 px, or track it down, so the ™'s right edge is ≤ 940 px.
   - Verify: at 21.0 to 22.9 s no non-paper pixel has x > 950 in the lockup band.
2. Centre the lockup block in the safe area (y 300 to 1536): shift the whole stack down about 200 px, so the tree tops at y≈600 and the tagline ends at y≈1330. Alternatively, grow the tree to about 440 px tall.
   - Verify: the largest empty band is ≤ 640 px at every 9:16 sample from 20.75 to 22.9 s.
3. Pop each stage check on the frame the fill end touches its tick, or slow the fill's last 3 frames into the tick so it arrives with the pop.
   - Verify: on frames 13 to 17 and 36 to 40 the check is visible on the first frame where the fill end is within 4 px of its tick.

**Verdict:** ANOTHER ROUND (six criteria at 8. Readability and Composition are both capped at 7 by the same 9:16 lockup. Fixes 1 and 2 are a single re-layout of that one shot.)

---

## Round 7: drafts renders/draft_16x9.mp4 + renders/draft_9x16.mp4 (30 fps, no blur), review/r7/*, current sheets, 9:16 lockup scanned frame by frame (bands and x-extent), 9:16 full-film empty-band run scan at 10 fps, hook ticks stepped, true peak re-measured

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | f0 reads "Your customers" plus the registered bar with Sign up checked, and the promise lands at 1.0 s. Fixed: the checks now fire as the fill arrives. Build: the fill end is within about 4 px of its tick at n=12 and the check pops at n=13 (cue 0.442 s ≈ n=13.3). Publish: the fill touches at n=34 to 35 and the check pops at n=36 (cue 1.191 s ≈ n=35.7). The stall at 91 % is left of the Connect domain tick, and the chip lands at 3.0 s. The 9:16 190 px counter anchors the lower frame. |
| Readability at phone size | 8 | Fixed (round 6 cap lifted): the 9:16 wordmark is now 160 px. Scanning every lockup frame from 21.0 to 22.7 s at luma < 200, the rightmost pixel is the ™ at x 932 to 933, inside 950; safe_9x16.jpg at 21 to 22 s shows nothing in the pink zone. The registrar, clock and flow glyphs are ≤ 950. At 360 px the CTA (128 px button, 50 px label) and the URL (62 px) are the most legible things on the end card; every serif caption reads in both phone sheets. Short of 9: the 16:9 registrar chips are about 3 px tall at 360 px. |
| Motion quality | 8 | Unchanged from round 6, and clean. The yank lifts at n=585 and travels 5 frames in 16:9 (n=586 to 590) and 6 in 9:16. The pull-back is a spring. strip_fast (B→C whip, f230 to f238) and strip_fast2 (hook→B pan, f112 to f123) move both shots on one curve with no gaps. The 9:16 lockup→flow vertical pan (22.75 to 23.15 s) carries the lockup up while the widget rises into the same frame. No opacity transitions; the iris runs 41.45 to 41.93 s. |
| Variety / pacing | 8 | max_gap_between_visual_events is 2.23 s (from 39.47 s); longest_static is 1.20 s (from 21.57 s, the lockup hold, which still eases up 40 px). The full transition vocabulary from round 4 is intact. The end card builds into the CTA press and the iris loop. |
| Brand accuracy | 8 | Unchanged and correct: green #16a34a only on finished checks and the live state; paper (250,250,247); night (11,9,7). The real widget, tree and wordmark match assets/cap/home_top.png. Claims are 150+ / 40+ / 0. Errors are inverted with no red. |
| Sound sync | 8 | I −14.0 LUFS and true peak −2.3 dBTP in both formats (ebur128 peak=true). Stage checks land at 0 to +1 frame from their clicks. Allow is +21 ms, the live card lands on n=960 and the CTA press on n=1216. The −67 ms metric rows are detector lead, verified by stepping in rounds 2 to 7. |
| Composition (every format) | 8 | Fixed (round 5/6 cap lifted): the 9:16 lockup is centred. The tree tops at y≈620, the wordmark is at y≈1010 to 1140 and the tagline lands by 21.13 s; the largest empty band is 612 to 620 px at every frame from 21.13 to 22.7 s, under 640. Frame-accurate run scan of the turn: the band is over 640 px only from 20.233 to 21.10 s (27 frames, 0.9 s), while the tree grows circle by circle as a centred hero mark. That is under the 1 s cap. A full-film 9:16 scan at 10 fps finds no other run over 640 px longer than 1.0 s. The 15.0 to 16.0 s run is the diagram opening, where the dashed slots are present but too faint for the luma scan. All other formats and beats are as in round 6: the 16:9 end card as a full-frame hero, the 9:16 registrar plus clock filling y 308 to 1488, and the diagram column and flow pushes re-blocked per format. |
| Polish | 8 | near_blank_frames is empty; loop_seam_jump is 2.6. The mask exits at 32.73 s and 35.9 s are clean, with no carets, slivers, double exposures, orphaned captions or leaked type found in the contact sheet, the strips or the stepped frames. The provider tiles exit downward clear of the type. The background drift rows don't overprint. |

**3 worst problems** (ranked by damage to the film, each with timestamp + cause; none blocks shipping)
1. **The 9:16 turn opens on a lone tree for 0.9 s (20.23 to 21.10 s)**, with 45 to 49 % of the frame empty around a mark about 300 px tall. Cause: the wordmark rise starts after the canopy finishes. It is inside the cap by 0.1 s, and it is the one remaining place where a 9:16 viewer sees mostly empty paper.
2. **The 16:9 registrar chips don't read at phone size (8.5 to 12.5 s).** Cause: the chips are UI-size labels (about 3 px tall at 360 px wide). In the wide cut the six failure classes register as texture, and the slab line carries the meaning.
3. **The 16:9 yank is 5 frames, not 6 (19.53 to 19.67 s).** Cause: the down-left throw path is still shorter than the 9:16 sideways path on the same timing. At 60 fps with blur it becomes about 10 frames, so this is a draft-rate limit rather than a defect.

**Fixes for the final render** (optional polish, testable)
1. Start the 9:16 wordmark rise 4 to 6 frames earlier (about 20.85 s), overlapping the last canopy pop, or grow the 9:16 tree to about 440 px.
   - Verify: no frame from 20.2 to 21.2 s has a band over 640 px for more than 0.6 s.
2. Scale the 16:9 chips about 1.5× (Inter 600, 22 px at 1080p).
   - Verify: the chip text is at least 5 px tall in phone_16x9.jpg at 10 to 12 s.
3. Start the 16:9 throw at n=584.
   - Verify: the card is visible in transit on at least 6 consecutive frames at 30 fps, and 12 at 60 fps.

**Verdict:** SHIP. Every score is ≥ 8 with evidence, this is round 7 (at least 3), and every problem flagged in rounds 1 to 6 has been verified as fixed in the rendered MP4s.
