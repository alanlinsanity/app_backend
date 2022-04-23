// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const debug = require("debug");
const debugserver = debug("app:server:debug");
const logserver = debug("app:server:log");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const ListingController = require("./controllers/listingController");
const AuthController = require("./controllers/auth");
const tenantUserController = require("./controllers/tenantUserController");
const morgan = require("morgan");
const { frontEndUrls, mongoUri, prodUrls, ports } = require("./util/envhelper");
const { User } = require("./models/Users");
const Listing = require("./models/Listing");

const app = express();
const PORT = ports.backend;
const MONGODB_URI = mongoUri;

// Error / Disconnection
mongoose.connection
  .on("error", (err) => logserver(err.message + " is Mongod not running?"))
  .on("disconnecting", () => logserver("mongod disconnected"))
  .on("disconnected", () => logserver("mongo disconnected"))
  .once("open", () => {
    logserver(
      "connected to mongoose at \033[94,1m" + `${MONGODB_URI}` + "\033[0m"
    );
  });

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});

app
  .use(morgan("tiny"))
  .set("trust proxy", true)
  .use(
    cors({
      credentials: true,
      origin: frontEndUrls,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
  )
  .use(express.json())
  .use(cookieParser("secret"))
  .use("/api/listings", ListingController)
  .use("/auth", AuthController);

app.get("/", async (req, res) => {
  const db = await mongoose.connection.asPromise();
  debugserver(db.host);
  debugserver(req);
  res.status(200).json({
    message: "Welcome to the backend",
    server: {
      mongoInstance: mongoUri,
      db: db.name,
    },
  });
});
// const users = await User.find().exec();
// const listings = await Listing.find().exec();
// .then((res) => console.log("res", res))
// .catch((err) => console.log("err", err));

// res.send({ users, listings });
// res.send("Welcome to Reallistic");

app.use("/api/tenant", tenantUserController);

app.listen(PORT, () => {
  logserver(`Server is running on port ${PORT}`);
});
