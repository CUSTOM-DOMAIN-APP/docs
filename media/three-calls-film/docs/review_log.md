## Round 1: draft_16x9 + draft_9x16 (VO mix, 30 fps, no blur)

| Criterion | Score | Evidence (px = font size at 360 px wide) |
|---|---|---|
| Hook (first 2 s) | 5 | f0 reads the caption, but the editor is empty until 4.63 s (longest_static 4.3 s). In 9:16, "Three calls." appears at 2.83 s on top of the editor tabs. |
| Readability at phone size | 4 | 16:9: code 5.3 px (6.8 px zoomed), live pill 2.8 px, `npm install` CTA and URL 8.6 px (cap 6). 9:16: code 9.3 px, terminal 6.3 px, pill 5 px; 50 to 53-char lines run into the right UI zone (x≈960 to 1010, cap 7). |
| Motion quality | 5 | Clean camera springs, but widget rows, the pill and the 9:16 panel swaps pop (12.58, 22.03, 22.63 s). The editor hard-cuts out at 26.27 s. The caret types off-frame mid-pan (strip_fast2). |
| Variety / pacing | 5 | max_gap 5.07 s; static 26.9 to 29.8 s and 34.63 to 37.1 s. Seven camera moves in 16 s; typing at 61 to 86 cps (spec ~30). |
| Brand accuracy | 6 | The faces, the tree-mark.svg mark, green only at live (23.87 s) and ™ are correct. The Cloudflare mark is a drawn outline although assets/logos/cloudflare.svg exists (cap 6). `"connecting"` is not a status. The VO's "HTTPS issued" contradicts FACTS (issued on the first visit). |
| Sound sync | 5 | 4/12 hits within 45 ms, mean 80.4 ms; Connect / Sign in −133 ms, propagating −167 ms (cap 6). The sfx stem sits on its cues, so the picture placement is wrong. −14.1 LUFS, TP −2.7 dBTP ✓. |
| Composition | 5 | 9:16 is empty below y = 980 (49 %) for 0 to 9.1 s. In 16:9 the editor border cuts under "it's live" at 22.3 s, the fan leaves the bottom 38 % empty, and the CTA is the end card's smallest element. |
| Polish | 5 | No blank frames; seam 7.4 ✓. Caption swaps double-expose at 4.4 s and 10.05 s. The fan cards land on the live editor (26.0 to 26.3 s). "7 lines" labels an 8-line file. |

**3 worst problems**
1. **Step 3 runs backwards.**
   - At 22.22 s, `connection.live` with "propagation success" prints while the pill reads pending. It turns propagating at 22.75 s and live at 23.87 s, so `markLive()` visibly does nothing.
   - 16:9: the terminal is off-frame (zoomed) until about 22.8 s.
   - 9:16: it shows for only 0.6 s (22.03 to 22.63 s), half-printed.
   - Cause: `BT.hook` keys to "records", `prop` and `live` to later words, and `tallPanel` flips back at `BT.prop − 0.3`.
2. **The payload is illegible on a phone:** the code, the live pill and the 16:9 CTA. Cause: one 1920 layout with 15 to 19 px panel UI, a 1.3× zoom, and 9:16 reusing the 16:9 sizes.
3. **The open is dead, the middle is crammed and the tail is dead.** The editor is empty for 4.6 s. Then the code types at 2 to 3× spec under seven moves. Zoom 3 holds 1.2 s. The camera leaves file 2 while line 8 is still typing (12.58 s against 13.13 s). Cause: typing is squeezed into the VO lines, and the camera is keyed to words.

**Fixes for round 2**
1. Sequence: pending (Allow) → propagating ("records") → webhook prints at `BT.live − 0.6 b` → pill and banner go live on the chime, with `markLive` highlighted. In 9:16, overlay the terminal on the preview for ≥ 1.5 s. Verify: in both formats, the frame at `BT.live − 0.1 b` shows the full payload with the pill not yet live.
2. 16:9: focus zoom ≥ 1.8× (code ≥ 9.5 px), push in on the preview at live, pill and banner ≥ 32 px, CTA and URL ≥ 72 px. 9:16: terminal ≥ 30 px, pill ≥ 36 px, code lines ≤ 46 chars (x ≤ 940). Verify in phone_*.jpg and safe_9x16.jpg.
3. Start typing under the a1 line (from about 1.0 s). One zoom per file, landing after the focus line is typed and holding ≥ 1.5 s. Leave the editor only after `type2[1]`. Typing ≤ 45 cps. Give "Just three calls" and the end card one more beat each. Verify: max_gap ≤ 4 s, no static run > 2 s before the last 1.5 s.

