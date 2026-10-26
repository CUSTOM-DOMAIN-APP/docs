# CustomDomain™ explainer film: "The end user's path"

A line-drawn explainer about the connect-your-domain moment, seen from the end user's side. The usual way is a jagged line through seven stations that ends in an X, giving up, or a support ticket. With CustomDomain™ it is one straight line: type the domain, sign in to the provider inside the widget, approve once. The domain is then written, verified, secured and kept that way.

| Cut | Format | Audio |
|---|---|---|
| `customdomain-end-user-16x9-voiceover.mp4` | 16:9, 1920×1080, 60 fps | voiceover + music + sound |
| `customdomain-end-user-16x9-no-voiceover.mp4` | 16:9, 1920×1080, 60 fps | music + sound; the on-screen text carries the story |
| `customdomain-end-user-9x16-voiceover.mp4` | 9:16, 1080×1920, 60 fps | voiceover + music + sound |
| `customdomain-end-user-9x16-no-voiceover.mp4` | 9:16, 1080×1920, 60 fps | music + sound |

Runtime: 1:44. All four use the same picture; only the mix differs. The MP4s are delivered outside the repository, and this folder renders them again.

## The four phases (all in `docs/`)

1. `01-concept.md`: the idea, the audience, what they should leave knowing, the visual metaphor, and the accuracy guardrails checked against the docs.
2. `02-research.md`: explainer pacing (130 to 150 wpm, 60 to 90 s norm), line-style references, the tools chosen and why, and the voice specification.
3. `03-script.md`: the order of events, the two-column script (voice | on screen | visual) with timings, the list of drawings, and the voice direction.
4. The build: `film/film.js`, plus the critique rounds in `review_log.md`.

## How it is made

- **Voice:** `vo_lines.json` (the script) → `scripts/vo_build.py` synthesizes each line with Kokoro (`af_heart`, 0.85×; an open model run locally via kokoro-onnx). It places each line on the 92 bpm grid and writes every line's start into `timeline.json` as a mark, so the picture is cut to the voice. `scripts/vo_check.py` reads every line back with speech recognition. `scripts/vo_words.py` extracts word timings, so each drawing appears on its word.
- **Picture:** a deterministic `window.seek(t)` film (Motion Reel Kit engine). Drawings are rough.js geometry, seeded so every frame is identical, rendered as SVG paths that draw themselves on along their length. Type rises through masks or writes itself on. The brand's faces and colours come from customdomain.ai/brand: ink on paper, with green only for "done" and "live".
- **Sound:** `scripts/music_soft.py` (a quiet score whose sections follow the story), `scripts/sfx_plan.py` (cues on the voice's words) → `scripts/sfx.mjs`, then `scripts/mix_both.sh` makes the two mixes (with voice, music ducked; without voice). Both are at -14 LUFS.

```sh
# from this folder; needs node 22, ffmpeg, python3 (numpy scipy soundfile librosa pillow kokoro-onnx faster-whisper), playwright + chromium,
# and the Kokoro model files (kokoro-v1.0.onnx, voices-v1.0.bin from the kokoro-onnx releases; set KOKORO_MODEL / KOKORO_VOICES)
python3 scripts/vo_build.py && python3 scripts/vo_check.py && python3 scripts/vo_words.py
python3 scripts/music_soft.py && python3 scripts/sfx_plan.py && node scripts/sync.mjs && node scripts/sfx.mjs && sh scripts/mix_both.sh
sh scripts/final_chunks.sh 16x9 9x16        # 60 fps with motion blur, resumable 3 s chunks, 4 at a time
# then mux each picture with audio/mix_vo.wav and audio/mix_novo.wav (see scripts/deliver.sh)
```
