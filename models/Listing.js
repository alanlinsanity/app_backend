const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = mongoose.Schema({
  postal: { type: String, required: true },
  district: { type: Number, required: true },
  address: { type: String, required: true },
  property_type: { type: String, required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  no_of_bedrooms: { type: Number, required: true },
  no_of_bathrooms: { type: Number, required: true },
  description: { type: String },
  lister: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
