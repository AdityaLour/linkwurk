import api from '@/lib/api';

export const getMyRecruiterProfile = () => api.get('/api/recruiters/me');
export const updateMyRecruiterProfile = (formData) =>
    api.put('/api/recruiters/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });