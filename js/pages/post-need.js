import { postNeed } from "../api/needApi.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postNeedForm");

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const charityId = user?.id;

    if (!charityId) {
      alert("User not logged in as charity.");
      return;
    }

    const needData = {
      type: document.getElementById("needType").value,
      quantity: parseInt(document.getElementById("quantity").value),
      urgency: document.getElementById("urgency").value,
      description: document.getElementById("description").value
    };

    try {
      const response = await postNeed(charityId, needData);
      alert("Need posted successfully!");
      form.reset();
    } catch (err) {
      alert("Failed to post need.");
      console.error(err);
    }
  });
});
