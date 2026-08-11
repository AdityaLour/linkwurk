import api from '@/lib/api';

export const getPlatformStats = () => api.get('/api/admin/stats');
export const getAllUsers = (role, search) => {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (search) params.set('search', search);
    return api.get(`/api/admin/users?${params.toString()}`);
};
export const toggleUserStatus = (userId) => api.patch(`/api/admin/users/${userId}/toggle-status`);
export const getAllRecruitersWithStats = () => api.get('/api/admin/recruiters');
export const verifyUserEmail = (userId) => api.patch(`/api/admin/users/${userId}/verify-email`);
export const getRecruiterDetail = (recruiterId) => api.get(`/api/admin/recruiters/${recruiterId}`);