import axios from "axios";

const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
      baseURL: baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

  // Thêm interceptor cho request
  instance.interceptors.request.use(
    (config) => {
      console.log(`Sending request to ${config.url}`);
      // Có thể thêm logic xử lý request ở đây
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Thêm interceptor cho response
  instance.interceptors.response.use(
    (response) => {
      console.log(`Received response from ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error("Error in response:", error);
      return Promise.reject(error);
    }
  );

  return instance;
};

const userInstance = createAxiosInstance("https://localhost:7006/api/User");
export default userInstance;
