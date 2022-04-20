const express = require("express");
const User = require("../models/Users");

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
      username: "lister-2",
      password: "lister312",
      accountType: "lister",
    },
    {
      username: "lister-3",
      password: "lister312",
      accountType: "lister",
    },
    {
      username: "lister-4",
      password: "lister312",
      accountType: "lister",
    },
    {
      username: "renter",
      password: "renter321",
      accountType: "renter",
    },
    {
      username: "renter-2",
      password: "renter234",
      accountType: "renter",
    },    {
      username: "renter-3",
      password: "renter345",
      accountType: "renter",
    },    {
      username: "renter-4",
      password: "renter456",
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

router.post("/login", async (req, res) => {
  dbga("req.body.username", req.body.username);
  dbga("req.body.password", req.body.password);

  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = await user.comparePassword(req.body.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = generateAccessToken({
    usr: user.username,
  });

  const [refreshToken, fgp] = generateRefreshToken();

  res
    .status(200)
    .cookie("__Secure-fgp=", fgp, { httpOnly: true, secure: true })
    .json({ token, refreshToken });
});

//* Create Route

router.post("/signup", async (req, res) => {
  const user = await User.find({ username: req.body.username });
  if (user.length > 0) {
    return res.status(400).send("Username already taken");
  }
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.json(JSON.stringify(newUser));
  } catch (error) {
    res.json({ ERROR: error });
  }
});

router.get("/test", authenticateToken, async (req, res) => {
  res.send("we good");
});

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
