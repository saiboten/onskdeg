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
    })
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
