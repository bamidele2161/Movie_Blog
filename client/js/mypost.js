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
  const savedTime = localStorage.getItem("expirationTime");
  const currentTime = Date.now();
  if (currentTime > new Date(savedTime).getTime()) {
    //clear storage
    localStorage.clear();
    //navigate to login
    window.location.href = "../html/login.html";
  } else {
    fetch("http://localhost:8000/movie/user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          data?.data?.forEach((item) => {
            const moviePost = `

                <div class="post-box" key=${item.id}>
                 <img src=${item?.image} alt="" class="post-img" /> 
                <!-- <h2 class="category">Tech</h2> -->
                <a href="../html/details.html" class="post-title" data-id="${
                  item.id
                }">${item.title}</a>
                <span class="post-date">${item.created_at.slice(0, 10)}</span>
                <p class="post-description">
                ${item.body}
                </p>
                <div class="movie-btns">
                    <button
                    class="delete-btn"
                    data-id="${item.id}"
                    >
                    Delete
                    </button>
                    <a
                    href="../html/post.html"
                    class="update-btn"
                    data-item='${JSON.stringify(item)}'
                    >Update</a
                    >
                </div>
                </div>

            `;

            document.getElementById("movies-section").innerHTML += moviePost;
          });
          document.querySelectorAll(".post-title").forEach((btn) => {
            btn.addEventListener("click", viewPost);
          });

          document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", deleteMoviePost);
          });

          document.querySelectorAll(".update-btn").forEach((btn) => {
            btn.addEventListener("click", updateMoviePost);
          });
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

//function to view post details
const viewPost = async (e) => {
  const postId = e.target.dataset.id;
  localStorage.setItem("postId", JSON.stringify(postId));
};

// Function to delete a movie post
const deleteMoviePost = async (e) => {
  const csrfToken = await getCsrfToken();
  const postId = e.target.dataset.id;
  fetch(`http://localhost:8000/movie/${postId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        showNotification(data.message, "success");
        // Remove the deleted movie post card from the UI
        e.target.closest(".post-box").remove();
      } else {
        // showNotification(data.error + " Please Sign In", "error");
        // window.location.href = "../html/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Function to update a movie post
const updateMoviePost = (e) => {
  e.stopPropagation();
  const movieItem = JSON.parse(e.target.getAttribute("data-item"));
  localStorage.setItem("movieItem", JSON.stringify(movieItem));
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
