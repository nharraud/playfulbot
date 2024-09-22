import { promisify } from 'util';

import crypto from 'crypto';

import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import Cookies from 'cookies';
import express from 'express';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { User } from '~playfulbot/core/entities/Users';

import {
  JWTokenData,
  isUserJWToken,
  isBotJWToken,
  UserJWTokenData,
  JWToken,
} from '~playfulbot/types/token';
import * as gqlTypes from '~playfulbot/types/graphql';
import { InvalidRequest, AuthenticationError } from '~playfulbot/errors';
import { PlayerID } from '~playfulbot/core/entities/Players';
import { SECRET_KEY } from '~playfulbot/secret';

const randomBytes = promisify(crypto.randomBytes);
const jwtVerifyAsync = promisify<string, string, unknown>(jwt.verify);

export async function authenticate(user: User, req: express.Request): Promise<JWToken> {
  const binFingerprint = await randomBytes(50);
  const strFingerprint = binFingerprint.toString('base64');

  const hash = crypto.createHash('sha256');
  hash.update(strFingerprint);
  const fingerprintHash = hash.digest('hex');
  hash.end();

  const tokenData: UserJWTokenData = { userID: user.id, JWTFingerprint: fingerprintHash };

  const token = jwt.sign(tokenData, SECRET_KEY);

  const cookies = new Cookies(req, req.res);
  cookies.set('JWTFingerprint', strFingerprint);
  return token;
}

export const loginResolver: gqlTypes.MutationResolvers<ApolloContext>['login'] = async (
  parent,
  args,
  ctx
) => {
  const foundUser = await ctx.userProviddder.getUserByName(ctx, args.username);

  if (!foundUser) {
    throw new AuthenticationError(`Could not find account: ${args.username}`);
  }
  const match = await bcrypt.compare(args.password, foundUser.passwordHash?.toString('utf8'));

  if (!match) {
    throw new AuthenticationError('Incorrect credentials');
  }
  const token = await authenticate(foundUser, ctx.req);
  return {
    token,
    user: {
      id: foundUser.id,
      username: foundUser.username,
    },
  };
};

export const logoutResolver: gqlTypes.MutationResolvers<ApolloContext>['logout'] = (
  parent,
  args,
  ctx
) => {
  if (ctx.req === undefined || ctx.req.res === undefined) {
    throw new InvalidRequest('Logout needs to be done via an HTTPS request, not via a websocket.');
  }

  const cookies = new Cookies(ctx.req, ctx.req.res);
  cookies.set('JWTFingerprint');
  return true;
};

export async function validateAuthToken(token: string, fingerprint?: string): Promise<JWTokenData> {
  try {
    const tokenData: JWTokenData = (await jwtVerifyAsync(token, SECRET_KEY)) as JWTokenData;

    if (isUserJWToken(tokenData)) {
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
    } else if (isBotJWToken(tokenData) && tokenData.playerID === undefined) {
      throw new AuthenticationError('Invalid authorization token: token validation failed.');
    }

    return tokenData;
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw new AuthenticationError('Invalid authorization token: token validation failed.');
    }
    throw e;
  }
}

export function createPlayerToken(playerID: PlayerID): string {
  return jwt.sign({ playerID }, SECRET_KEY);
}
