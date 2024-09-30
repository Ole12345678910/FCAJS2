// delete.js

/**
 * Function to delete a post by its ID
 * @param {number} postId - The ID of the post to delete
 * @param {string} token - The authorization token
 * @returns {Promise<boolean>} - Returns true if the deletion was successful, otherwise false
 */
export const deletePost = async (postId, token) => {
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        return true; // Return true if deletion was successful
    } catch (error) {
        console.error('Error deleting post:', error);
        return false; // Return false if there was an error
    }
};
