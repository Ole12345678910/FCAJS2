import { fetchPosts, fetchPostsFromFollowers, API_KEY } from './api.js'; // Ensure this path is correct

// Function to render posts
function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!Array.isArray(posts) || posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts found.</p>';
        return;
    }

    const postsHtml = posts.map(post => `
        <div class="post">
            <h3><a href="details.html?postId=${post.id}">${post.title}</a></h3>
            <p>${post.body}</p>
            ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" style="max-width:100%;">` : ''}
            <p>Tags: ${post.tags.join(', ')}</p>
            <p>Created: ${new Date(post.created).toLocaleString()}</p>
            <p>Comments: ${post._count ? post._count.comments : 0}</p>
            <p>Reactions: ${post._count ? post._count.reactions : 0}</p>
            <p>Author: ${post.author?.name || 'Unknown'}</p>
            ${post.author?.avatar ? `<img src="${post.author.avatar.url}" alt="${post.author.avatar.alt}" style="width: 50px; height: 50px; border-radius: 50%;">` : ''}
        </div>
    `).join('');

    postsContainer.innerHTML = postsHtml; // Set the inner HTML of the posts container
}

// New function to fetch posts from followed users
async function fetchFollowedPosts() {
    const token = localStorage.getItem('accessToken'); // Retrieve token

    // Log the token to check if it is present
    console.log('Access Token:', token);

    if (!token) {
        console.error('No access token found. Please log in first.');
        document.getElementById('posts-container').innerHTML = '<p>Please log in to see posts from followed users.</p>';
        return;
    }

    try {
        console.log('Fetching posts from followed users...'); // Debugging log
        const response = await fetch('https://v2.api.noroff.dev/social/posts/following', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ensure this is correct
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': API_KEY

            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderPosts(data.data); // Adjust based on your API response structure
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
    await fetchFollowedPosts(); // Fetch posts from followed users on initial load
}

// Ensure the DOM is fully loaded before running the app
document.addEventListener('DOMContentLoaded', initApp);
