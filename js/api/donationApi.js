const BASE_URL = "http://localhost:8080";

export async function submitDonation(donorId, donationPayload) {
  try {
    const response = await fetch(`${BASE_URL}/api/donations/add/${donorId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(donationPayload)
    });

    return response;
  } catch (error) {
    console.error("Donation API error:", error);
    throw error;
  }
}
