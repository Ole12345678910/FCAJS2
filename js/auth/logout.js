// Handle user logout
const handleLogout = () => {
    // Remove the access token from local storage
    localStorage.removeItem('accessToken');
    
    // Redirect the user to the login page
    window.location.href = '/templates/index.html'; // Adjust the path if necessary
};

// Attach event listener to the logout button
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}
