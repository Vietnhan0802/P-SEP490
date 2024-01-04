// axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5195/api/User/', // Set the base URL for the instance
  timeout: 5000, // Set a timeout for requests (in milliseconds)
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need for all requests from this instance
  },
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Do something with the request config, such as adding headers or modifying the data
    // console.log(config.data);
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    // Do something with the response data
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default instance;