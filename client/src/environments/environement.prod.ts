
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  auth: {
    loginUrl: '/api/auth/login',
    registerUrl: '/api/auth/register',
    refreshTokenUrl: '/api/auth/refresh-token',
    checkEmailUrl: '/api/auth/check-email',
    checkUsernameUrl: '/api/auth/check-username'
  }
};
