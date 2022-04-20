
const express = require('express');
const TenantWatchList = require("../models/TenantWatchlist")
const router = express.Router();

////("/api/tenant", TenantController);

//* Index Route
router.get("/", (req, res) => {
  res.send('you are at tenant space')
    .catch((err) => {
      res.json(err);
    });
});


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

  const tenantlistings = [
    { 
      id:3,
      postal: "128017",
      district: 5,
      address: "91 West Coast Drive",
      property_type: "Private",
      size: 900,
      price: 3500,
      image: "https://www.urbanjourney.com/wp-content/uploads/2019/05/Screen-Shot-2019-05-20-at-3.11.48-PM.png",
      no_of_bedrooms: 3,
      no_of_bathrooms: 2,
      description: "This is a well-furnished condominium called Hundred Trees that is just 500m away from Clementi MRT. Nearby amenities include Ayer Rajah Food Centre.",
      likes:0,
      favourites : " "
    },
    { 
      id:2,
      postal: "750335",
      district: 27,
      address: "335 Sembawang Close",
      property_type: "HDB",
      size: 1100,
      price: 3200,
      image:
        "https://www.asiaone.com/sites/default/files/original_images/Sep2019/230919_hmlet8.jpg",
      no_of_bedrooms: 3,
      no_of_bathrooms: 2,
      description: "HDB that is just 500m away from Sembawang MRT. Close to market and eateries. Sun Plaza and Sembawang Shopping Centre are just within 10 minutes commute away.",
      favourites : []
    },
    {   
        id:1,
        postal: "099786",
        district: 4,
        address: "14 Bukit Teresa Close",
        property_type: "Private",
        size: 2000,
        price: 4500,
        image: "https://www.99.co/singapore/insider/wp-content/uploads/2021/07/DSC_3450-min-e1626319307277.jpg",
        no_of_bedrooms: 4,
        no_of_bathrooms: 3,
        description: "This is a Private development that is close to the city. 5 minutes walk to bus-stop. Nearest MRT is Harbourfront Interchange.",
        likes:0,
        favourites : []
      },
      { 
        id:4,
        postal: "670471",
        district: 23,
        address: "471 Segar Road",
        property_type: "HDB",
        size: 900,
        price: 2900,
        image: "https://wp.homees.co/wp-content/uploads/2021/02/Blk-128-Geylang-East-Ave-1-5-Room-HDB-Resale-Living-Room-6.jpeg",
        no_of_bedrooms: 3,
        no_of_bathrooms: 2,
        description: "This is a well-furnished HDB that is just 500m away from Segar LRT. The nearest MRT is Bukit Panjang MRT where you can change to the Downtown Line.",
        likes:0,
        favourites : []
      },
      {
        id:5,
        postal: "807065",
        district: 28,
        address: "50 Seletar Hills Drive",
        property_type: "Private",
        size: 2500,
        price: 5000,
        image: "https://www.reztnrelax.com/wp-content/uploads/2021/01/glasgow-landed-house-reno-singapore-interior-design-8-1024x683.jpg",
        no_of_bedrooms: 4,
        no_of_bathrooms: 3,
        description: "This is a well-furnished Private Landed that is located in the Seletar Hills Estate. Greenwich V is an easily accessible mall for your daily groceries and f&b needs. Comes with 2 parking lots.",
        likes:0,
        favourites : []
      },
      {
        id:6,
        postal: "459106",
        district: 15,
        address: "903 East Coast Rd",
        property_type: "Private",
        size: 1800,
        price: 4500,
        image: "https://d1hy6t2xeg0mdl.cloudfront.net/image/25695/14a6fcd98c/standard",
        no_of_bedrooms: 4,
        no_of_bathrooms: 3,
        description: "This is a recently renovated Shophouse that is located just beside Siglap V Shopping Centre. Tenants are able to enjoy a myriad of lifestyle choices ranging from european bars & bistros to local delights.",
        likes:0,
        favourites : []
      },
  ];
  await TenantWatchList.deleteMany({});
  await TenantWatchList.insertMany(tenantlistings);
  res.json(tenantlistings);
});

//* Index Route
router.get("/listings", (req, res) => {
  TenantWatchList.find()
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
    const createdListing = await TenantWatchList.create(req.body);
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
  // const update = await TenantWatchList.findById({_id:"625ee3e32c4ae8a2064d299a"});
  // console.log('fav',fav)
  // console.log('update',update)
  // console.log('update.favourites',update.favourites)

  const update = await TenantWatchList.findByIdAndUpdate({_id:"625fd83e6a127679766fc98f"},{$push: {favourites:fav}})
  
  if(update ===null){
    console.log('mongo search is null')
  }//else //update.favourites =fav
  
  console.log('update',update)
  await update.save()
})

module.exports = router;