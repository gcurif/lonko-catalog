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

export async function uploadItemImages(itemId, images = []) {
  if (!itemId || !Array.isArray(images) || images.length === 0) return null;
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));
  const { data } = await axiosClient.post(`/items/${itemId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
  uploadItemImages,
  advancedSearch,
};
