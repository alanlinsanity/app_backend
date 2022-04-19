const isProduction = process.env.NODE_ENV === "production";

const dbName = process.env.DBNAME;

const mongoUri = isProduction
  ? `${process.env.MONGODB_URI}${dbname}`
  : `mongodb://localhost:27017/${dbname}`;

const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

const prodUrls = {
  frontend: process.env.FRONTEND,
  backend: process.env.BACKEND,
};

module.exports = {
  mongoUri,
  accessSecret,
  refreshSecret,
  isProduction,
  prodUrls,
};
