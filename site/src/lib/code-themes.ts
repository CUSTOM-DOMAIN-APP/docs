/**
 * The two syntax themes for every code block (MDX pages through source.config.ts, API reference samples through
 * lib/openapi-page.tsx): site v2's Shiki themes, copied into src/shared/shiki from the site repo's site/shared and
 * generated there from tokens.css, so code on the docs looks the same as on customdomain.ai. Never edit the JSON
 * here; re-sync it (scripts/check-shared.mjs).
 */

import type { ThemeRegistrationRaw } from "shiki";
import light from "../shared/shiki/customdomain-light.json";
import dark from "../shared/shiki/customdomain-dark.json";

export const codeThemeLight = light as unknown as ThemeRegistrationRaw;
export const codeThemeDark = dark as unknown as ThemeRegistrationRaw;

/** The shape both highlighters take: one theme for light, one for .dark (Fumadocs switches with CSS variables). */
export const codeThemes = { light: codeThemeLight, dark: codeThemeDark };
