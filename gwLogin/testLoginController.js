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

        const testUsers = [
          { 
            username: "renter1",
            accountType: "renter",
            password: bcrypt.hashSync("11111", saltRounds),
            favourites : []  
          },
          { 
            username: "renter2",
            accountType: "renter",
            password: bcrypt.hashSync("22222", saltRounds),
            favourites : []
          },
          { 
            username: "lister1",
            accountType: "lister",
            password: bcrypt.hashSync("33333", saltRounds),
            favourites : []
          },
          { 
            username: "lister2",
            accountType: "lister",
            password: bcrypt.hashSync("44444", saltRounds),
            favourites : []
          },
       
        ];
        await TestUsers.deleteMany({});
        await TestUsers.insertMany(testUsers);
        res.json(testUsers);
      });

// //* Index Route
// router.get("/",(req, res) => {
//   jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
//     if (err) {
//       res.send("login")
//     } else {
//       res.json({ userObjectID: decoded._id })
//     }
//   })
// })

router.get("/findList", (req, res) => {
  TestUsers.find()
    .then((listings) => {
      res.json(listings);
    })
    .catch((err) => {
      res.json(err);
    });
    
});


router.post("/verify",(req, res) => {
  //console.log('cookieToken',req.cookies.cookieToken)
  jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
    if (err) {
      // res.send("login")
    } else {
      console.log('decoded>>>>',decoded.userObjectID)
      res.json(decoded) //send back userID
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
    res.cookie("cookieToken", jwt.sign({ userObjectID: user._id, name:user.username}, jwtsecret), { httpOnly: true })
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

//LOGOUT ROUTE
router.get("/logout", (req, res) => {

  res.clearCookie("cookieToken")
  res.redirect("http://localhost:3000/")

})

// have a GET request that is token protected but doesnt need CSRF because it is not modifying any data
router.get("/get-secret-data", mustBeLoggedIn, (req, res) => {
  res.send(`<p>Welcome to the top secret data page. Only logged in users like you can access this amazing content. <a href="/">Go back home.</a></p>`)
})

// example json / api endpoint
router.get("/ajax-example", mustBeLoggedIn, (req, res) => {
  res.json({ message: "Two plus two is four and grass is green." })
})


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



// //* Create Route
// router.post("/", async (req, res) => {
//   try {
//     const createdListing = await TenantUser.create(req.body);
//     res.status(200).send(createdListing);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.put("/:id", async (req, res) => {
  const  {fav } = req.body;
  //_id shld be tagged to the logged in User
  const tenantID = req.params.id//"6262c905f7d19a73f07ede29"
  const update = await TestUsers.findByIdAndUpdate({_id:tenantID},{$addToSet: {favourites:fav}})

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
  const update = await TestUsers.findByIdAndUpdate({_id:tenantID},{ $pull: {favourites:fav}})


  if(update ===null){
    console.log('mongo search is null----pull')
  }
  
  res.json({ message: "Deleted from list" });

})

module.exports = router;