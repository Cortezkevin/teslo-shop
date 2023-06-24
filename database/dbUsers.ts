import { User } from "@/models";
import { db } from ".";
import bcrypt from "bcryptjs";

export const checkUserEmailPassword = async ( email: string, password: string ) => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password!)) return null;

  const { role, name, _id } = user;

  return {
    email,
    role,
    name,
    id: _id
  }
}

export const oauthToDbUser = async ( oAuthEmail: string, oAuthName: string ) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user){
    await db.disconnect();
    const { role, name, email, _id } = user;
    return {
      email,
      role,
      name,
      id: _id
    }
  }

  const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' })
  await newUser.save();
  await db.disconnect();
  
  const { role, name, email, _id } = newUser;

  return {
    email,
    role,
    name,
    id: _id
  }
}