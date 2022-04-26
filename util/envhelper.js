require("dotenv").config();
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-undef */

const dbName = process.env.DBNAME;

const mongoenv = process.env.MONGODB_URI.replace(/(?<=mongodb\.net\/).+$/, "");

const mongoUri =
  process.env.useLocal === "1"
    ? `mongodb://localhost:27017/${dbName}`
    : `${mongoenv}reallistic`;
// : `${process.env.MONGODB_URI}${dbName}`;

const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

const prodUrls = {};
const populateUrls = (point) => {
  if (process.env[point]) prodUrls[point.toLowerCase()] = process.env[point];
};
for (const end of ["FRONTEND", "BACKEND"]) {
  for (const e of [end, `STAGING_${end}`]) {
    populateUrls(e);
  }
}
const ports = {
  backend: process.env.PORT ?? 2000,
  frontend: 3000,
};
const frontEndUrls = [`http://localhost:${ports.frontend}`];
for (const url in prodUrls) {
  if (url.includes("frontend")) {
    frontEndUrls.push(new URL(prodUrls[url]).origin);
  }
}

frontEndUrls.push("https://reallistic-94wougov3-duguowei1000.vercel.app");

module.exports = {
  mongoUri,
  accessSecret,
  refreshSecret,
  frontEndUrls,
  prodUrls,
  ports,
};
