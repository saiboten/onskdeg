import { useEffect, useState } from "react";
import firebase from "../components/firebase/firebase";
import { Kohort } from "../types/types";
import { useUser } from "./useUser";

export function useKohorts(uid: string): Kohort[] | undefined {
  const [groups, setGroups] = useState<Kohort[]>([]);
  const { user } = useUser(uid);

  useEffect(() => {
    const groups = user?.groups ?? [];

    const getGroupData = async (groupId: string): Promise<Kohort> => {
      const group = await firebase
        .firestore()
        .collection("groups")
        .doc(groupId)
        .get();
      return {
        admin: "",
        groupName: "",
        id: "",
        invites: [],
        members: [],
        ...group.data(),
      };
    };

    const getData = () => {
      return Promise.all(groups.map((groupId) => getGroupData(groupId)));
    };

    getData().then((data) => {
      setGroups(data);
    });
  }, [user?.groups?.length]);

  return groups;
}
