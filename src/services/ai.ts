import { getApp } from "firebase/app";
import {
  AgentPlatformBackend,
  getAI,
  getTemplateGenerativeModel,
} from "firebase/ai";
import firebase from "../components/firebase/firebase";

/**
 * Gemini via Firebase AI Logic. The compat SDK registers its app with the
 * modular SDK, so getApp() returns the app from firebase.ts, and requests
 * carry the signed-in user's token (the project enforces authenticated users).
 *
 * The prompt, model and output schema live in the server prompt template
 * below (Firebase console > AI Logic > Prompt templates); the project runs in
 * template-only mode, so free-form prompts are rejected.
 */
const TEMPLATE_ID = "blank-template";

// getAI() captures the auth and App Check instances when it is first called,
// so start auth before creating the model. AI Logic enforces App Check replay
// protection, which only accepts limited-use tokens.
let model: ReturnType<typeof getTemplateGenerativeModel> | undefined;
const getModel = () => {
  firebase.auth();
  model ??= getTemplateGenerativeModel(
    getAI(getApp(), {
      backend: new AgentPlatformBackend(),
      useLimitedUseAppCheckTokens: true,
    }),
  );
  return model;
};

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/** Generate a title and description for a wish image. */
export async function generateWishDescription(image: Blob): Promise<{
  title: string;
  description: string;
}> {
  const result = await getModel().generateContent({
    templateId: TEMPLATE_ID,
    templateVariables: {
      mimeType: image.type || "image/jpeg",
      imageData: await toBase64(image),
    },
  });
  const { title, description } = JSON.parse(result.response.text());
  return { title: title?.trim() ?? "", description: description?.trim() ?? "" };
}

/**
 * Server prompt template that looks up a product from a link (URL context +
 * Google Search). See README for its definition.
 */
const LINK_TEMPLATE_ID = "wish-from-link";

export type LinkDetails = {
  title?: string;
  description?: string;
  price?: number;
  image?: string;
};

/** Pulls the first JSON object out of a model reply (tolerates ``` fences). */
const parseJsonObject = (text: string): Record<string, unknown> => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return {};
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return {};
  }
};

const str = (v: unknown) =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

const num = (v: unknown) => {
  const n =
    typeof v === "number"
      ? v
      : typeof v === "string"
        ? Number(v.replace(/[^\d.,]/g, "").replace(",", "."))
        : NaN;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
};

/**
 * Asks Gemini to read the page (or search for it) and fill in product
 * details. `known` is what we already have from meta tags, so the model can
 * focus on the gaps.
 */
export async function generateWishFromLink(
  url: string,
  known: LinkDetails = {},
): Promise<LinkDetails> {
  const result = await getModel().generateContent({
    templateId: LINK_TEMPLATE_ID,
    templateVariables: {
      url,
      knownTitle: known.title ?? "",
      knownDescription: known.description ?? "",
    },
  });
  const data = parseJsonObject(result.response.text());
  const image = str(data.image);
  return {
    title: str(data.title),
    description: str(data.description),
    price: num(data.price),
    image: image && /^https:\/\//i.test(image) ? image : undefined,
  };
}
