# Phase 1: Concept, "Three Calls"

## The idea in one sentence
The whole CustomDomain™ integration, typed live in about fifty seconds, in three calls:
1. Mint a widget token on the server.
2. Open the widget in the app.
3. Hear back on a webhook the moment the domain is live.

## Who it is for, and what they should do
- **Viewer:** the engineer who will integrate it, and the engineering lead who estimates the work.
- **What they should leave knowing:**
  - The integration is three small pieces of code.
  - None of it is DNS code or certificate code.
  - The end user's part (sign in, approve) happens inside the widget.
- **What they should do:** `npm install customdomain-js` and open the docs.

## How it differs from the films before it
- **The earlier films** are about people (the end user, the human middleware) or about scale ("Under the Button"). This one is about code, shown as code.
- **Its grammar is a screencast:**
  - an editor, a terminal and a live preview
  - code that types itself as the narrator says it
  - keynote-style zooms onto the one line that matters
- **Its sound is a minimal house track** with keyboard texture, not a score.

## The look
- **An editor in the brand's monochrome:**
  - paper background, ink code
  - stone greys for strings, comments and line numbers
  - Geist Mono throughout the code
- **No rainbow syntax theme:** the brand is ink and paper, so the highlighting is done by weight and grey.
- **Green appears once:** on the status pill and in the preview when the domain goes live.
- **Chapter titles** ("1 · Mint a widget token") in Instrument Serif. The code reads as the subtitle.

## Accuracy guardrails (cd-film-slate/FACTS.md; content/authentication/widget-tokens.mdx; content/widget-sdk/installation-and-embed.mdx; content/webhooks/overview.mdx)
- **Token:** `POST https://app.customdomain.ai/api/widget-token` with `Authorization: Bearer <API key>` and an optional `domain`. It returns `{ application_id, token, expires_in: 900, token_type: "Bearer" }`.
- **Widget:** `import { customdomain } from "customdomain-js"; customdomain.open({ applicationId, token, domain, onSuccess })`.
- **Webhook:** `connection.live`, with `type`, `domain`, `provider` and `propagation_status: "success"` in the payload. It is signed with `X-JE-Signature` and fires exactly once.
- **Statuses** shown are only `pending`, `propagating` and `live`.
- **Invented values only, clearly fake:** the token, the IDs and the domain (acme.shop) are made up. The API key comes from an environment variable and is never shown.