**Smaller issues (ranked)**
1. No-VO cut: the end user's part (13 to 16.5 s) has no on-screen text. Add "Your customer: sign in, Allow. That's their whole job."
2. Code fixes; see (a).
3. Derive the sfx times from the `BT` marks (file 2 swaps at 10.195 s, but its click is at 10.318 s). Target ≥ 11/12 hits within 45 ms.
4. Bring each caption in ≥ 0.15 b after the outgoing one clears.
5. Clear the editor before the fan; use taller cards.
6. Use the real Cloudflare glyph, inked.
7. Line counts should count the lines shown.
8. Print the key as `propagation_status`.

**(a) Code.** The endpoint, Bearer key, `expires_in: 900`, `open()` options, `connection.live` and `X-JE-Signature` all match FACTS. Engineers would wince at these:
- `server.ts` mints one 15-minute token with a top-level `await`, and nothing hands it to the browser, so `token` appears from nowhere. Fix: a route that returns `{ token }`, fetched on the client.
- `verifySignature(req)` ignores its result and needs the raw body. Fix: `if (!verifySignature(req)) return res.sendStatus(401)`.
- `setStatus("connecting")` contradicts the "pending" pill.
- `.open()` runs at module top level in a `.tsx` file with no JSX. Fix: put it in an `onClick`.
- No `Content-Type` header; `API_KEY` should be read from `process.env`.

**(b) Without the voice.** Partly. The chapter titles carry the three steps, but the end user's role and what "live" means are lost, and step 3 is unreadable in 9:16.

**(c) Phone legibility.** 16:9: no (5 to 7 px). 9:16: the code is borderline (9.3 px); the comments, terminal, pill and widget fail.

**(d) Keynote feel.** Busy. 61 to 86 cps reads as a paste, and the zooms leave before they settle, between an empty open and dead holds.

**(e) Brand.** Green appears only at live, the faces are correct, and ™ is in place. Problems: the Cloudflare glyph is fake, and the consent screen is drawn inside our widget instead of on Cloudflare's page.

**Verdict:** ANOTHER ROUND

## Round 2: draft_16x9 + draft_9x16 (VO mix, 30 fps)

| Criterion | Score | Evidence (px at 360 wide) |
|---|---|---|
| Hook | 5 | f0 reads, typing from 1.02 s. Held at 5 (carry-over): in 9:16 "Three calls." still crosses the editor border (2.83 to 5.1 s). |
| Readability | 6 | 16:9: zoom-1 code 9.45 px and CTA 13.5 px ✓. The result pill is 6 px and file 3 is 5.25 px. 9:16: terminal 10 px and pill 12 px ✓, code 8.7 px (was 9.3). The CTA ends at x=1005, in the UI zone (cap 7). |
| Motion | 5 | The 9:16 swaps still pop (f287→288, f472→474). The world hard-cuts under the first fan card (f964→966). Zooms 2 to 3 never settle. |
| Variety / pacing | 5 | max_gap 5.13 s @20.97 (cap 7). Zoom holds 3.9 / 0.2 / 0.3 s. Typing 49 to 53 cps. Static tail 40.67 to 44.3 s. |
| Brand | 7 | Cloudflare glyph, provider page, statuses and HTTPS line all ✓. "HMAC-SHA256 over the raw body" is not in FACTS. |
| Sound sync | 7 | By frame, hits land within 1 to 2 frames (f480/15.99, f484/16.12, f508/16.92, f893/29.74). The metric's 5/12 is its ±120 ms window floor during the push-in. −14.0 LUFS ✓. |
| Composition | 6 | 16:9 result: the left 24 % is clipped code (a green bar reading "op") and the right 27 % is bare paper. The terminal is empty 26.6 to 29.3 s. The 9:16 end card is 35 % empty. |
| Polish | 5 | No blanks, seam 9.5, clean captions. Held at 5: the fan card lands on the live result (f964 to 965). A stray caret sits on the empty files (10.23 s, 20.97 s). At f892 (9:16) the banner says live while the pill says propagating. |

