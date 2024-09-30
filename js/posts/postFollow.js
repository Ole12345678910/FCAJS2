// Import necessary API functions and utilities
import { fetchFollowedPostsApi } from '../api/api.js'; 
import { renderPosts } from '../utils/utils.js';

/**
 * Fetch posts from followed users and render them.
 * @returns {Promise<void>}
 */
async function fetchFollowedPosts() {
    const token = localStorage.getItem('accessToken'); // Retrieve token

    // Check if the user is authenticated
    if (!token) {
        console.error('No access token found. Please log in first.');
        document.getElementById('posts-container').innerHTML = '<p>Please log in to see posts from followed users.</p>';
        return;
    }

    try {
        const data = await fetchFollowedPostsApi(token); // Call the API function
        renderPosts(data.data); // Render the fetched posts data
    } catch (error) {
        handleFetchError(error); // Handle errors during the fetch
    }
}

/**
 * Handle errors that occur during the fetch operation.
 * @param {Error} error - The error object caught during the fetch operation.
 */
function handleFetchError(error) {
    if (error.message.includes('401')) {
        console.error('Unauthorized! Please log in again.');
        document.getElementById('posts-container').innerHTML = '<p>Your session has expired. Please log in again.</p>';
    } else {
        console.error('Error fetching followed posts:', error.message);
        document.getElementById('posts-container').innerHTML = '<p>Error fetching posts. Please try again.</p>';
    }
}

/**
 * Initialize the application by fetching followed posts.
 * @returns {Promise<void>}
 */
async function initApp() {
    await fetchFollowedPosts(); // Fetch followed posts
}

// Ensure the DOM is fully loaded before running the app
document.addEventListener('DOMContentLoaded', initApp);
