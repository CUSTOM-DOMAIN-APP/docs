# Review log: "Under the Button"

## Round 1: draft_16x9.mp4 + draft_9x16.mp4 (voiceover mix, 30 fps, no blur)

Inputs: all of review/r1/, metrics.json in full, frames pulled with ffmpeg in both formats, the audio measured as data against timeline.json "sfx" and cues.json. Every pixel size below is measured at 360 px wide.

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 5 | Frame 0 shows a hairline app card on paper with a black pill and a cursor. In 16:9 the card text is 4.7 px and the button 14 px tall. There are no words until 1.0 s. "The button" reads at about 1.5 s, the full line at 4.5 s, and the actual hook, the iceberg, only arrives at 7.0 to 9.0 s. It is calm and clean, but it won't stop a scroll. |
| Readability at phone size | 6 | 9:16 is good: layer name 21 px, figure 11.7 px, sub-line 9.0 px, legend 7.7 px (15.5 s), URL 17.7 px. 16:9 is not: name 11.2 px, figure 6.6 px, sub-line 4.5 px ("Where is this domain's DNS hosted?"), legend 3.6 px, depth rail 3.4 px, door labels about 3 px, bracket label 6.4 px, "acme.shop is live" 4.5 px. The 16:9 URL is 11.6 px but is the smallest of the four end-card lines (the tagline is 21 px). In 9:16, the "24 h" label reaches x=973/1080, inside the right UI zone (38 to 45 s), and the wordmark passes through the top 14 % at 68.45 s. |
| Motion quality | 6 | Camera eases and the type rise are clean, and the glyphs draw on rather than fade. But the climb at 65.9 to 66.5 s blows the bracket label up into a frame-cropped "CustomDo…" (f1985 to f1988) and the surface lands in a one-frame jump (f1988→f1989). The ink at 6.9 to 7.3 s is a hard-edged band wiping down over paper (strip_fast2), a blind rather than water. The wordmark enters cropped at the top (68.43 s) and eases for 1.2 s. |
| Variety / pacing | 6 | The metric's max_gap of 6.8 s at 16.77 s and longest_static of 6.2 s are false positives: doors pop at 18.58, 18.84 and 19.70 s. By eye the longest hold is 19.7 to 23.5 s, 3.8 s with nothing new, which is more than one bar at 72 bpm. Then certificates hold 2.9 s (43.4 to 46.3 s). All eight layers use the identical beat: drift, type, draw, hold. Layer lengths run 6.5 / 7.3 / 6.2 / 4.0 / 6.0 / 6.5 / 5.0 / 5.0 s, so the build does not accelerate. The pull-back then holds one composition for 6 s. |
| Brand accuracy | 7 | Instrument Serif, Inter, Geist Mono, ink, paper and stone are all correct. A pixel scan finds green only at 67.3 to 68.4 s in both formats and no other saturated colour. ™ is on the bracket label and the end card. All numbers match FACTS: I counted 189 dots with 73 filled. The deductions are copy and glyph drift (see (c)). |
| Sound sync | 6 | Loudness is -14.1 LUFS with a -2.7 dBTP true peak, in spec. SFX peaks sit within 8 ms of every cue in the stem. Picture is off on several hits: all 8 pings are 2 frames early (-67 ms), and by eye the shutter X lands at about 49.93 s against the 50.06 s cue (about -130 ms, over the 80 ms cap). The wordmark is still moving about 35 px/frame at the 68.71 s thump and settles at about 69.6 s. The metric shows 9/24 within 45 ms. Its "renews early -167 ms" is not borne out: by eye the marker lands at 43.37 to 43.40 s. The VO is clear in the speech band (envelope correlation r=0.83 to 0.94), but weakest on d1/e1 (r=0.73) under the music lift, with no duck. |
| Composition (every format) | 6 | The 16:9 descent is well blocked: berg left, text column right. At the 9:16 pull-back (57 to 63.5 s) the berg is a 155 to 175 px strip in a 1080 frame, so about 85 % of the dark lower 65 % is empty for 6 s (cap 7). In 9:16, the bottom third of every layer is bare ice (y 1290 to 1920 at 15.5 s), and 0 to 7 s has 35 % empty paper under the card. On the 16:9 end card, the right 45 % is empty. |
| Polish | 5 | There are no blank frames, and the loop seam is 9.5 (continuous). Problems: a double exposure at the button swap, where the black "Connect domain" pill shows behind the green one at 67.33 to 67.37 s (f2020 to f2021). Layer-1 type ("01 / 08 Provider detection 189 catalogued") leaks back through frame at 66.0 to 66.5 s. In 9:16, the card overprints "Leave the ice to us." at 66.1 to 66.3 s, and in 16:9 the waterline slices "Or embed" at 66.4 s. Door labels collide, "Domain ConnectAPI key" with zero gap, at 18.5 to 24 s. |

