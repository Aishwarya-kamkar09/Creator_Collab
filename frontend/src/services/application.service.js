import { request } from "./http";

export const applyToCampaign = async (campaignId, payload) => {
  return request(`/applications/campaign/${campaignId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getMyApplications = async () => {
  return request("/applications/me", { method: "GET" });
};

export const getCampaignApplications = async (campaignId) => {
  return request(`/applications/campaign/${campaignId}`, { method: "GET" });
};

export const acceptApplication = async (applicationId) => {
  return request(`/applications/${applicationId}/accept`, { method: "PATCH" });
};

export const rejectApplication = async (applicationId) => {
  return request(`/applications/${applicationId}/reject`, { method: "PATCH" });
};

export const withdrawApplication = async (applicationId) => {
  return request(`/applications/${applicationId}/withdraw`, { method: "PATCH" });
};
