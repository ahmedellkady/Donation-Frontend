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