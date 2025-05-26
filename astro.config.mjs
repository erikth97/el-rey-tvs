import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    preact({ compat: true }),
    tailwind({
      config: { path: './tailwind.config.js' }
    })
  ],
  
  // Configuración específica para el proyecto
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
    split: true
  },
  
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
        '@components': new URL('./src/components', import.meta.url).pathname,
        '@utils': new URL('./src/utils', import.meta.url).pathname,
        '@assets': new URL('./public/assets', import.meta.url).pathname
      }
    }
  }
});