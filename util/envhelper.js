const mongoUri =
  process.env.NODE_ENV === "production"
    ? `${process.env.MONGODB_URI}${process.env.DBNAME}`
    : "mongodb://localhost:27017/";

const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const port = process.env.PORT || 2000;

module.exports = {
  mongoUri,
  accessSecret,
  refreshSecret,
  port,
};
