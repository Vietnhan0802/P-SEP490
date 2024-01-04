// axiosConfig.js
const axios = require('axios');

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      // Thêm các headers khác nếu cần thiết
    },
  });

  // Thêm interceptor cho request
  instance.interceptors.request.use(
    config => {
      console.log(`Sending request to ${config.url}`);
      // Có thể thêm logic xử lý request ở đây
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Thêm interceptor cho response
  instance.interceptors.response.use(
    response => {
      console.log(`Received response from ${response.config.url}`);
      // Có thể thêm logic xử lý response ở đây
      return response;
    },
    error => {
      console.error('Error in response:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

module.exports = {
  axiosInstanceApi1: createAxiosInstance('http://localhost:3001'),
  axiosInstanceApi2: createAxiosInstance('http://localhost:3002'),
};
