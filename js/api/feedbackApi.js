import { BASE_URL } from "../utils/config.js";
import { apiRequest } from "../utils/apiRequest.js";

export function submitFeedback(feedbackData) {
  return apiRequest(`${BASE_URL}/api/feedback/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(feedbackData)
  });
}

export async function getDonorFeedback(donationId) {
    return await apiRequest(`${BASE_URL}/api/feedback/donor/${donationId}/feedback`, {
        method: "GET",
    });
}

export async function getCharityFeedback(donationId) {
    return await apiRequest(`${BASE_URL}/api/feedback/charity/${donationId}/feedback`, {
        method: "GET",
    });
}

export function fetchDonorFeedbacks(donorId) {
  return apiRequest(`${BASE_URL}/api/feedback/donor/${donorId}/feedbacks`);
}