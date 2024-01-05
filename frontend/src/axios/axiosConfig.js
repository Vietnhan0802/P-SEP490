// axiosInstance.js
// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:5195/api/User/', // Set the base URL for the instance
//   timeout: 5000, // Set a timeout for requests (in milliseconds)
//   headers: {
//     'Content-Type': 'application/json',
//     // Add any other headers you need for all requests from this instance
//   },
// });

// // Add request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     // Do something with the request config, such as adding headers or modifying the data
//     // console.log(config.data);
//     return config;
//   },
//   (error) => {
//     // Handle request error
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor
// instance.interceptors.response.use(
//   (response) => {
//     // Do something with the response data
//     return response;
//   },
//   (error) => {
//     // Handle response error
//     return Promise.reject(error);
//   }
// );

// export default instance;
// axiosConfig.js
import axios from "axios";

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      // Thêm các headers khác nếu cần thiết
    },
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
      // Có thể thêm logic xử lý response ở đây
      return response;
    },
    (error) => {
      console.error("Error in response:", error);
      return Promise.reject(error);
    }
  );

  return instance;
};

// module.exports = {
//   userInstance: createAxiosInstance('http://localhost:5195/api/User'),
//   axiosInstanceApi2: createAxiosInstance('http://localhost:3002'),
// };
const userInstance = createAxiosInstance("http://localhost:5195/api/User");
export default userInstance;
