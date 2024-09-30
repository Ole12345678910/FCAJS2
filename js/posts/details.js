/*import {addComment, deleteComment} from '../api/api.js'; // Import necessary functions
import { API_KEY,API_BASE } from "../constants/config.js";

// Function to get the post ID from the URL
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('postId'); // Retrieve the postId from the URL
}

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
        const response = await fetch(`${API_BASE}/social/posts/${postId}?_comments=true&_reactions=true&_author=true`, {
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

        if (!post.data) {
            document.getElementById('post-details').innerHTML = '<p>Post not found.</p>';
            return;
        }

        const author = post.data.author || {};
        const authorName = author.name || 'Unknown'; // Fallback if name is undefined
        const authorUsername = author.username || authorName; // Use author's username

        // Debugging logs
        console.log('Author Name:', authorName);
        console.log('Author Username:', authorUsername);

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

        document.getElementById('post-details').innerHTML = postHtml;

        document.getElementById('author-link').addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            handleAuthorClick(authorName, authorUsername); // Call the function with the author's name and username
        });

        const comments = post.data.comments || [];
        await displayComments(comments, postId, token); // Pass the postId and token

        document.getElementById('comment-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleCommentSubmit(postId, token);
        });

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

// Function to handle author click (unchanged)
async function handleAuthorClick(authorName, authorUsername) {
    const token = localStorage.getItem('accessToken'); // Get the token from local storage

    if (!authorUsername) {
        console.error('Username is not defined for the author');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/social/profiles/${authorUsername}`, {
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

        // Redirect to user.html with author's username as a query parameter
        window.location.href = `/templates/user/user.html?username=${encodeURIComponent(authorUsername)}`;

    } catch (error) {
        console.error('Error fetching author profile:', error.message);
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
        const response = await fetch(`${API_BASE}/social/posts/${postId}/react/${encodeURIComponent(symbol)}`, {
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
*/

// post-details.js

import { fetchPostDetails, fetchAuthorProfile, addComment, deleteComment, reactToPost } from '../api/api.js';

// Function to get the post ID from the URL
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('postId'); // Retrieve the postId from the URL
}

// Function to display post details
async function displayPostDetails() {
    const token = localStorage.getItem('accessToken');
    const postId = getPostIdFromUrl();

    if (!token) {
        console.error('No access token found. Please log in first.');
        return;
    }

    if (!postId) {
        document.getElementById('post-details').innerHTML = '<p>No post ID found in the URL.</p>';
        return;
    }

    try {
        const post = await fetchPostDetails(postId, token);

        if (!post.data) {
            document.getElementById('post-details').innerHTML = '<p>Post not found.</p>';
            return;
        }

        const author = post.data.author || {};
        const authorName = author.name || 'Unknown';
        const authorUsername = author.username || authorName;

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

        document.getElementById('post-details').innerHTML = postHtml;

        document.getElementById('author-link').addEventListener('click', (e) => {
            e.preventDefault();
            handleAuthorClick(authorName, authorUsername);
        });

        const comments = post.data.comments || [];
        await displayComments(comments, postId, token);

        document.getElementById('comment-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleCommentSubmit(postId, token);
        });

        document.querySelectorAll('.reaction-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const symbol = e.target.dataset.symbol;
                await handleReaction(postId, symbol, token);
            });
        });

    } catch (error) {
        console.error('Error fetching post details:', error.message);
        document.getElementById('post-details').innerHTML = '<p>Error fetching post details.</p>';
    }
}

// Function to handle author click
async function handleAuthorClick(authorName, authorUsername) {
    const token = localStorage.getItem('accessToken');
    
    if (!authorUsername) {
        console.error('Username is not defined for the author');
        return;
    }

    try {
        const authorProfile = await fetchAuthorProfile(authorUsername, token);
        console.log('Author Profile:', authorProfile);

        // Redirect to user profile page
        window.location.href = `/templates/user/user.html?username=${encodeURIComponent(authorUsername)}`;
    } catch (error) {
        console.error('Error fetching author profile:', error.message);
    }
}

// Function to display comments
async function displayComments(comments, postId, token) {
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

    document.querySelectorAll('.delete-comment-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const commentId = e.target.dataset.commentId;
            await handleCommentDelete(postId, commentId, token);
        });
    });
}

// Function to handle comment submission
async function handleCommentSubmit(postId, token) {
    const commentBody = document.getElementById('comment-body').value;

    if (!commentBody.trim()) {
        alert('Comment cannot be empty!');
        return;
    }

    try {
        await addComment(postId, commentBody, token);
        document.getElementById('comment-body').value = '';
        await displayPostDetails();
    } catch (error) {
        console.error('Error adding comment:', error.message);
    }
}

// Function to handle comment deletion
async function handleCommentDelete(postId, commentId, token) {
    try {
        await deleteComment(postId, commentId, token);
        document.getElementById(`comment-${commentId}`).remove();
    } catch (error) {
        console.error('Error deleting comment:', error.message);
    }
}

// Function to handle adding a reaction
async function handleReaction(postId, symbol, token) {
    try {
        await reactToPost(postId, symbol, token);
        await displayPostDetails();
    } catch (error) {
        console.error('Error adding reaction:', error.message);
    }
}

// Call displayPostDetails on page load
document.addEventListener('DOMContentLoaded', displayPostDetails);
