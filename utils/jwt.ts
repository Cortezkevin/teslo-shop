import jwt from "jsonwebtoken";
import * as jose from "jose";

export const generateToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Not exists JWT_SECRET");
  }

  return jwt.sign({ _id, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const generateTokenJose = async (_id: string, email: string) => {
	if (!process.env.JWT_SECRET) {
		throw new Error("Not exists JWT_SECRET");
	}

	const secret = new TextEncoder().encode( process.env.JWT_SECRET! );
  const alg = "HS256";

  const jwt = await new jose.SignJWT({
    _id,
    email,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

	return jwt;
};

export const validateTokenJose = async ( token: string ): Promise<string> => {
	if (!process.env.JWT_SECRET) {
		throw new Error("Not exists JWT_SECRET");
	}
	const secret = new TextEncoder().encode( process.env.JWT_SECRET! );
  const { payload } = await jose.jwtVerify(token, secret);
  const userId = payload._id;
  return userId as string;
}

export const validateToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Not exists JWT_SECRET");
  }

  if (token.length <= 10) {
    return Promise.reject("Not valid JWT Token");
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
        if (err) return reject("Not valid JWT Token");
        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      console.log("ERROR EN EL RETUN", error);
      reject("Not valid JWT Token");
    }
  });
};
