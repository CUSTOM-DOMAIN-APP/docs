/**
 * The site footer under every page: the three approved links (Start free trial, Sign in, Read docs) and the
 * copyright line. Static, so it renders on the server with no client code. Styles: src/app/brand.css (.cd-footer).
 */

const LINKS = [
  { label: "Start free trial", href: "https://app.customdomain.ai/signup" },
  { label: "Sign in", href: "https://app.customdomain.ai" },
  { label: "Read docs", href: "https://docs.customdomain.ai/docs" },
];

export function SiteFooter() {
  return (
    <footer className="cd-footer">
      <div className="cd-footer__inner">
        <p className="cd-footer__copy">Copyright © 2026 CustomDomain™. All rights reserved.</p>
        <nav aria-label="Footer">
          <ul className="cd-footer__links">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