**3 worst problems** (ranked by damage to the film)
1. **The brand reveal and ascent fall apart (64.6 to 66.6 s, both formats).** The CustomDomain™ bracket label sits at 6.4 px (16:9) or 6.7 px (9:16) for about 1.1 s (64.7 to 65.8 s). The climb then scales it into a cropped "CustomDo…" with the ™ cut off (66.1 to 66.2 s, 16:9). Layer-1 glyphs and text sweep back through frame, the waterline slices "Or embed one widget." (16:9, 66.4 s), and the app card overprints "Leave the ice to us." (9:16, 66.1 to 66.3 s). Cause: the label and the layers live in world space, so they scale and scroll with a zoom-plus-climb camera. The closing caption is pinned in screen space and never exits before the surface passes through it.
2. **The iceberg never reads as an iceberg at the payoff (57 to 65 s).** The pulled-back berg is a spindle: 180 to 235 px wide by about 860 px tall in 16:9 (about 10 % of the width, aspect about 1:4.5), and 155 to 175 px by about 1070 px in 9:16. It is widest at the top and tapers, the opposite of "grows wider with every layer". The tip is an empty outlined box (1283 to 1379 × 94 to 155 px at 1920) with 0 dark pixels, because the button is not drawn. "A button sitting on all of this" is never seen. Cause: the layers are stacked at their close-up spacing, so the silhouette is just the text column, and the button is culled or too small at that zoom.
3. **The 16:9 cut does not stand without the voice at phone size.** The plain-language sub-lines are 4.5 px, the legends and glyph labels 3 to 3.6 px, the depth rail 3.4 px, "acme.shop is live" 4.5 px, and the door labels collide (18.5 to 24 s). Only the layer name (11.2 px) and figure (6.6 px) survive, so the no-voiceover 16:9 mix loses the explanation of every layer. Cause: the 16:9 type scale is set for desktop, and the text column uses only about 30 % of the width.

**Fixes for round 2** (one per problem: what changes, where, and how to verify it)
1. Rebuild 64.0 to 67.3 s:
   - Hold the bracketed whole-berg shot for at least 1.5 s, with the label in screen space, not world-scaled, at 14 px or more at 360. That is at least 75 px tall at 1920 and at least 42 px at 1080.
   - Rise-exit "Or embed… / Leave the ice to us." and the label before the climb starts at 65.85 s.
   - Set every layer group's opacity to 0 from the start of the climb.
   - Make the climb a straight vertical rise, not a zoom.
   - Verify: a 0.1 s strip of 65.8 to 66.6 s shows no layer glyph or text, no cropped wordmark, and no frame where a caption's box meets the card or the waterline. phone_*.jpg shows the label at 14 px or more for 2 or more samples.
2. Reshape the berg for the pull-back:
   - Make its width grow monotonically with depth: tip about 4 % of the frame width, the layer-8 band at least 35 % in 16:9 and at least 70 % in 9:16. Compress the vertical spacing so it fills about 75 % of the height.
   - Draw the "Connect domain" pill in the tip as solid ink, at least 4 px tall at 360.
   - Verify: at 60 s, the berg width measured at 25, 50 and 75 % depth increases, the widest band is at least 3× the tip, the tip contains dark pill pixels, and empty area in 9:16 is under a third.
3. Re-scale the 16:9 text column:
   - At 1920: sub-lines at least 40 px tall (7.5 px or more at 360), figures at least 50 px, legends and glyph labels at least 30 px, "live" label at least 36 px, URL cap height at least the tagline's.
   - Drop the duplicate "01 / 08" above each title (the rail already has it).
   - Centre door labels under their doors with at least a 1 em gap.
   - Verify: on a new phone_16x9.jpg every must-read line measures 7 px or more and no two label boxes overlap.

**Smaller issues** (ranked)
1. 67.3 to 68.4 s, both: green "live" lasts about 1.0 s, of which 0.9 s is static, before the card drops. Hold it 1.5 s or longer.
2. 68.43 to 69.6 s, both: the wordmark enters cropped at the top edge (and in the 9:16 top UI zone), and the 68.71 s thump lands mid-flight. Land the wordmark on the thump or move the thump to the settle.
3. 67.33 to 67.37 s, both: the black pill is double-exposed behind the green one. Swap them in one frame at the same size.
4. 49.9 to 50.06 s, 16:9: the shutter X lands about 4 frames before its sound, and all pings are 2 frames early. Shift them by +67 ms.
5. 36.5 to 40 s, both: the value-check glyph draws at least 37 ticks between 5 min and 1 h; the 15-min backoff gives 4. Each band also ramps from sparse to dense, which reads as speeding up.
6. 47 to 51 s and 52 to 56 s: the copy drifts. "never one it shouldn't serve" should be "never a certificate for a host it shouldn't". "every domain, hourly" should be "every live domain, hourly".
7. 18.5 to 24 s, 16:9: "Domain ConnectAPI key" collides, and the labels are left-aligned rather than centred under the doors.
8. 6.9 to 7.3 s, 16:9: the ink arrives as a hard-edged band moving down with paper below it. Make it rise, with a wavy edge.
9. 0 to 7 s and 10 to 56 s, 9:16: dead lower third (empty paper, then bare ice).
10. 19.7 to 23.5 s, both: 3.8 s hold with nothing new. Add a beat, for example the counts pulsing in.
11. 73.3 to 76.0 s, both: the end card is effectively static (bounding box grows about 6 px over 2.4 s). The right 45 % of the 16:9 card is empty.
12. 64.0 to 72.8 s, VO mix: the d1/e1 lines are the most masked (r=0.73). Duck the music 3 to 4 dB under them.
13. 0 to 1.0 s, both: no words on frame 0.

