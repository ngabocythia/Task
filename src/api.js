import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001"
});

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  return error.response?.data?.message || error.response?.data?.error || error.message || fallback;
};

export default api;
