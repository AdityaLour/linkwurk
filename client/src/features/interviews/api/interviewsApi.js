import api from '@/lib/api';

export const getMyInterviewsAsCandidate = () => api.get('/api/interviews/mine/candidate');
export const getMyInterviews = () => api.get('/api/interviews/mine');
export const scheduleInterview = (applicationId, scheduledAt, notes) =>
    api.post('/api/interviews', { applicationId, scheduledAt, notes });
export const updateInterview = (id, data) => api.put(`/api/interviews/${id}`, data);