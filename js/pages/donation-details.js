const donation = JSON.parse(localStorage.getItem("selectedDonation"));

if (!donation) {
    document.body.innerHTML = "<p>Donation data not found.</p>";
} else {
    document.querySelector(".type-badge").textContent = donation.type;
    document.querySelector(".status").textContent = donation.status;
    document.querySelector(".status").classList.add(donation.status.toLowerCase());

    const dateText = new Date(donation.pickup.scheduledDate).toLocaleString("en-US", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

    document.querySelector(".description").textContent = donation.description;

    const pickupBox = document.querySelector(".section.box + .section.box");
    pickupBox.querySelector("p:nth-of-type(1)").textContent = `Scheduled Time: ${dateText}`;
    pickupBox.querySelector("p:nth-of-type(2)").textContent = `Address: ${donation.pickup.location}`;

    document.querySelector(".charity-info p strong").textContent = donation.charityName;

    localStorage.removeItem("selectedDonation");
}