**Round-1 fixes**
- **Fix 1:** order ✓ (pending 19.5 → propagating 26.95 → webhook 29.29 → live 29.77). Verify ✗: at 29.70 s `propagation_status` has no value. markLive is never seen lit ✗.
- **Fix 2:** mostly ✓, but the 9:16 code shrank instead of the lines getting shorter.
- **Fix 3:** the open ✓. Holds ✗, ≤45 cps ✗, max_gap ✗.
- **Smaller:** 1, 3, 4, 6, 7, 8 ✓; 2 mostly; 5 partial.

**Regressions:** 9:16 code is 26 px; 9:16 hides the editor while file 3 is still typing; clipped code at the 16:9 result; the 9:16 CTA is in the UI zone; a 3.6 s dead tail.

**3 worst problems**
1. **Step 3's payoff can't be seen (26.6 to 30 s).** The terminal is empty, the payload completes on the live frame, and markLive never reads. Cause: `out1` clears at `BT.prop−0.7`, `live−hook` is 0.9 b against a 0.91 b print, RES is centred at x=1510, and 9:16 hides `S.ed`.
2. **Zooms 2 to 3 never land, and file 3 types for 5 s at 5 px.** Cause: the zooms key at `lineDone(focus)+0.15`, only ≈0.8 s before the camera leaves.
3. **9:16 blocking:** caption/editor collision, popping swaps, the CTA in the UI zone, and an empty end card.

**Fixes for round 3**
1. **Step 3:**
   - Keep `out1` until `BT.hook−0.2`, and set `hook = live−1.6 b`.
   - 16:9: RES `{x:1000, y:560, s:1.15}` with `L.pill` 28, `L.ban` 30, `L.tfs` 24.
   - 9:16: keep the editor, scrolled to lines 4 to 7 at y 440 to 740, with the terminal at 760 to 1050 from `BT.hook−0.3` and the app at 1075 to 1545.
   - Verify at `BT.live−0.1 b`: full payload, pill not live, markLive readable.
2. **Zooms and pacing:**
   - Key zooms 2 to 3 at `lineDone(focus−1)−0.3` and RES at `max(BT.prop−0.5, typ[2][1]+0.2)`.
   - Delete the three `// N ·` comments, which repeat the titles; that brings typing to 42 to 46 cps.
   - Push the end card until `'done'`, and set the VO tail to 2.0 s.
   - Verify: holds ≥ 1.5 s, max_gap ≤ 4 s.
3. **9:16 layout:** editor at y=440; swaps as a clipped vertical slide; npm at 44 px; end card spread over 520 to 1450; 28 px code with lines ≤ 49 chars.

**Smaller (ranked)**
1. Test `typ[fileAt][0]` for the pre-typing caret.
2. Hide the world before the first card, with a moving exit.
3. 9:16: cursor only after the app returns.
4. Banner and pill on the same frame.
5. A camera-compensated sync metric.

**Code (senior engineer)**
- **`server.ts`:**
  - `/token` is unauthenticated and forwards `req.body` with your secret key, so anyone can mint tokens for any domain.
  - Use `app.post("/token", requireUser, async (req, res) => {` (53 chars) and `JSON.stringify({ domain })`.
  - Check `r.ok`.
- **`connect.tsx`:** `APP_ID` and `api` come from nowhere. The token response carries `application_id` (concept guardrail), so use it. Still no JSX or `onClick`.
- **`webhooks.ts`:**
  - It promises a raw-body HMAC with no `express.raw()`.
  - Use `verify(req.body, req.get("X-JE-Signature"))` plus `JSON.parse`, and comment it `sha256=…`.

**Verdict:** ANOTHER ROUND

## Changes after round 2
1. **Step 3.**
   - The hook is now live − 1.6 b. out1 stays until hook − 0.2.
   - **16:9:** RES is {x 1000, y 560, s 1.15}. pill 28, ban 30, terminal 24 px.
   - **9:16:** the editor stays. From hook − 0.3 it shortens to lines 5 to 9 of webhooks.ts (verify to markLive). The terminal moves to y 780 to 1060, and the app to 1075 to 1545.
   - The pill and the banner switch on the same frame. markLive lights green on that frame.
