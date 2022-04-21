const express = require("express");
const models = require("../models");
const { User, Listing } = models;

const dbga = require("debug")("app:auth");

const {
  generateAccessToken,
  authenticateToken,
  generateRefreshToken,
} = require("../util/authentication");

const router = express.Router();

router.get("/seed", async (req, res) => {
  dbga("seed");
  await User.deleteMany({});
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
  dbga("check", users);

  res.send(users);
});

//*
router.post("/login", async (req, res) => {
  try {
    const user = await User.getAuthenticated(req.body);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const { username, accountType } = user;
    const token = generateAccessToken({ username, accountType });
    const [refreshToken, fgp] = generateRefreshToken();

    res
      .status(200)
      .cookie("__secure-fgp", fgp, {
        domain: "localhost",
        secure: true,
        httpOnly: true,
      })
      .json({ token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error });
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

router.get("/test", async (req, res) => {
  const users = User.find({}).exec();
  const listings = Listing.find({}).exec();

  await Promise.all([users, listings]);

  res.json({ users, listings });

  // console.log(req);
  // console.log("req.cookies", req.cookies);
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
