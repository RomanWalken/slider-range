/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'geo-primary': '#144344',
        'geo-primary-hover': '#103e39',
        'geo-primary-focus': '#0e3833',
        'geo-accent': '#1AA6B0',

        'geo-darkprimary': '#d9eeef',
        'geo-darkprimary-hover': '#edf5f5',
        'geo-darkprimary-focus': '#edf5f5',
        'geo-darkaccent': '#11bee5',

        gray: {
          '50': '#fafafa',
          '100': '#f5f5f5',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '400': '#bdbdbd',
          '500': '#9e9e9e',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
        },

        'darkwhite': "#111827", //900
        'darkblack': "#f9fafb", //50
        'darkgray': {
          50: "#18202f",
          100: "#1f2937", //800
          200: "#374151", //700
          300: "#4b5563", //600
          400: "#6b7280", //500
          500: "#9ca3af", //400
          600: "#d1d5db", //300
          700: "#e5e7eb", //200
          800: "#f3f4f6", //100
          900: "#f3f4f6", //100
        },
      },
    },
  },
  plugins: [],
}

