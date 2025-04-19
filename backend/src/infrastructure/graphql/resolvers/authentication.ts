import { promisify } from 'util';

import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import express from 'express';
import { ApolloContext } from '~playfulbot/infrastructure/graphql/types/apolloTypes';
import { User } from '~playfulbot/core/entities/Users';

import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { AuthenticationError } from '~playfulbot/errors';
import { SECRET_KEY } from '~playfulbot/secret';
import { JWToken, UserJWTokenData } from 'playfulbot-backend-commons/lib/types/token';

const randomBytes = promisify(crypto.randomBytes);

export async function authenticate(user: User): Promise<{ token: JWToken, fingerprint: string }> {
  const binFingerprint = await randomBytes(50);
  const strFingerprint = binFingerprint.toString('base64');

  const hash = crypto.createHash('sha256');
  hash.update(strFingerprint);
  const fingerprintHash = hash.digest('hex');
  hash.end();

  const tokenData: UserJWTokenData = { userID: user.id, JWTFingerprint: fingerprintHash };

  const token = jwt.sign(tokenData, SECRET_KEY);

  return { token, fingerprint: strFingerprint };
}

export const loginResolver: gqlTypes.MutationResolvers<ApolloContext>['login'] = async function loginResolver(
  parent,
  args,
  apolloContext
) {
  const foundUser = await apolloContext.ctx.providers.user.getUserByName(apolloContext.ctx, args.username, true);

  if (!foundUser) {
    throw new AuthenticationError(`Could not find account: ${args.username}`);
  }
  const match = await bcrypt.compare(args.password, foundUser.passwordHash?.toString('utf8'));

  if (!match) {
    throw new AuthenticationError('Incorrect credentials');
  }
  const { token, fingerprint } = await authenticate(foundUser);
  apolloContext.ctx.fingerprint = fingerprint;

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
  apolloContext
) => {
  apolloContext.ctx.fingerprint = null;
  return true;
};
