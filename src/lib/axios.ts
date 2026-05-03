import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true, 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 422) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
