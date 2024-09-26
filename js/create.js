// create.js
const API_KEY = "a359f87a-47df-408e-ac4e-a6490a77b19c";



async function createPost(postData) {
    try {
      const response = await fetch('https://v2.api.noroff.dev/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Ensure accessToken is valid
          'x-api-key': 'a359f87a-47df-408e-ac4e-a6490a77b19c' // Your API key
        },
        body: JSON.stringify(postData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Post created successfully:', data);
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

        console.log('Post data before creating:', postData);
        await createPost(postData); // Call the createPost function with the gathered data
    });
});
