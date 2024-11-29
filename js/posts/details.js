// Import necessary API functions and utilities
import {
  fetchPostDetails,
  fetchAuthorProfile,
  addComment,
  deleteComment,
  reactToPost,
} from "../api/api.js";

/**
 * Retrieves the post ID from the URL.
 * @returns {string|null} The post ID or null if not found.
 */
const getPostIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId"); // Retrieve the postId from the URL
};

/**
 * Displays the details of the post, including title, body, media, tags, comments, and reactions.
 * It fetches the post details and updates the HTML content of the page accordingly.
 * @async
 * @returns {Promise<void>}
 */
const displayPostDetails = async () => {
  const token = localStorage.getItem("accessToken");
  const postId = getPostIdFromUrl();

  if (!token) {
    console.error("No access token found. Please log in first.");
    return;
  }

  if (!postId) {
    document.getElementById("post-details").innerHTML =
      "<p>No post ID found in the URL.</p>";
    return;
  }

  try {
    const post = await fetchPostDetails(postId, token);

    if (!post.data) {
      document.getElementById("post-details").innerHTML =
        "<p>Post not found.</p>";
      return;
    }

    const {
      title,
      body,
      media,
      tags,
      created,
      _count,
      reactions,
      comments = [],
    } = post.data;
    const author = post.data.author || {};
    const authorName = author.name || "Unknown";
    const authorUsername = author.username || authorName;

    const postHtml = `
<div class="card post">
    <h2 class="text-3xl font-semibold text-gray-900 mb-4">${title}</h2>
    
    <p class="text-lg text-gray-700 mb-4">${body}</p>
      <div class="flex justify-center">
        ${
          media
            ? `<img class="w-full h-auto object-cover mb-4 rounded-lg" src="${media.url}" alt="${media.alt}"/>`
            : ""
        }
      </div>
    <p class="text-sm text-gray-600 mb-2"><strong>Tags:</strong> ${tags.join(
      ", "
    )}</p>

    <p class="text-sm text-gray-600 mb-2"><strong>Created:</strong> ${new Date(
      created
    ).toLocaleString()}</p>

    <p class="text-sm text-gray-600 mb-2"><strong>Author:</strong> <a href="#" class="text-blue-600 hover:underline" id="author-link">${authorName}</a></p>

    ${
      author.avatar
        ? `<img src="${author.avatar.url}" alt="${author.avatar.alt}" class="w-12 h-12 rounded-full mb-4" />`
        : ""
    }


    <p class="text-sm text-gray-600 mb-4"><strong>Comments:</strong> ${
      _count.comments
    }</p>


    <p class="font-semibold text-gray-900 mb-2">Reactions:</p>
    <ul id="reaction-list" class="list-disc pl-5 text-sm text-gray-600 mb-4">
        ${reactions
          .map(
            (reaction) => `
            <li>${reaction.symbol}: ${reaction.count} (${reaction.reactors.join(
              ", "
            )})</li>
        `
          )
          .join("")}
    </ul>


    <div id="reaction-section" class="flex justify-center flex-wrap md:flex-nowrap space-x-2 md:space-x-4 mb-6">
        ${["👍", "❤️", "😂", "😮", "😢", "😡"]
          .map(
            (symbol) => `
            <button class="reaction-btn text-xl md:text-2xl hover:bg-gray-200 p-1 md:p-2 rounded-lg" data-symbol="${symbol}">
                ${symbol}
            </button>
          `
          )
          .join("")}
    </div>
</div>

<h3 class="card text-2xl font-semibold text-gray-900 mb-4">Comments</h3>
<div id="comments-section" class="card space-y-4 mb-6">
    <!-- Example of a comment -->
    <div class="comment p-4 bg-gray-50 rounded-lg shadow-sm">
        <p class="font-semibold text-gray-800">Jane Doe</p>
        <p class="text-gray-600">Great post! I learned a lot.</p>
        <p class="text-sm text-gray-500">Posted on January 2, 2024</p>
    </div>
    <!-- More comments will be dynamically added here -->
</div>

<form id="comment-form" class="card bg-card-color p-4 rounded-lg shadow-md">
    <textarea id="comment-body" placeholder="Add a comment..." class="bg-light-card-color w-full p-4 border border-gray-300 rounded-lg mb-4 resize-none" rows="4"></textarea>
    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Submit Comment</button>
</form>

        `;

    document.getElementById("post-details").innerHTML = postHtml;

    // Add event listeners
    document.getElementById("author-link").addEventListener("click", (e) => {
      e.preventDefault();
      handleAuthorClick(authorUsername);
    });

    await displayComments(comments, postId, token);

    document
      .getElementById("comment-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        await handleCommentSubmit(postId, token);
      });

    document.querySelectorAll(".reaction-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const symbol = e.target.dataset.symbol;
        await handleReaction(postId, symbol, token);
      });
    });
  } catch (error) {
    console.error("Error fetching post details:", error.message);
    document.getElementById("post-details").innerHTML =
      "<p>Error fetching post details.</p>";
  }
};

