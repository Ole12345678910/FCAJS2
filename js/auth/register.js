import { registerUserApi } from '../api/api.js'; // Import the new API function

// Function to handle user registration form submission
async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const bio = document.getElementById('bio').value || undefined; // Optional
    const avatarUrl = document.getElementById('avatarUrl').value || undefined; // Optional
    const avatarAlt = document.getElementById('avatarAlt').value || ''; // Optional
    const bannerUrl = document.getElementById('bannerUrl').value || undefined; // Optional
    const bannerAlt = document.getElementById('bannerAlt').value || ''; // Optional
    const venueManager = document.getElementById('venueManager').checked; // Optional

    // Create user data object
    const userData = {
        name,
        email,
        password,
        bio,
        avatar: avatarUrl ? { url: avatarUrl, alt: avatarAlt } : undefined,
        banner: bannerUrl ? { url: bannerUrl, alt: bannerAlt } : undefined,
        venueManager,
    };

    try {
        // Call the API function to register the user
        await registerUserApi(userData);
        
        // Redirect to the main page upon successful registration
        window.location.href = '/templates/index.html'; // Change the path as necessary

    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('response-message').innerHTML = `
            <p>Error during registration: ${error.message}</p>`;
    }
}

// Add event listener to the registration form
document.getElementById('registration-form').addEventListener('submit', registerUser);
