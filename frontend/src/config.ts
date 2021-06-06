export const config = {
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL
}

if (!config.FRONTEND_URL) {
  throw new Error('Missing env variable "FRONTEND_URL"');
}