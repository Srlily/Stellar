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
		// 注意：原本 swup 默认会加载 ScrollPlugin 接管滚动条，
		// 与 ScrollSmoother 的整页惯性滚动冲突，会导致无级滚动失效。
		// 这里通过空 plugins 数组禁用默认插件，仅保留页面过渡主题。
		swup({
			theme: Theme.slide,
			containers: ['#swup'],
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			// 禁用 Swup 自带的 ScrollPlugin（其会接管滚动条），
			// 让 GSAP ScrollSmoother 独占滚动控制，实现无级滚动。
			smoothScrolling: false,
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