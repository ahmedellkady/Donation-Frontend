const BASE_URL = "http://localhost:8080";

export async function registerDonor(payload) {
  const response = await fetch(`${BASE_URL}/api/donors/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return response;
}

export async function registerCharity(payload) {
  const response = await fetch(`${BASE_URL}/api/charity/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return response;
}

export async function loginDonor(payload) {
  const response = await fetch(`${BASE_URL}/api/donors/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return response;
}

export async function loginCharity(payload) {
  const response = await fetch(`${BASE_URL}/api/charity/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return response;
}
