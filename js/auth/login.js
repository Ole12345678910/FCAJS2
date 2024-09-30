// Import necessary API
import { loginUser } from '../api/api.js';

/**
 * Handle the login form submission.
 * Prevents default form submission, retrieves user credentials, 
 * and attempts to log in the user using the API.
 * 
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get user input values from the form
    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value; 

    try {
        // Attempt to log in and retrieve access token
        const token = await loginUser(email, password); 
        // Redirect to the home page after successful login
        window.location.href = '/templates/index.html'; 
    } catch (error) {
        // Handle any login errors and show a message to the user
        alert('Login failed. Please check your credentials.'); 
    }
};

/**
 * Attach an event listener to the login form if the form exists.
 * Listens for the submit event to trigger the handleLogin function.
 */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
