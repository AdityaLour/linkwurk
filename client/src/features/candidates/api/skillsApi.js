import api from '@/lib/api';

export const searchSkills = (query) => api.get(`/api/skills/search?q=${encodeURIComponent(query)}`);