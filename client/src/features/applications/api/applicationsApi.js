import api from '@/lib/api';

export const applyToJob = (jobId) => api.post('/api/applications', { jobId });
export const getMyApplications = () => api.get('/api/applications/mine');