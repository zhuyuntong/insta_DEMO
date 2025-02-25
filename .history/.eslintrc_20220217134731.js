module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', 'prettier'],
  env: {
    browser: true,
  },

  // Allow use of console.log()
  rules: {
    'no-console': 0,
    // Rules for React Hooks
    // https://reactjs.org/docs/hooks-rules.html#eslint-plugin
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
};
