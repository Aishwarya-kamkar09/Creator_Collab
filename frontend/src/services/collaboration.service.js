import { request } from "./http";

export const getMyCollaborations = async () => {
  return request("/collaborations/me", { method: "GET" });
};

export const getCollaborationById = async (id) => {
  return request(`/collaborations/${id}`, { method: "GET" });
};

export const updateStage = async (id, stage) => {
  return request(`/collaborations/${id}/stage`, { method: "PATCH", body: JSON.stringify({ stage }) });
};

export const cancelCollaboration = async (id) => {
  return request(`/collaborations/${id}/cancel`, { method: "PATCH" });
};

export const completeCollaboration = async (id) => {
  return request(`/collaborations/${id}/complete`, { method: "PATCH" });
};

export const submitDeliverable = async (id, deliverableId, payload) => {
  return request(`/collaborations/${id}/deliverables/${deliverableId}/submit`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const approveDeliverable = async (id, deliverableId) => {
  return request(`/collaborations/${id}/deliverables/${deliverableId}/approve`, { method: "PATCH" });
};

export const requestRevision = async (id, deliverableId, comment) => {
  return request(`/collaborations/${id}/deliverables/${deliverableId}/revision`, {
    method: "PATCH",
    body: JSON.stringify({ comment }),
  });
};

export const resolveRevision = async (id, revisionId, submittedLinks) => {
  return request(`/collaborations/${id}/revisions/${revisionId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ submittedLinks }),
  });
};

export const getRevisions = async (id) => {
  return request(`/collaborations/${id}/revisions`, { method: "GET" });
};
