import { getUserProfile } from '../api/api.js'; // Import API functions

// Render posts to the DOM
export function renderPosts(posts) {
  const postsContainer = document.getElementById("posts-container");
  
  // Check if posts is an array and has elements
  if (Array.isArray(posts) && posts.length > 0) {
    postsContainer.innerHTML = posts.map(createPostHtml).join("");
  } else {
    postsContainer.innerHTML = "<p>No posts found.</p>";
  }
}

// Create HTML for a single post
export function createPostHtml(post) {
  // Ensure post is defined before proceeding
  if (!post) {
    console.error("Post is undefined.");
    return "<p>Invalid post data.</p>";
  }

  return `
    <div class="post">
      <h3><a href="./posts/details.html?postId=${post.id}">${post.title}</a></h3>
      <p>${post.body || 'No content available'}</p>
      ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt || 'Post Image'}" style="max-width:100%;">` : ""}
      <p>Tags: ${post.tags && post.tags.length > 0 ? post.tags.join(", ") : "None"}</p>
      <p>Created: ${new Date(post.created).toLocaleString()}</p>
      <p>Comments: ${post._count?.comments ?? 0}</p>
      <p>Reactions: ${post._count?.reactions ?? 0}</p>
      <p>Author: ${post.author?.name ?? "Unknown"}</p>
      ${post.author?.avatar ? `<img src="${post.author.avatar.url}" alt="${post.author.avatar.alt || 'User Avatar'}" style="width: 50px; height: 50px; border-radius: 50%;">` : ""}
    </div>
  `;
}

// Function to display User Profile
export async function displayUserProfile() {
  const accessToken = localStorage.getItem('accessToken');
  const username = getUsernameFromStorage();

  if (!accessToken || !username) {
    console.error('User is not logged in or missing access token/username.');
    window.location.href = '/templates/auth/login.html'; // Redirect to login page
    return;
  }

  try {
    const profileResponse = await getUserProfile(username, accessToken);
    if (!profileResponse) throw new Error('Profile not found.');

    renderProfile(profileResponse);
    await displayUserPosts(username, accessToken); // Fetch and display posts after rendering the profile
  } catch (error) {
    console.error('Error loading profile data:', error.message);
    document.getElementById('profile-error').textContent = 'Error loading profile data.';
  }
}

// Function to render the profile
export function renderProfile(profile) {
  const profileContainer = document.getElementById('profile-container');
  profileContainer.innerHTML = `
    <div class="profile-header">
      <img src="${profile.banner?.url || 'default-banner.png'}" alt="${profile.banner?.alt || 'Profile Banner'}" class="profile-banner">
      <div class="profile-info">
        <img src="${profile.avatar?.url || 'default-avatar.png'}" alt="${profile.avatar?.alt || 'User Avatar'}" class="profile-avatar">
        <h1 class="profile-name">${profile.name || 'No name provided'}</h1>
        <p class="profile-bio">${profile.bio || 'No bio available'}</p>
        <div class="profile-stats">
          <span><strong>${profile._count.posts || 0}</strong> Posts</span>
          <span><strong>${profile._count.followers || 0}</strong> Followers</span>
          <span><strong>${profile._count.following || 0}</strong> Following</span>
        </div>
      </div>
    </div>
  `;
}
