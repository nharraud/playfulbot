import { expectString } from "./Validation";

export type UserID = string;

export interface User {
  id: UserID;
  username: string;
  passwordHash?: Buffer;
}

export function validateUserName(username: string) {
  return expectString(username, { min: 3, max: 15 });
}