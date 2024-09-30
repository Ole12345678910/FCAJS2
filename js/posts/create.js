import { API_KEY,API_BASE } from "../constants/config.js";

async function createPost(postData) {
  const accessToken = localStorage.getItem('accessToken');

  console.log('Access Token:', accessToken);
  console.log('API Key:', API_KEY);

  if (!accessToken) {
      console.error('Access token is missing. User might not be logged in.');
      return;
  }

  if (!postData.title) {
      console.error('Post data is missing the title property.');
      return;
  }

  console.log('Preparing to send post data:', postData);

  try {
      const response = await fetch(`${API_BASE}/social/posts`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'X-Noroff-API-Key': API_KEY // Ensure this is correct
          },
          body: JSON.stringify(postData)
      });

      // Log the response status and headers
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);

      if (!response.ok) {
          const errorResponse = await response.json();
          console.error('Error response from server:', errorResponse);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse.errors[0]?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Post created successfully:', data);
      console.log('Created Post Data:', data.data);
      
  } catch (error) {
      console.error('Error creating post:', error);
  }
}

// Set up form submission handler when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createPostForm');
  form.addEventListener('submit', async (event) => {
      console.log('Form submitted');
      event.preventDefault(); // Prevent the form from submitting the traditional way

      const title = document.getElementById('title').value;
      const body = document.getElementById('body').value;
      const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
      const mediaUrl = document.getElementById('mediaUrl').value;
      const mediaAlt = document.getElementById('mediaAlt').value;

      const postData = {
          title,
          body,
          tags,
          media: {
              url: mediaUrl,
              alt: mediaAlt
          }
      };

      console.log('Post data before creating:', postData); // Log post data
      await createPost(postData); // Call the createPost function with the gathered data
  });
});
