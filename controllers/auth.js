const express = require("express");

const Listing = require("../models/Listing");
const { User } = require("../models/Users");

const dbg = require("debug")("app:auth");

const {
  generateAccessToken,
  // authenticateToken,
  generateRefreshToken,
  authMiddleWare,
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

const validateJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

//*
router.get("/check", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

//*
const failResponse = {
  success: false,
  message: "Invalid username or password",
};
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json(failResponse);

    const isMatch = user.comparePassword(req.body.password, (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ ...failResponse, message: "Error comparing passwords" });
      if (!isMatch) return res.status(401).json(failResponse);
    });

    if (user && isMatch) {
      const { _id, username, accountType, favourites, listings } = user;

      const userListings =
        accountType === "admin"
          ? await Listing.find()
          : await Listing.find({ lister: username });
      console.log("userListings", userListings);

      // const favs,
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
          userData: {
            userId: _id,
            username,
            accountType,
            favourites,
            listings: userListings,
          },
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
  console.log("req", req);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).json({ message: "User already exists" });
    const newUser = await User.create(req.body);
    const { _id, username, accountType, favourites, listings } = newUser;
    const userListings =
      accountType === "admin"
        ? await Listing.find()
        : await Listing.find({ lister: username });
    const accessToken = generateAccessToken({ username });
    const [refreshToken, fgp] = generateRefreshToken({ username });
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
        userData: {
          userId: _id,
          username,
          accountType,
        },
      });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Error creating account",
    });
  }

  // res
  //   .status(201)
  //   .json(newUser)
  //   .cookie("__secure-fgp", fgp, {
  //     domain: "localhost",
  //     secure: true,
  //     httpOnly: true,
  //   })
  //   .json({ token, refreshToken });
});

router.get("/test", async (req, res) => {
  const headers = req.headers;
  const { cookie, authorization } = headers;
  console.log("req.cookies", { cookie, authorization });
  res.json({ cookie, headers });
});





//Add tenant favourites to list
router.put("/:id", async (req, res) => {
  const  {fav } = req.body;
  //_id shld be tagged to the logged in User
  const tenantID = req.params.id//"6262c905f7d19a73f07ede29"
  const update = await User.findByIdAndUpdate({_id:tenantID},{$addToSet: {favourites:fav}})

  if(update ===null){
    console.log('mongo search is null')
  }
  //res.send('Added to list')
  res.json({ message: "Added to list" });

  //await update.save()
})

//Delete specific listing from favourites
router.put("/watchlist/:id", async (req, res) => {
  const  {fav } = req.body;
  //console.log('deleteBody' , fav)
  //_id shld be tagged to the logged in User
  const tenantID = req.params.id//"6262c905f7d19a73f07ede29"
  const update = await User.findByIdAndUpdate({_id:tenantID},{ $pull: {favourites:fav}})


  if(update ===null){
    console.log('mongo search is null----pull')
  }
  
  res.json({ message: "Deleted from list" });

})

//Find ListS
router.get("/findList", (req, res) => {
  console.log('>>>find list' )
  User.find()
    .then((listings) => {
      res.json(listings);
    })
    .catch((err) => {
      res.json(err);
    });
    
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
