/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Hier definieren wir Ihre benutzerdefinierten Farben,
      // damit Tailwind sie als Klassen wie 'bg-secondary-green' versteht.
      colors: {
        'primary-dark': 'var(--primary-dark)',
        'secondary-green': 'var(--secondary-green)',
        'green-hover': 'var(--green-hover)',
        'green-light': 'var(--green-light)',
        'tertiary-red': 'var(--tertiary-red)',
        'red-hover': 'var(--red-hover)',
        'red-light': 'var(--red-light)',
        'crew-blue': 'var(--crew-blue)',
        'crew-blue-light': 'var(--crew-blue-light)',
        'blog-yellow': 'var(--blog-yellow)',
        'blog-orange': 'var(--blog-orange)',
        'event-orange': 'var(--event-orange)',
        'event-orange-dark': 'var(--event-orange-dark)',
        'route-green': 'var(--route-green)',
        'route-brown': 'var(--route-brown)',
      }
    },
  },
  plugins: [],
}