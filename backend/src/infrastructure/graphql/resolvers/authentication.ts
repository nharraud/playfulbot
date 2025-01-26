import { promisify } from 'util';

import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import Cookies from 'cookies';
import express from 'express';
import { ApolloContext } from '~playfulbot/infrastructure/graphql/types/apolloTypes';
import { User } from '~playfulbot/core/entities/Users';

import {
  UserJWTokenData,
  JWToken,
} from '~playfulbot/types/token';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { InvalidRequest, AuthenticationError } from '~playfulbot/errors';
import { SECRET_KEY } from '~playfulbot/secret';

const randomBytes = promisify(crypto.randomBytes);

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
  apolloContext
) => {
  const foundUser = await apolloContext.ctx.providers.user.getUserByName(apolloContext.ctx, args.username, true);

  if (!foundUser) {
    throw new AuthenticationError(`Could not find account: ${args.username}`);
  }
  const match = await bcrypt.compare(args.password, foundUser.passwordHash?.toString('utf8'));

  if (!match) {
    throw new AuthenticationError('Incorrect credentials');
  }
  const token = await authenticate(foundUser, apolloContext.req);
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
