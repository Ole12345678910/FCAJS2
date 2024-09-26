// profile.js
import { getUserProfile, fetchUserPostsByProfile, deletePost } from './api.js'; // Adjust path as necessary

// Function to display User Profile and Posts
async function showUserProfile() {
    const accessToken = localStorage.getItem('accessToken');
    const targetUsername = localStorage.getItem('username'); // Get username from localStorage

    if (!accessToken || !targetUsername) {
        console.error('User is not logged in or missing access token/username.');
        window.location.href = '/login.html'; // Redirect to login page
        return;
    }

    const loadingElement = document.getElementById('profile-loading');
    const errorElement = document.getElementById('profile-error');
    const profileNameElement = document.getElementById('profile-name');
    const profileAvatarElement = document.getElementById('profile-avatar');
    const profileBioElement = document.getElementById('profile-bio');
    const profileBannerElement = document.getElementById('profile-banner');

    const profilePostsCountElement = document.getElementById('profile-posts-count');
    const profileFollowersCountElement = document.getElementById('profile-followers-count');
    const profileFollowingCountElement = document.getElementById('profile-following-count');

    const postsContainer = document.getElementById('posts-container');

    loadingElement.style.display = 'block'; // Show loading element

    // Clear previous profile information and posts
    profileNameElement.textContent = '';
    profileAvatarElement.src = ''; 
    profileAvatarElement.alt = '';
    profileBioElement.textContent = '';
    profileBannerElement.src = '';
    profileBannerElement.alt = '';
    profilePostsCountElement.textContent = '0'; 
    profileFollowersCountElement.textContent = '0'; 
    profileFollowingCountElement.textContent = '0'; 
    postsContainer.innerHTML = ''; // Clear previous posts

    try {
        // Fetch User Profile
        const profileResponse = await getUserProfile(targetUsername, accessToken); 

        if (!profileResponse) throw new Error('Profile not found.');

        // Display Profile Information
        profileNameElement.textContent = profileResponse.name || 'No name provided';
        profileAvatarElement.src = profileResponse.avatar?.url || 'default-avatar.png'; // Default avatar
        profileAvatarElement.alt = profileResponse.avatar?.alt || 'Default avatar';
        profileBioElement.textContent = profileResponse.bio || 'No bio available';
        profileBannerElement.src = profileResponse.banner?.url || 'default-banner.png'; // Default banner
        profileBannerElement.alt = profileResponse.banner?.alt || 'Default banner';

        // Update profile statistics
        profilePostsCountElement.textContent = profileResponse._count.posts || 0; 
        profileFollowersCountElement.textContent = profileResponse._count.followers || 0; 
        profileFollowingCountElement.textContent = profileResponse._count.following || 0; 

        // Fetch and display posts from User Profile
        const userPosts = await fetchUserPostsByProfile(targetUsername, accessToken);
        if (userPosts.length > 0) {
            userPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');

                // Create a link for the post that redirects to details.html with postId as a query parameter
                postElement.innerHTML = `
                    <div class="post-header">
                        <img src="${profileResponse.avatar?.url || 'default-avatar.png'}" alt="${profileResponse.avatar?.alt || 'User Avatar'}" class="post-avatar">
                        <h4>${profileResponse.name}</h4>
                        <p><small>Posted on: ${new Date(post.created).toLocaleDateString()}</small></p>
                    </div>
                    <h4><a href="details.html?postId=${post.id}">${post.title || 'Untitled Post'}</a></h4>  <!-- Link to details -->
                    ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt || 'Post Image'}" class="post-image">` : ''}
                    <p>${post.body || 'No content available'}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                    <p><strong>${post._count.comments} Comments | ${post._count.reactions} Reactions</strong></p>
                    <button class="delete-post" data-id="${post.id}">Delete Post</button> <!-- Delete button -->
                `;

                // Add event listener for delete button
                postElement.querySelector('.delete-post').addEventListener('click', async () => {
                    try {
                        await deletePost(post.id, accessToken);
                        alert("Post deleted successfully.");
                        showUserProfile(); // Refresh to show updated posts
                    } catch (error) {
                        console.error('Error deleting post:', error);
                        alert('Error deleting post. Please try again later.');
                    }
                });

                postsContainer.appendChild(postElement);
            });
        } else {
            postsContainer.innerHTML = '<p>No posts available from this user.</p>';
        }

    } catch (error) {
        errorElement.textContent = 'Error loading profile data. Please try again later.';
    } finally {
        loadingElement.style.display = 'none'; // Hide loading element
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', showUserProfile);
