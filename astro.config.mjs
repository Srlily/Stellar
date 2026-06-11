// @ts-check
import { defineConfig } from 'astro/config';
import swup, { Theme } from '@swup/astro';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		swup({
			theme: Theme.slide,
			containers: ['#swup'],
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
		}),
	],
	vite: {
		// @ts-expect-error @tailwindcss/vite 在 pnpm 重复安装下与项目 vite 类型实例不兼容
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			},
		},
	},
});