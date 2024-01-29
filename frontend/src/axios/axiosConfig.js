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

export const followInstance = createAxiosInstance("https://localhost:7002/api/Follow");
export const credentialInstance = createAxiosInstance("https://localhost:7003/api/Degree");
export const accountReportInstance = createAxiosInstance("https://localhost:7004/api/AccountReport");
export const reportPostInstance = createAxiosInstance("https://localhost:7004/api/ReportPost");
export const verificationsInstance = createAxiosInstance("https://localhost:7004/api/Verifications");
export const projectInstance = createAxiosInstance("https://localhost:7005/api/ProjectInfo");
export const userInstance = createAxiosInstance("https://localhost:7006/api/User");
export const blogInstance = createAxiosInstance("https://localhost:7007/api/Blog");
export const notifyInstance = createAxiosInstance("https://localhost:7009/api/Notificationss");
export const staticInstance = createAxiosInstance("https://localhost:7010/api/Statics");

