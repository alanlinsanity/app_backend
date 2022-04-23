require("dotenv").config();
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-undef */

const dbName = process.env.DBNAME;

const mongoUri =
  process.env.useLocal === "1"
    ? `mongodb://localhost:27017/${dbName}`
    : `${process.env.MONGODB_URI}${dbName}`;

//"mongodb+srv://alanlinsanity:s9221683g@cluster0.vq2et.mongodb.net/reallistic"
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
  backend: 2000,
  frontend: 3000,
};
const frontEndUrls = [`http://localhost:${ports.frontend}`];
for (const url in prodUrls) {
  if (url.includes("frontend")) {
    frontEndUrls.push(new URL(prodUrls[url]).origin);
  }
}

module.exports = {
  mongoUri,
  accessSecret,
  refreshSecret,
  frontEndUrls,
  prodUrls,
  ports,
};
