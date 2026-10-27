# Phase 2: Research, references and tools

## The iceberg as a build-vs-buy argument
- **The visible-and-hidden split.** Build-vs-buy writing often uses this split: a working interface on top, compliance, maintenance and staffing underneath. The strongest version is a waterline reveal that starts with what is visible and uncovers the hidden layers one at a time ([LeadDev on build vs buy](https://leaddev.com/software-quality/tackling-build-vs-buy-conundrum), [an iceberg layering template](https://www.infodiagram.com/slides/iceberg-model-examples), [Resolve.ai's "DIY iceberg" framing](https://resolve.ai/resources/webinar/build-vs-buy?tags=2)).
- **Most uses of it are static banners or slides,** not a film that actually dives. One continuous descent, with a counter, gives the idea motion and a sense of scale.
- **Rule taken from this:** every layer must be concrete and named, not "maintenance" or "complexity". Here each layer is a real CustomDomain™ system with a docs page.

## Pace and length
- **About 60 to 70 seconds:** short enough for a founder to watch to the end, long enough for eight layers at about 4 seconds each.
- **A slow narration, about 140 words a minute,** with a breath at the waterline and a longer pause at the bottom, where the scale lands.

## Look
- **Underwater documentary grammar:**
  - light shafts from the surface that fade with depth
  - drifting particles ("marine snow") that move against the camera, so a slow descent still reads as motion
  - a sonar ping for each new layer
- **Faceted low-polygon ice in warm stone greys,** drawn in code and seeded so every frame is identical. It is a different hand from the rough ink lines of "The end user's path".
- **Brand:**
  - ink, paper and the stone greys; Instrument Serif for layer names, Inter for labels, Geist Mono for numbers and the depth rail
  - green only at the very end

## Tools
| Need | Tool |
|---|---|
| Deterministic animation, renders, critique kit | Motion Reel Kit engine (as in the previous films) |
| Water, light, particles, faceted ice | Canvas 2D, seeded (no randomness between frames) |
| Glyphs for each layer | Clean geometric SVG strokes that draw on |
| Type | Kit rise and typewriter, in the brand faces |
| Voice | Kokoro `bm_fable`, run locally, at 0.8× |
| Score | Synthesized: a low drone, sparse felt piano, sonar pings, a warm major lift on the way up |

## Voice spec
- **Voice:** `bm_fable`, a British male with a low, even, documentary manner. Chosen over five others on read-back clarity and pitch (about 112 Hz).
- **Speed:** 0.8× its natural rate, about 140 to 150 words a minute inside a line.
- **Cadence:** short declaratives, one layer per line. About 0.5 s between layers. 1.2 s at the waterline and at the bottom.
- **Pronunciation:** "Custom Domain" is two words in the voice script, as before. Numbers are spelled out ("a hundred and eighty-nine") so they are read naturally.
