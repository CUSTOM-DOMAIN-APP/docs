# CustomDomain™ film: "Under the Button"

The "Connect domain" button is the tip of an iceberg. One continuous take dives under the waterline and names, layer by layer, the eight systems the button sits on: provider detection, sign-in rails, guided setup, root domains, value checks, certificates, the edge and monitoring. Then it climbs back up to press the button. A platform can ship the button without building the ice.

| Cut | Format | Audio |
|---|---|---|
| `customdomain-iceberg-16x9-voiceover.mp4` | 16:9, 1920×1080, 60 fps | voiceover + music + sound |
| `customdomain-iceberg-16x9-no-voiceover.mp4` | 16:9, 1920×1080, 60 fps | music + sound; the on-screen text carries the story |
| `customdomain-iceberg-9x16-voiceover.mp4` | 9:16, 1080×1920, 60 fps | voiceover + music + sound |
| `customdomain-iceberg-9x16-no-voiceover.mp4` | 9:16, 1080×1920, 60 fps | music + sound |

Runtime: 1:16. All four cuts use the same picture; only the mix differs. The MP4s are delivered outside the repository, and this folder can render them again.

## The four phases (all in `docs/`)

1. `01-concept.md`: the idea, the audience, what they should leave knowing, how it differs from the other films, and the accuracy guardrails.
2. `02-research.md`: references, pacing, the tools chosen and why, and the voice specification.
3. `03-script.md`: the voiceover with timings, and the picture beat by beat in both formats.
4. The build: `film/film.js`, plus the critique rounds in `docs/review_log.md`.

## How it is made

- **Voice:** `vo_lines.json` (the script) is synthesized line by line with Kokoro (`bm_fable`, 0.84×; an open model, run locally via kokoro-onnx) by `scripts/vo_build.py`. It writes every line's start into `timeline.json` as a mark, so the picture is cut to the voice. `scripts/vo_check.py` reads every line back with speech recognition, and `scripts/vo_words.py` extracts word timings, so things happen on their words.
- **Picture:** a deterministic `window.seek(t)` film (Motion Reel Kit engine) in the brand's faces and colours: Instrument Serif, Inter and Geist Mono, ink on paper, with green only for "live". The water, the faceted ice, the light and the particles are drawn on a canvas. Each layer's glyph is an SVG drawing that draws itself on, and every number on screen comes from the docs.
- **Sound:** `scripts/music_ice.py` (the score), `scripts/sfx_plan.py` (cues computed from the same beats as the picture) → `scripts/sfx.mjs`, then `scripts/mix_both.sh` makes the two mixes (with voice, music ducked; without voice). Both are at −14 LUFS.

```sh
# from this folder; needs node 22, ffmpeg, python3 (numpy scipy soundfile librosa pillow kokoro-onnx faster-whisper), playwright + chromium,
# and the Kokoro model files (kokoro-v1.0.onnx, voices-v1.0.bin from the kokoro-onnx releases; set KOKORO_MODEL / KOKORO_VOICES)
python3 scripts/vo_build.py && python3 scripts/vo_check.py && python3 scripts/vo_words.py
python3 scripts/music_ice.py && python3 scripts/sfx_plan.py && node scripts/sync.mjs && node scripts/sfx.mjs && sh scripts/mix_both.sh
sh scripts/final_chunks.sh 16x9 9x16        # 60 fps with motion blur, resumable 3 s chunks, 4 at a time
sh scripts/deliver.sh                       # mux each picture with audio/mix_vo.wav and audio/mix_novo.wav
```
