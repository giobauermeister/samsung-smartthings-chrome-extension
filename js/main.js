console.log("Samsung SmartThings")

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

var animation = lottie.loadAnimation({
    container: document.getElementById('lottie-container'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: chrome.runtime.getURL('lottie/AC_on.json')
});  

async function fetchDevices(apiToken) {
  try {
      const response = await fetch("https://api.smartthings.com/v1/devices", {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${apiToken}`, // Add the token here
              "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json(); // Parse JSON response
      console.log("Devices:", data); // Log the response for debugging
      return data; // Return the JSON data
  } catch (error) {
      console.error("Failed to fetch devices:", error);
      return null; // Handle errors appropriately
  }
}

// Helper function to validate token
async function validateToken(token) {
  try {
      // Make a simple API request to check if the token is valid
      const response = await fetch("https://api.smartthings.com/v1/devices", {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      if (response.ok) {
          console.log("token is valid");
          console.log(response.json);
          document.getElementById("token-status-message").textContent = "Token is valid!";
          return true;
      } else {
          console.log("invalid token");
          document.getElementById("token-status-message").textContent = "Invalid token.";
          return false;
      }
  } catch (error) {
      console.error("Error validating token:", error);
      return false;
  }
}

// Restore the saved value when the popup loads
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["apiTokenValue"], async (result) => {
      if (result.apiTokenValue) {
        inputFieldToken.value = result.apiTokenValue;
        await validateToken(result.apiTokenValue);

        var countACDevices = 0;
        const devicesData = await fetchDevices(result.apiTokenValue);
        if (devicesData) {
            // Process and display the devices in the UI here
            
            devicesData.items.forEach(element => {
                console.log(element.deviceTypeName);
                if (element.deviceTypeName === "Samsung OCF Air Conditioner") {
                    countACDevices+=1;
                }
            });
            console.log(`Found ${countACDevices} Air Conditioner Devices`);            
        }

      } else {
        console.log("First configure API token in settings");
        document.getElementById("devices-message").textContent = "First configure API token in settings";
      }
    });
});

// Save the value whenever it changes
inputFieldToken.addEventListener("input", async () => {
    const token = inputFieldToken.value;
    chrome.storage.local.set({ apiTokenValue: token });
    // document.getElementById("token-status-message").textContent = "Token status";
    await validateToken(token);
});