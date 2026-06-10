import type { BackgroundConfig } from "@/types/config";

export const backgroundConfig: BackgroundConfig = {
	// 背景模式："fullscreen" 全屏壁纸，"overlay" 全屏透明，"none" 纯色背景无壁纸
	mode: "fullscreen",

	/**
	 * 背景图片配置
	 * 图片路径支持三种格式：
	 *
	 * 1. 统一图片（所有主题共用）：
	 *    desktop: "https://example.com/bg.jpg"
	 *    mobile: "https://example.com/bg-mobile.jpg"
	 *
	 * 2. 多张随机图片（所有主题共用）：
	 *    desktop: ["url1", "url2", "url3"]
	 *    mobile: ["url1", "url2"]
	 *
	 * 3. 主题分离图片（根据暗黑/浅色主题显示不同图片）：
	 *    desktop: {
	 *      light: "https://example.com/light-bg.jpg",
	 *      dark: "https://example.com/dark-bg.jpg"
	 *    }
	 *    mobile: {
	 *      light: ["url1", "url2"],
	 *      dark: ["url3", "url4"]
	 *    }
	 *
	 */
	src: {
		desktop: "https://api.goodnightan.com/api/random?type=pc",
		mobile: "https://api.goodnightan.com/api/random?type=mobile",
	},

	// 全屏壁纸模式配置
	fullscreen: {
		position: "center", // 图片位置，如: 'center', 'top', 'bottom'
	},

	// 全屏透明覆盖模式配置
	overlay: {
		opacity: 0.8, // 壁纸透明度，0-1
		blur: 10, // 背景模糊度（像素）
		cardOpacity: 0.5, // 卡片透明度，0-1
	},

	// 背景加载动画效果
	// 可选值："shimmer" 流光扫描 | "pulse" 呼吸脉冲 | "wave" 波纹扩散 | "none" 无动画
	loadingEffect: "shimmer",
};
