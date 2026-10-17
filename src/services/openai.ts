import firebase from "../components/firebase/firebase";

/**
 * Generate a title and description for a wish image.
 * Runs in the `generateWishDescription` Cloud Function (functions/src/index.ts)
 * so the OpenAI API key never reaches the browser.
 */
export async function generateWishDescription(imageUrl: string): Promise<{
  title: string;
  description: string;
}> {
  const callable = firebase
    .functions()
    .httpsCallable("generateWishDescription");
  const result = await callable({ imageUrl });
  return result.data;
}
