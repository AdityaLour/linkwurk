import api from '@/lib/api';

export const signUp = (data) => api.post('/api/auth/signup', data);
export const login = (data) => api.post('/api/auth/login', data);
export const googleAuth = (data) => api.post('/api/auth/google', data);
export const logout = () => api.post('/api/auth/logout');