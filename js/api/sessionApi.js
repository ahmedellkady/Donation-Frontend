const BASE_URL = "http://localhost:8080";

export async function startDonorSession(donorId) {
  return await fetch(`${BASE_URL}/api/sessions/start/${donorId}`, {
    method: "POST"
  });
}

export async function endDonorSession(sessionId) {
  return await fetch(`${BASE_URL}/api/sessions/end/${sessionId}`, {
    method: "POST"
  });
}

export async function recordDonorActivity(payload) {
  return await fetch(`${BASE_URL}/api/donor-activity/record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
