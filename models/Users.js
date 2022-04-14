const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");
const rounds = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["admin", "lister", "renter"],
    required: true,
  },
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, rounds, function (err, hash) {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

const User = model("User", userSchema);

module.exports = User;
