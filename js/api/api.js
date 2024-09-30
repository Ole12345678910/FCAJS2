// Import necessary config
import {
    API_KEY,
    API_BASE,
    API_AUTH_LOGIN,
    API_AUTH_REGISTER,
    API_SOCIAL_POSTS,
    API_SOCIAL_PROFILES,
} from "../constants/config.js";

// Common headers for API requests
const getHeaders = (token = null) => ({
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
    ...(token && { Authorization: `Bearer ${token}` }), // Only add Authorization if token is provided
});

// Helper function to perform API requests
/**
 * Makes an API request.
 *
 * @param {string} url - The endpoint URL.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {string|null} token - Optional access token for authorization.
 * @param {Object|null} body - Optional request body.
 * @returns {Promise<Object>} The response data.
 * @throws {Error} If the request fails.
 */
const apiRequest = async (url, method, token = null, body = null) => {
    const response = await fetch(url, {
        method,
        headers: getHeaders(token),
        ...(body && { body: JSON.stringify(body) }), // Add body if provided
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
            `${method} request failed: ${response.status} ${response.statusText} - ${errorResponse.message || ""}`
        );
    }

    return response.json();
};

// Authentication Functions

/**
 * Logs in a user and stores the token in localStorage.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} The access token.
 */
export const loginUser = async (email, password) => {
    const data = await apiRequest(API_AUTH_LOGIN, "POST", null, { email, password });
    const token = data.data.accessToken;
    const name = data.data.name;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("username", name);
    return token;
};

/**
 * Registers a user and logs them in, storing the token in localStorage.
 *
 * @param {Object} userData - The user's registration data.
 * @returns {Promise<Object>} The logged-in user data.
 */
export const registerUserApi = async (userData) => {
    await apiRequest(API_AUTH_REGISTER, "POST", null, userData);
    
    const loginData = await apiRequest(API_AUTH_LOGIN, "POST", null, {
        email: userData.email,
        password: userData.password,
    });

    const token = loginData.data.accessToken;
    const name = loginData.data.name;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', name);
    return loginData.data; // Return the logged-in user data
};

// Post Functions

/**
 * Creates a new post.
 *
 * @param {Object} postData - The post data to be created.
 * @returns {Promise<boolean>} True if the post was created successfully, otherwise false.
 */
export const createPost = async (postData) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        console.error("Access token is missing. User might not be logged in.");
        return false;
    }

    if (!postData.title) {
        console.error("Post data is missing the title property.");
        return false;
    }

    try {
        await apiRequest(API_SOCIAL_POSTS, "POST", accessToken, postData);
        return true; // Indicate success
    } catch (error) {
        console.error("Error creating post:", error);
        return false; // Indicate failure
    }
};

/**
 * Updates an existing post.
 *
 * @param {string} postId - The ID of the post to be updated.
 * @param {Object} updatedPost - The updated post data.
 * @param {string} token - The access token.
 * @returns {Promise<Object>} The updated post data.
 */
export const updatePost = async (postId, updatedPost, token) => {
    return await apiRequest(`${API_SOCIAL_POSTS}/${postId}`, "PUT", token, updatedPost);
};

/**
 * Deletes a post.
 *
 * @param {string} postId - The ID of the post to be deleted.
 * @returns {Promise<boolean>} True if the post was deleted successfully, otherwise false.
 */
export const deletePost = async (postId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error("No token found. Please log in.");
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/social/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Failed to delete post: ${response.status} - ${response.statusText}, Details: ${JSON.stringify(errorDetails)}`);
        }
        return true;
    } catch (error) {
        console.error('Error deleting post:', error.message);
        return false;
    }
};

/**
 * Fetches posts made by a specific user profile.
 *
 * @param {string} username - The username of the profile.
 * @param {string} accessToken - The access token.
 * @returns {Promise<Object[]>} The user's posts.
 */
export const fetchUserPostsByProfile = async (username, accessToken) => {
    return (await apiRequest(`${API_SOCIAL_PROFILES}/${username}/posts`, "GET", accessToken)).data;
};

/**
 * Searches for posts based on a query.
 *
 * @param {string} token - The access token.
 * @param {string} query - The search query.
 * @returns {Promise<Object[]>} The search results.
 */
export const searchPosts = async (token, query) => {
    return await apiRequest(
        `${API_SOCIAL_POSTS}/search?q=${encodeURIComponent(query)}&_author=true`,
        "GET",
        token
    );
};

// Comment Functions

/**
 * Adds a comment to a post.
 *
 * @param {string} postId - The ID of the post.
 * @param {string} commentBody - The body of the comment.
 * @param {string} token - The access token.
 * @returns {Promise<Object>} The response data.
 */
export const addComment = async (postId, commentBody, token) => {
    return await apiRequest(`${API_SOCIAL_POSTS}/${postId}/comment`, "POST", token, {
        body: commentBody,
    });
};

/**
 * Deletes a comment from a post.
 *
 * @param {string} postId - The ID of the post.
 * @param {string} commentId - The ID of the comment.
 * @param {string} token - The access token.
 * @returns {Promise<Object>} The response.
 * @throws {Error} If the deletion fails.
 */
export const deleteComment = async (postId, commentId, token) => {
    const response = await fetch(`${API_SOCIAL_POSTS}/${postId}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
        },
    });

    if (!response.ok) {
        try {
            const errorResponse = await response.json();
            throw new Error(
                `Failed to delete comment: ${response.status} - ${errorResponse.message || "No additional error message"}`
            );
        } catch {
            throw new Error(`Failed to delete comment: ${response.status} - No additional error message`);
        }
    }

    return response; // If the response is empty, just return it
};

