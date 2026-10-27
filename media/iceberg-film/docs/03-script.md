# Phase 3: Script, order of events, visuals and voice

**Runtime:** 1:16 (the voice sets it).
**Grid:** 72 bpm.
**Voice:** Kokoro `bm_fable` at 0.84×. That is 163 words a minute inside a line and 134 overall.

## Order of events
1. **The surface** (0 to 10 s): one app card and one button, on paper. Then the ink rises under the waterline: that was only the part above the water.
2. **The descent** (10 to 56 s): eight layers, one per line, each with a number, a name, a real figure and a drawn glyph.
3. **The bottom** (57 to 63 s): the camera pulls all the way back. The whole iceberg is in view, the button a speck on top.
4. **The ascent** (64 to 68 s): a bracket closes around everything under the water, labelled CustomDomain™. The camera rushes back up through rising bubbles. The button is pressed, and the domain goes live in green.
5. **The end card** (68 to 76 s).

## Script
| Time | Voice | On screen (stands alone without the voice) | Picture |
|---|---|---|---|
| 1.0 s | This is the button that lets your customers connect their own domain. | "The button that connects *your customer's domain.*" | A clean app card on paper, "Connect domain" in ink. A cursor drifts to it. |
| 5.6 s | It looks small. That's the part above the water. | "That's the part *above the water.*" | The camera eases back. Ink floods in under the card's base line, and the dark shape of the iceberg shows through it. |
| 10.4 s | Underneath, finding where each domain is managed, across a hundred and eighty-nine providers. | 01 · Provider detection · `189 catalogued` · "Where is this domain's DNS?" | The dive. 189 dots appear in a sweep. A detection line passes and 73 fill (automatic); 116 stay open (guided). |
| 16.9 s | Signing in to them. OAuth, Domain Connect, scoped API keys. A different door at almost every one. | 02 · Sign-in rails · `6 OAuth · 1 Domain Connect · 66 API key` | Three doors, each with its own lock, numbered. |
| 24.2 s | For the hundred and sixteen with no door, a guided setup that checks every record by itself. | 03 · Guided setup · `116 providers · checked automatically` | A record card. Each row is ticked by itself as it resolves. |
| 30.4 s | Root domains, which each provider handles its own way. | 04 · Root domains · `flattened CNAME · ALIAS · ANAME · A` | A large "@" branching into the four forms. |
| 34.4 s | Checking every value until it resolves. Every five seconds at first, with a deadline. | 05 · Value checks · `every 5 s at first · 24 h deadline` | A row of ticks, dense at first, then spacing out, ending at a 24 h marker. |
| 40.4 s | Certificates, issued on the first visit, and renewed a month before they expire. | 06 · Certificates · `Let's Encrypt · renews ~30 days early` | A certificate and its life bar: issued, renews early, expiry. |
| 46.9 s | An edge that serves every customer's domain, and never one it shouldn't. | 07 · The edge · `TLS + reverse proxy, on demand` | Domain pills flow into the edge. An unknown host is turned away. |
| 51.9 s | And every hour, checking that none of it has drifted. | 08 · Monitoring · `every live domain, hourly` | A 24-tick ring, a hand sweeping, a dot on every hour. |
| 56.9 s | That's what the button sits on. You could build all of it, and then run it, for as long as you have customers. | "You could build all of it. *Then run it, for as long as you have customers.*" | Pull all the way back: eight layers stacked on one tiny card. |
| 64.0 s | Or embed one widget, and leave the ice to us. | "Or embed one widget. *Leave the ice to us.*" | A bracket draws round the whole underwater mass, labelled CustomDomain™. A fast ascent through bubbles. The button is pressed and turns to a green "Live". |
| 68.3 s | Custom Domain. You ship the button. We run everything under it. | End card: tree mark, CustomDomain™, "You ship the button. *We run everything under it.*", customdomain.ai | Paper again, a slow push. |

## What has to be made
- **Water:**
  - the ink gradient, from the brand ink to near-black at depth
  - a waving waterline
  - light shafts that fade by about the second layer
  - drifting particles with parallax
  - all canvas, seeded
- **The iceberg:** a faceted low-polygon body about eight layers deep, in warm stone greys, wider in the middle and tapering to a point. Seeded triangulation, drawn per frame through the camera.
- **The app card:** paper, stone hairline, chrome dots, "Settings / Domains", "Custom domain", a field showing acme.shop, and an ink "Connect domain" button.
- **Eight glyphs** in clean paper strokes that draw on:
  - the census dots
  - three doors
  - a record card with self-ticking rows
  - the "@" branches
  - the backoff tick row
  - the certificate life bar
  - the edge with an unknown host turned away
  - the hourly ring
- **A depth rail:** "01 / 08" in Geist Mono with a marker.
- **The bracket and label,** bubbles for the ascent, and the end card.

## Voice direction
Low, even and unhurried, like a nature documentary. The numbers are given space. After "above the water" there is a beat of quiet as the ink rises. "for as long as you have customers" lands slowly. The last line is plain, not salesy.
