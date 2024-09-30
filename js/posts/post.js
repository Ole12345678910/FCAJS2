// Import necessary API functions and utilities
import { fetchPosts, searchPosts } from '../api/api.js'; 
import { renderPosts } from '../utils/utils.js';

let allPosts = []; // Store all fetched posts for searching

/**
 * Fetch all posts from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of posts.
 */
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

/**
 * Display posts based on the search query.
 * If a search query is provided, it fetches the searched posts; otherwise, it fetches all posts.
 * @param {string} [searchQuery=''] - The query string to search for posts.
 * @returns {Promise<void>}
 */
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

/**
 * Debounce function to optimize search input handling.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} A debounced version of the provided function.
 */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Check if the user is authenticated; if not, redirect to the login page.
 */
function checkAuthentication() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('No access token found. Redirecting to login.');
    window.location.href = '/templates/auth/register.html'; 
  }
}

/**
 * Set up the search functionality for the posts.
 */
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

/**
 * Initialize the application by checking authentication, displaying posts, and setting up search.
 * @returns {Promise<void>}
 */
async function initApp() {
  checkAuthentication();
  await displayPosts();
  setupSearch();
}

// Add event listener for the profile link if it exists
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
