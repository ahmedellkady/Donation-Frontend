import { BASE_URL } from "../utils/config.js";
import { apiRequest } from "../utils/apiRequest.js";

export function startDonorSession(donorId) {
  return apiRequest(`${BASE_URL}/api/sessions/start/${donorId}`, {
    method: "POST"
  });
}

export function endDonorSession(sessionId) {
  return apiRequest(`${BASE_URL}/api/sessions/end/${sessionId}`, {
    method: "POST"
  });
}

export function recordDonorActivity(payload) {
  return apiRequest(`${BASE_URL}/api/donor-activity/record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}