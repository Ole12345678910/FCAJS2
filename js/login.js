// login.js
import { loginUser } from './api.js';

const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value; // Get the email input value
    const password = document.getElementById('password').value; // Get the password input value

    try {
        const token = await loginUser(email, password); // Call the login function

        console.log('Login successful! Access Token:', token);
        
        // Redirect to the home screen (index.html)
        window.location.href = 'index.html'; // Change this path if needed
    } catch (error) {
        console.error('Login failed. Please check your credentials.'); // Log error
        alert('Login failed. Please check your credentials.'); // Notify user
    }
};

// Attach event listener to the login form
document.getElementById('loginForm').addEventListener('submit', handleLogin);
