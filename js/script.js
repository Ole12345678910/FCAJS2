import { fetchApi, myApiKey } from "./api.js";
import {
  toggleLoginLogout,
  checkLoginStatus,
  postButton,
} from "./utility.js";

function showButton() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    document.getElementById("show-button").style.display = "inline-block";
  }
}

showButton();

postButton();

// Fetch and display other posts
fetchApi(myApiKey)
  .then((response) => {
    const postsContainer = document.getElementById("posts");

    if (
      response &&
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      response.data.forEach((post) => {
        const postId = post.id;
        const tags = post.tags;
        const title = post.title;
        const media = post.media.url;

        const postElement = document.createElement("div");
        postElement.classList.add("post-main");
        postElement.innerHTML = `
              <figure class="post-image-main-container">
              <img src="${media}" alt="${media.alt}" class="post-image-main">
              <figcaption class="info-box">
                <h2 class="title-main">${title}</h2>
                <p class="read-more-main">Read more</p>
                <section class="tags-main-box">
                  <p class="tags-main">${tags}</p>
                </section>
              </figcaption>
            </figure>      
          `;

        postElement.addEventListener("click", () => {
          window.location.href = `/details.html?id=${postId}`;
        });

        postsContainer.appendChild(postElement);
      });
    } else {
      postsContainer.innerHTML = "<p>No posts found.</p>";
    }
  })
  .catch((error) => {
    console.error("Fetch operation failed:", error);
  });

// Call checkLoginStatus function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

// Use toggleLoginLogout function when a logout button is clicked
const logoutButton = document.getElementById("login-logout-btn");
logoutButton.addEventListener("click", toggleLoginLogout);
