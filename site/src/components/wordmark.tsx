/**
 * The docs lockup in the sidebar and the phone header, the same lockup as the marketing header (the design kit's
 * cdk-brand: the oak at 28 px in the text color, "CustomDomain™" in Inter 600 at 16 px, ™ in its own aria-hidden
 * superscript, translate="no"), then a 1 px divider and "Docs" in Inter 500 at 14 px, ink soft. The accessible name
 * stays "CustomDomain docs". The oak is the flat mark from the kit's icon sprite, drawn in currentColor so it is ink
 * on paper and paper on ink; never recolor or redraw it. Styles are in src/app/brand.css (.cd-wordmark).
 */

function Oak() {
  return (
    <svg className="cd-wordmark__oak" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" focusable="false">
      <rect x="238" y="250" width="36" height="150" rx="18" />
      <path d="M256 330 L196 372 M256 330 L316 372" fill="none" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
      <circle cx="256" cy="176" r="86" />
      <circle cx="176" cy="220" r="62" />
      <circle cx="336" cy="220" r="62" />
      <circle cx="212" cy="140" r="54" />
      <circle cx="300" cy="140" r="54" />
      <circle cx="256" cy="244" r="58" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="cd-wordmark" translate="no">
      <Oak />
      <span className="cd-wordmark__name">
        CustomDomain<sup aria-hidden="true">™</sup>
      </span>
      <span className="cd-wordmark__rule" aria-hidden="true" />
      {/* The leading space keeps the accessible name "CustomDomain docs"; the rule and its margins do the spacing. */}
      <span className="cd-wordmark__docs">{" "}Docs</span>
    </span>
  );
}
