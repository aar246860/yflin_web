import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL ?? 'https://aar246860.github.io',
  base: process.env.BASE_PATH ?? '/yflin_web',
	vite: {
		plugins: [tailwindcss()],
	},
});
