import api from '@/lib/api';

export const getMyInterviewsAsCandidate = () => api.get('/api/interviews/mine/candidate');