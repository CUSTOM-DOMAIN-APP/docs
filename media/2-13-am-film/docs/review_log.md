# Review log

## Round 1: draft_16x9 + draft_9x16

Reviewed: renders/draft_16x9.mp4 and renders/draft_9x16.mp4 (70.59 s, 30 fps, VO mix), every image in review/r1/, metrics.json in full, plus my own frame pulls at 360 px wide and frame-exact luma and content measurements across both transitions (scratchpad ticket_c1/). All px values are at 360 px wide unless marked 1080p. The loop seam is not scored, as instructed.

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 6 | 16:9 f0 is a flat #0a0908 field over 86 % of the frame with "Tue 2:13 AM" in the top right corner at about 10 px tall. The script promised "tight on the menu bar clock", but f0 is a wide shot, so the near-blank cap applies. The notification lands at 0.45 s and reads at 0.5 s (title about 10 px), so the problem is clear by 1.5 s. 9:16 is much stronger: f0 shows a "2:13" about 65 px tall plus "Tuesday", and the banner lands at 0.5 s. The 9:16 alone would score 8. |
| Readability at phone size | 6 | 16:9 CTA: on the end card at 70.5 s, "customdomain.ai" is a 9 px band (ascender to baseline, x 18 to 130), in grey mono. It is the smallest text on the card (headline lines 15 and 20 px, wordmark 14 px), which is failure mode 4. Other 16:9 must-reads are 4 to 7 px: "11 open" and the queue rows in the wide at 31.0 s, the activity rows at 40 to 45 s (about 6 px), Priya's "Fri 4:40 PM" (about 5 px), and "Sleep" plus "No new notifications" at 58.4 to 59.8 s (about 5 px and 4 px). 9:16 CTA is 16 px and fine. In 9:16, key text sits in the UI zones: the ticket title at y 40 to 55 and "maya.studio" at y 60 to 85 (top 14 %), "not connected" at x 300 to 345 (right 12 %), and Maya's banner at 52.4 to 55.7 s over y 0 to 90. |
| Motion quality | 5 | 55.73 to 56.07 s is a fade to black used as a transition (luma 236 to 31 over 10 frames), so the cap is 6. The fade also opens with a one-frame step (f1672, luma 236.1 to 189.7), where the 9:16 banner vanishes in one frame. The camera zooms out during the fade, and a lone green "live" pill outlives the rest at 56.067 (strip_fast f1682). 37.43 to 37.77 s is a cross-dissolve, and 37.600 is a uniform 50 % grey ghost (luma 141, content 0 %). At 39.567 s the connection window pops in at full size from bare paper, with no entrance. Positives: the camera moves are smooth, the keyboard rises cleanly at 15.0 s, and the typewriter is crisp. |
| Variety / pacing | 6 | Metrics: max_gap_between_visual_events is 5.23 s from 40.33 s, and longest_static is 3.73 s from 56.1 s (the lock screen, outside the end card). Both trigger the cap of 7. 39.6 to 46.0 s is one locked wide shot of a window whose only changes are 6 px activity rows (39.67, 39.9, 41.43, 43.2, 45.07). "Four weeks later" holds dead still from 37.97 to 39.37 s. 52.5 to 55.7 s is a 3.2 s hold with only the banner. The lock screen has nothing moving from 56.1 to 58.25 s. The night section, from the queue flood to the chat (21 to 35 s), is well paced. |
| Brand accuracy | 7 | Colours and type are on brand. Paper renders #fafaf7 (codec of #fafaf9), ink #1a1816, the day desktop #e6e4e2 (stone), and live green #14a249 (#16a34a), which appears only on live (52.0 s pill, 9:16 "maya.studio is live"). Errors are inverted, never red (acme.shop.acme.shop, the label, "not connected"). Fonts are Instrument Serif, Inter and Geist Mono. CustomDomain™ is correct in Priya's message and on the wordmark. Story errors: the night DNS check (11.5 to 37.5 s) already shows edge.customdomain.ai, the target of a product the platform has not shipped yet. It expects a CNAME at @ on a root domain, and Sam's reply tells Maya to use @. FACTS says "DNS forbids a CNAME at the root", so the film's hero gives wrong advice at an unnamed provider. The day's CNAME @ at Cloudflare is fine (flattened, root-domains.mdx:16, providers.mdx:48), and so is Cloudflare sign-in (providers.mdx:48). |
| Sound sync | 6 | Metrics give hits_within_45ms 6/19 and a mean absolute error of 66.7 ms. Several hits are off by more than 80 ms, so the cap is 6: queue fills at 30.41 s (-167 ms), 30.86 s (-100) and 31.31 s (+100); Send click at 20.18 s (+100); "approved" click at 45.08 s (-100); activity 5 at 46.88 s (-133). Loudness is on target: -14.1 LUFS, true peak -2.8 dBTP (ebur128, both formats). The VO is placed well on its words: "another" 4.00 s against the click at 4.0, "name" 13.69 against the inversion at 13.5, the three questions within 0.1 s, "shipped" 35.74 against Priya at 35.6, "written", "checked" and "kept" 0.15 s ahead of their rows, "live" 52.00 against the pill at 51.8, and "two thirteen" 56.14 against the lock screen at 56.1. |
| Composition (every format) | 6 | In 9:16, a third or more of the frame stays empty for over a second in several places: the lock screen at 0 to 4 s (y 300 to 560 of 640), the chat at 34.3 to 37.3 s (y 230 to 560), the day page at 39.6 to 46 s (bottom 37 %), and the end card at 59.8 to 70.6 s (only the URL at y 461 to 476 in the bottom third). That triggers the cap of 7. The 16:9 zooms slice words at the frame edge: the ticket list at x 0 from 4.6 to 21 s ("n't working", "d a CNAME?"); half of the ticket at x 0 to 150 from 32.5 to 37.3 s ("cme.shop", a half "Name field" chip, a stray "Send"); "NNECTION" at x 0 from 46.9 to 51.8 s, with a dead grey band at x 280 to 360 at the same time. On the 16:9 end card the block sits in x 17 to 240, so the right third is empty paper. |
| Polish | 5 | Blank or near-blank frames mid-film, so the cap is 7. At 37.600 s the frame is a 50 % grey blend (content 0 %). At 37.800 s the paper is bare, with only the glyph tops of "Fou" above the mask (failure modes 10 and 12). From 39.467 to 39.567 s, four frames are pure paper with content 0 % in both formats. Metrics miss these four frames. At 56.033 to 56.067 s, two frames are near black (luma 31 to 40). Text overflows the DNS check card from 11.5 to 37.5 s: "edge.customdomain.a" runs past the card edge (card ends at x 1226 at 1080p, text clipped at 1260). In 9:16, the arrival banners at 23.4, 25.7 and 27.5 s cover "Domains N open", leaving glyph bottoms showing under the banner. Clock continuity: the clock stays at 2:13 while the UI stamps 2:19 (20.3 s), 2:21 (31 s) and 2:24 (33 s). The 9:16 status bar reads 10:24 at 37.3 s while the screen is still in night mode, and both formats switch to "2:13" or "Wed 2:13 AM" at 55.73 s over the lit day page. |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **The turn breaks at 37.3 to 39.6 s.** This is the emotional hinge of the film, and it plays as a dissolve, then a blank frame, then a title card on an empty field, then four more blank frames, then a pop.
   - The dark to light switch is a crossfade, so 37.600 is a uniform washed-out grey with a ghosted UI.
   - The light-mode version of Sam's screen lives for only 3 frames (37.70 to 37.77) before a hard cut to bare paper at 37.8. The idea of "the same screen, in daylight" never registers.
   - "Four weeks later" sits centred on an empty field for 1.4 s, which is a banned look. It leaves before anything replaces it, which gives 4 pure paper frames at 39.467 to 39.567 s. Then the window pops in at full size.
   - Cause: the appearance switch, the title and the connection page are sequenced back to back with gaps, not overlapped.
2. **The night's fix is wrong on screen, and the night already shows the product.** From 11.5 to 37.5 s the DNS check expects a CNAME at @ on the root domain acme.shop, and Sam types "use @". FACTS: "DNS forbids a CNAME at the root". The record also points at edge.customdomain.ai before CustomDomain™ has shipped. Its value overflows the card for 26 s. A support or ops lead, who is the target viewer, will catch both errors. Cause: the night content reuses the day's record shapes.
3. **The ending dims to black, then sits still.**
   - 55.73 s starts with a one-frame snap (luma 236 to 190, and the 9:16 banner vanishes).
   - Then a fade to black with a camera pull, a stray green pill at 56.067, and 2 near-black frames.
   - Then the lock screen is dead still for 2.15 s (longest_static 3.73 s), and its payoff text ("Sleep", "No new notifications") is 4 to 5 px in 16:9, so a muted viewer cannot read it.
   - Before the dim, the clock already reads "Wed 2:13 AM" over the lit page.
   - Cause: the dim is a fade with no designed handoff, and the lock screen has no new event between 56.1 and 58.25 s.

