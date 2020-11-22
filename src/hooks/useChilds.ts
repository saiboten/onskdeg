import { useEffect, useState } from "react";
import firebase from "../components/firebase/firebase";
import { Child, Wish } from "../types/types";
import { useUser } from "./useUser";

export function useChilds(uid: string): Child[] | undefined {
  const [childs, setChilds] = useState<Child[]>([]);
  const { user } = useUser(uid);

  useEffect(() => {
    const childrenList = user?.childs ?? [];

    const getChildData = async (childId: string): Promise<Child> => {
      const child = await firebase
        .firestore()
        .collection("user")
        .doc(childId)
        .get();
      return {
        uid: "",
        name: "Ukjent",
        parent: [],
        groups: [],
        isChild: true,
        ...child.data(),
      };
    };

    const getData = () => {
      return Promise.all(childrenList.map((child) => getChildData(child)));
    };

    getData().then((data) => {
      setChilds(data);
    });
  }, [user?.childs?.length]);

  return childs;
}
