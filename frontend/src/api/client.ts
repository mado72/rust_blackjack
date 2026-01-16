import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Update with your API base URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for handling requests and responses
apiClient.interceptors.request.use(
  (config) => {
    // Add any custom logic before sending the request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default apiClient;