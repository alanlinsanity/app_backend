
const express = require('express');
const Listing = require("../models/Listing")
const router = express.Router();

router.get("/seed", async (req, res) => {

  const listings = [
    {
      postal: 128017,
      district: 5,
      address: "91 West Coast Drive",
      likes: 5,
      size: 900,
      price: 3500,
      image: "https://www.urbanjourney.com/wp-content/uploads/2019/05/Screen-Shot-2019-05-20-at-3.11.48-PM.png"
    },
    {
      postal: 750335,
      district: 27,
      address: "335 Sembawang Close",
      likes: 3,
      size: 1100,
      price: 3200,
      image: "https://www.asiaone.com/sites/default/files/original_images/Sep2019/230919_hmlet8.jpg"
    }
  ]
  await Listing.deleteMany({});
  await Listing.insertMany(listings)
  res.json(listings)
})

//* Index Route
router.get('/', (req, res) => {
  Listing.find()
    .then(listings => {
      res.json(listings)
    })
    .catch(err => {
      res.json(err)
    })
})

//* Create Route
router.post("/", async (req, res) => {
  console.log("body", req.body)
  try {
    const createdListing = await Listing.create(req.body);
    res.status(200).send(createdListing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
});

//* Delete Route
router.delete("/:id", async (req, res) => {
  await Listing.findByIdAndRemove(req.params.id);
  res.json({ message: "Listing Deleted" });
});

//*Put route
router.put("/:id", async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Listing Updated" });
});

module.exports = router;