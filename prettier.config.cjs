/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  arrowParens: "avoid",
  bracketSameLine: false,
  printWidth: 80,
  jsxSingleQuote: true,
  singleAttributePerLine: false,
};

module.exports = config;
