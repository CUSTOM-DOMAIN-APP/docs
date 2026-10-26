# CustomDomain™ explainer film: "The human middleware"

A 50-second, problem-first explainer for CustomDomain™, in two cuts:

| Cut | Format | For |
|---|---|---|
| `customdomain-explainer-16x9.mp4` | 16:9, 1920×1080, 60 fps, H.264 + AAC | landscape: site, YouTube, LinkedIn, decks |
| `customdomain-explainer-9x16.mp4` | 9:16, 1080×1920, 60 fps, H.264 + AAC | vertical: Reels, Shorts, TikTok, Stories |

The MP4s are delivered outside this repository (it keeps files under 300 KB); this folder holds everything needed to render them again.

Sound: an original score and UI sound effects, synthesized in code, mixed to -14 LUFS with true peak ≤ -1 dBTP. There is no voiceover. The story is carried by kinetic type, so the film works muted in a feed, as the brand's own 29-second intro film does.

## The story (in beats at 100 bpm; 1 beat = 0.6 s)

1. **0 to 4.8 s, the hook.** "Your customers fail at *the finish line.*" A sign-up progress bar ticks off Sign up, Build and Publish, then stalls at 91 % on "Connect domain": *Setup abandoned at DNS*.
2. **4.8 to 9.6 s, the button you ship.** "You ship *Connect your domain.*" Your app's settings card turns into the records your customer must add ("up to 48 hours"). "Your customer gets *homework.*"
3. **9.6 to 18 s, their registrar.** A zone editor they have never seen. Six real failure classes (host vs. full domain, the trailing dot, TTL 86400, an A record holding a hostname, a CNAME at the root, the stale record that still answers) are each flagged on the beat. The propagation clock races toward 48 h, the errors flood the frame, then: "One wrong character, and the setup *dies.*"
4. **18 to 24 s, the insight.** "Your app and their DNS host agree *perfectly.* The bridge between them is *a person* in two tabs." The three-actor gap: the human node shakes, records fall out of the bridge, then the human is pulled out.
5. **24 to 27.6 s, the turn.** The two systems snap together. Paper bursts from the junction, the tree grows, and "CustomDomain™ *closes the gap.*"
6. **27.6 to 40.8 s, the real flow.** The connect widget, rebuilt from the live widget on customdomain.ai: detect → Cloudflare found → Authorize → Allow → A, CNAME and TXT written → ownership verified, HTTPS issued, published to the edge → live. Captions: "One button *for them.*" "They approve *once.*" "We write *the records.*" "We issue *HTTPS.*" "Their domain, *live.*" The camera pushes through to `https://everjust.co ✓ Live`.
7. **40.8 to 45.6 s, proof.** "0 DNS panels your customer should *ever see.*" Then "Every provider they *already use.*", with 24 provider tiles and "150+ DNS providers · 40+ set up automatically".
8. **45.6 to 50.4 s, CTA.** "Your customers should never *touch DNS.*" The lockup, then **Start free trial** and `customdomain.ai`. An iris closes on the tree, back to frame 0, so the film loops seamlessly.

## Brand

Taken from customdomain.ai/brand: paper `#fafaf9`, ink `#1c1917`, night `#0c0a09`, warm stone greys, and green `#16a34a` only on a finished step. Errors are inverted chips, never red. Faces: Instrument Serif (display, italic for emphasis), Inter (UI) and Geist Mono (records). The marks are the tree-mark SVG and the widget's own provider logos. Claims are only those the site makes (150+ / 40+ / 0).

## How it is made

A deterministic `window.seek(t)` film in headless Chromium, built with the Motion Reel Kit: closed-form springs, a beat grid measured from the synthesized score, and adaptive 180° motion blur. A fresh critic reviewed it over seven scored rounds, until every criterion scored 8 or more (`docs/review_log.md`).

```sh
# from this folder (needs node 22, ffmpeg, python3 with numpy scipy soundfile librosa pillow, and playwright + chromium)
ln -s "$(npm root -g)" node_modules   # or npm i -D playwright, so render.mjs can require it
python3 scripts/music.py && python3 scripts/beats.py audio/music.wav --stem audio/drums.wav && python3 scripts/fix_beat0.py
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
sh scripts/final_chunks.sh 16x9         # finals, 60 fps with motion blur, in resumable 6 s chunks → renders/16x9.mp4
sh scripts/final_chunks.sh 9x16         # (or node scripts/render.mjs --all in one pass)
node scripts/render.mjs --sheet --all    # per-beat contact sheets
```

| Path | What |
|---|---|
| `film/film.js` | the film: every scene |
| `timeline.json` | marks, music sections and sound cues, in beats |
| `docs/` | brief, style guide, shotlist, review log |
| `assets/` | brand fonts (Instrument Serif, Inter, Geist Mono: SIL OFL), the tree mark, the widget's provider logos, and a contact sheet of the live widget's states (`cap/widget-states.png`) |
