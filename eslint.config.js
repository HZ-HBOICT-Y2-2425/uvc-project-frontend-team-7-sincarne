import globals from 'globals';
import tseslint from 'typescript-eslint';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['src/**/*.ts']},
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  {ignores: [".server/*, .build/*, .svelte-kit/*, .github/*"]},

  {rules: {
    'no-console': 'warn',            // Warn when `console` statements are used
    'no-unused-vars': 'warn',        // Warn on unused variables
    '@typescript-eslint/no-unused-vars': 'warn', // TypeScript-specific rule for unused vars
    'semi': ['error', 'always'],     // Enforce semicolons at the end of statements
    'eqeqeq': ['error', 'always'],   // Require strict equality checks (===)
    '@typescript-eslint/explicit-module-boundary-types': 'error', // Enable explicit return types for functions
    '@typescript-eslint/no-explicit-any': 'warn', // Warn when `any` type is used
    'prefer-const': 'error',         // Prefer `const` over `let` when not reassigned
    'no-var': 'error',               // Disallow `var`, prefer `let` or `const`
    'arrow-body-style': ['error', 'as-needed'], // Enforce concise arrow function syntax
    'consistent-return': 'error',    // Ensure return statements are consistent
    'linebreak-style': ['off', 'unix'], // Enforce Unix-style line breaks (\n)
    'no-trailing-spaces': 'warn',   // Disallow trailing spaces at the end of lines
    'comma-dangle': ['error', 'always-multiline'], // Enforce trailing commas in multiline statements
    'max-len': ['warn', { 'code': 120 }],
    "@typescript-eslint/ban-ts-comment": "off",
  }},
];