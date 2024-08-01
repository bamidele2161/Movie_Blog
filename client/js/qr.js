// Function to display success or error message
const displayMessage = (message, type) => {
  const notificationElement =
    type === "success"
      ? document.getElementById("success")
      : document.getElementById("error");
  notificationElement.textContent = message;
  notificationElement.style.display = "block";

  // Hide the notification after a certain duration (e.g., 3 seconds)
  setTimeout(() => {
    notificationElement.style.display = "none";
    if (type === "success") {
      window.location.href = "../html/mypost.html"; // Redirect to login page on success
    }
  }, 3000); // 3000 milliseconds = 3 seconds
};

// Function to fetch CSRF token
const getCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/csrf-token", {
      credentials: "include",
      method: "GET",
    });
    if (!response.ok) {
      displayMessage("Failed to fetch CSRF token: " + response.status, "error");
    }
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    displayMessage("Error during fetching CSRF token:", "error");
  }
};

// Function to display error message
const displayError = (id, message) => {
  const element = document.getElementById(id);
  element.textContent = message;
  element.style.display = "block";
};

// Function to clear error messages
const clearError = () => {
  const errors = document.querySelectorAll(".errorField");
  errors.forEach((element) => {
    element.textContent = "";
    element.style.display = "none";
  });
};

// Function to validate email format
const validateEmail = (email) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(email);
};

const genetateQR = () => {
  fetch("http://localhost:8000/qr", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        document.getElementById("qr-preview").src = data.image;
      } else {
        displayMessage(data.error, "error", null);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const handleUpdateQr = async () => {
  // Populate form fields with movie item details
  var inputQrCode = document.getElementById("qr-input-value").value;
  // Create data object to send to endpoint
  const csrfToken = await getCsrfToken();
  const data = {
    qrCode: inputQrCode,
  };
  // Send PUT request to update movie post
  fetch("http://localhost:8000/qr", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
    body: JSON.stringify(data), // Convert data to JSON format
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        displayMessage(data?.message, "success", "../html/mypost.html");
      } else {
        displayMessage(data.error, "error", null);
        // window.location.href = "../html/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

genetateQR();
// Event listener for form submission
document.getElementById("qr-refresh").addEventListener("click", genetateQR);

document.getElementById("submit-btn").addEventListener("click", handleUpdateQr);
