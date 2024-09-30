# FCAJS2

## Overview

This documentation provides a brief overview of the project's structure and functionality. The application is designed for managing user posts, authentication, and profiles.

## File Structure

```
/FCAJS2
│
├── api.js                # API usage for fetching and interacting with data
│
├── /auth
│   ├── login.js          # User login functionality
│   ├── logout.js         # User logout functionality
│   └── register.js       # User registration functionality
│
├── /constants
│   └── config.js         # Exports of API keys and links
│
├── /posts
│   ├── create.js         # Creating new posts
│   ├── delete.js         # Deleting posts
│   ├── details.js        # Viewing post details
│   ├── post.js           # General post functionalities
│   └── postFollow.js     # Following/unfollowing posts
│
├── /user
│   ├── profile.js        # User profile management
│   └── user.js           # Managing other users' profiles
│
├── /templates            # Contains HTML templates for the application
│   ├── /auth
│   │   ├── login.html    # HTML for user login
│   │   └── register.html # HTML for user registration
│   │
│   ├── /posts
│   │   ├── create.html   # HTML for creating a new post
│   │   ├── details.html  # HTML for viewing post details
│   │   └── postFollow.html# HTML for following/unfollowing posts
│   │
│   ├── /user
│       ├── profile.html  # HTML for viewing/editing user profile
│       └── user.html     # HTML for viewing other users' profiles
│   
├──────── index.html      # Main HTML file for the application

```

## Directory Descriptions

- **API**: The `api.js` file handles all API interactions, including fetching and posting data.
- **Auth**: The `/auth` directory manages user login, logout, and registration.
- **Constants**: The `config.js` file stores API keys and links for easy access and maintenance.
- **Posts**: The `/posts` directory contains functionality for creating, deleting, and managing posts and related actions.
- **User**: The `/user` directory manages user profile views, including the logged-in user's posts and interactions with other users.

## Usage

1. **User Registration**: Create a new account using the registration page.
2. **User Login**: Log in to access personal features.
3. **Manage Posts**: Create, view, edit, or delete your posts.
4. **Comment and React**: Engage with posts through comments and reactions.
5. **Follow Users**: Follow other users to see their posts.

## API Documentation

The application uses a RESTful API for managing user accounts and posts, including endpoints for registration, authentication, and post management.

---