**Fixes for round 2** (concrete, each with a verify step)
1. **Rebuild the turn (37.3 to 39.7 s).**
   - Replace the crossfade with a top-down appearance wipe of about 0.4 s with a soft edge, so no frame is a 50 % blend of the two palettes.
   - Hold the light-mode helpdesk and chat for at least 0.6 s.
   - Then deliver "Four weeks later" on that screen, as a system banner or toast under the menu bar, not as a centred title on bare paper.
   - Start the connection window's spring entrance (from scale 0.96 and y +24 px at 1080p) before the previous element finishes leaving, so the two overlap by at least 6 frames.
   - Verify: per-frame content from 37.0 to 40.0 s never drops below 2 %, near_blank_frames lists nothing in that range, strip_fast2 shows no uniform grey frame, and the 16:9 at 38.0 s shows the light helpdesk.
2. **Fix the night DNS story and the overflowing card.**
   - Make Maya's domain a subdomain, for example shop.acme.com. The documented failure is shop.acme.com typed in the Name field, which becomes shop.acme.com.acme.com. Expected name: shop.
   - Point the night record at the fictional platform's own target, for example domains.yourplatform.com, so edge.customdomain.ai first appears after the turn.
   - Update Sam's typed reply to match ("use shop instead of shop.acme.com").
   - Widen the DNS check card, or shrink the mono value, so the value fits inside it.
   - Verify: a full-res frame at 14.2 s and at 31.7 s shows the whole value inside the card, and grep the night timeline: "edge.customdomain.ai" and a CNAME at @ appear nowhere before 37.4 s.
3. **Redesign the move into the next night (55.6 to 59.8 s).**
   - Keep the day clock (Tue 10:24 AM, status 10:24) until the cut.
   - Exit Maya's banner with motion, not in one frame.
   - Replace the fade to black with a designed handoff: either the display "sleeps" as a quick brightness dip to about 25 % then a cut on the beat, or the lock screen slides up over the page. The live pill must leave with the page.
   - On the lock screen, bring in the Sleep pill on "two thirteen" (56.4 s), and keep a slow push of 2 to 3 % running to 59.8 s.
   - Set "Sleep" and "No new notifications" to at least 9 px tall at 360 in 16:9.
   - Verify: longest_static under 2 s, no frame-to-frame luma step above 20 outside a deliberate cut, no frame with luma under 15 and content 0 %, and in phone_16x9.jpg at 58 to 59 s both lines can be read.
4. **Retime the off-sync hits.** Move the picture or the cue for queue fills (30.04, 30.41, 30.86, 31.31 s), the Send click (20.18 s), the "approved" click (45.08 s) and activity 5 (46.88 s) so each picture lands within 45 ms of its sound. Verify: metrics.sync shows hits_within_45ms at 17/19 or better, and no non-tick cue with an absolute error over 80 ms.
5. **Make the 16:9 CTA the most legible line.**
   - Set customdomain.ai in ink, not grey, at about 2x its current size: a band of at least 18 px at 360 (about 96 px at 1080p).
   - Re-block the end card so the block uses the frame. A larger headline, or the wordmark and URL set against the right two thirds, would both work.
   - Verify: measure the URL band at 70.5 s on a 360 px frame. It must be at least 18 px and no smaller than the wordmark band.
6. **Reframe the 16:9 zooms.**
   - 4.6 to 21 s: frame the ticket list fully in or fully out.
   - 32.5 to 37.3 s: centre the chat window, or include the whole ticket card, with no half chips at x 0.
   - 46.9 to 51.8 s: pan left until "CONNECTION" and the activity column's new rows are in frame, so "Records written", "Records checked: both resolve" and "maya.studio is live" are seen on their words.
   - Verify: every frame of phone_16x9.jpg from 4 to 55 s has no word cut by the frame edge, and the 48 s frame shows the activity row "Records checked: both resolve".
7. **Make the time jump readable with the sound off.**
   - Put a date divider ("Friday") above Priya's message, and set her timestamp to at least 8 px at 360 in 16:9.
   - Advance the night clock with the action: 2:13 at the start, 2:19 at Send, 2:24 at the chat.
   - Verify: a muted viewing of phone_16x9.jpg at 35 to 37 s shows a date break between Sam's 2:24 AM message and Priya's message, and the menu bar time matches the newest stamp on screen.
8. **Keep the 9:16 banners off the titles.**
   - Slide the screen content down by the banner's height while a banner shows, or dock the banner over the status bar only.
   - Give the arrival banners their question text, not just "#4472 · Dev P.".
   - Verify: full-res 9:16 frames at 23.5, 25.8 and 52.6 s show no glyph slices under a banner, and the open count stays visible.
9. **Fill the empty 9:16 zones.**
   - Lock screen at 0 to 4 s: stack two older, dimmer notifications under Maya's.
   - Chat at 34.3 to 37.3 s: keep the keyboard up until Priya's message lands, or scroll the thread to sit above the composer.
   - Day page: set the activity rows larger so the list reaches the bottom quarter.
   - End card: centre the type block vertically, or drop the URL to sit 70 to 75 % down the frame.
   - Verify: safe_9x16.jpg shows no stretch of at least a third of the frame empty for over 1 s outside the end card, and the end card's bottom third holds more than the URL.
10. **Make 16:9 f0 what the script promised.** Open tight on the clock, with "Tue 2:13 AM" at least 40 px tall at 360, and pull back as the notification lands at 0.45 s. Verify: the f0 pull at 360 shows the clock filling at least a third of the frame width, with no flat field over half the frame.

**Smaller issues** (ranked)
1. **The end card line "Your customers never touch DNS." goes beyond FACTS.** The census has 116 of 189 providers guided by hand. The docs' own wording is "You never touch their DNS" (getting-started/widget.mdx:7). The second line, "Neither does your support team", is consistent with that. Either confirm the first line is an approved tagline, or change it to a hedge such as "Your customers sign in. They never edit records." (verify that against the facts before use).
2. **The VO may say "Meyer".** In a2, faster-whisper (scripts/vo_check.py) hears "Meyer added her records", while d1 is heard as "Maya". Listen at 6.38 s and re-synthesise if the name sounds like "Meyer".
3. **"Four weeks later" enters with glyph tops showing.** At 37.8 to 37.9 s, only the top slices of "Four weeks later" show through the mask (failure mode 10).
4. **"Sign in" and its activity row are apart.** The VO says "sign in" at 40.12 s, but "Maya signed in to Cloudflare" lands at 41.43 s, on "provider". Also, d1 begins at 38.44 s over the empty "Four weeks later" card.
5. **The 16:9 toast lingers.** At 4.2 s, the notification is still visible and cropped at the right edge while the ticket opens.
6. **The 16:9 banner leaves an orphan.** Maya's banner at 52.5 to 55.7 s breaks "That was / it?", leaving "it?" alone on the third line.
7. **Sam's reply disappears.** After Send at 20.3 s, the reply box empties to "Reply sent · 2:19 AM", and his reply never appears in the thread.
8. **The 9:16 keyboard has no punctuation keys.** It has no "@", "." or "," and no lit shift, so capitals and punctuation type with no key lit (for example "acme." at about 17.8 s). Letters and space light one key per character, in step with the text, so the keyboard otherwise reads well.

**Specific checks**
- **Real products: none imitated.** The interfaces are generic. The desktop uses common conventions (a menu bar with "Helpdesk File Edit View Window", grey window dots), and the phone uses an iOS-like lock screen, keyboard and Sleep focus pill. Neither shows a logo, brand colour or product name. The chat is a generic channel layout. Cloudflare is named only as text, and that is documented (providers.mdx:48). I saw no Cloudflare logo on screen.
- **Voice against screen: it matches at every line**, within about 0.3 s. Two exceptions: "sign in" is 1.3 s ahead of its row, and the d1 opening plays over the empty title card.
- **Muted clarity: the night reads without the voice; the turn and the payoff do not.** The night works on its own: the clock, the ticket, the inverted error, the reply, the queue going from 4 to 11, and Sam's chat. Priya's "Shipped" message reads as a live reply at 2:24 AM, because the only time cue is "Fri 4:40 PM" at about 5 px. In 16:9, the activity column is off frame after 46 s, and the lock screen payoff is 4 to 5 px.
- **Night to day: not clean.** There is one washed-out grey frame (37.600), one near-blank frame (37.800) and four blank paper frames (39.467 to 39.567). There is no near-black frame in that transition, but the dim at 56.03 to 56.07 s gives two.
- **Phone keyboard and typing: both read.** Each key lights on its character, and the text is about 9 px at 360.
- **Activity events against their words: they land in 9:16.** written 46.88 against 47.03, checked 48.04 against 48.19, kept 49.22 against 49.37, live 51.77 against 52.00. In 16:9 the activity column is cropped away from 46 s, so those rows are never seen.
- **16:9 zoom crops: yes, three awkward runs.** 4.6 to 21 s, 32.5 to 37.3 s, and 46.9 to 51.8 s (see Fix 6).

**Verdict:** ANOTHER ROUND. No criterion reaches 8, the film is in round 1, and the turn at 37 to 40 s needs a rebuild before anything else.

