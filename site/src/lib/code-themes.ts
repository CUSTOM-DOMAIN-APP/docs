/**
 * The two syntax themes for every code block (MDX pages through source.config.ts, API reference samples through
 * lib/openapi-page.tsx). They follow the brand kit's light code card (BD-5): ink for code and medium weight for
 * keywords and keys, ink soft for strings and values, muted for comments and punctuation, and no other color,
 * because on this brand color only means a connection state. Every tone passes WCAG AA on the code grounds
 * (the faintest, muted: 5.48 on card #ffffff and 4.86 on paper 2 #f4f1ec in light, 6.93 on #1c1917 in dark).
 * Values are the kit hex in src/app/tokens-docs.css.
 */

type Setting = { foreground?: string; fontStyle?: string };
type CodeTheme = {
  name: string;
  displayName: string;
  type: "light" | "dark";
  colors: Record<string, string>;
  tokenColors: { scope?: string | string[]; settings: Setting }[];
};

type Tones = { ground: string; code: string; value: string; quiet: string };

// Which TextMate scopes take which tone. Order matters only for equal specificity: later rules win.
function codeTheme(name: string, displayName: string, type: CodeTheme["type"], t: Tones): CodeTheme {
  return {
    name,
    displayName,
    type,
    colors: { "editor.background": t.ground, "editor.foreground": t.code },
    tokenColors: [
      { settings: { foreground: t.code } },
      // Keywords, JSON keys and tags: ink at the medium weight (the kit's .t-k). Shiki writes "bold"; brand.css
      // renders it at Geist Mono's 500 with font synthesis off, so the browser never fakes a bold.
      {
        scope: [
          "keyword",
          "storage",
          "storage.type",
          "storage.modifier",
          "support.type.property-name",
          "meta.object-literal.key",
          "entity.name.tag",
        ],
        settings: { foreground: t.code, fontStyle: "bold" },
      },
      {
        scope: [
          "entity.name",
          "entity.name.function",
          "entity.other.attribute-name",
          "support.function",
          "variable",
          "variable.parameter",
          "variable.other",
        ],
        settings: { foreground: t.code, fontStyle: "" },
      },
      {
        scope: [
          "string",
          "string.quoted",
          "string.template",
          "punctuation.definition.string",
          "constant",
          "constant.numeric",
          "constant.language",
          "constant.other",
          "constant.other.option",
          "support.constant",
          "markup.inline.raw",
          "string.unquoted",
        ],
        settings: { foreground: t.value, fontStyle: "" },
      },
      {
        scope: [
          "punctuation",
          "meta.brace",
          "keyword.operator",
          "punctuation.separator",
          "punctuation.terminator",
          "punctuation.definition.tag",
          "punctuation.support.type.property-name",
        ],
        settings: { foreground: t.quiet, fontStyle: "" },
      },
      {
        scope: ["comment", "punctuation.definition.comment", "string.comment"],
        settings: { foreground: t.quiet, fontStyle: "italic" },
      },
      { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
    ],
  };
}

export const codeThemeLight = codeTheme("customdomain-light", "CustomDomain light", "light", {
  ground: "#ffffff",
  code: "#1c1917",
  value: "#44403c",
  quiet: "#6f6862",
});

export const codeThemeDark = codeTheme("customdomain-dark", "CustomDomain dark", "dark", {
  ground: "#1c1917",
  code: "#fafaf9",
  value: "#d6d3d1",
  quiet: "#a8a29e",
});

/** The shape both highlighters take: one theme for light, one for .dark (Fumadocs switches with CSS variables). */
export const codeThemes = { light: codeThemeLight, dark: codeThemeDark };
