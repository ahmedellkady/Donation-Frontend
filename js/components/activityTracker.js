import { recordDonorActivity } from "../api/sessionApi.js";

export async function trackActivity(actionType, charityId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const session = JSON.parse(localStorage.getItem("session"));
  let activityCnt = parseInt(localStorage.getItem("activityCnt")) || 0;

  if (!user || !session || activityCnt >= 20) return;

  console.log("Simulating activity:", {
    donorId: user.id,
    charityId: charityId,
    actionType: actionType,
    sessionId: session.id
  });

  const payload = {
    donorId: user.id,
    charityId: charityId,
    actionType: actionType,
    sessionId: session.id
  };

  try {
    console.log("Sending activity payload: ", payload);
    const response = await recordDonorActivity(payload);
    console.log("Activity POST response:", response.status);

    activityCnt++;
    localStorage.setItem("activityCnt", activityCnt);
  } catch (error) {
    console.error("Failed to record activity:", error);
  }
}
