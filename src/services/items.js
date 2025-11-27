import axiosClient from "../config/axios_config";

export async function listItems() {
  const { data } = await axiosClient.get("/items");
  return data;
}

export async function getItem(code) {
  const { data } = await axiosClient.get(`/items/${code}`);
  return data;
}

export async function createItem(payload) {
  const { data } = await axiosClient.post("/items", payload);
  return data;
}

export async function advancedSearch(payload) {
  const { data } = await axiosClient.post("/items/advanced-search", payload);
  return data;
}

export default {
  listItems,
  getItem,
  createItem,
  advancedSearch,
};
