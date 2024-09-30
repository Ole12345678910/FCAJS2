/**
 * Handle user logout.
 * Removes the access token from local storage and redirects the user to the login page.
 */
const handleLogout = () => {
    // Remove the access token from local storage
    localStorage.removeItem('accessToken');
    
    // Redirect the user to the login page
    window.location.href = '/templates/index.html';
};

/**
 * Attach an event listener to the logout button if the button exists.
 * Listens for the click event to trigger the handleLogout function.
 */
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}
