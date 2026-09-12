import { request } from "./http";

export const createReview = async (collaborationId, payload) => {
  return request(`/reviews/${collaborationId}`, { method: "POST", body: JSON.stringify(payload) });
};

export const getUserReviews = async (userId) => {
  return request(`/reviews/user/${userId}`, { method: "GET" });
};
