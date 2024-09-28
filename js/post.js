import { fetchPosts, searchProfiles, searchPosts } from './api.js'; // Ensure this path is correct

let allPosts = []; // Store all fetched posts for searching

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

// Function to fetch all posts
async function fetchAllPosts() {
    const token = localStorage.getItem('accessToken'); // Retrieve token

    if (!token) {
        console.error('No access token found. Please log in first.');
        return [];
    }

    try {
        console.log('Fetching all posts...'); // Debugging log
        allPosts = await fetchPosts(token); // Fetch all posts
        return allPosts; // Return all posts
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        alert('Failed to fetch posts. Please try again later.'); // User feedback on error
        return [];
    }
}

// Function to display posts based on the search query
async function displayPosts(searchQuery = '') {
    const posts = await fetchAllPosts(); // Always fetch all posts

    // If there's a search query, filter the posts
    if (searchQuery) {
        const token = localStorage.getItem('accessToken'); // Get token
        const searchedPosts = await searchPosts(token, searchQuery); // Search for posts
        renderPosts(searchedPosts.data); // Render searched posts
    } else {
        renderPosts(posts); // Render all posts if no search query
    }
}

// Debounce function for optimizing search input
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Set up the search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-query'); // Get search input element
    
    if (!searchInput) {
        console.error('Search input element not found');
        return;
    }

    // Handle the input event for real-time searching with debounce
    searchInput.addEventListener('input', debounce(async () => {
        const query = searchInput.value.trim(); // Get the trimmed search input value
        console.log('Search query:', query); // Debug: Show the search query
        await displayPosts(query); // Fetch and display posts based on the search query
    }, 300)); // 300ms delay
}

// Set up the app
async function initApp() {
    await displayPosts(); // Display posts on initial load
    setupSearch(); // Set up search functionality
}

// Run the app
initApp();
