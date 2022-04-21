const mongoose = require("mongoose");
const { Schema } = mongoose;

const TenantUserSchema = mongoose.Schema({
  // postal: { type: String, required: true },
  // district: { type: Number, required: true },
  // address: { type: String, required: true },
  // property_type: { type: String, required: true},
  // size: { type: Number, required: true },
  // price: { type: Number, required: true},
  // image: { type: String, required: true},
  // no_of_bedrooms: { type: Number, required: true},
  // no_of_bathrooms: { type: Number, required: true},
  // description: { type: String },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // password: {
  //   type: String,
  //   required: true,
  // },
  accountType: {
    type: String,
    // enum: accountTypes,
    required: true,
  },
  // listings: {
  //   type: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Listing",
  //     },
  //   ],
  // },
  favourites: [
    {type: String, required:true}
    ]
});

const TenantUser = mongoose.model("TenantUser", TenantUserSchema);

module.exports = TenantUser;