**Answers**
- **(a) Iceberg read and continuity.** In 16:9 at 7.5 to 9.5 s, yes: the card sits on a faceted mass that widens downward. The 9:16 reveal is a near-full-width slab. At the pull-back, no: a narrow spindle with an empty tip box. The descent is one continuous take with no cuts: the rail ticks 01 to 08, the shafts fade by about 25 s, and the particles drift. But it feels like a metered scroll, not a dive: eight identical beats of 4 to 7 s with about 1 s moves.
- **(b) Each layer without the voice.** In 9:16, mostly yes: name, figure, plain sentence and glyph all read at 9 px or more. Layer 5's glyph contradicts its own copy. In 16:9 at phone size, no: only the name and figure survive.
- **(c) Accuracy against FACTS.** These match: 189 (counted, 73 filled), 6/1/66, 116, the root-domain forms, 5 s at first, 24 h, Let's Encrypt, about 30 days, first visit, and hourly. There is no alerting claim. Three things drift: the edge sub-line ("serve" instead of "obtain a certificate"; the docs also say pre-live hosts get a "not active yet" page), the monitoring line dropping "live", and the backoff glyph's tick density.
- **(d) The ending.** Half. The green appears once and correctly, but it is about 1 s long, double-exposed, and 4.5 px in 16:9. The wordmark misses its hit. The end card is clean and on-brand (in 9:16: tagline 32 px, wordmark 26 px, URL 18 px), but it holds static for 2.7 s, and the 16:9 version is left-heavy.
- **(e) Brand.** Green is clean, used for done only. The faces are correct. ™ is present on the bracket label and the end card, and is lost only in the cropped frames at 66.1 to 66.2 s.

**Verdict:** ANOTHER ROUND

## Round 2: draft_16x9.mp4 + draft_9x16.mp4 (voiceover mix, 30 fps, no blur)

Inputs: review/r2/, metrics.json, every frame of both renders, and SFX onsets from audio/sfx.wav. Sizes are ink heights at 360 px wide.

| Criterion | Score | Evidence |
|-|-|-|
| Hook (first 2 s) | 5 | Frame 0 now has words (9:16 the full line; 16:9 half, complete about 4.0 s). The 16:9 button is 15 px (was 14). The iceberg still arrives at 7.3 to 9.5 s. |
| Readability at phone size | 6 | 16:9: name 12.9 px, figure 7.3, sub-line 5.6, "live" 7.1 (was 4.5), URL 12.0. Glyph labels 4 to 5 px. "Leave the ice to us." is whole for about 1 frame, the label for 0.43 s. The 9:16 "24 h" still reaches x=973 (UI line 960). |
| Motion quality | 7 | The ink rises with a soft edge. The 9:16 climb and the swap are clean. The label vanishes in one frame (f1960→1961). The 16:9 climb opens with a 1×→4× zoom over f1976 to 1979; the surface leaves the top and returns at 66.23 s. |
| Variety / pacing | 6 | Unchanged: the 3.8 s door hold (19.7 to 23.5 s), eight identical beats, and a static pull-back (57.5 to 63.5 s). |
| Brand accuracy | 7 | Green only at 66.73 to 69.1 s, both formats. Faces and ™ correct. On-screen copy and backoff groups now match FACTS. Voice line b7 still says "serves… never one it shouldn't". |
| Sound sync | 6 | -14.1 LUFS, -2.7 dBTP. Rail lands within 2 frames of each ping; chime on the green (f2002). The shutter is over-corrected: sound 49.81, X 49.93 to 49.97 (+130 ms). The flag completes at 39.30 against a 39.405 pop. d1/e1 r=0.79/0.81 (was 0.73). |
| Composition (every format) | 6 | The pull-back and 16:9 end card are fixed. 9:16: the bottom 29 to 35 % is bare ice in every layer hold; 0 to 7 s has 44 % empty paper. |
| Polish | 6 | All five round-1 defects gone; no blank frames; seam 13.5. New: "renewsexpiry" with zero gap (16:9, 43.4 to 46.5 s). Unflagged before: a 3 to 8 px paper stripe down the 9:16 right edge (8 to 68 s). |

**Round-1 fixes**
1. Ascent: partial. The label is pinned, never cropped; no layer type or caption crosses the climb. But the label holds 0.43 s (asked 1.5) at a 45 px cap (asked 75), and the 16:9 climb still zooms.
2. Iceberg: fixed. At 60 s the 16:9 base is 775 px against a 100 px tip; the 9:16 base is 75 % of the width; the ink pill is drawn.
3. 16:9 type: mostly fixed. Doors centred, duplicate numbers gone.

Smaller items fixed: green hold (1.6 s static), double exposure, pings, backoff, on-screen copy, ink, thump, end card, frame-0 words. Partial: the duck. Not fixed: shutter, 9:16 lower third, 19.7 to 23.5 s hold.