2. **Zooms.**
   - Each file's zoom lands at lineDone(focus − 1) − 0.3. RES is at max(prop − 0.5, end of typing + 0.2).
   - The "// N ·" comments are gone. Lines already in each file show when it opens ("pre" lines), and only the body is typed: 34, 37 and 43 characters a second.
   - The voiceover tail is 2.0 s (the film is 42.76 s). The end card pushes in until the last frame.
3. **9:16 layout.**
   - The editor is at y 440, with 28 px code. Every line is 49 characters or fewer.
   - The token terminal slides up over the app like a sheet, clipped at the slot's edge.
   - npm is 44 px. The end card spans y 520 to 1450.
4. **Code, after the engineer's review.**
   - **server.ts:** `/token` is behind `auth`, sends `JSON.stringify({ domain })` and checks `r.ok`.
   - **connect.tsx:** imports `api` from `./api`, uses `t.application_id` from the token response, and has a real `<button onClick={run}>`.
   - **webhooks.ts:** uses `express.raw()` and `verify(req.body, sig)` with a `sha256=…` comment, then `JSON.parse`.
5. **Smaller fixes.**
   - Before each file types, its caret waits at the first line to be typed (no stray caret).
   - The world slides away just before the file cards rise.
   - The 9:16 cursor shows only once the app is back.

## Round 3: draft_16x9 + draft_9x16 (VO mix, 30 fps, 42.76 s)

| Criterion | Score | Evidence (px at 360 wide) |
|---|---|---|
| Hook | 7 | f0 reads with real code in both formats. 16:9 states the promise at f0. In 9:16, "Three calls." lands at 2.83 s and clears the editor. |
| Readability | 7 | 9:16: code 9.3 px, terminal 10 px, pill 12 px, CTA 14.7 px (right edge x=937). 16:9: zoomed code 9.45 px, CTA 13.5 px, but the result pill is 6 px. The 9:16 widget's edge (x≈1010) enters the UI zone from 16 to 19.5 s. |
| Motion | 7 | The 9:16 sheet slides are clipped and clean. The world slides away before the fan. The strips show no pops. There is still no blur on fast moves, and the frame is nearly empty from 32.07 to 32.2 s. |
| Variety / pacing | 7 | max_gap is 3.93 s. Zoom holds are 7.6, 2.9 and 4.7 s. Typing runs at 34, 37 and 43 cps. A static run from 29.73 to 31.83 s (2.1 s) caps this at 7. |
| Brand | 8 | Green appears only on the live frame. The real Cloudflare glyph, the faces, ™, the FACTS endpoints and statuses, and the `sha256=…` comment are all right. |
| Sound sync | 7 | By frame, the chime lands on f892 (29.73 s vs 29.743 s), the webhook print starts at 28.93 s, and the file swaps land on f307 and f630. The metric's 5/12 is a camera-move artifact. In 16:9, the token pop at 9.57 s plays while the terminal is off-frame. Loudness is −14.2 LUFS. |
| Composition | 7 | The 16:9 result frames markLive, the app and the terminal together, with the gutter clipped at the left. The 9:16 result stacks cleanly. The 9:16 end card spans y 520 to 1469. |
| Polish | 6 | No blank frames and no stray carets. In 9:16, the editor clip slices `res.sendStatus(200)` in half from 28.9 to 32 s. The rising sheet flashes the old token output over the pill from 28.78 to 28.9 s. In 16:9, file 1's last line types off-frame from 9.5 to 9.77 s. Loop seam is 10.4. |

**Round-2 fixes, checked by frame**
1. At BT.live − 0.1 b (f891), both formats show the full payload, the pill at propagating, and markLive readable. At f892, the pill, the banner and markLive turn green together. Confirmed.
2. Zoom holds are all ≥ 1.5 s; max_gap is 3.93 s. Confirmed.
3. Typing averages 33.7, 37.0 and 43.0 cps. File 3 peaks at 48.8 cps within a line. Confirmed.
4. In 9:16, the caption clears the editor at 3.4 s and 19.5 s. The sheet slide, the CTA at x=937, the end-card spread and the cursor timing all work. Confirmed.
5. The caret waits on the first typed line at 10.3 s and 21.1 s. Confirmed.

