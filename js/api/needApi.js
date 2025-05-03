import { BASE_URL } from "../utils/config.js";
import { apiRequest } from "../utils/apiRequest.js";

export function fetchNeeds(city = "", category = "", urgency = "") {
  let url = `${BASE_URL}/api/needs/filter`;
  const params = [];
  if (city) params.push(`city=${encodeURIComponent(city)}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (urgency) params.push(`urgency=${encodeURIComponent(urgency)}`);
  if (params.length) url += `?${params.join('&')}`;

  return apiRequest(url);
}

export function fetchNeedsByCharity(charityId) {
  return apiRequest(`${BASE_URL}/api/needs/charity/${charityId}`);
}

export function fetchSuggestedNeedsForDonor(donorId) {
  return apiRequest(`${BASE_URL}/api/needs/${donorId}/suggested-needs`);
}