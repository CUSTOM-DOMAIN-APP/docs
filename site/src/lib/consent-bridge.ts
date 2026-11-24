/**
 * Where the docs load the cookie bar from (tracking plan step 4): the website's consent bridge, which the console
 * serves at https://app.customdomain.ai/consent-bridge.js (custom-domains apps/app/public/consent-bridge.js). It
 * draws the same bar under the same regional rule as customdomain.ai and the console (one choice for all three),
 * and sends the same first-party page view and engagement beacons to the console's collector.
 *
 * Off unless the build sets NEXT_PUBLIC_CONSENT_BRIDGE_SRC (the Docker build argument of the same name), so nothing
 * loads until consent version 4 and the visitor attribution release go live together; only an https address on
 * customdomain.ai is used. Pure.
 */

export function consentBridgeSrc(raw: string | undefined = process.env.NEXT_PUBLIC_CONSENT_BRIDGE_SRC): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:") return null;
    if (u.hostname !== "customdomain.ai" && !u.hostname.endsWith(".customdomain.ai")) return null;
    return u.toString();
  } catch {
    return null;
  }
}
