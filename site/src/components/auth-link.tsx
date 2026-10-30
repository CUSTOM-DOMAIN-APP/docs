/**
 * The first link in the docs sidebar and the phone drawer: "Sign in" for everyone, "Console" for a browser the
 * console has marked as signed in. Both anchors are in the prerendered HTML and src/lib/auth-hint.ts picks one
 * before first paint. The classes and the external-link icon copy Fumadocs' own sidebar link (SidebarItem at
 * depth 0), so either label looks like its neighbours. data-cd-auth-label tells analytics which one was clicked.
 */

import { CONSOLE_URL, SIGN_IN_URL } from "@/lib/auth-hint";

const ITEM =
  "relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none";

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function AuthLink() {
  return (
    <>
      <a
        href={SIGN_IN_URL}
        target="_blank"
        rel="noreferrer noopener"
        className={`${ITEM} cd-auth-out`}
        data-cd-auth-label="sign_in"
      >
        <ExternalIcon />
        Sign in
      </a>
      <a
        href={CONSOLE_URL}
        target="_blank"
        rel="noreferrer noopener"
        className={`${ITEM} cd-auth-in`}
        data-cd-auth-label="console"
      >
        <ExternalIcon />
        Console
      </a>
    </>
  );
}
