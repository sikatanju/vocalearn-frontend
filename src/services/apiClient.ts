import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_VOCALEARN_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - adds token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                // Call your refresh endpoint
                const response = await axios.post(
                    `${import.meta.env.VITE_VOCALEARN_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken } = response.data;

                // Store new access token
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
