import { BASE_URL } from "../utils/config.js";
import { apiRequest } from "../utils/apiRequest.js";

export async function fetchCharities(city = "", category = "", page = 0, size = 10) {
  let url = `${BASE_URL}/api/charity/filter`;
  const params = [];
  if (city) params.push(`city=${encodeURIComponent(city)}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  params.push(`page=${page}`);
  params.push(`size=${size}`);
  url += `?${params.join("&")}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch charities.");
  return await response.json(); // Must return parsed JSON
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