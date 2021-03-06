import type { NextApiRequest, NextApiResponse } from "next";

import firebaseAdmin from "@/firebase/admin";
import { queryUser } from "@/firebase/query";
import { comparePass } from "@/firebase/password";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (req.headers["authorization"]?.startsWith("Basic ")) {
      const authPayload = req.headers["authorization"].slice("Basic ".length);
      const decodedPayload = Buffer.from(authPayload, "base64").toString();
      const [username, password] = decodedPayload.split(":");

      console.log(req.headers);

      if (username.length === 0 || password.length === 0) {
        res.status(400).json({ message: "Empty username or password field" });
      } else {
        try {
          const user = await queryUser(username);

          const passwordsMatch = await comparePass(
            password ?? "",
            user.password
          );
          if (passwordsMatch) {
            try {
              const token = await firebaseAdmin
                .auth()
                .createCustomToken(user.id);
              res.status(200).json({ token });
            } catch (err) {
              res.status(401).json({
                message: `A problem occured while generating token: ${err}`,
              });
            }
          } else res.status(401).json({ message: "Invalid Password" });
        } catch (e) {
          res.status(401).json({ message: `${e}` });
        }
      }
    } else {
      res.status(403).json({ message: "Missing Authorization header" });
    }
  } else {
    res
      .status(403)
      .json({ message: `${req.method} method not supported on this route` });
  }
};
