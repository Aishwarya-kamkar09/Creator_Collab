import { request } from "./http";

export const registerUser = async (userData) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = async () => {
  return request("/auth/me", { method: "GET" });
};

export const logoutUser = async () => {
  return request("/auth/logout", { method: "POST" });
};
