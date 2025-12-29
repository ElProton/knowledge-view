export const endpoints = {
  documents: {
    list: '/documents',
    get: (id: string) => `/documents/${id}`,
    update: (id: string) => `/documents/${id}`,
  },
};
