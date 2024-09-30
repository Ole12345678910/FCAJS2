// posts.js

import { fetchFollowedPostsApi } from '../api/api.js'; // Import the API function
import { renderPosts } from '../utils/utils.js';


// Function to fetch posts from followed users and render them
async function fetchFollowedPosts() {
    const token = localStorage.getItem('accessToken'); // Retrieve token

    if (!token) {
        console.error('No access token found. Please log in first.');
        document.getElementById('posts-container').innerHTML = '<p>Please log in to see posts from followed users.</p>';
        return;
    }

    try {
        const data = await fetchFollowedPostsApi(token); // Call the API function from api.js
        renderPosts(data.data); // Render the fetched posts data
    } catch (error) {
        if (error.message.includes('401')) {
            console.error('Unauthorized! Please log in again.');
            document.getElementById('posts-container').innerHTML = '<p>Your session has expired. Please log in again.</p>';
        } else {
            console.error('Error fetching followed posts:', error.message);
            document.getElementById('posts-container').innerHTML = '<p>Error fetching posts. Please try again.</p>';
        }
    }
}

// Initialize function to load the app
async function initApp() {
    await fetchFollowedPosts(); // Then fetch posts
}

// Ensure the DOM is fully loaded before running the app
document.addEventListener('DOMContentLoaded', initApp);
