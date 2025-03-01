export const CacheKey = {
  ORGS: {
    ALL: 'orgs:*',
    BY_ID: (id: number) => `orgs:${id}`,
    LIST: 'orgs:list',
  },
  USERS: {
    ALL: 'users:*',
    BY_ID: (id: number) => `users:${id}`,
    LIST: 'users:list',
  },
};
