import axios from "axios";
import env from "./env";

export const axiosClient = axios.create({
  baseURL: env.apiUrl,
});

export default axiosClient;
