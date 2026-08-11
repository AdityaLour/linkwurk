import api from '@/lib/api';

export const getAllJobs = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.experienceRequired) params.set('experienceRequired', filters.experienceRequired);
    if (filters.skills?.length) params.set('skills', filters.skills.join(','));
    if (filters.salaryMin) params.set('salaryMin', filters.salaryMin);
    if (filters.isRemote) params.set('isRemote', 'true');
    if (filters.search) params.set('search', filters.search);
    return api.get(`/api/jobs?${params.toString()}`);
};
export const getJobById = (id) => api.get(`/api/jobs/${id}`);
export const getRecommendedJobs = () => api.get('/api/jobs/recommended');
export const getMyJobs = () => api.get('/api/jobs/mine');
export const createJob = (data) => api.post('/api/jobs', data);
export const updateJob = (id, data) => api.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/api/jobs/${id}`);
export const updateJobStatus = (id) => api.patch(`/api/jobs/${id}/status`);