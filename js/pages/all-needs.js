import { fetchNeedsByCharity, deleteNeedById } from "../api/needApi.js";

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const charityId = user?.id;
    if (!charityId) return;

    try {
        const needs = await fetchNeedsByCharity(charityId);
        const tbody = document.getElementById("needs-table-body");
        tbody.innerHTML = "";

        if (!needs.length) {
            tbody.innerHTML = `<tr><td colspan="6">No needs posted yet.</td></tr>`;
            return;
        }

        needs.forEach(need => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${need.id}</td>
            <td>${need.type}</td>
            <td>${need.quantity}</td>
            <td class="status-cell"><span class="status ${getUrgencyClass(need.urgency)}">${need.urgency}</span></td>
            <td>${need.city}</td>
            <td>${new Date(need.createdAt).toLocaleDateString()}</td>
            <td class="status-cell"><span class="status ${getStatusClass(need.status)}">${need.status}</span></td>
            `;

            const actionCell = document.createElement("td");
            const deleteLink = document.createElement("a");
            deleteLink.href = "#";
            deleteLink.className = "cancel";
            deleteLink.textContent = "Delete";
            deleteLink.addEventListener("click", async () => {
                const confirmed = confirm(`Are you sure you want to delete need #${need.id}?`);
                if (!confirmed) return;

                try {
                    const res = await deleteNeedById(need.id);
                    if (res.success) {
                        alert(res.message);
                        await fetchNeedsByCharity(charityId);
                    }
                } catch (err) {
                    alert("Failed to delete need.");
                    console.error(err);
                }
            });

            actionCell.appendChild(deleteLink);
            row.appendChild(actionCell);
            tbody.appendChild(row);

        });
    } catch (err) {
        console.error("Failed to load needs:", err);
    }
});

function getUrgencyClass(urgency) {
    switch (urgency.toLowerCase()) {
        case "critical": return "critical";
        case "medium": return "medium";
        case "low": return "low";
        default: return "";
    }
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case "pending": return "pending";
        case "approved": return "picked-up";
        case "rejected": return "canceled";
        default: return "pending";
    }
}
