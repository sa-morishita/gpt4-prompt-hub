module.exports = {
  "*.{js,jsx,ts,tsx}": () => [
    "npm run format",
    "npm run check-lint",
    "npm run check-types",
  ],
};
