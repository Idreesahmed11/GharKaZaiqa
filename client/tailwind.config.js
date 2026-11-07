/** @type {import('tailwindcss').Config} */
export default { content: ['./index.html', './src/**/*.{js,jsx}'], theme: { extend: { colors: { brand: { 50: '#fff7ed', 100: '#ffedd5', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' } }, boxShadow: { soft: '0 12px 40px rgba(30, 41, 59, .08)' } } }, plugins: [] };
