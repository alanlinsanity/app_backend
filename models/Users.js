"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.authenticateUser = exports.preSaveHashPWHook = exports.compare = exports.hash = void 0;
const mongoose = __importStar(require("mongoose"));
const bcrypt = __importStar(require("bcrypt"));
const accountTypes = ["admin", "lister", "owner", "agent", "renter"];
function hash(stringToHash) {
    const saltRounds = 10;
    return bcrypt.hashSync(stringToHash, saltRounds);
}
exports.hash = hash;
function compare(plaintext, hashedPassword) {
    return bcrypt.compareSync(plaintext, hashedPassword);
}
exports.compare = compare;
function preSaveHashPWHook(next) {
    if (!this.isModified("password"))
        return next();
    this.password = hash(this.password);
    next();
}
exports.preSaveHashPWHook = preSaveHashPWHook;
const instanceMethods = {
    comparePassword: function (plaintext) {
        return compare(plaintext, this.password);
    },
};
function authenticateUser({ username, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ username });
        if (!user)
            return;
        const isMatch = yield user.comparePassword(password);
        if (!isMatch)
            return;
        return user;
    });
}
exports.authenticateUser = authenticateUser;
const userSchema = new mongoose.Schema({
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
const User = mongoose.model("User", userSchema);
exports.User = User;
