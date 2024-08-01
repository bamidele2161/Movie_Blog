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
      window.location.href = "../html/otp.html"; // Redirect to login page on success
    }
  }, 3000); // 3000 milliseconds = 3 seconds
};

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
    // Handle the error appropriately, e.g., show an error message to the user
  }
};

const displayError = (id, message) => {
  const element = document.getElementById(id);
  element.textContent = message;
  element.style.display = "block";
};

const clearError = () => {
  const error = document.querySelectorAll(".error");
  error.forEach((element) => {
    element.textContent = "";
    element.style.display = "none";
  });
};

const validateEmail = (email) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(email);
};

const submitForm = async (event) => {
  event.preventDefault(); // Prevent the default form submission
  let isValid = true;
  clearError();
  // Retrieve input field value
  var email = document.getElementById("email").value;
  if (!validateEmail(email)) {
    displayError("emailError", "Please provide a valid email");
    isValid = false;
  }

  if (isValid) {
    const csrfToken = await getCsrfToken();
    // Create data object to send to endpoint
    var data = {
      email: email,
    };

    fetch("http://localhost:8000/user/forgot", {
      method: "POST",
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
          displayMessage(data?.message, "success");

          localStorage.setItem("email", JSON.stringify(email));
        } else {
          displayMessage(data?.error, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};

document.getElementById("submit-btn").addEventListener("click", submitForm);
