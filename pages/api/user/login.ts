import { db } from "@/database";
import { User } from "@/models";
import { jwt } from "@/utils";
import bcrypt from "bcryptjs";
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
    case "POST":
      return loginUser(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;

  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) {
    return res
      .status(400)
      .json({ message: "Email or password are invalids - EMAIL" });
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res
      .status(400)
      .json({ message: "Email or password are invalids - PASSWORD" });
  }

  const { role, name, _id } = user;

  return res.status(200).json({
    token: await jwt.generateTokenJose(_id, email),
    user: {
      email,
      role,
      name,
    },
  });
};