**Regressions**
1. "Leave the ice to us." now shows only 65.43 to 65.73 s, before the voice says it (65.66 to 66.66). The no-voiceover cut loses the payoff line.
2. The label's hold fell from 1.1 s to 0.43 s.
3. "renewsexpiry": the labels grew, the bar did not.
4. The shutter now hits about 4 frames early (round 1 was late).

**3 worst problems**
1. 64.9 to 65.8 s, both formats: the brand reveal and payoff line flash by, compressed to clear before the 65.87 s climb.
2. 16:9, 43.4 to 46.5 s: "renews" and "expiry" touch, because the labels grew on an unchanged bar.
3. 9:16, 10 to 56 s: a bare-ice bottom third, and a paper stripe down the right edge where the water canvas stops short of 1080 px.

**Fixes for round 3**
1. Draw the bracket from 63.8 s so the label lands by 64.3 s and holds to 65.8 s. Set "Or embed one widget. / Leave the ice to us." as one two-line caption, 64.2 to 65.75 s. Verify: every frame from 64.5 to 65.7 s shows the whole label and both lines.
2. Move "renews" above the bar, or widen the bar. Verify: at least a 1 em gap at 44 s and 60 s.
3. In 9:16, re-block each glyph to about y 1250 to 1500, and bleed the water 16 px past the right edge. Verify: content reaches y 1450 in every hold, and on dark frames the rightmost 8 columns are within ±10 of column 1040.

**Smaller issues** (ranked)
1. Move the shutter sound to 49.93 s and the flag pop to 39.30 s.
2. 16:9 climb: copy the 9:16 move (≤15 % scale per frame, waterline always in frame).
3. 19.7 to 23.5 s: add a beat, such as the door counts ticking up.
4. Re-voice b7 to match the screen. Duck the music 2 dB more under d1/e1.
5. Hook: let the berg show faintly from frame 0, or start the ink at about 2.5 s.
6. Inset the 9:16 backoff axis so "24 h" ends at x≤950.

**Verdict:** ANOTHER ROUND

## Changes after round 2
1. **Ascent.**
   - The bracket draws from 63.8 s, and the CustomDomain™ label lands by about 64.3 s. The label holds until the climb starts (B.rise + 0.1).
   - "Or embed one widget. / Leave the ice to us." is now one two-line caption in both formats. It holds from 64.2 s to about 65.8 s.
2. **16:9 climb.** The view height changes geometrically (log-space zoom) from the pull-back to the press, so the change per frame stays at or under about 15 % at 30 fps. The view centre moves by the same fraction as the view height, so the waterline is in every frame. The press is 0.4 beats later, to give the climb room.
3. **Certificate.** The bar is longer and "renews" sits at 62 % along it, so "renews" and "expiry" no longer touch.
4. **9:16 blocking.**
   - Every glyph sits 190 px lower (centred at about y 1370).
   - The water bleeds 16 px past the right edge, which removes the paper stripe.
   - The backoff axis is 740 px wide, so "24 h" ends inside x 950.
5. **Doors hold (19.7 to 23.5 s).** Each count runs up from 0 as its door draws. On "a different door", the three doors light one after another, with a tick each.
6. **Sound.**
   - The shutter moved to the X (never + 0.05).
   - The flag pop moved to deadline + 0.17.
   - The click and chime follow the later press.
   - The voiceover mix's music is 2 dB lower.
7. **Hook.** From about 2.5 s, a band of ink rises into the bottom of the frame, with the berg's top faint inside it.
8. **Layer 7.** The on-screen line now matches the voice: "Serves every customer's domain, and never one it shouldn't."

## Round 3: draft_16x9.mp4 + draft_9x16.mp4 (voiceover mix, 30 fps, no blur)

Inputs: review/r3/, metrics.json, every frame of both renders, and SFX onsets from audio/sfx.wav. Sizes are at 1920 or 1080 px wide unless marked.

