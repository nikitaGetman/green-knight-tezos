import axios from 'axios';

const timeout = 600000;
const axiosInstance = axios.create({
  // baseURL: 'http://84.201.184.103:5000/api',
  baseURL:
    process.env.NODE_ENV === 'production' ? `${process.env.REACT_APP_BASE_API_URL}/api` : 'http://localhost:5000/api',
  timeout,
});

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
