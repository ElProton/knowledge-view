export const endpoints = {
  health: '/health',
  documents: {
    list: '/documents',
    create: '/documents',
    get: (id: string) => `/documents/${id}`,
    update: (id: string) => `/documents/${id}`,
    delete: (id: string) => `/documents/${id}`,
    uploadBook: '/documents/upload-book',
  },
  schemas: {
    get: (type: string) => `/schemas/${type}`,
  },
};
