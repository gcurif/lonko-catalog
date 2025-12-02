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

export async function createUser(payload) {
  const { data } = await axiosClient.post("/users", payload);
  return data;
}

export async function getAllUsers() {
  const { data } = await axiosClient.get("/users");
  return data;
}

export async function updateUser(userId, payload) {
  const { data } = await axiosClient.put(`/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId) {
  const { data } = await axiosClient.delete(`/users/${userId}`);
  return data;
}

export default {
  getUserByUsername,
  loginUser,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
