import { promisify } from 'util';

import crypto from 'crypto';
const randomBytes = promisify(crypto.randomBytes);


import jwt, { JsonWebTokenError } from 'jsonwebtoken';
const jwtVerifyAsync = promisify(jwt.verify);

import bcrypt from 'bcrypt';

import { AuthenticationError } from 'apollo-server-koa';


import { ApolloContext } from '~team_builder/types/apolloTypes';
import { users } from '~team_builder/Model/Users';



const SECRET_KEY = 'secret!'

export async function loginResolver(parent: any, args: any, { koaContext }: ApolloContext) {
  const foundUser = users.find(user => user.name === args.username);

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

  const token = jwt.sign(
    { user: foundUser.id, JWTFingerprint: fingerprintHash },
    SECRET_KEY,
  )
  koaContext.cookies.set('JWTFingerprint', strFingerprint);
  return {
    token: token.toString(),
    user: {
      id: foundUser.id,
      username: foundUser.name
    }
  };
}


export async function logoutResolver(parent: any, args: any, { koaContext, user }: ApolloContext) {
  console.log(user)
  koaContext.cookies.set('JWTFingerprint');
  return true;
}


export async function validateAuthToken(token: string, fingerprint: string) {
  try {
    const tokenData: any = await jwtVerifyAsync(token, SECRET_KEY);

    const strFingerprint = fingerprint
    if (!fingerprint) {
      throw new AuthenticationError('Invalid authorization token: missing fingerprint.');
    }
    const hash = crypto.createHash('sha256');
    hash.update(fingerprint);
    const fingerprintHash = hash.digest('hex');
    hash.end();

    if (fingerprintHash !== tokenData.JWTFingerprint) {
      throw new AuthenticationError('Invalid authorization token: fingerprint doesn\'t match');
    }

    return tokenData;
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw new AuthenticationError(
        'Invalid authorization token: token validation failed.',
      )
    }
    throw e;
  }
}