export const CacheKey = {
  ORGS: {
    ALL: 'org:*',
    BY_ID: (id: number) => `org:${id}`,
    LIST: 'org:list',
  },
  USERS: {
    ALL: 'user:*',
    BY_ID: (id: number) => `user:${id}`,
    LIST: 'user:list',
  },
};
