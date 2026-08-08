import api from '@/lib/api';

export const getAllJobs = (page = 1, limit = 9) => api.get(`/api/jobs?page=${page}&limit=${limit}`);
export const getJobById = (id) => api.get(`/api/jobs/${id}`);
export const getRecommendedJobs = () => api.get('/api/jobs/recommended');
export const getMyJobs = () => api.get('/api/jobs/mine');
export const createJob = (data) => api.post('/api/jobs', data);
export const updateJob = (id, data) => api.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/api/jobs/${id}`);
export const updateJobStatus = (id) => api.patch(`/api/jobs/${id}/status`);