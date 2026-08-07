import api from '@/lib/api';

export const getAllJobs = (page = 1, limit = 9) => api.get(`/api/jobs?page=${page}&limit=${limit}`);
export const getJobById = (id) => api.get(`/api/jobs/${id}`);
export const getRecommendedJobs = () => api.get('/api/jobs/recommended');