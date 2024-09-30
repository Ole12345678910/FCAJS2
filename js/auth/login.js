import { loginUser } from '../api/api.js';

// Handle user login
const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get user credentials from the form
    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value; 

    try {
        // Attempt to log in the user
        const token = await loginUser(email, password); 
        
        console.log('Login successful! Access Token:', token);
        
        // Redirect to the home screen
        window.location.href = '/templates/index.html'; // Adjust the path if necessary
    } catch (error) {
        console.error('Login failed:', error.message); // Log error details
        alert('Login failed. Please check your credentials.'); // Notify user
    }
};

// Attach event listener to the login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
