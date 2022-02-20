import axios from 'axios';

const timeout = 600000;
const axiosInstance = axios.create({ baseURL: process.env.APP_BASE_URL || '/', timeout });

// const defaultErrorInterceptor = (error) => Promise.reject(error);
// const defaultRequestInterceptor = (config) => config;
// const defaultResponseInterceptor = (response) => response;

export function setHeader(key: string, value: string) {
  axiosInstance.defaults.headers.common[key] = value;
}

export function unsetHeader(key: string) {
  delete axiosInstance.defaults.headers.common[key];
}

// export function addRequestInterceptor({ request, error }) {
//   const interceptor = axiosInstance.interceptors.request.use(
//     request || defaultRequestInterceptor,
//     error || defaultErrorInterceptor
//   );
//   return () => {
//     axiosInstance.interceptors.request.eject(interceptor);
//   };
// }

// export function addResponseInterceptor({ response, error }) {
//   const interceptor = axiosInstance.interceptors.response.use(
//     response || defaultResponseInterceptor,
//     error || defaultErrorInterceptor
//   );
//   return () => {
//     axiosInstance.interceptors.response.eject(interceptor);
//   };
// }

// const get = (url, config) => {
//   return axiosInstance.get(url, config).then((response) => response.data);
// };

const client = {
  get: axiosInstance.get,
  delete: axiosInstance.delete,
  post: axiosInstance.post,
  put: axiosInstance.put,
  patch: axiosInstance.patch,
  request: axiosInstance.request,
};

export default client;
