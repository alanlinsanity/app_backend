import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { accessSecret, refreshSecret } from "./envhelper";
import crypto from "node:crypto";
import { User } from "../models/Users";

const expiry = {
  access: "15m",
  refresh: "1h",
  remember: "21d",
};

const jwtAlgorithm = "HS384";

const jwtoptions: SignOptions = {
  encoding: "utf8",
  algorithm: jwtAlgorithm,
  subject: "user",
  noTimestamp: true,
};

const generateAccessToken = (userdata: { [k: string]: string }) =>
  jwt.sign(userdata, accessSecret, { ...jwtoptions, expiresIn: expiry.access });

const sha256hash = (input) =>
  crypto.createHash("sha256").update(input).digest("base64");

function generateRefreshToken(userdata, rememberMe = false) {
  const fgp = crypto.randomBytes(64).toString("base64");
  const cookieValue = sha256hash(fgp);
  const refreshToken = jwt.sign({ ...userdata, fgp }, refreshSecret, {
    ...jwtoptions,
    expiresIn: rememberMe ? expiry.remember : expiry.refresh,
  });
  return [refreshToken, cookieValue];
}

type fgpToken = { fgp: string } & jwt.JwtPayload;

const verifyRefreshToken = (token, fgp) => {
  const decoded = jwt.verify(token, refreshSecret);
  if (!decoded) return false;
  const tokenFgp = (decoded as fgpToken).fgp;
  return sha256hash(tokenFgp) === fgp ? decoded : false;
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, accessSecret, {
      algorithms: [jwtAlgorithm],
    });
  } catch (error) {
    return console.log("verifyAccessTokenError", error);
  }
};

const accessTokenVerifier = async (req, res, next) => {
  const headers = req.headers;
  const { authorization } = headers;

  console.log("req.headers", req.headers);

  if (/jwt/.test(authorization)) {
    const token = authorization.split(" ")[1];
    const userdata = verifyAccessToken(token);
    if (userdata) {
      const user = await User.findById(userdata._id).exec();
      req.userdata = { ...userdata, accountType: user.accountType };
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  accessTokenVerifier,
};
