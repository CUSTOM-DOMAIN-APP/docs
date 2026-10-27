# Phase 3: Script, "2:13 AM"

69.7 seconds at 80 bpm (one beat is 0.75 s). The voice is Sam's inner monologue, read by Kokoro `af_nicole` at 1.18×. Every picture beat is keyed to a word in the voice (from the word timings in `audio/vo_words.json`), so the cut and the voice cannot drift apart.

## Voiceover
| Line | Starts | Says |
|---|---|---|
| a1 | 1.5 s | Two thirteen in the morning. Another domain ticket. |
| a2 | 6.4 s | Maya added her records three days ago. She launches tomorrow. |
| b1 | 11.6 s | She typed her whole domain into the name field. Of course she did. Nobody ever tells you how this works. |
| b2 | 20.6 s | Every week, the same questions. Where are my DNS settings? Which records? Why does it still say pending? |
| b3 | 29.8 s | None of it is about our product. All of it lands on us. |
| c1 | 35.4 s | So we shipped Custom Domain. |
| d1 | 38.4 s | Now, customers like Maya sign in to their DNS provider, right inside our app, and approve. |
| d2 | 46.3 s | The records are written for them, checked, and kept that way. |
| d3 | 51.0 s | Her next domain went live while she was still on the page. |
| e1 | 55.9 s | And at two thirteen in the morning, I'm asleep. |
| f1 | 60.4 s | Custom Domain. You never touch their DNS. Neither does your support team. |

"Custom Domain" is spelled as two words in the voice script so the voice says it naturally. On screen it is always CustomDomain™.

## Picture
Both formats tell the same story on the same beats. 16:9 is a laptop desktop seen as a screen recording that zooms to where things happen. 9:16 is a phone, re-blocked screen by screen (lock screen, ticket, inbox, chat, connection page), with the on-screen keyboard up whenever Sam types.

### Night (dark appearance, ink and stone)
| Time | 16:9 | 9:16 |
|---|---|---|
| 0.0 s | Tight on the menu bar clock: "Tue 2:13 AM", a third of the frame wide. | Lock screen: "2:13", Tuesday, with two older ticket notifications. |
| 0.45 s | A notification: New ticket #4471, Maya R., "My domain isn't working". The camera pulls back to it. | The same notification on the lock screen. |
| 4.2 s, "Another" | The cursor clicks it. The helpdesk opens Maya's ticket. | Tapped: the ticket screen slides in. |
| 7.6 s and 9.8 s | "3 days ago" and "We launch tomorrow morning." are highlighted as the voice says them. | Same. |
| 11.5 s | A DNS check of her subdomain, shop.acme.com, appears under her message: a CNAME to the platform's own target, domains.yourplatform.com. | Same. |
| 13.5 s, "name" | The name `shop.acme.com.acme.com` inverts: the brand's error style. A label: "Full domain typed in the Name field". Expected name: `shop`. | Same. |
| 15.2 to 20.0 s | Sam types the reply: in the Name field, enter just shop; the provider adds acme.com by itself. | The keyboard rises, the ticket scrolls up above it, and each typed key lights. |
| 20.3 s | Send. "Reply sent · 2:19 AM". | Same; the keyboard drops. |
| 21.1 s | The camera moves to the queue. | The inbox. |
| 23.4, 25.7, 27.5 s | "Where are my DNS settings?", "Which records do I add?", "Why does it still say pending?" arrive as new tickets, one per question in the voice. | The same, each with a banner. |
| 29.7 s | Wide: four more tickets land. "11 open". | The inbox fills to the bottom. |
| 32.0 to 34.0 s | The helpdesk minimises and the team chat, #support, takes the screen. Under an older message ("Same thing again. The Name field."), Sam types: "Eleven domain tickets tonight. Not one of them is about our product." | Same, typed in the composer above the keyboard. |
| 35.6 s, "shipped" | Under a "Friday" divider, Priya, engineering, Fri 4:40 PM: "Shipped: custom domains now go through CustomDomain™." | Same. |

