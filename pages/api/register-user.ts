import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Process a POST request
    res.status(200).json({ name: "Register User" });
  } else {
    res
      .status(403)
      .json({ message: `${req.method} method not supported on this route` });
  }
};
