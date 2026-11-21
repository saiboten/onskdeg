import firebase from "../components/firebase/firebase";
import { extractUrl, getOgData, OgResponseData } from "../util/getOgData";
import { generateWishFromLink } from "./ai";

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
 * Runs in the background after a link wish is saved: asks Gemini for the
 * details the meta tags didn't give us (often price, sometimes everything)
 * and fills only fields that are still empty, so it never overwrites what
 * the user edited in the meantime. Resolves to true if the wish changed.
 */
export async function enrichWishFromLink(
  wishId: string,
  link: string,
  og: OgResponseData,
  input: string,
): Promise<boolean> {
  try {
    const ai = await generateWishFromLink(link, og);
    const ref = firebase.firestore().collection("wish").doc(wishId);
    const current = (await ref.get()).data();
    if (!current) return false;

    const update: Record<string, unknown> = {};
    const nameIsPlaceholder =
      !current.name || current.name === input || current.name === link;
    if (ai.title && nameIsPlaceholder) update.name = ai.title;
    if (ai.description && !current.description)
      update.description = ai.description;
    if (ai.image && !current.image) update.image = ai.image;
    if (ai.price && !current.price) update.price = ai.price;

    if (Object.keys(update).length === 0) return false;
    await ref.update(update);
    return true;
  } catch (e) {
    console.warn("AI lookup for link failed", link, e);
    return false;
  }
}
