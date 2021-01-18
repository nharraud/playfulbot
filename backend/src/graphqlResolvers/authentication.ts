import { promisify } from 'util';

import crypto from 'crypto';
const randomBytes = promisify(crypto.randomBytes);

import jwt, { JsonWebTokenError } from 'jsonwebtoken';
const jwtVerifyAsync: any = promisify(jwt.verify);

import bcrypt from 'bcrypt';

import { AuthenticationError } from 'apollo-server-koa';

import { ApolloContext, User } from '~playfulbot/types/apolloTypes';
import { users } from '~playfulbot/Model/Users';

import { JWTokenData } from '~playfulbot/types/token';

const SECRET_KEY = 'secret!';

export async function loginResolver(parent: any, args: any, { koaContext }: ApolloContext) {
  const foundUser = users.find((user) => user.name === args.username);

  if (!foundUser) {
    return new AuthenticationError(`Could not find account: ${args.username}`);
  }
  const match = await bcrypt.compare(args.password, foundUser.password);

  if (!match) {
    return new AuthenticationError('Incorrect credentials');
  }

  const binFingerprint = await randomBytes(50);
  const strFingerprint = binFingerprint.toString('base64');

  const hash = crypto.createHash('sha256');
  hash.update(strFingerprint);
  const fingerprintHash = hash.digest('hex');
  hash.end();

  const token = jwt.sign({ user: foundUser.id, JWTFingerprint: fingerprintHash }, SECRET_KEY);
  koaContext.cookies.set('JWTFingerprint', strFingerprint);
  return {
    token: token.toString(),
    user: {
      id: foundUser.id,
      username: foundUser.name,
    },
  };
}

export async function logoutResolver(
  parent: any,
  args: any,
  { koaContext, userID }: ApolloContext
) {
  console.log(userID);
  koaContext.cookies.set('JWTFingerprint');
  return true;
}

export async function validateAuthToken(token: string, fingerprint?: string): Promise<JWTokenData> {
  try {
    const tokenData: JWTokenData = await jwtVerifyAsync(token, SECRET_KEY);

    if (tokenData.JWTFingerprint) {
      if (!fingerprint) {
        throw new AuthenticationError('Invalid authorization token: missing fingerprint.');
      }
      const hash = crypto.createHash('sha256');
      hash.update(fingerprint);
      const fingerprintHash = hash.digest('hex');
      hash.end();

      if (fingerprintHash !== tokenData.JWTFingerprint) {
        throw new AuthenticationError("Invalid authorization token: fingerprint doesn't match");
      }
    }

    return tokenData;
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw new AuthenticationError('Invalid authorization token: token validation failed.');
    }
    throw e;
  }
}

export async function createPlayerToken(userID: string, playerNumber: number, gameID: string) {
  return jwt.sign({ user: userID, game: gameID, playerNumber: playerNumber }, SECRET_KEY);
}
