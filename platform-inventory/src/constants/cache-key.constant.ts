export const CacheKey = {
  INVENTORY: {
    ALL: 'inventory:*',
    BY_ID: (id: number) => `inventory:${id}`,
    LIST: 'inventory:list',
  },
};
