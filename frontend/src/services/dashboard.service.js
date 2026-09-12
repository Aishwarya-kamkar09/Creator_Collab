import { request } from "./http";

export const getDashboard = async () => {
  return request("/dashboard", { method: "GET" });
};
