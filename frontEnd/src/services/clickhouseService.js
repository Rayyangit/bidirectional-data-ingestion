import api from '@/services/api'; // Your axios instance with qs
// or use relative path: import api from './api';

export const fetchColumns = async (
  table,
  joinTables,
  joinConditions
) => {
  const response = await api.get('/columns', {
    params: {
      table,
      ...(joinTables.length && { joinTables }),
      ...(joinConditions.length && { joinConditions })
    }
  });

  return response.data;
};
