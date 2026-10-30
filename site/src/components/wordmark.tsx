/**
 * The docs title in the sidebar and the phone header: the oak mark and "CustomDomain™ docs", per the brand kit
 * (D-10): the oak at 28 px in the text color, the name in Inter 600 with the ™ in its own aria-hidden superscript,
 * sentence case, translate="no" so a page translator leaves the name alone. The oak is the flat mark from the
 * kit's icon sprite, drawn in currentColor so it is ink on paper and paper on ink. Styles are in src/app/brand.css.
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
      {/* The leading space keeps the accessible name "CustomDomain docs"; the margin in brand.css does the visual spacing. */}
      <span className="cd-wordmark__docs">{" "}docs</span>
    </span>
  );
}
