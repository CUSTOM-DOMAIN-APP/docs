<!-- What the font files in this folder are, where they come from and how to rebuild them. -->

# Fonts

`Geist-Variable-docs.woff2` and `GeistMono-Variable-docs.woff2` are Geist and Geist Mono from the `geist` package
(SIL Open Font License 1.1, `LICENSE-Geist.txt`), subset with fonttools to the characters the docs use. They are
loaded in `src/app/layout.tsx`. If a page needs a character outside the list, add it and rebuild:

```bash
pip install fonttools brotli
U="U+0000-00FF,U+0100-017F,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+0400-045F,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+25B6,U+25C0,U+2713,U+2717,U+FEFF,U+FFFD"
pyftsubset node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2 --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file=src/fonts/Geist-Variable-docs.woff2
pyftsubset node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2 --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file=src/fonts/GeistMono-Variable-docs.woff2
```
