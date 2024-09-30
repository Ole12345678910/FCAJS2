// Import necessary API functions and utilities
import { 
    getUserProfile, 
    fetchUserPostsByProfile, 
    deletePost, 
    updatePost 
} from '../api/api.js';
import { renderProfile } from '../utils/utils.js';

// Function to retrieve username from localStorage
function getUsernameFromStorage() {
    return localStorage.getItem('username');
}

/**
 * Redirects to the login page if access token or username is missing.
 */
function redirectToLogin() {
    window.location.href = '/templates/auth/login.html'; // Redirect to login page
}

/**
 * Displays the user profile and their posts.
 */
async function displayUserProfile() {
    const accessToken = localStorage.getItem('accessToken');
    const username = getUsernameFromStorage();

    // Check for access token and username
    if (!accessToken || !username) {
        redirectToLogin();
        return;
    }

    try {
        const profileResponse = await getUserProfile(username, accessToken);
        if (!profileResponse) throw new Error('Profile not found.');

        renderProfile(profileResponse); // Render the user profile
        await displayUserPosts(username, accessToken); // Fetch and display user posts
    } catch (error) {
        console.error('Error loading profile data:', error.message);
        document.getElementById('profile-error').textContent = 'Error loading profile data.';
    }
}

/**
 * Displays posts for the specified user.
 * @param {string} username - The username of the user whose posts to fetch.
 * @param {string} token - The access token for API authentication.
 */
async function displayUserPosts(username, token) {
    const postsContainer = document.getElementById('posts-container');

    try {
        const userPosts = await fetchUserPostsByProfile(username, token);
        if (userPosts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available from this user.</p>';
            return;
        }

        userPosts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement); // Append each post to the container
        });
    } catch (error) {
        console.error('Error fetching user posts:', error.message);
        postsContainer.innerHTML = '<p>Error loading posts.</p>';
    }
}

/**
 * Creates an HTML element for a single post.
 * @param {Object} post - The post data.
 * @returns {HTMLElement} The HTML element representing the post.
 */
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // Add post content
    postElement.innerHTML = `
        <div class="post-header">
            <p><small>Posted on: ${new Date(post.created).toLocaleDateString()}</small></p>
        </div>
        <h3><a href="/templates/posts/details.html?postId=${post.id}">${post.title}</a></h3>
        ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt || 'Post Image'}" class="post-image">` : ''}
        <p class="post-body">${post.body || 'No content available'}</p>
        <div class="post-tags">
            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
        </div>
        <p><strong>${post._count.comments} Comments | ${post._count.reactions} Reactions</strong></p>
        <button class="delete-post" data-id="${post.id}">Delete Post</button>
        <button class="edit-post" data-id="${post.id}" data-title="${post.title}" data-body="${post.body}" data-tags="${post.tags.join(', ')}" data-media-url="${post.media?.url || ''}" data-media-alt="${post.media?.alt || ''}">Edit Post</button>
        <div id="edit-form-container-${post.id}" class="edit-form-container"></div>
    `;

    // Add event listeners for delete and edit buttons
    postElement.querySelector('.delete-post').addEventListener('click', () => handlePostDelete(post.id));
    postElement.querySelector('.edit-post').addEventListener('click', (e) => {
        const { id, title, body, tags, mediaUrl, mediaAlt } = e.target.dataset;
        showEditForm(id, title, body, tags, mediaUrl, mediaAlt);
    });

    return postElement;
}

/**
 * Displays the edit form for a specified post.
 * @param {string} id - The ID of the post to edit.
 * @param {string} title - The current title of the post.
 * @param {string} body - The current body of the post.
 * @param {string} tags - The current tags of the post.
 * @param {string} mediaUrl - The current media URL of the post.
 * @param {string} mediaAlt - The current media alt text of the post.
 */
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
        const updatedPost = gatherUpdatedPostData(id);
        await handlePostUpdate(id, updatedPost);
    });
}

/**
 * Gathers updated post data from the edit form.
 * @param {string} id - The ID of the post being edited.
 * @returns {Object} The updated post data.
 */
function gatherUpdatedPostData(id) {
    return {
        title: document.getElementById(`post-title-${id}`).value,
        body: document.getElementById(`post-body-${id}`).value,
        tags: document.getElementById(`post-tags-${id}`).value.split(',').map(tag => tag.trim()),
        media: {
            url: document.getElementById(`post-media-url-${id}`).value,
            alt: document.getElementById(`post-media-alt-${id}`).value
        }
    };
}

/**
 * Handles the post update operation.
 * @param {string} postId - The ID of the post to update.
 * @param {Object} updatedPost - The updated post data.
 */
async function handlePostUpdate(postId, updatedPost) {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await updatePost(postId, updatedPost, token);
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

/**
 * Handles the post deletion operation.
 * @param {string} postId - The ID of the post to delete.
 */
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

/**
 * Creates a link to the post creation page.
 */
function createPostLink() {
    const linkContainer = document.getElementById('create');
    const linkHtml = `
        <a href="/templates/posts/create.html" id="create-post-link" style="display: inline-block; margin: 20px 0; padding: 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; border-radius: 5px;">
            Create New Post
        </a>
    `;
    linkContainer.innerHTML += linkHtml; // Add the link HTML to the container
}

// Initialize post link creation and profile display on page load
window.onload = () => {
    createPostLink(); // Create the post link when the profile page loads
};

// Run the function to display the user profile when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayUserProfile);
