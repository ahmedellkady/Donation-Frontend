export function redirectToDonate(need) {
    const url = new URL("donate.html", window.location.href);
    url.searchParams.set("charityName", need.charityName);
    url.searchParams.set("needType", need.type);
    url.searchParams.set("needQuantity", need.quantity);
    url.searchParams.set("urgency", need.urgency);
    url.searchParams.set("city", need.city);
    url.searchParams.set("needId", need.id);
    url.searchParams.set("description", need.description);
    url.searchParams.set("charityId", need.charityId);
    url.searchParams.set("createdAt", need.createdAt);

    window.location.href = url.toString();
}
