import api from '@/lib/api';

export const getSavedJobs = () => api.get('/api/saved-jobs/mine');
export const toggleSaveJob = (jobId) => api.post('/api/saved-jobs/toggle', { jobId });