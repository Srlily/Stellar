/**
 * 全局类型声明
 */

import { LIGHT_MODE, DARK_MODE, SYSTEM_MODE } from "../constants";

declare global {
	interface Window {
		__theme: {
			/**
			 * 获取当前主题模式
			 * @returns "light" | "dark" | "system"
			 */
			getMode: () => typeof LIGHT_MODE | typeof DARK_MODE | typeof SYSTEM_MODE;
			/**
			 * 设置主题模式
			 * @param mode 主题模式 "light" | "dark" | "system"
			 */
			setMode: (mode: typeof LIGHT_MODE | typeof DARK_MODE | typeof SYSTEM_MODE) => void;
			/**
			 * 循环切换主题模式：light -> dark -> system -> light
			 * @returns 切换后的主题模式
			 */
			cycleMode: () => typeof LIGHT_MODE | typeof DARK_MODE | typeof SYSTEM_MODE;
			/**
			 * 获取液态玻璃主题是否启用
			 */
			getGlassEnabled: () => boolean;
			/**
			 * 设置液态玻璃主题启用状态
			 */
			setGlassEnabled: (enabled: boolean) => void;
			/**
			 * 切换液态玻璃主题
			 * @returns 切换后的状态
			 */
			toggleGlass: () => boolean;
		};
	}
}

export {};
