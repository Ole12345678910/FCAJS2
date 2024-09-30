// Import necessary API functions and utilities
import { fetchPostDetails, fetchAuthorProfile, addComment, deleteComment, reactToPost } from '../api/api.js';

/**
 * Retrieves the post ID from the URL.
 * @returns {string|null} The post ID or null if not found.
 */
const getPostIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('postId'); // Retrieve the postId from the URL
};

/**
 * Displays the details of the post, including title, body, media, tags, comments, and reactions.
 * It fetches the post details and updates the HTML content of the page accordingly.
 * @async
 * @returns {Promise<void>} 
 */
const displayPostDetails = async () => {
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

        const { title, body, media, tags, created, _count, reactions, comments = [] } = post.data;
        const author = post.data.author || {};
        const authorName = author.name || 'Unknown';
        const authorUsername = author.username || authorName;

        const postHtml = `
            <div class="post">
                <h2>${title}</h2>
                <p>${body}</p>
                ${media ? `<img src="${media.url}" alt="${media.alt}" style="max-width:100%;">` : ''}
                <p>Tags: ${tags.join(', ')}</p>
                <p>Created: ${new Date(created).toLocaleString()}</p>
                <p>Author: <a href="#" id="author-link">${authorName}</a></p>
                ${author.avatar ? `<img src="${author.avatar.url}" alt="${author.avatar.alt}" style="width: 50px; height: 50px; border-radius: 50%;">` : ''}
                <p>Comments: ${_count.comments}</p>
                <p>Reactions:</p>
                <ul id="reaction-list">
                    ${reactions.map(reaction => `
                        <li>${reaction.symbol}: ${reaction.count} (${reaction.reactors.join(', ')})</li>
                    `).join('')}
                </ul>
                <div id="reaction-section">
                    ${['👍', '❤️', '😂', '😮', '😢', '😡'].map(symbol => `
                        <button class="reaction-btn" data-symbol="${symbol}">${symbol}</button>
                    `).join('')}
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

        // Add event listeners
        document.getElementById('author-link').addEventListener('click', (e) => {
            e.preventDefault();
            handleAuthorClick(authorUsername);
        });

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
};

/**
 * Handles the author link click event.
 * Fetches the author's profile and redirects to the author's page.
 * @async
 * @param {string} authorUsername - The username of the author.
 * @returns {Promise<void>}
 */
const handleAuthorClick = async (authorUsername) => {
    const token = localStorage.getItem('accessToken');

    if (!authorUsername) {
        console.error('Username is not defined for the author');
        return;
    }

    try {
        await fetchAuthorProfile(authorUsername, token);
        window.location.href = `/templates/user/user.html?username=${encodeURIComponent(authorUsername)}`;
    } catch (error) {
        console.error('Error fetching author profile:', error.message);
    }
};

/**
 * Displays the comments for the post.
 * @async
 * @param {Array} comments - The array of comment objects.
 * @param {string} postId - The ID of the post.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const displayComments = async (comments, postId, token) => {
    const commentsSection = document.getElementById('comments-section');
    if (!comments.length) {
        commentsSection.innerHTML = '<p>No comments available.</p>';
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

    commentsSection.innerHTML = commentsHtml;

    document.querySelectorAll('.delete-comment-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const commentId = e.target.dataset.commentId;
            await handleCommentDelete(postId, commentId, token);
        });
    });
};

/**
 * Handles the submission of a new comment.
 * @async
 * @param {string} postId - The ID of the post to which the comment is being added.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const handleCommentSubmit = async (postId, token) => {
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
};

/**
 * Handles the deletion of a comment.
 * @async
 * @param {string} postId - The ID of the post from which the comment is being deleted.
 * @param {string} commentId - The ID of the comment to delete.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const handleCommentDelete = async (postId, commentId, token) => {
    try {
        await deleteComment(postId, commentId, token);
        document.getElementById(`comment-${commentId}`).remove(); // Remove the comment from the DOM
    } catch (error) {
        console.error('Error deleting comment:', error.message);
    }
};

/**
 * Handles adding a reaction to a post.
 * @async
 * @param {string} postId - The ID of the post to which the reaction is being added.
 * @param {string} symbol - The reaction symbol (e.g., 👍, ❤️).
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>}
 */
const handleReaction = async (postId, symbol, token) => {
    try {
        await reactToPost(postId, symbol, token);
        await displayPostDetails();
    } catch (error) {
        console.error('Error adding reaction:', error.message);
    }
};

// Call displayPostDetails on page load
document.addEventListener('DOMContentLoaded', displayPostDetails);

