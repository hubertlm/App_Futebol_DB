/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Se a IA usou cores customizadas, adicione aqui. 
        // Exemplo comum em dashboards "futebol":
        emerald: {
          500: '#10b981',
          900: '#064e3b',
        }
      }
    },
  },
  plugins: [],
}