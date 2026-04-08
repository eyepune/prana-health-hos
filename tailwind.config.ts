/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          light: "#E8F1F0",
          DEFAULT: "#2A7E74",
          dark: "#1D5952",
        },
        saffron: {
          light: "#F7E9CE",
          DEFAULT: "#E1B35B",
          dark: "#B88E3E",
        },
        authority: "#1A1D1E",
        cream: "#F8F9F5",
      },
      borderRadius: {
        'antigravity': '16px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      animation: {
        'pulse-gentle': 'pulse-gentle 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
