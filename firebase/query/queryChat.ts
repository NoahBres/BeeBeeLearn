import { firebaseAdmin } from "@/firebase/firebaseAdmin";

import { ChatMeta, ChatMessage } from "../types";

type FirebaseChatType = {
  participants: string[];
};

type FirebaseChatMessagesType = {
  message: string;
  sender: string;
  time: FirebaseFirestore.Timestamp;
};

const chatConverter: FirebaseFirestore.FirestoreDataConverter<ChatMeta> = {
  toFirestore(chat: ChatMeta): FirebaseChatType {
    return { participants: chat.participants };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ChatMeta {
    const data = snapshot.data() as FirebaseChatType;

    return { id: snapshot.id, participants: data.participants };
  },
};

const chatMessagesConverter: FirebaseFirestore.FirestoreDataConverter<ChatMessage> = {
  toFirestore(chat: ChatMessage): FirebaseChatMessagesType {
    return {
      message: chat.message,
      sender: chat.sender,
      time: FirebaseFirestore.Timestamp.fromDate(new Date(chat.time)),
    };
  },

  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): ChatMessage {
    const data = snapshot.data() as FirebaseChatMessagesType;

    return {
      message: data.message,
      sender: data.sender,
      time: data.time.toDate().toISOString(),
    };
  },
};

const chatsCollection = firebaseAdmin
  .firestore()
  .collection("chats")
  .withConverter(chatConverter);

const messageCollection = (id: string) =>
  chatsCollection
    .doc(id)
    .collection("messages")
    .withConverter(chatMessagesConverter);

export async function queryChat(
  chatRef: string | FirebaseFirestore.DocumentReference,

  // TODO: implement getChat options
  options?: { limitLast?: number }
): Promise<{ meta: ChatMeta; messages: ChatMessage[] }> {
  return new Promise(async (res, rej) => {
    const chatQuery =
      typeof chatRef === "string"
        ? chatsCollection.doc(chatRef).get()
        : chatRef.withConverter(chatConverter).get();

    chatQuery
      .then(async (chatDoc) => {
        if (chatDoc.exists) {
          const messages = await messageCollection(chatDoc.data().id)
            .orderBy("time")
            .get();

          res({
            meta: chatDoc.data(),
            messages: messages.docs.map((e) => e.data()),
          });
        } else {
          rej("Requested chat does not exist");
        }
      })
      .catch((err) => rej(err));
  });
}
