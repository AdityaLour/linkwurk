import api from '@/lib/api';

export const applyToJob = (jobId) => api.post('/api/applications', { jobId });
export const getMyApplications = () => api.get('/api/applications/mine');
export const getApplicantsForJob = (jobId) => api.get(`/api/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) => api.patch(`/api/applications/${id}/status`, { status });