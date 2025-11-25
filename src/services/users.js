import axiosClient from "../config/axios_config";

export async function getUserByUsername(username) {
  if (!username) {
    throw new Error("username es requerido para consultar usuarios");
  }

  const { data } = await axiosClient.get("/users", { params: { username } });
  return data;
}

export async function loginUser(username, password) {
  const { data } = await axiosClient.post("/users/login", { username, password });
  return data;
}

export default {
  getUserByUsername,
  loginUser,
};
