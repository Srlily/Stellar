import type { ImageMetadata } from "astro";

// 主题类型：与 src/constants/index.ts 中的模式常量保持一致
export type Theme = "light" | "dark";

// 主题图片统一输出：本地（ImageMetadata）与远程（裸 URL）走同一个出口
export type ThemeImageSource = { src: string };

// 主题图片配置（对应 siteConfig.avatar 结构）
// 解析优先级：url > baseName（本地文件查找）
export interface ThemeImageConfig {
	baseName?: string; // 基础文件名（不含 -light/-dark 后缀和扩展名）
	path?: string; // 目录路径（相对于 src/），默认 "assets/images"
	extension?: string; // 文件扩展名；留空时按 baseName-light.* 自动探测首个命中
	url?: string | { light?: string; dark?: string }; // 远程图片链接，优先于本地查找
}

// 构建时预加载 assets/images 下所有 -light/-dark 主题图片
// 新增符合命名规范的文件无需修改此处，构建时自动纳入
const themeImages = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/images/**/*-{light,dark}.{png,jpg,jpeg,webp,svg,gif,avif}",
	{ eager: true },
);

const SUFFIX_MAP: Record<Theme, string> = {
	light: "-light",
	dark: "-dark",
};

const DEFAULT_PATH = "assets/images";

/**
 * 根据主题获取对应的图片资源。
 * 优先返回远程 URL；否则按 baseName 在本地查找（指定 extension 精确匹配，未指定则自动探测）。
 *
 * @example
 *   const avatar = getThemeImage(siteConfig.avatar, "light");
 *   <img src={avatar?.src} alt="avatar" />
 */
export function getThemeImage(
	config: ThemeImageConfig | undefined,
	theme: Theme,
): ThemeImageSource | undefined {
	if (!config) return undefined;

	const { url, baseName, path = DEFAULT_PATH, extension } = config;

	// 1. 远程 URL 优先
	if (url) {
		const remote = typeof url === "string" ? url : url[theme];
		if (remote) return { src: remote };
	}

	// 2. 本地文件查找
	if (baseName) {
		const basePath = `/src/${path}/${baseName}${SUFFIX_MAP[theme]}`;
		// 指定扩展名：精确查表（快路径）
		if (extension) {
			return themeImages[`${basePath}.${extension}`]?.default;
		}
		// 未指定：遍历预加载结果，命中首个匹配的扩展名
		const prefix = `${basePath}.`;
		for (const [key, mod] of Object.entries(themeImages)) {
			if (key.startsWith(prefix)) return mod.default;
		}
	}

	return undefined;
}

/**
 * 同时获取 light 与 dark 两套资源，便于配合 <picture> / CSS 切换使用。
 */
export function getThemeImagePair(
	config: ThemeImageConfig | undefined,
): { light?: ThemeImageSource; dark?: ThemeImageSource } {
	return {
		light: getThemeImage(config, "light"),
		dark: getThemeImage(config, "dark"),
	};
}
