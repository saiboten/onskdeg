import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { Settings } from "../types/types";

async function fetchSettings(uid: string): Promise<Settings> {
  if (uid === undefined || uid === "") {
    return {
      festivitasThemesEnabled: true,
      hideGifts: false,
      darkMode: false,
    };
  }

  const docRef = firebase.firestore().collection("settings").doc(uid);
  const docData = await docRef.get();

  if (docData.exists) {
    return {
      festivitasThemesEnabled: true,
      darkMode: true,
      hideGifts: false,
      ...docData.data(),
    };
  }

  const newSettings = {
    festivitasThemesEnabled: true,
    hideGifts: false,
    darkMode: true,
  };
  await docRef.set(newSettings);
  return newSettings;
}

export const settingsQuery = (uid: string) =>
  queryOptions({
    queryKey: ["settings", uid],
    queryFn: () => fetchSettings(uid),
  });

export function useSettings(uid: string) {
  const { data } = useSuspenseQuery(settingsQuery(uid));
  return { settings: data };
}
