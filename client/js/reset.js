const showSuccessMessage = (message, type) => {
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

const getCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/csrf-token", {
      credentials: "include",
      method: "GET",
    });
    if (!response.ok) {
      showSuccessMessage(
        "Failed to fetch CSRF token: " + response.status,
        "error"
      );
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    showSuccessMessage("Error during fetching CSRF token:", "error");
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
  let isValid = true;
  clearError();
  event.preventDefault(); // Prevent the default form submission
  var password = document.getElementById("password").value;
  var confirm = document.getElementById("confirm").value;
  // Retrieve input field value
  var email = localStorage.getItem("email");
  const parseEmail = JSON.parse(email);

  if (password.length < 6) {
    displayError("passwordError", "Minimum of 6 characters");
    isValid = false;
  } else if (confirm.length < 6) {
    displayError("confirmError", "Minimum of 6 characters");
    isValid = false;
  } else if (password !== confirm) {
    displayError("confirmError", "Password does not match");
    isValid = false;
  } else if (isValid) {
    // Create data object to send to endpoint
    var data = {
      email: parseEmail,
      password: password,
    };
    const csrfToken = await getCsrfToken();
    fetch("http://localhost:8000/user/reset", {
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
          "Success:", data;
          showSuccessMessage(data?.message, "success");
        } else {
          showSuccessMessage(data?.error, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", "error");
      });
  } else {
  }
};

document.getElementById("submit-btn").addEventListener("click", submitForm);
