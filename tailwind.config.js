module.exports = {
  content: [
    './**/*.html',
    './**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'grey-blue': '#A6AEBF',
        'light-green': '#D0E8C5',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', // Ensures content is vertically centered
        },
        '.my-custom-class': {
          width: '100%',
          padding: '0.5rem 1rem', // px-4 py-2
          marginTop: '0.5rem', // mt-2
          border: '1px solid #D1D3D4', // border-gray-300
          borderRadius: '0.5rem', // rounded-lg
          color: '#2D3748',
        },
      }, ['responsive', 'hover']); // Add variants if needed (e.g., hover)
    },
  ],
};
