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

export function fetchActiveNeeds(charityId) {
  return apiRequest(`${BASE_URL}/api/needs/charity/${charityId}/active`);
}

export function countActiveNeeds(charityId) {
  return apiRequest(`${BASE_URL}/api/needs/charity/${charityId}/active/count`);
}

export function deleteNeedById(needId) {
  return apiRequest(`${BASE_URL}/api/needs/delete/${needId}`, {
    method: "DELETE"
  });
}

export function postNeed(charityId, needData) {
  return apiRequest(`${BASE_URL}/api/needs/post/${charityId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(needData)
  });
}