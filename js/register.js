import { API_KEY } from './api.js'; // Assuming you have your API_KEY defined here

// Function to handle form submission
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

    // Create user object
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
        const response = await fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                'X-Noroff-API-Key': API_KEY, // Include your API key
            },
            body: JSON.stringify(userData), // Convert user data to JSON
        });

        // Check if the registration was successful
        if (response.ok) {
            const responseData = await response.json();
            document.getElementById('response-message').innerHTML = `
                <p>User registered successfully!</p>
                <pre>${JSON.stringify(responseData.data, null, 2)}</pre>
            `;
        } else {
            const errorData = await response.json();
            document.getElementById('response-message').innerHTML = `
                <p>Error: ${errorData.message}</p>
            `;
        }
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('response-message').innerHTML = `<p>Error during registration. Please try again later.</p>`;
    }
}

// Add event listener to the form
document.getElementById('registration-form').addEventListener('submit', registerUser);
