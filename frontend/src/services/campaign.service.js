import { request } from "./http";

export const getAllCampaigns = async ({ page = 1, limit = 9, category, platform, status } = {}) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (category) params.set("category", category);
  if (platform) params.set("platform", platform);
  if (status) params.set("status", status);

  return request(`/campaigns?${params.toString()}`, { method: "GET" });
};

// The API has no single-campaign lookup route, so campaign detail pages
// resolve the campaign from router state when navigating from a list, and
// fall back to pulling a large page of campaigns and matching the id.
export const findCampaignById = async (id) => {
  const res = await request(`/campaigns?page=1&limit=500`, { method: "GET" });
  const match = res?.data?.campaigns?.find((c) => c._id === id);
  if (!match) throw new Error("Campaign not found");
  return match;
};

export const getMyCampaigns = async () => {
  return request("/campaigns/me", { method: "GET" });
};

export const createCampaign = async (payload) => {
  return request("/campaigns", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
