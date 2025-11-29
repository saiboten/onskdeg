import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

/**
 * Get or initialize the OpenAI client
 * Make sure to set VITE_OPENAI_API_KEY in your .env.local file
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        "OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env.local file"
      );
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from a backend
    });
  }

  return openaiClient;
}

/**
 * Example function to generate text completion
 */
export async function generateCompletion(
  prompt: string,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: options?.model || "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: options?.maxTokens || 500,
    temperature: options?.temperature || 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

/**
 * Example function to analyze an image
 */
export async function analyzeImage(
  imageUrl: string,
  prompt: string = "What's in this image?"
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content || "";
}

/**
 * Example function to generate image descriptions for wishes
 */
export async function generateWishDescription(imageUrl: string): Promise<{
  title: string;
  description: string;
}> {
  const client = getOpenAIClient();

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
  const title = lines.find((l) => l.startsWith("Title:"))?.replace("Title:", "").trim() || "Ønske";
  const description = lines.find((l) => l.startsWith("Description:"))?.replace("Description:", "").trim() || "";

  return { title, description };
}
