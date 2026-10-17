import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import OpenAI from "openai";

const openaiApiKey = defineSecret("OPENAI_API_KEY");

// Only analyze images uploaded to this project's storage bucket, so the
// function can't be used as a free OpenAI proxy for arbitrary URLs.
const ALLOWED_IMAGE_PREFIX =
  "https://firebasestorage.googleapis.com/v0/b/onskdeg.appspot.com/o/";

export const generateWishDescription = onCall(
  { secrets: [openaiApiKey], maxInstances: 5 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Du må være logget inn.");
    }

    const imageUrl = request.data?.imageUrl;
    if (
      typeof imageUrl !== "string" ||
      !imageUrl.startsWith(ALLOWED_IMAGE_PREFIX)
    ) {
      throw new HttpsError("invalid-argument", "Ugyldig bilde-URL.");
    }

    const client = new OpenAI({ apiKey: openaiApiKey.value() });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide a short title (max 50 characters) and a brief description (max 100 characters) for a gift wish. Respond in Norwegian. Format: Title: [title]\nDescription: [description]",
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content || "";
    const lines = content.split("\n");
    const title =
      lines.find((l) => l.startsWith("Title:"))?.replace("Title:", "").trim() ||
      "Ønske";
    const description =
      lines
        .find((l) => l.startsWith("Description:"))
        ?.replace("Description:", "")
        .trim() || "";

    return { title, description };
  }
);
