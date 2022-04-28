const express = require("express");

const { User } = require("../models/Users");

const dbg = require("debug")("app:auth");

const {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRefreshToken,
} = require("../util/authentication");

const router = express.Router();

router.get("/seed", async (req, res) => {
  dbg.extend("seed");

  await User.deleteMany().exec();
  const users = [
    {
      username: "admin",
      password: "admin123",
      accountType: "admin",
    },
    {
      username: "lister",
      password: "lister123",
      accountType: "lister",
    },
    {
      username: "renter",
      password: "renter123",
      accountType: "renter",
    },
    {
      username: "tenant",
      password: "tenant123",
      accountType: "tenant",
    },
  ];

  try {
    await User.create(users);
    res.send("Seeded");
  } catch (error) {
    res.send(`ERROR: ${error}`);
  }
});

//*
const failResponse = {
  success: false,
  message: "Invalid username or password",
};

const successResponseHelper = (user, rememberMe) => {
  const { _id, username, accountType } = user;
  const accessToken = generateAccessToken({ _id, username });
  const [refreshToken, fgp] = generateRefreshToken({ _id }, rememberMe);
  return {
    cookie: {
      Name: "__secure-fgp",
      Value: fgp,
      Options: {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    },
    jsonResponse: {
      success: true,
      message: "Login successful",
      token: accessToken,
      refreshToken: refreshToken,
      userData: {
        username,
        accountType,
      },
    },
  };
};

router.post("/login", async (req, res) => {
  try {
    dbg.extend("req.body")(req.body);
    const user = await User.findOne({ username: req.body.username });
    dbg.extend("user")(user);
    if (!user) return res.status(401).json(failResponse);

    const isMatch = user.comparePassword(req.body.password);
    dbg.extend("isMatch")(isMatch);
    /* (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ ...failResponse, message: "Error comparing passwords" }); */
    if (!isMatch) return res.status(401).json(failResponse);

    if (user && isMatch) {
      const { rememberMe } = req.body;
      const { cookie, jsonResponse } = successResponseHelper(user, rememberMe);
      return res
        .status(200)
        .cookie(cookie.Name, cookie.Value, cookie.Options)
        .json(jsonResponse);
    }
  } catch (error) {
    dbg.extend("login")("error", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
});

//* Create Route

router.post("/signup", async (req, res) => {
  console.log("req", req);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).json({ message: "User already exists" });
    const { rememberMe, ...userDetails } = req.body;

    const newUser = await User.create(userDetails);
    const { cookie, jsonResponse } = successResponseHelper(newUser, rememberMe);

    return res
      .status(200)
      .cookie(cookie.Name, cookie.Value, cookie.Options)
      .json(jsonResponse);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Error creating account",
    });
  }
});

router.get("/test", async (req, res) => {
  const headers = req.headers;
  const { cookie, authorization } = headers;
  const jwt = authorization.split(" ")[1];
  const verified = verifyAccessToken(jwt);

  console.log("req.cookies", { cookie, authorization });
  console.log("verified", verified);

  res.json({ cookie, headers });
});

//addfavourite
// router.post("", (req, res) => {
//   const { fav, user } = req.body;

//   const currentUser = user;
//   User.findOneAndUpdate(
//     { username: currentUser },
//     { $push: { favourites: fav } }
//   );

//   const favourites = [];

//   favourites.push(newfav);
// });
// //* Delete Route
// router.delete("/:id", async (req, res) => {
//   /*   await Listing.findByIdAndRemove(req.params.id);
//   res.json({ message: "Listing Deleted" }); */
// });

// //*Put route
// router.put("/:id", async (req, res) => {
//   /*   await Listing.findByIdAndUpdate(req.params.id, req.body);
//   res.json({ message: "Listing Updated" }); */
// });

module.exports = router;
