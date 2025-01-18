module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended'
    ],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
      'complexity': ['error', { 'max': 20 }],
    },
    env: {
      browser: true,
      node: true,
    },
  };
  
  