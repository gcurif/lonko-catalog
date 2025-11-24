import axiosClient from "../config/axios_config";

export async function listItems() {
  const { data } = await axiosClient.get("/items");
  return data;
}

export async function getItem(id) {
  const { data } = await axiosClient.get(`/items/${id}`);
  return data;
}

export async function createItem(payload) {
  const { data } = await axiosClient.post("/items", payload);
  return data;
}

export default {
  listItems,
  getItem,
  createItem,
};
