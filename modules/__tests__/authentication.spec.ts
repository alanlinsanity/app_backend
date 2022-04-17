import { hash, compare, preSaveHashPWHook } from "../src/authentication";

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

describe("presave hook", () => {
  const password = "password";
  let user;
  beforeEach(() => {
    user = {
      username: "username",
      password: password,
      isModified: jest.fn(),
      presaveHook: jest.fn(),
    };
  });
  afterEach(() => {
    user.isModified.mockClear();
    user.presaveHook.mockClear();
  });

  it("hashes the password", () => {
    user.isModified.mockReturnValue(true);
    user.presaveHook.mockImplementation(preSaveHashPWHook.bind(user));
    user.presaveHook(jest.fn);
    expect(user.password).not.toBe(password);
  });

  it("does not hash the password if it is not modified", () => {
    user.isModified.mockReturnValue(false);
    expect(user.presaveHook).not.toHaveBeenCalled();
    expect(user.password).toBe(password);
  });
});