| Criterion | Score | Evidence |
|-|-|-|
| Hook (first 2 s) | 5 | The first 2 s are unchanged. The new ink teaser starts at 3.3 s, not 2.5 s, and rises only 13 % (16:9) or 11 % (9:16). In 9:16 it sits entirely inside the bottom 20 % UI zone. |
| Readability at phone size | 6 | The label and both caption lines are whole from 64.5 to 65.7 s in both formats, and the 9:16 "24 h" now ends at x 947. But in 9:16 every layer title from 17 s to 56 s has the previous layer's dimmed glyph printed behind it. The 16:9 glyph labels are still 4 to 5 px at 360. |
| Motion quality | 7 | The 16:9 climb is fixed. The button grows 1.03 to 1.11 times per frame (f1982 to f1987), and the waterline is in every frame, moving from y 158 to y 830. The caption still cuts out in one frame (f1972 to f1973), and so does the label (f1975 to f1976). |
| Variety / pacing | 6 | The door hold now has a beat: the counts run up from 19.5 s to 21.3 s, and the doors light at 21.70, 21.97 and 22.23 s. The eight identical layer beats and the static pull-back (57.5 to 63.5 s) remain. |
| Brand accuracy | 7 | Green appears only from 67.07 s to about 69.1 s. The faces and ™ are correct. But the layer 7 line on screen now reads "Serves every customer's domain, and never one it shouldn't." The concept guardrail and FACTS both say the edge never obtains a certificate for a host it shouldn't. |
| Sound sync | 8 | Every hit checked lands within one frame: flag 39.297 s against the flag completing at f1179 (39.30); shutter 49.937 s against the X at f1498 to f1499; door ticks against the lights at 21.70, 21.97 and 22.23 s; chime 67.06 s against the green at f2012 (67.07). Loudness is -14.1 LUFS with a -2.8 dBTP peak in both. The d1 and e1 voice lines measure r 0.83 and 0.87 (was 0.79 and 0.81). |
| Composition (every format) | 6 | The 9:16 lower third is fixed: content now reaches y 1443 to 1548, leaving 19 to 25 % below it, which is the UI zone. From 0 to 3.3 s, 9:16 still leaves 33 % empty paper under the card (y 1072 to 1713). |
| Polish | 5 | The right-edge stripe is gone: the edge columns stay within 4 levels of the frame from 11 s to 65 s. "renews" and "expiry" have an 80 px gap at 44 s. New double printing in 9:16, covered under problem 1 below. |

**Round-2 fixes**
1. Ascent: fixed.
   - The label lands at f1929 (64.30 s) and is whole until f1975 (65.83 s), 1.53 s.
   - Both caption lines are whole from f1935 to f1972 (64.50 to 65.73 s).
2. Certificate: fixed. There is an 80 px gap (about 2.5 em) between "renews" and "expiry" at 44 s.
3. 9:16 blocking: the lower third and the stripe are fixed. The 190 px drop caused regression 1 below.

Smaller items:
- Fixed:
  - the shutter
  - the flag
  - the 16:9 climb
  - the door beat
  - the "24 h" inset
  - the music duck
- Partly fixed: the hook.
- Not done as asked: b7 was not re-voiced. The screen was changed to match the voice instead.

**Regressions**
1. In 9:16, each dimmed previous glyph now sits behind the next title:
   - the dots behind "Sign-in rails" at 21 s
   - the doors behind "Guided setup" at 28 s
   - the "@" behind "Value checks" at 38.5 s
   - the ticks through "Certificates" at 44 s
   - the life bar through "The edge" at 50 s
   - the edge glyph through "Monitoring" at 55 s

   In the pull-back (57 to 65.8 s), every glyph prints over the next title, so the stack reads as clutter under the bracket reveal.
2. The layer 7 copy on screen now drifts from FACTS.

**3 worst problems**
1. 9:16, 17 to 65.8 s: titles are double printed with the previous layer's glyph. Cause: the glyphs moved down 190 px, but the spacing between layers did not grow.
2. Both formats, 47 to 56 s and in the pull-back: "Serves every customer's domain, and never one it shouldn't." This breaks the accuracy guardrail in 01-concept.md.
3. Both formats, 0 to 2 s: still no iceberg. In 9:16 the teaser is hidden in the UI zone.

**Fixes for round 4**
1. In 9:16, increase the layer pitch by at least 190 px, or fade layer n minus 1 to zero before layer n's title lands. Verify: no pixel of the previous layer inside any title's box during a hold, and no glyph box overlapping a title box at 60 s.
2. Restore the on-screen line "Certificates for every customer's domain, never for a host it shouldn't." Re-voice b7 as "An edge that gets certificates for every customer's domain, and never for a host it shouldn't." Verify: the screen and the voice match FACTS (ownership-and-setup-types.mdx:153-160).
3. Start the teaser at 0.5 s and raise it so the ink top reaches y 1440 or higher in 9:16 (about 25 % in 16:9). Verify: berg facets are visible above the 9:16 UI line by 1.5 s.

**Smaller issues** (ranked)
1. Give the caption and the label a 4 to 6 frame rise-exit ending by 65.85 s. In 9:16 the label also rides down with the waterline for one frame (f1975).
2. The click at 66.977 s has no picture. Add a 2-frame press (scale 0.96) on the button.
3. The doors snap to lit in one frame. Ease each over 3 to 4 frames, ending on its tick.
4. In 9:16, 0 to 3.3 s, fill the empty paper under the card, for example by letting the teaser start there.
5. Vary at least two of the eight layer beats, and add a move to the 57.5 to 63.5 s pull-back.

**Verdict:** ANOTHER ROUND

## Changes after round 3
1. **9:16 layers.** Each layer clears completely in the 0.6 beats before the next title lands. In the pull-back only the glyphs return, and the titles stay off, so nothing prints behind a title.
2. **Layer 7.** The screen again reads "Certificates for every customer's domain, never for a host it shouldn't." b7 was re-voiced: "An edge that gets certificates for every customer's domain, and never for a host it shouldn't." The film is now 77.08 s.
3. **Hook.** The ink band rises from 0.5 s to 1.8 s, up to y 1440 in 9:16 and to 75 % of the height in 16:9, with the berg's top inside it.
4. **Smaller fixes.**
   - The caption and the label leave before the climb.
   - The press dips just before the click.
   - The doors light over about 4 frames, ending on their ticks.
   - The pull-back pushes in slowly while the bracket draws.

