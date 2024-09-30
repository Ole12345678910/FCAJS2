
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
        console.log(`Comment ${commentId} deleted successfully.`);
        document.getElementById(`comment-${commentId}`).remove(); // Remove the comment from the DOM
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
