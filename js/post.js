

import { fetchPosts } from './api.js'; // Correctly import fetchPosts from api.js

const displayPosts = (posts) => {
    const postsContainer = document.getElementById('postsContainer'); // Container for posts
    postsContainer.innerHTML = ''; // Clear existing content

    posts.forEach(post => {
        const postElement = document.createElement('div'); // Create a div for each post
        postElement.classList.add('post'); // Add a class for styling (optional)

        // Check if the post has media
        const imageElement = post.media && post.media.url ? `
            <img src="${post.media.url}" alt="${post.media.alt || 'Post image'}" style="max-width: 100%; height: auto;" />
        ` : '';

        // Create content for the post
        postElement.innerHTML = `
            <a href="details.html?postId=${post.id}" style="text-decoration: none; color: inherit;"> <!-- Link to details.html with post ID -->
                <h2>${post.title}</h2>
                <div class="postImage">
                    ${imageElement} <!-- Display the image if it exists -->
                </div>
                <p>${post.body}</p>
                <p><strong>Created At:</strong> ${new Date(post.created).toLocaleDateString()}</p>
                <p><strong>Comments:</strong> ${post._count.comments}</p>
                <p><strong>Reactions:</strong> ${post._count.reactions}</p>
            </a>
        `;

        postsContainer.appendChild(postElement); // Append the post to the container
    });
};


// Initialize fetching and displaying posts on page load
const init = async () => {
    const token = localStorage.getItem('accessToken'); // Retrieve the token from local storage

    if (!token) {
        console.error('No access token found. Please log in.'); // Check if token exists
        return;
    }

    try {
        const posts = await fetchPosts(token); // Fetch posts using the token
        console.log('Fetched posts:', posts); // Log the fetched posts for debugging
        displayPosts(posts); // Call the function to display posts
    } catch (error) {
        console.error('Error fetching posts:', error); // Handle errors
    }
};

// Call the init function when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
