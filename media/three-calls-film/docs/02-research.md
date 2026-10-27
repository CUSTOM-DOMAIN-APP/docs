# Phase 2: Research, references and tools

## How code demos work on film
- **Code on screen must be short and real.** Stripe's developer video team built 63 videos around short, real API calls in many languages ([Stripe on scaling developer video](https://dev.to/stripe/scalable-developer-video-production-43mg)). Resend's launch posts pair the written walkthrough with a short, muted, looping clip of the actual install flow ([Resend changelog](https://resend.com/changelog/vercel-marketplace-integration.md)).
- **Rules taken from this:**
  - Every line on screen is code someone could paste.
  - Nothing is mocked beyond invented IDs.
  - The narration reads the intent, not the syntax.
- **Keynote grammar:** keynote demos zoom onto the single line that matters and pull back out. Typing is faster than real time (about 30 characters a second) so the viewer reads the result, not the keystrokes.
- **Motion graphics in a Geist-like system:** Vercel's design language favours monochrome type, hairlines and one accent. That matches the CustomDomain™ brand rule of ink and paper, with green only for done.

## Pace and length
- **About 45 to 55 seconds.** A developer will watch a short demo to the end if every beat moves the code forward.
- **Narration at a brisk 165 to 175 words a minute,** with a beat after each "one, two, three".

## Tools
| Need | Tool |
|---|---|
| Deterministic animation, renders, critique kit | Motion Reel Kit engine |
| Editor, terminal, preview | DOM in the brand faces; code tokens typed per character, deterministic |
| Syntax colour | A monochrome theme: keywords in ink 600, strings stone 600, comments stone 400 italic, punctuation stone 500 |
| Voice | Kokoro `am_puck` (a brisk, friendly American male), run locally |
| Music | Synthesized minimal house at 118 bpm: soft kick, off-beat hats, a warm bass line, felt stabs |

## Voice spec
- **Voice:** `am_puck`, chosen over four other voices on read-back clarity and energy.
- **Speed:** 1.0×, about 170 words a minute inside a line.
- **Cadence:** "One." "Two." "Three." each get a short beat of silence after them. The last line is relaxed, with a smile.
- **Pronunciation:** "Custom Domain" is two words. "API" is read as letters. Package names are not read aloud, only shown.