// Profile Functions

/**
 * Fetches a user profile by username.
 *
 * @param {string} username - The username of the profile.
 * @param {string} accessToken - The access token.
 * @returns {Promise<Object>} The user profile data.
 */
export const getUserProfile = async (username, accessToken) => {
    return (await apiRequest(`${API_SOCIAL_PROFILES}/${username}`, "GET", accessToken)).data;
};

/**
 * Searches profiles based on a query.
 *
 * @param {string} token - The access token.
 * @param {string} query - The search query.
 * @returns {Promise<Object[]>} The search results.
 */
export const searchProfiles = async (token, query) => {
    return await apiRequest(`${API_SOCIAL_PROFILES}/search?q=${encodeURIComponent(query)}`, "GET", token);
};

// Follow/Unfollow Functions

/**
 * Follows a user.
 *
 * @param {string} username - The username of the user to follow.
 * @param {string} token - The access token.
 * @returns {Promise<boolean>} True if the follow was successful, otherwise false.
 */
export const followUser = async (username, token) => {
    try {
        await apiRequest(`${API_SOCIAL_PROFILES}/${username}/follow`, "PUT", token);
        return true; // Indicate success
    } catch (error) {
        console.error("Failed to follow user:", error);
        return false; // Indicate failure
    }
};

/**
 * Unfollows a user.
 *
 * @param {string} username - The username of the user to unfollow.
 * @param {string} token - The access token.
 * @returns {Promise<boolean>} True if the unfollow was successful, otherwise false.
 */
export const unfollowUser = async (username, token) => {
    try {
        await apiRequest(`${API_SOCIAL_PROFILES}/${username}/unfollow`, "PUT", token);
        return true; // Indicate success
    } catch (error) {
        console.error("Failed to unfollow user:", error);
        return false; // Indicate failure
    }
};

/**
 * Fetches posts from followed users.
 *
 * @param {string} token - The access token.
 * @returns {Promise<Object[]>} The posts from followed users.
 */
export const fetchPostsFromFollowers = async (token) => {
    return (await apiRequest(`${API_SOCIAL_POSTS}/following`, "GET", token)).data;
};

/**
 * Fetches posts with optional limit and sorting.
 *
 * @param {string} token - The access token.
 * @param {number} limit - The number of posts to fetch (default is 15).
 * @param {string} sort - The sorting criteria (default is "created").
 * @returns {Promise<Object[]>} The fetched posts.
 */
export const fetchPosts = async (token, limit = 15, sort = "created") => {
    return (await apiRequest(`${API_SOCIAL_POSTS}?_author=true&sort=${sort}&limit=${limit}`, "GET", token)).data;
};

/**
 * Fetches post details including comments, reactions, and author information.
 *
 * @param {string} postId - The ID of the post.
 * @param {string} token - The access token.
 * @returns {Promise<Object>} The post details.
 */
export const fetchPostDetails = async (postId, token) => {
    return await apiRequest(
        `${API_SOCIAL_POSTS}/${postId}?_comments=true&_reactions=true&_author=true`,
        "GET",
        token
    );
};

/**
 * Fetches the profile of the post's author.
 *
 * @param {string} authorUsername - The username of the author.
 * @param {string} token - The access token.
 * @returns {Promise<Object>} The author's profile data.
 */
export const fetchAuthorProfile = async (authorUsername, token) => {
    return await apiRequest(`${API_SOCIAL_PROFILES}/${authorUsername}`, "GET", token);
};

/**
 * Reacts to a post with a specified symbol.
 *
 * @param {string} postId - The ID of the post to react to.
 * @param {string} symbol - The reaction symbol (e.g., emoji).
 * @param {string} token - The access token.
 * @returns {Promise<Object>} The response data.
 * @throws {Error} If the reaction fails.
 */
export const reactToPost = async (postId, symbol, token) => {
    const encodedSymbol = encodeURIComponent(symbol); // Encode the emoji
    const response = await fetch(`${API_SOCIAL_POSTS}/${postId}/react/${encodedSymbol}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
        },
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
            `Failed to add reaction: ${response.status} - ${errorResponse.message || "No additional error message"}`
        );
    }

    return await response.json(); // Return the response data if needed
};

/**
 * Fetches posts from followed users with author, comments, and reactions.
 *
 * @param {string} token - The access token.
 * @returns {Promise<Object[]>} The posts from followed users.
 */
export const fetchFollowedPostsApi = async (token) => {
    return await apiRequest(`${API_SOCIAL_POSTS}/following?_author=true&_comments=true&_reactions=true`, "GET", token);
};
