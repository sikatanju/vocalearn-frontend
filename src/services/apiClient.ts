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

        // Don't retry if this is already a retry or if it's not a 401 error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');

            // If no refresh token, don't try to refresh - just reject
            if (!refreshToken) {
                console.warn(
                    'No refresh token available, cannot refresh session'
                );
                return Promise.reject(error);
            }

            try {
                console.log('Attempting to refresh token...');
                const response = await axios.post(
                    `${import.meta.env.VITE_VOCALEARN_URL}auth/jwt/refresh/`,
                    { refresh: refreshToken }
                );

                const { access } = response.data;

                if (!access) {
                    throw new Error('No access token in refresh response');
                }

                // Store new access token
                localStorage.setItem('accessToken', access);
                console.log('Token refreshed successfully');

                // Retry the original request with new token
                originalRequest.headers.Authorization = `JWT ${access}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Only clear tokens and redirect if refresh actually failed
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Avoid redirect loop
                if (
                    !window.location.pathname.includes('/login') &&
                    !window.location.pathname.includes('/signup')
                ) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