/**
 * Handles the author link click event.
 * Fetches the author's profile and redirects to the author's page.
 * @async
 * @param {string} authorUsername - The username of the author.
 * @returns {Promise<void>}
 */
const handleAuthorClick = async (authorUsername) => {
  const token = localStorage.getItem("accessToken");

  if (!authorUsername) {
    console.error("Username is not defined for the author");
    return;
  }

  try {
    await fetchAuthorProfile(authorUsername, token);
    window.location.href = `/templates/user/user.html?username=${encodeURIComponent(
      authorUsername
    )}`;
  } catch (error) {
    console.error("Error fetching author profile:", error.message);
  }
};

/**
 * Displays the comments for the post.
 * @async
 * @param {Array} comments - The array of comment objects.
 * @param {string} postId - The ID of the post.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const displayComments = async (comments, postId, token) => {
  const commentsSection = document.getElementById("comments-section");
  if (!comments.length) {
    commentsSection.innerHTML = "<p>No comments available.</p>";
    return;
  }

  const commentsHtml = comments
    .map(
      (comment) => `
        <div class="comment" id="comment-${comment.id}">
            <p><strong>${comment.author?.name || comment.owner}</strong>: ${
        comment.body
      }</p>
            ${
              comment.author?.avatar
                ? `<img src="${comment.author.avatar.url}" style="width: 30px; height: 30px; border-radius: 50%;">`
                : ""
            }
            <p><small>Posted on: ${new Date(
              comment.created
            ).toLocaleString()}</small></p>
            <button class="delete-comment-btn" data-comment-id="${
              comment.id
            }">Delete</button>
        </div>
    `
    )
    .join("");

  commentsSection.innerHTML = commentsHtml;

  document.querySelectorAll(".delete-comment-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const commentId = e.target.dataset.commentId;
      await handleCommentDelete(postId, commentId, token);
    });
  });
};

/**
 * Handles the submission of a new comment.
 * @async
 * @param {string} postId - The ID of the post to which the comment is being added.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const handleCommentSubmit = async (postId, token) => {
  const commentBody = document.getElementById("comment-body").value;

  if (!commentBody.trim()) {
    alert("Comment cannot be empty!");
    return;
  }

  try {
    await addComment(postId, commentBody, token);
    document.getElementById("comment-body").value = "";
    await displayPostDetails();
  } catch (error) {
    console.error("Error adding comment:", error.message);
  }
};

/**
 * Handles the deletion of a comment.
 * @async
 * @param {string} postId - The ID of the post from which the comment is being deleted.
 * @param {string} commentId - The ID of the comment to delete.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const handleCommentDelete = async (postId, commentId, token) => {
  try {
    await deleteComment(postId, commentId, token);
    document.getElementById(`comment-${commentId}`).remove(); // Remove the comment from the DOM
  } catch (error) {
    console.error("Error deleting comment:", error.message);
  }
};

/**
 * Handles adding a reaction to a post.
 * @async
 * @param {string} postId - The ID of the post to which the reaction is being added.
 * @param {string} symbol - The reaction symbol (e.g., 👍, ❤️).
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const handleReaction = async (postId, symbol, token) => {
  try {
    await reactToPost(postId, symbol, token);
    await displayPostDetails();
  } catch (error) {
    console.error("Error adding reaction:", error.message);
  }
};

// Call displayPostDetails on page load
document.addEventListener("DOMContentLoaded", displayPostDetails);
