/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-undef */
const isProduction = process.env.NODE_ENV === "production";

const dbName = process.env.DBNAME;


const mongoUri = isProduction
  ? `${process.env.MONGODB_URI}${dbName}`
  : `mongodb://localhost:27017/${dbName}`;


//"mongodb+srv://alanlinsanity:s9221683g@cluster0.vq2et.mongodb.net/reallistic" 
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

const prodUrls = {
  frontend: process.env.FRONTEND,
  backend: process.env.BACKEND,
};

const ports = {
  local: {
    backend: 2000,
    frontend: 3000,
  },
};

module.exports = {
  mongoUri,
  accessSecret,
  refreshSecret,
  isProduction,
  prodUrls,
  ports,
};
