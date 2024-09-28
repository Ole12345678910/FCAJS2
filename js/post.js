import { fetchPosts, fetchPostsFromFollowers } from './api.js'; // Ensure this path is correct

let isFollowerView = false; // Track whether to show only followers' posts
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

// Function to fetch all posts regardless of follower status
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
        return [];
    }
}

// Function to display posts based on the search query
async function displayPosts(searchQuery = '') {
    const posts = await fetchAllPosts(); // Always fetch all posts

    // If there's a search query, filter the posts
    if (searchQuery) {
        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            post.body.toLowerCase().includes(searchQuery.toLowerCase())
        );
        renderPosts(filteredPosts); // Render filtered posts
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

// Set up the filter button
function setupFilterButton() {
    const filterButton = document.createElement('button');
    filterButton.id = 'filter-followers-btn';
    filterButton.style.margin = '20px 0';
    filterButton.innerText = 'Show Only Posts from My Followers';

    // Handle the button click event
    filterButton.addEventListener('click', async () => {
        isFollowerView = !isFollowerView; // Toggle the view state
        filterButton.innerText = isFollowerView ? 'Show All Posts' : 'Show Only Posts from My Followers'; // Update button text
        
        // Show a loading message
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '<p>Loading posts...</p>';

        if (isFollowerView) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const followerPosts = await fetchPostsFromFollowers(token);
                renderPosts(followerPosts);
            } else {
                console.error('No access token found. Please log in first.');
                postsContainer.innerHTML = '<p>Please log in to see follower posts.</p>';
            }
        } else {
            await displayPosts(); // Refresh to show all posts
        }
    });

    document.getElementById('button-container').appendChild(filterButton); // Append the button to the DOM
}

// Set up the search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-query'); // Get search input element
    
    // Handle the input event for real-time searching with debounce
    searchInput.addEventListener('input', debounce(async () => {
        const query = searchInput.value.trim(); // Get the trimmed search input value
        console.log('Search query:', query); // Debug: Show the search query
        await displayPosts(query); // Fetch and display posts based on the search query
    }, 300)); // 300ms delay
}

// Function to initialize the app
async function initApp() {
    await displayPosts(); // Display posts on initial load
    setupSearch(); // Set up search functionality
    setupFilterButton(); // Set up filter button functionality
}

// Run the app
initApp();
