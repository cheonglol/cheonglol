import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://cheonglol.github.io',
  base: '/cheonglol',
  output: 'static',
  integrations: [react()],
  // Use Dart Sass's modern JS API (the legacy API is deprecated).
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern' },
      },
    },
  },
});
