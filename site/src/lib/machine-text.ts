/**
 * Text for machine fields. The page title, meta description, Open Graph and Twitter tags, image alt text and the
 * schema.org names carry the product name as "CustomDomain" without the ™ (decision D-2): search snippets and AI
 * answers render the mark as noise, and it costs title characters. Visible headings and body copy keep the ™.
 */

/** The text with every ™ removed, for a machine field. */
export function machineText(text: string): string;
export function machineText(text: string | undefined): string | undefined;
export function machineText(text: string | undefined): string | undefined {
  return text?.replace(/™/g, "");
}
