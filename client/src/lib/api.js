import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message;
        if (error.response?.status === 401 && message === 'Your account has been deactivated') {
            window.dispatchEvent(new CustomEvent('account-deactivated'));
        }
        return Promise.reject(error);
    }
);

export default api;