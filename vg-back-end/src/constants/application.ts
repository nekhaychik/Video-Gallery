const basePath: string = '/';

export default {
  url: {
    basePath,
  },
  timers: {
    userCookieExpiry: '720h',
  },
  env: {
    authSecret: process.env.TOKEN_SECRET_KEY,
  },
  authorizationIgnorePath: [
    '/',
    '/auth/login',
    '/auth/register',
  ],
};
