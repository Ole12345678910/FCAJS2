

// api.js
export const API_KEY = "a359f87a-47df-408e-ac4e-a6490a77b19c";

const API_BASE_URL = "https://v2.api.noroff.dev";

// Function to log in the user
export const loginUser = async (email, password) => {
    const response = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed: ' + response.status);
    }

    const data = await response.json();
    const token = data.data.accessToken;
    const name = data.data.name;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', name);
    return token;
};



// Function to search posts
export async function searchPosts(token, query) {
  const response = await fetch(`${API_BASE_URL}/social/posts/search?q=${encodeURIComponent(query)}&_author=true`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': API_KEY
      }
  });

  if (!response.ok) {
      throw new Error('Failed to search posts');
  }

  return await response.json();
}

// Function to update a post
export async function updatePost(postId, updatedPost, token) {
  try {
      const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${token}`,
              'X-Noroff-API-Key': API_KEY,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedPost)
      });

      if (!response.ok) {
          const errorResponse = await response.json();
          console.error('Error updating post:', errorResponse);
          return { status: response.status, error: errorResponse };
      }

      return { status: response.status, data: await response.json() };
  } catch (error) {
      console.error('Error making update request:', error.message);
      throw error;
  }
}

// Function to fetch user profile by username
export const getUserProfile = async (username, accessToken) => {
    const response = await fetch(`${API_BASE_URL}/social/profiles/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Noroff-API-Key': API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch profile for ${username}`);
    }

    const data = await response.json();
    return data.data; // Return profile data
};

export const addComment = async (postId, commentBody, token) => {
  const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment`, { // Singular 'comment'
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': API_KEY,
      },
      body: JSON.stringify({
          body: commentBody
      })
  });

  if (!response.ok) {
      throw new Error('Failed to add comment: ' + response.statusText);
  }

  const data = await response.json();
  return data;
};


export const deleteComment = async (postId, commentId, token) => {
  const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment/${commentId}`, { // Use singular 'comment'
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': API_KEY,
      }
  });

  if (!response.ok) {
      throw new Error('Failed to delete comment: ' + response.statusText);
  }

  return true; // If successful, return true
};

// Function to fetch posts made by a specific user profile
export const fetchUserPostsByProfile = async (username, accessToken) => {
  const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${username}/posts`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': API_KEY,
      },
  });

  if (response.status === 401) {
      throw new Error('Unauthorized access. Please check your token.');
  }

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  const postsData = await response.json();
  return postsData.data; // Return the posts data
};

// Function to delete a post
export const deletePost = async (postId, accessToken) => {
  const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': API_KEY,
      },
  });

  if (response.status === 401) {
      throw new Error('Unauthorized access. Please check your token.');
  }

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  return true; // Return success if the delete was successful
};


export async function searchProfiles(token, query) {
    const response = await fetch(`http://your-api-endpoint/social/profiles/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching profiles: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the array of profiles found
}


// Function to fetch posts with optional limit and sorting
export async function fetchPosts(token, limit = 15, sort = 'created') {
  try {
      const response = await fetch(`${API_BASE_URL}/social/posts?_author=true&sort=${sort}&limit=${limit}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'X-Noroff-API-Key': API_KEY,
          }
      });

      if (!response.ok) {
          throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      return data.data; // Ensure this returns an array of posts
  } catch (error) {
      console.error('Error fetching posts:', error.message);
      throw error; // Rethrow to handle in the UI
  }
}


// api.js

export async function fetchPostsFromFollowers(token) {
  const response = await fetch('https://v2.api.noroff.dev/social/posts/following', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`, // Ensure this is correct
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': API_KEY

      }
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data; // Adjust based on your API response structure
}
