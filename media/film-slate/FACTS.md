# Facts the slate may use (all from the docs repo; paths relative to it)

## Under the Button (what sits under "Connect domain")
- **Detection.** "we look up its nameservers to see who hosts its DNS, then offer the easiest way in that works at that provider" (content/dns/providers.mdx:6-7). The order is OAuth, Domain Connect, access role, API key, then by hand ("This works at every provider").
- **Census, 2026-10-21.** 189 catalogued: 73 automatic (6 OAuth, 1 Domain Connect, 66 scoped API key) and 116 guided by hand (README.md:42-47, AGENTS.md:7). Every one of the 100 largest registrars is included (providers.mdx:22-25).
- **Step-by-step instructions.** The widget shows provider-specific steps for 135 providers and platforms (providers.mdx:264-266).
- **Rails.** OAuth writes records over a signed, single-use state and discards the token unless the grant is kept. Domain Connect applies a signed template. A scoped API key writes once and is discarded. There is no ownership TXT: control is proven by the rail itself (verify-and-go-live.mdx, AGENTS.md:9).
- **Root domains.** "DNS forbids a CNAME at the root". The root becomes a flattened CNAME, ALIAS or ANAME, or plain A records, depending on the provider (root-domains.mdx:9-25).
- **Value checks.** "a CNAME must resolve to the expected target; an A/AAAA must contain the exact address" (connections.mdx:60-64). Checks run every 5 s for the first 5 minutes, every 30 s until 15 minutes, every 2 minutes until an hour, then every 15 minutes (verify-and-go-live.mdx:208-215). A `propagating` connection that has not resolved within 24 h becomes `failed` with `propagation_timeout`. "failed is not terminal."
- **Certificates.** Let's Encrypt, issued on the first HTTPS visit. Renewal starts about 30 days before expiry and needs no DNS access. A failed renewal is retried while the current certificate keeps serving (certificates.mdx:6-11).
- **Edge.** "on-demand TLS termination + reverse proxy" (architecture.mdx:19-20). "the edge will never obtain a certificate for an unauthorized host" (ownership-and-setup-types.mdx:153-160). Before go-live, visitors see a clear "not active yet" page, never a raw error.
- **Monitoring.** "Every live domain is checked once an hour" (monitoring.mdx:8). Drift is confirmed first at the zone's own nameservers. AVOID claiming alerts or auto-repair on hosted: alerts are not delivered on the hosted service yet.
- **Also:** offboarding ("every edge forgets it within a minute"), webhooks, email DNS (SPF merge "never loosens the policy").

## Three Calls (the integration)
- **Create.** `POST https://api.customdomain.ai/v1/connections`, body `{"domain":"app.customer.com"}`. "The only required field is the domain." The response is `201` with `{ id:"con_…", domain, provider_id, setup_type, status:"pending", records:[{type:"CNAME", host, value:"edge.customdomain.ai", ttl:3600}] }`.
- **Start sign-in.** `POST /v1/connections/<ID>/oauth:start` with `{"return_origin": "..."}` returns `{ "authorize_url", "provider", "flow":"oauth2", ... }`.
- **Read.** `GET /v1/connections/{id}`. Webhooks come first; polling is the fallback. Statuses: `pending`, `propagating`, `live`, `failed` (do not invent others).
- **Webhook.** `connection.live` fires exactly once. Payload: `{ id:"evt_…", type:"connection.live", domain, provider, setup_type, propagation_status:"success", data:{records_propagated:[…]}, created_at }`. Signed with `X-JE-Signature: sha256=…`.
- **Widget.** `npm install customdomain-js`, then `customdomain.open({ applicationId, token, domain, onSuccess, ... })`. The token is minted server-side: `POST https://app.customdomain.ai/api/widget-token` with a Bearer API key returns `{ token, expires_in: 900 }`. It runs in a sandboxed iframe.
- "Endpoint shapes are illustrative" (AGENTS.md:32): keep on-screen code to these documented shapes.

## 2:13 AM (support)
- "the cost is not the DNS write, it is the support queue behind it" (guides/choosing-a-custom-domain-solution.mdx:33-38). The docs publish NO ticket statistics, so the film uses none.
- "Generic instructions produce a support ticket per customer; instructions that name the actual provider do not." (guides/connect-a-custom-domain.mdx:136-141)
- **Real failure modes:**
  - the full hostname typed in the Name field
  - Cloudflare's orange cloud
  - a leftover A record
  - records added at the wrong place
  - (troubleshooting.mdx:32-62)
- **Every connection carries its own diagnosis:** `error_code` and `error_message`. `GET /v1/connections/{id}/diagnose` names what answers instead, for example "Still points to Squarespace" (troubleshooting.mdx:6-30).
- "A connection only reaches failed when records we wrote ourselves never propagated (24h)... Never because you were slow." A pending connection "goes live the moment the records appear".
