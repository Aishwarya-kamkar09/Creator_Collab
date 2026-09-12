// Shared request helper used by every service file.
// NOTE: the backend mounts every route under /api/v1 (see backend/src/app.js),
// so the base URL must include the /v1 segment or every request 404s.
export const API_URL = "http://localhost:5000/api/v1";

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}
