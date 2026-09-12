import { request } from "./http";

export const getTimeline = async (collaborationId) => {
  return request(`/timeline/${collaborationId}`, { method: "GET" });
};
