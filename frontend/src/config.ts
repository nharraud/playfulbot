export const config = {
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL
}

if (!config.FRONTEND_URL) {
  throw new Error('Missing env variable "FRONTEND_URL"');
}