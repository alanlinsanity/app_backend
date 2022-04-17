import * as bcrypt from "bcrypt";

export function hash(stringToHash: string): string {
  const saltRounds = 10;
  return bcrypt.hashSync(stringToHash, saltRounds);
}

export function compare(plaintext: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plaintext, hashedPassword);
}

export function preSaveHashPWHook(next?: (error?: Error) => void) {
  if (!this.isModified("password")) return next();
  this.password = hash(this.password);
  next();
}
