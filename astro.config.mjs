import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  base: '/bar-1592',
  vite: {
    plugins: [tailwindcss()],
  },
});
