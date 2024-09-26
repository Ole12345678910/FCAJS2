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

export const API_KEY = "a359f87a-47df-408e-ac4e-a6490a77b19c";


// Function to log in the user
export const loginUser = async (email, password) => {
  const response = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': API_KEY // Your actual API key
      },
      body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
      throw new Error('Login failed: ' + response.status); // Throw error if login fails
  }

  const data = await response.json();
  console.log('Login response data:', data); // Log the entire response for debugging

  const token = data.data.accessToken; // Assuming this is correctly fetched
  const name = data.data.name; // Accessing the name from the data object

  localStorage.setItem('accessToken', token); // Store token in local storage
  localStorage.setItem('username', name); // Store name in local storage as 'username'
  console.log('Stored Username:', localStorage.getItem('username')); // Verify stored name
  return token; // Return the access token
};

// Function to fetch posts
export const fetchPosts = async (token) => {
  const response = await fetch('https://v2.api.noroff.dev/social/posts', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`, // Use the token passed as an argument
          'X-Noroff-API-Key': API_KEY // Replace with your actual API key
      }
  });

  if (!response.ok) {
      throw new Error('Fetching posts failed: ' + response.status); // Throw error if fetching fails
  }

  const data = await response.json(); // Parse the response data
  return data.data; // Return the posts from the data object
};
