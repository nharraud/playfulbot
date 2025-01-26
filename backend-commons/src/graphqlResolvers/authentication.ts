import { promisify } from 'util';

import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import { JWTokenData, isUserJWToken, isBotJWToken } from '~playfulbot-commons/types/token.js';
import { PlayerID } from '~playfulbot-commons/model/Player.js';
import { SECRET_KEY } from '~playfulbot-commons/secret.js';

const JsonWebTokenError = jwt.JsonWebTokenError;
const jwtVerifyAsync = promisify<string, string, unknown>(jwt.verify);

export class AuthTokenValidationError extends Error {};

export async function validateAuthToken(token: string, fingerprint?: string): Promise<JWTokenData> {
  if (!token) {
    throw new AuthTokenValidationError('Missing authorization token.');
  }
  let tokenData: JWTokenData;
  try {
    tokenData = (await jwtVerifyAsync(token, SECRET_KEY)) as JWTokenData;
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      throw new AuthTokenValidationError('Invalid authorization token: token validation failed.');
    }
    throw new AuthTokenValidationError('Unexpected error while validating auth token', { cause: err });
  }

  if (isUserJWToken(tokenData)) {
    if (!fingerprint) {
      throw new AuthTokenValidationError('Invalid authorization token: missing fingerprint.');
    }

    let fingerprintHash;
    try {
      const hash = crypto.createHash('sha256');
      hash.update(fingerprint);
      fingerprintHash = hash.digest('hex');
      hash.end();
    } catch (err) {
      throw new AuthTokenValidationError('Unexpected error while hashing fingerprint', { cause: err });
    }

    if (fingerprintHash !== tokenData.JWTFingerprint) {
      throw new AuthTokenValidationError("Invalid authorization token: fingerprint doesn't match");
    }
  } else if (isBotJWToken(tokenData) && tokenData.playerID === undefined) {
    throw new AuthTokenValidationError('Invalid authorization token: token validation failed.');
  }

  return tokenData;
}

export function createPlayerToken(playerID: PlayerID): string {
  return jwt.sign({ playerID }, SECRET_KEY);
}
