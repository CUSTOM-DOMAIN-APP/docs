/**
 * The account and site links at the foot of the docs sidebar and the phone drawer, moved there from the top of the
 * page list so the sidebar opens on the lockup, search and the section switch. Signed out: "Sign in" (secondary) and
 * "Get an API key" (primary, the console's sign-up page, which creates a workspace and its default key). Signed in
 * (the console's cd_signed_in hint, src/lib/auth-hint.ts): "API keys" (secondary, the console's keys page) and
 * "Console" (primary). Both pairs are prerendered; the cd-auth-in and cd-auth-out rules in globals.css show one
 * before first paint. Then text links to customdomain.ai and the status page. Styles: src/app/brand.css (.cd-account).
 */

import { CONSOLE_URL, SIGN_IN_URL } from "@/lib/auth-hint";

const SIGN_UP_URL = "https://app.customdomain.ai/signup";
const KEYS_URL = "https://app.customdomain.ai/app/keys";

export function SidebarAccount() {
  return (
    <div className="cd-account">
      <div className="cd-account__buttons cd-auth-out">
        <a href={SIGN_IN_URL} className="cd-btn cd-btn--secondary" data-cd-auth-label="sign_in">
          Sign in
        </a>
        <a href={SIGN_UP_URL} className="cd-btn cd-btn--primary" data-cd-auth-label="sign_up">
          Get an API key
        </a>
      </div>
      <div className="cd-account__buttons cd-auth-in">
        <a href={KEYS_URL} className="cd-btn cd-btn--secondary" data-cd-auth-label="api_keys">
          API keys
        </a>
        <a href={CONSOLE_URL} className="cd-btn cd-btn--primary" data-cd-auth-label="console">
          Console
        </a>
      </div>
      <p className="cd-account__links">
        <a href="https://customdomain.ai">customdomain.ai</a>
        <a href="https://status.customdomain.ai">Status</a>
      </p>
    </div>
  );
}
