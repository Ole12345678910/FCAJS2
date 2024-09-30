// Import necessary API functions
import { registerUserApi } from '../api/api.js'; // Import the API function for user registration

/**
 * Handle user registration form submission.
 * Gathers form data, calls the registration API, and redirects upon success.
 * 
 * @param {Event} event - The form submission event.
 */
async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const bio = document.getElementById('bio').value || undefined; // Optional field
    const avatarUrl = document.getElementById('avatarUrl').value || undefined; // Optional field
    const avatarAlt = document.getElementById('avatarAlt').value || ''; // Optional field
    const bannerUrl = document.getElementById('bannerUrl').value || undefined; // Optional field
    const bannerAlt = document.getElementById('bannerAlt').value || ''; // Optional field
    const venueManager = document.getElementById('venueManager').checked; // Optional checkbox

    // Create a user data object with the form values
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
        
        // Redirect to the user profile page upon successful registration
        window.location.href = '/templates/user/profile.html'; // Adjust the path as needed

    } catch (error) {
        // Log and display an error message if registration fails
        document.getElementById('response-message').innerHTML = `
            <p>Error during registration: ${error.message}</p>`;
    }
}

/**
 * Add an event listener to the registration form.
 * Listens for the form submit event to trigger the registerUser function.
 */
document.getElementById('registration-form').addEventListener('submit', registerUser);
