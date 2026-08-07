import api from '@/lib/api';

export const getMyCandidateProfile = () => api.get('/api/candidates/me');
export const updateMyCandidateProfile = (formData) =>
    api.put('/api/candidates/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });