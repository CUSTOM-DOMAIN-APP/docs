<!-- What this folder holds: the three woff2 files src/lib/fonts.ts self-hosts, and their licenses. Why: the docs load no font from Google, and the SIL Open Font License travels with the files. -->

# Fonts

| File | Family | Weights | Used for | License |
|---|---|---|---|---|
| `inter-latin-var.woff2` | Inter (variable) | 400 to 600 | Body, navigation, headings below the title | `OFL-Inter.txt` |
| `geist-mono-latin-var.woff2` | Geist Mono (variable) | 400 to 500 | Code, hostnames, record values | `OFL-GeistMono.txt` |
| `instrument-serif-latin-400.woff2` | Instrument Serif | 400 | The page title only | `OFL-InstrumentSerif.txt` |

All three are the latin subset Google Fonts serves (`fonts.gstatic.com`, downloaded 2026-10-30), the same files the brand kit and customdomain.ai use. Characters outside the subset, such as arrows and box drawing, render from the system font in the fallback stack (`src/app/brand.css`).

Licensed under the SIL Open Font License 1.1: Inter by The Inter Project Authors (`rsms/inter`), Geist Mono by The Geist Project Authors (`vercel/geist-font`), Instrument Serif by The Instrument Serif Project Authors (`Instrument/instrument-serif`). Each license file is copied from that repository.