**Regressions:** in 9:16, the sliced line and the token flash. The loop seam went from 9.5 to 10.4.

**3 worst problems**
1. **9:16 result (28.78 to 32 s).** The editor's bottom inset `L.ed[3] - 330` leaves 20 px of line 10. `S.tm` shows at hook − 0.3, but `out1` stays until hook − 0.2.
2. **The token printout lacks `application_id`,** which `connect.tsx` reads as `t.application_id`.
3. **In 16:9, `res.json(await r.json());` types below the frame.** Zoom 1 stays centred on line 5.

**Fixes for round 4**
1. **Fix the 9:16 result.**
   - Set the inset to `L.ed[3] - (CODE_Y + 5 * L.lh + 4)`.
   - Clear `out1` at hook − 0.4, and raise the app before the terminal reaches it.
   - Verify frames from 28.8 to 29.0 s and at 29.7 s.
2. **Add the field.** Add `"application_id": "app_…",` to `S.out1`, and verify at 9.8 s.
3. **Fix the camera.**
   - Retarget zoom 1 to line 9 at `lineDone(10)`, and verify that line 13 shows at 9.7 s.
   - Push from 1.15 to 1.22 through the live hold so that no static run outside the end card exceeds 2 s.

**Smaller (ranked)**
1. Narrow the 9:16 widget to 450 px.
2. Drop the off-frame 16:9 token pop.
3. Start the first fan card 0.1 b earlier.
4. End the end-card push at the f0 scale.

**Code (senior engineer)**
- **server.ts** is correct. Its `/token` route reads `req.body`, which implies an app-wide `express.json()`, and that would consume the webhook's raw body. Mount `express.json()` on `/token` only.
- **connect.tsx** is correct. Two nits: `{ domain }` is untyped, and the button says "Connect" while the preview says "Connect domain".
- **webhooks.ts** is correct: `express.raw()`, `verify` with the header, 401, `JSON.parse`, and `connection.live`.

**Verdict:** ANOTHER ROUND (close: three small fixes).

## Changes after round 3
1. **9:16 result.**
   - The editor's bottom inset is now `L.ed[3] - (CODE_Y + 5 * L.lh + 4)`, which removes the sliced line.
   - out1 clears at hook − 0.4.
   - The app rises first (from hook − 0.6), then the terminal.
2. **Token printout.** It now includes `"application_id": "app_7Hq2"`, which connect.tsx reads.
3. **Camera.**
   - Zoom 1 retargets to line 12 once line 12 is typed, so `res.json(...)` and `});` type in frame.
   - The 16:9 result pushes from 1.15 to about 1.22 through the live hold.
4. **Smaller fixes.**
   - The 9:16 widget is 450 px wide.
   - The off-frame token pop is silent.
   - The first file card starts 0.1 b earlier.
   - server.ts mounts `express.json()` on `/token` only, so the webhook keeps its raw body.
5. **End line.** It now follows the docs' wording (widget.mdx), because 116 of 189 providers are guided by hand: "You never touch their DNS, or their certificates." Line f1 was re-voiced to match, and the film is now 42.59 s. npm and the docs URL land after "certificates".

## Round 4: draft_16x9 + draft_9x16 (VO mix, 30 fps, 42.59 s)

| Criterion | Score | Evidence (px at 360 wide) |
|---|---|---|
| Hook | 7 | Unchanged. f0 reads with real code. In 9:16, "Three calls." lands at 2.83 s and clears the editor. |
| Readability | 6 | As in round 3, with the CTA at 13.5 px in 16:9 and 14.7 px in 9:16 (x≤938). But lines 14 and 15 of server.ts never fully read in either format. |
| Motion | 7 | The springs, the sheet slides and the live-hold push are clean. Blur is not scored. |
| Variety / pacing | 7 | max_gap is 4.27 s from 32.23 s, during the fan hold, so it is capped at 7 (it was 3.93 s). The longest static run is 2.0 s at 32.77 s. |
| Brand | 8 | The new end line matches the docs and is honest about the 116 providers set up by hand. Green appears only at live, and the glyph and faces are correct. |
| Sound sync | 7 | Frame checks pass: the chime lands on f892 at 29.73 s against 29.743 s, and the webhook print starts on its cue. The token pop is now silent. The metric still reads 5/12 (camera-move artifact). Loudness is −14.1 LUFS. |
| Composition | 5 | New regression. From 7.7 to 10.0 s in 16:9, zoom 1 centres on the 5-character `});` line, so the editor slides right. The left half of the frame is bare paper and the code is cut off at the right edge (f258, f291). |
| Polish | 6 | The 9:16 result is clean at 29.7 s, with no token flash. But server.ts overflows the editor in both formats. In 16:9, line 14 is sliced by the editor's bottom border and line 15 never appears. In 9:16, both lines are hidden. The fan cards say "15 lines" but clip them too (16:9 slices line 14; 9:16 shows only 12). |

