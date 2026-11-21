/** "www.komplett.no/product/123?x=y" → "komplett.no". Falls back to the input. */
export function displayUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const isUrl = (text: string | undefined) =>
  !!text && /^https?:\/\/\S+$/i.test(text.trim());

/** Shows a wish name, replacing a bare URL (not yet looked up) with its host. */
export const displayWishName = (name: string | undefined) =>
  isUrl(name) ? displayUrl(name!) : (name ?? "");

const priceFormat = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

export const formatPrice = (price: number | string | undefined) => {
  const n = Number(price);
  return n > 0 ? priceFormat.format(n) : "";
};

/** "Tobias Rusås Olsen" → "TR" */
export const initials = (name: string | undefined) =>
  (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
