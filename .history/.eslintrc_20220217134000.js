module.exports = {
  extends: ['airbnb', 'prettier/react', "plugin:prettier/recommended"],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', 'prettier'],
  env: {
    browser: true,
  },

  // Allow use of console.log()
  rules: {
    'no-console': 0,
    "prettier/prettier": "error" // 开启规则
    // Rules for React Hooks
    // https://reactjs.org/docs/hooks-rules.html#eslint-plugin
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
};
