import { request } from "./http";

export const createBrandProfile = async (payload) => {
  return request("/brands", { method: "POST", body: JSON.stringify(payload) });
};

export const getMyBrandProfile = async () => {
  return request("/brands/me", { method: "GET" });
};

export const updateMyBrandProfile = async (payload) => {
  return request("/brands/me", { method: "PUT", body: JSON.stringify(payload) });
};

export const getAllBrands = async ({ page = 1, limit = 9, industry, location, companyName } = {}) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (industry) params.set("industry", industry);
  if (location) params.set("location", location);
  if (companyName) params.set("companyName", companyName);
  return request(`/brands?${params.toString()}`, { method: "GET" });
};

export const getBrandById = async (id) => {
  return request(`/brands/${id}`, { method: "GET" });
};
