const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// const hash = ({}) => crypto.createHash("sha256").update("password").digest("hex");

function generateAccessToken(userInfo) {
  return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == undefined) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateRefreshToken() {
  const buf = crypto.randomBytes(64);
  const fgp = buf.toString("hex");

  const refreshToken = jwt.sign({ fgp }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return [refreshToken, fgp];
}

module.exports = {
  generateAccessToken,
  authenticateToken,
  generateRefreshToken,
};
