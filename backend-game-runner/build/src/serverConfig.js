export const serverConfig = {
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost',
    BACKEND_HOST: process.env.BACKEND_HOST || 'localhost',
    GRAPHQL_PORT: process.env.GRAPHQL_PORT ? parseInt(process.env.GRAPHQL_PORT, 10) : 4001,
};
//# sourceMappingURL=serverConfig.js.map