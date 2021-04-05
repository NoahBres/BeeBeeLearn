import { genSalt, hash, compare } from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPass(pass: string) {
  return new Promise<string>(async (res, rej) => {
    try {
      const salt = await genSalt(SALT_ROUNDS);
      const hashed = await hash(pass, salt);

      res(hashed);
    } catch (e) {
      rej(e);
    }
  });
}

export async function comparePass(pass: string, hashedPass: string) {
  return new Promise<boolean>(async (res, rej) => {
    try {
      res(await compare(pass, hashedPass));
    } catch (e) {
      rej(e);
    }
  });
}