**Round-3 fixes checked by frame**
1. **9:16 result.** At 28.8 s the terminal is empty, so there is no token flash. At 29.7 s nothing is sliced, the payload is complete, the pill reads propagating, and markLive is readable. At f892 the pill turns live. Confirmed.
2. **application_id.** It appears at 9.8 s in 9:16 and at 10.3 s in 16:9. Confirmed.
3. **Line 15 at 9.7 s in 16:9.** Refuted. Line 14 is sliced, line 15 is outside the editor, and half the frame is empty. I misread this in round 3: the editor clips the file, because it fits only 13 full lines.
4. **Live-hold push.** Visible from 29.73 to 31.8 s. Confirmed.
5. **Static run over 2 s outside the end card.** None (the longest is 2.0 s). But max_gap now exceeds 4 s.
6. **Smaller fixes.** The widget is 450 px, the pop is silent, the card starts earlier, and `express.json()` is on `/token`. Confirmed.

**Regressions:** the off-centre zoom-1 framing; server.ts is now 15 lines, which hides `res.json`; max_gap is 4.27 s.

**3 worst problems**
1. **Half-empty 16:9 frame from 7.7 to 10.0 s.** `fz(0, 11)` centres x on the length of line 11.
2. **The end of server.ts never shows.** The file has 15 lines and the editor holds 13, so the route never visibly responds.
3. **max_gap is 4.27 s in the fan.** In 16:9 the caption's first line rises as a single event.

**Fixes for round 5**
1. **Retarget zoom 1 vertically only.** Use `{ ...fz(0, FILES[0].focus), y: fz(0, 11).y }`. Verify from 8.0 to 9.9 s that the gutter stays at the left edge and line 15 is in frame.
2. **Make server.ts fit.**
   - Delete its blank line, so it is 14 lines long.
   - 16:9: set the editor height to 734.
   - 9:16: set `lh` to 44, the editor height to 710, and the slot to y 1160, 460 tall.
   - 9:16 fan cards: set `lh` to 22.
   - Verify at 9.8 s in both formats, and on the cards at 35 s, that every line shows.
3. **Add an event in the fan hold.** In 16:9, start "No certificate code." at `Wd('e1','certificate') − 0.3`, as 9:16 already does. Verify that max_gap is 4 s or less.

**Code (senior engineer):**
- **server.ts** is correct. The handler body is indented at the same depth as `async (req, res) => {`, which is a style nit.
- **connect.tsx** is unchanged. It still has an untyped `{ domain }`, and the button reads "Connect" while the preview reads "Connect domain".
- **webhooks.ts** is correct.

**Verdict:** ANOTHER ROUND. Problems 1 and 2 are visible at normal speed.

## Changes after round 4
1. **Zoom 1.** It keeps the focus line's x (the gutter stays at the left) and moves only vertically, to line 11 once line 11 is typed.
2. **server.ts fits.**
   - The blank line is gone, so the file is 14 lines.
   - 16:9: the editor height is 734.
   - 9:16: lh is 44, the editor height 710, and the slot y 1160 with a height of 460.
   - The file cards use lh 32 in 16:9 and 22 in 9:16.
3. **Fan.** In 16:9, "No certificate code." rises on its own word, as in 9:16.

## Round 5: draft_16x9 + draft_9x16 (VO mix, 30 fps, 42.59 s)

