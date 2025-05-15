/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    fontFamily: {
      "kalam": ["Kalam"],
      "DM_Mono": ['"DM Mono"', 'monospace']
    },
    extend: {
      colors: {
        'sky-100-custom': 'rgb(219 234 254 / <alpha-value>)', // #dbeafe
        'sky-200-custom': 'rgb(186 230 253 / <alpha-value>)', // #bae6fd
        'blue-300-custom': '#4285F4', // #60a5fa
        'indigo-200-custom': 'rgb(199 210 254 / <alpha-value>)', // #c7d2fe
        'purple-100-custom': 'rgb(237 233 254 / <alpha-value>)', // #ede9fe
        'rose-100-custom': 'rgb(255 228 230 / <alpha-value>)', // #ffe4e6
        'emerald-100-custom': 'rgb(209 250 229 / <alpha-value>)', // #d1fae5
      }
    }
  },
  plugins: [],
}
