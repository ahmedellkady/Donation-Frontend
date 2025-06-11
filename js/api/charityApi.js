import { BASE_URL } from "../utils/config.js";
import { apiRequest } from "../utils/apiRequest.js";

export function fetchCharities(city = "", category = "") {
  let url = `${BASE_URL}/api/charity/filter`;
  const params = [];
  if (city) params.push(`city=${encodeURIComponent(city)}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (params.length) url += `?${params.join('&')}`;

  return apiRequest(url);
}

export function fetchCharityById(charityId) {
  return apiRequest(`${BASE_URL}/api/charity/${charityId}`);
}

export function fetchCharityFeedbacks(charityId) {
  return apiRequest(`${BASE_URL}/api/feedback/charity/${charityId}/feedbacks`);
}

export function fetchRecommendedCharitiesForDonor(donorId) {
  return apiRequest(`${BASE_URL}/api/charity/recommendations/${donorId}`);
}