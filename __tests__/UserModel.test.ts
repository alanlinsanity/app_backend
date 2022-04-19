import { hash, compare, preSaveHashPWHook, authUser } from "../models/Users";

describe("password hashing and comparing", () => {
  describe("hashing function", () => {
    const password = "password";
    it("returns a string of length 60", () => {
      expect(hash(password)).toHaveLength(60);
    });
    it("output is not equal to the input", () => {
      expect(hash(password)).not.toBe(password);
    });
  });

  describe("comparing function", () => {
    const password = "password";
    const hashedPassword = hash(password);
    it("returns true when the password matches the hashed password", () => {
      expect(compare(password, hashedPassword)).toBe(true);
    });
    it("returns false when the password does not match the hashed password", () => {
      expect(compare("wrong password", hashedPassword)).toBe(false);
    });
  });
});

describe("presavehook", () => {
  const pw = "password";
  const thisContext = {
    username: "username",
    password: pw,
    isModified: jest.fn(),
  };
  const mockNext = jest.fn();

  it("immediately returns next when password is not modified", () => {
    thisContext.isModified.mockReturnValueOnce(false);
    preSaveHashPWHook.call(thisContext, mockNext);
    expect(thisContext.isModified).toHaveBeenCalled();
    expect(thisContext.password).toBe(pw);
  });

  it("hashes the password", () => {
    thisContext.isModified.mockReturnValueOnce(true);
    preSaveHashPWHook.call(thisContext, mockNext);
    expect(thisContext.password).not.toBe(pw);
  });
});

describe("authUser instance method", () => {
  const user = {
    username: "username",
    password: "password",
    accountType: "admin",
    comparePassword: jest.fn(),
  };
  const userModel = {
    findOne: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns undefined when user is not found", async () => {
    userModel.findOne.mockResolvedValueOnce(null);
    expect(user.comparePassword).not.toHaveBeenCalled();
    const result = await authUser.call(userModel, user);
    expect(result).toBeUndefined();
  });

  it("returns undefined when password does not match", async () => {
    userModel.findOne.mockReturnValueOnce(user);
    user.comparePassword.mockResolvedValueOnce(false);
    const result = await authUser.call(userModel, {
      ...user,
      password: "wrong password",
    });
    expect(result).toBeUndefined();
  });

  it("returns user when password matches", async () => {
    userModel.findOne.mockReturnValueOnce(user);
    user.comparePassword.mockResolvedValueOnce(true);
    const result = await authUser.call(userModel, user);
    expect(result).toBe(user);
  });
});

//   export async function authUser(this, { username, password }) {
//     const user = await this.findOne({ username });
//     if (!user) return;
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return;
//     return user;
//   }
