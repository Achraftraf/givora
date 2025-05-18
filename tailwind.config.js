/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-raleway)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(220, 149, 255, 0.5)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#d946ef",
          secondary: "#8b5cf6",
          accent: "#f43f5e",
          neutral: "#334155",
          "base-100": "#f1f5f9",
          "base-200": "#e2e8f0",  
          "base-300": "#cbd5e1",
          info: "#3abff8",
          success: "#22c55e",
          warning: "#facc15",  
          error: "#ef4444",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#d946ef",
          secondary: "#8b5cf6",
          accent: "#f43f5e",
          neutral: "#1e293b",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          info: "#3abff8",
          success: "#22c55e",
          warning: "#facc15",
          error: "#ef4444",
        },
      },
    ],
  },
};