export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  auth: {
    loginUrl: '/api/auth/login',
    registerUrl: '/api/auth/register',
    refreshTokenUrl: '/api/auth/refresh-token',
    checkEmailUrl: '/api/auth/check-email',
    checkUsernameUrl: '/api/auth/check-username'
  },
  users: {
    getAllUsers: '/api/users',
    getUserById: (id: number) => `/api/users/${id}`,
    getUserByUsername: (username: string) => `/api/users/username/${username}`,
    updateUser: (id: number) => `/api/users/${id}`,
    deleteUser: (id: number) => `/api/users/${id}`,
    changePassword: (id: number) => `/api/users/${id}/change-password`
  },
  posts: {
    base: '/api/posts',
    getAll: '/api/posts',
  },
  tags: {
    base: '/api/tags',
    getAll: '/api/tags',
  },
  categories: {
    base: '/api/category',
    getAll: '/api/category',
  }
};
