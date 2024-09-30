// Import necessary API functions and utilities
import { API_KEY, API_BASE } from "../constants/config.js";
import { followUser, unfollowUser } from '../api/api.js';
import { renderProfile } from "../utils/utils.js"; // Import renderProfile utility

// Retrieves the username from the URL query parameters
function getUsernameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username'); // Get username from URL
    console.log('Username from URL:', username); // Debug log
    return username; // Return the username
}

/**
 * Fetches the user profile data from the API.
 * @param {string} username - The username of the profile to fetch.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<Object>} The user profile data.
 */
async function fetchUserProfile(username, token) {
    if (!username) {
        throw new Error('Username is undefined'); // Added error handling
    }

    const response = await fetch(`${API_BASE}/social/profiles/${username}?_following=true&_followers=true&_posts=true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
    }

    return await response.json(); // Return the JSON response
}

/**
 * Fetches the posts made by the user.
 * @param {string} username - The username of the profile to fetch posts for.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<Array>} The array of user posts.
 */
async function fetchUserPosts(username, token) {
    const response = await fetch(`${API_BASE}/social/profiles/${username}/posts`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user posts: ${response.status} ${response.statusText}`);
    }

    return await response.json(); // Return the JSON response
}

/**
 * Sets up the follow and unfollow buttons with their event listeners.
 * @param {string} token - The access token for authentication.
 * @param {string} username - The username of the profile to follow/unfollow.
 */
function setupFollowUnfollowButtons(token, username) {
    // Show both buttons
    document.getElementById('follow-button').style.display = 'inline';  
    document.getElementById('unfollow-button').style.display = 'inline'; 

    // Add event listener for following the user
    document.getElementById('follow-button').addEventListener('click', async () => {
        const success = await followUser(username, token);
        if (success) {
            alert('You are now following this user!');
            window.location.reload(); // Refresh the page to show updated state
        } else {
            alert('Failed to follow user. Please try again.');
        }
    });

    // Add event listener for unfollowing the user
    document.getElementById('unfollow-button').addEventListener('click', async () => {
        const success = await unfollowUser(username, token);
        if (success) {
            alert('You have unfollowed this user!');
            window.location.reload(); // Refresh the page to show updated state
        } else {
            alert('Failed to unfollow user. Please try again.');
        }
    });
}

/**
 * Displays the user profile and their posts on the page.
 */
async function displayUserProfile() {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
    const username = getUsernameFromUrl(); // Get the username from URL

    // Validate access token and username
    if (!token) {
        displayLoginMessage();
        return;
    }

    if (!username) {
        displayNoUserMessage();
        return;
    }

    try {
        const userProfile = await fetchUserProfile(username, token); // Fetch user profile data
        const userPosts = await fetchUserPosts(username, token); // Fetch user posts

        // Validate user profile data
        if (!userProfile.data) {
            displayUserNotFoundMessage();
            return;
        }

        // Render the user profile information
        renderProfile(userProfile.data); // Use the imported renderProfile function

        // Display the user posts
        displayUserPosts(userPosts.data);

        // Set up follow/unfollow buttons
        setupFollowUnfollowButtons(token, username);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        displayErrorMessage();
    }
}

/**
 * Displays the user posts in the UI.
 * @param {Array} posts - The array of user posts to display.
 */
function displayUserPosts(posts) {
    const postsHtml = posts.length ? `
        <h2>Posts</h2>
        <div id="user-posts">
            ${posts.map(createPostHtml).join('')} <!-- Create HTML for each post -->
        </div>
    ` : '<p>No posts available.</p>';

    document.getElementById('user-posts').innerHTML = postsHtml; // Display posts in the 'user-posts' container
}

/**
 * Creates HTML for an individual post.
 * @param {Object} post - The post data to create HTML for.
 * @returns {string} The HTML representation of the post.
 */
function createPostHtml(post) {
    return `
        <div class="post">
            <h3><a href="/templates/posts/details.html?postId=${post.id}">${post.title}</a></h3>
            <p>${post.body}</p>
            ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt || 'Post Image'}" style="max-width:100%;">` : ''}
            <p>Tags: ${post.tags ? post.tags.join(', ') : 'None'}</p>
            <p>Created: ${new Date(post.created).toLocaleString()}</p>
            <p>Comments: ${post._count?.comments || 0}</p>
            <p>Reactions: ${post._count?.reactions || 0}</p>
        </div>
    `;
}

// Initialize the profile display when the script is loaded
displayUserProfile();
