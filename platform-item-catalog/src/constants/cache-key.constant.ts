export const CacheKey = {
  ITEM_TYPES: {
    ALL: 'itemtypes:*',
    LIST: 'itemtypes:list',
    BY_ID: (id: number) => `itemtypes:${id}`,
  },
  ITEMS: {
    ALL: 'items:*',
    LIST: 'items:list',
    BY_ID: (id: number) => `items:${id}`,
  },
};
