// post.js
import { fetchPosts, searchPosts } from '../api/api.js'; 
import { renderPosts } from '../utils/utils.js';

let allPosts = []; // Store all fetched posts for searching

// Fetch all posts
async function fetchAllPosts() {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.error('No access token found. Please log in first.');
    return [];
  }

  try {
    allPosts = await fetchPosts(token);
    return allPosts;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    alert('Failed to fetch posts. Please try again later.');
    return [];
  }
}

// Display posts based on the search query
async function displayPosts(searchQuery = '') {
  const posts = await fetchAllPosts();

  if (searchQuery) {
    const token = localStorage.getItem('accessToken');
    const searchedPosts = await searchPosts(token, searchQuery);
    renderPosts(searchedPosts.data);
  } else {
    renderPosts(posts);
  }
}

// Debounce function for optimizing search input
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Check authentication and redirect if necessary
function checkAuthentication() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('No access token found. Redirecting to login.');
    window.location.href = '/templates/auth/login.html'; 
  }
}

// Set up the search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-query');
  
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener('input', debounce(async () => {
    const query = searchInput.value.trim();
    await displayPosts(query);
  }, 300));
}

// Initialize application
async function initApp() {
  checkAuthentication();
  await displayPosts();
  setupSearch();
}

// Add event listener for profile link if exists
document.getElementById('profile-link')?.addEventListener('click', (event) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('User not logged in. Redirecting to login.');
    window.location.href = '/templates/auth/login.html';
    event.preventDefault();
  } else {
    const username = getUsernameFromToken(token); // Assume this function exists
    window.location.href = `/templates/user/user.html?username=${encodeURIComponent(username)}`;
  }
});

// Run the app
initApp();
