const accessToken = localStorage.getItem('accessToken');

// Function to fetch post details including comments and reactions
async function fetchPostDetails(postId) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}?_comments=true&_reactions=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'X-Noroff-API-Key': 'a359f87a-47df-408e-ac4e-a6490a77b19c',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const postData = await response.json();
        displayPostDetails(postData.data);
    } catch (error) {
        console.error('Error fetching post details:', error);
    }
}

// Function to display post details including reactions
function displayPostDetails(post) {
    const postContainer = document.getElementById('post-container');
    
    // Populate post details
    postContainer.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <p>Tags: ${post.tags.join(', ')}</p>
        <img src="${post.media?.url}" alt="${post.media?.alt || 'Post Image'}" class="post-image">
        <p>Posted on: ${new Date(post.created).toLocaleDateString()}</p>
        <p><strong>${post._count.comments} Comments</strong></p>
        <p><strong>${post._count.reactions} Reactions</strong></p>
    `;

    // Display reactions if they exist
    if (post.reactions && post.reactions.length > 0) {
        const reactionsContainer = document.createElement('div');
        reactionsContainer.innerHTML = `<h3>Reactions:</h3>`;
        
        post.reactions.forEach(reaction => {
            reactionsContainer.innerHTML += `
                <div class="reaction">
                    <p>${reaction.symbol} - ${reaction.count} people reacted</p>
                </div>
            `;
        });

        postContainer.appendChild(reactionsContainer);
    } else {
        postContainer.innerHTML += `<p>No reactions yet.</p>`;
    }

    // Display comments if they exist
    if (post.comments && post.comments.length > 0) {
        const commentsContainer = document.createElement('div');
        commentsContainer.innerHTML = `<h3>Comments:</h3>`;
        
        post.comments.forEach(comment => {
            commentsContainer.innerHTML += `
                <div class="comment">
                    <p><strong>${comment.author.name}:</strong> ${comment.body}</p>
                    <p><small>Posted on: ${new Date(comment.created).toLocaleDateString()}</small></p>
                </div>
            `;
        });

        postContainer.appendChild(commentsContainer);
    } else {
        postContainer.innerHTML += `<p>No comments yet.</p>`;
    }
}

// Get postId from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');

// Fetch post details when the page loads
if (postId) {
    fetchPostDetails(postId);
}
