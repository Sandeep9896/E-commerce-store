import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Easy to customize from here
        brand: {
          primary: '#dda15e',    // Golden/Amber - Main brand color
          secondary: '#bc6c25',  // Darker amber - Accent color
          dark: '#283618',       // Dark green - Background/Footer
          light: '#fefae0',      // Cream - Text/Light background
          accent: '#606c38',     // Olive green - Additional accent
        },
        // Semantic Colors for UI components
        primary: {
          DEFAULT: '#dda15e',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#bc6c25',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#606c38',
          foreground: '#fefae0',
        },
        background: '#ffffff',
        foreground: '#1a1a1a',
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        border: '#e5e5e5',
        // Status Colors
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
  },
  plugins: [animate],
};
