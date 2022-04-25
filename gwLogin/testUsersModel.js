
const mongoose = require("mongoose");
const { Schema } = mongoose;


const TestUsersSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: { type: String, required: true},

  accountType: {
    type: String,
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

const TestUsers = mongoose.model("TestUser", TestUsersSchema);

module.exports = TestUsers;

