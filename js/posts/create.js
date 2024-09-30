// Assuming createPost is exported from your API module
import { createPost } from '../api/api.js';

// Set up form submission handler when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createPostForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const tags = document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim());
    const mediaUrl = document.getElementById("mediaUrl").value;
    const mediaAlt = document.getElementById("mediaAlt").value;

    const postData = {
      title,
      body,
      tags,
      media: {
        url: mediaUrl,
        alt: mediaAlt,
      },
    };

    const success = await createPost(postData); // Call the createPost function with the gathered data
    if (success) {
      // Redirect to the user profile page after successfully creating the post
      window.location.href = '/templates/user/profile.html'; // Redirect to user profile page
    }
  });
});
