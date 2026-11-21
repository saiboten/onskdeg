export type OgResponseData = {
  image?: string;
  url?: string;
  description?: string;
  title?: string;
};

const OG_ENDPOINT = "https://us-central1-onskdeg.cloudfunctions.net/addMessage";
const OG_TIMEOUT_MS = 8000;

/** Returns the first http(s) URL in the text, if any. */
export function extractUrl(text: string): string | undefined {
  const match = text.match(/https?:\/\/[^\s<>"']+/i);
  return match?.[0];
}

/**
 * Reads Open Graph / meta tags for a URL through the link-preview Cloud
 * Function. Many shops block or time out the scraper, so this never throws:
 * on any failure it returns an empty object and the caller falls back to AI.
 */
export async function getOgData(url: string): Promise<OgResponseData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OG_TIMEOUT_MS);
  try {
    const res = await fetch(`${OG_ENDPOINT}?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    });
    if (!res.ok) return {};
    const data = await res.json();
    if (!data || data.error) return {};
    return {
      title: data.title || undefined,
      description: data.description || undefined,
      image: data.image || undefined,
      url: data.url || undefined,
    };
  } catch (e) {
    console.warn("Could not read link metadata", url, e);
    return {};
  } finally {
    clearTimeout(timer);
  }
}
