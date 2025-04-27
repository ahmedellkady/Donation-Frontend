const BASE_URL = "http://localhost:8080";

export async function fetchNeeds(city = "", category = "", urgency = "") {
  let url = `${BASE_URL}/api/needs/filter`;
  const params = [];
  if (city) params.push(`city=${encodeURIComponent(city)}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (urgency) params.push(`urgency=${encodeURIComponent(urgency)}`);
  if (params.length) url += `?${params.join('&')}`;

  const response = await fetch(url);
  return response;
}
