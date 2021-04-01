import { DocumentReference } from "@firebase/firestore-types";

import { firebaseAdmin } from "@/firebase/firebaseAdmin";

import { Chat, ChatMessage, User } from "./types";

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
          rej("Requested user does not exist");
        }
      })
      .catch((e) => rej(`A problem occured while retrieving user: ${e}`));
  });
}

export async function getChat(
  chatRef: string | DocumentReference
): Promise<Chat | null> {
  return new Promise((res, rej) => {
    if (typeof chatRef === "string") {
      console.log("string query");
    } else {
      chatRef
        .get()
        .then(async (chatDoc) => {
          if (chatDoc.exists) {
            const chat: Chat = {
              participants: [],
              id: chatDoc.id,
              messages: [],
            };

            const chatData = chatDoc.data();

            chat.participants = await Promise.all(
              chatData.participants.map(async (participantObj) => {
                if (participantObj === "bot") {
                  return "bot";
                } else {
                  try {
                    const participant = await participantObj.get();

                    return {
                      id: participant.id,
                      name: participant.data().name,
                    };
                  } catch (err) {
                    rej(err);
                  }
                }
              })
            );

            chat.messages = chatData.messages.map((chatObj) => {
              const message: ChatMessage = {
                message: chatObj.message,
                sender: "bot",
                time: (chatObj.time.toDate() as Date).toISOString(),
              };

              if (chatObj.sender === "bot") {
                message.sender = "bot";
              } else {
                message.sender = chat.participants
                  .filter((e) => e !== "bot")
                  .find(
                    (e) => (e as Exclude<typeof e, "bot">).id === chatObj.sender
                  );
              }

              return message;
            });

            res(chat);
          } else {
            rej("Requested chat does not exist");
          }
        })
        .catch((e) => rej(`A problem occured while retrieving chat: ${e}`));
    }
  });
}
