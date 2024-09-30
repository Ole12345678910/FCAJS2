import { API_KEY, API_BASE } from "../constants/config.js";
import { followUser, unfollowUser } from '../api/api.js';
import { renderProfile } from "../utils/utils.js"; // Import renderProfile

// Function to get the username from the URL
function getUsernameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username'); // Get username from URL
    console.log('Username from URL:', username); // Debug log
    return username; // Return the username
}

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

// Function to fetch user posts by username
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

// Function to set up follow/unfollow buttons
function setupFollowUnfollowButtons(token, username) {
    // Always show both buttons
    document.getElementById('follow-button').style.display = 'inline';  
    document.getElementById('unfollow-button').style.display = 'inline'; 

    // Add event listeners to both buttons
    document.getElementById('follow-button').addEventListener('click', async () => {
        const success = await followUser(username, token);
        if (success) {
            alert('You are now following this user!');
            window.location.reload(); // Refresh the page to show updated state
        } else {
            alert('Failed to follow user. Please try again.');
        }
    });

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

// Function to display user profile details and posts
async function displayUserProfile() {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    const username = getUsernameFromUrl(); // Get the username from URL

    // Check for access token
    if (!token) {
        displayLoginMessage();
        return;
    }

    // Check for username
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

        // Display the user profile information using renderProfile
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


// Helper function to display user posts
function displayUserPosts(posts) {
    const postsHtml = posts.length ? `
        <h2>Posts</h2>
        <div id="user-posts">
            ${posts.map(post => createPostHtml(post)).join('')}
        </div>
    ` : '<p>No posts available.</p>';

    document.getElementById('user-posts').innerHTML = postsHtml; // Display posts in the 'user-posts' container
}

// Helper function to create HTML for individual post
function createPostHtml(post) {
    return `
        <div class="post">
            <h3><a href="/templates/posts/details.html?postId=${post.id}">${post.title}</a></h3>
            <p>${post.body}</p>
            ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" style="max-width:100%;">` : ''}
            <p>Tags: ${post.tags ? post.tags.join(', ') : 'None'}</p>
            <p>Created: ${new Date(post.created).toLocaleString()}</p>
            <p>Comments: ${post._count?.comments || 0}</p>
            <p>Reactions: ${post._count?.reactions || 0}</p>
        </div>
    `;
}

displayUserProfile();

