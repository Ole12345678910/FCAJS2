# FCAJS2

## Overview

This documentation provides a brief overview of the project's structure and functionality. The application is designed for managing user posts, authentication, and profiles.

## File Structure

```
/FCAJS2
│
├── package.json           # The main npm configuration file that lists dependencies and scripts
├── postcss.config.js      # PostCSS configuration file, used with TailwindCSS for build process
├── tailwind.config.js     # TailwindCSS configuration file, used for customizing your Tailwind setup
│
├── /api                  # API usage for fetching and interacting with data
│   └── api.js            # Handles all API interactions
│
├── /auth                 # Authentication functionalities
│   ├── login.js          # User login functionality
│   ├── logout.js         # User logout functionality
│   └── register.js       # User registration functionality
│
├── /constants            # Contains constants like API keys, configuration
│   └── config.js         # Stores and exports API keys and links
│
├── /posts                # Post-related functionalities
│   ├── create.js         # Creating new posts
│   ├── delete.js         # Deleting posts
│   ├── details.js        # Viewing post details
│   ├── post.js           # General post functionalities
│   └── postFollow.js     # Following/unfollowing posts
│
├── /user                 # User profile management functionalities
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
├── index.html            # Main HTML file for the application
│
├── /css                  # CSS folder containing styles
│   └── style.css         # Your base stylesheet for the app
│
├── /dist                 # Output folder for compiled styles (after running build)
│   └── style.css         # Compiled Tailwind CSS file (generated after build)
│
└── README.md             # Documentation file (your project readme)

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


## Installation

To set up the project on your local machine, follow these steps:

1. **Install all required packages**:
   Run the following command to install all dependencies defined in `package.json`:
   ```bash
   npm install
   ```
   > **Note**: You can also use `npm i` as a shortcut for `npm install`.

2. **Run CSS Watch**:
   To automatically compile your CSS changes, run the following command:
   ```bash
   npm run watch
   ```

---

