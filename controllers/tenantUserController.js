
const express = require('express');
const TenantUser = require("../models/TenantUser")
const router = express.Router();

////("/api/tenant", TenantController);

//* Index Route
// router.get("/", (req, res) => {
//   res.send('you are at tenant space')
//     .catch((err) => {
//       res.json(err);
//     });
// });

////Seed Tenant Listings
router.get("/seed", async (req, res) => {

  const tenantUsers = [
    { 
      username: "tenant-1",
      accountType: "renter",
      favourites : []    //[] lags
    },
    { 
      username: "tenant-2",
      accountType: "renter",
      favourites : []
    },
    { 
      username: "tenant-3",
      accountType: "renter",
      favourites : []
    },
 
  ];
  await TenantUser.deleteMany({});
  await TenantUser.insertMany(tenantUsers);
  res.json(tenantUsers);
});

//* Index Route
router.get("/", (req, res) => {
  TenantUser.find()
    .then((listings) => {
      res.json(listings);
    })
    .catch((err) => {
      res.json(err);
    });
    
});

//* Create Route
router.post("/", async (req, res) => {
  try {
    const createdListing = await TenantUser.create(req.body);
    res.status(200).send(createdListing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const  {fav } = req.body;
  //_id shld be tagged to the logged in User
  const tenantID = req.params.id//"6262c905f7d19a73f07ede29"
  const update = await TenantUser.findByIdAndUpdate({_id:tenantID},{$addToSet: {favourites:fav}})

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
  const update = await TenantUser.findByIdAndUpdate({_id:tenantID},{ $pull: {favourites:fav}})


  if(update ===null){
    console.log('mongo search is null----pull')
  }
  
  res.json({ message: "Deleted from list" });

})

module.exports = router;