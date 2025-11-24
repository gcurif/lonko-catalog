import axiosClient from "../config/axios_config";

export async function listSchemas() {
  const { data } = await axiosClient.get("/schemas");
  return data;
}

export async function getSchema(id) {
  const { data } = await axiosClient.get(`/schemas/${id}`);
  return data;
}

export async function updateSchemaOptions(id, options) {
  const { data } = await axiosClient.put(`/schemas/${id}/options`, { options });
  return data;
}

export default {
  listSchemas,
  getSchema,
  updateSchemaOptions,
};
