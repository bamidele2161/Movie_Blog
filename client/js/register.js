const fonts = ["cursive", "sans-serif", "serif", "monospace"];

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
      window.location.href = "../html/login.html"; // Redirect to login page on success
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

// Function to submit registration form
const submitForm = async (event) => {
  event.preventDefault(); // Prevent the default form submission
  clearError();
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let isValid = true;

  if (firstname.length < 3) {
    displayError("firstErr", "Minimum of 3 characters");
    isValid = false;
  } else if (lastname.length < 3) {
    displayError("lastErr", "Minimum of 3 characters");
    isValid = false;
  } else if (!validateEmail(email)) {
    displayError("emailErr", "Please provide a valid email");
    isValid = false;
  } else if (password.length < 6) {
    displayError("passwordErr", "Minimum of 6 characters");
    isValid = false;
  } else if (isValid) {
    const csrfToken = await getCsrfToken();
    const data = {
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: password,
    };
    fetch("http://localhost:8000/user", {
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
        } else {
          displayMessage(data?.error, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.log("Error:", error);
  }
};

// Event listener for form submission
document.getElementById("submit-btn").addEventListener("click", submitForm);
