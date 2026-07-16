/**
 * 全局类型声明
 */

import { LIGHT_MODE, DARK_MODE, SYSTEM_MODE } from "../constants";

type ThemeMode = typeof LIGHT_MODE | typeof DARK_MODE | typeof SYSTEM_MODE;

declare global {
	interface Window {
		__theme: {
			/**
			 * 获取当前主题模式（light/dark/system）
			 */
			getMode: () => ThemeMode;
			/**
			 * 设置主题模式
			 */
			setMode: (mode: ThemeMode) => void;
			/**
			 * 循环切换主题模式：light -> dark -> system -> light
			 */
			cycleMode: () => ThemeMode;
			/**
			 * 获取解析后的实际主题（light | dark），把 system 解析为具体值
			 */
			getResolved: () => "light" | "dark";
			/**
			 * 液态玻璃视觉是否启用（只读，由 siteConfig.glassTheme.enable 决定）
			 * 现在与 light/dark 叠加生效，不再锁定主题切换
			 */
			glassEnabled: boolean;
		};
	}
}

export {};
