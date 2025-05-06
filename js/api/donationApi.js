import { BASE_URL } from "../utils/config.js";
import { apiRequest } from "../utils/apiRequest.js";

export function submitDonation(donorId, donationPayload) {
  return apiRequest(`${BASE_URL}/api/donations/add/${donorId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(donationPayload)
  });
}

export function getDonationCount(donorId) {
  return apiRequest(`${BASE_URL}/api/donations/count/${donorId}`);
}

export function getUpcomingPickup(donorId) {
  return apiRequest(`${BASE_URL}/api/donations/latest-pickup/${donorId}`);
}

export function getDonationHistory(donorId) {
  return apiRequest(`${BASE_URL}/api/donations/history/${donorId}`);
}

export function cancelDonation(donationId) {
  return apiRequest(`${BASE_URL}/api/donations/cancel/${donationId}`, {
    method: "PUT"
  });
}

export function submitFeedback(feedbackData) {
  return apiRequest(`${BASE_URL}/api/feedback/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(feedbackData)
  });
}