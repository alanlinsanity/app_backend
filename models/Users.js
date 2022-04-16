const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const dbga = require("debug")("app:auth");

const hashPass = (input) => {
  const salt = bcrypt.genSaltSync(rounds);
  const hash = bcrypt.hashSync(input, salt);
  return hash;
};

const rounds = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    set: hashPass,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["admin", "lister", "owner", "agent", "renter"],
    required: true,
  },
  listings: {
    required: false,
  },
});

// userSchema.methods.comparePassword = function (password, cb) {
//   dbga("this", this);
//   bcrypt.compare(password, this.password, (err, isMatch) => {
//     if (err) return cb(err);
//     cb(undefined, isMatch);
//   });
// };

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// userSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = bcrypt.genSaltSync(rounds);
//   bcrypt.hash(this.password, salt, (err, hash) => {
//     if (err) return next(err);
//     this.password = hash;
//     next();
//   });
// });

const User = model("User", userSchema);

module.exports = User;
