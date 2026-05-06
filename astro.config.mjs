import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  //base: '/Bar1592',
  vite: {
    plugins: [tailwindcss()],
  },
});