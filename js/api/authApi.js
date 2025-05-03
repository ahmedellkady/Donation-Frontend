import { BASE_URL } from "../utils/config.js";
import { apiRequest } from "../utils/apiRequest.js";

export function registerCharity(payload) {
  return apiRequest(`${BASE_URL}/api/charity/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function registerDonor(payload) {
  return apiRequest(`${BASE_URL}/api/donors/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function loginDonor(payload) {
  return apiRequest(`${BASE_URL}/api/donors/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function loginCharity(payload) {
  return apiRequest(`${BASE_URL}/api/charity/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}
