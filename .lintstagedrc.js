module.exports = {
  // TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // JSON, YAML, and Markdown files
  '*.{json,yml,yaml,md}': ['prettier --write'],

  // CSS files
  '*.{css,scss}': ['prettier --write'],

  // Run type check on TypeScript files
  '**/*.ts?(x)': () => 'pnpm type-check',
};
