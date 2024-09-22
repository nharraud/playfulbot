export type UserID = string;

export interface User {
  id: UserID;
  username: string;
  passwordHash?: Buffer;
}
