export const serverConfig = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost',
  GRAPHQL_HOST: process.env.GRAPHQL_HOST || 'localhost',
  GRAPHQL_PORT: process.env.GRAPHQL_PORT ? parseInt(process.env.GRAPHQL_PORT, 10) : 4001,
  GRPC_HOST: process.env.GRPC_HOST || 'localhost',
  GRPC_PORT: process.env.GRPC_PORT ? parseInt(process.env.GRPC_PORT, 10) : 5000,
  EXPOSED_GRAPHQL_URL: process.env.EXPOSED_GRAPHQL_URL,
  EXPOSED_GRPC_URL: process.env.EXPOSED_GRPC_URL,
};
