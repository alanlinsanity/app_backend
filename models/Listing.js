const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = mongoose.Schema({
  postal: { type: Number, required: true },
  district: { type: Number, required: true },
  address: { type: String, required: true },
  property_type: { type: String, required: true},
  likes: { type: Number, default: 0 },
  size: { type: Number, required: true },
  price: { type: Number, required: true},
  image: { type: String, required: true},
  no_of_bedrooms: { type: Number, required: true},
  no_of_bathrooms: { type: Number, required: true},
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

