export type OgResponseData = {
  image?: string;
  url?: string;
  description?: string;
  title?: string;
};

export async function getOgData(url: string): Promise<OgResponseData> {
  return await fetch(
    `https://us-central1-onskdeg.cloudfunctions.net/addMessage?url=${url}`
  ).then((data) => {
    return data.json();
  });
}
