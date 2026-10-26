# Phase 3: Script, order of events, visuals, voice

**Runtime:** 1:44 (103.6 s). **Voice:** Kokoro `af_heart` at 0.85× speed: 238 words, 164 wpm inside a line, 138 wpm overall once the pauses are counted. **Grid:** 92 bpm; every visual cue is placed on a voiceover line or on a word inside it (word timings come from speech recognition run on the rendered voice, `audio/vo_words.json`).

## Order of events

1. **The button** (0 to 10 s): the moment every app has.
2. **Domains live everywhere** (10 to 22 s): 100+ places to buy a domain; most people use more than one.
3. **The usual way** (22 to 53 s): a list of records, then seven stations along a jagged line that ends in an X, giving up, or a ticket.
4. **The turn** (53 to 57 s): the jagged line is pulled straight.
5. **With CustomDomain™** (57 to 92 s): the same button opens the widget inside the app; the provider is detected; the customer signs in and approves once; behind the scenes the records are written, verified and secured; the site is live and kept that way.
6. **The comparison** (92 to 97 s): seven steps across two websites, or one sign-in.
7. **The end card** (97 to 104 s): "Your customers should never touch DNS."

## Two-column script (voice | on screen)

On-screen text is written to stand alone, so the no-voiceover cut reads completely with the sound off. With the voice, each caption is a shorter form of what the voice says.

