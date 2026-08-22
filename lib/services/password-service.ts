import { compare, hash } from "bcryptjs";

const HASH_ROUNDS = 12;

export function hashPassword(password: string) {
  return hash(password, HASH_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}
