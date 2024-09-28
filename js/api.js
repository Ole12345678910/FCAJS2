/* Define your API key
export const myApiKey = "5794466a-ac21-441f-8a55-385e2fda14c7";

// Define and export the fetchApi function
export async function fetchApi(myApiKey) {
    const options = {
      headers: {
        Authorization: `Bearer ${myApiKey}`,
      },
    };
  
    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/social/posts",
        options
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching API data:", error);
      throw error;
    }
  }



// Function to fetch all posts
async function fetchPosts(accessToken) {
  try {
    const response = await fetch('https://v2.api.noroff.dev/social/posts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Include the access token in the header
        'x-api-key': '5794466a-ac21-441f-8a55-385e2fda14c7', // Include the API key
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts.');
    }

    const data = await response.json();
    console.log('Posts data:', data); // Handle the posts data (display it or process it as needed)
    
    // Example: Display post titles
    data.data.forEach(post => {
      console.log(`Post Title: ${post.title}`);
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}





// Function to login and fetch posts
async function loginAndFetchPosts(email, password) {
  const loginData = {
    email: email,
    password: password
  };

  try {
    // Perform login
    const loginResponse = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'fdccecf5-d8e5-4b5a-a514-136cd4b3a09b'
      },
      body: JSON.stringify(loginData)
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed.');
    }

    const loginDataResponse = await loginResponse.json();
    const accessToken = loginDataResponse.data.accessToken;
    console.log('Login successful! Access Token:', accessToken);

    // Fetch and display posts using the access token
    await fetchAndDisplayPosts(accessToken);

  } catch (error) {
    console.error('Error during login and fetching posts:', error);
  }
}

// Usage
const email = 'olebul00997@stud.noroff.no'; // Replace with actual user email
const password = 'passord123';   // Replace with actual password
loginAndFetchPosts(email, password);
*/

// api.js
export const API_KEY = "a359f87a-47df-408e-ac4e-a6490a77b19c";

const API_BASE_URL = "https://v2.api.noroff.dev";

// Update a specific post
export async function updatePost(postId, updatedPost, token) {
  try {
      const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${token}`,
              'X-Noroff-API-Key': API_KEY, // Ensure the API key is included
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedPost)
      });

      // Log the entire response for debugging
      console.log('Response from updatePost:', response);

      if (!response.ok) {
          const errorResponse = await response.json(); // Ensure you fetch the JSON error response
          console.error('Error updating post:', errorResponse);
          return { status: response.status, error: errorResponse }; // Return status and error
      }

      return { status: response.status, data: await response.json() }; // Return status and data
  } catch (error) {
      console.error('Error making update request:', error.message);
      throw error;
  }
}


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

export async function fetchPosts(token) {
  const response = await fetch(`https://v2.api.noroff.dev/social/posts?_author=true`, {
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
}

// Function to fetch user profile by username
export const getUserProfile = async (username, accessToken) => {
    const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${username}`, {
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

    const profileData = await response.json();
    return profileData.data;
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
    return postsData.data;
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

    return true; // Return success
};


// Function to fetch all user profiles
export const fetchAllUserProfiles = async (accessToken) => {
  const response = await fetch('https://v2.api.noroff.dev/social/profiles', {
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

  const profilesData = await response.json();
  return profilesData;
};

// Function to add a comment to a post
export const addComment = async (postId, commentBody, token) => {
  const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment`, {
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

// Function to delete a comment from a post
export const deleteComment = async (postId, commentId, token) => {
  const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment/${commentId}`, {
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