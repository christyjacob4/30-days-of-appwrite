module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        small: '0px 4px 8px rgba(55, 59, 77, 0.08)',
        large: '0px 16px 32px rgba(55, 59, 77, 0.04)'
      },
      colors: {
        primary: {
          10: "#FFEBF8",
          50: "#FF80B7",
          100: "#F02E65",
          110: "#DA1A5B",
          120: "#C00D53",
          200: "#370016"
        },
        secondary: {
          10: '#F1FCFE',
          50: '#C8F2FC',
          100: '#00A7C3',
          120: '#007187',
          200: '#04333A'
        },
        success: {
          10: '#EFFEF7',
          50: '#BFFCDD',
          100: '#00BC5D',
          120: '#00754A',
          200: '#06331C'
        },
        warning: {
          10: '#FFF7EE',
          50: '#FFE1C0',
          100: '#F38500',
          120: '#B34700',
          200: '#462701'
        },
        danger: {
          10: '#FFF5F5',
          50: '#FFD5D4',
          100: '#FF453A',
          120: '#B31212',
          200: '#3E0503'
        },
        neutral: {
          0: "#FCFCFF",
          5: "#F2F2F8",
          10: "#E8E9F0",
          30: "#C4C6D7",
          50: "#A3A8BD",
          100: "#616B7C",
          120: "#4F5769",
          150: "#373B4D",
          170: "#282A3B",
          190: "#1B1B28",
          200: "#14141F"
        },
        generic: {
          0: '#FFFFFF',
          100: '#000000'
        },

      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
