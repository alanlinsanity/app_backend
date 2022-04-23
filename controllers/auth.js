const express = require("express");
// const { Listing } = require("../models/Listing");
const { User } = require("../models/Users");

const dbg = require("debug")("app:auth");

const {
  generateAccessToken,
  // authenticateToken,
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
      password: "lister312",
      accountType: "lister",
    },
    {
      username: "renter",
      password: "renter321",
      accountType: "renter",
    },
  ];

  try {
    await User.create(users);
    res.send("Seeded");
  } catch (error) {
    res.send(`ERROR: ${error}`);
  }
});

//* Login
// router.post("/login", async (req, res) => {
//   const user = await User.findOne({ username: req.body.username });

//   if (!user) return res.status(401).json({ message: "User not found" });

//   //!
//   // user.comparePassword("Password123", function (err, isMatch) {
//   //   if (err) throw err;
//   //   console.log("Password123:", isMatch); // -> Password123: true
//   // });

//   // const isMatch = await user.comparePassword(
//   //   dbga(`req.body.password: ${req.body.password}`),
//   //   req.body,
//   //   (err, isMatch) => {
//   //     if (err)
//   //       return res.status(500).json({ message: "Error comparing passwords" });
//   //     return isMatch;
//   //   }
//   // );
//   //!

//   user.comparePassword(req.body.password, (err, isMatch) => {
//     if (err)
//       return res.status(500).json({ message: "Error comparing passwords" });
//     if (!isMatch) return res.status(401).json({ message: "Invalid password" });

//     const accessToken = generateAccessToken(user);
//   });

//   dbga("req.body.password", req.body.password);

//   if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

//   const token = generateAccessToken({
//     usr: user.username,
//   });

//   const [refreshToken, fgp] = generateRefreshToken();
//   res.setHeader("set-cookie", [`${fgp}`, "HttpOnly", "Secure"]);
//   res.json({ token, refreshToken });
// });

//*
router.get("/check", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

//*
router.post("/login", async (req, res) => {
  dbg.extend("login")("req.body", req.body);
  const failResponse = {
    success: false,
    message: "Invalid username or password",
  };
  try {
    const user = await User.findOne({ username: req.body.username });
    dbg.extend("login")("user", user);
    if (!user) return res.status(401).json(failResponse);

    const isMatch = user.comparePassword(req.body.password, (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ ...failResponse, message: "Error comparing passwords" });
      if (!isMatch) return res.status(401).json(failResponse);
    });

    if (user && isMatch) {
      const { username, accountType } = user;
      const accessToken = generateAccessToken({ username });
      const [refreshToken, fgp] = generateRefreshToken(username);
      dbg.extend("login")("tokens", { accessToken, refreshToken, fgp });
      return res
        .status(200)
        .cookie("__secure-fgp", fgp, {
          httpOnly: true,
          secure: true,
          domain: "localhost",
          signed: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .json({
          success: true,
          message: "Login successful",
          token: accessToken,
          refreshToken: refreshToken,
        });
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
  const user = await User.find({ username: req.body.username });
  if (user.length > 0) {
    return res.status(400).json({
      message: "Username already exists",
    });
  }
  const newUser = await User.create(req.body);
  const token = generateAccessToken({ username, accountType });
  const [refreshToken, fgp] = generateRefreshToken();

  res
    .status(201)
    .json(newUser)
    .cookie("__secure-fgp", fgp, {
      domain: "localhost",
      secure: true,
      httpOnly: true,
    })
    .json({ token, refreshToken });
});

router.get("/test", async (req, res) => {});

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
