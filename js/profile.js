// profile.js
import { getUserProfile, fetchUserPostsByProfile, deletePost, updatePost, API_KEY } from './api.js';

// Function to get username from localStorage
function getUsernameFromStorage() {
    return localStorage.getItem('username');
}

// Function to display User Profile
async function displayUserProfile() {
    const accessToken = localStorage.getItem('accessToken');
    const username = getUsernameFromStorage();

    if (!accessToken || !username) {
        console.error('User is not logged in or missing access token/username.');
        window.location.href = '/login.html'; // Redirect to login page
        return;
    }

    try {
        const profileResponse = await getUserProfile(username, accessToken);
        if (!profileResponse) throw new Error('Profile not found.');

        renderProfile(profileResponse);
        await displayUserPosts(username, accessToken); // Fetch and display posts after rendering the profile
    } catch (error) {
        console.error('Error loading profile data:', error.message);
        document.getElementById('profile-error').textContent = 'Error loading profile data.';
    }
}

// Function to render the profile
function renderProfile(profile) {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = `
        <div class="profile-header">
            <img src="${profile.banner?.url || 'default-banner.png'}" alt="${profile.banner?.alt || 'Profile Banner'}" class="profile-banner">
            <div class="profile-info">
                <img src="${profile.avatar?.url || 'default-avatar.png'}" alt="${profile.avatar?.alt || 'User Avatar'}" class="profile-avatar">
                <h1 class="profile-name">${profile.name || 'No name provided'}</h1>
                <p class="profile-bio">${profile.bio || 'No bio available'}</p>
                <div class="profile-stats">
                    <span><strong>${profile._count.posts || 0}</strong> Posts</span>
                    <span><strong>${profile._count.followers || 0}</strong> Followers</span>
                    <span><strong>${profile._count.following || 0}</strong> Following</span>
                </div>
            </div>
        </div>
    `;
}

// Function to display User Posts
async function displayUserPosts(username, token) {
    const postsContainer = document.getElementById('posts-container');

    try {
        const userPosts = await fetchUserPostsByProfile(username, token);
        if (userPosts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available from this user.</p>';
            return;
        }

        for (const post of userPosts) {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        }
    } catch (error) {
        console.error('Error fetching user posts:', error.message);
        postsContainer.innerHTML = '<p>Error loading posts.</p>';
    }
}

// Function to create HTML for a single post
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // Add post content
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${post.author?.avatar?.url || 'default-avatar.png'}" alt="${post.author?.avatar?.alt || 'User Avatar'}" class="post-avatar">
            <h4>${post.author?.name || 'Unknown'}</h4>
            <p><small>Posted on: ${new Date(post.created).toLocaleDateString()}</small></p>
        </div>
        <h4><a href="details.html?postId=${post.id}" class="post-title">${post.title || 'Untitled Post'}</a></h4>
        ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt || 'Post Image'}" class="post-image">` : ''}
        <p class="post-body">${post.body || 'No content available'}</p>
        <div class="post-tags">
            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
        </div>
        <p><strong>${post._count.comments} Comments | ${post._count.reactions} Reactions</strong></p>
        <button class="delete-post" data-id="${post.id}">Delete Post</button>
        <button class="edit-post" data-id="${post.id}" data-title="${post.title}" data-body="${post.body}" data-tags="${post.tags.join(', ')}" data-media-url="${post.media?.url || ''}" data-media-alt="${post.media?.alt || ''}">Edit Post</button>
        <div id="edit-form-container-${post.id}" class="edit-form-container"></div> <!-- Unique edit form container -->
    `;

    // Add event listener for delete button
    postElement.querySelector('.delete-post').addEventListener('click', async () => {
        await handlePostDelete(post.id);
    });

    // Add event listener for edit button
    postElement.querySelector('.edit-post').addEventListener('click', (e) => {
        const { id, title, body, tags, mediaUrl, mediaAlt } = e.target.dataset;
        showEditForm(id, title, body, tags, mediaUrl, mediaAlt);
    });

    return postElement;
}

// Function to display the edit form
function showEditForm(id, title, body, tags, mediaUrl, mediaAlt) {
    const editFormContainer = document.getElementById(`edit-form-container-${id}`);
    if (!editFormContainer) {
        console.error(`Edit form container not found for post ID: ${id}`);
        return;
    }

    editFormContainer.innerHTML = `
        <form id="edit-post-form-${id}">
            <h3>Edit Post</h3>
            <label for="post-title">Title:</label>
            <input type="text" id="post-title-${id}" value="${title}">
            <label for="post-body">Body:</label>
            <textarea id="post-body-${id}">${body}</textarea>
            <label for="post-tags">Tags (comma separated):</label>
            <input type="text" id="post-tags-${id}" value="${tags}">
            <label for="post-media-url">Media URL:</label>
            <input type="text" id="post-media-url-${id}" value="${mediaUrl}">
            <label for="post-media-alt">Media Alt Text:</label>
            <input type="text" id="post-media-alt-${id}" value="${mediaAlt}">
            <button type="submit">Update Post</button>
        </form>
    `;

    document.getElementById(`edit-post-form-${id}`).addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedPost = {
            title: document.getElementById(`post-title-${id}`).value,
            body: document.getElementById(`post-body-${id}`).value,
            tags: document.getElementById(`post-tags-${id}`).value.split(',').map(tag => tag.trim()),
            media: {
                url: document.getElementById(`post-media-url-${id}`).value,
                alt: document.getElementById(`post-media-alt-${id}`).value
            }
        };

        await handlePostUpdate(id, updatedPost);
    });
}
// Function to handle updating a post
async function handlePostUpdate(postId, updatedPost) {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await updatePost(postId, updatedPost, token);

        // Check if response has an error
        if (response.error) {
            alert(`Error updating post: ${response.error.message || 'Unknown error occurred.'}`);
            return;
        }

        alert('Post updated successfully.');
        window.location.reload(); // Refresh the page after successful update
    } catch (error) {
        console.error('Error updating post:', error.message);
        alert('Error updating post. Please try again later.');
    }
}



// Function to handle deleting a post
async function handlePostDelete(postId) {
    const token = localStorage.getItem('accessToken');
    
    try {
        await deletePost(postId, token);
        alert('Post deleted successfully.');
        displayUserProfile(); // Refresh the profile display
    } catch (error) {
        console.error('Error deleting post:', error.message);
        alert('Error deleting post. Please try again later.');
    }
}

// Run the function to display the user profile on page load
displayUserProfile();
