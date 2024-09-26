// Base URL for the API
export const API_BASE_URL = "https://v2.api.noroff.dev/";

// Function to toggle between login and logout
export function toggleLoginLogout() {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // If logged in, perform logout actions
    localStorage.clear(); // Clear local storage
    window.location.href = "/index.html"; // Redirect to index page
  } else {
    // If not logged in, redirect to the login page
    window.location.href = "/account/login.html";
  }
}

// Function to check if the user is logged in
export function checkLoginStatus() {
  const accessToken = localStorage.getItem("accessToken");
  const loginButton = document.getElementById("login-logout-btn");

  if (accessToken) {
    // If logged in, change button text to "Logout" and add event listener
    loginButton.textContent = "Logout";
    loginButton.addEventListener("click", toggleLoginLogout);
  } else {
    // If not logged in, keep button text as "Login" and add event listener
    loginButton.textContent = "Login";
    loginButton.addEventListener("click", () => {
      window.location.href = "/account/login.html";
    });
  }
}

// Call checkLoginStatus function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);


// Function to show buttons based on certain conditions (e.g., after login)
export function showName() {
  const accessToken = localStorage.getItem("accessToken");
  const blogName = localStorage.getItem("name");
  if (accessToken) {
    document.getElementById("blogName").innerHTML = "Welcome " + blogName;
  }
}
showName();

// Function to create a new post
export async function createPost(token, postData) {
  try {
    const response = await fetch(`${API_BASE_URL}blog/posts/ole123`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create post. Status: ${response.status}`);
    }

    const responseData = await response.json();
    alert("Post created successfully:", responseData);
    return responseData; // Return the created post data if needed
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Function to retrieve access token from local storage
export function tokenLocalStor() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found in local storage");
  }
  return token;
}

// Delete a post
export async function deletePost(token, postId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}blog/posts/ole123/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete post. Status: ${response.status}`);
    }

    alert("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// Update the post on the server
export async function updatePost(token, postId, postData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}blog/posts/ole123/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to save edited post: ${response.statusText}`);
    }

    alert("Post edited successfully");
  } catch (error) {
    console.error("Error saving edited post:", error);
  }
}

// Create post button
export function postButton() {
  document.addEventListener("DOMContentLoaded", () => {
    const createPostBtn = document.getElementById("create-post-btn");

    createPostBtn.addEventListener("click", async () => {
      try {
        const token = tokenLocalStor();
        const title = document.getElementById("title").value;
        const body = document.getElementById("body").value;
        const tags = document
          .getElementById("tags")
          .value.split(",")
          .map((tag) => tag.trim());
        const mediaUrl = document.getElementById("media-url").value;
        const mediaAlt = document.getElementById("media-alt").value;

        const postData = {
          title,
          body,
          tags,
          media: {
            url: mediaUrl,
            alt: mediaAlt,
          },
        };

        await createPost(token, postData);

        // Refresh the page after successfully creating the post
        window.location.reload();
      } catch (error) {
        console.error("Error creating post:", error);
      }
    });
  });
}

