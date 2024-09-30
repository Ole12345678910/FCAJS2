import { API_KEY,API_BASE } from "../constants/config.js";
import { createPostHtml } from "../utils/utils.js";
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


// Function to follow a user
async function followUser(token, username) {
    try {
        const response = await fetch(`${API_BASE}/social/profiles/${username}/follow`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        const responseBody = await response.json();

        if (!response.ok) {
            console.error('Failed to follow user:', responseBody);
            alert(`Error: ${responseBody.errors ? responseBody.errors.map(e => e.message).join(', ') : 'Unknown error occurred.'}`);
        } else {
            console.log('Successfully followed user:', responseBody.data);
            alert('You are now following this user!');
            window.location.reload(); // Refresh the page to show updated state
        }
    } catch (error) {
        console.error('Error following user:', error.message);
        alert(`Error: ${error.message}`);
    }
}

// Function to unfollow a user
async function unfollowUser(token, username) {
    try {
        const response = await fetch(`${API_BASE}/social/profiles/${username}/unfollow`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        const responseBody = await response.json();

        if (!response.ok) {
            console.error('Failed to unfollow user:', responseBody);
            alert(`Error: ${responseBody.errors ? responseBody.errors.map(e => e.message).join(', ') : 'Unknown error occurred.'}`);
        } else {
            console.log('Successfully unfollowed user:', responseBody.data);
            alert('You have unfollowed this user!');
            window.location.reload(); // Refresh the page to show updated state
        }
    } catch (error) {
        console.error('Error unfollowing user:', error.message);
        alert(`Error: ${error.message}`);
    }
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

        // Display the user profile information
        displayUserProfileInfo(userProfile.data);

        // Display the user posts
        displayUserPosts(userPosts.data);

        // Set up follow/unfollow buttons
        setupFollowUnfollowButtons(token, username);

    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        displayErrorMessage();
    }
}

// Helper function to display login message
function displayLoginMessage() {
    console.error('No access token found. Please log in first.');
    document.getElementById('user-profile').innerHTML = '<p>Please log in to view profiles.</p>';
}

// Helper function to display no user found message
function displayNoUserMessage() {
    document.getElementById('user-profile').innerHTML = '<p>No user found.</p>';
}

// Helper function to display user not found message
function displayUserNotFoundMessage() {
    document.getElementById('user-profile').innerHTML = '<p>User not found.</p>';
}

// Helper function to display error message
function displayErrorMessage() {
    document.getElementById('user-profile').innerHTML = '<p>Error loading user profile.</p>';
}

// Helper function to display user profile info
function displayUserProfileInfo(data) {
    const profileHtml = `
        <h1>${data.name}</h1>
        <img src="${data.avatar.url}" alt="${data.avatar.alt}" style="width: 150px; height: 150px; border-radius: 50%;">
        <p>Email: ${data.email}</p>
        <p>Bio: ${data.bio || 'No bio available'}</p>
        <p>Posts: ${data._count.posts}</p>
        <p>Followers: ${data._count.followers}</p>
        <p>Following: ${data._count.following}</p>
        <div class="banner-container">
            <img src="${data.banner.url}" alt="${data.banner.alt}" style="width: 100%; height: auto;">
        </div>
        <div id="follow-unfollow-buttons">
            <button id="follow-button">Follow</button>
            <button id="unfollow-button">Unfollow</button>
        </div>
    `;

    // Display profile information
    document.getElementById('user-profile').innerHTML = profileHtml;
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


// Helper function to set up follow/unfollow buttons
function setupFollowUnfollowButtons(token, username) {
    // Always show both buttons
    document.getElementById('follow-button').style.display = 'inline';  
    document.getElementById('unfollow-button').style.display = 'inline'; 

    // Add event listeners to both buttons
    document.getElementById('follow-button').addEventListener('click', () => followUser(token, username));
    document.getElementById('unfollow-button').addEventListener('click', () => unfollowUser(token, username));
}



// Call displayUserProfile when the page loads
window.onload = displayUserProfile; // Ensure this function runs on page load
createPostHtml();
