module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      accent: 'var(--accent)',
      error: 'var(--text-error)',
      yellow: "#FFA801",
      white: "#fff",
      primary: 'var(--text-primary)',
      transparent: 'rgba(0,0,0,0)',
      bg: {
        shade: 'rgba(0,0,0,0.25)',
        dark: 'var(--bg-dark)',
        DEFAULT: 'var(--bg)',
        light: 'var(--bg-light)',
      },
      contrast: 'var(--contrast)',
      grey: {
        0: 'var(--grey-0)',
        1: 'var(--grey-1)',
        2: 'var(--grey-2)',
        5: 'var(--grey-5)'
      }
    },
    extend: {
      transitionProperty: {
        width: "width"
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
