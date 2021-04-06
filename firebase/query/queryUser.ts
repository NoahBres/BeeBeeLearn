import firebaseAdmin from "@/firebase/admin";

import { User } from "../types";

type FirebaseUserType = {
  name: string;
  password: string;
  role: "student" | "admin";

  chats: {
    chatRef: FirebaseFirestore.DocumentReference;
    participants: string[];
  }[];
};

export const userConverter: FirebaseFirestore.FirestoreDataConverter<User> = {
  toFirestore(user: User): FirebaseUserType {
    return {
      name: user.name,
      password: user.password,
      role: user.role,

      chats: user.chats,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): User {
    const data = snapshot.data() as FirebaseUserType;

    return {
      id: snapshot.id,
      name: data.name,
      password: data.password,
      role: data.role,
      chats: data.chats,
    };
  },
};

const usersCollection = firebaseAdmin
  .firestore()
  .collection("users")
  .withConverter(userConverter);

export async function queryUser(
  userRef: string | FirebaseFirestore.DocumentReference
): Promise<User> {
  return new Promise((res, rej) => {
    const userQuery =
      typeof userRef === "string"
        ? usersCollection.doc(userRef).get()
        : userRef.withConverter(userConverter).get();

    userQuery
      .then((userDoc) => {
        if (userDoc.exists) {
          res(userDoc.data());
        } else {
          rej("Requested user does not exist");
        }
      })
      .catch((err) => rej(err));
  });
}
