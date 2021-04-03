import type { NextApiRequest, NextApiResponse } from "next";

import { firebaseAdmin } from "@/firebase/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const messageRef = firebaseAdmin
      .firestore()
      .collection("chats")
      .doc("gOKTf8SdhjMg7GzjRYtr")
      .collection("messages");

    await messageRef.add({
      message: req.query.message,
      sender: "bot",
      time: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).end();
  } else {
    res
      .status(403)
      .json({ message: `${req.method} method not supported on this route` });
  }
};
