/**
 * The "Sign in" or "Console" choice in the docs chrome. While a console session lives, the console
 * (app.customdomain.ai) keeps a script-readable hint cookie, cd_signed_in=1, on .customdomain.ai. It holds no
 * identifier and is a hint, never a credential: /app checks the real session and sends anyone without one to
 * /login. AUTH_HINT_SCRIPT runs inline in <head> (src/app/layout.tsx) before the body is parsed and adds
 * cd-signed-in to <html> when the cookie is there. The two rules in src/app/globals.css then show one of the two
 * links that src/components/auth-link.tsx prerenders, so the choice is made before first paint: no flash, no
 * layout shift. Without JavaScript or the cookie, "Sign in" shows. customdomain.ai does the same from its head
 * code (block cd-console-swap). The snippet has no ampersand or less-than sign, so it needs no escaping.
 */

export const SIGN_IN_URL = "https://app.customdomain.ai/login";
export const CONSOLE_URL = "https://app.customdomain.ai/app";

export const AUTH_HINT_SCRIPT = String.raw`(function(){try{if(/(?:^|;\s*)cd_signed_in=1(?:;|$)/.test(document.cookie))document.documentElement.classList.add("cd-signed-in")}catch(e){}})()`;
