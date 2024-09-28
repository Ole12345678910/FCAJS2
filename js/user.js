import { API_KEY } from './api.js'; // Import your API key

// Function to get the username from the URL
function getUsernameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('username'); // Ensure you have a query parameter named 'username'
}

// Function to fetch user profile by username
async function fetchUserProfile(username, token) {
    const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${username}?_following=true&_followers=true&_posts=true`, {
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
    const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${username}/posts`, {
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

// Function to check if the logged-in user is following the specified user
async function isUserFollowed(username, token) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/profiles/me/following`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch following users:', response.status);
            return false;
        }

        const followingData = await response.json();
        // Check if the username exists in the following list
        return followingData.data.some(user => user.name === username);
    } catch (error) {
        console.error('Error checking if user is followed:', error.message);
        return false;
    }
}

// Function to follow a user
async function followUser(token, username) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${username}/follow`, {
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
        const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${username}/unfollow`, {
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
        const userPosts = await fetchUserPosts(username, token); // Fetch user posts

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
            <div id="follow-unfollow-buttons">
                <button id="follow-button">Follow</button>
                <button id="unfollow-button">Unfollow</button>
            </div>
        `;

        // Display profile information
        document.getElementById('user-profile').innerHTML = profileHtml;

        // Display user posts with additional details
        const postsHtml = userPosts.data.length ? `
            <h2>Posts</h2>
            <div id="user-posts">
                ${userPosts.data.map(post => `
                    <div class="post">
                        <h3><a href="details.html?postId=${post.id}">${post.title}</a></h3> <!-- Link to details page -->
                        <p>${post.body}</p>
                        ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" style="max-width:100%;">` : ''}
                        <p>Tags: ${post.tags ? post.tags.join(', ') : 'None'}</p>
                        <p>Created: ${new Date(post.created).toLocaleString()}</p>
                        <p>Comments: ${post._count ? post._count.comments : 0}</p> <!-- Display comment count -->
                        <p>Reactions: ${post._count ? post._count.reactions : 0}</p> <!-- Display reaction count -->
                    </div>
                `).join('')}
            </div>
        ` : '<p>No posts available.</p>';

        document.getElementById('user-posts').innerHTML = postsHtml; // Display posts in the 'user-posts' container

        // Always show both buttons
        document.getElementById('follow-button').style.display = 'inline';  // Ensure Follow button is shown
        document.getElementById('unfollow-button').style.display = 'inline'; // Ensure Unfollow button is shown

        // Add event listeners to both buttons
        document.getElementById('follow-button').addEventListener('click', () => followUser(token, username));
        document.getElementById('unfollow-button').addEventListener('click', () => unfollowUser(token, username));

    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        document.getElementById('user-profile').innerHTML = '<p>Error loading user profile.</p>';
    }
}


// Call displayUserProfile when the page loads
window.onload = displayUserProfile; // Ensure this function runs on page load
