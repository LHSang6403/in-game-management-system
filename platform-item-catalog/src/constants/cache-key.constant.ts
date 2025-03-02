export const CacheKey = {
  ITEM_TYPES: {
    ALL: 'itemtype:*',
    LIST: 'itemtype:list',
    BY_ID: (id: number) => `itemtype:${id}`,
  },
  ITEMS: {
    ALL: 'item:*',
    LIST: 'item:list',
    BY_ID: (id: number) => `item:${id}`,
  },
};
