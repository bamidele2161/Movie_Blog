// Function to display success or error messages

const showNotification = (message, type) => {
  const notificationElement =
    type === "success"
      ? document.getElementById("success")
      : document.getElementById("error");
  notificationElement.textContent = message;
  notificationElement.style.display = "block";

  // Hide the notification after a certain duration (e.g., 3 seconds)
  setTimeout(() => {
    notificationElement.style.display = "none";
  }, 3000); // 3000 milliseconds = 3 seconds
};

// Function to fetch CSRF token
const getCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/csrf-token", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      showNotification(
        "Failed to fetch CSRF token: " + response.status,
        "error"
      );
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    showNotification("Error during fetching CSRF token:", error);
    // Handle the error appropriately, e.g., show an error message to the user
  }
};

// Function to submit form and fetch movie posts
const submitForm = () => {
  // Retrieve movie item from local storage
  const postId = JSON.parse(localStorage.getItem("postId"));

  const savedTime = localStorage.getItem("expirationTime");
  const currentTime = Date.now();
  if (currentTime > new Date(savedTime).getTime()) {
    //clear storage
    localStorage.clear();
    //navigate to login
    window.location.href = "../html/login.html";
  } else {
    fetch(`http://localhost:8000/movie/${postId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const moviePost = `
                  <div class="post-box" key=${data.data.id}>
                  <img src=${data?.data?.image} alt="" class="post-img" /> 
                  <!-- <h2 class="category">Tech</h2> -->
                  <a href="../html/details.html" class="post-title" data-id="${
                    data.data.id
                  }">${data.data.title}</a>
                  <span class="post-date">${data.data.created_at.slice(
                    0,
                    10
                  )}</span>
                  <p class="post-details-description">
                  ${data.data.body}
                  </p>
                  </div>
              `;

          document.getElementById("movies-section").innerHTML += moviePost;
        } else {
          showNotification(
            data.error + " No Post, Please create post",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};

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
        showNotification(data.message, "success");
        window.location.href = "../html/login.html";
      }
    });
};

// Event listener to load form submission and movie posts on page load
window.addEventListener("load", submitForm);

// Event listener for logout button click
document.getElementById("logout").addEventListener("click", handleLogout);
