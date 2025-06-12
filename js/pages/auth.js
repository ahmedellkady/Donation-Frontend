import { registerDonor, registerCharity, loginDonor, loginCharity } from "../api/authApi.js";
import { startDonorSession } from "../api/sessionApi.js";

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    signupForm?.addEventListener("submit", handleSignup);
    loginForm?.addEventListener("submit", handleLogin);
});

async function handleSignup(event) {
    event.preventDefault();
    const form = event.target;

    const payload = {
        name: getValue("name"),
        email: getValue("signupEmail"),
        phone: getValue("phone"),
        password: getValue("signupPassword"),
        city: getValue("city"),
        neighborhood: getOptionalValue("neighborhood"),
        preferredTypes: getCheckedValues("preferredTypes")
    };

    if (payload.preferredTypes.length === 0) {
        return showMessage("signupMessage", "Please select at least one preferred donation type.", "red");
    }

    const userType = getCheckedRadio("userType");
    const registerFn = userType === "donor" ? registerDonor : registerCharity;

    try {
        await registerFn(payload);
        showMessage("signupMessage", "Registration successful! Please login now.", "green");
        form.reset();
        setTimeout(() => {
            document.getElementById("flip").checked = false;
            hide("signupMessage");
        }, 2000);
    } catch (err) {
        console.error("Signup error:", err);
        showMessage("signupMessage", err.message || "Something went wrong.", "red");
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;

    const payload = {
        email: getValue("loginEmail"),
        password: getValue("loginPassword")
    };
    const userType = getCheckedRadio("userType");
    const loginFn = userType === "donor" ? loginDonor : loginCharity;

    try {
        const user = await loginFn(payload);
        localStorage.setItem("user", JSON.stringify(user));

        if (userType === "donor") {
            const session = await startDonorSession(user.id);
            localStorage.setItem("session", JSON.stringify(session));
            localStorage.setItem("activityCnt", 0);
            localStorage.setItem("userType", "donor");
            window.location.href = "donor-dashboard.html";
        } else {
            localStorage.setItem("userType", "charity");
            window.location.href = "charity-dashboard.html";
        }
    } catch (err) {
        console.error("Login error:", err);
        showMessage("loginError", err.message || "Login failed.", "red");
    }
}

function getValue(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function getOptionalValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
}

function getCheckedRadio(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (!selected) throw new Error("Please select a user type.");
    return selected.value;
}

function showMessage(id, message, color) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = "block";
    el.style.color = color;
    el.innerText = message;
}

function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
}