### Day (light appearance, paper)
| Time | 16:9 | 9:16 |
|---|---|---|
| 37.5 s | A cut on the beat: the same screen, now in light mode (the helpdesk is back, beside the chat). The clock reads Tue 10:24 AM. A "Four weeks later" card lands on it, then leaves upward as the connection page springs in. | Same, on the phone. |
| 39.6 s, "Maya" | The connection page for maya.studio: activity on the left, the connection on the right. Status `pending`. | One screen: the connection on top, the activity below. |
| 39.6 to 45.1 s | Activity, word by word: Maya opened Connect domain; Provider found: Cloudflare; Maya signed in to Cloudflare; "Waiting for Maya to approve…" under "right inside our app"; Maya approved the DNS change, on "approve". | Same. |
| 46.9 s, "written" | Records written. The status turns `propagating`, and the two CNAME rows (`@` and `www` to edge.customdomain.ai) appear. The camera moves to the connection. | Same. |
| 48.0 s, "checked" | Records checked: both resolve. A check lands on each row. | Same. |
| 49.2 s, "kept" | "Checked every hour from now on". | Same. |
| 51.8 s, "live" | `live`, in green: the film's only green. "maya.studio is live" in the activity. | Same. |
| 52.4 s | A notification from Maya: "Signed in, clicked Allow, and it's live. That was it?" | A banner at the top. |

### The next night
| Time | Both formats |
|---|---|
| 55.5 s | Maya's note slides away, then a cut on the beat to a dark lock screen: "2:13", Wednesday. It pushes in slowly to the end card. |
| 56.2 s, "thirteen" | A Sleep focus pill. |
| 58.3 s, "asleep" | "No new notifications". |

### End card (paper)
| Time | Both formats |
|---|---|
| 60.1 s | The tree mark and the CustomDomain™ wordmark, with "Custom Domain" in the voice. |
| 62.2 s | "You never touch their DNS." |
| 64.6 s | *"Neither does your support team."* |
| 66.3 s | customdomain.ai types itself. The card pushes in slowly to the last frame. |

## Sound
- **Music** (`scripts/music_night.py`):
  - **Night:** a quiet clock tick on every beat and a cold pad in D minor. A low double pulse plays while the queue floods.
  - **The turn:** a beat of near silence before "So we shipped". One plucked note sounds under "shipped".
  - **Day:** a warm plucked figure in D major.
  - **The next night:** the tick returns, slower, under a resolved D major chord.
  - **End card:** the chord rings.
- **Sound effects** (`scripts/sfx_plan.py`, 90 cues): all from the device. Notification pings, the click on the notification, key ticks while Sam types, a soft send, pops for windows, ticks as the activity fills, a chime on live, and a thump with the end card.
- **Mixes:** with voiceover (music −13 dB, ducked under the voice) and without (music −3 dB). Both at −14 LUFS.

## Accuracy
- **Maya's mistake** is the documented one: the full hostname typed in the Name field. Her night domain is a subdomain (shop.acme.com), so the fix is a name of `shop`, never a CNAME at a root. The night record points at the platform's own target, because CustomDomain™ has not shipped yet.
- **The records** for maya.studio are CNAME `@` and CNAME `www` to edge.customdomain.ai, at Cloudflare, which flattens a CNAME at the root (root-domains.mdx). There is no verification TXT record.
- **The statuses** are the real ones, in order: pending, propagating, live.
- **"Kept that way"** is shown as the hourly check. No alerts or automatic repair are claimed.
- **The end line** follows the docs' own wording, "You never touch their DNS" (widget.mdx), not "your customers never touch DNS": 116 of the 189 providers are guided by hand.
- **Fiction:** the platform, Sam, Priya, Maya and the ticket counts are fictional. The film shows no statistics about CustomDomain™.
- **Interfaces:** the helpdesk, chat and phone are generic. None imitates a real product.
