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

// Function to fetch posts
export const fetchPosts = async (token) => {
    const response = await fetch('https://v2.api.noroff.dev/social/posts', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
        }
    });

    if (!response.ok) {
        throw new Error('Fetching posts failed: ' + response.status);
    }

    const data = await response.json();
    return data.data; // Return the posts from the data object
};

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
