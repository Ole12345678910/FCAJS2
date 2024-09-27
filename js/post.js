import { fetchPosts } from './api.js'; // Assuming this function fetches all posts

// Function to create a button that redirects to create.html if access token exists
function createPostButton() {
    const token = localStorage.getItem('accessToken'); // Check for access token

    // If token exists, create the button
    if (token) {
        const buttonHtml = `
            <button id="create-post-btn" style="margin: 20px 0;">Create New Post</button>
        `;

        // Insert the button into the desired location in the DOM
        document.getElementById('button-container').innerHTML = buttonHtml;

        // Add click event to redirect to create.html
        document.getElementById('create-post-btn').addEventListener('click', () => {
            window.location.href = 'create.html';
        });
    }
}

// Function to display posts
async function displayPosts() {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage

    if (!token) {
        console.error('No access token found. Please log in first.');
        return;
    }

    try {
        // Fetch posts using the token
        const posts = await fetchPosts(token);

        // Generate HTML content for each post with user details
        const postsHtml = posts.map(post => `
            <div class="post">
                <h3><a href="details.html?postId=${post.id}">${post.title}</a></h3> <!-- Link to details page -->
                <p>${post.body}</p>
                ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" style="max-width:100%;">` : ''}
                <p>Tags: ${post.tags.join(', ')}</p>
                <p>Created: ${new Date(post.created).toLocaleString()}</p>
                <p>Comments: ${post._count ? post._count.comments : 0}</p> <!-- Display comment count -->
                <p>Reactions: ${post._count ? post._count.reactions : 0}</p> <!-- Display reaction count -->
                <p>Author: ${post.author?.name || 'Unknown'}</p> <!-- Display author name -->
                ${post.author?.avatar ? `<img src="${post.author.avatar.url}" alt="${post.author.avatar.alt}" style="width: 50px; height: 50px; border-radius: 50%;">` : ''} <!-- Display author avatar -->
            </div>
        `).join('');

        // Insert the posts into the DOM
        document.getElementById('posts-container').innerHTML = postsHtml;

        // Create the 'Create New Post' button
        createPostButton();

    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
}



// Call displayPosts when the page loads
window.onload = displayPosts;
