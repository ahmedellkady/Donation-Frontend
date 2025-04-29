import { registerDonor, registerCharity, loginDonor, loginCharity } from "../api/authApi.js";
import { startDonorSession } from "../api/sessionApi.js";

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // Signup Submit
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const city = document.getElementById("city").value.trim();
        const neighborhood = document.getElementById("neighborhood") ? document.getElementById("neighborhood").value.trim() : "";
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const preferredTypes = Array.from(document.querySelectorAll('input[name="preferredTypes"]:checked')).map(cb => cb.value);

        if (preferredTypes.length === 0) {
            showSignupMessage("Please select at least one preferred donation type.", "red");
            return;
        }

        const payload = { name, email, phone, password, city, neighborhood, preferredTypes };

        try {
            let response;
            if (userType === "donor") {
                response = await registerDonor(payload);
            } else {
                response = await registerCharity(payload);
            }

            let responseData = {};
            try {
                responseData = await response.json();
            } catch (jsonError) {
                console.error("Failed to parse JSON response:", jsonError);
                responseData.message = "Server error. Please try again later.";
            }

            if (response.ok) {
                showSignupMessage("Registration successful! Please login now.", "green");
                signupForm.reset();
                setTimeout(() => {
                    document.getElementById("flip").checked = false;
                    hideSignupMessage();
                }, 2000);
            } else {
                showSignupMessage("Registration failed. Duplicate email or server error.", "red");
            }
        } catch (error) {
            console.error("Network or server error:", error);
            showSignupMessage("Something went wrong. Please try again.", "red");
        }
    });



    // Login Submit
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const userType = document.querySelector('input[name="userType"]:checked').value; // <--- get radio button value

        const payload = { email, password };

        try {
            let response;

            if (userType === "donor") {
                response = await loginDonor(payload);
            } else if (userType === "charity") {
                response = await loginCharity(payload);
            } else {
                showLoginError("Please select a user type (Donor or Charity).");
                return;
            }

            let responseData = {};
            try {
                responseData = await response.json(); // safe parsing
            } catch (jsonError) {
                console.error("Failed to parse JSON response:", jsonError);
                responseData.message = "Server error. Please try again later.";
            }

            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(responseData));

                if (userType === "donor") {
                    const donorId = responseData.id;
                    try {
                        const sessionResponse = await startDonorSession(donorId);
                        if (sessionResponse.ok) {
                            const sessionId = await sessionResponse.json();
                            localStorage.setItem("session", JSON.stringify(sessionId));
                            localStorage.setItem("activityCnt", 0);
                            window.location.href = "donor-dashboard.html";
                        } else {
                            throw new Error("Failed to start donor session.");
                        }
                    } catch (sessionError) {
                        console.error("Session error:", sessionError);
                        showLoginError("Session creation failed");
                    }
                } else if (userType === "charity") {
                    window.location.href = "charity-dashboard.html";
                }
            } else {
                showLoginError(responseData.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error(error);
            showLoginError("Something went wrong. Please try again later.");
        }
    });
});

function showSignupMessage(message, color) {
    const messageDiv = document.getElementById("signupMessage");
    messageDiv.style.display = "block";
    messageDiv.style.color = color;
    messageDiv.innerText = message;
}

function hideSignupMessage() {
    const messageDiv = document.getElementById("signupMessage");
    messageDiv.style.display = "none";
}

function showLoginError(message) {
    const errorDiv = document.getElementById("loginError");
    errorDiv.style.display = "block";
    errorDiv.style.color = "red";
    errorDiv.innerText = message;
}
