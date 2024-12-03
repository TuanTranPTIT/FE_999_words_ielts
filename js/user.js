// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Handle logo click
    document.getElementById("logo").addEventListener("click", () => {
        window.location.href = "homepage.html";
    });

    // Handle user menu toggle
    const userMenuToggle = document.getElementById("userMenuToggle");
    const userDropdown = document.getElementById("userDropdown");

    userMenuToggle.addEventListener("click", () => {
        userDropdown.style.display =
            userDropdown.style.display === "block" ? "none" : "block";
    });

    // Handle logout
    document.getElementById("logoutButton").addEventListener("click", () => {
        // Add logout logic here
        alert("Logged out!");
        window.location.href = "login.html";
    });
});