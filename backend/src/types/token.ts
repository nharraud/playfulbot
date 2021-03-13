import { GameScheduleID, PlayerID, UserID } from './database';

export type JWToken = string;

export type UserJWTokenData = {
  userID: UserID;
  JWTFingerprint: string;
};

export type BotJWTokenData = {
  playerID: PlayerID;
  gameScheduleID: GameScheduleID;
  foo: number;
};

export type JWTokenData = UserJWTokenData | BotJWTokenData;

export function isUserJWToken(token: JWTokenData): token is UserJWTokenData {
  return (token as UserJWTokenData).JWTFingerprint !== undefined;
}

export function isBotJWToken(token: JWTokenData): token is BotJWTokenData {
  return (token as BotJWTokenData).gameScheduleID !== undefined;
}
