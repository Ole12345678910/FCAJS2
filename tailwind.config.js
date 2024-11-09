module.exports = {
  content: ["./**/*.html", "./**/*.js"],
  theme: {
    extend: {
      colors: {
        "grey-blue": "#A6AEBF",
        "light-green": "#D0E8C5",
        "card-color": '#C5D3E8',
        "light-card-color": '#E3EBF4',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities(
        {
          ".center": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh", // Ensures content is vertically centered
          },
          ".my-custom-class": {
            width: "100%",
            padding: "0.5rem 1rem", // px-4 py-2
            marginTop: "0.5rem", // mt-2
            border: "1px solid #D1D3D4", // border-gray-300
            borderRadius: "0.5rem", // rounded-lg
            color: "#2D3748",
          },
          // Post card styles
          ".post-card": {
            backgroundColor: "#C5D3E8", // Apply custom background color
            borderRadius: "0.5rem", // rounded-lg
            boxShadow: theme("boxShadow.md"),
            padding: "1.5rem", // p-6
            marginBottom: "1.5rem", // mb-6
            overflow: "hidden",
            transition: "box-shadow 0.3s ease",
            width: "600px", // Corrected property
          },

          ".post-card:hover": {
            boxShadow: theme("boxShadow.lg"),
          },
          ".post-card-title": {
            fontSize: "1.5rem", // text-2xl
            fontWeight: "600", // font-semibold
            color: theme("colors.gray.800"),
            marginBottom: "1rem", // mb-4
          },
          ".post-card-title a": {
            color: theme("colors.gray.800"),
            textDecoration: "none",
            transition: "color 0.2s ease",
          },
          ".post-card-title a:hover": {
            color: theme("colors.blue.500"),
          },
          ".post-card-body": {
            color: theme("colors.gray.600"),
            fontSize: "0.875rem", // text-sm
            marginBottom: "1rem", // mb-4
          },
          ".post-card-media": {
            maxWidth: "800px",
            height: "auto",
            borderRadius: "0.5rem", // rounded-lg
            marginBottom: "1rem", // mb-4
          },
          ".post-card-meta": {
            fontSize: "0.75rem", // text-xs
            color: theme("colors.gray.500"),
            marginBottom: "0.5rem",
          },
          ".post-card-avatar": {
            width: "3rem", // w-12
            height: "3rem", // h-12
            borderRadius: "9999px", // rounded-full
            marginRight: "0.75rem", // mr-3
          },
          ".post-card-footer": {
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
          },
          ".post-card-footer span": {
            fontSize: "0.875rem", // text-sm
            color: theme("colors.gray.700"),
          },
          '.header': {
            backgroundColor: '#D0E8C5', // light-green color
            padding: '1rem', // p-4
            display: 'flex', // Flexbox for layout
            justifyContent: 'space-between', // Space between items
            alignItems: 'center', // Vertically align items in the center
            borderBottom: '1px solid #D1D3D4', // Light border for separation
          },
          '.header a': {
            color: '#333', // Text color for links
            marginLeft: '1rem', // Space between links
            textDecoration: 'none', // Remove underline from links
            fontWeight: '500', // Make the text a bit bolder
            transition: 'color 0.3s', // Smooth color transition
          },
          '.header a:hover': {
            color: '#007bff', // Change color on hover (blue)
          },
          '.header button': {
            backgroundColor: '#007bff', // Blue background for the button
            color: '#fff', // White text color
            padding: '0.5rem 1rem', // Padding for the button
            border: 'none', // Remove border
            borderRadius: '0.25rem', // Rounded corners
            cursor: 'pointer', // Pointer cursor on hover
            transition: 'background-color 0.3s', // Smooth transition on hover
          },
          '.header button:hover': {
            backgroundColor: '#0056b3', // Darker blue on hover
          },
          '.search-bar':{
            padding: '0.5rem 1rem',
            backgroundColor: '#FFF8DE',
            marginBottom: '1rem',
          },
          '.comment-details':{
            display: 'block',
            padding: '2rem',

          },
          '.image-comment':{
            display: 'block',
            padding: '2rem',
          },
          '.profile-header': {
            backgroundColor: "#FFF8DE",
            paddingTop: theme('spacing.8'),
            paddingBottom: theme('spacing.8'),
          },
          '.profile-banner': {
            width: '100%',
            height: '12rem', // Equivalent to h-48
            objectFit: 'cover',
          },
          '.profile-info': {
            maxWidth: '48rem', // max-w-4xl
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: theme('spacing.6'), // p-6
            backgroundColor: '#FFF8DE',
            borderRadius: theme('borderRadius.lg'), // rounded-lg
            boxShadow: theme('boxShadow.lg'), // shadow-lg
            marginTop: '-4rem', // -mt-16
          },
          '.profile-avatar': {
            width: '6rem', // w-24
            height: '6rem', // h-24
            borderRadius: '9999px', // rounded-full
            borderWidth: '4px',
            borderColor: theme('colors.white'),
            boxShadow: theme('boxShadow.md'), // shadow-md
          },
          '.profile-name': {
            fontSize: theme('fontSize.3xl'), // text-3xl
            fontWeight: theme('fontWeight.semibold'), // font-semibold

          },
          '.profile-bio': {

            fontSize: theme('fontSize.base'), // text-base
          },
          '.profile-stats': {
            display: 'flex',
            justifyContent: 'center',
            paddingTop: theme('spacing.4'), // pt-4
            borderTopWidth: '1px',
            marginTop: theme('spacing.4'), // mt-4
          },
          '.profile-stats span': {
            marginLeft: theme('spacing.6'), // space-x-6

            fontWeight: theme('fontWeight.semibold'), // font-semibold
          },
          ".edit-post-form": {
            backgroundColor: '#C5D3E8',
            padding: "1.5rem",
            borderRadius: theme("borderRadius.lg"),
            boxShadow: theme("boxShadow.md"),
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          },
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
        },
        ["responsive", "hover"]
      ); // Add variants if needed (e.g., hover)
    },
  ],
};
