import api from '@/lib/api';

export const getPublicStats = () => api.get('/api/public/stats');