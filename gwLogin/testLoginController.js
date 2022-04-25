const express = require("express")
const TestUsers = require("./testUsersModel")
const router = express.Router();
const cookieParser = require("cookie-parser");
//const csurf = require("csurf")
//const csrfProtection = csurf({ cookie: { httpOnly: true } })
const jwt = require("jsonwebtoken")
const path = require("path")


const bcrypt = require("bcrypt");

// You should actually store your JWT secret in your .env file - but to keep this example as simple as possible...
const jwtsecret = "the most secret string of text in history"

//  .use("/api/testusers", testUserController)
//  router.use(express.static("public"))
// router.set("view engine", "ejs")
// router.set("views", path.join(__dirname, "views"))

router.use(express.urlencoded({ extended: false }))
router.use(cookieParser())

const saltRounds = 10;
router.get("/seed", async (req, res) => {
    try {
        await TestUsers.deleteMany({})
        await TestUsers.create([
          {
            username: "rentername",
            accountType: "renter",
            password: bcrypt.hashSync("12345", saltRounds),
          },
          {
            username: "listername",
            accountType: "lister",
            password: bcrypt.hashSync("88888", saltRounds),
          },
        ]);
        res.send("Seed")
      } catch (error) {
          console.log(error);
      }
})


router.get("/",(req, res) => {
  jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
    if (err) {
      res.send("login")
    } else {
      res.json({ userObjectID: decoded._id })
    }
  })
})

router.post("/verify",(req, res) => {
  console.log(req)
  console.log(req.cookies.cookieToken)
  jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
    if (err) {
      res.send("login")
    } else {
      res.send("logged-in", { userObjectID: decoded.userObjectID })
      console.log(decoded.userObjectID)
    }
  })
})

router.get("http://localhost:3000/listings/all", mustBeLoggedIn,(req, res) => {
  jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
    if (err) {
      res.send("login")
    } else {
      res.send("logged-in", { name: decoded.name })
    }
  })
})


//* login route
router.post("/login", async (req, res) => {
  const { username, password} = req.body;
  // console.log('reqbody',req.body)
  // const hashPassword = bcrypt.hashSync(password, saltRounds);
  const user = await TestUsers.findOne({ username });
  // console.log(user.favourites)
  if (!user) {
      res.send("User not found");
  } else if (bcrypt.compareSync(password, user.password)) {
    res.cookie("cookieToken", jwt.sign({ userObjectID: user._id }, jwtsecret), { httpOnly: true })
    // req.session.user = user;
    // req.session.isLoggedIn = true; 
    // res.send("Ok");
    // res.redirect("/")
    res.redirect("http://localhost:3000/listings/all")
  } else {
    res.send("No")
  }
// res.send(user);
//* success or failure
});

router.get("/logout", (req, res) => {
  res.clearCookie("cookieToken")
  res.redirect("/")
})

// have a GET request that is token protected but doesnt need CSRF because it is not modifying any data
router.get("/get-secret-data", mustBeLoggedIn, (req, res) => {
  res.send(`<p>Welcome to the top secret data page. Only logged in users like you can access this amazing content. <a href="/">Go back home.</a></p>`)
})

// example json / api endpoint
router.get("/ajax-example", mustBeLoggedIn, (req, res) => {
  res.json({ message: "Two plus two is four and grass is green." })
})

// // show the money transfer form
// app.get("/transfer-money", csrfProtection, mustBeLoggedIn, (req, res) => {
//   res.render("transfer-money-form", { csrf: req.csrfToken() })
// })

// // have a POST request that verifies token AND needs to be CSRF protected because it hypothetically modifies data
// app.post("/transfer-money", csrfProtection, mustBeLoggedIn, (req, res) => {
//   res.send("Thank you, we are working on processing your transaction.")
// })

// Our token checker middleware
function mustBeLoggedIn(req, res, next) {
  jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
    if (err) {
      res.redirect("/")
    } else {
      next()
    }
  })
}

module.exports = router;