| Starts | Voice (as spoken; the brand is read "Custom Domain") | On-screen text | Visual |
|---|---|---|---|
| 0.8 s | Every app that lets customers bring their own domain has this button. | “Every app with custom domains has *this button.*” | A line-drawn app window draws itself: sidebar, “Settings / Domains”, and the **Connect domain** button. |
| 5.4 s | What happens after the click decides whether they ever go live. | “What happens *after the click?*” | The cursor clicks; the button inks in; a ring ripples out. A line runs off the frame to a big hand-drawn “?”. |
| 10.1 s | Your customers can buy a domain from over a hundred different websites. | “**100+** places to buy a domain” | Twenty storefronts draw in, one after another. |
| 15.0 s | And most of them use more than one. | “Most people use *more than one.*” | The customer appears. Three storefronts get circled; the rest fade to stone. |
| 17.6 s | A shop here. A blog there. An old idea from years ago. | acme.shop · maya.blog · oldidea.io | On “shop”, “blog”, “idea”, a domain tag writes itself and a line wires it from the customer to a different storefront. |
| 22.3 s | Today, that click usually hands your customer a list of DNS records. And a job. | “A list of DNS records. *And a job.*” | The usual way: the button turns into a card of records to add at “your provider” (A, CNAME, TXT, typed on). |
| 28.7 s | First, remember where the domain was bought. | 1 · Remember where you bought it | The camera follows a jagged ink line to station 1: a thought bubble of storefronts and a question mark. |
| 31.6 s | Then leave your app and sign in somewhere else. Forgot the password? Reset it. | 2 · Leave your app  3 · Sign in somewhere else | Station 2: two browser tabs and a jump between them. Station 3: a login card; “Forgot password?” is scribbled under; a reset envelope. |
| 37.0 s | Hunt through the menus for the DNS settings. | 4 · Find the DNS settings | Menus inside menus: Domains › Manage › Advanced › DNS settings, and a lost, looping arrow. |
| 40.1 s | Copy every record by hand, exactly right. | 5 · Copy each record by hand | Two panels; records are copied across with arrows, and one is typed wrong (“wwww.”). |
| 43.5 s | Then wait, and hope. | 6 · Wait up to 48 hours | A clock whose hands race. |
| 45.3 s | One wrong character, and the domain never connects. That's where customers give up, or open a support ticket. | 7 · Check it worked → “One typo. It never connects.” | The site does not load: a big X. Branches: “gave up” (a scribble off the page) and “support ticket” (an envelope). The camera pulls back to the whole jagged path; chip: “7 steps · 2 websites · hours of waiting”. The drawings erase, leaving the line. |
| 53.5 s | Custom Domain takes all of that off their plate. | “CustomDomain™ takes all of that *off their plate.*” | Every drawing erases with its words, leaving the bare path. It is pulled taut where it lies, point by point; the seven nodes merge into four; it holds, then settles into the rail: Type your domain · Sign in · Approve · Live. |
| 57.1 s | Same app. Same button. They type their domain once. | “Same app. *Same button.*” | The same app; the cursor clicks the same button; the CustomDomain™ widget opens inside the app and “acme.shop” is typed. Stop 1 fills. |
| 60.8 s | We automatically detect where the domain is managed. | “We find where it’s *managed.*” | A lens sweeps five storefronts and stops: “Managed at Cloudflare” ✓. |
| 64.6 s | Then, without leaving your app, they sign in to that provider, and approve once. | “Sign in. *Approve once.*” | “Sign in to Cloudflare” inside the widget, annotated “right inside your app · no new tab”. Sign in, then Allow. Stops 2 and 3 fill. |
| 69.9 s | That's it for your customer. | “That’s it for *your customer.*” | A large green check over the widget. |
| 72.4 s | Behind the scenes, we add the exact DNS records, check that they resolve, and issue the HTTPS certificate. | “We add the records, verify them, and *issue HTTPS.*” | Behind the scenes: the Cloudflare DNS zone for acme.shop; the two records CustomDomain™ writes (CNAME @ and CNAME www, both to edge.customdomain.ai; no verification TXT, since the sign-in proves control) write themselves ✓, “All records resolve” ✓, a padlock: “HTTPS certificate issued”. “Written by CustomDomain™, not by your customer.” |
| 81.0 s | The domain is live. Connected correctly, the first time. | “Live. *Correct the first time.*” | The customer’s site at https://acme.shop with a Live badge. The Live stop fills green. |
| 85.3 s | And we keep it that way. We check it every hour, and renew certificates before they expire. | “And kept that way, *every hour.*” | A green loop draws around the site and a dot keeps orbiting it: Checked every hour ✓ · Certificates renewed ✓ · Drift fixed ✓ (in the voice's order). |
| 91.8 s | Seven steps across two websites, or one sign-in that never leaves your app. | “Seven steps, or *one sign-in.*” | Side by side: the jagged path (7 steps · 2 websites · hours of waiting) and the straight rail (1 sign-in · 0 records to copy · minutes to live). |
| 97.3 s | Custom Domain. Your customers should never touch DNS. | “Your customers should never *touch DNS.*” | The tree mark and CustomDomain™ wordmark, the line, and customdomain.ai underlined. |

## What had to be drawn

All in ink line on paper (rough.js, seeded), each drawing on along its own length:

- **The app:** browser chrome, sidebar, "Settings / Domains", the Connect domain button (it inks in when pressed).
- **Storefronts:** a roof, a scalloped awning, a body, a door and a window. Twenty of them, plus the five in the widget's detection scan.
- **People and tags:** the customer, three domain tags, and the wires to three storefronts.
- **The usual way:** the records card, the jagged journey line, seven station drawings (thought bubble, tabs, login card, menu maze, copy panels, clock, broken site), the X, the "gave up" scribble and the support-ticket envelope.
- **The turn:** the same line resampled into 240 points that straighten one after another, left to right.
- **With CustomDomain™:** the widget in three states (connect, detect, sign in and allow), a lens, a cloud, the DNS zone with records, checks and a padlock, the live site with its badge, and the monitoring loop with a dot that keeps orbiting.
- **The ending:** the comparison panels, and the end card with the brand's own tree mark.

## Voice direction

- **Who:** a warm, unhurried, confident American English narrator. Plain words, never salesy.
- **Pace:** 0.85× of the voice's natural speed, so about 164 wpm within a line.
- **Breaths:** 0.3 to 0.45 s between lines inside a beat, and 0.7 to 1.0 s at scene changes. Line starts are snapped up to the next quarter beat of the 92 bpm grid, so a pause can only lengthen.
- **Landing lines:** "And a job.", "That's it for your customer." and "Custom Domain. Your customers should never touch DNS." get a full pause before what follows.
- **Checked by machine:** every line was transcribed back with speech recognition (faster-whisper small.en) and matches the script word for word ("sign into" vs "sign in to" is a homophone).
