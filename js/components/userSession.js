export function getDonorId() {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;

    try {
        const user = JSON.parse(userJson);
        return user?.id || null;
    } catch (e) {
        console.error("Invalid user JSON:", e);
        return null;
    }
}

export function getDonorName() {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;

    try {
        const user = JSON.parse(userJson);
        return user?.name || null;
    } catch (e) {
        console.error("Invalid user JSON:", e);
        return null;
    }
}