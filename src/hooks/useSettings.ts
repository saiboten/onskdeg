// wishRef =

import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Settings } from "../types/types";

const fetcher = async (
  collection: "settings",
  uid: string
): Promise<Settings> => {
  return await new Promise(async (resolve) => {
    if (uid === undefined || uid === "") {
      resolve({
        festivitasThemesEnabled: true,
        hideGifts: false,
        darkMode: false,
      });
      return;
    }

    const docRef = firebase.firestore().collection(collection).doc(uid);

    const docData = await docRef.get();

    if (docData.exists) {
      resolve({
        festivitasThemesEnabled: true,
        darkMode: true,
        hideGifts: false,
        ...docData.data(),
      });
    } else {
      const newSettings = {
        festivitasThemesEnabled: true,
        hideGifts: false,
        darkMode: true,
      };
      await docRef.set(newSettings);
      resolve(newSettings);
    }
  });
};

export function useSettings(uid: string, useSuspense: boolean) {
  const { data, error } = useSWR(["settings", uid], fetcher, {
    suspense: useSuspense,
  });

  console.log(data);

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
  };
}
