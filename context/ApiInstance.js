import axios from "axios";
import { baseIP } from "../const";

const axiosInstance = axios.create({
  baseURL: `http://${baseIP}:8080`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
