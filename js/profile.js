// Function to fetch posts made by the current user
async function fetchUserPosts(username, accessToken) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/posts?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'X-Noroff-API-Key': 'a359f87a-47df-408e-ac4e-a6490a77b19c', // Ensure your API key is correct
            },
        });

        // Check if the response is unauthorized
        if (response.status === 401) {
            console.error('Unauthorized access. Please check your token.');
            localStorage.removeItem('accessToken'); // Optionally clear token
            window.location.href = '/login.html'; // Redirect to login page
            return [];
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const postsData = await response.json();
        return postsData.data; // Assuming the posts are under a `data` property

    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
}

// Function to fetch the logged-in user's profile
async function getUserProfile(username, accessToken) {
    try {
        const response = await fetch(
            `https://v2.api.noroff.dev/social/profiles/${username}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "X-Noroff-API-Key": "a359f87a-47df-408e-ac4e-a6490a77b19c", // Ensure your API key is correct
                },
            }
        );

        // Check if the response is unauthorized
        if (response.status === 401) {
            console.error("Token expired or unauthorized. Redirecting to login.");
            localStorage.removeItem("accessToken"); // Optionally clear token
            window.location.href = "/login.html"; // Redirect to login page
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const profileData = await response.json();
        return profileData;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// Function to display the user's profile and posts on the webpage
async function showUserProfile() {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username'); // Ensure username is stored during login

    console.log('Access Token:', accessToken); // Debugging
    console.log('Username:', username); // Debugging

    if (!accessToken || !username) {
        console.error('User is not logged in or missing access token.');
        window.location.href = '/login.html'; // Redirect to login if missing
        return;
    }

    const loadingElement = document.getElementById('profile-loading');
    const errorElement = document.getElementById('profile-error');
    const profileNameElement = document.getElementById('profile-name');
    const profileAvatarElement = document.getElementById('profile-avatar');
    const profileBioElement = document.getElementById('profile-bio');
    const profileBannerElement = document.getElementById('profile-banner'); // Add this for banner

    // Added elements for profile statistics
    const profilePostsCountElement = document.getElementById('profile-posts-count');
    const profileFollowersCountElement = document.getElementById('profile-followers-count');
    const profileFollowingCountElement = document.getElementById('profile-following-count');

    const postsContainer = document.getElementById('posts-container');

    loadingElement.style.display = 'block'; // Show loading element

    try {
        const profileResponse = await getUserProfile(username, accessToken);

        // Log the user profile data to the console
        console.log('User Profile Data:', profileResponse); // This will log the entire profile object

        // Extract data from the profile response
        const profile = profileResponse.data; // Access the data object
        
        // Safely assign profile data or default values
        profileNameElement.textContent = profile.name || 'No name provided';
        profileAvatarElement.src = profile.avatar?.url || 'default-avatar.png'; // Ensure this file exists
        profileAvatarElement.alt = profile.avatar?.alt || 'Default avatar'; // Alt text for the image
        profileBioElement.textContent = profile.bio || 'No bio available';
        profileBannerElement.src = profile.banner?.url || 'default-banner.png'; // Ensure this file exists

        // Update profile statistics
        profilePostsCountElement.textContent = profile._count.posts || 0; // Display number of posts
        profileFollowersCountElement.textContent = profile._count.followers || 0; // Display number of followers
        profileFollowingCountElement.textContent = profile._count.following || 0; // Display number of following

        // Fetch and display user posts
        const userPosts = await fetchUserPosts(username, accessToken);
        if (userPosts.length > 0) {
            userPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');

                postElement.innerHTML = `
                    <h4>${post.title || 'Untitled Post'}</h4>
                    <p>${post.body || 'No content available'}</p>
                    <p><small>Posted on: ${new Date(post.createdAt).toLocaleDateString()}</small></p>
                `;

                postsContainer.appendChild(postElement);
            });
        } else {
            postsContainer.innerHTML = '<p>No posts available.</p>';
        }

    } catch (error) {
        errorElement.textContent = 'Error loading profile data. Please try again later.';
    } finally {
        loadingElement.style.display = 'none'; // Hide loading element
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', showUserProfile);
