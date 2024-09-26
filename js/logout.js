const handleLogout = () => {
    // Remove the access token from local storage
    localStorage.removeItem('accessToken');
    
    // Redirect the user to the login page
    window.location.href = 'index.html'; // Adjust the path if necessary
};

// Attach event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', handleLogout);
