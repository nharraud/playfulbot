import crypto from 'crypto';

export const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Check that the environment variable SECRET_KEY is set.
 */
export function validateSecretKey(): void {
  if (!SECRET_KEY) {
    throw new Error('Missing SECRET_KEY env variable');
  }
}

/**
 * Generate a securet secret key and returns it.
 */
export function generateSecretKey(): string {
  const buf = Buffer.alloc(256);
  return crypto.randomFillSync(buf).toString('base64');
}
