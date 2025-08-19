// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */             // enable type hints
export default {                                        // export Tailwind config
  content: ["./index.html", "./src/**/*.{js,jsx}"],     // files Tailwind scans
  theme: { extend: {} },                                // extend defaults later
  plugins: [],                                          // add plugins when needed
}


