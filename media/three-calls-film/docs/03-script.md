# Phase 3: Script, "Three Calls"

42.6 seconds at 118 bpm (one beat is 0.51 s). The voice is a developer advocate talking a peer through the integration, read by Kokoro `am_puck` at 0.95×. Every picture beat is keyed to a word in the voice (from `audio/vo_words.json`), and the typing is timed so each file finishes as its line ends.

## Voiceover
| Line | Starts | Says |
|---|---|---|
| a1 | 0.6 s | Here's the whole custom domain integration. Three calls. |
| b1 | 5.3 s | One. On your server, create a short-lived widget token, with your API key. |
| c1 | 11.3 s | Two. In your app, open the widget with that token. |
| c2 | 16.0 s | Your customer signs in to their DNS provider, and approves. That's their whole job. |
| d1 | 22.2 s | Three. We call your webhook the moment the domain is live. |
| d2 | 26.9 s | Records written, checked, and HTTPS taken care of. |
| e1 | 32.4 s | No DNS code. No certificate code. Just three calls. |
| f1 | 36.9 s | Custom Domain. You never touch their DNS, or their certificates. |

## Picture
- **16:9:** the editor is on the left, the app preview top right, and the terminal bottom right.
  - The camera zooms onto each file's key line, then onto the app for the customer's part, then onto the result.
  - A paper band at the top carries the chapter captions, so zoomed code passes cleanly beneath them.
- **9:16:** the editor sits at the top (y 440). One slot below it holds the app, and the terminal slides up over the app like a sheet when it prints. For the result, the editor shortens to the webhook's key lines, and the terminal and the app both move up beneath it.

| Time | What happens |
|---|---|
| 0.0 s | "The whole integration. *Three calls.*" The three file tabs appear on "three". |
| 1.0 to 9.7 s | **1 · Mint a widget token.** `server.ts` already has its two constants and the route's shell. The body types itself: read `domain`, `fetch` the widget-token endpoint with the API key as a Bearer token, check `r.ok`, return the JSON. The camera lands on the `fetch` line. |
| 9.5 s | The terminal prints `POST /token → widget-token` and the token response (`expires_in: 900`). |
| 11.3 to 16.0 s | **2 · Open the widget.** `connect.tsx` has its imports, the component and its button. The `run` handler types itself: get a token, then `customdomain.open({ token, domain, applicationId: t.application_id, onSuccess })`. The camera lands on `customdomain.open`. |
| 16.1 s | The cursor clicks Connect in the app. The widget opens: "Managed at Cloudflare", then "Sign in with Cloudflare". |
| 16.8 to 19.5 s | The provider's own page opens in a popup: "Allow CustomDomain™ to edit DNS for acme.shop?" On "approves", Allow is pressed. The widget reads "Approved. Connecting acme.shop…", and the app shows `acme.shop · pending`. |
| 21.1 to 27.2 s | **3 · Hear when it's live.** `webhooks.ts` has the route with `express.raw()`. The body types itself: read the `X-JE-Signature` header, `verify` the raw body (sha256), `JSON.parse` it, and on `connection.live` call `markLive`. |
| 26.9 s, "Records" | The pill turns `propagating`. The camera frames the result. |
| 28.9 s | The webhook lands. The terminal prints `POST /webhooks/customdomain 200`, then `type connection.live`, `domain acme.shop`, `provider cloudflare` and `propagation_status success`. |
| 29.7 s, "care" | The pill and the banner turn green on the same frame: `acme.shop · live`, "acme.shop is live". The `markLive` line lights green. |
| 31.9 s | The world slides away. The three files rise side by side, each labelled with its real line count. "No DNS code. *No certificate code.* Just three calls." |
| 36.5 s | End card: the tree mark and the CustomDomain™ wordmark, then "You never touch their DNS. *Or their certificates.*", then `$ npm install customdomain-js` and docs.customdomain.ai. It pushes in slowly until the last frame. |

## The code (every line is 49 characters or fewer, so 28 px code fits a phone)
- **`server.ts`:** `app.post("/token", auth, …)` is behind your own auth, and the API key stays on the server. It sends `JSON.stringify({ domain })` to `https://app.customdomain.ai/api/widget-token` with `Authorization: Bearer`, checks `r.ok`, and returns `{ token, expires_in }`.
- **`connect.tsx`:** imports `customdomain` from `customdomain-js` and `api` from the app's own fetch helper. It reads `application_id` from the token response, and has a real `<button onClick={run}>`.
- **`webhooks.ts`:** `express.raw()` keeps the raw body for the signature. It calls `verify(req.body, sig)` with `X-JE-Signature: sha256=…`, then `JSON.parse`, and calls `markLive(event.domain)` on `connection.live`.

The lines already in each file show when it opens. Only the body types, at 34, 37 and 43 characters a second.

## Sound
- **Music** (`scripts/music_house.py`): minimal house in A minor at 118 bpm. It opens with a pad and ticking hats. The groove starts on "One.", and its filter opens a little with each call. A short riser leads into "No DNS code", followed by a breakdown, and the chord rings under the end card.
- **Sound effects** (`scripts/sfx_plan.py`, 176 cues): key ticks while code types, clicks on each press, pops as panels and terminal lines appear, a tick on `propagating`, a pop as the webhook lands, a chime on live, a whoosh into the outro and a thump with the end card.
- **Mixes:** two, with voiceover and without. Both are at −14 LUFS.

## Accuracy
- **The integration** uses only the documented shapes: the widget-token endpoint, `customdomain.open({ applicationId, token, domain, onSuccess })`, the `connection.live` webhook and its payload, and the `X-JE-Signature` header.
- **The statuses** are the real ones, in order: pending, propagating, live.
- **The end user's consent** happens on the provider's own page, not in the widget.
- **The end line** follows the docs' own wording, "You never touch their DNS" (widget.mdx). It does not say "your customers never touch DNS": 116 of the 189 providers are guided by hand.
- **The provider page** is drawn generically. Only the Cloudflare mark identifies it.