| Criterion | Score | Evidence (px at 360 wide) |
|---|---|---|
| Hook | 8 | f0 reads in both formats, with the caption, real code and a waiting caret. Typing starts at 1.02 s and the zoom at 1.6 s. In 9:16, "Three calls." lands with the VO at 2.83 s and clears the editor. |
| Readability | 8 | 9:16: code 9.3 px, terminal 10 px, pill 12 px, CTA 14.7 px at x ≤ 938, all clear of the UI zones. 16:9: zoomed code 9.45 px, CTA 13.5 px. |
| Motion | 8 | Zoom 1 now moves only vertically (f210 to f294). The 9:16 sheet slides, the result stack, the live-hold push and the world exit are all sprung, with no pops in either strip. Blur is not scored. |
| Variety / pacing | 8 | Longest static run is 1.67 s. The metric's 4.27 s max_gap (from 32.23 s) is blind to caption rises. By frame, events land at 32.1 (cards), 32.42 ("No DNS code."), 33.6 ("No certificate code."), 34.67 ("Just three calls.") and 36.5 s (end card), so the largest real gap is 1.8 s. Typing runs at 34, 37 and 43 cps. |
| Brand | 8 | Green appears only on the live frame. The real Cloudflare glyph is inked, the faces and ™ are right, and the end line follows the docs. |
| Sound sync | 8 | Every hit I checked lands within one frame: f307 file 2, f484 widget, f508 popup, f892 live (29.73 s against 29.743 s), webhook print at 28.93 s, and end card. The metric's 6/12 comes from camera moves under its ±120 ms window. −14.1 LUFS, −2.7 dBFS. |
| Composition | 8 | 16:9 zoom 1 keeps the gutter at the left edge, and lines 7 to 14 are in frame at 9.3 to 9.8 s. The 16:9 result frames markLive, the app and the terminal together. 9:16 stacks the editor, terminal and app without a dead third. The 9:16 end card spans y 518 to 1469. |
| Polish | 8 | No blank frames, no stray carets, and no sliced lines at rest. The 9:16 server.ts card's last line, `});`, touches the card border by about 2 px. Slivers at 28.8 to 29.0 s in 9:16 appear only while the panels move. Loop seam is 10.4. |

**Round-4 fixes checked by frame**
1. **Zoom 1, 8.0 to 9.9 s.** The gutter stays at the left edge. Lines 12 to 14 type in frame, and `res.json(await r.json());` and `});` are fully visible by 9.8 s. Confirmed.
2. **server.ts at 9.8 s.** All 14 lines are visible in both formats. In 9:16 the token terminal sits below them and shows `application_id`. Confirmed.
3. **File cards at 35 s.** 16:9 shows all 14, 12 and 11 lines with room to spare. 9:16 shows every line, but server.ts's `});` is pressed against the bottom border. Confirmed, with that nit.
4. **max_gap.** The metric still reads 4.27 s because it ignores caption-sized changes, but the new 16:9 "No certificate code." rise at 33.6 s is visible. The real gap is 1.8 s. Confirmed by frame.

**Regressions:** none found.

**Remaining issues (none block finals)**
1. 9:16 file card 1: `});` touches the border. Raise the 9:16 card height from 360 to 372, or set `lh` to 21.5. Verify on the frame at 35 s.
2. The review metric misses caption events and treats camera moves as late picture. For the 60 fps finals, compute max_gap on a caption-region crop, and measure sync with camera motion removed.
3. Loop seam is 10.4. Ending the end-card push at the f0 scale would bring it under 10.

**Code (senior engineer)**
- **server.ts:** correct. `auth` and `express.json()` are on the route, `{ domain }` only, `r.ok` maps to 502, and the response is passed through. Its handler body is indented at the same depth as `async (req, res) => {`, which is a style nit.
- **connect.tsx:** correct. It imports `api`, uses `t.application_id`, and has a real `onClick`. Two nits: `{ domain }` is untyped, and the button reads "Connect" while the preview reads "Connect domain".
- **webhooks.ts:** correct. It takes the raw body, checks `X-JE-Signature` with `verify`, returns 401 on failure, calls `JSON.parse`, and handles `connection.live`.

**Verdict:** SHIP. It is ready for the 60 fps finals with motion blur. Fold item 1 and the connect.tsx label into the finals pass, and re-verify the card frame at 35 s.

## Finals pass (after round 5: SHIP)
- The 9:16 file cards are 372 px tall, so server.ts's last line clears the border.
- The preview's button reads "Connect", matching the `<button>` in connect.tsx.
