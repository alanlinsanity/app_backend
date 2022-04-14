const express = require("express");
const User = require("../models/Users");
const router = express.Router();

router.get("/seed", async (req, res) => {
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
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  if (isMatch) {
    res.json({ message: "success" });
  }
});

//* Create Route
router.post("/", async (req, res) => {
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

//* Delete Route
router.delete("/:id", async (req, res) => {
  /*   await Listing.findByIdAndRemove(req.params.id);
  res.json({ message: "Listing Deleted" }); */
});

//*Put route
router.put("/:id", async (req, res) => {
  /*   await Listing.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Listing Updated" }); */
});

module.exports = router;
