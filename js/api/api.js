import {
    API_KEY,
    API_BASE,
    API_AUTH,
    API_AUTH_LOGIN,
    API_AUTH_REGISTER,
    API_SOCIAL,
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
  const apiRequest = async (url, method, token = null, body = null) => {
    const response = await fetch(url, {
      method,
      headers: getHeaders(token),
      ...(body && { body: JSON.stringify(body) }), // Add body if provided
    });
  
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        `${method} request failed: ${response.status} ${response.statusText} - ${
          errorResponse.message || ""
        }`
      );
    }
  
    return response.json();
  };
  
  // Function to log in the user
  export const loginUser = async (email, password) => {
    const data = await apiRequest(`${API_AUTH_LOGIN}`, "POST", null, {
      email,
      password,
    });
    const token = data.data.accessToken;
    const name = data.data.name;
  
    localStorage.setItem("accessToken", token);
    localStorage.setItem("username", name);
    return token;
  };
  
// Function to register a user and store the token in localStorage
export const registerUserApi = async (userData) => {
    // Register the user
    const data = await apiRequest(`${API_AUTH_REGISTER}`, "POST", null, userData);
  
    // Automatically log the user in after registration (if the API returns a token)
    const loginData = await apiRequest(`${API_AUTH_LOGIN}`, "POST", null, {
      email: userData.email,
      password: userData.password,
    });
  
    // Extract token and name from the response
    const token = loginData.data.accessToken;
    const name = loginData.data.name;
  
    // Store token and user name in localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', name);
  
    // Optionally store other user details, like avatar or user profile, if available
    return loginData.data; // Return the logged-in user data
  };
  
  
  // Function to search posts
  export const searchPosts = async (token, query) => {
    return await apiRequest(
      `${API_SOCIAL_POSTS}/search?q=${encodeURIComponent(query)}&_author=true`,
      "GET",
      token
    );
  };
  
  // Function to update a post
  export const updatePost = async (postId, updatedPost, token) => {
    return await apiRequest(`${API_SOCIAL_POSTS}/${postId}`, "PUT", token, updatedPost);
  };
  
  // Function to fetch user profile by username
  export const getUserProfile = async (username, accessToken) => {
    return (await apiRequest(`${API_SOCIAL_PROFILES}/${username}`, "GET", accessToken)).data;
  };
  
  // Function to add a comment
  export const addComment = async (postId, commentBody, token) => {
    return await apiRequest(`${API_SOCIAL_POSTS}/${postId}/comment`, "POST", token, {
      body: commentBody,
    });
  };
  
  // Function to delete a comment
  export async function deleteComment(postId, commentId, token) {
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
          `Failed to delete comment: ${response.status} - ${
            errorResponse.message || "No additional error message"
          }`
        );
      } catch (e) {
        throw new Error(`Failed to delete comment: ${response.status} - No additional error message`);
      }
    }
  
    return response; // If the response is empty, just return it
  }
  
  // Function to fetch posts made by a specific user profile
  export const fetchUserPostsByProfile = async (username, accessToken) => {
    return (await apiRequest(`${API_SOCIAL_PROFILES}/${username}/posts`, "GET", accessToken)).data;
  };
  
  // Function to delete a post
  export const deletePost = async (postId, accessToken) => {
    await apiRequest(`${API_SOCIAL_POSTS}/${postId}`, "DELETE", accessToken);
    return true; // Return success if the delete was successful
  };
  
  // Function to search profiles
  export const searchProfiles = async (token, query) => {
    return await apiRequest(`${API_SOCIAL_PROFILES}/search?q=${encodeURIComponent(query)}`, "GET", token);
  };
  
  // Function to fetch posts with optional limit and sorting
  export const fetchPosts = async (token, limit = 15, sort = "created") => {
    return (await apiRequest(`${API_SOCIAL_POSTS}?_author=true&sort=${sort}&limit=${limit}`, "GET", token)).data;
  };
  
  // Function to fetch posts from followers
  export const fetchPostsFromFollowers = async (token) => {
    return (await apiRequest(`${API_SOCIAL_POSTS}/following`, "GET", token)).data;
  };
  
  // Fetch post details with comments, reactions, and author
  export const fetchPostDetails = async (postId, token) => {
    return await apiRequest(
      `${API_SOCIAL_POSTS}/${postId}?_comments=true&_reactions=true&_author=true`,
      "GET",
      token
    );
  };
  
  // Fetch author profile
  export const fetchAuthorProfile = async (authorUsername, token) => {
    return await apiRequest(`${API_SOCIAL_PROFILES}/${authorUsername}`, "GET", token);
  };
  
  // React to a post
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
        `Failed to add reaction: ${response.status} - ${
          errorResponse.message || "No additional error message"
        }`
      );
    }
  
    return await response.json(); // Return the response data if needed
  };
  
  // Function to create a post
  export const createPost = async (postData) => {
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      console.error("Access token is missing. User might not be logged in.");
      return false; // Indicate failure
    }
  
    if (!postData.title) {
      console.error("Post data is missing the title property.");
      return false; // Indicate failure
    }
  
    try {
      await apiRequest(`${API_SOCIAL_POSTS}`, "POST", accessToken, postData);
      return true; // Indicate success
    } catch (error) {
      console.error("Error creating post:", error);
      return false; // Indicate failure
    }
  };
  
  // Function to follow a user
  export const followUser = async (username, token) => {
    try {
      await apiRequest(`${API_SOCIAL_PROFILES}/${username}/follow`, "PUT", token);
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to follow user:", error);
      return false; // Indicate failure
    }
  };
  
  // Function to unfollow a user
  export const unfollowUser = async (username, token) => {
    try {
      await apiRequest(`${API_SOCIAL_PROFILES}/${username}/unfollow`, "PUT", token);
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      return false; // Indicate failure
    }
  };
  
  // Function to fetch posts from followed users
  export const fetchFollowedPostsApi = async (token) => {
    return await apiRequest(`${API_SOCIAL_POSTS}/following?_author=true&_comments=true&_reactions=true`, "GET", token);
  };
  

  