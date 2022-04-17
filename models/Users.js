const { Schema, model } = require("mongoose");
const { compare, preSaveHashPWHook } = require("../modules/auth");

const maxLoginAttempts = 5;
const lockTime = 2 * 60 * 60 * 1000;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // set: hashPass,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["admin", "lister", "owner", "agent", "renter"],
    required: true,
  },
  listings: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: Number,
});

userSchema.methods.comparePassword = function (password) {
  compare(password, this.password);
};

userSchema.pre("save", preSaveHashPWHook);

const reasons = (userSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2,
});

/* userSchema.methods.incLoginAttempts = function () {
  // if user is locked and timer expired
  if (this.lockUntil && this.lockUntil < Date.now() / 1000) {
    // reset lock
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = {
    $inc: { loginAttempts: 1 },
  };
  if (this.loginAttempts + 1 >= maxLoginAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() / 1000 + lockTime };
  }
  return this.update(updates);
};

userSchema.virtual("isLocked").get(function () {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});
userSchema.statics.getAuthenticated = async function ({ username, password }) {
  const user = await this.findOne({ username });
  let reason;
  if (!user) return undefined;

  if (user.isLocked) {
    reason = reasons.MAX_ATTEMPTS;
    user.incLoginAttempts();
    throw new Error("User is locked");
  }

  const isMatch = await user.comparePassword(password);
  if (isMatch) {
    if (!user.loginAttempts && !user.lockUntil) return user;
    await user.update({
      $set: { loginAttempts: 0 },
      $unset: { lockUntil: 1 },
    });
    return user;
  }

  reason = reasons.PASSWORD_INCORRECT;
  user.incLoginAttempts();
}; */

const User = model("User", userSchema);

module.exports = User;
