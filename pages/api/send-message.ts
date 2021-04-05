import type { NextApiRequest, NextApiResponse } from "next";

import { firebaseAdmin } from "@/firebase/firebaseAdmin";

import { deleteCollection } from "@/firebase/query";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const reqBody = JSON.parse(req.body);

    if (!req.cookies["token"]) {
      res.status(400).json({ message: "Token missing" });
    } else if (!reqBody) {
      res.status(400).json({ message: "Body missing" });
    } else if (!reqBody["chatId"]) {
      res.status(400).json({ message: "`chatId` missing" });
    } else if (!reqBody["message"]) {
      res.status(400).json({ message: "`message` missing" });
    } else {
      try {
        const decodedToken = await firebaseAdmin
          .auth()
          .verifyIdToken(req.cookies["token"]);

        // TODO validate role via token
        // TODO check if message id belongs to the user token

        const messageRef = firebaseAdmin
          .firestore()
          .collection("chats")
          .doc("gOKTf8SdhjMg7GzjRYtr")
          .collection("messages");

        if (reqBody.message.message === "/clear") {
          await deleteCollection(firebaseAdmin.firestore(), messageRef);
        } else {
          await messageRef.add({
            ...reqBody.message,
            sender: decodedToken.uid,
            time: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          });
        }

        res.status(200).end();
      } catch (err) {
        res.status(500).json({ message: err });
      }
    }
  } else {
    res
      .status(403)
      .json({ message: `${req.method} method not supported on this route` });
  }
};
