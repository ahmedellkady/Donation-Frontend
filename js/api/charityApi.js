const BASE_URL = "http://localhost:8080";

export async function fetchCharities(city = "", category = "") {
  let url = `${BASE_URL}/api/charity/filter`;
  const params = [];
  if (city) params.push(`city=${encodeURIComponent(city)}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (params.length) url += `?${params.join('&')}`;

  const response = await fetch(url);
  return response;
}

export async function fetchCharityById(charityId) {
  const response = await fetch(`${BASE_URL}/api/charity/${charityId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch charity info.");
  }
  return await response.json();
}