## Changes after round 1
1. **The turn.**
   - Both appearance changes are now cuts on the beat (37.5 s and 55.5 s). No grey dissolve and no dim to black.
   - After the cut, the same helpdesk and chat show in light mode. A "Four weeks later" card lands on them, and leaves upward as the connection page springs in over it (they overlap by about 0.45 beats).
2. **The night DNS.**
   - Maya's night domain is the subdomain shop.acme.com, mistyped as shop.acme.com.acme.com. The expected name is `shop`.
   - The value is the platform's own target, domains.yourplatform.com, on its own row inside the card.
   - Sam's reply is "enter just shop".
   - No edge.customdomain.ai and no CNAME at @ appear before the turn.
3. **Into the next night.**
   - Maya's note slides away, then the cut on the beat to the lock screen, which pushes in 3 % to the end card.
   - The Sleep pill lands on "thirteen" and "No new notifications" on "asleep". Both are 50 px (16:9).
4. **Sound.**
   - The approved click is on its row.
   - A tick plays with the Sleep pill.
   - The music's day section follows the new cut points.
5. **End card.**
   - The line is now "You never touch their DNS. Neither does your support team.", following the docs' wording (widget.mdx). Line f1 was re-voiced to match, and the film is now 69.72 s.
   - The URL is 100 px Mono in ink (16:9).
6. **16:9 framing.**
   - Ticket shots keep their left edge on the queue/ticket divider.
   - The queue shot frames the queue and the whole ticket pane.
   - The helpdesk minimises before the chat zoom.
   - The day page is framed whole at 1.3 to 1.36, with larger type (activity 34 px, connection 64 px), so "Records checked" is in view at 48 s.
   - Maya's note is a large notification (46 px), read with the whole screen in view.
7. **The time jump.**
   - A "Friday" divider sits above Priya's message, and the chat type is larger.
   - The clock advances with the newest stamp: 2:13, 2:19 at Send, 2:20 to 2:23 with the tickets, and 2:24 at the chat.
8. **9:16 banners.** The banners now carry their question. The inbox steps down while a banner shows, and the connection page steps down under Maya's banner.
9. **9:16 fill.**
   - The lock screen shows two older notifications, and Maya's arrives on top and pushes them down.
   - The keyboard stays up until the cut.
   - The activity rows are 48 px.
   - The end card spans y 400 to 1320.
10. **16:9 open.** It opens tight on the clock (5×) and pulls back as the notification lands.
11. **Smaller fixes.**
    - The toast leaves on the click.
    - The keyboard gained a "." key, and shift lights for capitals.

## Round 2: draft_16x9 + draft_9x16

Reviewed: renders/draft_16x9.mp4 and renders/draft_9x16.mp4 (69.72 s, 30 fps, VO mix), every image in review/r2/, metrics.json in full, plus my own frame pulls, exact-frame extractions and a frame-by-frame brightness and content scan of both films (scratchpad ticket_c2/). All px values are at 360 px wide unless marked 1080p. The loop seam is not scored.

**Round 1 fixes, checked against frames**
1. **The turn, 37.0 to 40.0 s: partly landed.**
   - Landed: no frame in either format falls below 2 % content, and the light helpdesk and chat are on screen at 38.0 s.
   - New problems: the "Four weeks later" card appears at full size in one frame (f1133, 37.767 s). The connection window appears from nothing in one frame (16:9 f1188, 39.6 s). The card vanishes in one frame (f1196, 39.867 s). Then the 16:9 camera jumps to a new framing (f1197), and the 9:16 hard cuts to the page.
2. **Night DNS: landed.** At 14.2 s and 31.7 s, full res, the name shop.acme.com.acme.com, the value domains.yourplatform.com and the expected name shop all sit inside the card. edge.customdomain.ai first appears at 46.9 s.
3. **Into the next night: mostly landed.**
   - Maya's note slides off from 55.1 to 55.47 s, and the cut lands at 55.5 s. The clock reads 10:24 until the cut.
   - The Sleep pill lands at 56.2 s ("thirteen" is at 56.36 s), and "No new notifications" at 58.5 s ("asleep" is at 58.55 s).
   - In 16:9 the payoff now measures 10 px ("Sleep") and 8 px ("No new notifications"), up from 4 to 5 px.
   - The 3 % push is not visible: the clock's bounding box moves about 1 px at 320 wide over 4 s.
4. **Sync: not landed.** hits_within_45ms is 5/19 (6/19 last round), with a mean of 70.3 ms. Only "approved" moved, from -100 to -67 ms. My own onset check agrees: Send's picture is +107 ms late and question 3 is +140 ms late.
5. **16:9 URL: mostly landed.** "customdomain.ai" is now ink, a 15 px band (x 19 to 195). That is at least the wordmark's 14 px, but not the 18 px asked for. It reads cleanly.
6. **16:9 framing: partly landed.**
   - Landed: every hold is free of sliced words, and "Records checked: both resolve" is in frame at 48.2 s.
   - Not landed: the moves at 4.2 to 4.6 s and 21.3 to 21.6 s still pass through cut words ("isn't working", "the records 3 days ago", "ng after 2 days").
   - New: the new framing leaves dead black zones (see Composition).
7. **Date divider and clock: landed.** "Friday" is 7 px and Priya's stamp line is 8 px. The clock reads 2:13, 2:19 at 23.2 s, 2:23 at 31.7 s, 2:24 at 32.0 s, then 10:24.
8. **9:16 banners: landed.** Each banner carries its question, the list steps down, and "Domains N open" stays readable (23.5, 25.8, 27.6 s). Maya's banner pushes the page down at 52.5 s.
9. **9:16 fill: partly landed.**
   - The lock screen holds three cards, and the keyboard stays up through the chat.
   - The day page still has its bottom 40 % empty from 39.9 s until the fifth row lands at 46.9 s.
