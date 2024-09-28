import { API_KEY } from './api.js'; // Import your API key

// Function to get the username from the URL
function getUsernameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('username'); // Ensure you have a query parameter named 'username'
}

// Function to fetch user profile by username
async function fetchUserProfile(username, token) {
    const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${username}`, {
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

// Function to fetch posts by username
async function fetchUserPosts(username, token) {
    const response = await fetch(`https://v2.api.noroff.dev/social/posts?author=${username}`, {
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

// Function to display user profile details and posts
async function displayUserProfile() {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    const username = getUsernameFromUrl(); // Get the username from URL

    if (!token) {
        console.error('No access token found. Please log in first.');
        document.getElementById('user-profile').innerHTML = '<p>Please log in to view profiles.</p>';
        return;
    }

    if (!username) {
        document.getElementById('user-profile').innerHTML = '<p>No user found.</p>';
        return;
    }

    try {
        const userProfile = await fetchUserProfile(username, token); // Fetch user profile data
        const userPosts = await fetchUserPosts(username, token); // Fetch user posts data

        // Log the username and posts data
        console.log('Fetching posts for user:', username);
        console.log('User Posts Response:', userPosts); // Log user posts response

        // Ensure we have a valid user profile
        if (!userProfile.data) {
            document.getElementById('user-profile').innerHTML = '<p>User not found.</p>';
            return;
        }

        // Construct the HTML to display user profile information
        const profileHtml = `
            <h1>${userProfile.data.name}</h1>
            <img src="${userProfile.data.avatar.url}" alt="${userProfile.data.avatar.alt}" style="width: 150px; height: 150px; border-radius: 50%;">
            <p>Email: ${userProfile.data.email}</p>
            <p>Bio: ${userProfile.data.bio || 'No bio available'}</p>
            <p>Posts: ${userProfile.data._count.posts}</p>
            <p>Followers: ${userProfile.data._count.followers}</p>
            <p>Following: ${userProfile.data._count.following}</p>
            <div class="banner-container">
                <img src="${userProfile.data.banner.url}" alt="${userProfile.data.banner.alt}" style="width: 100%; height: auto;">
            </div>
        `;
        document.getElementById('user-profile').innerHTML = profileHtml;

        // Ensure we have valid user posts
        if (userPosts.data && userPosts.data.length > 0) {
            const postsHtml = userPosts.data.map(post => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <p><strong>Created on:</strong> ${new Date(post.created).toLocaleString()}</p>
                    <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
                </div>
            `).join('');

            document.getElementById('user-posts').innerHTML = `<h2>User Posts</h2>${postsHtml}`;
        } else {
            document.getElementById('user-posts').innerHTML = '<p>No posts available for this user.</p>';
        }

    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        document.getElementById('user-profile').innerHTML = '<p>Error loading user profile.</p>';
    }
}

// Call displayUserProfile when the page loads
window.onload = displayUserProfile; // Ensure this function runs on page load
