"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenVerifier = exports.verifyAccessToken = exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envhelper_1 = require("./envhelper");
const node_crypto_1 = __importDefault(require("node:crypto"));
const Users_1 = require("../models/Users");
const expiry = {
    access: "15m",
    refresh: "1h",
    remember: "21d",
};
const jwtAlgorithm = "HS384";
const jwtoptions = {
    encoding: "utf8",
    algorithm: jwtAlgorithm,
    subject: "user",
    noTimestamp: true,
};
const generateAccessToken = (userdata) => jsonwebtoken_1.default.sign(userdata, envhelper_1.accessSecret, { ...jwtoptions, expiresIn: expiry.access });
exports.generateAccessToken = generateAccessToken;
const sha256hash = (input) => node_crypto_1.default.createHash("sha256").update(input).digest("base64");
function generateRefreshToken(userdata, rememberMe = false) {
    const fgp = node_crypto_1.default.randomBytes(64).toString("base64");
    const cookieValue = sha256hash(fgp);
    const refreshToken = jsonwebtoken_1.default.sign({ ...userdata, fgp }, envhelper_1.refreshSecret, {
        ...jwtoptions,
        expiresIn: rememberMe ? expiry.remember : expiry.refresh,
    });
    return [refreshToken, cookieValue];
}
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token, fgp) => {
    const decoded = jsonwebtoken_1.default.verify(token, envhelper_1.refreshSecret);
    if (!decoded)
        return false;
    const tokenFgp = decoded.fgp;
    return sha256hash(tokenFgp) === fgp ? decoded : false;
};
exports.verifyRefreshToken = verifyRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, envhelper_1.accessSecret, {
            algorithms: [jwtAlgorithm],
        });
    }
    catch (error) {
        return console.log("verifyAccessTokenError", error);
    }
};
exports.verifyAccessToken = verifyAccessToken;
const accessTokenVerifier = async (req, res, next) => {
    const headers = req.headers;
    const { authorization } = headers;
    console.log("req.headers", req.headers);
    if (/jwt/.test(authorization)) {
        const token = authorization.split(" ")[1];
        const userdata = verifyAccessToken(token);
        if (userdata) {
            const user = await Users_1.User.findById(userdata._id).exec();
            req.userdata = { ...userdata, accountType: user.accountType };
            next();
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }
    else {
        res.status(401).send("Unauthorized");
    }
};
exports.accessTokenVerifier = accessTokenVerifier;
