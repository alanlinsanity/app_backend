// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const ListingController = require("./controllers/listingController");
const AuthController = require("./controllers/auth");3
const tenantUserController = require("./controllers/tenantUserController");
const morgan = require("morgan");
const { isProduction, mongoUri, prodUrls, ports } = require("./util/envhelper");
const morganFmt = isProduction ? "tiny" : "dev";
const frontEndUrls = [
  `http://localhost:${ports.local.frontend}`,
  prodUrls.frontend,
];

const app = express();
const PORT = ports.local.backend;
const MONGODB_URI = mongoUri;

// Error / Disconnection
mongoose.connection
  .on("error", (err) => console.log(err.message + " is Mongod not running?"))
  .on("disconnected", () => console.log("mongo disconnected"))
  .once("open", () => {
    console.log("connected to mongoose...");
  });

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});

app
  .use(morgan(morganFmt))
  .set("trust proxy", true)
  .use(
    cors({
      credentials: true,
      origin: frontEndUrls,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
  )
  .use(express.json())
  .use(cookieParser())
  .use("/api/listings", ListingController)
  .use("/auth", AuthController);

app.get("/", (req, res) => {
  res.send("Welcome to Reallistic");
});

app.use("/api/tenant", tenantUserController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
