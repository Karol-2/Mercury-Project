/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "sans": [
        "Open Sans",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Helvetica Neue",
        "Arial",
      ],
    },
    colors: {
      "my-orange": "#FF8001",
      "my-orange-dark": "#a85a0c",
      "my-purple": "#3E0C70",
      "my-red": "#CA1A1A",
      "my-cancel": "#FF7976",
      "my-accept": "#10D019",
      "my-light-dark": "#333B45",
      "my-dark": "#21262D",
      "my-darker": "#121519",
      "my-light": "#EDE9E9",
      "my-lighter": "#F4F4F4",
      "my-green": "#3E4F13",
    },
    extend: {},
  },
  plugins: [],
};
