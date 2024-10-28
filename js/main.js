console.log("Samsung Smartthings")

document.getElementById("devices-tab").addEventListener("click", function() {
    // Move the screen container to show the Devices screen
    document.querySelector(".screen-container").style.transform = "translateX(0)";

    // Update active tab style
    document.getElementById("devices-tab").classList.add("active");
    document.getElementById("settings-tab").classList.remove("active");
    });

    document.getElementById("settings-tab").addEventListener("click", function() {
    // Move the screen container to show the Settings screen
    document.querySelector(".screen-container").style.transform = "translateX(-50%)";

    // Update active tab style
    document.getElementById("settings-tab").classList.add("active");
    document.getElementById("devices-tab").classList.remove("active");
});

document.getElementById("token-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default link behavior
    chrome.tabs.create({ url: "https://account.smartthings.com/tokens" }); // Open the URL in a new tab
});

// Get a reference to the input field
const inputFieldToken = document.getElementById("input-token");

// Restore the saved value when the popup loads
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["apiTokenValue"], (result) => {
      if (result.apiTokenValue) {
        inputFieldToken.value = result.apiTokenValue;
      }
    });
});

// Save the value whenever it changes
inputFieldToken.addEventListener("input", () => {
    const value = inputFieldToken.value;
    chrome.storage.local.set({ apiTokenValue: value });
});