## Round 4: draft_16x9.mp4 + draft_9x16.mp4 (voiceover mix, 30 fps, no blur, 77.07 s)

Inputs: review/r4/, metrics.json, every frame of both renders (2312 each), SFX peaks from audio/sfx.wav, and speech-band envelope correlation against audio/vo.wav. Sizes are at 1920 or 1080 px wide unless marked.

| Criterion | Score | Evidence |
|-|-|-|
| Hook (first 2 s) | 7 | Frame 0 has words in both formats. The ink appears at about 0.9 s and reaches y 1467 in 9:16 by 1.5 s (UI line 1540), with berg facets inside it. In 16:9 it reaches the card base by 1.5 s. The 16:9 caption is still half a line until about 4 s. |
| Readability at phone size | 7 | 9:16 titles stand alone in every hold (21, 28, 32.5, 38.5, 44, 51 and 56 s). In the pull-back only the glyphs show. The 16:9 layer type and "acme.shop is live" read at 360. The 16:9 glyph labels are still 4 to 5 px at 360, and the URL (12 px at 360) is still the smallest end-card line. |
| Motion quality | 7 | The press dips from f2039 to f2042. The doors ramp over 3 to 4 frames: door 1 from f648 to f650, door 2 from f656 to f659, door 3 from f664 to f667. The climb is unchanged and clean. Still visible pops: the caption is whole at f1998, lifted 3 px at f1999 and gone at f2000; the label is whole at f2001, clipped at f2002 and gone at f2003. |
| Variety / pacing | 7 | The door hold has its beat, and the bracket now pushes in. The picture is still static from 59.0 to 64.8 s, with only the caption building, and the eight layer beats are still identical. |
| Brand accuracy | 8 | Layer 7 reads "Certificates for every customer's domain, never for a host it shouldn't." in both formats. b7 is aligned as "An edge that gets certificates for every customer's domain, and never for a host it shouldn't." (vo_words.json; the line now runs 5.47 s). Both match FACTS. Green appears only from 68.10 to about 70.2 s. The faces and ™ are correct. |
| Sound sync | 8 | Every checked hit is within one frame:<br>• door ticks at 21.692, 21.958 and 22.225 s, each ramp ending on its tick<br>• flag 39.297 s against the flag completing at f1179 (39.30)<br>• shutter 50.617 s against the X at f1519 (50.63)<br>• chime 68.102 s against the green at f2043 (68.10)<br>Loudness is -14.1 LUFS with a -2.7 dBTP peak in both. Speech correlation: b7 0.94, d1 0.81, e1 0.87. |
| Composition (every format) | 7 | 9:16 has no double printing, and its lower third holds content to y 1442 to 1548. Now that the previous layer clears, the top 32 % of every 9:16 hold is bare ice (content starts at y 602 to 616), and only about 15 % of that is UI zone. |
| Polish | 6 | No blank frames, and the seam scores 13.5. Regression: a double exposure at the swap. At f2043 (68.10 s), in both formats, the green pill lands at rest size over the dipped black pill, which shows as a black rim on the right and below. |

**Round-3 fixes**
1. 9:16 double printing: fixed.
   - The previous layer is fully gone before each title lands (handoffs checked at 16.4 to 17.1 s and at 46.3 to 47.1 s).
   - The pull-back shows glyphs only (61, 63, 65.3 and 66.3 s).
2. b7: fixed. The screen and the voice now say certificates, matching FACTS.
3. Hook teaser: fixed. Facets show above the 9:16 UI line by 1.5 s. The ink first shows at about 0.9 s, not 0.5 s, which is fine.

Smaller fixes:
- Door ramps: fixed.
- Press dip: present, but it caused the swap regression.
- Caption and label exits: not fixed. They are still 1 to 2 frame mask cuts.

**3 worst problems**
1. 68.10 s, f2043, both formats: a double exposure at the payoff. Cause: the green pill does not inherit the black pill's dip transform.
2. 66.63 to 66.77 s, both formats: the caption and the label still cut out in 1 to 2 frames.
3. 9:16 holds, 17 to 57 s: the top 32 % of the frame is bare ice. The outgoing layer leaves with a 0.3 s opacity ramp over about 150 px of travel, so it reads as a dissolve.

**Fixes for round 5**
1. Swap in one frame, with the green pill taking the black pill's current scale and offset. Alternatively, finish the dip back to scale 1.0 by f2042. Verify: no pixel darker than 60 within 6 px of the green pill's box in f2042 to f2044, in both formats.
2. Give both exits a 5-frame rise of at least 40 px through their masks: the caption from 66.50 to 66.67 s, the label from 66.60 to 66.77 s. Verify: at least 4 intermediate frames for each in a frame strip.
3. In 9:16, raise each layer group about 200 px, so content starts near y 420 and ends near y 1350. Make the outgoing layer travel at least 300 px while it fades. Verify: in each hold, the content top is at y 450 or less and the content bottom is at y 1540 or less.

