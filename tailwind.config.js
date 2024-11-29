module.exports = {
  content: ["./**/*.html", "./**/*.js"], // Ensure TailwindCSS purges unused styles by looking through all HTML and JS files
  theme: {
    extend: {
      colors: {
        "grey-blue": "#A6AEBF", // Custom grey-blue color
        "light-green": "#D0E8C5", // Custom light green color
        "card-color": '#C5D3E8', // Custom color for cards
        "light-card-color": '#E3EBF4', // Lighter variant for card color
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        // Custom utility to center content both vertically and horizontally
        ".center": {
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "100vh", 
        },

        // Custom input field styling for registration form
        ".input-field-reg": {
          width: "100%", 
          padding: "0.5rem 1rem", 
          marginTop: "0.5rem", 
          border: "1px solid #D1D3D4", 
          borderRadius: "0.5rem", 
          color: "#2D3748", 
        },

        // Custom title styling for post card
        ".post-card-title": {
          fontSize: "1.5rem", 
          fontWeight: "600", 
          color: theme("colors.gray.800"), 
          marginBottom: "1rem", 
        },
        ".post-card-title a": {
          color: theme("colors.gray.800"), 
          textDecoration: "none", 
          transition: "color 0.2s ease", 
        },
        ".post-card-title a:hover": {
          color: theme("colors.blue.500"), 
        },

        // Post card body text styling
        ".post-card-body": {
          color: theme("colors.gray.600"), 
          fontSize: "0.875rem", 
          marginBottom: "1rem", 
          wordWrap: "break-word", 
          overflow: "hidden", 
          whiteSpace: "normal", 
        },

        // Meta information (author, date) for post card
        ".post-card-meta": {
          fontSize: "0.75rem", 
          color: theme("colors.gray.500"), 
          marginBottom: "0.5rem", 
        },

        // Avatar image styling for post card
        ".post-card-avatar": {
          width: "3rem", 
          height: "3rem", 
          borderRadius: "9999px", 
          marginRight: "0.75rem", 
        },

        // Footer section styling for post card (like/share buttons)
        ".post-card-footer": {
          marginTop: "1rem", 
          display: "flex", 
          alignItems: "center", 
        },

        ".post-card-footer span": {
          fontSize: "0.875rem", 
          color: theme("colors.gray.700"), 
        },

        // Header styling (navigation or top bar)
        '.header': {
          backgroundColor: '#D0E8C5', 
          padding: '1rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #D1D3D4', 
        },

        // Links in the header
        '.header a': {
          color: '#333', 
          marginLeft: '1rem', 
          textDecoration: 'none', 
          fontWeight: '500', 
          transition: 'color 0.3s', 
        },
        '.header a:hover': {
          color: '#007bff', 
        },

        // Button styling for header buttons
        '.header button': {
          backgroundColor: '#007bff', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          border: 'none', 
          borderRadius: '0.25rem', 
          cursor: 'pointer', 
          transition: 'background-color 0.3s', 
        },

        // Search bar styling
        '.search-bar': {
          padding: '0.5rem 1rem', 
          backgroundColor: '#FFF8DE', 
          marginBottom: '1rem', 
        },

        // Comment details section styling
        '.comment-details': {
          display: 'block', 
          padding: '2rem', 
        },

        // Profile header background and padding
        '.profile-header': {
          backgroundColor: "#FFF8DE", 
          paddingTop: theme('spacing.8'), 
          paddingBottom: theme('spacing.8'), 
        },

        // Profile banner image styling
        '.profile-banner': {
          width: '100%', 
          height: '12rem', 
          objectFit: 'cover', 
        },

        // Profile info card styling
        '.profile-info': {
          maxWidth: '48rem', 
          marginLeft: 'auto', 
          marginRight: 'auto', 
          padding: theme('spacing.6'), 
          backgroundColor: '#FFF8DE', 
          borderRadius: theme("borderRadius.lg"), 
          boxShadow: theme("boxShadow.lg"), 
          marginTop: '-4rem', 
        },

        // Profile avatar styling
        '.profile-avatar': {
          width: '6rem', 
          height: '6rem', 
          borderRadius: '9999px', 
          borderWidth: '4px', 
          borderColor: theme('colors.white'), 
          boxShadow: theme('boxShadow.md'), 
        },

        // Profile name styling (text size, weight)
        '.profile-name': {
          fontSize: theme('fontSize.3xl'), 
          fontWeight: theme('fontWeight.semibold'), 
        },

        // Profile stats section (e.g., followers, posts)
        '.profile-stats': {
          display: 'flex', 
          justifyContent: 'center', 
          paddingTop: theme('spacing.4'), 
          borderTopWidth: '1px', 
          marginTop: theme('spacing.4'), 
        },

        // Individual stat styling (followers, posts, etc.)
        '.profile-stats span': {
          marginLeft: theme('spacing.6'), 
          fontWeight: theme('fontWeight.semibold'), 
        },

        // Edit post form styling
        ".edit-post-form": {
          backgroundColor: '#C5D3E8', 
          padding: "1.5rem", 
          borderRadius: theme("borderRadius.lg"), 
          boxShadow: theme("boxShadow.md"), 
          display: "flex", 
          flexDirection: "column", 
          gap: "1rem", 
        },

        // Input field styling for edit form
        ".edit-input": {
          width: "100%", 
          padding: "0.5rem", 
          border: `1px solid ${theme("colors.gray.300")}`, 
          borderRadius: theme("borderRadius.md"), 
          fontSize: theme("fontSize.sm"), 
          outline: "none", 
          transition: "border-color 0.2s", 
          backgroundColor: '#E1E8F0', 
        },
        ".edit-input:focus": {
          borderColor: theme("colors.blue.500"), 
          backgroundColor: '#E1E8F0', 
        },

        // Textarea styling for edit form
        ".edit-textarea": {
          width: "100%", 
          padding: "0.5rem", 
          border: `1px solid ${theme("colors.gray.300")}`, 
          borderRadius: theme("borderRadius.md"), 
          fontSize: theme("fontSize.sm"), 
          outline: "none", 
          transition: "border-color 0.2s", 
          minHeight: "100px", 
          backgroundColor: '#E1E8F0', 
        },
        ".edit-textarea:focus": {
          borderColor: theme("colors.blue.500"), 
          backgroundColor: '#E1E8F0', 
        },

        // Submit button for edit form
        ".edit-submit-btn": {
          backgroundColor: theme("colors.blue.500"), 
          color: theme("colors.white"), 
          padding: "0.5rem 1rem", 
          borderRadius: theme("borderRadius.md"), 
          fontSize: theme("fontSize.sm"), 
          fontWeight: "bold", 
          textTransform: "uppercase", 
          cursor: "pointer", 
          transition: "background-color 0.3s", 
        },
        ".edit-submit-btn:hover": {
          backgroundColor: theme("colors.blue.600"), 
        },

        // Card component styling
        '.card': {
          backgroundColor: '#C5D3E8', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          padding: '1.5rem', 
          marginBottom: '1.5rem', 
          maxWidth: '48rem', 
          marginLeft: '2rem', 
          marginRight: '2rem', 
          marginTop: '1rem', 
        },
      });
    },
  ],
};
