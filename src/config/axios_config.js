import axios from "axios";
import env from "./env";

export const axiosClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
  }
});

export default axiosClient;
