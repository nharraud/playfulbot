export const config = {
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_ADMIN_USER: process.env.DATABASE_ADMIN_USER,
  DATABASE_ADMIN_PASSWORD: process.env.DATABASE_ADMIN_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
};