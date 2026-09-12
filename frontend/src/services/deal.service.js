import { request } from "./http";

export const createDeal = async (applicationId) => {
  return request(`/deals/application/${applicationId}`, { method: "POST" });
};

export const updateDeal = async (dealId, payload) => {
  return request(`/deals/${dealId}`, { method: "PUT", body: JSON.stringify(payload) });
};

export const confirmDeal = async (dealId) => {
  return request(`/deals/${dealId}/confirm`, { method: "PATCH" });
};

export const getMyDeals = async () => {
  return request("/deals/me", { method: "GET" });
};

export const acceptDeal = async (dealId) => {
  return request(`/deals/${dealId}/accept`, { method: "PATCH" });
};

export const declineDeal = async (dealId) => {
  return request(`/deals/${dealId}/decline`, { method: "PATCH" });
};

// No single-deal GET route exists on the backend, so deal detail pages
// resolve from router state first and fall back to matching within
// the user's own deal list.
export const findDealById = async (dealId) => {
  const res = await getMyDeals();
  const match = res.data.find((d) => d._id === dealId);
  if (!match) throw new Error("Deal not found");
  return match;
};
