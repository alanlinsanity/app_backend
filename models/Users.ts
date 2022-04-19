import * as mongoose from "mongoose";

import * as bcrypt from "bcrypt";

const accountTypes = ["admin", "lister", "owner", "agent", "renter"] as const;

interface IUser {
  username: string;
  password: string;
  accountType: typeof accountTypes[number];
  listings: mongoose.Types.ObjectId[];
  favourites: mongoose.Types.ObjectId[];
}

export function hash(stringToHash: string): string {
  const saltRounds = 10;
  return bcrypt.hashSync(stringToHash, saltRounds);
}

export function compare(plaintext: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plaintext, hashedPassword);
}

export function preSaveHashPWHook(next: () => void) {
  if (!this.isModified("password")) return next();
  this.password = hash(this.password);
  next();
}

const instanceMethods = {
  comparePassword: function (plaintext: string): boolean {
    return compare(plaintext, this.password);
  },
};

type UserModel = mongoose.Model<IUser, unknown, typeof instanceMethods>;

async function authenticateUser(
  this: UserModel,
  { username, password }: { username: string; password: string }
) {
  const user = await this.findOne({ username });
  if (!user) return;
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return;
  return user;
}

interface IUserModel
  extends mongoose.Model<
    IUser,
    unknown /* TQueryHelpers */,
    typeof instanceMethods /*, instanceVirtuals  */
  > {
  getAuthenticated: typeof authenticateUser;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
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
    enum: accountTypes,
    required: true,
  },
  listings: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

userSchema.methods = instanceMethods;

userSchema.pre("save", preSaveHashPWHook);

userSchema.statics.getAuthenticated = authenticateUser;

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
