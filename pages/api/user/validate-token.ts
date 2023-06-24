import { db } from "@/database";
import { User } from "@/models";
import { jwt } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | { message: string }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return checkJWT(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies;

  let userId = "";

  try {
    userId = await jwt.validateTokenJose(token);
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }

  await db.connect();
  const user = await User.findById(userId);
  await db.disconnect();

  if (!user) {
    return res.status(404).json({ message: "User not exists with this id" });
  }

  const { role, name, _id, email } = user;

  return res.status(200).json({
    token: await jwt.generateTokenJose(_id, email),
    user: {
      email,
      role,
      name,
    },
  });
};
