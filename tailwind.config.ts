/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00D1B2",
        secondary: "#D4AF37",
        accent: "#FF5A5F",
        midnight: "#0A0A0B",
        card: "rgba(28, 28, 30, 0.6)",
        // Missing colors used in components
        authority: "#1A1D1E",
        teal: "#00D1B2",
        sage: "#A8C69F",
        "sage-dark": "#8DA385",
        saffron: "#F4C430",
        "saffron-dark": "#D1A624",
        cream: "#F5F5F7",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        outfit: ["var(--font-outfit)"],
        playfair: ["var(--font-playfair)"],
        hindi: ["var(--font-noto-hindi)"],
      },
      borderRadius: {
        'antigravity': '16px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
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
