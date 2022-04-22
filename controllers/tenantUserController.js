
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


// //* Delete Route
// router.delete("/:id", async (req, res) => {
//   await Listing.findByIdAndRemove(req.params.id);
//   res.json({ message: "Listing Deleted" });
// });

// router.get('/:id', (req, res) => {
//   Listing.find({_id: req.params.id})
//     .then(listing => {
//       res.json(listing)
//     })
//     .catch(err => {
//       res.json(err)
//     })
// })

// //*Put route
// router.put("/:id", async (req, res) => {
//   await Listing.findByIdAndUpdate({_id:req.params.id}, req.body);
//   res.json({ message: "Listing Updated" });
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

//*Put route
// router.put("/:id", async (req, res) => {
//   await TenantWatchList.findByIdAndUpdate({_id:req.params.id}, req.body);
//   res.json({ message: "Listing Updated" });
// });


// router.put("/:id", async (req, res) => {
//   await TenantWatchList.findByIdAndUpdate({_id:"625ea35742bc0937b5cf24b9"}, req.body);
//   console.log(req.body)
//   res.json({ message: "Listing Updated" });
// });

// router.put("/:id", async (req, res) => {
//   await TenantWatchList.findByIdAndUpdate({_id:"625ea35742bc0937b5cf24b9"}, req.body);
//   console.log(req.body)
//   res.json({ message: "Listing Updated" });
// });

router.put("/:id", async (req, res) => {
  const  {fav } = req.body;
  //_id shld be tagged to the logged in User
  const tenantID = "626256bdbd0702716c26976c"
  // const update = await TenantUser.findByIdAndUpdate({_id:tenantID},{$push: {favourites:fav}})
  const update = await TenantUser.findByIdAndUpdate({_id:tenantID},{$addToSet: {favourites:fav}})

  if(update ===null){
    console.log('mongo search is null')
  }//else //update.favourites =fav
  
  console.log('update',update)
  await update.save()
})

module.exports = router;