10. **16:9 open: not landed.** At f0 the clock is 14 px tall (y 13 to 26) and spans x 227 to 335, about 30 % of the width. 98.8 % of the frame below the menu bar is flat black.

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 6 | 16:9 f0 is still near blank: a 14 px clock over a 98.8 % flat field, so the cap applies and last round's problem is still visible. The notification pops in at full size at f14 (0.467 s), and for 4 frames its words are sliced at x 0 ("ticket #4471 · Maya R.", "domain isn't working"). It reads by 0.7 s. 9:16 is strong: "2:13" is about 65 px at f0, and two older cards set the scene. However, Maya's card fades in over the older card's text from 0.467 to 0.533 s (3 frames of text over text). |
| Readability at phone size | 6 | Better: the 16:9 URL is a 15 px band in ink. The activity rows are about 8 px, Maya's note about 9 px, and the lock-screen payoff 8 to 10 px. "Friday" is 7 px. In 9:16 the key text still sits in the shaded UI zones: "maya.studio" at y 45 to 60 and the ticket title at y 25 to 40, both in the top 14 %. Last round's cap of 7 still applies, and the problem is still visible, so the score cannot rise above 6. |
| Motion quality | 5 | Big gains: both appearance changes are now cuts on the beat, with no dissolve and no fade to black, and the banners and the keyboard move cleanly. Pops remain:<br>• the notification at 0.467 s<br>• the chat window, at full size at 32.033 s after the helpdesk minimises<br>• the "Four weeks later" card at 37.767 s<br>• the connection window from nothing at 39.6 s (16:9)<br>• the card's one-frame exit at 39.867 s, with a camera jump at 39.9 s (16:9) or a hard cut (9:16)<br>The window pop was noted last round and is still visible, so the score stays at 5. |
| Variety / pacing | 6 | By eye, the metrics' 4.1 s "static" from 15.8 s is typing, with a character every 2 to 3 frames and a key tick each. It reads as action, though the 16:9 camera stays locked from 15.5 to 20.0 s. The 5.4 s gap from 41.4 s is fine by eye: readable 8 px rows land at 41.43, 43.2, 45.05 and 46.88 s. Still dead: "Four weeks later" holds still from 37.77 to 39.6 s (1.8 s), and the lock screen shows nothing new from 56.2 to 58.5 s (2.3 s; the push cannot be seen). That second hold is over 2 s and was noted last round. |
| Brand accuracy | 8 | The night DNS is now correct (subdomain, the platform's own target, expected name shop). CustomDomain™'s edge appears only after the turn. The end card follows widget.mdx:7 ("You never touch their DNS"). Paper, ink, stone, the single green on live, inverted errors, Instrument Serif, Inter, Geist Mono and CustomDomain™ are all correct. The interfaces stay generic. |
| Sound sync | 6 | hits_within_45ms is 5/19, with a mean of 70.3 ms. Over 80 ms: queue fills at 30.41 s (-167), 30.86 s (-100) and 31.31 s (+100); Send at 20.18 s (+100); question 3 at 27.36 s (+100); the team chat pop at 32.02 s (-100). Loudness: -14.1 LUFS, true peak -2.8 dBTP. f1 now transcribes exactly. a2 still transcribes as "Meyer added her records" (6.38 s). |
| Composition (every format) | 6 | New dead black zones in 16:9:<br>• 5.5 to 13 s: the ticket window ends at x 265, leaving the right 26 % flat black.<br>• 15.5 to 21.2 s: the right 33 % is black.<br>• 33.0 to 37.4 s: the chat window sits at x 150 to 355, leaving the left 41 % black.<br>In 9:16, the day page's bottom 40 % is empty from 39.9 to 46.9 s, and the lock screen's bottom half is empty from 55.5 to 59.8 s. The 9:16 end card now fills y 129 to 448. |
| Polish | 6 | New blank frames at 31.933 to 32.0 s (3 frames, luma 10, content 0 %), between the helpdesk minimising and the chat appearing. metrics.json misses them (near_blank_frames is empty). Other faults:<br>• 9:16, 0.467 to 0.533 s: Maya's card is double-exposed over the older card's text.<br>• 9:16, 37.77 to 39.8 s: the "Four weeks later" card covers Priya's message, leaving the slivers "Ship", "Cus" and "gh".<br>• f1796 (59.867 s): the wordmark is sliced by its mask.<br>• 16:9, 52.4 to 55.1 s: Maya's note covers the "maya.studio" title.<br>Fixed: the card overflow, the 9:16 banner collisions and the clock continuity. |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **The turn still lands on pops (37.767 to 39.9 s).** The handoff is now overlapped and free of blanks, but the hinge of the film is built from one-frame events:
   - The card appears at full size at f1133.
   - In 16:9 the connection window appears from nothing at f1188.
   - The card disappears mid-rise at f1196.
   - Then the camera jumps (16:9), or the shot hard cuts to the page (9:16), at f1197.
   - Cause: the card and the page have no animated entrances or exits, only on and off states.
2. **The sync was not retimed.** 5/19 hits are within 45 ms, and six non-tick cues are off by 100 to 167 ms. The worst sit on the queue flood (30.0 to 31.3 s) and on Send (20.18 s), which are the night's two most physical moments. Cause: only the "approved" cue was moved.
3. **16:9 framing trades sliced words for dead black and blank frames.** A third of the frame is flat black through the ticket holds (5.5 to 21.2 s). The chat holds (33.0 to 37.4 s) leave the left 41 % black. The helpdesk-to-chat handoff leaves 3 empty black frames (31.933 to 32.0 s), and the chat window then pops in. f0 is still a 14 px clock over black. Cause: the camera frames the window rather than the content, and the minimise and the chat entrance run in sequence instead of overlapping.

**Fixes for round 3** (concrete, each with a verify step)
1. **Animate the turn instead of switching it.**
   - Give the "Four weeks later" card a spring entrance (rise 24 px at 1080p, from scale 0.96) over at least 8 frames.
   - Let its exit rise fully out of frame, or under the page, over at least 8 frames.
   - In 16:9, spring the connection window in from y +40 px. Ease the camera reframe at 39.9 s over at least 10 frames.
   - In 9:16, slide the connection page up over the chat instead of the hard cut at 39.9 s.
   - Verify: extract frames 1128 to 1205 in both formats. No element should appear or vanish in one frame at more than half its final size, and no frame-to-frame shift of the whole frame should exceed 40 px at 1080p.
2. **Retime the six off-sync cues**: queue fills at 30.04, 30.41, 30.86 and 31.31 s, Send at 20.18 s, question 3 at 27.36 s and the team chat pop at 32.02 s. Verify: metrics.sync shows at least 17/19 within 45 ms and no non-tick cue over 80 ms.
3. **Re-block the 16:9 night and its handoff.**
   - Ticket holds, 5.5 to 21.2 s: zoom about 1.35x further, so the ticket pane spans the frame width.
   - Chat, 33.0 to 37.4 s: centre the chat window and scale it to at least 75 % of the frame width.
   - Handoff: start the chat window's entrance (spring from the right) while the helpdesk is still minimising, with an overlap of at least 6 frames.
   - Open: make f0 truly tight, with "Tue 2:13 AM" at least 40 px tall. Slide the notification in rather than popping it, and keep its words off the frame edge.
   - Verify:
     - In phone_16x9.jpg, no hold from 4 to 37 s shows more than 20 % of the width as flat black.
     - The brightness and content scan finds no frame under 1 % content between 31.5 and 32.5 s.
     - The f0 pull shows the clock at least 40 px tall.
4. **Fix the 9:16 leftovers.**
   - Slide Maya's lock-screen card down from the top after the older cards have moved, with no opacity overlap.
   - Move the page content down so "maya.studio" sits below y 90 of 640.
   - Fill the day page's lower third before 46.9 s, for example by moving the activity block up under the records or setting it larger.
   - Verify: frames 13 to 17 show no text over text; safe_9x16.jpg shows no title in the top 14 %; the 41 s frame has content below y 430.
5. **Re-voice "Maya" in a2** (for example, spell it "Mya" for the TTS). Verify: scripts/vo_check.py reads a2 as "Maya added her records".

**Smaller issues** (ranked)
1. **The lock-screen push cannot be seen.** The clock moves about 1 px at 320 over 4 s. Make the push 5 to 6 % with an ease, or bring in one more quiet element, so 56.2 to 58.5 s is not dead.
2. **The "Four weeks later" card covers useful text.** In 9:16 it lands over Priya's message, leaving "Ship", "Cus" and "gh". Place it over the empty composer or keyboard area instead.
3. **The end card's first frame is a sliced wordmark** (f1796, 59.867 s). Start the mask one frame later, or pad it.
4. **"No new notifications" is 8 px and "Friday" is 7 px** at 360 in 16:9. Raise both to 9 px or more.
5. **Maya's 16:9 note covers the "maya.studio" title** from 52.4 to 55.1 s. Dock the note to the right of the title.
6. **The 16:9 window title bar is cut at the top edge** from 41 to 51 s ("Domains · maya.studio").
7. **The 16:9 typing hold, 15.5 to 20.0 s, is a locked shot.** A 2 % push would carry it.

**Verdict:** ANOTHER ROUND. No score is 8 or higher except Brand accuracy. Three round-1 fixes did not land (sync, 16:9 open, part of the framing), and the turn now fails on one-frame pops instead of blank frames. The film is not ready for 60 fps finals.

## Changes after round 2
1. **The turn, animated.**
   - The "Four weeks later" card springs in from scale 0.4. It leaves by shrinking to 0.4 while lifting over 0.55 beats.
   - The 16:9 connection window springs in from half size, 40 px below.
   - The camera eases from the chat framing to the whole screen (response 0.5 beats). The forced cut of the camera is gone.
   - In 9:16 the connection page slides up over the chat.
   - In 9:16 the card sits at y 1250, clear of Priya's message.
2. **Sync.**
   - The question rows, pings, toasts and banners all land on the same beat (the old 0.15-beat lead is gone).
   - The 16:9 camera reaches the wide shot 1.4 beats before the flood, so the flood rows land on a still frame.
   - The send whoosh is 0.1 beat later. The chat pop sits on the chat's entrance.
3. **16:9 night, re-blocked.**
   - It opens on a lock screen: "2:13" at 300 px, with Maya's notification growing in from scale 0.4. The lock screen lifts as the ticket opens.
   - The ticket holds are at 2.4×, so the ticket pane fills the frame, with a slow push while Sam types.
   - The chat is centred, 800 px wide at 1.95× (about 80 % of the frame), with 28 px type. It springs in while the helpdesk minimises.
   - The day page is framed whole at 1.2 (title bar in frame), with 36 px activity rows.
4. **9:16.**
   - The older lock-screen cards step down before Maya's grows in, so no text sits over text.
   - The day page title is at y 336. Activity sits under it, and the connection card holds the lower third from the start.
   - Maya's banner pushes the page down 140 px.
5. **Line a2 re-voiced** as "Maya. She added her records three days ago, and she launches tomorrow." Speech recognition now reads "Maya". The film is now 70.28 s.
6. **Smaller fixes.**
   - The lock-screen push is now 6 %, eased.
   - "No new notifications" is 60 px.
   - "Friday" is 26 px at 1.95×.
   - The end-card wordmark rises only after the card is up.
   - The 16:9 page steps down 160 px under Maya's note, so the title stays clear.

## Round 3: draft_16x9 + draft_9x16

Reviewed: renders/draft_16x9.mp4 and renders/draft_9x16.mp4 (70.28 s, 30 fps, VO mix), every image in review/r3/ and metrics.json in full. I also scanned every frame of both films for content, flat-black area and frame-to-frame change. Sync was checked by frame against cues.json, and the voice with scripts/vo_check.py (frame pulls in scratchpad ticket_c3/). All px values are at 360 px wide unless marked otherwise. The loop seam is not scored.

**Round 2 fixes, checked against frames**
1. **The turn (16:9 frames 1148 to 1229, 9:16 the same): passes.**
   - The cut lands on the beat at f1148 (38.267 s).
   - The card springs in from 0.4 at f1154 and holds until f1199.
   - It exits by shrinking to about 0.4 while lifting (f1200 to f1207), then goes.
   - The 16:9 connection window enters at f1204 at half size, 40 px low. That is exactly at the limit, and the chat window stays visible behind it. The camera eases out over f1208 to f1216.
   - In 9:16 the page slides up from f1206 to f1218.
   - Nothing appears or vanishes in one frame at more than half its final size.
2. **Sync, the six flagged cues counted by frame: five of six fixed.**
   - Question 3 lands at f841 for a ping at 28.033 s (0 ms).
   - The four flood rows land at f918, f930, f943 and f957 for pings at 30.600, 30.975, 31.425 and 31.875 s (0, +25, +8 and +25 ms).
   - The chat window first appears at f972 for a pop at 32.392 s (+8 ms). The metric's -133 ms measures the helpdesk minimise, not the chat.
   - Send still fails. The cursor sits on the lit button from f619, the click sounds at 20.742 s (f622.3), but the text only clears at f625 (20.833 s): picture +91 ms late.
3. **16:9 holds at 20 % flat black or less: passes for the ticket and typing holds, borderline elsewhere.**
   - 4 to 28.9 s: at most 9.1 % flat desktop black.
   - The chat holds (33 to 38 s): 22.7 %. That is the margin around a centred window about 80 % of the frame wide, and it reads well.
   - The flood wide (29.5 to 32.2 s): 29 to 33 %.
4. **31.5 to 32.5 s: one frame short.** The three blank frames are gone. One frame, f975 (32.5 s), measures 0.84 % content mid-whip, but the chat window is visible in it. That will read as motion at 60 fps with blur.
5. **16:9 frame 0: passes.** It is a lock screen with "2:13" at 42 px tall and "Tuesday" under it. Maya's notification grows in from 0.4 at 0.45 s and reads by 0.6 s.
6. **9:16 frames 13 to 17: passes.** The older cards step down at f7 to f8, Maya's card grows from 0.4 starting at f8, and no text overlaps any text.
7. **9:16 at 41 s: passes.** The DNS records card fills y 425 to 480. "maya.studio" sits at y 118 to 143, below the top zone.
8. **Line a2: passes.** vo_check.py reads "Maya, she added her records three days ago, and she launches tomorrow." The other differences are homophones (two thirteen/2:13, right/write).
9. **Smaller round-2 items: all fixed.**
   - The lock-screen push now shows: the clock goes from 83 to 89 px wide at 320 between 56.3 and 60.3 s.
   - "No new notifications" is 9 px and "Friday" is 9 px.
   - The end-card wordmark rises only after the cut.
   - The 16:9 page steps down under Maya's note, so the title stays clear.
   - The 16:9 window title bar is in frame.

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | 16:9 f0 is a lock screen with "2:13" at 42 px tall and "Tuesday" under it. The notification grows in from 0.4 at f14 (0.45 s, ping at 0.45 s) and reads by 0.6 s. 9:16 f0 shows "2:13" at about 65 px with two older cards, and Maya's card grows in on top at f8 with no text over text. |
| Readability at phone size | 6 | Most things read now. The 16:9 URL is a 15 px band in ink, the chat 9 to 11 px, "Friday" 9 px, "No new notifications" 9 px, and the activity rows about 8 px. The 9:16 night titles are still in the top 14 % UI zone: the ticket title at y 64 to 84 (6.0 s) and "# support" at y 47 to 64 (35.0 s). This was noted in rounds 1 and 2 and is still visible, so the score holds at 6. |
| Motion quality | 7 | The turn now springs in and out cleanly, and the page slide, the banner pushes, the note exit and the lock-screen push all move with weight. One visible pop is left. The 16:9 lock screen lifts away (f108 to f116), then 8 frames show only the empty "No ticket selected" pane (f117 to f124). The full ticket then appears in one frame at f125 (4.167 s), a luma step of 12, the largest outside the cuts. That triggers the cap of 7. The 9:16 ticket at the same moment slides in cleanly. |
| Variety / pacing | 7 | The metric's longest_static is 3.33 s from 4.17 s, and by eye it is real. After the cursor stops at 5.4 s, the 16:9 ticket holds still until the "not connected" badge at 7.83 s. The 9:16 holds still from 4.7 to 7.83 s. Both are over 2 s, so the cap of 7 applies. The re-voiced a2 opens with "Maya." and a pause, which stretched this hold. The 6.5 s gap from 40.9 s is fine by eye: readable rows land at 42.0, 43.77, 45.63 and 47.1 s. The lock screen is no longer dead: the pill lands at 56.77 s, the push runs from about 57.6 s, and the text lands at 58.83 s. |
| Brand accuracy | 8 | Unchanged and correct. The night shows the platform's own target, edge.customdomain.ai appears only after the turn, and the end card follows widget.mdx:7. Paper, ink, stone and the single green are right, errors are inverted, the fonts are Instrument Serif, Inter and Geist Mono, CustomDomain™ is written correctly, and every interface stays generic. |
| Sound sync | 6 | Counted by frame, 5 of the 6 cues flagged in round 2 now land within 25 ms, and so do question 1 and 2, the label, the inverted name, approved (+24), live (+30), Maya's note and "No new notifications". Send is still +91 ms (f625 against a click at 20.742 s), which is over 80 ms, so the cap of 6 applies. The end-card thump is +58 ms (cut at f1813, thump at 60.375 s). Metric: 8/18 within 45 ms, mean 50.1 ms. Loudness -14.1 LUFS, true peak -2.7 dBTP, in both formats. |
| Composition (every format) | 6 | 16:9 is re-blocked well: the ticket pane fills the frame (at most 9 % flat black from 4 to 28.9 s), the chat is centred at about 80 % width, and the day page is framed whole. The 9:16 lock screens still leave the bottom half empty: 0 to 4 s below y 330, and 56.3 to 60.4 s below y 300 of 640. This was noted in round 2 and is still visible, so the score holds at 6. Also: the 16:9 flood wide (29.5 to 32.2 s) leaves the right third black, and the 9:16 day page has an empty band at y 280 to 400 from 41 to 46 s (about 19 %). |
| Polish | 6 | There is a near-blank run mid-film at 3.9 to 4.133 s (f117 to f124): 8 frames of the empty "No ticket selected" pane, luma 22, content 0.76 %. That triggers the cap of 7. Smaller faults: in the 16:9 activity column, "Maya approved the DNS change" wraps and leaves "change" alone on its line from 45.6 to 56.3 s, and the 16:9 chat send at 34.57 s shows only the caret vanishing. Fixed since round 2: the 31.93 s blank frames, the 9:16 double exposure, the card slivers over Priya's message, the sliced end-card wordmark, and the note over the title. |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **The 16:9 lock-to-ticket handoff (3.62 to 4.17 s).** The new lock-screen open lifts away to reveal an empty helpdesk ("No ticket selected") for 8 frames, then the whole ticket pops in at f125. Right after a strong hook, the story's first screen arrives as a blank and then a jump. Cause: the ticket opens only after the lock screen has cleared, with no entrance of its own.
2. **Send is still 91 ms late (20.742 s click, f625 picture).** It is the one physical action Sam completes in the film, and the click lands three frames before anything changes on screen. Cause: the click cue sits on the cursor press, but the visible state change (the text clearing) is drawn 0.09 s later.
3. **The ticket hold is dead (4.7 to 7.83 s in 9:16, 5.4 to 7.83 s in 16:9).** The picture is still while the voice reads "Maya. She added her records". Cause: line a2 grew by a beat and a pause, and nothing on screen was added to fill it.

**Fixes for round 4** (concrete, each with a verify step)
1. **Fix the 16:9 lock-to-ticket handoff.** Open Maya's ticket behind the lock screen before it lifts, so the lift reveals the ticket. Or slide the ticket pane in from the right across f112 to f124, under the lift. Verify: content is at least 2 % on every frame from f105 to f135, and no frame-to-frame luma step exceeds 6 around 4.17 s.
2. **Retime Send.** Either move the click cue to 20.833 s, or draw the button press and the text clear at f622. Verify by frame: the first frame with the text cleared is within one frame (±33 ms) of the click onset in cues.json, and metrics.sync shows no non-tick cue over 80 ms.
3. **Break the ticket hold.** Put a slow 2 to 3 % push on the ticket from 4.7 s in both formats. Or land the "not connected" badge on "Maya" (6.38 s) instead of at 7.83 s. Verify: longest_static is under 2 s outside the end card, in both formats.
4. **Clear the 9:16 top zone at night.** Move the ticket, inbox and chat content down about 40 px at 360 (about 120 px at 1080 wide), so "My domain isn't working", "Domains" and "# support" start at y 95 or lower. Verify: in safe_9x16.jpg, no screen title sits in the top 14 % from 4 to 38 s.
5. **Fill the 9:16 lock screens.** Centre the clock group vertically, with "2:13" at about 30 to 35 % down. In the next night, sit the Sleep pill and "No new notifications" near the middle. Verify: at 2 s and 59 s, no continuous empty band taller than a third of the frame.

**Smaller issues** (ranked)
1. **"No new notifications" lands early.** It arrives at 58.83 s, on "I'm" (58.68 s), 290 ms ahead of "asleep" (59.12 s). Move it to about 59.1 s.
2. **"Maya approved the DNS change" wraps in the 16:9 activity column**, leaving "change" alone on its line (45.6 to 56.3 s). Widen the column by about 20 px at 1080p, or write "Maya approved the change".
3. **The 16:9 chat send has no visual beat.** At 34.57 s it shows only the caret vanishing. A small settle of Sam's message, or a "sent" tick, would give the whoosh something to land on.
4. **The 9:16 page slide has no edge.** At 40.2 to 40.6 s it slides up with no top edge or shadow, so for a few frames it reads as the chat text scrolling. Add a stone hairline or a soft shadow.
5. **The 16:9 flood wide leaves black on the right.** The window sits in the left two thirds from 29.5 to 32.2 s, leaving the right third black. Centring it would remove the dead third.
6. **The end-card thump is +58 ms.** It is under 80 ms but outside 45.
7. **One frame is mostly black mid-whip.** At 32.5 s (f975) the 16:9 whip measures 0.84 % content. It reads as motion and should blur at 60 fps, but starting the chat window a frame earlier would clear it.

**Verdict:** ANOTHER ROUND. Hook and Brand reach 8, but Readability, Composition, Polish and Sound sync are at 6, and Motion and Pacing at 7. The remaining work is narrow: the 16:9 4 s handoff, the Send cue, the 4.7 to 7.8 s hold, and the 9:16 top zone and lock-screen fill. Those five fixes should clear every cap.

## Changes after round 3
1. **16:9 open.** The ticket is already open behind the lock screen as it lifts (from open − 0.8), so there is no empty pane and no pop.
2. **Send.** The click is on the frame the reply clears (send).
3. **Ticket hold.**
   - "not connected" lands on "Maya" (about 6.4 s), with a tick.
   - In 16:9 the camera pushes in slowly from 2.4 to 2.47 while a2 is read.
4. **9:16 night.**
   - The ticket content sits 120 px lower.
   - The inbox header and list sit 170 px lower.
   - The chat header is at y 194, with the messages below it.
   - No title is in the top 14 %.
5. **9:16 lock screens.**
   - Tuesday: clock at 340, notifications from 860.
   - Wednesday: clock at 590, pill at 1100, note at 1270.
6. **Smaller fixes.**
   - "No new notifications" lands on "asleep".
   - The activity row reads "Maya approved the change", so it no longer wraps.
   - A "✓ Sent" beat sits under Sam's 16:9 chat message.
   - The 9:16 day page slides up with a top edge and a shadow.
   - The 16:9 flood wide is framed at 1.3 (less black).
   - The end-card thump is 0.08 b earlier.

## Round 4: draft_16x9 + draft_9x16

Reviewed: renders/draft_16x9.mp4 and renders/draft_9x16.mp4 (70.27 s, 30 fps, VO mix), every image in review/r4/ and metrics.json in full. I also scanned every frame of both films (content, flat black, pixel change, still runs) and checked every hit cue in cues.json against the picture by frame, in both formats. Sound onsets were confirmed in audio/sfx.wav and in the rendered mix (frame pulls in scratchpad ticket_c4/). All px values are at 360 px wide unless marked otherwise.

**Round 3 fixes, checked against frames**
1. **16:9 f105 to f135: passes by eye, at the threshold by measure.**
   - The lock screen now lifts off a ticket that is already open. The ticket text emerges from under the lock edge at f116 and settles by f119, with no empty pane and no pop.
   - Lowest content is 1.98 % at f115, the frame where the lock covers the top and the pane below has not yet revealed text.
   - The largest brightness step is 6.8 at f116, which is the ticket emerging.
   - Both numbers sit right at the limits I set. Nothing reads as a jump.
2. **Send: passes.** The click onset is 20.816 s in sfx.wav, and the reply clears at f625 (20.833 s), +17 ms, in both formats.
3. **Longest static: not met in either format.** The ticket hold is fixed: "not connected" lands at f189 on its tick at 6.300 s, and the 16:9 camera pushes through a2. But the still-run scan (no pixel change above 12) finds other holds outside the end card:
   - 16:9: the opening lock screen, 0.93 to 3.63 s (2.7 s). metrics.json agrees: 2.87 s from 0.77 s.
   - 9:16: the opening lock screen, 0.9 to 4.17 s (3.27 s).
   - 9:16: the day page, 50.07 to 52.33 s (2.27 s) and 53.4 to 55.87 s (2.47 s).
   - These holds were present in round 3 too. I missed them because I only scanned the 4.2 to 8 s window.
4. **9:16 top 14 % from 4 to 38 s: passes.**
   - "My domain isn't working" sits at about y 105 to 120 of 640, "Domains" at about 95, and "# support" at about 95.
   - The only things in the zone are the small "‹ Domains" back link at its lower edge, the arrival banners (which belong there), and body text scrolled up above the keyboard while Sam types (18 to 20.5 s).
5. **Lock screens at 2 s and 59 s: 9:16 at 59 s fails, the rest pass.**
   - At 2 s, the longest empty band is 21 % (9:16) and 22 % (16:9).
   - At 59.0 s, the 9:16 Wednesday screen has an empty band of 37 % of the height, from y 203 of 320 to the bottom. The band lasts from the cut at 56.27 s until "No new notifications" lands at 59.08 s, then shrinks to 29 %.
   - 16:9 at 59 s is 30 %.

**Smaller items from round 3:** all fixed except one.
- Fixed: "No new notifications" lands at f1773 (59.10 s) on "asleep" (59.12 s).
- Fixed: "Maya approved the change" fits on one line.
- Fixed: "✓ Sent" springs in at f1037 on the 34.571 s whoosh.
- Fixed: the 9:16 day page slides up with a top edge and a soft shadow (40.25 to 40.55 s).
- Fixed: the 16:9 flood wide now shows 10 to 16 % flat black (was 29 to 33 %).
- Fixed in effect: the 16:9 whip frame f974 (32.467 s) still measures under 1 % content with the chat window visible, and reads as motion.
- Got worse: the end-card thump. It now sounds at 60.314 s (sfx.wav onset), but the cut to the end card is still at f1813 (60.433 s), so the picture is 115 ms late (it was 58 ms late). Moving the thump 0.08 beats earlier went the wrong way.

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | 16:9 f0 shows "2:13" at 42 px and "Tuesday". The notification grows in from 0.4 at f14 (ping at 0.45 s) and reads by 0.6 s. 9:16 f0 shows "2:13" at about 30 % down, with two older cards below. Maya's card grows in at f8 with no overlap, and the longest empty band at 2 s is 21 %. |
| Readability at phone size | 8 | The 9:16 night titles are now out of the top 14 % (the ticket title at y 105 to 120 of 640, "Domains" and "# support" at about 95). The 16:9 URL is a 15 px band in ink, the activity rows about 8 px, "Friday" and "No new notifications" 9 px, and the 9:16 URL 19 px. Every must-read line reads in phone_16x9.jpg and phone_9x16.jpg. |
| Motion quality | 8 | The 16:9 lock lift now reveals the ticket in one continuous move (f108 to f119), with no pop. The turn is unchanged from round 3: the card springs in (f1154) and out (f1200 to f1207), the window springs in from half size (f1204), and the 9:16 page slides up with an edge and shadow. "✓ Sent", the banners, the note exit and the lock push all carry weight. Nothing fades as an enter or exit. |
| Variety / pacing | 7 | Still runs over 2 s outside the end card: the 16:9 opening lock screen from 0.93 to 3.63 s (metric: 2.87 s from 0.77 s), the 9:16 opening lock screen from 0.9 to 4.17 s, and the 9:16 day page from 50.07 to 52.33 s and from 53.4 to 55.87 s. So the cap of 7 applies. The ticket hold from round 3 is fixed (the badge at 6.30 s and a 16:9 push through a2). The 6.5 s metric gap from 40.9 s is fine by eye: rows land about every 1.8 s. |
| Brand accuracy | 8 | Unchanged and correct: the platform's own target at night, edge.customdomain.ai only after the turn, the end card per widget.mdx:7, paper, ink and stone, the single green on live, inverted errors, the three brand faces, CustomDomain™, generic interfaces. |
| Sound sync | 6 | Counted by frame, these now land within 25 ms in 16:9: Send (+17 ms), "not connected" (0), the inverted name, the label, questions 1 to 3, the four flood rows, the chat pop, "✓ Sent", Priya, approved, live, Maya's note and "No new notifications". Two hits are off by more than 80 ms, so the cap of 6 applies:<br>• The end-card thump: onset 60.314 s, cut at f1813 (60.433 s), +115 ms late in both formats.<br>• In 9:16, the team chat pop sounds at 32.392 s, but the inbox holds until a hard cut to the chat at f978 (32.600 s), +208 ms late.<br>Loudness is -14.1 LUFS, true peak -2.7 dBTP. |
| Composition (every format) | 6 | 16:9 is fully re-blocked: at most 9 % flat black from 4 to 28.9 s, 10 to 16 % in the flood wide, and a centred chat. The 9:16 Tuesday lock screen is fixed. The 9:16 Wednesday lock screen still leaves an empty band of 37 % from the cut at 56.27 s until 59.08 s (2.8 s). That is over a third for over 1 s, which caps the score at 7. It was noted last round and is still visible, so the score holds at 6. |
| Polish | 8 | No blank frames: the lowest-content frames are f115 (1.98 %, mid-lift) and f974 (whip, chat window visible). No double exposures, no slivers, no stray carets. Clock continuity holds. The round-3 polish items (wrap, send beat, slide edge) are all fixed. |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **The end-card thump lands 115 ms before the cut (60.314 s against f1813).** It is the film's final hit, under "Custom Domain". Cause: the thump was moved 0.08 beats earlier, but the picture cut was not moved, so the gap widened.
2. **The 9:16 chat pop is 208 ms ahead of its picture (32.392 s against f978).** In 9:16 the inbox holds still, then hard cuts to #support at 32.6 s. Cause: the cue is placed for the 16:9 chat entrance, and the 9:16 cut sits 6 frames later.
3. **Still holds and one empty band remain.**
   - The opening lock screen is still for 2.7 s (16:9) and 3.27 s (9:16).
   - The 9:16 day page is still for 2.27 s and 2.47 s near the end of the day.
   - The 9:16 Wednesday lock screen leaves its bottom 37 % empty for 2.8 s.
   - Cause: the lock screens and the 9:16 day page have no camera move, and the Wednesday group sits high.

**Fixes for round 5** (concrete, each with a verify step)
1. **Put the end-card cut on the thump.** Either move the cut to f1810 (60.333 s), or move the thump back so its onset is at 60.433 s. Verify: the sfx.wav onset is within ±33 ms of the first end-card frame.
2. **Align the 9:16 chat cut with its pop.** Either move the 9:16 cut to f972 (32.40 s), or give 9:16 its own pop at 32.600 s. Verify: in 9:16, the first #support frame is within one frame of the pop onset.
3. **Move the opening lock screens.** Add the same eased push used on the Wednesday lock screen, 3 to 4 % from 0.8 s to the lift, in both formats.
4. **Move the 9:16 day holds.** Add a slow 2 % push from 49.9 to 56.2 s, or let the records card settle on "kept" and the banner breathe.
5. **Verify fixes 3 and 4 together:** no still run over 2 s outside the end card in either format, using a test of no pixel change above 12 at 180 or 320 px.
6. **Lower the 9:16 Wednesday group.** Move it down about 120 px at 1080 by 1920, with the clock at about 710 instead of 590, so the empty band below the Sleep pill is under a third before the note lands. Verify: at 57.0 s and 59.0 s, the longest empty band in 9:16 is under 33 % of the height.

**Smaller issues** (ranked)
1. **The 16:9 window springs in at exactly half size in one frame** (f1204). It meets the limit, and 60 fps blur should soften it, but starting at 0.4 would give margin.
2. **The lift frames sit right at the thresholds.** f115 measures 1.98 % content and f116 a brightness step of 6.8. By eye they read cleanly, but starting the ticket's reveal one frame earlier would clear both.
3. **metrics.json misreads several cues.** It reports "not connected" at -100 ms and the chat pop at -133 ms, which are 0 ms and +8 ms by frame in 16:9. It also reports the thump at -67 ms, but it is +115 ms. Trust the per-frame check over metrics.sync until the measure is fixed.

**Verdict:** ANOTHER ROUND. Hook, Readability, Motion, Brand and Polish are at 8. Pacing (7), Sound sync (6) and Composition (6) hold the film back, and all three come down to small, mechanical fixes: two cue alignments, three gentle pushes, and one lowered lock-screen group. If those land with no new faults, round 5 should be a SHIP.

## Changes after round 4
1. **End card.** The thump is on the end card's first frame (B.end − 0.3, 60.41 s against the card at 60.43 s).
2. **9:16 chat.** The cut to #support is at chat − 0.25, on the pop, as in 16:9.
3. **Opening lock screens.** Both formats push in 3.5 % (eased) from 1.0 beat until the lift or the tap. The 16:9 lift starts one frame earlier.
4. **9:16 day page.** It pushes in 2 % (eased) from live − 3 b to the cut.
5. **9:16 Wednesday lock.**
   - The group is centred: clock at 590, pill at 1100, note at 1270.
   - It has a status row and the lock screen's torch and camera buttons at the bottom. The Tuesday lock has the same buttons.
6. **Smaller fix.** The 16:9 connection window springs in from 0.4.

## Round 5: draft_16x9 + draft_9x16

Reviewed: renders/draft_16x9.mp4 and renders/draft_9x16.mp4 (70.27 s, 30 fps, VO mix), every image in review/r5/ and metrics.json in full. I also scanned every frame of both films (content, flat black, pixel change, still runs, empty bands) and checked every hit cue in cues.json by frame, in both formats. Sound onsets were confirmed in audio/sfx.wav and in the rendered audio of both drafts (frame pulls in scratchpad ticket_c5/). All px values are at 360 px wide unless marked otherwise.

**Round 4 fixes, checked against frames**
1. **Thump against the first end-card frame: passes.** The thump starts at 60.413 s in sfx.wav (60.420 s in both renders). The first end-card frame is f1813 (60.433 s), so the picture is 13 to 20 ms behind the sound, inside ±33 ms.
2. **9:16 #support cut against its pop: passes.** The pop starts at 32.392 s, and the cut is at f972 (32.400 s), +8 ms. 16:9 is unchanged: the chat window first shows at f972, also +8 ms.
3. **No still run over 2 s outside the end card: passes in both formats.**
   - 16:9: the longest still run is 1.3 s (24.97 to 26.27 s, the inbox between questions). The opening lock screen now pushes 3.4 % (the clock grows from 506 to 523 px wide at 1080p between 0.8 and 3.6 s).
   - 9:16: the longest still run is 1.97 s (6.3 to 8.27 s). The opening lock screen pushes 3.4 % (472 to 488 px), and the day page pushes from 50 s to the cut.
   - metrics.json still reports 2.83 s from 0.77 s. Its threshold is finer than the slow push, and by eye that stretch moves.
4. **9:16 empty band at 57.0 s and 59.0 s: passes.** It measures 31 % at 57.0 s and 32 % at 59.0 s. The torch and camera buttons and the status row now hold the bottom. It is 34 % for about 0.3 s between the cut (56.27 s) and the Sleep pill landing. 16:9 measures 31 % and 30 %.
5. **The smaller items: pass.** The 16:9 connection window now springs in from 0.4 (f1204 to f1215). The 16:9 lift is cleaner: the lowest content in f105 to f135 is 2.00 %, and the largest brightness step there is 5.5.

**New in round 5: the 9:16 page slide is drawn see-through.**
- From f1209 to f1216 (40.30 to 40.53 s), the 9:16 connection page slides up without its paper fill. "‹ Domains", "maya.studio", "pending", "ACTIVITY" and "Maya opened Connect domain" print directly over Sam's and Priya's chat messages for 8 frames (see the 40.4 s full-res pull).
- In round 4, the same slide was opaque, with a top edge and a shadow.
- The 16:9 window over the same beat is opaque, and it is clean.

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | 16:9 f0 shows "2:13" at 42 px with "Tuesday". 9:16 f0 shows "2:13" at about 30 % down, with two older cards. Maya's notification grows in at f14 in both formats (+17 ms from its ping) and reads by 0.6 s. The slow push now runs from 0.8 s. |
| Readability at phone size | 8 | Unchanged from round 4. The 9:16 night titles sit at y 95 to 120 of 640, out of the top zone. The 16:9 URL is a 15 px band in ink, and the 9:16 URL 19 px. "Friday" and "No new notifications" are 9 px, and the activity rows about 8 px. |
| Motion quality | 8 | The opening and day pushes are eased and steady. The 16:9 lift reveals the open ticket in one move, the 16:9 window springs from 0.4, the card springs in and out, and the banners and note exit carry weight. The 9:16 lock to ticket is a tap cut at f125 with a short settle, which reads as an app opening. Nothing fades as an enter or exit. |
| Variety / pacing | 8 | No still run reaches 2 s outside the end card in either format (longest: 1.3 s in 16:9, 1.97 s in 9:16). The 6.5 s metric gap from 40.9 s holds rows landing about every 1.8 s. The build runs from the day's activity into live, the note, the cut to night, and the card. |
| Brand accuracy | 8 | Unchanged and correct: the platform's own target at night, edge.customdomain.ai only after the turn, the end card per widget.mdx:7, paper, ink and stone, the single green on live, inverted errors, the three brand faces, CustomDomain™, generic interfaces. |
| Sound sync | 8 | By frame, every hit lands within 30 ms in both formats. Examples: ticket +17, "not connected" 0, inverted name +2, label +6, Send +16, questions +14/+14/+1, flood 0/+25/+8/+25, chat +8, "✓ Sent" +29, Priya +17, connection page +2, approved +24, live -4, Maya's note +6, "No new notifications" +20, end card +20 ms. metrics.json reports 12/18 within 45 ms because it measures camera motion around several cues. Loudness -14.1 LUFS, true peak -2.7 dBTP. |
| Composition (every format) | 8 | 16:9 is re-blocked throughout: the ticket pane fills the frame, the flood wide has 10 to 16 % black, the chat is centred, and the day page is framed whole. The 9:16 lock screens now hold their bottoms (empty band 21 % on Tuesday, 31 to 32 % on Wednesday). |
| Polish | 7 | There is a double exposure mid-film: in 9:16, from f1209 to f1216 (40.30 to 40.53 s), the connection page's text prints over the chat's text, which caps the score at 7. Everything else is clean: no blank frames, no slivers, no stray carets, and clock continuity holds. |

**3 worst problems** (ranked by damage to the film, each with timestamp and cause)
1. **The 9:16 page slide is see-through (f1209 to f1216, 40.30 to 40.53 s).** On the phone cut, the turn's last move shows two screens of text printed over each other. Cause: the sliding page has lost its paper background (the round-4 edge and shadow are also gone), likely in the change that added the day-page push.
2. **The opening push is barely readable as motion.** The 3.4 % push over 2.8 s moves the clock about 0.2 px per frame at 1080p. It passes my still-run test and reads by eye, but metrics.json still flags it.
3. **The 9:16 lock screens borrow strong iOS cues.** The torch and camera buttons in the bottom corners, plus the Sleep focus pill, are close to iOS. There is no logo or name, so it stays generic, but it is the nearest the film comes to imitating a real product.

**Fixes for round 6** (concrete, each with a verify step)
1. **Give the 9:16 connection page an opaque paper fill (#fafaf9) for its whole slide**, and restore the stone top edge and soft shadow from round 4. Verify:
   - Pull 9:16 f1200 to f1220 at full resolution. No frame shows chat text inside the page's area.
   - The page's top edge is visible from its first frame.
   - Rerun the full-frame scan. The only differences from round 5 should be in f1200 to f1220.

**Smaller issues** (ranked, none blocking)
1. **Lengthen the opening push if metrics.json must pass.** Use 5 % instead of 3.4 %, over the same span.
2. **Soften the iOS cues.** Restyle the torch and camera buttons as plain stone circles with simpler glyphs, or drop them and keep the status row.
3. **The 9:16 Wednesday empty band** measures 34 % for about 0.3 s before the Sleep pill lands at 56.6 s. Landing the pill one beat earlier would clear it.

**Verdict:** ANOTHER ROUND. Seven criteria are at 8. Polish is capped at 7 by one regression: the see-through 9:16 page slide at 40.30 to 40.53 s. It is a one-line fix. Once round 6 shows that slide opaque and the full-frame scan finds nothing new, this is a SHIP for 60 fps finals.

## Changes after round 5
1. **9:16 page slide.** The connection page is opaque (#fafaf9) for its whole slide, with its stone top edge and soft shadow. The cause was two style updates on the same frame, where the second replaced the first's background. They are now one style object.
2. **Smaller fixes.**
   - The opening lock screens push 5 %.
   - The lock-screen buttons are plain stone circles with no glyphs.
   - The Wednesday Sleep pill lands at the start of e1.

## Round 6: draft_16x9 + draft_9x16

Reviewed: renders/draft_16x9.mp4 and renders/draft_9x16.mp4 (70.27 s, 30 fps, VO mix), every image in review/r6/ and metrics.json in full. I also diffed every frame of both films against round 5, re-ran the full scan (content, still runs, empty bands, brightness steps), and checked the changed cues by frame (frame pulls in scratchpad ticket_c6/). All px values are at 360 px wide unless marked otherwise.

**Round 5 fix, checked against frames**
1. **9:16 f1200 to f1220: passes.**
   - The connection page is opaque paper for its whole slide.
   - Its stone top edge and soft shadow show from its first frame (f1207, 40.23 s), rising from the bottom of the frame.
   - No chat text appears inside the page's area on any frame. Above the edge, the chat is simply covered as the page rises.
   - The 40.4 s full-res pull shows the page clean: "‹ Domains", "maya.studio", "pending", "ACTIVITY" and the first row, on paper.
2. **Full re-scan: nothing new.** Against round 5, the only frames that differ are where the changes were made:
   - 16:9: 1.8 to 3.97 s (the opening push) and 56.43 to 56.73 s (the Sleep pill).
   - 9:16: 1.5 to 4.13 s (the opening push), 40.17 to 40.83 s (the page slide) and 56.43 to 56.73 s (the Sleep pill).
   - Every other frame is identical, so every round 5 measure still holds there.
   - The rescan finds no blank frames (the only frame under 1 % content is the 16:9 whip at 32.467 s, with the chat window visible). No still run passes 2 s outside the end card (longest: 1.3 s in 16:9, 1.97 s in 9:16). No new brightness steps.

**The three smaller items**
1. **The opening push is now 4.9 % in both formats: passes.** The clock grows from 506 to 531 px wide at 1080p in 16:9, and from 472 to 495 px in 9:16, between 0.8 and 3.6 s.
2. **The lock-screen buttons are plain stone circles with no glyphs: passes.** The lock screens no longer carry the torch and camera icons, so nothing reads as a specific phone OS.
3. **The Sleep pill lands at f1693 (56.433 s) against its tick at 56.438 s (-5 ms) and the voice's "and" at 56.44 s: passes.** The 9:16 Wednesday empty band is 34 % only for the 5 frames between the cut and the pill. From 56.5 s on it is 31 to 32 %.

**On the metrics.json flags.** longest_static now reports 2.63 s from 56.43 s. By eye, and by my pixel test, the Wednesday lock screen is never still: the 6 % push runs from the pill to the end card. hits_within_45ms still reads 12/18 because it measures camera motion. By frame, every hit is within 30 ms, as in round 5.

| Criterion | Score | Evidence (timestamps, frame numbers, metric values) |
|---|---|---|
| Hook (first 2 s) | 8 | f0 reads in both formats: "2:13" at 42 px (16:9) and about 65 px (9:16), with "Tuesday". Maya's notification grows in at f14 (+17 ms) and reads by 0.6 s. A visible 4.9 % push runs from 0.8 s. |
| Readability at phone size | 8 | Every must-read line reads in phone_16x9.jpg and phone_9x16.jpg. The URL is 15 px in ink (16:9) and 19 px (9:16). "Friday" and "No new notifications" are 9 px. The 9:16 titles sit outside the top 14 % zone. |
| Motion quality | 8 | The pushes, the lift, the springs on the card and windows, the banners, the note exit, and the 9:16 page slide (now opaque, with an edge and shadow) all move with weight. Nothing fades as an enter or exit. Motion blur arrives in the 60 fps finals. |
| Variety / pacing | 8 | No still run reaches 2 s outside the end card in either format. Something new lands about every 1.5 to 2 s through the day section, and the build runs live, note, night, card. |
| Brand accuracy | 8 | Paper, ink and stone. The single green is only on live, errors are inverted, and the three brand faces are used. CustomDomain™ is written correctly throughout. The platform's own target shows at night, and edge.customdomain.ai only after the turn. The end card follows widget.mdx:7. Every interface is generic, including the lock screens. |
| Sound sync | 8 | By frame, every hit is within 30 ms in both formats. The new Sleep pill is -5 ms. Loudness is -14.1 LUFS, true peak -2.7 dBTP, in both formats. The VO matches the on-screen words. |
| Composition (every format) | 8 | 16:9 is re-blocked, not cropped, in every section. Both 9:16 lock screens hold their lower thirds (21 % and 31 to 32 % empty bands). The 9:16 day page fills to the records card. |
| Polish | 8 | No blank frames, no double exposures, no slivers at masks, no stray carets. Clock continuity holds. The round 5 see-through slide is gone. |

**3 worst problems** (ranked by damage to the film, none blocking)
1. **One mostly black frame in the 16:9 whip (f974, 32.467 s, 0.84 % content, chat window visible).** At 30 fps it reads as motion. In the 60 fps finals with motion blur it should smear into the move. Check it in the finals' scan.
2. **The 9:16 Wednesday lock screen shows a 34 % empty band for 5 frames** (56.27 to 56.43 s), before the Sleep pill lands. It is too short to read as empty.
3. **metrics.json misreads two measures.** longest_static says 2.63 s from 56.43 s (a slow push), and sync says 12/18 (camera motion). Neither matches the picture. Re-run the per-frame checks on the finals rather than trusting those two numbers.

**For the 60 fps finals** (checks, not fixes)
1. **Re-run the full-frame scan on both finals.** There should be no frame under 1 % content outside the cuts and the whip, and no still run over 2 s outside the end card.
2. **Re-check the hit cues by frame at 60 fps.** All should be within ±45 ms, and the end-card thump should stay within ±33 ms of the card's first frame.
3. **Re-measure loudness after the final mux.** Target -14 ±0.5 LUFS, with true peak at or under -1 dBTP.
4. **Pull 9:16 at 40.1 to 40.9 s and 16:9 at 38.2 to 40.6 s in the finals.** Confirm the page and window stay opaque, and that the blur does not ghost text across them.

**Verdict:** SHIP. Every criterion is at 8 or above, the film is on round 6, and the frame diff against round 5 shows the fixes changed nothing outside their own frames. It is ready for 60 fps finals with motion blur, subject to the four checks above.
