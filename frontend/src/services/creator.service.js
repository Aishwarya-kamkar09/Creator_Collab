import { request } from "./http";

export const createCreatorProfile = async (payload) => {
  return request("/creators", { method: "POST", body: JSON.stringify(payload) });
};

export const getMyCreatorProfile = async () => {
  return request("/creators/me", { method: "GET" });
};

export const updateMyCreatorProfile = async (payload) => {
  return request("/creators/me", { method: "PUT", body: JSON.stringify(payload) });
};

export const getAllCreators = async ({ page = 1, limit = 9, category, location, username } = {}) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (category) params.set("category", category);
  if (location) params.set("location", location);
  if (username) params.set("username", username);
  return request(`/creators?${params.toString()}`, { method: "GET" });
};

export const getCreatorByUsername = async (username) => {
  return request(`/creators/${username}`, { method: "GET" });
};
