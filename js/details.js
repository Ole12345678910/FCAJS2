import { fetchPosts, addComment, deleteComment, API_KEY } from './api.js'; // Import necessary functions

// Function to get the post ID from the URL
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('postId'); // Retrieve the postId from the URL
}
async function handleAuthorClick(authorName) {
    const token = localStorage.getItem('accessToken'); // Get the token from local storage

    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${authorName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the bearer token here
                'X-Noroff-API-Key': API_KEY, // Include your API key if required
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch author profile: ${response.status} ${response.statusText}`);
        }

        const authorProfile = await response.json();
        console.log('Author Profile:', authorProfile.data);

        // Redirect to user.html with author's name as a query parameter
        window.location.href = `user.html?username=${encodeURIComponent(authorProfile.data.name)}`;

    } catch (error) {
        console.error('Error fetching author profile:', error.message);
    }
}



// Function to display post details
async function displayPostDetails() {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    const postId = getPostIdFromUrl(); // Get the post ID from URL

    if (!token) {
        console.error('No access token found. Please log in first.');
        return;
    }

    if (!postId) {
        document.getElementById('post-details').innerHTML = '<p>No post ID found in the URL.</p>';
        return;
    }

    try {
        // Fetch post details including comments, reactions, and author
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}?_comments=true&_reactions=true&_author=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post details: ${response.status} ${response.statusText}`);
        }

        const post = await response.json();
        
        // Check if the post exists
        if (!post.data) {
            document.getElementById('post-details').innerHTML = '<p>Post not found.</p>';
            return;
        }

        const author = post.data.author || {};
        const authorName = author.name || 'Unknown'; // Fallback if name is undefined

        // Generate HTML content for the post details
        const postHtml = `
            <div class="post">
                <h2>${post.data.title}</h2>
                <p>${post.data.body}</p>
                ${post.data.media ? `<img src="${post.data.media.url}" alt="${post.data.media.alt}" style="max-width:100%;">` : ''}
                <p>Tags: ${post.data.tags.join(', ')}</p>
                <p>Created: ${new Date(post.data.created).toLocaleString()}</p>
                <p>Author: <a href="#" id="author-link">${authorName}</a></p>
                ${author.avatar ? `<img src="${author.avatar.url}" alt="${author.avatar.alt}" style="width: 50px; height: 50px; border-radius: 50%;">` : ''}
                <p>Comments: ${post.data._count.comments}</p>
                <p>Reactions:</p>
                <ul id="reaction-list">
                    ${post.data.reactions.map(reaction => `
                        <li>${reaction.symbol}: ${reaction.count} (${reaction.reactors.join(', ')})</li>
                    `).join('')}
                </ul>
                <div id="reaction-section">
                    <button class="reaction-btn" data-symbol="👍">👍</button>
                    <button class="reaction-btn" data-symbol="❤️">❤️</button>
                    <button class="reaction-btn" data-symbol="😂">😂</button>
                    <button class="reaction-btn" data-symbol="😮">😮</button>
                    <button class="reaction-btn" data-symbol="😢">😢</button>
                    <button class="reaction-btn" data-symbol="😡">😡</button>
                </div>
            </div>
            <h3>Comments</h3>
            <div id="comments-section"></div>
            <form id="comment-form">
                <textarea id="comment-body" placeholder="Add a comment..."></textarea>
                <button type="submit">Submit Comment</button>
            </form>
        `;

        // Insert the post details into the DOM
        document.getElementById('post-details').innerHTML = postHtml;

        // Add event listener for author link
        document.getElementById('author-link').addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            handleAuthorClick(authorName); // Call the function with the author's name
        });

        // Fetch and display comments for the post
        const comments = post.data.comments || [];
        await displayComments(comments, postId, token); // Pass the postId and token

        // Set up the comment form submission event
        document.getElementById('comment-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleCommentSubmit(postId, token);
        });

        // Set up reaction buttons
        document.querySelectorAll('.reaction-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const symbol = e.target.dataset.symbol; // Get the emoji symbol from the button
                await handleReaction(postId, symbol, token); // Call the handleReaction function
            });
        });

    } catch (error) {
        console.error('Error fetching post details:', error.message);
        document.getElementById('post-details').innerHTML = '<p>Error fetching post details.</p>';
    }
}

// Function to display comments for a post
async function displayComments(comments, postId, token) {
    try {
        if (!comments.length) {
            document.getElementById('comments-section').innerHTML = '<p>No comments available.</p>';
            return;
        }

        const commentsHtml = comments.map(comment => `
            <div class="comment" id="comment-${comment.id}">
                <p><strong>${comment.author?.name || comment.owner}</strong>: ${comment.body}</p>
                ${comment.author?.avatar ? `<img src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" style="width: 30px; height: 30px; border-radius: 50%;">` : ''}
                <p><small>Posted on: ${new Date(comment.created).toLocaleString()}</small></p>
                <button class="delete-comment-btn" data-comment-id="${comment.id}">Delete</button>
            </div>
        `).join('');

        document.getElementById('comments-section').innerHTML = commentsHtml;

        // Add delete functionality to each delete button
        document.querySelectorAll('.delete-comment-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const commentId = e.target.dataset.commentId;
                await handleCommentDelete(postId, commentId, token); // Ensure postId is defined
            });
        });

    } catch (error) {
        console.error('Error displaying comments:', error.message);
        document.getElementById('comments-section').innerHTML = '<p>Error loading comments.</p>';
    }
}

// Function to handle submitting a new comment
async function handleCommentSubmit(postId, token) {
    const commentBody = document.getElementById('comment-body').value;

    if (!commentBody.trim()) {
        alert('Comment cannot be empty!');
        return;
    }

    try {
        await addComment(postId, commentBody, token);
        document.getElementById('comment-body').value = ''; // Clear the textarea
        await displayPostDetails(); // Refresh the post details and comments
    } catch (error) {
        console.error('Error adding comment:', error.message);
    }
}

// Function to handle deleting a comment
async function handleCommentDelete(postId, commentId, token) {
    try {
        await deleteComment(postId, commentId, token);
        document.getElementById(`comment-${commentId}`).remove(); // Remove the comment from the DOM
    } catch (error) {
        console.error('Error deleting comment:', error.message);
    }
}

// Function to handle submitting a reaction
async function handleReaction(postId, symbol, token) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/react/${encodeURIComponent(symbol)}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
            }
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Failed to add reaction: ${response.status} ${response.statusText} - ${errorResponse.message || 'No additional error message'}`);
        }

        const reactionData = await response.json();
        console.log('Reaction added:', reactionData);
        await displayPostDetails(); // Refresh the post details and reactions
    } catch (error) {
        console.error('Error adding reaction:', error.message);
    }
}

// Call displayPostDetails on page load
document.addEventListener('DOMContentLoaded', displayPostDetails);
