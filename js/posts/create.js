// Import necessary API functions
import { createPost } from '../api/api.js';

/**
 * Set up form submission handler for creating a post when the DOM content is fully loaded.
 * Gathers form data, calls the `createPost` API function, and redirects the user upon success.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createPostForm");
  
  /**
   * Handle form submission for creating a post.
   * Prevents the default form submission and gathers the input data for API call.
   * 
   * @param {Event} event - The form submission event.
   */
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Gather data from form fields
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const tags = document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim()); // Split the tags by commas and trim whitespace
    const mediaUrl = document.getElementById("mediaUrl").value;
    const mediaAlt = document.getElementById("mediaAlt").value;

    // Construct the post data object to send to the API
    const postData = {
      title,
      body,
      tags,
      media: {
        url: mediaUrl,
        alt: mediaAlt,
      },
    };

    // Call the createPost function with the gathered data and await its result
    const success = await createPost(postData); 
    if (success) {
      // Redirect to the user profile page after successfully creating the post
      window.location.href = '/templates/user/profile.html'; // Adjust the path as needed
    }
  });
});
