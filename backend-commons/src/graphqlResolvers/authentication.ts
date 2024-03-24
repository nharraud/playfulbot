import { promisify } from 'util';

import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import { JWTokenData, isUserJWToken, isBotJWToken } from '~playfulbot-commons/types/token.js';
import { PlayerID } from '~playfulbot-commons/model/Player.js';
import { SECRET_KEY } from '~playfulbot-commons/secret.js';
const JsonWebTokenError = jwt.JsonWebTokenError;
const jwtVerifyAsync = promisify<string, string, unknown>(jwt.verify);

export async function validateAuthToken(token: string, fingerprint?: string): Promise<JWTokenData> {
  try {
    const tokenData: JWTokenData = (await jwtVerifyAsync(token, SECRET_KEY)) as JWTokenData;

    if (isUserJWToken(tokenData)) {
      if (!fingerprint) {
        throw new Error('Invalid authorization token: missing fingerprint.');
      }
      const hash = crypto.createHash('sha256');
      hash.update(fingerprint);
      const fingerprintHash = hash.digest('hex');
      hash.end();

      if (fingerprintHash !== tokenData.JWTFingerprint) {
        throw new Error("Invalid authorization token: fingerprint doesn't match");
      }
    } else if (isBotJWToken(tokenData) && tokenData.playerID === undefined) {
      throw new Error('Invalid authorization token: token validation failed.');
    }

    return tokenData;
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw new Error('Invalid authorization token: token validation failed.');
    }
    throw e;
  }
}

export function createPlayerToken(playerID: PlayerID): string {
  return jwt.sign({ playerID }, SECRET_KEY);
}
