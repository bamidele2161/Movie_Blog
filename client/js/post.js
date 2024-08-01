// Retrieve input field values
const title = document.getElementById("title");
const body = document.getElementById("body");

let fileLink;
let bannerPreview = document.getElementById("banner-preview");
const convertToLink = async (image) => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "t7wur6tn");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dgqbdxvnr/image/upload`,
    {
      method: "post",
      body: data,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });

  return await res;
};

const handleFile = async (e) => {
  try {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      bannerPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
    const link = await convertToLink(file);

    fileLink = link?.url;
    // showSuccessMessage("File Uploaded successfully", "success");
  } catch (error) {}
};

const checkSession = () => {
  const savedTime = localStorage.getItem("expirationTime");
  const currentTime = Date.now();
  if (currentTime > new Date(savedTime).getTime()) {
    //clear storage
    localStorage.clear();
    //navigate to login
    window.location.href = "../html/login.html";
  }
};

// Function to display success or error messages
const showMessage = (message, type, redirectURL) => {
  const notificationElement =
    type === "success"
      ? document.getElementById("success")
      : document.getElementById("error");

  notificationElement.textContent = message;
  notificationElement.style.display = "block";

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notificationElement.style.display = "none";
    if (type === "success" && redirectURL) {
      window.location.href = redirectURL;
    }
  }, 3000);
};

// Function to fetch CSRF token
const getCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/csrf-token", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      showMessage("Failed to fetch CSRF token: " + response.status, "error");
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    showMessage("Error during fetching CSRF token:", "error", null);
  }
};

// Function to handle form submission
const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent the default form submission

  const csrfToken = await getCsrfToken();

  // Create data object to send to endpoint
  const data = {
    title: title.value,
    body: body.value,
    image: fileLink,
  };

  // Send POST request to create a new movie post
  fetch(`http://localhost:8000/movie`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        showMessage(data?.message, "success", "../html/mypost.html");
      } else if (data.statusCode === 400) {
        showMessage(data?.error, "error", null);
      } else if (data.error) {
        showMessage(data?.error, "error", null);
      } else {
        // showMessage(
        //   data.error + " Please Sign In",
        //   "error",
        //   "../html/login.html"
        // );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

//Function to update form
const handleUpdate = async (localMovie) => {
  // Populate form fields with movie item details

  // Create data object to send to endpoint
  const csrfToken = await getCsrfToken();
  const data = {
    title: title.value,
    body: body.value,
    image: !fileLink ? localMovie.image : fileLink,
  };

  // Send PUT request to update movie post
  fetch(`http://localhost:8000/movie/${localMovie.id}`, {
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
        showMessage(data?.message, "success", "../html/mypost.html");
        localStorage.removeItem("movieItem");
      } else {
        // showMessage(data.error + " Please Sign In", "error");
        // window.location.href = "../html/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Retrieve movie item from local storage
const localMovie = JSON.parse(localStorage.getItem("movieItem"));

// Check if a movie item exists in local storage
if (localMovie !== null) {
  title.value = localMovie.title;
  body.value = localMovie.body;
  bannerPreview.src = localMovie.image;
  // Add event listener to update movie post when publish button is clicked
  document
    .getElementById("submit-btn")
    .addEventListener("click", () => handleUpdate(localMovie));
} else {
  // If no movie item exists in local storage, add event listener to submit form
  document.getElementById("submit-btn").addEventListener("click", handleSubmit);
}

// Function to handle logout
const handleLogout = () => {
  document.cookie = "";
  localStorage.clear();

  fetch("http://localhost:8000/user/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        showMessage(data?.message, "success", "../html/login.html");
      } else {
        // Handle other cases if needed
      }
    });
};

// Add event listeners
document.getElementById("banner-upload").addEventListener("change", handleFile);
window.addEventListener("load", checkSession); // check session when the window loads
document.getElementById("logout").addEventListener("click", handleLogout);
