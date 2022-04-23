"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envhelper_1 = require("./envhelper");
const crypto_1 = __importDefault(require("crypto"));
const expiry = {
    access: "15m",
    refresh: "1h",
};
const jwtoptions = {
    encoding: "utf8",
    algorithm: "HS384",
    mutatePayload: true,
    subject: "user",
    noTimestamp: true,
};
const generateAccessToken = (userdata) => jsonwebtoken_1.default.sign(userdata, envhelper_1.accessSecret, { ...jwtoptions, expiresIn: expiry.access });
exports.generateAccessToken = generateAccessToken;
const sha256hash = (input) => crypto_1.default.createHash("sha256").update(input).digest("base64");
function generateRefreshToken(userdata) {
    const fgp = crypto_1.default.randomBytes(64).toString("base64");
    const cookieValue = sha256hash(fgp);
    const refreshToken = jsonwebtoken_1.default.sign({ ...userdata, fgp }, envhelper_1.refreshSecret, {
        ...jwtoptions,
        expiresIn: expiry.refresh,
    });
    return [refreshToken, cookieValue];
}
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token, fgp) => {
    const decoded = jsonwebtoken_1.default.verify(token, envhelper_1.refreshSecret);
    if (!decoded)
        return false;
    const tfgp = decoded.fgp;
    return sha256hash(tfgp) === fgp ? decoded : false;
};
exports.verifyRefreshToken = verifyRefreshToken;
const authMiddleWare = (req, res, next) => {
    const cookie = req.cookies;
    const headers = req.headers;
    if (!cookie)
        return next();
    const decoded = verifyRefreshToken(cookie, req.cookies.fgp);
    if (!decoded)
        return next();
    req.user = decoded;
    next();
};
