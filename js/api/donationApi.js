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

export function fetchIncomingDonations(charityId) {
  return apiRequest(`${BASE_URL}/api/donations/charity/${charityId}/incoming`);
}

export function countIncomingDonations(charityId) {
  return apiRequest(`${BASE_URL}/api/donations/charity/${charityId}/incoming/count`);
}

export function pickupScheduled(donationId) {
  return apiRequest(`${BASE_URL}/api/donations/scheduled-pickup/${donationId}` , {
    method: 'PUT'
  });
}

export function pickupPickedUp(donationId) {
  return apiRequest(`${BASE_URL}/api/donations/picked-up-pickup/${donationId}` , {
    method: 'PUT'
  });
}

export function pickupDelivered(donationId) {
  return apiRequest(`${BASE_URL}/api/donations/delivered-pickup/${donationId}` , {
    method: 'PUT'
  });
}

export function getDonationsForCharity(charityId) {
  return apiRequest(`${BASE_URL}/api/donations/charity/${charityId}`);
}

export function getDonationDetails(donationId) {
  return apiRequest(`${BASE_URL}/api/donations/details/${donationId}`);
}