import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://apirpl.smkn1purbalingga.sch.id/api/v1',
    headers: {
        'Accept': 'application/json',
    },
});

// Add request interceptor to include authentication token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default apiClient;