**Smaller issues** (ranked)
1. Add a slow push or a drift between 59.0 and 64.8 s, so the pull-back is not a static frame with only the caption moving.
2. Make the 16:9 URL at least as tall as the wordmark, which is 15.6 px at 360.
3. Give at least two of the eight layers a different entrance.

**Verdict:** ANOTHER ROUND. The film is close. Fix 1 alone removes the only defect a viewer would notice at normal speed. Fixes 2 and 3 are small, and none of the three needs new voice or picture design.

## Changes after round 4
1. **The swap.** The press dip ends before the swap (back to rest by press + 0.08). The green pill appears on the frame the black one goes, at scale 0.97, and springs to 1.
2. **Exits.** The caption and the CustomDomain™ label leave with a steady lift through their masks over 0.22 beats (about 5 frames at 30 fps). The caption starts at rise − 0.4 and the label at rise − 0.28.
3. **9:16 layers.**
   - The text block sits 200 px higher (from about y 400), and the glyph is centred about 140 px higher, so content spans about y 400 to 1460.
   - The outgoing layer fades over [next − 0.55, next − 0.15], while the camera travels.
4. **Smaller fixes.**
   - The pull-back push is now 12 % (from pull + 0.6).
   - The 16:9 end-card URL is 104 px.

## Round 5: draft_16x9.mp4 + draft_9x16.mp4 (voiceover mix, 30 fps, no blur, 77.07 s)

Inputs: review/r5/, metrics.json, every frame of both renders (2312 each), and pixel measurements at the swap, the exits, the holds, the pull-back and the end card. Sizes are at 1920 or 1080 px wide unless marked.

| Criterion | Score | Evidence |
|-|-|-|
| Hook (first 2 s) | 7 | 9:16 is strong: the full line at frame 0, and berg facets above the UI line by 1.5 s. 16:9 still shows only "The button / that connects" at frame 0. "your customer's domain." completes at about 4 s. |
| Readability at phone size | 8 | The 9:16 titles stand alone in every hold. The 16:9 layer type and "acme.shop is live" read at 360. The 16:9 URL is now 14.6 px at 360 (was 12.0), against the wordmark's 15.6. The 16:9 glyph labels are still 4 to 5 px, but none of them is must-read. |
| Motion quality | 7 | The swap is clean, the press dip returns to rest before it, and the climb, door ramps and pull-back push are smooth. The exits are still near cuts:<br>• the caption is whole at f1998, about 5 px up at f1999, a sliver at f2000, and gone at f2001<br>• the label is whole at f2001, clipped at f2002, and gone at f2003 |
| Variety / pacing | 7 | The pull-back now pushes about 10.5 % (9:16 base 815 px at 60 s, 901 px at 64.8 s), so there is no static run there. The eight layer beats are still identical, and the build does not accelerate. |
| Brand accuracy | 8 | Unchanged from round 4. The layer 7 screen and voice match FACTS, green is the only accent and appears only after the press, and the faces and ™ are correct. |
| Sound sync | 8 | The click is at 68.018 s, with the dip back to rest by f2042. The chime is at 68.102 s against the green at f2043 (68.10). The other hits are unchanged and land within one frame. Loudness is -14.1 LUFS with a -2.7 dBTP peak. |
| Composition (every format) | 8 | The 9:16 holds run from y 402 to 1408 (21 s through 56 s), clear of both UI zones. The pull-back fills the frame. The end cards are balanced. |
| Polish | 7 | No blank frames, and the seam scores 14.3. The swap is clean: within 6 px of the green pill, the only dark pixels in f2043 and f2044 are the cursor, a box about 44 by 34 px. Unflagged until now and also present in round 2: in 9:16 at 58.4 to 58.6 s, the ink caption "You could build all of it." types in over dark water (f1752), then prints over the app card (f1755 to f1758). |

**Round-4 fixes**
1. Swap: fixed in both formats (f2042 black at rest, f2043 green, cursor only).
2. Exits: not fixed. The lift happens almost entirely inside the last 1 to 2 frames, so neither exit shows 4 intermediate frames.
3. 9:16 holds: fixed. The content top is at y 402 to 416 and the bottom at y 1302 to 1408. The outgoing layer is gone before each title lands.
4. Pull-back push: fixed.
5. 16:9 URL: fixed in substance. It is 14.6 px against 15.6 px for the wordmark (ink heights).

**3 worst problems**
1. 9:16, 58.4 to 58.6 s: the pull-back caption types in before the paper has risen behind it. It reads as black type on dark water, then over the card. Cause: the caption is pinned to the screen and starts while the camera is still crossing the waterline.
2. 66.60 to 66.77 s, both formats: the caption and the label exits still read as cuts. Cause: an ease-in lift with a tight mask, so most of the travel falls in the last frame before the mask clips the text.
3. 16:9, 0 to 4 s: the hook line is half built at frame 0.

