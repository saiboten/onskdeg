import firebase from "../components/firebase/firebase";
import { extractUrl, getOgData, OgResponseData } from "../util/getOgData";
import { generateWishFromLink, LinkDetails } from "./ai";

export type EnrichResult = "changed" | "unchanged" | "failed";

export type LinkPrefill = {
  /** The URL found in the input, if any. */
  link?: string;
  og: OgResponseData;
};

/** Finds a link in the input and reads its meta tags (never throws). */
export async function prefillFromInput(input: string): Promise<LinkPrefill> {
  const link = extractUrl(input);
  if (!link) return { og: {} };
  return { link, og: await getOgData(link) };
}

/**
 * Fills in a link wish: meta tags first (title, description, image), then
 * Gemini for whatever is still missing (often price, sometimes everything).
 * Only fields that are still empty are written, so it never overwrites what
 * the user edited. Meta-tag values are saved even if the AI call fails.
 */
export async function enrichWishFromLink(
  wishId: string,
  link: string,
  og: OgResponseData,
  input: string,
): Promise<EnrichResult> {
  let ai: LinkDetails = {};
  let aiFailed = false;
  try {
    ai = await generateWishFromLink(link, og);
  } catch (e) {
    console.warn("AI lookup for link failed", link, e);
    aiFailed = true;
  }

  try {
    const ref = firebase.firestore().collection("wish").doc(wishId);
    const current = (await ref.get()).data();
    if (!current) return aiFailed ? "failed" : "unchanged";

    const title = og.title || ai.title;
    const description = og.description || ai.description;
    const image = og.image || ai.image;

    const update: Record<string, unknown> = {};
    const nameIsPlaceholder =
      !current.name || current.name === input || current.name === link;
    if (title && nameIsPlaceholder) update.name = title;
    if (description && !current.description) update.description = description;
    if (image && !current.image) update.image = image;
    if (ai.price && !current.price) update.price = ai.price;

    if (Object.keys(update).length === 0) {
      return aiFailed ? "failed" : "unchanged";
    }
    await ref.update(update);
    return "changed";
  } catch (e) {
    console.warn("Saving link details failed", link, e);
    return "failed";
  }
}
