import flowbite from "flowbite-react/tailwind";
import daisyui from "daisyui";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  safelist: [
    '!duration-[0ms]',
    '!delay-[0ms]',
    'html.js :where([class*="taos:"]:not(.taos-init))',
  ],
  theme: {
    extend: {
      // Added your specific big-size dimensions
      height: {
        '96vh': '96vh',
      },
      spacing: {
        '10rem': '10rem',
      },
      fonts: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        google: ['"Google Sans"', 'Arial', 'sans-serif']
      },
      fontSize: {
        accordionFont: ["16px"]
      },
      boxShadow: {
        cozy: "0px 4px 20px rgba(0, 0, 0, 0.03)",
        "cozy-lg": "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
      },
      transitionTimingFunction: {
        cozy: "ease-in-out",
      },
      transitionDuration: {
        cozy: "200ms",
      },
      keyframes: {
        // Your existing form animation
        formEnter: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // NEW: Your scroll-driven "appear" animation
        appear: {
          'from': { 
            opacity: '0', 
            transform: 'translateX(-100px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
      },
      animation: {
        formEnter: 'formEnter 0.5s ease-out forwards',
        // Standard non-scroll version if ever needed
        appear: 'appear 0.8s ease-out forwards', 
      },
    },
  },
  darkMode: "class",
  plugins: [
    flowbite.plugin(),
    daisyui,
    require('taos/plugin'),
    plugin(function ({ addComponents, addUtilities }) {
      // Added Utilities for the Scroll-Driven behavior
      addUtilities({
        '.animate-scroll-appear': {
          'animation': 'appear linear both',
          'animation-timeline': 'view()',
          'animation-range': 'entry 0% cover 40%',
        },
      });

      addComponents({
        '.cozy-transition': {
          transition: 'all 0.2s ease-in-out',
        },
        '.sidebar-item': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 20px',
          borderRadius: '24px',
          gap: '8px',
          transition: 'background-color 0.2s ease-in-out',
          cursor: 'pointer',
          width: 'fit-content',
          '&:hover': {
            backgroundColor: '#f4f5f7',
          },
          '&:hover .menu-text': {
            background: 'linear-gradient(to right, #65a30d, #06b6d4)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            'background-clip': 'text',
            fontWeight: '500',
          },
          '&:hover .icon': {
            fill: '#65a30d',
          },
        },
        '.modal-backdrop-blur': {
          backdropFilter: 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
        },
      });
    }),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake", "emerald", "corporate", "retro", "cyberpunk", "valentine", "aqua", "pastel", "fantasy", "wireframe", "luxury", "dracula", "business", "night", "coffee", "winter"],
    darkMode: "class",
  },
};