**Fixes for round 6**
1. Hold the 9:16 caption until the waterline has passed below its box, at about 58.75 s. Alternatively, clip the caption to the paper region. Verify: no caption pixel over water or over the card in f1745 to f1765.
2. Make both exits a linear lift of at least 60 px over 6 frames, with the mask edge at least one line height above the text. Verify: at least 4 frames per exit with the text partly visible and displaced.
3. In 16:9, put both lines of the hook caption up at frame 0, as 9:16 already does. Verify: frame 0 contains "your customer's domain."

**Smaller issues** (ranked)
1. Give at least two of the eight layers a different entrance, or shorten the last three layers so the build accelerates.
2. The 16:9 glyph labels (4 to 5 px at 360) could go up one step in the finals if space allows.

**Verdict:** ANOTHER ROUND. All three fixes are small and need no new voice or design. With those three in, every score can reach 8, and this cut is ready for 60 fps finals with motion blur.

## Changes after round 5
1. **9:16 pull-back caption.** It starts at c1 + 0.9 b (about 58.8 s), once the waterline has passed below its box.
2. **Exits.** The caption and the label now lift linearly over 0.3 beats (about 7 frames at 30 fps) by 2.2 line heights. For the exit, the mask opens one line height upward, so the words travel visibly before the mask takes them.
3. **16:9 hook.** All four lines of "The button that connects your customer's domain." are up by frame 0.

## Round 6: draft_16x9.mp4 + draft_9x16.mp4 (voiceover mix, 30 fps, no blur, 77.07 s)

Inputs: review/r6/, metrics.json, and every frame of both renders (2312 each). Each frame was also diffed against round 5. Only three ranges changed: the 16:9 hook (0 to 4.57 s), the 9:16 pull-back caption (58.40 to 59.30 s), and the exits (66.57 to 66.80 s). Everything else carries over unchanged from round 5. Sizes are at 1920 or 1080 px wide.

| Criterion | Score | Evidence |
|-|-|-|
| Hook (first 2 s) | 8 | Frame 0 now reads "The button that connects your customer's domain." in both formats. The ink and the berg facets are in by 1.5 s (in 9:16, above the UI line). |
| Readability at phone size | 8 | Unchanged from round 5. Every must-read line reads at 360, and the 16:9 URL is 14.6 px against the wordmark's 15.6. The 9:16 pull-back caption now types only on paper. |
| Motion quality | 8 | Both exits are now visible lifts:<br>• 16:9 caption: displaced and visible for 7 frames, f1997 to f2003, moving up 5, 30 and 54 px before the mask takes it<br>• 16:9 label: displaced for 4 frames, f2000 to f2003<br>• 9:16 caption: 7 frames, f1997 to f2003<br>The climb, swap, door ramps and push are unchanged and clean. |
| Variety / pacing | 8 | The metric's 7.13 s gap from 16.43 s is a false positive: the doors pop at 18.58 to 19.70 s, the counts run to about 21.3 s, and the doors light at 21.6 to 22.2 s. Its 5.33 s static run from 40.77 s is also false: by frame difference, the longest still stretch in the certificate layer is about 1.8 s (44.0 to 45.8 s). The eight layers still share one beat shape. |
| Brand accuracy | 8 | Unchanged. The screen and the voice match FACTS, green is the only accent, and the faces and ™ are correct. |
| Sound sync | 8 | Unchanged. Every checked hit lands within one frame. Loudness is -14.1 LUFS with a -2.7 dBTP peak in both formats. |
| Composition (every format) | 8 | Unchanged. The 9:16 holds run from y 402 to 1408, and the 16:9 hook now fills its right column. |
| Polish | 8 | The 9:16 pull-back caption first prints at f1760 (58.67 s), on paper, with the waterline already at y 546 and the card well below the text. No caption pixel falls over water or the card from f1745 to f1765. There are no blank frames and no double exposures, and the seam scores 15.3. |

**Round-5 fixes**
1. 9:16 pull-back caption: fixed (f1745 to f1765 checked).
2. Exits: fixed. Each shows at least 4 displaced, partly visible frames in both formats.
3. 16:9 frame 0: fixed. All four lines are up at f0.

**3 worst problems** (none of them blocks a ship)
1. All 8 layers, 10 to 57 s: the eight layers share one beat shape (drift, type, draw, hold), and the build does not accelerate. Cause: the layer lengths are set by the voice lines.
2. 16:9 glyph labels: 4 to 5 px at 360. Cause: they are sized for the frame, not the phone. None of them is must-read.
3. 9:16 layer handoffs: the outgoing layer fades over about 0.4 beats while the camera travels. It reads cleanly at 30 fps, but it should be checked again with blur.

**Notes for the 60 fps finals**
1. Re-check the 16:9 climb (66.9 to 67.5 s) and both exits with motion blur on, to confirm no strobing at the mask edges.
2. If time allows, raise the 16:9 glyph labels one size step.
3. Re-measure loudness and true peak on the final mixes. They should stay at -14 ±0.5 LUFS and -1 dBTP or lower.

**Verdict:** SHIP. All three round-5 fixes landed and nothing else changed. Every criterion now scores 8, and no defect remains that a viewer would notice at normal speed. The cut is ready for 60 fps finals with motion blur.
