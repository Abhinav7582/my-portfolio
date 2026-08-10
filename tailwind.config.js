/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tertiary text. Tailwind's gray-500 (#6b7280) measures 3.29:1 against
        // this site's nebula-lit surfaces — below the 4.5:1 AA threshold — and
        // gray-600/700 are far worse. This is the quietest neutral that still
        // passes. Use `text-muted` for de-emphasised text; never gray-500 or
        // darker. A test enforces it.
        muted: "#8b95a8",
      },
    },
  },
  plugins: [],
}