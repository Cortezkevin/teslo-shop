import { db } from "@/database";
import { User } from "@/models";
import { jwt, validations } from "@/utils";
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
      return registerUser(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { email = "", password = "", name = "", role = "" } = req.body;

  await db.connect();
  const existsUserByEmail = await User.findOne({ email });

  if (password.length < 6) {
    await db.disconnect();
    return res
      .status(400)
      .json({ message: "The password must be 6 characters" });
  }

  if (!validations.isValidEmail(email)) {
    await db.disconnect();
    return res.status(400).json({ message: "The email is invalid" });
  }

  if (existsUserByEmail) {
    await db.disconnect();
    return res.status(400).json({ message: "Email already exists - EMAIL" });
  }

  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();
    const { _id } = newUser;
    return res.status(200).json({
      token: await jwt.generateTokenJose(_id, email),
      user: {
        email,
        role,
        name,
      },
    });
  } catch (error) {
    await db.disconnect();
    return res.status(200).json({
      message: "Error at save the user",
    });
  }
};
