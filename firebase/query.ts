import { firebaseAdmin } from "@/firebase/firebaseAdmin";

import { User } from "./types";

export async function getUser(id: string): Promise<User | null> {
  return new Promise((res, rej) => {
    const userRef = firebaseAdmin.firestore().collection("users").doc(id);
    userRef
      .get()
      .then((e) => {
        if (e.exists) {
          const transformedData = { ...e.data(), id: e.id } as User;
          res(transformedData);
        } else {
          rej(rej("User does not exist"));
        }
      })
      .catch((e) => rej(`A problem occured while retrieving user: ${e}`));
  });
}
