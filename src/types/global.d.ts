/**
 * 全局类型声明
 */

import { LIGHT_MODE, DARK_MODE, SYSTEM_MODE } from "../constants";

type ThemeMode = typeof LIGHT_MODE | typeof DARK_MODE | typeof SYSTEM_MODE;

declare global {
	interface Window {
		__theme: {
			/**
			 * 获取当前主题模式
			 * @returns "light" | "dark" | "system"
			 */
			getMode: () => ThemeMode;
			/**
			 * 设置主题模式
			 * @param mode 主题模式 "light" | "dark" | "system"
			 */
			setMode: (mode: ThemeMode) => void;
			/**
			 * 循环切换主题模式：light -> dark -> system -> light
			 * @returns 切换后的主题模式
			 */
			cycleMode: () => ThemeMode;
			/**
			 * 液态玻璃是否启用（只读，由 siteConfig.glassTheme.enable 决定）
			 * 启用后深浅色切换失效且不显示切换按钮
			 */
			glassEnabled: boolean;
		};
	}
}

export {};
