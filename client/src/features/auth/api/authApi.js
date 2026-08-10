import api from '@/lib/api';

export const signUp = (data) => api.post('/api/auth/signup', data);
export const login = (data) => api.post('/api/auth/login', data);
export const googleAuth = (data) => api.post('/api/auth/google', data);
export const logout = () => api.post('/api/auth/logout');
export const sendVerificationEmail = () => api.post('/api/auth/send-verification-email');
export const verifyEmail = (token) => api.get(`/api/auth/verify-email?token=${token}`);
export const updateEmail = (currentPassword, newEmail) => api.patch('/api/auth/update-email', { currentPassword, newEmail });
export const updatePassword = (currentPassword, newPassword) => api.patch('/api/auth/update-password', { currentPassword, newPassword });