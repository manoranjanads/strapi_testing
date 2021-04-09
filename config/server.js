module.exports = ({ env }) => ({
  host: env('API_HOST'),
  port: env.int('API_PORT'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '0c1039937a9d158c421686c6f5dcb83a'),
    },
  },
});
